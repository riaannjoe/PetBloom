1. Project Overview

Project Name:
PetBloom

Tagline:
Helping Every Pet Bloom

Description:

PetBloom is an AI-powered pet care concierge that helps pet owners manage every aspect of their pet's life—from nutrition and health to hygiene, training, travel, and emergency preparedness.

The application should feel warm, friendly, trustworthy, modern, and premium. The branding should reflect wellness, growth, and care rather than a clinical healthcare application.

2. Goal

The goal is not to build a simple tracker.

The AI should:

Remember the pet's history.
Analyze trends.
Generate reminders.
Create schedules.
Answer pet-care questions.
Provide personalized recommendations.
3. Target Users
First-time pet owners
Busy pet owners
Families with pets
People managing multiple pets
4. Core AI Agent Capabilities

The AI agent should be able to:

Observe

Read user logs.

Remember

Maintain pet history.

Reason

Identify trends and abnormal behavior.

Plan

Generate daily schedules.

Recommend

Provide personalized advice.

Summarize

Generate weekly health summaries.

5. Modules
Dashboard

Features:

Today's schedule
Upcoming reminders
Health alerts
Food inventory
AI insights
Pet Profile

Store:

Name
Photo
Breed
Age
Weight
Allergies
Medical conditions
Medications
Vet details
Nutrition

Track:

Meals
Water
Treats
Food inventory

AI:

Food prediction
Water analysis
Reorder reminders
Health

Track:

Weight
Vaccinations
Medications
Symptoms
Behaviour
Urine & Stool Monitor

Track:

Urine:

Frequency
Color
Difficulty

Stool:

Frequency
Consistency
Color
Notes

AI analyzes trends.

Exercise

Track:

Walks
Running
Playtime

Weather-aware recommendations.

Hygiene

Track:

Bath
Grooming
Brushing
Nail trimming
Paw cleaning
Dental care
Training

AI coach for:

Potty training
Barking
Commands
Leash training
Travel

Generate:

Packing checklist
Pet sitter planning
Travel reminders
Emergency

Provide:

First aid checklist
Emergency contacts
Nearby vet information
AI Chat

Users can ask natural-language questions about their pet and receive personalized responses based on the pet's profile and history.

Reports

Generate:

Weekly summary
Health trends
Missed tasks
Exercise report
Vaccination status


MVP Priority

Phase 1 (Capstone MVP)


✅ Nutrition

✅ Health

✅ Exercise

✅ Hygiene

✅ Landing Page

✅ Dashboard

✅ Pet Profile

✅ AI Concierge

✅ Daily Planner

✅ Health Logs

✅ Weekly Bloom Report


PetBloom Implementation Plan & Architecture Design
PetBloom is an AI-powered pet care concierge that helps pet owners manage nutrition, health, hygiene, training, travel, and emergency preparedness. It is designed to act as an active, reasoning, and context-aware agent that remembers pet history, analyzes patterns, generates schedules, and provides personalized recommendations.

This document lays out the comprehensive system architecture, database schema, API design, folder structure, user flows, and roadmap.

User Review Required
IMPORTANT

Core Tech Stack Selection: We plan to use Next.js (App Router, TypeScript) for a modern, full-stack, type-safe architecture. Next.js handles server rendering, client-side routing, and API routes out-of-the-box.

Vanilla CSS Design System: In accordance with system guidelines, we will use Vanilla CSS with CSS Modules to build a highly tailored, custom design system. We will define central CSS variables (for colors, dark/light modes, premium gradients, typography) in a global variables file to ensure a premium, modern aesthetic without relying on Tailwind.

Database & ORM: We propose Prisma ORM with SQLite for local development (and standard compatibility with PostgreSQL for production), as it provides clean schemas, auto-generated migrations, and full type safety.

1. Overall System Architecture
PetBloom will follow a modular, full-stack architecture that encapsulates state, logs, AI reasoning, and proactive alerting.

Mermaid diagram
2. Frontend Architecture
The frontend is built on React + TypeScript + Next.js App Router. It is structured for rapid state updates, smooth transitions, and modular rendering.

Design Tokens: Defined in /src/styles/variables.css containing primary colors (e.g. Sage Green, Blossom Rose, Warm Cream, Deep Slate), dark mode variables, shadows, transitions, and typography (Outfit & Inter fonts).
State Management:
Zustand: For simple client global states, e.g., activePetId, sidebarExpanded, and currentTheme.
TanStack Query (React Query): For caching server logs, profile data, reminders, and inventory levels. Automatically triggers background refetches when the user logs new data.
AI Chat Component: Implements streaming chat (using the Fetch ReadableStream API) with support for markdown, contextual warning callouts, and auto-generated action suggestion chips (e.g., "Log current stool color", "Add medication schedule").
3. Backend & AI Agent Architecture
The AI Agent operates on a cyclic Observe-Remember-Reason-Plan-Act-Reflect lifecycle:

Observe: When a user posts a log (e.g., food, water, stool, symptom), the system triggers an asynchronous agent hook.
Remember: All logs are saved as structured records. Key anomalous observations are stored in a special MemoryLog table to build a long-term context timeline.
Reason: The engine compares log data against configured veterinary safety thresholds (e.g., stool consistency score, consecutive missed meals, water drop below target). It also runs LLM-based logic for symptom-behavior warning classification.
Plan: Schedules daily tasks (feeding window, hygiene, walking reminders) based on age, breed, and recent activity.
Act: Surfaces real-time alerts on the dashboard and delivers actionable recommendations through the Chat interface.
Reflect: Every 7 days, a cron task calls the Reflector service to analyze the week's logs and save a structured WeeklyReport showing progress, alerts, and trend charts.
4. Database Schema (Prisma)
Here is the proposed Prisma Schema to model the entire MVP ecosystem:

prisma

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
generator client {
  provider = "prisma-client-js"
}
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  pets      Pet[]
}
model Pet {
  id                String            @id @default(uuid())
  userId            String
  user              User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  name              String
  photoUrl          String?
  breed             String
  birthday          DateTime
  weight            Float             // In kg/lbs
  allergies         String?           // Comma-separated or JSON
  medicalConditions String?           // Comma-separated or JSON
  medications       String?           // Comma-separated or JSON
  vetDetails        String?           // Name, number, clinic
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
  logs              PetLog[]
  foodInventory     FoodInventory[]
  reminders         Reminder[]
  scheduleTasks     ScheduleTask[]
  weeklyReports     WeeklyReport[]
  chatMessages      ChatMessage[]
  memoryLogs        MemoryLog[]
}
enum LogType {
  NUTRITION
  WATER
  STOOL_URINE
  HEALTH
  HYGIENE
  EXERCISE
  TRAINING
}
model PetLog {
  id        String   @id @default(uuid())
  petId     String
  pet       Pet      @relation(fields: [petId], references: [id], onDelete: Cascade)
  type      LogType
  timestamp DateTime @default(now())
  data      String   // JSON blob containing log parameters (e.g. foodQty, consistency, duration, notes)
}
model FoodInventory {
  id               String   @id @default(uuid())
  petId            String
  pet              Pet      @relation(fields: [petId], references: [id], onDelete: Cascade)
  foodName         String
  currentQty       Float    // Current weight in kg/lbs
  thresholdQty     Float    // Auto-reorder alert threshold
  dailyConsumption Float    // Est. daily eating qty
  updatedAt        DateTime @updatedAt
}
enum ReminderType {
  FOOD
  MEDICINE
  VACCINATION
  HYGIENE
  TRAVEL
}
enum ReminderStatus {
  PENDING
  COMPLETED
  MISSED
}
model Reminder {
  id          String         @id @default(uuid())
  petId       String
  pet         Pet            @relation(fields: [petId], references: [id], onDelete: Cascade)
  title       String
  description String?
  dueTime     DateTime
  type        ReminderType
  status      ReminderStatus @default(PENDING)
  createdAt   DateTime       @default(now())
}
model ScheduleTask {
  id          String   @id @default(uuid())
  petId       String
  pet         Pet      @relation(fields: [petId], references: [id], onDelete: Cascade)
  title       String
  timeSlot    String   // e.g. "08:00 AM", "06:00 PM"
  isCompleted Boolean  @default(false)
  category    String   // e.g., "FEEDING", "WALKING", "GROOMING", "MEDICINE"
  date        String   // YYYY-MM-DD
}
model MemoryLog {
  id        String   @id @default(uuid())
  petId     String
  pet       Pet      @relation(fields: [petId], references: [id], onDelete: Cascade)
  event     String   // Short description of notable observation/symptom/trend
  severity  String   // e.g. "INFO", "WARNING", "CRITICAL"
  timestamp DateTime @default(now())
}
model WeeklyReport {
  id              String   @id @default(uuid())
  petId           String
  pet             Pet      @relation(fields: [petId], references: [id], onDelete: Cascade)
  startDate       DateTime
  endDate         DateTime
  summary         String   // Text overview generated by AI
  healthScore     Int      // 1-100 score
  insightsJson    String   // JSON listing exercise level, stool metrics, nutrition trends
  createdAt       DateTime @default(now())
}
model ChatMessage {
  id        String   @id @default(uuid())
  petId     String
  pet       Pet      @relation(fields: [petId], references: [id], onDelete: Cascade)
  role      String   // "user" or "assistant"
  content   String
  timestamp DateTime @default(now())
}
5. API Endpoints
Authentication & Profiles
POST /api/auth/register - Create owner account
POST /api/auth/login - Authenticate owner
GET/POST/PUT /api/pets - Retrieve/create/update pet profiles
Logs & Trackers
POST /api/logs - Log a new activity (nutrition, stool, exercise, etc.). Triggers AI Observe and Reason tasks.
GET /api/logs?petId=xyz&type=NUTRITION - Fetch historical logs for charts.
Inventory
GET/PUT /api/inventory - Get or update food stock levels.
Reminders & Daily Schedule
GET /api/schedule?petId=xyz&date=YYYY-MM-DD - Load daily tasks.
PATCH /api/schedule/:id - Toggle completion status of schedule task.
GET/POST/PUT /api/reminders - Manage system reminders (vaccine, meds).
AI Chat Concierge
POST /api/chat - Submits a question. Injects profile details and memory logs into context. Streams response.
Reports
GET /api/reports/weekly?petId=xyz - Fetch weekly health summaries.
POST /api/reports/generate - Force trigger weekly summarizer (useful for manual reports).
6. Folder Structure

PetBloom/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   ├── assets/
│   │   ├── icons/
│   │   └── avatars/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── pets/
│   │   │   │   └── route.ts
│   │   │   ├── logs/
│   │   │   │   └── route.ts
│   │   │   ├── chat/
│   │   │   │   └── route.ts
│   │   │   ├── schedule/
│   │   │   │   └── route.ts
│   │   │   └── reports/
│   │   │       └── route.ts
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   ├── logs/
│   │   │   └── page.tsx
│   │   ├── chat/
│   │   │   └── page.tsx
│   │   ├── reports/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Toast.tsx
│   │   ├── dashboard/
│   │   │   ├── ScheduleTimeline.tsx
│   │   │   ├── InventoryAlerts.tsx
│   │   │   └── HealthAlertPanel.tsx
│   │   ├── chat/
│   │   │   ├── ChatInterface.tsx
│   │   │   └── SuggestedChips.tsx
│   │   └── layout/
│   │       ├── Sidebar.tsx
│   │       └── Header.tsx
│   ├── services/
│   │   ├── db.ts
│   │   └── ai/
│   │       ├── agent.ts         # Orchestrator
│   │       ├── promptBuilder.ts # Context injection and prompt engineering
│   │       ├── memory.ts        # Extracting long-term events
│   │       ├── reason.ts        # Diagnostic check rules
│   │       └── scheduler.ts     # Generation of schedule tasks
│   ├── hooks/
│   │   ├── usePet.ts
│   │   └── useLogs.ts
│   ├── styles/
│   │   ├── globals.css
│   │   ├── variables.css
│   │   └── modules/
│   │       ├── dashboard.module.css
│   │       ├── chat.module.css
│   │       └── profile.module.css
│   └── utils/
│       └── formatters.ts
├── package.json
├── tsconfig.json
└── next.config.js
7. Component Hierarchy

RootLayout (Global shell, Theme providers, Alerts)
 ├── Sidebar (Responsive navigation panel, active pet selector)
 └── Main Content Area
      ├── Dashboard Page
      │    ├── Header (Pet Welcome, Date, Weather widget)
      │    ├── Main Grid
      │    │    ├── ScheduleTimeline (Tick off feeds, walks, meds)
      │    │    └── Right Side Panel
      │    │         ├── HealthAlertPanel (AI observations, vital thresholds)
      │    │         └── InventoryAlerts (Prediction indicators, order button)
      │    └── QuickLogButton (Floating modal to log food, water, stool, symptom)
      ├── Pet Profile Page
      │    └── Info Form (General info, Allergies, Medical history, Vet specs)
      ├── Chat Page
      │    └── ChatInterface (Messages history, streaming bubbles, preset questions)
      └── Reports Page
           ├── HealthScoreCard (Radial progress visualization)
           ├── HistoryCharts (Weight tracker, Stool frequency logs)
           └── WeeklySummaryBox (AI diagnostic and diet plan output)
8. User Flows
Flow A: Daily Feed & Check-In
User logs a feeding event (Food: "Kibble Gold", Qty: "200g") on the Dashboard.
The UI sends a POST request to /api/logs.
The database updates. The backend checks FoodInventory for "Kibble Gold", decrements currentQty by 200g.
If currentQty drops below thresholdQty, an immediate InventoryAlert triggers, updating the Dashboard.
The AI agent observes the logs, reviews whether this matches the scheduled task, and marks the task as completed.
Flow B: Symptom Check & AI Reasoning
User notices their dog is scratching ears frequently and logs "Abnormal scratching" under Symptoms.
The AI agent processes this log, matches it against:
Historical logs (scratching logs in the past 2 weeks).
Medical history (allergies).
Travel logs (recent walk in tall grass).
The AI agent flags a warning inside MemoryLog: "Possible ear infection / allergy flare-up."
On the Dashboard, a soft-warning widget appears: "Max has shown scratching behavior 3 times this week. Tap to ask the Concierge."
Clicking it loads Chat with pre-populated prompt context.
9. MVP Scope vs. Future Roadmap
MVP Scope (Completed in current iteration)
Pet Profile & Onboarding: Multi-pet profile setup, weight tracking, medical summary.
Loggers: Full loggers for Food/Water (with simple inventory depletion), Stool/Urine (color/frequency tracking), Exercise, and Hygiene.
AI Agent Core:
Live AI Chat integration with pet profile context.
Basic rule-based + LLM diagnostics (stool warning flags, medication alerts).
Weekly PDF-ready health summaries.
UI/UX: Custom beautiful design system, fully responsive with micro-animations.
Phased Future Roadmap
Phase 2 (Scalability): Advanced RAG with Vector Database (PgVector) to match logs over a 12-month period.
Phase 3 (Integrations): Weather API connection (adjust exercise based on heat index), API integration with pet food delivery networks.
Phase 4 (Hardware): Bluetooth integration with smart feeders and water bowls for automated logging.
10. Verification Plan
Automated Tests
Integration tests for logging endpoint and inventory depletion logic (npm run test:logs).
Prompt unit tests verifying prompt builder output structure (npm run test:prompts).
Manual Verification
Verify database state updates correctly on SQLite.
Review CSS responsive layouts across mobile viewport sizes.
Verify streaming Chat interfaces output correctly in browser simulation.


etBloom: Brand Identity, Design System & UX Specification
Visual Concept Previews
Desktop Dashboard Concept Mockup
Review
Desktop Dashboard Concept Mockup

1. Brand Guidelines & Visual Identity
Logo Concepts
Concept A (Primary): The "Blooming Paw" — A clean, abstract paw print where the pads are shaped like opening flower petals (a central round pad with surrounding petal-like shapes).
Concept B (Alternative): The "Growth Heart" — An organic heart shape merging into a fresh leaf and a subtle dog/cat silhouette, symbolizing wellness, care, and organic growth.
Brand Voice: Warm, supportive, encouraging, expert but highly accessible. Never cold, robotic, or overly technical.
Color Palette
Light Theme (Warm, Cozy, Elegant)
Primary / Brand Accent: 🌸 Bloom Rose — #FF7096 / hsl(344, 100%, 72%) (Evokes affection, vitality, and care)
Secondary Accent: 💚 Mint Wellness — #79E6C3 / hsl(161, 70%, 69%) (Evokes hygiene, health, and freshness)
Background Main: Warm Cream — #FAF6F0 / hsl(38, 40%, 97%) (A soothing, warm white that reduces clinical eye strain)
Card Background: Pure Linen — #FFFFFF / hsl(0, 0%, 100%) (Clean white cards with soft #FF7096 tinted shadows)
Text Main: Deep Charcoal — #1C1917 / hsl(24, 10%, 11%) (Soft, highly legible slate black)
Text Muted: Warm Slate — #78716C / hsl(24, 5%, 44%)
Pastel Statuses:
Nutrition (Peach): #FFD3B6
Exercise (Sky Blue): #A8E6CF
Stool/Urine (Pale Yellow): #FDFFB6
Hygiene (Lavender): #E8AEFF
Dark Theme (Calming, Night-Mode Friendly)
Background Main: Midnight Forest — #0F172A / hsl(222, 47%, 11%)
Card Background: Slate Velvet — #1E293B / hsl(215, 28%, 17%)
Brand Accent: Soft Petal — #FFA3B1 / hsl(351, 100%, 82%)
Text Main: Frosted Pearl — #F1F5F9 / hsl(210, 40%, 96%)
Text Muted: Muted Slate — #94A3B8 / hsl(215, 16%, 65%)
Typography Scale
Primary Typeface: Outfit (Geometric, friendly, modern, used for Headings)
Secondary Typeface: Inter (Highly legible, modern sans-serif, used for UI elements and copy)
Scale:
Display 1: 48px / Line Height 56px (Outfit SemiBold) - Onboarding/Welcome Headers
Heading 1: 32px / Line Height 40px (Outfit Medium) - Dashboard Page Title
Heading 2: 24px / Line Height 30px (Outfit Medium) - Card Sections
Subheading: 18px / Line Height 24px (Inter Medium) - Subtitles / Small Titles
Body Copy: 15px / Line Height 22px (Inter Regular) - Text blocks / Logs
Muted / Caption: 12px / Line Height 16px (Inter Medium) - Timestamps, helper alerts
2. AI Concierge Experience
The AI Concierge is the focal point of the PetBloom experience. Rather than existing only on a separate chat tab, it integrates directly into the user's primary interface to act as a proactive, encouraging assistant.

Proactive Interactions
Morning Greeting: Dynamic layout summarizing priorities and predicting logs.
Tone: Empathetic, calm, encouraging, and clear.
Context Injection: Uses historic logs, logs from the last 24 hours, and veterinarian constraints to personalize responses.
Interface Widget Layout (Home Header)

+-------------------------------------------------------------+
| 🌸 Good Morning, Sarah!                                      |
|                                                             |
| Today's priorities for Max:                                 |
| • 🚶 Walk Max before 9:00 AM (Heat index rises later)        |
| • 💧 Water intake was lower than usual yesterday            |
| • 🧼 Grooming is due tomorrow                               |
|                                                             |
| How can I help you care for Max today?                      |
|                                                             |
|  [Start Today's Routine]     [Generate Meal Plan]           |
|  [View Health Summary]       [Ask PetBloom...]              |
+-------------------------------------------------------------+
3. Refined Dashboard Layout
Desktop Layout (3-Column Grid)

+----------------------------------------------------------------------------------------------------+
| Logo     | [Search logs, symptoms...]                                       (Pet Selector: [Max 🐶])|
+----------+-----------------------------------------------------------------------------------------+
| 🏠 Home  |                                                                                         |
|          |  [ AI Concierge Greeting Header ]                                                       |
| 📈 Report |                                                                                         |
|          |  +-----------------------------+   +-----------------------+   +---------------------+  |
| 💬 Chat   |  | DAILY CARE CHECKLIST        |   | COGNITIVE HEALTH      |   | FOOD INVENTORY      |  |
|          |  | [x] 08:00 AM - Breakfast 🍖 |   | [ AI Insight ]        |   | 🍖 Kibble Gold      |  |
| ⚙️ Setup  |  | [ ] 09:00 AM - Walk 🚶     |   | "Max has scratchings  |   | [||||||||  ] 35%    |  |
|          |  | [ ] 07:00 PM - Medication 💊|   | logged 3x this week.  |   | Threshold warning   |  |
|          |  +-----------------------------+   | Check ears." [Log]    |   | [Order Now]         |  |
|          |                                    +-----------------------+   +---------------------+  |
+----------+-----------------------------------------------------------------------------------------+
Mobile Layout (Single Column, Sticky Actions)
AI Greetings card displayed at the top.
Horizontal swipeable tabs for logging events.
Floating bottom tab bar navigation: [ Home | Log | AI Chat | Reports ].
4. Weekly Bloom Report
The Weekly Bloom Report compiles a comprehensive digest of the pet's metrics, scoring overall wellness, diet, and behavior to reward consistency.

Metric Breakdowns
Weekly Bloom Score: Calculated based on habit completion, stable vitals, hydration adherence, and exercise frequency.
Breakdown Cards:
Nutrition: Percentage of daily intake targets met.
Water Intake: Weekly consumption chart comparing current vs. previous week.
Exercise: Walk and running durations against breed-recommended averages.
Hygiene & Grooming: Checklists completed.
Mood & Behavior: Mood trackers compiled to show trends (e.g. "Calm", "Energetic", "Anxious").
Weekly Report Layout Wireframe

+-------------------------------------------------------------+
| 🌸 Max's Weekly Bloom Report (June 29 - July 6)             |
+-------------------------------------------------------------+
|                                                             |
|           [ Radial Progress: 92% Bloom Score ]              |
|                     "Max is blooming!"                      |
|                                                             |
|  +--------------------------+  +--------------------------+ |
|  | Hydration Trends         |  | Exercise Target          | |
|  | [████░] 8.2L (Stable)    |  | [█████] 320m (+15% gain) | |
|  +--------------------------+  +--------------------------+ |
|  | Mood Summary             |  | Medication Adherence     | |
|  | 🐾 Calm & Playful         |  | [█████] 100% Completed   | |
|  +--------------------------+  +--------------------------+ |
|                                                             |
|  [ AI Summary & Wellness Advice ]                           |
|  "Max showed steady weight growth and excellent exercise    |
|  adherence this week. Keep up the morning walks!"           |
+-------------------------------------------------------------+
5. Reports & Analytics Module
The Reports interface goes beyond static numbers, providing dynamic, easy-to-read, and accessible telemetry tracking.

Interactive Telemetry Widgets
Hydration Comparison Chart: A split bar chart plotting daily fluid intake against target lines.
Habit Heatmap: A calendar grid showing daily consistency tags (Color shades representing 0% to 100% task completion).
Growth & Weight Curve: A smooth spline chart plotting weight logs over a 6-month scale, overlaid with standard breed development curves.
6. Startup Landing Page Specification
A clean, premium landing page designed to attract prospective owners, prioritizing credibility and aesthetic warmth.


+-----------------------------------------------------------------------------------+
|  PetBloom Logo                                         Features   Reviews   [Login] |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|                              Helping Every Pet Bloom                              |
|                    The AI-powered concierge for your pet's life.                  |
|                                                                                   |
|                                [ Start Free Trial ]                               |
|                                                                                   |
|                        [ Dashboard Interface Mockup Frame ]                       |
|                                                                                   |
+-----------------------------------------------------------------------------------+
|  [ Proactive Care ]       [ Symptom Alerts ]        [ Weekly Bloom Digests ]       |
|  AI auto-schedules walks  Checks stool consistency  Structured health scores      |
|  and meal prep.           and alerts for anomalies. and developmental curves.      |
+-----------------------------------------------------------------------------------+
Sections:
Hero Header: Prominent call-to-action button, taglines, and a visual dashboard frame preview.
AI Concierge Showcase: Interactive interactive slider showing input messages (e.g. "Max has been scratching" ) and the corresponding proactive AI reply.
Core Features Grid: Brief cards explaining Nutrition logs, stool trackers, and medical reminders.
Testimonials: Conversational quotes from certified vets and first-time pet owners.
Footer: Privacy guidelines, contact information, and licensing metrics.
7. Delightful UX & Micro-Interactions
We implement small visual details that turn mundane tracking habits into enjoyable milestones without over-gamifying.

Animations
Daily Care Completion (100%): Trigger a soft confetti animation (using canvas-confetti style rendering) and display the achievement banner:
🌸 Max is blooming today! 100% of today's care completed. Fantastic work! 🎉

Transition States: Page views slide in from the right; cards expand dynamically using smooth spring transitions (transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)).
Loaders: Elegant, rotating paw prints that expand and contract.
8. Design System Components
Status Badges
Warning: #FEF2F2 background, #EF4444 red border and text.
Info / AI Insight: #EFF6FF blue background, #3B82F6 blue border and text.
Success / Completed: #ECFDF5 green background, #10B981 green border and text.
Empty States
Clean, centered line drawings of a sleeping kitten/puppy with friendly copy (e.g. "No meals logged yet today. Let's make Max's tummy happy!"). Includes a clear primary action button.
Loading Skeletons
Shimmering grey gradients (background: linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)) that outline dashboard blocks while the database query completes.
9. UX Rationale & Accessibility Considerations
Accessibility Compliance (WCAG 2.1): All text elements maintain a minimum contrast ratio of 4.5:1. Interactive click targets are at least 44px x 44px on mobile layouts.
Cognitive Ease: Avoid forcing users to parse large tables. Insights use bulleted, bolded tags so busy owners can scan key priorities in under 5 seconds.
Optimistic Updates: Logging a meal instantly marks it complete in the UI while database requests resolve in the background. If a request fails, a polite toast undoes the visual transition and triggers a retry button.



PetBloom: Database & Data Architecture Specification
This document details the data architecture for PetBloom, covering both relational (Supabase/PostgreSQL) and document (Firestore) databases, authentication models, access controls, storage layouts, data validation, and database migration strategies.

1. Entity Relationship (ER) Diagram
The following Mermaid diagram outlines the relational structure of the database:

Mermaid diagram
2. Relational Database Schema (Supabase/PostgreSQL)
This schema is optimized for Supabase (PostgreSQL), utilizing tables, constraints, default UUID generation, and JSONB fields for high schema-flexibility while keeping relational integrity intact.

sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- USER TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
-- PET TABLE
CREATE TABLE pets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    photo_url TEXT,
    breed TEXT NOT NULL,
    birthday DATE NOT NULL,
    weight NUMERIC(5, 2) NOT NULL CHECK (weight > 0),
    medical_profile JSONB DEFAULT '{}'::jsonb NOT NULL, -- Contains allergies, vaccines, conditions
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
-- PET LOG TABLE (Nutrition, Water, Stool, Exercise, Hygiene)
CREATE TABLE pet_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL CHECK (type IN ('NUTRITION', 'WATER', 'STOOL_URINE', 'HEALTH', 'HYGIENE', 'EXERCISE', 'TRAINING')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    payload JSONB NOT NULL -- Specific details (e.g. water_ml, stool_consistency, stool_color)
);
-- FOOD INVENTORY
CREATE TABLE food_inventories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    food_name TEXT NOT NULL,
    current_qty NUMERIC(6, 2) NOT NULL CHECK (current_qty >= 0),
    threshold_qty NUMERIC(6, 2) NOT NULL CHECK (threshold_qty >= 0),
    daily_consumption NUMERIC(4, 2) NOT NULL CHECK (daily_consumption >= 0),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
-- REMINDER SYSTEM
CREATE TABLE reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_time TIMESTAMP WITH TIME ZONE NOT NULL,
    type VARCHAR(30) NOT NULL CHECK (type IN ('FOOD', 'MEDICINE', 'VACCINATION', 'HYGIENE', 'TRAVEL')),
    status VARCHAR(20) DEFAULT 'PENDING' NOT NULL CHECK (status IN ('PENDING', 'COMPLETED', 'MISSED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
-- SCHEDULE SYSTEM
CREATE TABLE schedule_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    time_slot VARCHAR(10) NOT NULL, -- e.g. "08:00 AM"
    is_completed BOOLEAN DEFAULT FALSE NOT NULL,
    category VARCHAR(30) NOT NULL CHECK (category IN ('FEEDING', 'WALKING', 'GROOMING', 'MEDICINE', 'TRAINING')),
    target_date DATE NOT NULL
);
-- AI LONG-TERM MEMORY
CREATE TABLE memory_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    event TEXT NOT NULL,
    severity VARCHAR(15) DEFAULT 'INFO' CHECK (severity IN ('INFO', 'WARNING', 'CRITICAL')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
-- WEEKLY HEALTH REPORTS
CREATE TABLE weekly_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    summary TEXT NOT NULL,
    health_score INT NOT NULL CHECK (health_score BETWEEN 0 AND 100),
    insights_payload JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
-- CHAT HISTORY
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    role VARCHAR(15) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
Core Database Indexes
To maintain fast query response times when pulling dashboard schedules, generating charts, and injecting chat context:

sql

-- Indexes for dashboard loading
CREATE INDEX idx_schedule_tasks_pet_date ON schedule_tasks(pet_id, target_date);
CREATE INDEX idx_reminders_pet_due ON reminders(pet_id, due_time) WHERE status = 'PENDING';
-- Index for RAG and AI Chat fetching logs
CREATE INDEX idx_pet_logs_pet_type_time ON pet_logs(pet_id, type, timestamp DESC);
-- Index for memory logs context lookup
CREATE INDEX idx_memory_logs_pet_time ON memory_logs(pet_id, timestamp DESC);
3. Document Mapping (Firestore Option)
If choosing NoSQL (Firestore), the structure uses a subcollection layout to ensure fast reads and clean logical boundaries:


/users/{userId} (Document)
  ├── email: String
  ├── name: String
  └── pets/ (Subcollection)
        └── {petId} (Document)
              ├── name: String
              ├── breed: String
              ├── birthday: Timestamp
              ├── weight: Number
              ├── medicalProfile: Map (conditions, allergies)
              ├── logs/ (Subcollection)
              │     └── {logId} (type, timestamp, payload)
              ├── schedule/ (Subcollection)
              │     └── {taskId} (title, timeSlot, isCompleted, category, targetDate)
              ├── reminders/ (Subcollection)
              │     └── {reminderId} (title, dueTime, status, type)
              ├── chatHistory/ (Subcollection)
              │     └── {messageId} (role, content, timestamp)
              └── weeklyReports/ (Subcollection)
                    └── {reportId} (startDate, endDate, summary, healthScore, insights)
Relational (SQL) vs. Document (NoSQL) Comparison
Supabase (PostgreSQL) - RECOMMENDED: Relational databases are vastly superior for PetBloom because analyzing health trends (e.g. running a query to join weight over time with historical pet_logs of type NUTRITION) is clean, fast, and uses standard aggregation queries.
Firestore: Firestore is convenient for real-time synchronization, but running complex analytics or RAG search joins over millions of pet logs requires replicating logs into an external search/analytics cluster, which introduces code complexity.
4. Authentication, User Roles & Authorization
Authentication Model
PetBloom uses JWT-based sessions via Supabase Auth (or Firebase Auth). When a user registers, they receive an encrypted token containing their UUID, email, and roles.

User Roles
Owner: Full read/write access to all resources associated with their user_id.
Sitter (Future Expansion): Invited to a specific pet. Access is restricted to pet_logs and schedule_tasks (read/write), and pets (read-only). Sitter cannot delete pets or access billing.
5. Security & Row Level Security (RLS) Rules
For Supabase/PostgreSQL, we enable Row Level Security (RLS) to enforce data boundaries at the database engine level.

sql

-- Enable RLS
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
-- Owner Policies: Users can only see/edit their own pets
CREATE POLICY owner_all_access ON pets 
    FOR ALL 
    USING (auth.uid() = user_id);
-- Logs Policy: Can only edit/view logs of pets they own
CREATE POLICY owner_logs_access ON pet_logs 
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM pets 
            WHERE pets.id = pet_logs.pet_id AND pets.user_id = auth.uid()
        )
    );
-- Schedule Tasks Policy
CREATE POLICY owner_schedule_access ON schedule_tasks
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM pets 
            WHERE pets.id = schedule_tasks.pet_id AND pets.user_id = auth.uid()
        )
    );
6. Data Validation Rules & Integrity Triggers
To prevent corrupt records and verify data boundaries before writing, we add triggers and constraint rules:

Database Triggers for Auto-Decrementing Inventory
When a food log is created, the database automatically updates the inventory level:

sql

CREATE OR REPLACE FUNCTION update_food_inventory()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.type = 'NUTRITION' THEN
        -- Payload key expected: {"food_name": "Kibble Gold", "qty_grams": 200}
        UPDATE food_inventories
        SET current_qty = current_qty - (CAST(NEW.payload->>'qty_grams' AS NUMERIC) / 1000.0),
            updated_at = CURRENT_TIMESTAMP
        WHERE pet_id = NEW.pet_id AND food_name = NEW.payload->>'food_name';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_on_nutrition_log
AFTER INSERT ON pet_logs
FOR EACH ROW EXECUTE FUNCTION update_food_inventory();
7. Storage Strategy (Files & Photos)
Buckets Structure
Bucket: petbloom-media
Folders Structure:
public/avatars/: Cache-friendly public pet photos (/public/avatars/{petId}_128x128.webp).
private/documents/: Private vet reports, vaccination cards (/private/documents/{petId}/{documentId}.pdf).
Optimization & Delivery
Format: All images uploaded (PNG/JPG) are dynamically compressed and converted to WebP on the edge to minimize page load size.
Access Policies: Avatars are readable by any client URL. Documents are accessed only via authenticated, short-lived signed URLs (15-minute expiration).
8. Database Migration Strategy
We utilize Prisma Migrations (or Supabase CLI migrations) to ensure incremental, safe database updates:

Local Development: Modifications are made to the local schema, verified, and run using prisma migrate dev --name <migration_name> to generate SQL files in /prisma/migrations/.
Staging & Testing: The deployment pipeline runs migrations against a branch-isolated DB instance (prisma migrate deploy).
Production Deployment: Performed during off-peak hours using atomic database transactions. In the event of a failure, changes automatically roll back.
Data Seed Script: Standard presets (breed lists, food templates, default training schedule templates) are seeded automatically via prisma/seed.ts.


PetBloom: AI Agent Architecture Specification
This document defines the agentic architecture for PetBloom, explaining how the AI concierge acts as an active, reasoning, and reflective entity that goes beyond simple chatbot replies to drive pet wellness.

1. AI Agent Lifecycle & Core Capabilities
PetBloom's architecture is built on the Observe-Remember-Reason-Plan-Act-Reflect agent cycle.

Mermaid diagram
Why PetBloom is an Agent (Not a Chatbot)
State Awareness: Rather than starting fresh each session, the agent holds a structured, continuous representation of the pet's profile, veterinary history, and daily habits.
Proactive Execution: The agent generates schedule tasks and alerts autonomously based on time and environmental triggers (e.g. weather alerts, inventory depletion), without requiring a user prompt.
Reflection Loop: The agent evaluates its own historical recommendations against actual logged outcomes each week to calculate the "Weekly Bloom Score" and adjust schedules.
2. Gemini Integration & Prompt Pipeline
Model Selection Strategy
Gemini 1.5 Flash (Primary): Used for daily log analysis, chat conversation, and reminder generation due to its speed, low latency, and cost efficiency.
Gemini 1.5 Pro / 2.0 Flash (Reflections & Reports): Used for weekly report summaries, complex medical history analysis, and reasoning over large multi-month data windows.
Cost Optimization & Caching
System Instructions Caching: We utilize Gemini's Context Caching for the static system prompts and veterinarian guidelines.
Log Summarization: Daily logs are consolidated into static summaries, preventing the API from processing thousands of raw database rows for every chat query.
Mermaid diagram
3. Memory Architecture & Lifecycle
Memory is divided into three tiers to optimize context length and maintain long-term relevance:

[ Raw Logs / Chat History ]  ──(Daily Summary)──> [ Short-Term Memory ]  ──(Reflective Summary)──> [ Long-Term Memory (MemoryLog) ]
1. Short-Term Memory
Scope: Current chat conversation.
Storage: Retained in-session (sliding window of the last 10 messages).
2. Daily Log Memory
Scope: Telemetry recorded throughout the day (meals, water intake, stool quality, play duration).
Storage: SQL Tables (pet_logs).
3. Long-Term Semantic Memory (MemoryLog)
Scope: Summarized records of anomalies, habits, and preferences (e.g., "Max is allergic to beef", "Max shows reluctance to walk during high heat").
Update Frequency: Generated automatically when the Reason Engine detects a pattern, or during the weekly Reflection pipeline.
4. Context Retrieval Pipeline
When a user submits a query, the backend filters and retrieves only relevant context before querying the LLM:

Mermaid diagram
Filtering Irrelevant Data
Metadata Tagging: Logs are classified by type (LogType). If the query contains words like "eat", "food", or "kibble", the retrieval engine skips exercise logs and loads nutrition summaries.
Time Windows: Routine queries fetch only the last 48 hours of logs. Historical queries (e.g., "compare weight") pull monthly averaged coordinates.
5. Adaptive Planning & Scheduler Engine
The Planning Engine constructs and shifts schedules dynamically:

Mermaid diagram
Missed Task & Conflict Recovery
Heat Offset: If a walk is scheduled at 2:00 PM but local forecast shows temperatures exceeding 85°F, the planning agent automatically reschedules the walk to 7:00 PM and fires an in-app notice.
Missed Meals: If a morning feeding task is not checked off by 11:00 AM, the agent flags an alert, adjusts the evening portion sizing, and prompts: "Max missed breakfast. I've adjusted his evening meal size to maintain target calories safely."
6. Recommendation & Proactive Reminder Engine
Recommendations are generated by intersecting the pet's profile, ambient variables, and telemetry logs:

Input Signal	Data Source	AI Reason / Logic	Proactive Action / Recommendation
Low Fluid Intake	pet_logs (WATER)	Water intake drops 30% below breed threshold.	Generate high-priority alert: "Consider adding water to Max's food."
High Ambient Heat	Weather API	Temp > 85°F, high UV index.	Push reminder to shift walk hours, suggest indoor puzzle games.
Stool: "Liquid"	pet_logs (STOOL)	Stool logged as liquid twice consecutively.	Flag medical alert; direct user to emergency vet contact page.
Low Inventory	food_inventories	Current stock drops below 3 days of eating rates.	Generate action card: "Reorder Kibble Gold."
7. Weekly Bloom Report Pipeline
The Reflection agent runs weekly to generate a progress scorecard:

Extraction: Collects all logs, reminders completed, and chat events from the past 7 days.
Analysis: Gemini Pro computes target adherence (Hydration %, Diet %, Medication Completion %).
Drafting: Generates the Weekly Summary, assigns a Bloom Score, flags improvements, and highlights achievements.
Archiving: Stores the output in WeeklyReport table and resets the weekly timeline tracker.
8. Prompt Engineering Templates
Health & Symptom Analysis Prompt

System: You are PetBloom's expert AI Veterinary Concierge. Analyze the pet profile and recent logs for potential issues.
Constraint: Provide helpful suggestions but always include a clear disclaimer that this is not medical diagnosis.
Pet Profile:
- Name: {{pet_name}}, Breed: {{pet_breed}}, Age: {{pet_age}}
- Vitals: {{pet_weight}}, Allergies: {{pet_allergies}}
Input Event: {{input_log}}
History Summary: {{memory_logs}}
Task: Evaluate the input. If it indicates emergency symptoms (e.g. blood in stool, heavy panting, lethargy), output a [TRIGGER_EMERGENCY] token and outline immediate first-aid steps. Otherwise, recommend adjustments.
Daily Scheduler Prompt

System: You are PetBloom's routine coordinator. Create a balanced daily schedule.
Breed Standards: {{breed_guidelines}}
Weather Target: Today is {{weather_status}}, Temperature max: {{weather_max}}
Medical Schedule: {{pet_medications}}
Task: Output a JSON list of tasks specifying timeSlot, category, and title. Ensure meds are scheduled relative to food guidelines.
9. Safety, Trust & Emergency Escalation
The Veterinary Guardrail: Every health response automatically appends a subtle, friendly note: "I'm your AI wellness concierge, not a vet. If Max's symptoms persist or worsen, please contact your local vet clinic."
Emergency Protocol: If critical symptom keywords (e.g., "seizure", "unresponsive", "bleeding", "poison") are typed in Chat or logged:
The API response flags emergency_escalation: true.
The UI immediately overlays the Emergency Contact page with vet numbers, map locations, and a tap-to-call button.
Data Privacy: Users are prompted during onboarding to consent to the AI analyzing and storing logs to personalize health routines.
10. Future Scalability
Computer Vision (Stool & Skin Analysis): Using Gemini's multimodal capabilities, users can upload photos of stools or skin rashes for instant anomaly identification.
Smart Hardware Integrations:
Smart Feeders: Auto-post NUTRITION logs to /api/logs directly when kibble is dispensed.
Smart Collars (Fitbark/Whistle): Push real-time sleep and step logs to EXERCISE tables.
Multi-Pet Scaling: The context retrieval system is indexed by pet_id, allowing a single chat window to alternate contexts (e.g., "How is Max doing compared to Bella?") by loading multi-pet data side-by-side.
