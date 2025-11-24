# 🎓 Learning Labs - AI-Powered Interactive Math Platform

A modern, AI-driven educational platform that generates interactive math games on-demand using Google's Gemini API. Features include Google OAuth authentication, real-time game generation, persistent storage, and a "3D Cartoon" UI theme.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Data Flow](#data-flow)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Scalability](#scalability)
- [Contributing](#contributing)

---

## 🌟 Overview

Learning Labs is an interactive math learning platform that combines:
- **AI-Generated Games**: Dynamic, topic-specific interactive games created by Gemini API
- **Smart Authentication**: Google OAuth + traditional email/password login
- **Instant Caching**: Browser-based caching for lightning-fast game replays
- **Math Jokes**: Fun, interactive math facts alongside each game
- **Persistent Library**: Save and share your favorite games

### Key Differentiators
- **NOT quizzes**: Games are interactive manipulatives (clicker labs, builders, visual tools)
- **Adaptive**: Generates age-appropriate content based on grade level
- **Fast**: LocalStorage caching means instant re-loads
- **Beautiful**: Consistent "3D Cartoon" UI with tactile, playful design

---

## 🏗️ Architecture

### High-Level Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│   React SPA     │◄───────►│  Express API    │◄───────►│    MongoDB      │
│  (Vite + React) │         │   (Node.js)     │         │   (Database)    │
│                 │         │                 │         │                 │
└────────┬────────┘         └────────┬────────┘         └─────────────────┘
         │                           │
         │                           │
         │                           ▼
         │                  ┌─────────────────┐
         │                  │                 │
         │                  │  Gemini API     │
         │                  │  (Google AI)    │
         │                  │                 │
         │                  └─────────────────┘
         │
         ▼
┌─────────────────┐
│                 │
│  LocalStorage   │
│   (Caching)     │
│                 │
└─────────────────┘
```

### Component Breakdown

#### Frontend (React + Vite)
- **Location**: `/src`
- **Entry Point**: `App.jsx`
- **Key Components**:
  - `AIPanel.jsx` - Game generation and display
  - `LoginModal.jsx` - Authentication UI (Google OAuth + Email/Password)
  - `Game.jsx` - Quiz game engine (static questions from JSON)
  - `AdModal.jsx` - Subscription prompts
  - `SubscriptionDashboard.jsx` - User account view

#### Backend (Express.js)
- **Location**: `/server`
- **Entry Point**: `server.js`
- **Routes**:
  - `/api/auth/*` - Authentication (Google OAuth, login, signup)
  - `/api/ai/*` - AI game generation and management
  - `/api/users/*` - User subscription management
  - `/api/payment/*` - Stripe payment webhooks (optional)

#### Database (MongoDB)
- **Collections**:
  - `users` - User accounts (email, googleId, avatar, subscription status)
  - `aicontents` - Generated games (HTML, jokes, metadata, public/private)

---

## 🔄 Data Flow

### 1. Game Generation Flow

```
User selects topic/grade
        ↓
Frontend: AIPanel.jsx sends POST /api/ai/generate
        ↓
Backend: ai.js builds prompt with strict rules
        ↓
Gemini API: Returns HTML game + joke (delimited)
        ↓
Backend: Parses response, validates, saves to MongoDB
        ↓
Frontend: Receives game + joke, renders in iframe
        ↓
LocalStorage: Caches full HTML + metadata
        ↓
User plays game instantly on next load!
```

### 2. Authentication Flow (Google OAuth)

```
User clicks "Continue with Google"
        ↓
Frontend: Redirects to /api/auth/google
        ↓
Backend: Passport.js initiates OAuth flow
        ↓
Google: User authorizes app
        ↓
Google redirects to /api/auth/google/callback
        ↓
Backend: 
  - Finds/creates user in MongoDB
  - Links account if email exists
  - Creates session (httpOnly cookie)
        ↓
Backend redirects to frontend with ?auth=success
        ↓
Frontend: Fetches /api/auth/status
        ↓
Frontend: Updates UI with user data
        ↓
User is logged in! (session persists 24hrs)
```

### 3. Caching Strategy

```
Generate Game
    ↓
Save to MongoDB (id, htmlCode, joke, metadata)
    ↓
Save to LocalStorage:
  {
    id: "game123",
    htmlCode: "<full HTML>",
    joke: "<joke HTML>",
    topic: "Fractions",
    timestamp: 1234567890
  }
    ↓
On page refresh → Check LocalStorage FIRST
    ↓
If found → Instant render (no API call!)
    ↓
If not found → Fetch from MongoDB via /api/ai/game/:id
```

---

## ✨ Features

### Core Features
- ✅ **AI-Generated Interactive Games** - Clicker labs, visual builders, not quizzes
- ✅ **Google OAuth Login** - One-click sign-in
- ✅ **Email/Password Auth** - Traditional login option
- ✅ **Math Jokes** - Fun facts displayed alongside games
- ✅ **Instant Caching** - LocalStorage for offline-ready replays
- ✅ **Game Library** - Save and share your favorite games
- ✅ **3D Cartoon UI** - Tactile, playful design system

### Advanced Features
- 🔄 **Topic-Specific Content** - Addition, Fractions, Geometry, etc.
- 📊 **Grade-Adaptive** - Pre-K through Algebra 2
- 🎨 **Consistent Theming** - Vibrant colors, soft shadows, round fonts
- 🔐 **Session-Based Auth** - Secure httpOnly cookies
- 💾 **Persistent Storage** - MongoDB for game history
- 🚀 **Progressive Enhancement** - Works offline with cached games

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Vanilla CSS** - Styling (no framework dependencies)
- **LocalStorage API** - Client-side caching

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **Passport.js** - Authentication middleware
- **Mongoose** - MongoDB ODM
- **express-session** - Session management

### Database & External Services
- **MongoDB Atlas** - Cloud database
- **Google Gemini API** - AI content generation
- **Google OAuth 2.0** - Social authentication
- **Stripe** (optional) - Payment processing

### DevOps
- **Git** - Version control
- **Render** - Backend hosting
- **Vercel/Netlify** - Frontend hosting (recommended)

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)
- Google Cloud Console account
- Gemini API key

### 1. Clone Repository
```bash
git clone https://github.com/ashkam58/ixl-addition.git
cd addition-game-lab
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration

Create `.env` in the root directory:

```env
# API Keys
GEMINI_API_KEY=your_gemini_api_key
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=generate_with_crypto_randomBytes

# URLs
FRONTEND_URL=http://localhost:5173

# Optional: Stripe
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

Create `.env` in `/src` (or use Vite's env):
```env
VITE_API_URL=http://localhost:4000
```

### 4. Run Development Servers

**Backend:**
```bash
npm run server
```

**Frontend:**
```bash
npm run dev
```

Access the app at `http://localhost:5173`

---

## 📡 API Documentation

### Authentication Endpoints

#### `POST /api/auth/login`
Login with email/password
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "userId",
    "name": "John Doe",
    "email": "user@example.com",
    "isPro": false
  }
}
```

#### `GET /api/auth/google`
Initiates Google OAuth flow (redirects to Google)

#### `GET /api/auth/google/callback`
OAuth callback (handled by Passport.js, redirects to frontend)

#### `GET /api/auth/status`
Check current authentication status
```json
{
  "authenticated": true,
  "user": {
    "id": "userId",
    "name": "John Doe",
    "email": "user@example.com",
    "avatar": "https://...",
    "isPro": false
  }
}
```

### AI Game Endpoints

#### `POST /api/ai/generate`
Generate a new AI game
```json
{
  "topic": "Fractions",
  "subtopic": "Adding fractions",
  "grade": "Grade 4",
  "variant": "default"
}
```

**Response:**
```json
{
  "htmlCode": "<!DOCTYPE html>...",
  "joke": "<div>...</div>",
  "id": "generatedGameId"
}
```

#### `GET /api/ai/game/:id`
Fetch a previously generated game
```json
{
  "htmlCode": "<!DOCTYPE html>...",
  "joke": "<div>...</div>"
}
```

#### `POST /api/ai/publish/:id`
Make a game public (shareable)
```json
{
  "success": true,
  "game": { /* game data */ }
}
```

#### `GET /api/ai/library`
Get all public games
```json
[
  {
    "id": "gameId",
    "topic": "Fractions",
    "grade": "Grade 4",
    "plays": 42,
    "likes": 10
  }
]
```

---

## 📈 Scalability

### Current Architecture Limitations
1. **Single MongoDB Instance** - Bottleneck at ~1000 concurrent users
2. **Gemini API Rate Limits** - ~60 requests/minute per API key
3. **Session Store** - In-memory sessions don't persist across server restarts
4. **No CDN** - Static assets served directly from backend

### Scaling Strategy

#### Phase 1: Handle 1K-10K Users

**Backend Optimization:**
```javascript
// Use MongoDB session store instead of memory
const MongoStore = require('connect-mongo');

app.use(session({
  store: MongoStore.create({ mongoUrl: MONGO_URI }),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
```

**Add Redis Caching:**
```javascript
// Cache Gemini API responses
const redis = require('redis');
const client = redis.createClient();

// Before calling Gemini API:
const cached = await client.get(`game:${topic}:${grade}:${variant}`);
if (cached) return JSON.parse(cached);

// After generating:
await client.setEx(`game:${topic}:${grade}:${variant}`, 3600, JSON.stringify(game));
```

**Implement Rate Limiting:**
```javascript
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/ai/generate', apiLimiter);
```

#### Phase 2: Handle 10K-100K Users

**Horizontal Scaling:**
- Deploy multiple backend instances behind a load balancer
- Use **Render's autoscaling** or **AWS ECS**

**Database Optimization:**
```javascript
// Add indexes to MongoDB
db.aicontents.createIndex({ topic: 1, grade: 1 });
db.aicontents.createIndex({ isPublic: 1, createdAt: -1 });
db.users.createIndex({ email: 1 }, { unique: true, sparse: true });
db.users.createIndex({ googleId: 1 }, { unique: true, sparse: true });
```

**Use MongoDB Replica Sets** for read scalability

**CDN for Static Assets:**
- Host frontend on **Vercel Edge Network**
- Serve generated games from **Cloudflare R2** or **AWS S3**

#### Phase 3: Handle 100K+ Users

**Microservices Architecture:**

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Auth       │    │  Game Gen    │    │   Library    │
│   Service    │    │   Service    │    │   Service    │
└──────────────┘    └──────────────┘    └──────────────┘
       │                   │                    │
       └───────────────────┴────────────────────┘
                           │
                   ┌───────┴───────┐
                   │  API Gateway   │
                   └───────┬───────┘
                           │
                      Load Balancer
```

**Queue-Based Generation:**
```javascript
// Use Bull or AWS SQS for async game generation
const Queue = require('bull');
const gameQueue = new Queue('game-generation', REDIS_URL);

// POST /api/ai/generate → Add to queue, return jobId
gameQueue.add({ topic, grade, variant });

// Worker processes poll queue and generate games
gameQueue.process(async (job) => {
  const game = await generateWithGemini(job.data);
  await saveToMongoDB(game);
});
```

**Global Distribution:**
- **Multi-region MongoDB Atlas** clusters
- **Cloudflare Workers** for edge compute
- **AWS CloudFront** or **Fastly** for CDN

**Monitoring & Observability:**
- **Datadog** or **New Relic** for APM
- **Sentry** for error tracking
- **Prometheus + Grafana** for metrics

---

## 🔒 Security Best Practices

### Current Implementation
✅ httpOnly session cookies (XSS protection)  
✅ CORS configured with credentials  
✅ Environment variables for secrets  
✅ MongoDB connection with authentication  
✅ Passport.js for OAuth security  

### Recommended Enhancements
- [ ] Add **helmet.js** for security headers
- [ ] Implement **CSRF protection**
- [ ] Use **bcrypt** for password hashing (currently plain text!)
- [ ] Add **input sanitization** (DOMPurify for HTML)
- [ ] Enable **MongoDB encryption at rest**
- [ ] Set up **API key rotation** for Gemini

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Generate game for each topic/grade combination
- [ ] Verify Google OAuth flow (sign in, link account, logout)
- [ ] Test email/password login/signup
- [ ] Confirm LocalStorage caching (refresh → instant load)
- [ ] Check mobile responsiveness
- [ ] Validate 3D UI theme consistency

### Automated Testing (TODO)
```bash
# Unit tests (Jest)
npm run test

# E2E tests (Playwright)
npm run test:e2e
```

---

## 📦 Deployment

### Backend (Render)
1. Connect GitHub repository to Render
2. Set environment variables in Render dashboard
3. Deploy automatically on `git push`

### Frontend (Vercel)
```bash
npm run build
vercel deploy
```

Set `VITE_API_URL` to your Render backend URL in Vercel's environment variables.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see LICENSE file for details

---

## 👨‍💻 Developer

Built by [@ashkam58](https://github.com/ashkam58)

**Questions?** Open an issue on GitHub!
