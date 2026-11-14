# Scholar AI

A collaborative academic and research platform enabling researchers to publish their work, discover publications, organize and participate in academic events, and interact with research papers using an AI-powered assistant.

---

## Key Features

* **Research Publication & Discovery:** Publish academic papers, browse work from other researchers, and engage through comments.
* **Event Management:** Announce conferences, workshops, or seminars, and register/participate in upcoming events.
* **AI Paper Assistant:** Select any uploaded research paper to generate concise summaries or ask specific questions about its content (Q&A).
* **Personalized Recommendations:** Suggests relevant papers and content to researchers using a Two-Tower neural retrieval architecture paired with FAISS vector similarity search.
* **Automated Content Moderation:** Real-time English profanity filtering to verify comments before publication.

---

## System Architecture

The repository is organized into a modular microservices-style architecture:

```text
├── angular/                   # Angular web application
├── paper/                    # Spring Boot core REST API & business logic
├── recommendation-service/ # Two-Tower model + FAISS similarity search
└── swear-checker-service/  # English profanity detection service
