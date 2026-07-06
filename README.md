# 🐾 PetBloom

> **An AI-powered Pet Care Concierge that helps pet owners track health, remember important events, and receive personalized care recommendations.**

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-purple?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38BDF8?logo=tailwindcss)
![Zustand](https://img.shields.io/badge/Zustand-State-orange)
![Gemini](https://img.shields.io/badge/Google-Gemini-blue?logo=google)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

---

## 📖 Overview

PetBloom is an AI-powered pet care platform built around an Agentic AI architecture combining long-term memory, tool calling, contextual retrieval, streaming LLM responses, and rule-based recommendations.

Instead of simply storing pet information, PetBloom continuously observes daily care activities, remembers important events, analyzes historical patterns, and generates intelligent recommendations that help owners provide healthier and more consistent care.

The project demonstrates how modern AI agents can combine memory, reasoning, tool use, and contextual retrieval to solve real-world problems.

## 🚀 Live Demo

🌐 Live App: https://your-deployment-url

---

# ✨ Features

## 🤖 AI Concierge

- AI-powered pet assistant
- Context-aware conversations
- Live Gemini streaming responses
- Markdown support
- Suggested follow-up questions
- Rich AI response cards

---

## 🐶 Pet Management

- Multiple pet profiles
- Breed information
- Medical history
- Vaccination reminders
- Lifestyle goals
- Food inventory tracking

---

## 📊 Care Dashboard

- Daily care checklist
- Bloom Progress tracker
- Quick activity logging
- Upcoming reminders
- Weather-aware insights
- Recent activity timeline

---

## 🧠 Long-Term Memory

PetBloom doesn't simply answer questions.

It remembers:

- allergies
- symptoms
- nutrition habits
- exercise history
- owner preferences
- vaccination schedules

These memories are selectively retrieved to improve future AI responses.

---

## 📈 Weekly Analytics

- Wellness score
- Habit heatmap
- Water trends
- Exercise trends
- Weight tracking
- AI-generated care summaries

---

## ❤️ Health Tracking

Track:

- meals
- hydration
- exercise
- grooming
- symptoms
- medications
- stool & urine logs

Everything contributes to personalized recommendations.

---

## 🎨 Modern UI

- Responsive design
- Tailwind CSS v4
- Dark mode
- Mobile navigation
- Glassmorphism cards
- Animated transitions
- Loading animations
- Accessible components

---

# 🏗️ AI Agent Architecture

```
                   User
                     │
                     ▼
              Chat Interface
                     │
                     ▼
             Agent Executor
                     │
     ┌───────────────┼────────────────┐
     ▼               ▼                ▼
 Tool Registry   Memory Search   Prompt Builder
     │               │                │
     └───────────────┼────────────────┘
                     ▼
             Gemini API / Mock AI
                     │
                     ▼
            Streaming AI Response
                     │
                     ▼
              Recommendation Engine
                     │
                     ▼
                 Dashboard
```

---

# 🧩 Agent Workflow

PetBloom follows an agentic workflow inspired by modern AI systems.

```
Observe
      ↓
Remember
      ↓
Retrieve Context
      ↓
Reason
      ↓
Generate Response
      ↓
Recommend Actions
      ↓
Update Memory
```

---

# 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React | Frontend |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Tailwind CSS v4 | Styling |
| Zustand | State Management |
| React Router | Routing |
| Gemini API | AI Responses |
| Canvas Confetti | Celebration Effects |

---

# 📂 Project Structure

```
src/
├── app/
├── assets/
├── components/
│   ├── layout/
│   └── ui/
├── config/
├── data/
├── features/
│   ├── auth/
│   ├── chat/
│   ├── dashboard/
│   ├── error/
│   ├── exercise/
│   ├── health/
│   ├── hygiene/
│   ├── landing/
│   ├── nutrition/
│   ├── onboarding/
│   ├── profile/
│   ├── reports/
│   └── settings/
├── layouts/
├── lib/
├── pages/
├── services/
│   ├── agent/
│   ├── api/
│   ├── mock/
│   ├── aiService.ts
│   ├── authService.ts
│   ├── geminiService.ts
│   ├── index.ts
│   ├── mapsService.ts
│   ├── petService.ts
│   ├── recommendationEngine.ts
│   └── weatherService.ts
├── store/
├── stores/
├── types/
├── utils/
├── App.css
├── App.tsx
├── index.css
├── main.tsx
└── vite-env.d.ts
```

---

# 🚀 Getting Started

Clone the repository

```bash
git clone https://github.com/riaannjoe/PetBloom.git
```

Move into the project

```bash
cd PetBloom
```

Install dependencies

```bash
npm install
```

Run locally

```bash
npm run dev
```

Build production version

```bash
npm run build
```

Preview production build

```bash
npm run preview
```

---

# 🔑 Environment Variables

Create a `.env` file.

```env
VITE_GEMINI_API_KEY=YOUR_API_KEY
VITE_USE_MOCK_API=true
VITE_API_BASE_URL=http://localhost:3001/api
```

---

# 📸 Screenshots

> Replace these with actual screenshots before submission.

- Landing Page
- Dashboard
- AI Chat
- Reports
- Pet Profile
- Analytics
- Onboarding

---

# 🌟 Highlights

✅ AI Concierge

✅ Long-Term Memory

✅ Recommendation Engine

✅ Context Retrieval

✅ Live Gemini Streaming

✅ Weekly Analytics

✅ Multi-Pet Support

✅ Modern Responsive UI

---

# 🚧 Future Improvements

- Voice conversations
- Camera-based pet health detection
- Smart collar integration
- Wearable device support
- Veterinary portal
- Cloud synchronization
- Push notifications
- AI anomaly detection
- Medication reminder automation

---

# 🏆 Kaggle AI Agents Capstone

This project was created as part of the **Google × Kaggle AI Agents: Intensive Vibe Coding Capstone**.

It demonstrates practical applications of:

- AI Agents
- Long-Term Memory
- Tool Calling
- Context Retrieval
- Streaming LLM Responses
- Recommendation Systems
- Modern Frontend Architecture

---

# 👩‍💻 Author

**Ria Ann Joe**

GitHub: https://github.com/riaannjoe

---
