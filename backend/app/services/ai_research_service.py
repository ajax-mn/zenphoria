import json
import urllib.request
import urllib.parse
import re
from typing import List, Optional
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

def search_psychology_with_gemini(query: str, topic: Optional[str] = None) -> List[dict]:
    """
    Synthesize deep clinical psychology papers and articles using Google Gemini API.
    """
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        return []

    # Choose model
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"

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
            headers={"Content-Type": "application/json"},
            method="POST"
        )

        with urllib.request.urlopen(req, timeout=12) as response:
            data = json.loads(response.read().decode("utf-8"))
            
            # Extract text from Gemini response
            candidates = data.get("candidates", [])
            if not candidates:
                return []
            
            raw_text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
            # Clean possible markdown wrapping if any
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
