import { useEffect, useRef, useState } from "react";
import api from "../services/api";
import { AlertCircle, CheckCircle, ChevronRight, Loader2, RotateCcw, Timer } from "lucide-react";

type Option = {
  id: string | number;
  label: string;
  desc: string;
};

const ROLES: Option[] = [
  { id: "Frontend Developer", label: "Frontend Developer", desc: "UI architecture, state, performance, and accessibility." },
  { id: "Backend Developer", label: "Backend Developer", desc: "APIs, databases, distributed systems, and reliability." },
  { id: "Full Stack Developer", label: "Full Stack Developer", desc: "End-to-end product thinking across client and server." },
  { id: "Data Scientist", label: "Data Scientist", desc: "Statistics, experiments, models, and data storytelling." },
  { id: "DevOps Engineer", label: "DevOps Engineer", desc: "CI/CD, cloud infrastructure, automation, and incident response." },
  { id: "Mobile Developer", label: "Mobile Developer", desc: "Native patterns, performance constraints, and mobile UX." },
];

type RoleId = (typeof ROLES)[number]["id"];

const CATEGORY_OPTIONS_BY_ROLE: Record<RoleId, Option[]> = {
  "Frontend Developer": [
    { id: "javascript", label: "JavaScript", desc: "Core JavaScript, async behavior, closures, and browser-side debugging." },
    { id: "html-css", label: "HTML & CSS", desc: "Semantic markup, responsive layouts, accessibility, and styling tradeoffs." },
    { id: "react", label: "React", desc: "Hooks, state flow, rendering behavior, composition, and performance." },
    { id: "frontend-system-design", label: "Frontend System Design", desc: "Large-scale UI architecture, caching, and client performance strategy." },
    { id: "behavioral", label: "Behavioral", desc: "Communication, ownership, prioritization, and collaboration." },
  ],
  "Backend Developer": [
    { id: "backend-fundamentals", label: "Backend Fundamentals", desc: "Service design, validation, APIs, and backend execution flow." },
    { id: "databases", label: "Databases", desc: "Modeling, indexing, transactions, consistency, and query design." },
    { id: "apis", label: "APIs", desc: "REST or GraphQL design, auth, versioning, and contracts." },
    { id: "system-design", label: "System Design", desc: "Scalability, caching, resilience, queues, and distributed tradeoffs." },
    { id: "behavioral", label: "Behavioral", desc: "Communication, ownership, prioritization, and collaboration." },
  ],
  "Full Stack Developer": [
    { id: "frontend", label: "Frontend", desc: "Client-side architecture, state, rendering flow, forms, and UX tradeoffs." },
    { id: "backend", label: "Backend", desc: "Server-side logic, auth, APIs, validation, and reliability patterns." },
    { id: "databases", label: "Databases", desc: "Data modeling, indexing, joins, and transaction boundaries." },
    { id: "system-design", label: "System Design", desc: "How the full product scales across client, server, and storage." },
    { id: "behavioral", label: "Behavioral", desc: "Communication, ownership, prioritization, and collaboration." },
  ],
  "Data Scientist": [
    { id: "python-data", label: "Python for Data", desc: "Data wrangling, analysis tooling, pandas workflows, and practical coding." },
    { id: "statistics", label: "Statistics", desc: "Probability, experimentation, hypothesis testing, and interpretation." },
    { id: "machine-learning", label: "Machine Learning", desc: "Model choice, metrics, bias-variance tradeoffs, and evaluation." },
    { id: "sql-analytics", label: "SQL & Analytics", desc: "Joins, aggregations, exploratory analysis, and business-facing data questions." },
    { id: "behavioral", label: "Behavioral", desc: "Communication, ownership, prioritization, and collaboration." },
  ],
  "DevOps Engineer": [
    { id: "linux-networking", label: "Linux & Networking", desc: "Shell fluency, operating systems, networking basics, and troubleshooting." },
    { id: "cloud-infrastructure", label: "Cloud Infrastructure", desc: "Cloud services, networking, IaC, and platform reliability." },
    { id: "ci-cd", label: "CI/CD", desc: "Build pipelines, deployment safety, rollout strategy, and automation." },
    { id: "observability", label: "Observability", desc: "Metrics, logging, tracing, alerting, and incident response." },
    { id: "behavioral", label: "Behavioral", desc: "Communication, ownership, prioritization, and collaboration." },
  ],
  "Mobile Developer": [
    { id: "mobile-fundamentals", label: "Mobile Fundamentals", desc: "App lifecycle, state, performance, UX constraints, and device behavior." },
    { id: "android-ios", label: "Android / iOS", desc: "Platform APIs, native behaviors, permissions, and mobile platform tradeoffs." },
    { id: "mobile-system-design", label: "Mobile System Design", desc: "Offline sync, local persistence, caching, and mobile app data flow." },
    { id: "testing-release", label: "Testing & Release", desc: "QA strategy, crash debugging, store releases, and monitoring." },
    { id: "behavioral", label: "Behavioral", desc: "Communication, ownership, prioritization, and collaboration." },
  ],
};

const ALL_CATEGORY_OPTIONS = Array.from(
  new Map(Object.values(CATEGORY_OPTIONS_BY_ROLE).flat().map((option) => [option.id, option])).values()
);

const DIFFICULTIES: Option[] = [
  { id: "easy", label: "Easy", desc: "Warm-up questions and fundamentals." },
  { id: "medium", label: "Medium", desc: "Balanced interview-style questions with reasoning depth." },
  { id: "hard", label: "Hard", desc: "Stretch questions with tougher edge cases and tradeoffs." },
];

const QUESTION_COUNT_OPTIONS: Option[] = [
  { id: 3, label: "3 Questions", desc: "Quick practice when you want a focused session." },
  { id: 5, label: "5 Questions", desc: "Balanced default for regular mock interview prep." },
  { id: 8, label: "8 Questions", desc: "Longer session for deeper repetition and endurance." },
  { id: 10, label: "10 Questions", desc: "Full prep run before demos, reviews, or hosting." },
];

const DIFF_STYLE: Record<string, string> = {
  easy: "border-green-300 bg-green-50 text-green-700",
  medium: "border-yellow-300 bg-yellow-50 text-yellow-700",
  hard: "border-red-300 bg-red-50 text-red-700",
};

const DIFF_RING: Record<string, string> = {
  easy: "ring-green-200",
  medium: "ring-yellow-200",
  hard: "ring-red-200",
};

interface Question {
  _id: string;
  content: string;
  difficulty: string;
  category: string;
  responseType: "written" | "choice";
  options?: string[];
}

interface Session {
  _id: string;
  role: string;
  status: string;
}

interface EvalResult {
  aiScore: number;
  strengths: string;
  weaknesses: string;
  suggestions: string;
}

function getOptionLabel(options: Option[], value: string | number) {
  return options.find((option) => option.id === value)?.label ?? String(value);
}

function OptionCardGroup<T extends string | number>({
  label,
  helper,
  options,
  value,
  onChange,
}: {
  label: string;
  helper: string;
  options: { id: T; label: string; desc: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <section className="space-y-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">{label}</p>
        <p className="mt-1 text-sm text-gray-500">{helper}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {options.map((option) => {
          const active = option.id === value;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={`rounded-2xl border p-4 text-left transition ${
                active
                  ? "border-black bg-black text-white shadow-sm"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{option.label}</p>
                  <p className={`mt-2 text-sm leading-6 ${active ? "text-white/75" : "text-gray-500"}`}>
                    {option.desc}
                  </p>
                </div>
                <span
                  className={`mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full border ${
                    active ? "border-white bg-white" : "border-gray-300 bg-transparent"
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900 text-right">{value}</span>
    </div>
  );
}

function ProgressDot({
  label,
  active,
  complete,
}: {
  label: number;
  active: boolean;
  complete: boolean;
}) {
  return (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition ${
        active
          ? "border-black bg-black text-white"
          : complete
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-gray-200 bg-white text-gray-400"
      }`}
    >
      {label}
    </div>
  );
}

export default function InterviewPage() {
  const [step, setStep] = useState<"setup" | "session" | "complete">("setup");
  const [role, setRole] = useState<RoleId>(ROLES[0].id as RoleId);
  const [category, setCategory] = useState(CATEGORY_OPTIONS_BY_ROLE[ROLES[0].id as RoleId][0]?.id ?? "");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [questionCountSelection, setQuestionCountSelection] = useState<number>(5);
  const [session, setSession] = useState<Session | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [evaluation, setEvaluation] = useState<EvalResult | null>(null);
  const [history, setHistory] = useState<{ question: string; eval: EvalResult }[]>([]);
  const [startingSession, setStartingSession] = useState(false);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [finishingSession, setFinishingSession] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [timer, setTimer] = useState(120);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (step !== "session") return;

    setTimer(120);
    timerRef.current = setInterval(() => {
      setTimer((value) => (value > 0 ? value - 1 : 0));
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step, currentIdx]);

  useEffect(() => {
    const validCategories = CATEGORY_OPTIONS_BY_ROLE[role] ?? [];
    if (!validCategories.some((option) => option.id === category)) {
      setCategory(validCategories[0]?.id ?? "");
    }
  }, [role, category]);

  const startSession = async () => {
    setStartingSession(true);
    setErrorMessage(null);

    try {
      const { data } = await api.post("/interview/sessions", {
        role,
        category,
        difficulty,
        questionCount: questionCountSelection,
      });
      const nextQuestions = (data.data.questions as Question[]) ?? [];

      if (nextQuestions.length === 0) {
        throw new Error("No questions were generated for this setup. Try another option set.");
      }

      setSession(data.data.session);
      setQuestions(nextQuestions);
      setCurrentIdx(0);
      setAnswer("");
      setSelectedOption("");
      setEvaluation(null);
      setHistory([]);
      setStep("session");
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || error.message || "Unable to start the interview session.");
    } finally {
      setStartingSession(false);
    }
  };

  const submitAnswer = async () => {
    const activeQuestion = questions[currentIdx];
    const responseText =
      activeQuestion?.responseType === "choice"
        ? selectedOption.trim()
        : answer.trim();

    if (!session || !activeQuestion || !responseText) return;

    setSubmittingAnswer(true);
    setErrorMessage(null);

    try {
      const { data } = await api.post("/interview/answers", {
        sessionId: session._id,
        questionId: activeQuestion._id,
        responseText,
      });

      const nextEvaluation: EvalResult = data.data;
      setEvaluation(nextEvaluation);
      setHistory((existing) => [...existing, { question: activeQuestion.content, eval: nextEvaluation }]);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || error.message || "Unable to submit the answer.");
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const completeSession = async () => {
    setFinishingSession(true);
    setErrorMessage(null);

    try {
      if (session) {
        await api.patch(`/interview/sessions/${session._id}/complete`);
      }
      setStep("complete");
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || error.message || "Unable to complete the session.");
    } finally {
      setFinishingSession(false);
    }
  };

  const nextQuestion = () => {
    if (currentIdx + 1 >= questions.length) {
      void completeSession();
      return;
    }

    setCurrentIdx((value) => value + 1);
    setAnswer("");
    setSelectedOption("");
    setEvaluation(null);
    setErrorMessage(null);
  };

  const reset = () => {
    setStep("setup");
    setSession(null);
    setQuestions([]);
    setCurrentIdx(0);
    setAnswer("");
    setSelectedOption("");
    setEvaluation(null);
    setHistory([]);
    setErrorMessage(null);
    setTimer(120);
  };

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  const selectedQuestion = questions[currentIdx];
  const questionCount = questions.length;
  const progressPercent = questionCount ? ((currentIdx + 1) / questionCount) * 100 : 0;
  const averageScore = history.length
    ? Math.round(history.reduce((sum, item) => sum + item.eval.aiScore, 0) / history.length)
    : 0;
  const currentCategoryOptions = CATEGORY_OPTIONS_BY_ROLE[role] ?? [];
  const estimatedDurationMinutes = questionCountSelection * 2;
  const isChoiceQuestion = selectedQuestion?.responseType === "choice";
  const optionList = selectedQuestion?.options ?? [];

  if (step === "setup") {
    return (
      <div className="mx-auto max-w-6xl space-y-5 sm:space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold sm:text-3xl">Interview Preparation</h2>
          <p className="max-w-3xl text-sm leading-6 text-gray-500 sm:text-base">
            Build a mock interview from clear options, then work through a timed session that mixes selectable questions and written responses across every screen size.
          </p>
        </div>

        {errorMessage && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p>{errorMessage}</p>
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            <OptionCardGroup
              label="Role Options"
              helper="Choose the job profile you want the interviewer to target."
              options={ROLES}
              value={role}
              onChange={(value) => setRole(value as RoleId)}
            />

            <OptionCardGroup
              label="Interview Track"
              helper="Track options now change with the role, so you only see topics that actually fit that interview path."
              options={currentCategoryOptions}
              value={category}
              onChange={setCategory}
            />

            <OptionCardGroup
              label="Difficulty"
              helper="Set the level you want before generating the five-question session."
              options={DIFFICULTIES}
              value={difficulty}
              onChange={(value) => setDifficulty(value as "easy" | "medium" | "hard")}
            />

            <OptionCardGroup
              label="Session Length"
              helper="Choose how many questions you want in this mock interview."
              options={QUESTION_COUNT_OPTIONS}
              value={questionCountSelection}
              onChange={(value) => setQuestionCountSelection(Number(value))}
            />
          </div>

          <aside className="rounded-3xl border border-gray-200 bg-gray-50 p-5 sm:p-6 xl:sticky xl:top-8 xl:self-start">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Session Preview</p>
              <h3 className="text-xl font-bold text-gray-900">Your setup is option-based now</h3>
              <p className="text-sm leading-6 text-gray-500">
                Choose a role, track, difficulty, and question count from the cards, then start a timed mock interview with both option-based and written questions.
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-gray-200 bg-white px-3 py-4 text-center">
                <p className="text-lg font-bold">{questionCountSelection}</p>
                <p className="mt-1 text-xs text-gray-500">Questions</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white px-3 py-4 text-center">
                <p className="text-lg font-bold">2m</p>
                <p className="mt-1 text-xs text-gray-500">Per question</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white px-3 py-4 text-center">
                <p className="text-lg font-bold">{estimatedDurationMinutes}m</p>
                <p className="mt-1 text-xs text-gray-500">Est. total</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white px-3 py-4 text-center">
                <p className="text-lg font-bold">AI</p>
                <p className="mt-1 text-xs text-gray-500">Feedback</p>
              </div>
            </div>

            <div className="mt-6 space-y-3 rounded-2xl border border-gray-200 bg-white p-4">
              <SummaryRow label="Role" value={getOptionLabel(ROLES, role)} />
              <SummaryRow label="Track" value={getOptionLabel(ALL_CATEGORY_OPTIONS, category)} />
              <SummaryRow label="Questions" value={getOptionLabel(QUESTION_COUNT_OPTIONS, questionCountSelection)} />
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-gray-500">Difficulty</span>
                <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${DIFF_STYLE[difficulty]}`}>
                  {difficulty}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={startSession}
              disabled={startingSession}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {startingSession ? <Loader2 size={16} className="animate-spin" /> : <ChevronRight size={16} />}
              Start Interview
            </button>
          </aside>
        </div>
      </div>
    );
  }

  if (step === "session") {
    if (!selectedQuestion) {
      return (
        <div className="mx-auto max-w-3xl rounded-3xl border border-gray-200 bg-white p-6 sm:p-8">
          <div className="flex items-center gap-3 text-gray-500">
            <Loader2 size={18} className="animate-spin" />
            <p className="text-sm">Preparing your interview question...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-6xl space-y-5">
        <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Live Session</p>
              <h2 className="text-xl font-bold sm:text-2xl">{getOptionLabel(ROLES, role)}</h2>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600">
                  {getOptionLabel(ALL_CATEGORY_OPTIONS, category)}
                </span>
                <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${DIFF_STYLE[difficulty]}`}>
                  {difficulty}
                </span>
                <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600">
                  Question {currentIdx + 1} of {questionCount}
                </span>
              </div>
            </div>

            <div
              className={`flex items-center gap-2 self-start rounded-full border px-3 py-2 font-mono text-sm ${
                timer < 30 ? "border-red-300 bg-red-50 text-red-600" : "border-gray-200 bg-white text-gray-600"
              }`}
            >
              <Timer size={14} />
              {formatTime(timer)}
            </div>
          </div>

          <div className="mt-4 h-2 w-full rounded-full bg-gray-100">
            <div className="h-2 rounded-full bg-black transition-all" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {errorMessage && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p>{errorMessage}</p>
          </div>
        )}

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_320px]">
          <div className="space-y-5">
            <section className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Interview Question</p>
              <p className="mt-4 text-base font-semibold leading-8 text-gray-900 sm:text-lg">
                {selectedQuestion.content}
              </p>
            </section>

            {!evaluation ? (
              <section className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6">
                <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Response Mode</p>
                  <p className="mt-2 text-sm font-semibold text-gray-900">
                    {isChoiceQuestion ? "Select the best option for this question." : "Write your answer in the text box below."}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    {isChoiceQuestion
                      ? "This question is option-based. Pick one choice, then submit it for AI feedback."
                      : "This question needs a written response. Explain your thinking clearly and mention tradeoffs when relevant."}
                  </p>
                </div>

                {isChoiceQuestion ? (
                  <div className="mt-4 space-y-3">
                    <div className="grid gap-3 md:grid-cols-2">
                      {optionList.map((option, index) => {
                        const isActive = selectedOption === option;

                        return (
                          <button
                            key={`${selectedQuestion._id}-${index}`}
                            type="button"
                            onClick={() => setSelectedOption(option)}
                            className={`rounded-2xl border px-4 py-4 text-left text-sm font-medium transition ${
                              isActive
                                ? "border-black bg-black text-white"
                                : "border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                            }`}
                          >
                            <span className={`mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold ${
                              isActive ? "border-white/40 bg-white/10 text-white" : "border-gray-300 text-gray-500"
                            }`}>
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span className="align-middle">{option}</span>
                          </button>
                        );
                      })}
                    </div>

                    <p className="text-xs text-gray-400">
                      {selectedOption ? `Selected option: ${selectedOption}` : "No option selected yet."}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Your written answer</p>
                        <p className="mt-1 text-sm text-gray-500">
                          The evaluator will score clarity, depth, and direction.
                        </p>
                      </div>
                      <span className="text-xs font-medium text-gray-400">{answer.trim().split(/\s+/).filter(Boolean).length} words</span>
                    </div>

                    <textarea
                      value={answer}
                      onChange={(event) => setAnswer(event.target.value)}
                      rows={10}
                      placeholder="Explain your thinking clearly, mention tradeoffs, and give examples where relevant."
                      className="mt-4 min-h-[220px] w-full rounded-2xl border border-gray-300 px-4 py-4 text-sm leading-6 text-gray-800 transition focus:border-black focus:outline-none sm:min-h-[240px]"
                    />
                  </>
                )}

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={submitAnswer}
                    disabled={submittingAnswer || (isChoiceQuestion ? !selectedOption.trim() : !answer.trim())}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submittingAnswer ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
                    Submit Answer
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAnswer("");
                      setSelectedOption("");
                    }}
                    disabled={isChoiceQuestion ? !selectedOption : !answer}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:border-gray-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <RotateCcw size={15} />
                    {isChoiceQuestion ? "Clear Selection" : "Clear Response"}
                  </button>
                </div>
              </section>
            ) : (
              <section className={`rounded-3xl border border-gray-200 bg-white p-5 shadow-sm ring-4 sm:p-6 ${DIFF_RING[difficulty]}`}>
                <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Evaluation</p>
                    <h3 className="mt-2 text-xl font-bold text-gray-900">AI feedback for this answer</h3>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Score</p>
                    <p className="mt-1 text-3xl font-extrabold text-gray-900">
                      {evaluation.aiScore}
                      <span className="ml-1 text-sm font-medium text-gray-400">/100</span>
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl border border-green-100 bg-green-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-green-600">Strengths</p>
                    <p className="mt-2 text-sm leading-6 text-gray-700">{evaluation.strengths}</p>
                  </div>
                  <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-red-500">Weaknesses</p>
                    <p className="mt-2 text-sm leading-6 text-gray-700">{evaluation.weaknesses}</p>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Suggestions</p>
                    <p className="mt-2 text-sm leading-6 text-gray-700">{evaluation.suggestions}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={nextQuestion}
                  disabled={finishingSession}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {finishingSession && currentIdx + 1 >= questionCount ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <ChevronRight size={15} />
                  )}
                  {currentIdx + 1 >= questionCount ? "View Session Results" : "Next Question"}
                </button>
              </section>
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5 sm:p-6 xl:sticky xl:top-8">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Session Status</p>
                <h3 className="text-lg font-bold text-gray-900">Stay oriented while you answer</h3>
              </div>

              <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-5">
                {questions.map((question, index) => (
                  <ProgressDot
                    key={question._id}
                    label={index + 1}
                    active={index === currentIdx}
                    complete={index < history.length}
                  />
                ))}
              </div>

              <div className="mt-5 space-y-3 rounded-2xl border border-gray-200 bg-white p-4">
                <SummaryRow label="Answered" value={`${history.length}/${questionCount}`} />
                <SummaryRow label="Current track" value={getOptionLabel(ALL_CATEGORY_OPTIONS, selectedQuestion.category)} />
                <SummaryRow label="Question type" value={isChoiceQuestion ? "Option-based" : "Written"} />
                <SummaryRow label="Session length" value={`${questionCount} questions`} />
                <SummaryRow label="Difficulty" value={getOptionLabel(DIFFICULTIES, difficulty)} />
              </div>

              <button
                type="button"
                onClick={() => void completeSession()}
                disabled={finishingSession}
                className="mt-5 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 transition hover:border-gray-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                {finishingSession ? "Ending session..." : "End Session Early"}
              </button>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="rounded-3xl border border-gray-200 bg-white p-6 text-center sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Session Complete</p>
        <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">Interview review ready</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
          You completed an option-based interview session for {getOptionLabel(ROLES, role)} focused on {getOptionLabel(ALL_CATEGORY_OPTIONS, category)}.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Average Score</p>
            <p className="mt-2 text-3xl font-extrabold text-gray-900">{averageScore}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Questions Answered</p>
            <p className="mt-2 text-3xl font-extrabold text-gray-900">{history.length}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Session Length</p>
            <p className="mt-2 text-3xl font-extrabold text-gray-900">{questionCount}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Difficulty</p>
            <p className="mt-2 text-3xl font-extrabold capitalize text-gray-900">{difficulty}</p>
          </div>
        </div>
      </section>

      {errorMessage && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2">
        {history.map((item, index) => (
          <article key={index} className="rounded-3xl border border-gray-200 bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Question {index + 1}</p>
                <p className="mt-2 text-sm font-medium leading-6 text-gray-900">{item.question}</p>
              </div>
              <span className="shrink-0 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-semibold text-gray-700">
                {item.eval.aiScore}/100
              </span>
            </div>

            <div className="mt-4 h-2 w-full rounded-full bg-gray-100">
              <div
                className={`h-2 rounded-full ${
                  item.eval.aiScore >= 70 ? "bg-green-500" : item.eval.aiScore >= 40 ? "bg-yellow-400" : "bg-red-400"
                }`}
                style={{ width: `${item.eval.aiScore}%` }}
              />
            </div>

            <p className="mt-4 text-sm leading-6 text-gray-500">{item.eval.suggestions}</p>
          </article>
        ))}
      </section>

      <button
        type="button"
        onClick={reset}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
      >
        <RotateCcw size={15} />
        Start New Session
      </button>
    </div>
  );
}
