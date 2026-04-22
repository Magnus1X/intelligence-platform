# Intelligence Platform

An advanced, AI-powered coding and interview preparation suite designed to help developers master algorithms, ace technical interviews, and understand complex code using the power of Google Gemini AI.

## 🚀 Features

- **Practice Arena:** A high-fidelity, LeetCode-style code editor powered by Monaco Editor. Features multi-language support (JS, TS, Python, Java, C++), instant remote code execution, and comprehensive test case validation.
- **AI Interview Prep:** Dynamic, AI-generated mock interview sessions tailored to specific roles, difficulties, and topics. Receive real-time evaluations and constructive feedback.
- **Code Intelligence:** Instantly analyze time/space complexity, detect anti-patterns, and generate beginner-friendly explanations for any block of code using Gemini 2.5 Flash.
- **Career Roadmaps:** Structured, progress-tracked learning paths for Placements and Internships.
- **Secure Authentication:** Seamless Google OAuth 2.0 integration via Passport.js and secure JWT session management.

## 💻 Tech Stack

**Frontend:**
- React 18 & Vite
- TypeScript
- Tailwind CSS
- Monaco Editor (vs-code engine)
- React Router DOM

**Backend:**
- Node.js & Express
- MongoDB & Mongoose
- Google Generative AI SDK (Gemini)
- Passport.js (Google OAuth20)
- JSON Web Tokens (JWT) & Bcrypt

## ⚙️ Local Development

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas URI
- Google Gemini API Keys
- Google OAuth Client ID & Secret

### 1. Clone & Install
```bash
git clone https://github.com/Magnus1X/intelligence-platform.git
cd intelligence-platform

# Install Backend Dependencies
cd backend
npm install

# Install Frontend Dependencies
cd ../frontend
npm install
```

### 2. Environment Variables
Create a `.env` file in the `backend` directory:
```env
PORT=5001
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY_1=your_gemini_key_here
GEMINI_API_KEY_2=your_gemini_key_here
GEMINI_API_KEY_3=your_gemini_key_here
GEMINI_API_KEY_4=your_gemini_key_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FRONTEND_URL=http://localhost:5173
```

Create a `.env.local` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5001
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 3. Start Development Servers
```bash
# Terminal 1: Start Backend (Port 5001)
cd backend
npm run dev

# Terminal 2: Start Frontend (Port 5173)
cd frontend
npm run dev
```

## 📄 License
This project is proprietary and confidential. Unauthorized copying of this file, via any medium, is strictly prohibited.
