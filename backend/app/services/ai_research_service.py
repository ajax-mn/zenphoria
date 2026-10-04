import os
import json
import urllib.request
import urllib.parse
import re
from typing import List, Optional
from dotenv import load_dotenv
from app.core.config import settings
from app.models.schemas import Article

# Psychological background images for newly synthesized articles
PSYCHOLOGY_THEME_IMAGES = [
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80",
]

def get_gemini_api_key() -> str:
    """Retrieve Gemini API key from settings or live environment."""
    key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not key:
        load_dotenv(override=True)
        key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY", "")
    return key.strip().strip('"').strip("'") if key else ""

def get_tavily_api_key() -> str:
    """Retrieve Tavily API key from settings or live environment."""
    key = settings.TAVILY_API_KEY or os.getenv("TAVILY_API_KEY")
    if not key:
        load_dotenv(override=True)
        key = os.getenv("TAVILY_API_KEY", "")
    return key.strip().strip('"').strip("'") if key else ""

def search_psychology_with_gemini(query: str, topic: Optional[str] = None) -> List[dict]:
    """
    Primary: Synthesize deep clinical psychology papers and articles using Google Gemini API.
    """
    api_key = get_gemini_api_key()
    if not api_key:
        return []

    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent"

    prompt = f"""You are a distinguished clinical psychologist and cognitive neuroscientist for Zenphoria.
Generate 2 to 3 high-impact, academically rigorous psychology journal articles or clinical synthesis papers for the user search query: "{query}".
{f'Focus particularly on the domain: {topic}.' if topic and topic != 'All Topics' else ''}

Format your response ONLY as a valid JSON array of objects with the exact keys:
[
  {{
    "id": "url-friendly-slug-id",
    "title": "Clinical title of the paper",
    "category": "CLINICAL INSIGHT or NEUROSCIENCE or META-ANALYSIS or CLINICAL PRACTICE",
    "topic": "Clinical Frameworks or Mindfulness or Cognitive Load",
    "readTime": "6 min read",
    "author": "Dr. Full Name, PhD / MD",
    "excerpt": "A concise 2-sentence clinical abstract summarizing the core neurobiological or behavioral finding.",
    "content": "A detailed 3 to 4 section markdown article discussing: 1. Neurobiological & Cognitive Foundations, 2. Clinical Manifestations & Allostatic Load, 3. Evidence-Based Interventions and Somatic Protocols."
  }}
]

Important: Return ONLY the raw JSON array. No markdown code fences, no explanations."""

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.3,
            "responseMimeType": "application/json"
        }
    }

    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Content-Type": "application/json",
                "x-goog-api-key": api_key
            },
            method="POST"
        )


        with urllib.request.urlopen(req, timeout=12) as response:
            data = json.loads(response.read().decode("utf-8"))
            candidates = data.get("candidates", [])
            if not candidates:
                return []
            
            raw_text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
            clean_json = re.sub(r"^```json\s*|\s*```$", "", raw_text.strip(), flags=re.MULTILINE)
            
            articles_list = json.loads(clean_json)
            if isinstance(articles_list, list):
                for i, item in enumerate(articles_list):
                    item["image"] = PSYCHOLOGY_THEME_IMAGES[i % len(PSYCHOLOGY_THEME_IMAGES)]
                    item["is_ai_generated"] = True
                return articles_list
    except Exception as e:
        print(f"[Gemini AI Research] Error generating psychology insights: {e}")
        return []

    return []

def search_psychology_with_tavily(query: str, topic: Optional[str] = None) -> List[dict]:
    """
    Fallback: Search real-time clinical psychology research and articles via Tavily API.
    """
    tavily_key = get_tavily_api_key()
    if not tavily_key:
        return []

    search_query = f"clinical psychology neuroscience research: {query}"
    if topic and topic != "All Topics":
        search_query += f" ({topic})"

    url = "https://api.tavily.com/search"
    payload = {
        "api_key": tavily_key,
        "query": search_query,
        "search_depth": "advanced",
        "include_answer": True,
        "max_results": 4
    }

    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )

        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode("utf-8"))
            results = data.get("results", [])
            answer = data.get("answer", "")

            articles = []
            
            # If Tavily synthesized a top-level clinical answer, create a spotlight brief
            if answer:
                brief_id = "tavily-brief-" + re.sub(r"[^a-zA-Z0-9]+", "-", query.lower())[:30]
                articles.append({
                    "id": brief_id,
                    "title": f"Clinical Literature Synthesis: {query.title()}",
                    "category": "TAVILY RESEARCH BRIEF",
                    "topic": topic if topic and topic != "All Topics" else "Clinical Frameworks",
                    "readTime": "4 min read",
                    "author": "Tavily Scientific Intelligence",
                    "image": PSYCHOLOGY_THEME_IMAGES[0],
                    "excerpt": answer[:220] + ("..." if len(answer) > 220 else ""),
                    "content": f"""### Executive Research Synthesis\n\n{answer}\n\n### Scientific Context\nCompiled from live biomedical and clinical psychology literature indexes regarding **{query}**.""",
                    "is_ai_generated": True
                })

            for idx, item in enumerate(results):
                slug = "tavily-" + re.sub(r"[^a-zA-Z0-9]+", "-", item.get("title", f"paper-{idx}").lower())[:35]
                raw_content = item.get("content", "")
                url_src = item.get("url", "")
                
                articles.append({
                    "id": slug,
                    "title": item.get("title", f"Psychology Research: {query}"),
                    "category": "CLINICAL RESEARCH",
                    "topic": topic if topic and topic != "All Topics" else "Clinical Frameworks",
                    "readTime": "5 min read",
                    "author": urllib.parse.urlparse(url_src).netloc or "Clinical Reviewer",
                    "image": PSYCHOLOGY_THEME_IMAGES[(idx + 1) % len(PSYCHOLOGY_THEME_IMAGES)],
                    "excerpt": raw_content[:200] + ("..." if len(raw_content) > 200 else ""),
                    "content": f"""### Overview\n\n{raw_content}\n\n### Original Source & Reference\n- Link: [{url_src}]({url_src})\n- Extracted via Tavily Clinical Search Engine.""",
                    "is_ai_generated": True
                })

            return articles
    except Exception as e:
        print(f"[Tavily Search Fallback] Error querying Tavily: {e}")
        return []

def search_psychology_articles(query: str, topic: Optional[str] = None) -> List[dict]:
    """
    Orchestrated search:
    1. Primary: Google Gemini AI synthesis
    2. Fallback: Tavily Web Search API
    """
    # 1. Try Gemini
    gemini_results = search_psychology_with_gemini(query, topic)
    if gemini_results:
        print(f"[AI Search] Successfully generated {len(gemini_results)} articles via Gemini.")
        return gemini_results

    # 2. Try Tavily Fallback
    print("[AI Search] Gemini empty/unavailable. Falling back to Tavily Search...")
    tavily_results = search_psychology_with_tavily(query, topic)
    if tavily_results:
        print(f"[AI Search] Successfully retrieved {len(tavily_results)} articles via Tavily.")
        return tavily_results

    return []
