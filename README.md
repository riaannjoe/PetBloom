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

PetBloom is an AI-powered pet care platform built around an Agentic AI architecture combining long-term memory, tool calling, contextual retrieval, streaming LLM responses, and personalized recommendation generation.

Instead of simply storing pet information, PetBloom continuously observes daily care activities, remembers important events, analyzes historical patterns, and generates intelligent recommendations that help owners provide healthier and more consistent care.

The project demonstrates how modern AI agents can combine memory, reasoning, tool use, and contextual retrieval to solve real-world problems.

## 🚀 Live Demo

🌐 Live App: https://petbloom-40612.web.app

## ❓ Problem

Pet owners often struggle to maintain consistent care routines for their pets.

Important tasks such as vaccination schedules, medication, hydration, exercise, nutrition, and symptom tracking are usually managed through scattered notes, reminders, or memory.

Most existing pet apps act only as record-keeping tools and do not understand the pet's history or provide personalized guidance.

PetBloom addresses this by creating an AI-powered companion that remembers pet information, analyzes care patterns, and proactively helps owners make better decisions.

## 💡 Solution

PetBloom acts as an intelligent pet care assistant that combines AI reasoning, long-term memory, and personalized recommendations.

The system:
- stores important pet information
- learns from daily care activities
- retrieves relevant history during conversations
- provides personalized suggestions
- helps owners maintain healthier routines
---
# 🤔 Why an AI Agent?

Traditional pet apps only store information.

PetBloom uses an AI Agent because pet care requires understanding context over time.

A normal chatbot answers based only on the current message.

PetBloom can:

- 🧠 Remember previous pet information
- 🔍 Retrieve relevant history
- 🛠️ Use tools to gather additional context
- 💭 Reason over multiple data sources
- 💡 Provide personalized recommendations

This allows PetBloom to move from passive tracking to proactive care assistance.

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
## 🤖 Agent Capabilities

PetBloom is designed as an AI Agent rather than a traditional chatbot.  
It combines memory, tool usage, contextual retrieval, and reasoning to provide personalized pet care assistance.

---

## 🧠 1. Long-Term Memory

PetBloom maintains important information about each pet and retrieves relevant details when needed.

The agent remembers:

- 🐾 Pet profile information
  - Name
  - Breed
  - Age
  - Preferences

- 🏥 Health history
  - Previous symptoms
  - Medical observations
  - Allergies
  - Vaccination records

- 🍖 Care patterns
  - Nutrition habits
  - Exercise routines
  - Owner preferences

This allows PetBloom to provide responses based on the pet's history instead of generic answers.

---

## 🛠️ 2. Tool Usage

PetBloom uses specialized tools to collect additional context and improve decision-making.

Available tools include:

### 🏥 Health Tracker
Tracks and retrieves:
- Symptoms
- Medications
- Health observations
- Medical history

### 🏃 Activity Tracker
Monitors:
- Exercise patterns
- Activity levels
- Daily routines

### 🌦️ Weather Information
Uses environmental context to provide better recommendations.

Example:
> "Since today's temperature is high, consider reducing outdoor activity and ensuring your pet has enough water."

Tools allow the agent to gather real-world information before generating recommendations.

---

## 🧩 3. Contextual Reasoning

PetBloom combines multiple sources of information before responding.

Instead of answering isolated questions, PetBloom understands patterns over time.

The agent analyzes:

Current User Query
+
Retrieved Memories
+
Pet History
+
Tool Outputs
↓
AI Reasoning
↓
Personalized Response

Example:

A decrease in activity alone may not be concerning.

However:

↓ Activity
+
↓ Water Intake
+
↓ Appetite
+
Previous Health History


may indicate that the owner should monitor the pet more carefully.

---

## 💡 4. Personalized Recommendations

After analyzing context, PetBloom generates actionable suggestions.

Recommendations can include:

- 🥗 Nutrition adjustments
- 💧 Hydration reminders
- 🏃 Activity suggestions
- 💊 Medication reminders
- 🩺 Health monitoring advice

The goal is to transform pet care from passive tracking into proactive assistance.

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
| Firebase | Deployment & Hosting |
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

<img width="1917" height="907" alt="image" src="https://github.com/user-attachments/assets/1099be44-50c9-49c7-9b96-e7a9f277f463" />
<img width="1917" height="897" alt="image" src="https://github.com/user-attachments/assets/22d5eb29-c556-4855-a573-5db0311f7ec3" />
<img width="1917" height="906" alt="image" src="https://github.com/user-attachments/assets/81773650-d8b5-4084-9e86-6e14ddb89b05" />
<img width="1917" height="891" alt="image" src="https://github.com/user-attachments/assets/43b17531-0a26-4b21-b7d6-9c137a7628e6" />
<img width="1917" height="870" alt="image" src="https://github.com/user-attachments/assets/938ea24d-c8db-47eb-9f1d-fd9a3f13627f" />
<img width="1917" height="895" alt="image" src="https://github.com/user-attachments/assets/ede68443-b557-4cf8-9e30-7e747837c6e8" />
<img width="1917" height="897" alt="image" src="https://github.com/user-attachments/assets/36405292-3bdf-4621-842b-dd43f29e491d" />



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

# 🌐 Deployment

PetBloom is deployed using Firebase Hosting.

Production URL:
https://petbloom-40612.web.app

The application is configured for public access so users and judges can interact with the AI assistant directly.

---

# 🔐 Security Considerations

PetBloom follows secure development practices:

- 🔑 API keys are stored using environment variables
- 🚫 Sensitive credentials are never committed to GitHub
- 🛡️ `.env` files are excluded using `.gitignore`
- ⚙️ Mock mode allows development without exposing production keys

---

# 🛤️ Development Journey

PetBloom started as a simple pet tracking idea.

During development, it evolved into an AI Agent system by incorporating:

- Long-term memory
- Context retrieval
- Tool usage
- Reasoning-based recommendations

The main learning was that useful AI systems are not created by simply connecting an LLM to an interface.

They require:
- relevant context
- memory
- tools
- clear responsibilities

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
## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
