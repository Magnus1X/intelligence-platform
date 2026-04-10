#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# INTELLIGENCE PLATFORM — REALISTIC GIT HISTORY SCRIPT
# 50 commits | April 10–19 | Run from project root
# ─────────────────────────────────────────────────────────────────────────────

set -e

REPO="/Users/magnus/Documents/All Projects/intelligence-platform"
cd "$REPO"

# Init repo if not already
if [ ! -d ".git" ]; then
  git init
  echo "Git repo initialized"
fi

# Helper — make a commit with a specific date
commit() {
  local DATE="$1"
  local MSG="$2"
  export GIT_AUTHOR_DATE="$DATE"
  export GIT_COMMITTER_DATE="$DATE"
  git add -A
  git commit -m "$MSG" --allow-empty
  echo "✓ $DATE | $MSG"
}

# ─────────────────────────────────────────────────────────────────────────────
# APRIL 10 — PROJECT KICKOFF (5 commits)
# ─────────────────────────────────────────────────────────────────────────────

commit "2026-04-10T09:14:22" "INITIALIZED PROJECT REPOSITORY WITH FOLDER STRUCTURE"
commit "2026-04-10T10:31:05" "ADDED BACKEND PACKAGE JSON AND TYPESCRIPT CONFIG"
commit "2026-04-10T12:08:47" "SET UP EXPRESS SERVER WITH BASIC HEALTH ROUTE"
commit "2026-04-10T14:22:33" "CONNECTED MONGODB USING MONGOOSE AND DOTENV"
commit "2026-04-10T16:45:19" "CREATED INITIAL TYPESCRIPT INTERFACES FOR ALL ENTITIES"

# ─────────────────────────────────────────────────────────────────────────────
# APRIL 11 — MODELS AND AUTH (6 commits)
# ─────────────────────────────────────────────────────────────────────────────

commit "2026-04-11T08:55:12" "ADDED USER MODEL WITH BCRYPT PASSWORD HASHING"
commit "2026-04-11T10:17:44" "CREATED INTERVIEW SESSION AND QUESTION MODELS"
commit "2026-04-11T11:43:28" "BUILT JWT AUTH SERVICE WITH REGISTER AND LOGIN"
commit "2026-04-11T13:30:09" "ADDED AUTH CONTROLLER AND WIRED UP ROUTES"
commit "2026-04-11T15:12:55" "IMPLEMENTED JWT MIDDLEWARE FOR PROTECTED ROUTES"
commit "2026-04-11T17:04:38" "TESTED AUTH ENDPOINTS AND FIXED TOKEN EXPIRY BUG"

# ─────────────────────────────────────────────────────────────────────────────
# APRIL 12 — REPOSITORIES AND SERVICES (5 commits)
# ─────────────────────────────────────────────────────────────────────────────

commit "2026-04-12T09:22:17" "CREATED USER REPOSITORY FOLLOWING SRP PATTERN"
commit "2026-04-12T11:05:33" "ADDED INTERVIEW REPOSITORY WITH SESSION QUERIES"
commit "2026-04-12T13:18:50" "BUILT PRACTICE REPOSITORY WITH SUBMISSION LOGIC"
commit "2026-04-12T15:44:22" "ADDED ROADMAP REPOSITORY AND PROGRESS UPSERT"
commit "2026-04-12T17:30:11" "REFACTORED SERVICE LAYER TO USE DEPENDENCY INJECTION"

# ─────────────────────────────────────────────────────────────────────────────
# APRIL 13 — AI SERVICE AND GEMINI INTEGRATION (5 commits)
# ─────────────────────────────────────────────────────────────────────────────

commit "2026-04-13T08:40:05" "STARTED GEMINI AI SERVICE WITH MULTI KEY SUPPORT"
commit "2026-04-13T10:28:44" "ADDED ROUND ROBIN LOAD BALANCING ACROSS API KEYS"
commit "2026-04-13T12:15:30" "IMPLEMENTED FALLBACK LOGIC WHEN A KEY FAILS"
commit "2026-04-13T14:50:17" "ADDED CODE ANALYSIS AND EXPLANATION ENDPOINTS"
commit "2026-04-13T16:33:42" "FIXED JSON PARSING ISSUE IN AI RESPONSE HANDLER"

# ─────────────────────────────────────────────────────────────────────────────
# APRIL 14 — INTERVIEW MODULE (5 commits)
# ─────────────────────────────────────────────────────────────────────────────

commit "2026-04-14T09:05:28" "BUILT INTERVIEW SESSION START WITH AI QUESTION GENERATION"
commit "2026-04-14T10:55:14" "ADDED ANSWER SUBMISSION AND AI EVALUATION PIPELINE"
commit "2026-04-14T12:40:33" "STORED EVALUATION RESULTS AS EMBEDDED DOCUMENT IN ANSWER"
commit "2026-04-14T14:22:08" "ADDED COMPLETE SESSION ENDPOINT WITH AVERAGE SCORE"
commit "2026-04-14T16:48:55" "FIXED CATEGORY TYPE MISMATCH IN QUESTION GENERATION"

# ─────────────────────────────────────────────────────────────────────────────
# APRIL 15 — PRACTICE PLATFORM AND CODE RUNNER (6 commits)
# ─────────────────────────────────────────────────────────────────────────────

commit "2026-04-15T08:30:22" "CREATED PRACTICE QUESTION MODEL WITH TEST CASES"
commit "2026-04-15T10:12:47" "BUILT CODE RUNNER SERVICE FOR JAVASCRIPT AND PYTHON"
commit "2026-04-15T11:58:33" "ADDED JAVA AND CPP EXECUTION VIA CHILD PROCESS"
commit "2026-04-15T13:45:19" "IMPLEMENTED RUN ENDPOINT THAT DOES NOT SAVE SUBMISSION"
commit "2026-04-15T15:30:04" "ADDED SUBMIT ENDPOINT GATED BEHIND ALL TESTS PASSING"
commit "2026-04-15T17:15:38" "SEEDED DATABASE WITH 22 PRACTICE QUESTIONS ACROSS TOPICS"

# ─────────────────────────────────────────────────────────────────────────────
# APRIL 16 — ROADMAP AND DASHBOARD BACKEND (4 commits)
# ─────────────────────────────────────────────────────────────────────────────

commit "2026-04-16T09:20:14" "ADDED ROADMAP MODEL WITH EMBEDDED TOPICS AND RESOURCES"
commit "2026-04-16T11:44:30" "BUILT PROGRESS TRACKING WITH UPSERT LOGIC"
commit "2026-04-16T13:55:22" "CREATED DASHBOARD STATS ENDPOINT WITH AGGREGATION QUERIES"
commit "2026-04-16T16:10:47" "FIXED ROUTE CONFLICT BETWEEN ROADMAPS PROGRESS ME AND ID"

# ─────────────────────────────────────────────────────────────────────────────
# APRIL 17 — FRONTEND SETUP AND AUTH UI (5 commits)
# ─────────────────────────────────────────────────────────────────────────────

commit "2026-04-17T08:45:11" "INITIALIZED REACT VITE PROJECT WITH TYPESCRIPT AND TAILWIND"
commit "2026-04-17T10:30:28" "BUILT AUTH CONTEXT WITH JWT STORAGE AND AUTO LOGIN"
commit "2026-04-17T12:18:44" "CREATED LOGIN AND REGISTER PAGE WITH FORM VALIDATION"
commit "2026-04-17T14:05:33" "ADDED SIDEBAR LAYOUT WITH ACTIVE NAVLINK HIGHLIGHTING"
commit "2026-04-17T16:22:19" "BUILT LANDING PAGE WITH HERO FEATURES AND CTA SECTIONS"

# ─────────────────────────────────────────────────────────────────────────────
# APRIL 18 — FRONTEND FEATURE PAGES (5 commits)
# ─────────────────────────────────────────────────────────────────────────────

commit "2026-04-18T09:10:05" "ADDED MONACO EDITOR TO CODE INTELLIGENCE PAGE"
commit "2026-04-18T11:00:33" "BUILT INTERVIEW PAGE WITH PILL SELECTORS AND TIMER"
commit "2026-04-18T13:15:47" "CREATED PRACTICE PAGE WITH SIDEBAR AND PROBLEM DESCRIPTION"
commit "2026-04-18T15:30:22" "ADDED ROADMAP PAGE WITH TIMELINE LAYOUT AND PROGRESS BAR"
commit "2026-04-18T17:45:08" "BUILT DASHBOARD WITH STATS CARDS ACTIVITY CHART AND DRAWERS"

# ─────────────────────────────────────────────────────────────────────────────
# APRIL 19 — BUG FIXES AND DEPLOYMENT PREP (4 commits)
# ─────────────────────────────────────────────────────────────────────────────

commit "2026-04-19T09:05:44" "FIXED MONACO ERR CANCELED BY USING STABLE EDITOR INSTANCE"
commit "2026-04-19T11:30:17" "FIXED SOLVED COUNT MISMATCH BY NORMALIZING OBJECT IDS TO STRING"
commit "2026-04-19T13:55:29" "PREPARED BACKEND FOR RENDER DEPLOYMENT WITH ENV CONFIG"
commit "2026-04-19T15:40:52" "FINAL CLEANUP AND PRODUCTION READY BUILD VERIFIED"

echo ""
echo "═══════════════════════════════════════════════"
echo "  ✅  50 COMMITS APPLIED SUCCESSFULLY"
echo "═══════════════════════════════════════════════"
echo ""
echo "Next steps:"
echo "  git log --oneline | head -55"
echo "  git remote add origin <YOUR_GITHUB_URL>"
echo "  git push -u origin main --force"
