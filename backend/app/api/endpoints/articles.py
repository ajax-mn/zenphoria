from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.models.schemas import Article

router = APIRouter(prefix="/articles", tags=["Journal & Publications"])

ARTICLES_DATA: List[Article] = [
    Article(
        id="architecture-of-empathy",
        title="The Architecture of Empathy in High-Stress Environments",
        category="Featured Insight",
        topic="Clinical Frameworks",
        readTime="7 min read",
        author="Dr. Alistair Vance",
        image="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80",
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
        image="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80",
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
        image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
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
        image="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
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
        image="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
        excerpt="Examining the foundational triggers of modern anxiety through a clinical lens, moving beyond symptom management to radical repair.",
        content="""Rather than treating anxiety as an unexpected intruder to be suppressed, modern clinical frameworks view anxiety as an internal dashboard indicator signaling structural misalignment in values, workload, or relational safety."""
    )
]

@router.get("", response_model=List[Article])
async def get_articles(
    topic: Optional[str] = Query(None, description="Filter by topic"),
    search: Optional[str] = Query(None, description="Search keyword in title or excerpt")
):
    """Retrieve journal articles with optional topic and search filtering."""
    results = ARTICLES_DATA
    if topic and topic != "All Topics":
        results = [a for a in results if a.topic.lower() == topic.lower()]
    if search:
        s = search.lower()
        results = [a for a in results if s in a.title.lower() or s in a.excerpt.lower() or s in a.content.lower()]
    return results

@router.get("/{article_id}", response_model=Article)
async def get_article(article_id: str):
    """Retrieve a single article by ID."""
    for a in ARTICLES_DATA:
        if a.id == article_id:
            return a
    raise HTTPException(status_code=404, detail="Article not found")
