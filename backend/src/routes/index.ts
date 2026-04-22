import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { CodeController } from "../controllers/code.controller";
import { DashboardController } from "../controllers/dashboard.controller";
import { InterviewController } from "../controllers/interview.controller";
import { PracticeController } from "../controllers/practice.controller";
import { RoadmapController } from "../controllers/roadmap.controller";
import { authenticate, requireAdmin } from "../middleware/auth.middleware";

const router = Router();
const auth = new AuthController();
const code = new CodeController();
const interview = new InterviewController();
const practice = new PracticeController();
const roadmap = new RoadmapController();
const dashboard = new DashboardController();

import passport from "../config/passport";

router.use(passport.initialize());

// Dashboard
router.get("/dashboard/stats", authenticate, dashboard.getStats);

// Auth
router.post("/auth/register", auth.register);
router.post("/auth/login", auth.login);

router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${(process.env.CLIENT_URL || process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/+$/, "")}/auth?error=true` }),
  auth.googleCallback
);

router.get("/auth/me", authenticate, auth.me);
router.put("/auth/profile", authenticate, auth.updateProfile);

// Code Intelligence
router.post("/code/analyze", authenticate, code.analyze);
router.post("/code/explain", authenticate, code.explain);

// Interview
router.post("/interview/sessions", authenticate, interview.startSession);
router.post("/interview/answers", authenticate, interview.submitAnswer);
router.patch("/interview/sessions/:sessionId/complete", authenticate, interview.completeSession);
router.get("/interview/sessions", authenticate, interview.getSessions);
router.get("/interview/sessions/:sessionId", authenticate, interview.getSessionDetails);

// Practice
router.get("/practice/questions", authenticate, practice.getQuestions);
router.get("/practice/questions/:id", authenticate, practice.getQuestion);
router.post("/practice/run", authenticate, practice.run);
router.post("/practice/submit", authenticate, practice.submit);
router.get("/practice/submissions", authenticate, practice.getMySubmissions);
router.get("/practice/leaderboard", practice.getLeaderboard);
router.post("/practice/questions", authenticate, requireAdmin, practice.createQuestion);

// Roadmap
router.get("/roadmaps", authenticate, roadmap.getAll);
router.get("/roadmaps/progress/me", authenticate, roadmap.getMyProgress);
router.get("/roadmaps/:id", authenticate, roadmap.getById);
router.post("/roadmaps", authenticate, requireAdmin, roadmap.create);
router.post("/roadmaps/progress", authenticate, roadmap.updateProgress);
router.get("/roadmaps/:roadmapId/recommend", authenticate, roadmap.getRecommendation);

export default router;
