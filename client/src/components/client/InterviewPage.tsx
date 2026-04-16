import { useState, useEffect, useRef } from "react";
import type { InterviewState } from "../../types";
import { getInterview, submitInterviewAnswer } from "../../lib/api";
import { useToast } from "../../context/ToastContext";
import { Card } from "../ui/Card";
import { Btn } from "../ui/Btn";

function getTokenFromUrl(): string | null {
  return new URLSearchParams(window.location.search).get("token");
}

export function InterviewPage() {
  const toast = useToast();
  const token = getTokenFromUrl();
  const [interview, setInterview] = useState<InterviewState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!token) {
      setError("No interview token provided. Please use the link from your email.");
      setLoading(false);
      return;
    }
    fetchInterview();
  }, []);

  const fetchInterview = async () => {
    try {
      const data = await getInterview(token!);
      setInterview(data);
      if (data.status === "expired") {
        setError("This interview link has expired. Please contact us for a new one.");
      }
    } catch {
      setError("Invalid or expired interview link.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [interview?.answeredCount, showTyping]);

  const handleSubmit = async () => {
    if (!token || !interview || !answer.trim()) return;

    const currentIdx = interview.currentQuestionIndex;
    setSubmitting(true);

    try {
      const result = await submitInterviewAnswer(token, currentIdx, answer.trim());
      setAnswer("");

      if (result.completed) {
        setInterview(prev => prev ? {
          ...prev,
          status: "completed",
          answeredCount: result.answeredCount,
          questions: prev.questions.map((q, i) =>
            i === currentIdx ? { ...q, answered: true } : q
          ),
        } : null);
      } else {
        // Show typing indicator briefly
        setShowTyping(true);
        setTimeout(() => {
          setShowTyping(false);
          setInterview(prev => prev ? {
            ...prev,
            status: "in_progress",
            currentQuestionIndex: result.nextQuestionIndex!,
            answeredCount: result.answeredCount,
            questions: prev.questions.map((q, i) =>
              i === currentIdx ? { ...q, answered: true } : q
            ),
          } : null);
          textareaRef.current?.focus();
        }, 800);
      }
    } catch {
      toast("Failed to submit answer. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // ── Loading / Error States ──
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-bg">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">{"🤖"}</div>
          <p className="text-sm text-secondary">Loading interview...</p>
        </div>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="h-full flex items-center justify-center bg-bg px-4">
        <Card className="max-w-md w-full p-8! text-center">
          <div className="text-4xl mb-4">{"⚠️"}</div>
          <h2 className="text-lg font-bold text-main mb-2">Interview Unavailable</h2>
          <p className="text-sm text-secondary mb-6">{error || "Something went wrong."}</p>
          <Btn onClick={() => window.location.href = "/careers"}>Back to Careers</Btn>
        </Card>
      </div>
    );
  }

  // ── Completed State ──
  if (interview.status === "completed") {
    return (
      <div className="h-full overflow-auto bg-bg">
        <div className="max-w-155 mx-auto px-6 py-20 text-center">
          <div className="text-6xl mb-6">{"🎉"}</div>
          <h1 className="text-3xl font-extrabold text-main mb-2 -tracking-[1px]">Interview Complete!</h1>
          <p className="text-base text-secondary leading-[1.7] mb-8">
            Thank you for completing the AI interview. Our team is now reviewing your responses
            and will be in touch soon.
          </p>
          <Card className="p-6! mb-6 text-left">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[11px] text-muted font-semibold mb-1">Questions</div>
                <div className="text-lg font-bold text-main">{interview.totalQuestions}</div>
              </div>
              <div>
                <div className="text-[11px] text-muted font-semibold mb-1">Answered</div>
                <div className="text-lg font-bold text-accent">{interview.answeredCount}</div>
              </div>
            </div>
          </Card>
          <Btn onClick={() => window.location.href = "/"}>Back to Website</Btn>
        </div>
      </div>
    );
  }

  // ── Active Interview ──
  const currentQ = interview.questions[interview.currentQuestionIndex];
  const answeredQuestions = interview.questions.filter(q => q.answered);
  const progress = (interview.answeredCount / interview.totalQuestions) * 100;

  return (
    <div className="h-full flex flex-col bg-bg">
      {/* Header */}
      <header className="px-4 md:px-8 h-16 flex items-center justify-between border-b border-border bg-surface shrink-0">
        <div className="flex items-center gap-3">
          <img src="/codnexiafav.png" alt="Codnexia" className="w-7 h-7" />
          <span className="text-[15px] font-bold text-main">
            Codnexia <span className="text-accent font-normal">Interview</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted">
            Question {interview.answeredCount + 1} of {interview.totalQuestions}
          </span>
          <div className="w-24 md:w-32 h-1.5 rounded-sm bg-bg overflow-hidden">
            <div
              className="h-full bg-grad rounded-sm transition-[width] duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-accent font-bold">{Math.round(progress)}%</span>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-auto px-4 md:px-8 py-6">
        <div className="max-w-170 mx-auto space-y-5">
          {/* Welcome message */}
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-lg bg-grad flex items-center justify-center text-sm shrink-0">
              {"🤖"}
            </div>
            <div className="bg-surface border border-border rounded-xl rounded-tl-none px-5 py-3.5 max-w-[80%]">
              <p className="text-sm text-secondary leading-[1.7]">
                Welcome to your AI interview! I'll ask you {interview.totalQuestions} questions
                covering different areas. Take your time with each answer — there's no time limit
                per question. Press <strong className="text-main">Enter</strong> to submit or{" "}
                <strong className="text-main">Shift+Enter</strong> for a new line.
              </p>
            </div>
          </div>

          {/* Answered Q&A pairs */}
          {answeredQuestions.map((q) => (
            <div key={q.index} className="space-y-3">
              {/* AI Question */}
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-lg bg-grad flex items-center justify-center text-sm shrink-0">
                  {"🤖"}
                </div>
                <div className="bg-surface border border-border rounded-xl rounded-tl-none px-5 py-3.5 max-w-[80%]">
                  <div className="text-[10px] text-accent font-bold uppercase tracking-wide mb-1.5">
                    {q.category}
                  </div>
                  <p className="text-sm text-main leading-[1.7]">{q.question}</p>
                </div>
              </div>
              {/* User answer indicator */}
              <div className="flex justify-end">
                <div className="bg-accent/10 border border-accent/20 rounded-xl rounded-tr-none px-5 py-3 max-w-[80%]">
                  <p className="text-sm text-accent/80 italic">Answer submitted</p>
                </div>
              </div>
            </div>
          ))}

          {/* Current question */}
          {currentQ && !currentQ.answered && (
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-lg bg-grad flex items-center justify-center text-sm shrink-0">
                {"🤖"}
              </div>
              <div className="bg-surface border border-border rounded-xl rounded-tl-none px-5 py-3.5 max-w-[80%]">
                <div className="text-[10px] text-accent font-bold uppercase tracking-wide mb-1.5">
                  {currentQ.category}
                </div>
                <p className="text-sm text-main leading-[1.7]">{currentQ.question}</p>
              </div>
            </div>
          )}

          {/* Typing indicator */}
          {showTyping && (
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-lg bg-grad flex items-center justify-center text-sm shrink-0">
                {"🤖"}
              </div>
              <div className="bg-surface border border-border rounded-xl rounded-tl-none px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-accent/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-accent/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-accent/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input Area */}
      {interview.status !== "completed" && currentQ && !currentQ.answered && (
        <div className="px-4 md:px-8 py-4 border-t border-border bg-surface shrink-0">
          <div className="max-w-170 mx-auto flex gap-3">
            <textarea
              ref={textareaRef}
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your answer..."
              rows={3}
              autoFocus
              className="flex-1 px-4 py-3 rounded-xl bg-card border border-border text-main text-sm font-sans outline-none resize-none transition-colors duration-200 focus:border-accent/40"
            />
            <div className="flex flex-col gap-2">
              <Btn
                onClick={handleSubmit}
                disabled={submitting || !answer.trim()}
                className="h-full px-6!"
              >
                {submitting ? "..." : "Send"}
              </Btn>
            </div>
          </div>
          <div className="max-w-170 mx-auto mt-2 flex justify-between">
            <span className="text-[10px] text-muted">
              Shift+Enter for new line
            </span>
            <span className="text-[10px] text-muted">
              {answer.length} / 10,000
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
