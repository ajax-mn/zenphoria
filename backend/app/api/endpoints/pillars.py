from fastapi import APIRouter
from typing import List
from app.models.schemas import Pillar

router = APIRouter(prefix="/pillars", tags=["Five Pillars"])

PILLARS_DATA: List[Pillar] = [
    Pillar(
        id="identity",
        title="Identity",
        subtitle="Exploring the foundation of self, values, and the narratives that shape our personal reality.",
        icon="Fingerprint",
        tags=[
            {"title": "Core Values", "desc": "Defining principles"},
            {"title": "Self-Narrative", "desc": "Life storytelling"},
            {"title": "Authenticity", "desc": "Genuine expression"}
        ]
    ),
    Pillar(
        id="emotional-patterns",
        title="Emotional Patterns",
        subtitle="Understanding the recurring cycles of feeling and reaction to foster emotional regulation.",
        icon="CircleDot",
        tags=[
            {"title": "Regulation", "desc": "Managing states"},
            {"title": "Triggers", "desc": "Identifying origins"},
            {"title": "Resilience", "desc": "Building capacity"}
        ]
    ),
    Pillar(
        id="relational-dynamics",
        title="Relational Dynamics",
        subtitle="Navigating the complexities of interpersonal connections, boundaries, and communication.",
        icon="Users",
        tags=[
            {"title": "Boundaries", "desc": "Healthy limits"},
            {"title": "Attachment", "desc": "Connection styles"},
            {"title": "Communication", "desc": "Affective dialogue"}
        ]
    ),
    Pillar(
        id="modern-emotional-life",
        title="Modern Emotional Life",
        subtitle="Addressing the unique psychological pressures of contemporary society and technology.",
        icon="Monitor",
        tags=[
            {"title": "Burnout", "desc": "Career & stress"},
            {"title": "Digital Diet", "desc": "Media consumption"},
            {"title": "Purpose", "desc": "Meaning making"}
        ]
    ),
    Pillar(
        id="psychological-education",
        title="Psychological Education",
        subtitle="Equipping you with clinical insights and frameworks to become your own mental health advocate.",
        icon="BookOpen",
        tags=[
            {"title": "Frameworks", "desc": "Clinical models"},
            {"title": "Neuroscience", "desc": "Brain mechanics"},
            {"title": "Integration", "desc": "Applying knowledge"}
        ]
    )
]

@router.get("", response_model=List[Pillar])
async def list_pillars():
    """Retrieve all 5 psychological wellness pillars."""
    return PILLARS_DATA
