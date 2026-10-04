from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.models.schemas import Article
from app.services.ai_research_service import search_psychology_articles, get_gemini_api_key, get_tavily_api_key

router = APIRouter(prefix="/articles", tags=["Journal & Publications"])

# Global in-memory dynamic articles store
DYNAMIC_ARTICLES: dict[str, Article] = {}

ARTICLES_DATA: List[Article] = [
    Article(
        id="architecture-of-empathy",
        title="The Architecture of Empathy in High-Stress Environments",
        category="Featured Insight",
        topic="Clinical Frameworks",
        readTime="7 min read",
        author="Dr. Alistair Vance",
        image="https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?auto=format&fit=crop&w=1200&q=80",
        excerpt="Examining how cognitive overload suppresses affective response, and practical behavioral interventions to maintain relational warmth under immense performance pressure.",
        content="""When high-performing leaders operate within environments characterized by unrelenting ambiguity and high cognitive stakes, affective empathy is often the first psychological resource to degrade.

In clinical psychology, this phenomenon is not a failure of character, but rather a protective biological downregulation. When the prefrontal cortex is consumed by analytical problem-solving and acute threat assessment, autonomic prioritization shifts resources toward executive survival and away from socio-emotional resonance.

### The Mechanism of Empathetic Erosion
1. Cognitive Load Saturation: Working memory capacity is strictly bounded.
2. Autonomic State Shifting: Chronic cortisol elevation keeps the amygdala in a state of vigilant reactivity.

### Rebuilding Somatic Attunement
- Micro-Transitions: 90-second physiological recalibrations between meetings.
- Affective Labeling: Explicit naming of somatic states.
- Inquiry Before Assertion: Replacing directive reaction with curiosity framing."""
    ),
    Article(
        id="nervous-system-burnout",
        title="Recalibrating the Nervous System Post-Burnout",
        category="CLINICAL PRACTICE",
        topic="Clinical Frameworks",
        readTime="5 min read",
        author="Dr. Clara Lin",
        image="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
        excerpt="Practical protocols for restoring autonomic balance after prolonged periods of hyper-arousal and chronic professional exhaustion.",
        content="""Burnout is fundamentally a physiological state of nervous system exhaustion resulting from extended allostatic load. When recovery periods are omitted, the parasympathetic ventral vagal complex fails to engage spontaneously."""
    ),
    Article(
        id="psychological-safety-remote",
        title="Constructing Psychological Safety in Remote Teams",
        category="TEAM SCIENCE",
        topic="Cognitive Load",
        readTime="8 min read",
        author="Marcus Thorne, PhD",
        image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
        excerpt="How physical distance alters interpersonal dynamics and strategies for maintaining trust, vulnerability, and intellectual candor across asynchronous teams.",
        content="""In distributed environments, the absence of micro-expressions and organic watercooler interactions creates an interpretative vacuum. Humans naturally fill ambiguity with threat hypotheses."""
    ),
    Article(
        id="introspection-paradox",
        title="The Introspection Paradox",
        category="MINDFULNESS",
        topic="Mindfulness",
        readTime="4 min read",
        author="Dr. E. Frazier",
        image="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80",
        excerpt="Examining when self-reflection becomes rumination, and how to structure healthy contemplative inquiry without cognitive spiral.",
        content="""Self-reflection is hailed as the cornerstone of personal growth. Yet, without clinical containment, introspective inquiry frequently degenerates into unproductive rumination."""
    ),
    Article(
        id="architecture-of-anxiety",
        title="The Architecture of Anxiety: A Structural Approach",
        category="CLINICAL INSIGHT",
        topic="Clinical Frameworks",
        readTime="8 min read",
        author="Dr. E. Frazier",
        image="https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=800&q=80",
        excerpt="Examining the foundational triggers of modern anxiety through a clinical lens, moving beyond symptom management to radical repair.",
        content="""Rather than treating anxiety as an unexpected intruder to be suppressed, modern clinical frameworks view anxiety as an internal dashboard indicator signaling structural misalignment in values, workload, or relational safety."""
    )
]

@router.get("", response_model=List[Article])
async def get_articles(
    topic: Optional[str] = Query(None, description="Filter by topic"),
    search: Optional[str] = Query(None, description="Search keyword in title or excerpt"),
    use_ai: Optional[bool] = Query(False, description="Whether to trigger Gemini AI deep synthesis")
):
    """Retrieve journal articles with optional topic, search filtering, and Gemini AI synthesis."""
    # Combine static and dynamically synthesized articles
    all_articles = ARTICLES_DATA + list(DYNAMIC_ARTICLES.values())
    results = all_articles

    if topic and topic != "All Topics":
        results = [a for a in results if a.topic.lower() == topic.lower()]
    
    if search:
        s = search.lower().strip()
        matched = [a for a in results if s in a.title.lower() or s in a.excerpt.lower() or s in a.content.lower()]
        
        # If user explicitly requested AI synthesis or search results are sparse, trigger AI Search (Gemini -> Tavily)
        has_ai_provider = bool(get_gemini_api_key() or get_tavily_api_key())
        if (use_ai or len(matched) == 0) and has_ai_provider and len(s) >= 3:
            try:
                ai_results = search_psychology_articles(query=search, topic=topic)
                for item in ai_results:
                    art = Article(**item)
                    DYNAMIC_ARTICLES[art.id] = art
                    if art.id not in [m.id for m in matched]:
                        matched.insert(0, art)
            except Exception as err:
                print(f"[AI Search Router] Query skipped: {err}")
        
        results = matched

    return results

@router.get("/ai-search", response_model=List[Article])
async def ai_search_articles(
    query: str = Query(..., min_length=2, description="Psychology search query"),
    topic: Optional[str] = Query(None, description="Optional topic filter")
):
    """Direct AI synthesis endpoint for psychology queries with Tavily fallback."""
    if not (get_gemini_api_key() or get_tavily_api_key()):
        # Fallback to local search if neither key is configured
        return await get_articles(topic=topic, search=query, use_ai=False)

    ai_results = search_psychology_articles(query=query, topic=topic)
    parsed = []
    for item in ai_results:
        art = Article(**item)
        DYNAMIC_ARTICLES[art.id] = art
        parsed.append(art)
    return parsed


@router.get("/{article_id}", response_model=Article)
async def get_article(article_id: str):
    """Retrieve a single article by ID."""
    if article_id in DYNAMIC_ARTICLES:
        return DYNAMIC_ARTICLES[article_id]
    for a in ARTICLES_DATA:
        if a.id == article_id:
            return a
    raise HTTPException(status_code=404, detail="Article not found")

