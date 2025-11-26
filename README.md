# 📘 Developer Practice Challenges — Collaborative Learning Repo

Welcome to the **Developer Practice Challenges** repository!  
This space exists for a group of teammates with diverse tech stacks to **help each other grow** through practical, real-world mini-projects.

The goal is simple:

> **Strengthen our skills by designing and solving small, realistic technical challenges for one another, based on overlapping tech expertise.**

This README defines the rules, workflow, expectations, and conventions for creating and solving challenges.

---

## 🧩 Purpose

Modern engineering teams often mix developers and QA engineers with different backgrounds—frontend, backend, fullstack, and automation. This repo enables us to:

- Practice technologies we know and want to reinforce  
- Learn adjacent tech from teammates who use it daily  
- Identify individual skill gaps  
- Grow through code reviews and shared patterns  
- Build real mini-projects instead of trivial code exercises  
- Improve team-wide architecture, testing, and design skills

Challenges in this repo are **project-based**, not algorithm puzzle–based.

---

## 👥 Who This Repo Is For

Anyone on the team who wants to learn, practice, or teach:

- Frontend (React, Next.js, Zustand, Redux, CSS-in-JS, etc.)
- Backend (Node.js, Python, Java, Express, FastAPI, Spring, etc.)
- Fullstack (API + frontend together)
- Databases (SQL, NoSQL, Prisma, Mongo, Postgres, etc.)
- Testing (unit, integration, E2E)
- Infrastructure (Docker, local Kubernetes, CI/CD concepts)
- Architecture and design patterns

No matter your level or stack, you can **assign** challenges and **receive** challenges based on skill overlap.

---

# 🔗 Tech Stack Intersection Rules

To assign a challenge:

1. Every developer must declare their **primary tech stack** in `developers/your-name.md`.
2. When proposing a challenge, you must **use the intersection** of your tech stack and the target developer’s stack.
3. You *may* include **one new technology** for learning purposes, as long as:
   - It’s reasonably easy to pick up
   - It is **free and open-source**
   - It fits the challenge scope

### Example

You know: **Next.js, React, Redux, Node, TS**  
Frontend Dev knows: **React, Zustand, Styled Components**

Intersection → **React + TypeScript**  
Optional new tech for growth → **Redux** (replacing Zustand)

---

# 🧠 Challenge Requirements

Every challenge must:

### ✔ Be a **small project** (not trivial, not huge)
- Solvable within **5–10 workdays**  
- Preferably **1 week** of effort  
- Must NOT require cloud services with cost (AWS/GCP, paid APIs)

### ✔ Be real-world oriented
Focus on:
- Architecture
- Maintainability
- Reliability
- Testing
- State management
- API design
- Error handling
- UX
- Data modeling

### ✔ Be scoped clearly
Every challenge must define:
- Background / story  
- Requirements  
- Expected capabilities  
- Data model  
- Tech stack requirements  
- Constraints  
- Evaluation criteria  
- Deliverables  

### ✔ Be free & offline friendly
Only allow tech that:
- Runs locally  
- Is free and open-source  
- Requires no paid external API/services  

### ✔ Include learning goals
Examples:
- Use Redux instead of Zustand  
- Learn FastAPI  
- Build Dockerized services locally  
- Use Jest, Vitest, PyTest, or JUnit  

---

# 📁 Repo Structure

```
.
├── README.md
├── developers/
│   └── your-name.md
├── challenges/
│       └── CHALLENGE.md
├── projects/
│   └── developer-name/
│       └── project-name/
└── templates/
    ├── CHALLENGE_TEMPLATE.md
    └── DEVELOPER_PROFILE_TEMPLATE.md
```

---

# 🧑‍💻 Developer Profile Format

Each developer must add a file under `developers/`.

Example: `developers/alice.md`

```
# Alice — Developer Profile

### Primary Tech Stack
- React, Next.js
- TypeScript, Node.js
- MongoDB / NoSQL
- Auth, routing, REST APIs

### Secondary Experience
- Python basics
- Docker
- Jest unit testing

### Learning Goals
- Improve backend architecture
- Practice Redux or alternative state libraries
- Strengthen testing

### Things I Can Review / Teach
- Next.js structure
- Frontend state management patterns
- Monorepo setups
```

---

# 📤 How to Assign a Challenge

1. Identify intersection between your stack and the target dev’s stack.  
2. Choose one extra technology (optional).  
3. Write the challenge using the template folder under `challenges/`.  
4. Announce it to the dev and link to the challenge folder.

---

# 📝 How to Work on a Challenge

1. Understand the challenge and clarify doubts early.
2. Build the project on your local machine.
3. Follow the tech stack requirements & constraints.
4. Test everything.
5. When completed:

### ➡️ Submit a PR:
- **Base branch:** `main`
- **PR target folder:** `projects/{{your-name}}/{{challenge-name}}`
- **Reviewer:** the author of the challenge
- Include:
  - Screenshots
  - Videos
  - Notes or trade-offs you made
  - Instructions for running the project

---

# 🧪 Evaluation Criteria

Reviewers must evaluate based on the challenge’s declared criteria, but in general:

### 📦 Architecture & Structure
Clean, organized, understandable folders.

### 🧠 Code Quality
Readable, typed, maintainable.

### ⚙️ Correctness
Meets functional requirements.

### 🔄 State & Data Handling
Correct async handling, selectors, consistency between FE/BE.

### 🧪 Testing Quality
Unit, integration, E2E (if part of challenge).

### 🎨 UX & Accessibility (frontend)
Keyboard navigation, ARIA basics, proper disable/hide logic.

### 🔒 Security (UI- or API-level)
Do not expose unauthorized actions.

### 📚 Documentation
README + setup + clarity.

---

# 📦 Challenge Template

```
# {{ Challenge Title }}

## Background
Brief story setting the problem.

## Tech Stack Requirements
Required technologies:
- ...
Optional new learning tech:
- ...

## Expected Capabilities
1. ...
2. ...

## Functional Requirements
- ...

## Non-Functional Requirements
- Performance
- Accessibility
- Clean architecture
- Tests

## Data Model
Describe entities + relationships.

## Constraints
- Must run entirely local
- No paid services
- Complete within 1–2 weeks
- Only open-source dependencies

## Deliverables
- Working project
- README with setup instructions
- Screenshots / video demo

## Evaluation Focus
Exactly what the reviewer will look for.
```

---

# 🤝 Collaboration Philosophy

We do this to **support each other**, not to judge.

- Be kind and constructive in reviews  
- Explain reasoning, not just corrections  
- Share design patterns and best practices  
- Encourage learning new tools and approaches  
- Celebrate each completed challenge 🎉

---

# 🚀 Ready to Start?

1. Add your profile under `developers/`.
2. Read challenges or create new ones.
3. Pick a teammate and propose a challenge.
4. Build cool things together.
