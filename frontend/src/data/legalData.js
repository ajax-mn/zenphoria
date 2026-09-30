/**
 * Structured Legal, Ethical Governance, Privacy, Terms, Support, and Career Policies
 * for Zenphoria Psychological Wellness & Clinical Education.
 * Aligned with APA Ethical Guidelines, Telehealth Standards, GDPR, DPDP Act 2023, and HIPAA Data Principles.
 */

export const EMERGENCY_CONTACTS = [
  {
    region: "India (National Tele-MANAS)",
    number: "14416",
    secondary: "1800-891-4416",
    desc: "24x7 Government of India National Mental Health Helpline (Toll-Free in all languages)",
    tag: "Toll-Free 24/7",
    action: "tel:14416"
  },
  {
    region: "India (Vandrevala Foundation)",
    number: "+91 9999 666 555",
    secondary: null,
    desc: "Free 24/7 professional clinical crisis intervention and emotional counseling",
    tag: "24/7 Clinical Support",
    action: "tel:+919999666555"
  },
  {
    region: "India (AASRA Prevention)",
    number: "+91 98204 66726",
    secondary: null,
    desc: "Confidential emotional support and crisis suicide prevention hotline",
    tag: "Helpline",
    action: "tel:+919820466726"
  },
  {
    region: "United States (988 Lifeline)",
    number: "988",
    secondary: "Text 988",
    desc: "Free 24/7 nationwide suicide & crisis lifeline via phone call or SMS text",
    tag: "USA Toll-Free",
    action: "tel:988"
  },
  {
    region: "UK & Europe (Crisis Text Line)",
    number: "Text SHOUT to 85258",
    secondary: null,
    desc: "24/7 free, confidential crisis text support in the United Kingdom",
    tag: "UK Text Service",
    action: "sms:85258"
  }
];

export const CAREER_POSITIONS = [
  {
    id: "clinical-psychologist",
    title: "Licensed Clinical Psychologist / Counselor",
    type: "Remote Consultation Practice",
    commitment: "Flexible Modular Schedule (10–25 hrs/week)",
    department: "Clinical Practice",
    badge: "Actively Hiring",
    description: "Conduct structured 50-minute virtual psycho-educational and emotional health consultations for adult clients seeking cognitive clarity, stress reduction, and relational awareness.",
    requirements: [
      "Master's, M.Phil, Psy.D, or Ph.D in Clinical or Counseling Psychology from an accredited institution.",
      "Active registration with relevant licensing bodies (e.g. RCI in India, APA / State Board equivalent globally).",
      "Minimum 2+ years of clinical consultation or psychotherapeutic experience.",
      "Proficiency with telehealth technology and evidence-based frameworks (CBT, ACT, Somatic & Mindfulness models)."
    ],
    perks: [
      "Zero administrative burden: automated scheduling, Meet links, and client management handled by platform",
      "Competitive per-session honorarium paid bi-weekly",
      "Access to interdisciplinary peer consultation and clinical case supervision circles"
    ]
  },
  {
    id: "science-writer",
    title: "Behavioral Science & Mental Health Researcher",
    type: "Contract / Remote",
    commitment: "Project-Based",
    department: "Content & Research",
    badge: "Open Role",
    description: "Author high-impact, evidence-informed clinical essays, frameworks, and psycho-educational guides for the Zenphoria Journal and Five Pillars curriculum.",
    requirements: [
      "Postgraduate qualification in Neuroscience, Psychology, or Cognitive Behavioral Sciences.",
      "Exceptional academic-to-accessible translation ability with rigorous citation standards.",
      "Portfolio of published mental health or scientific literature."
    ],
    perks: [
      "Featured author credit on official platform publications",
      "Flexible asynchronous workflow with comprehensive editorial support"
    ]
  },
  {
    id: "client-experience",
    title: "Clinical Operations & Client Experience Lead",
    type: "Remote (IST Timezone)",
    commitment: "Full-Time or Part-Time",
    department: "Operations",
    badge: "New Position",
    description: "Coordinate intake workflows, support client onboarding, manage scheduling continuity, and ensure high-touch care across all telehealth touchpoints.",
    requirements: [
      "Background in Healthcare Administration, Psychology, or Premium Client Concierge.",
      "Empathetic, clear written communication with meticulous attention to detail.",
      "Experience with modern workspace tools and customer support platforms."
    ],
    perks: [
      "Direct collaboration with clinical leadership",
      "Professional wellness stipend and learning allowance"
    ]
  }
];

export const SUPPORT_FAQS = [
  {
    question: "Where do I access my Google Meet video link?",
    answer: "Your unique, encrypted Google Meet link is generated automatically upon booking and displayed on your confirmation screen. It is also emailed to you immediately and re-sent as an automated reminder 15 minutes prior to your session start time."
  },
  {
    question: "How do I reschedule or adjust my consultation time?",
    answer: "You may reschedule your consultation up to 24 hours prior to the session start time by emailing support or contacting our concierge desk via WhatsApp with your Reference ID. We will gladly adjust your calendar slot."
  },
  {
    question: "Are consultations covered by health insurance or corporate wellness?",
    answer: "Depending on your corporate wellness policy or private insurer, invoices containing professional provider registration numbers and clinical tax receipts can be provided upon request by contacting support."
  },
  {
    question: "What technology or equipment do I need for my session?",
    answer: "A stable internet connection, a quiet and private space, and a computer or mobile device with a working camera and microphone. Google Meet runs directly in your web browser with no download required."
  }
];

export const LEGAL_SECTIONS = {
  ethics: {
    id: "ethics",
    title: "Clinical Ethics & Governance",
    subtitle: "Our unwavering commitment to professional integrity, clinical containment, and client welfare.",
    lastUpdated: "January 2026",
    badge: "Ethical Standards",
    icon: "ShieldCheck",
    clauses: [
      {
        number: "01",
        title: "Scope of Practice & Psycho-Educational Demarcation",
        badge: "Essential Scope",
        summary: "Clear distinction between structured psycho-education and inpatient hospital emergency care.",
        details: [
          "Zenphoria operates as an advanced clinical wellness and psycho-educational consultation platform. Our structured modular sessions, reflective frameworks, and psycho-educational materials are designed to enhance emotional regulation, relational awareness, cognitive resilience, and executive clarity.",
          "Zenphoria services do not constitute emergency psychiatric intervention, crisis triage, or inpatient clinical hospital care. If you are experiencing acute psychiatric distress, suicidal ideation, or severe self-harm urges, you must immediately contact emergency services or dedicated national crisis lifelines."
        ]
      },
      {
        number: "02",
        title: "Confidentiality & Statutory Non-Disclosure Exceptions",
        badge: "Strict Privacy",
        summary: "Intake data and consultation dialogues are held in strict clinical confidentiality.",
        details: [
          "Information shared during intake assessments, video sessions, and written reflections is held in strict professional confidence under APA and national psychological ethical standards.",
          "Exceptions to confidentiality exist strictly and solely where mandated by law:",
          "• Verifiable threat of imminent physical harm or loss of life to self or others.",
          "• Reasonable suspicion of child, elder, or dependent adult abuse, neglect, or exploitation.",
          "• Mandatory subpoena or court order issued by a competent judicial court of law."
        ]
      },
      {
        number: "03",
        title: "Practitioner Standards & Prohibition of Dual Relationships",
        badge: "Practitioner Code",
        summary: "Verified postgraduate credentials with strict ethical conduct guidelines.",
        details: [
          "All Zenphoria practitioners hold recognized postgraduate clinical psychology, counseling, or behavioral science credentials (M.Phil / Ph.D / Psy.D) and maintain active registration with appropriate regulatory authorities.",
          "Practitioners strictly prohibit dual relationships, financial conflicts of interest, and exploitation in any therapeutic, personal, or commercial dimension."
        ]
      },
      {
        number: "04",
        title: "Informed Consent & Voluntary Participation",
        badge: "Client Autonomy",
        summary: "Clients retain complete autonomy over their consultation journey at all stages.",
        details: [
          "Participation in Zenphoria consultations is entirely voluntary. Clients have the right to decline specific exercises, request alternative modalities, or discontinue sessions at any stage without prejudice.",
          "Prior to commencing structured modular series, clients receive clear guidance on session duration (50 mins), goals, and behavioral integration practices."
        ]
      }
    ]
  },

  privacy: {
    id: "privacy",
    title: "Privacy Policy & Data Protection",
    subtitle: "Transparent disclosure of how your personal, consultation, and technical metadata is secured.",
    lastUpdated: "January 2026",
    badge: "GDPR & DPDP Compliant",
    icon: "Lock",
    clauses: [
      {
        number: "01",
        title: "Information We Collect & Lawful Processing Bases",
        badge: "Data Categories",
        summary: "We collect only minimal necessary data to schedule and deliver consultation services.",
        details: [
          "• Identity & Contact Details: Full name, verified email address, contact phone, and timezone.",
          "• Consultation Intake Preferences: Primary focus area (e.g. Stress & Anxiety, Relational Dynamics), cadence preferences, and optional reflection notes.",
          "• Technical & Session Metadata: Booking reference IDs, Google Meet conferencing identifiers, automated email delivery timestamps, and encrypted IP logs."
        ]
      },
      {
        number: "02",
        title: "Zero-Data-Selling Guarantee & Commercial Independence",
        badge: "Zero Commercialization",
        summary: "We never monetize, sell, or trade client personal information or clinical notes.",
        details: [
          "Zenphoria operates under a strict Zero-Data-Selling policy. We NEVER sell, rent, monetize, or trade client personal information, intake notes, or behavioral diagnostics to advertisers, data brokers, or external commercial third parties.",
          "Your data is used exclusively to facilitate your scheduled sessions and deliver platform notifications."
        ]
      },
      {
        number: "03",
        title: "Technical Security & Encryption Standards",
        badge: "AES-256 & TLS 1.3",
        summary: "State-of-the-art encryption across databases, cloud endpoints, and video transmissions.",
        details: [
          "• Data in Transit: All API transmissions, scheduling requests, and notifications are protected with modern TLS 1.3 encryption.",
          "• Data at Rest: Databases are encrypted using industry-standard AES-256 protocols on secure PostgreSQL infrastructure.",
          "• Video Security: Video consultations utilize Google Meet's enterprise infrastructure with peer encryption and zero permanent session video recording."
        ]
      },
      {
        number: "04",
        title: "Your Data Subject Rights (GDPR & DPDP Act 2023)",
        badge: "Data Sovereignty",
        summary: "Full rights to access, export, rectify, or completely erase your personal records.",
        details: [
          "• Right to Erasure (Right to Be Forgotten): You may request the complete purging of your booking history and contact details from our database at any time.",
          "• Right to Access & Portability: Request an export of all personal data held in association with your email.",
          "• Right to Rectification: Correct or update any inaccurate personal demographic details.",
          "To exercise your rights, contact our Data Protection Officer at privacy@thezenphoria.com."
        ]
      }
    ]
  },

  terms: {
    id: "terms",
    title: "Terms of Service & Consultation Agreement",
    subtitle: "The legal terms and mutual agreements governing consultations and platform usage.",
    lastUpdated: "January 2026",
    badge: "Legally Binding",
    icon: "FileText",
    clauses: [
      {
        number: "01",
        title: "Platform Engagement & Age Eligibility",
        badge: "Eligibility",
        summary: "Requirements for booking and utilizing Zenphoria services.",
        details: [
          "By accessing the Zenphoria platform (thezenphoria.com) or reserving a consultation slot, you agree to comply with and be legally bound by these Terms of Service.",
          "Clients must be at least 18 years of age or have verified parental/legal guardian consent to participate in psychological wellness consultations."
        ]
      },
      {
        number: "02",
        title: "Punctuality, Rescheduling & Cancellation Policy",
        badge: "24-Hour Policy",
        summary: "Clear guidelines regarding appointment timeliness and slot allocation.",
        details: [
          "• Punctuality: Consultations begin promptly at the scheduled time via the provided Google Meet link. Late arrivals may reduce session duration to preserve subsequent appointments.",
          "• 24-Hour Rescheduling: You may reschedule your consultation up to 24 hours prior to the scheduled start time at no penalty.",
          "• Late Cancellations & No-Shows: Cancellations made with less than 12 hours notice or unnotified absences may result in forfeiture of the reserved appointment slot to respect practitioner scheduling."
        ]
      },
      {
        number: "03",
        title: "Video Consultation Protocol & Anti-Recording Policy",
        badge: "Strict Conduct",
        summary: "Preserving privacy and mutual trust during virtual consultation meetings.",
        details: [
          "• Private Environment: Clients must join sessions from a quiet, secure, private location free from unauthorized third parties.",
          "• Absolute Prohibition of Recording: Audio, video, or screen recording of consultation meetings by either client or practitioner without explicit prior written mutual consent is strictly prohibited.",
          "• Respectful Engagement: Practitioners reserve the right to immediately terminate a session in the event of abusive, threatening, or severely disruptive conduct."
        ]
      },
      {
        number: "04",
        title: "Intellectual Property & Intellectual Asset Protection",
        badge: "IP Rights",
        summary: "Ownership of the Five Pillars frameworks, diagnostic models, and clinical literature.",
        details: [
          "All proprietary frameworks, visual models, psycho-educational articles, and curriculum materials published across the Zenphoria platform remain the exclusive intellectual property of Zenphoria.",
          "Materials may not be reproduced, republished, or commercialized without explicit written permission."
        ]
      }
    ]
  },

  support: {
    id: "support",
    title: "Client Care & Support Desk",
    subtitle: "Immediate assistance with scheduling, technical access, invoicing, and clinical care.",
    lastUpdated: "Active Support",
    badge: "Direct Helpdesk",
    icon: "Headphones"
  },

  careers: {
    id: "careers",
    title: "Careers & Clinical Fellowship",
    subtitle: "Join our interdisciplinary collective of licensed psychologists, researchers, and educators.",
    lastUpdated: "Q1 2026",
    badge: "Fellowship & Practice",
    icon: "Briefcase"
  }
};
