# AI Interview Prep

An AI-powered interview preparation application built with Cloudflare Workers AI and D1 database. Practice technical interviews with an AI interviewer and receive instant feedback on your responses.

## Features

- **Multiple Interview Types**: Software Engineer, Product Manager, Data Scientist, Frontend/Backend Developer, DevOps Engineer, System Design, and Behavioral interviews
- **Adjustable Difficulty**: Easy, Medium, and Hard difficulty levels
- **Real-time AI Feedback**: Get scored feedback on each response with strengths and areas for improvement
- **Voice Input/Output**: Speak your answers and hear AI questions read aloud
- **Session History**: Track all your past interview sessions
- **Progress Tracking**: Monitor your improvement over time across different interview types
- **Dark Theme UI**: Modern, gradient-styled dark theme interface
- **Comprehensive Question Bank**: 50 curated questions per interview type (400 total)

## Voice Features

The app includes voice capabilities using the Web Speech API (no additional backend required):

| Feature | Description |
|---------|-------------|
| 🎤 **Voice Input** | Click the microphone button to speak your answer. Speech is transcribed in real-time and auto-submitted when you finish. |
| 🔊 **Auto-Read** | AI interviewer questions are automatically read aloud when received. |
| 🔊 **Replay** | Click the speaker icon next to any AI message to hear it again. |

### Browser Support
- **Chrome/Edge**: Full support (recommended)
- **Safari**: Full support
- **Firefox**: Text-to-speech only (no voice input)

### Permissions
The app will request microphone access when you first click the voice button. You must allow this for voice input to work.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Browser                              │
│                    (frontend/index.html)                         │
└─────────────────────────────┬───────────────────────────────────┘
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Cloudflare Workers                            │
│                     (src/worker.js)                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    API Routes                            │    │
│  │  /api/roles      - Get available interview roles         │    │
│  │  /api/session/*  - Session management                    │    │
│  │  /api/chat       - Send/receive messages                 │    │
│  │  /api/history    - Get session history                   │    │
│  │  /api/progress   - Get user progress                     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│              ┌───────────────┼───────────────┐                  │
│              ▼                               ▼                   │
│  ┌─────────────────────┐         ┌─────────────────────┐        │
│  │   Workers AI        │         │     D1 Database     │        │
│  │   (Llama 3.3 70B)   │         │                     │        │
│  │                     │         │  - users            │        │
│  │  - Interviewer AI   │         │  - sessions         │        │
│  │  - Evaluator AI     │         │  - conversations    │        │
│  └─────────────────────┘         │  - progress         │        │
│                                  └─────────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

## Tech Stack

- **Runtime**: Cloudflare Workers
- **AI Model**: @cf/meta/llama-3.3-70b-instruct-fp8-fast (Workers AI)
- **Database**: Cloudflare D1 (SQLite)
- **Frontend**: Vanilla HTML/CSS/JavaScript (single-file)
- **Assets**: Cloudflare Workers Assets

## Project Structure

```
cf_ai_interview_prep/
├── src/
│   └── worker.js         # Main Worker with API routes and AI integration
├── frontend/
│   └── index.html        # Single-file chat UI
├── package.json          # npm configuration
├── wrangler.toml         # Cloudflare Worker configuration
├── schema.sql            # D1 database schema
├── PROMPTS.md            # AI prompts documentation
├── README.md             # This file
└── .gitignore            # Git ignore rules
```

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Cloudflare account
- Wrangler CLI (installed via npm)

### 1. Install Dependencies

```bash
npm install
```

### 2. Create D1 Database

```bash
npx wrangler d1 create interview_prep_db
```

This will output a database ID. Copy it.

### 3. Update wrangler.toml

Replace `YOUR_DATABASE_ID_HERE` in `wrangler.toml` with your actual database ID:

```toml
[[d1_databases]]
binding = "DB"
database_name = "interview_prep_db"
database_id = "your-actual-database-id"
```

### 4. Initialize Database Schema

For local development:
```bash
npm run db:init
```

For production:
```bash
npm run db:init:remote
```

### 5. Run Locally

```bash
npm run dev
```

Open http://localhost:8787 in your browser.

### 6. Deploy to Cloudflare

```bash
npm run deploy
```

## API Documentation

### GET /api/roles

Returns available interview roles and difficulty levels.

**Response:**
```json
{
  "roles": [
    { "id": "software-engineer", "name": "Software Engineer", "icon": "💻" },
    ...
  ],
  "difficulties": ["easy", "medium", "hard"]
}
```

### POST /api/session/start

Starts a new interview session.

**Request:**
```json
{
  "userId": "user_abc123",
  "role": "software-engineer",
  "difficulty": "medium"
}
```

**Response:**
```json
{
  "sessionId": "uuid-here",
  "role": "software-engineer",
  "difficulty": "medium",
  "message": "AI interviewer's opening message"
}
```

### POST /api/chat

Sends a message and receives AI response with evaluation.

**Request:**
```json
{
  "sessionId": "uuid-here",
  "message": "Your response to the interview question"
}
```

**Response:**
```json
{
  "message": "AI interviewer's follow-up",
  "evaluation": {
    "score": 7,
    "strengths": ["Clear explanation", "Good examples"],
    "improvements": ["Could mention edge cases"],
    "feedback": "Solid answer with room for improvement"
  }
}
```

### POST /api/session/end

Ends the session and returns final evaluation.

**Request:**
```json
{
  "sessionId": "uuid-here"
}
```

**Response:**
```json
{
  "sessionId": "uuid-here",
  "overallScore": 7,
  "feedback": "Detailed final feedback from AI",
  "questionsAnswered": 5
}
```

### GET /api/history?userId={userId}

Returns session history for a user.

**Response:**
```json
{
  "sessions": [
    {
      "session_id": "uuid",
      "role": "software-engineer",
      "difficulty": "medium",
      "status": "completed",
      "started_at": "2024-01-01T00:00:00Z",
      "ended_at": "2024-01-01T00:30:00Z",
      "overall_score": 7,
      "feedback": "..."
    }
  ]
}
```

### GET /api/progress?userId={userId}

Returns user progress across different roles.

**Response:**
```json
{
  "progress": [
    {
      "user_id": "user_abc",
      "role": "software-engineer",
      "sessions_completed": 5,
      "average_score": 7.2,
      "best_score": 9,
      "total_questions": 25,
      "last_practice": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## Database Schema

### users
- `id` - Auto-increment primary key
- `user_id` - Unique user identifier
- `email` - Optional email
- `name` - Optional name
- `created_at` - Timestamp
- `updated_at` - Timestamp

### sessions
- `id` - Auto-increment primary key
- `session_id` - Unique session identifier
- `user_id` - Foreign key to users
- `role` - Interview role type
- `difficulty` - easy/medium/hard
- `status` - active/completed
- `started_at` - Session start time
- `ended_at` - Session end time
- `overall_score` - Final score (1-10)
- `feedback` - Final AI feedback

### conversations
- `id` - Auto-increment primary key
- `session_id` - Foreign key to sessions
- `role` - Message sender (user/assistant)
- `content` - Message content
- `timestamp` - Message time
- `score` - Response score (for user messages)
- `feedback` - JSON evaluation data

### progress
- `id` - Auto-increment primary key
- `user_id` - Foreign key to users
- `role` - Interview role type
- `sessions_completed` - Total sessions
- `average_score` - Running average
- `best_score` - Highest score achieved
- `total_questions` - Questions answered
- `strengths` - Identified strengths
- `areas_to_improve` - Areas needing work
- `last_practice` - Last practice timestamp

## License

MIT
