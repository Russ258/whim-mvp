"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

const QUESTIONS = [
  { key: "overallRating", label: "How was your overall experience?" },
  { key: "valueRating",   label: "Was it good value for money?" },
  { key: "repeatRating",  label: "How likely are you to book again?" },
] as const;

type RatingKey = typeof QUESTIONS[number]["key"];

function StarRow({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered || value);
        return (
          <button
            key={star}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              fontSize: 40,
              lineHeight: 1,
              color: filled ? "#e8829a" : "rgba(61,44,53,0.15)",
              transform: hovered === star ? "scale(1.15)" : "scale(1)",
              transition: "transform 0.1s ease, color 0.1s ease",
            }}
            aria-label={`${star} star`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

function ReviewForm() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") ?? "";
  const q1 = Number(searchParams.get("q1")) || 0;

  const [ratings, setRatings] = useState<Record<RatingKey, number>>({
    overallRating: q1,
    valueRating: 0,
    repeatRating: 0,
  });
  const [step, setStep] = useState(q1 > 0 ? 1 : 0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setRating(key: RatingKey, value: number) {
    setRatings((r) => ({ ...r, [key]: value }));
  }

  async function handleNext() {
    if (step < QUESTIONS.length - 1) {
      setStep((s) => s + 1);
    } else {
      await submit();
    }
  }

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voucherCode: code, ...ratings }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  const currentQuestion = QUESTIONS[step];
  const currentRating = ratings[currentQuestion.key];
  const canProceed = currentRating > 0;

  if (done) {
    return (
      <div style={s.card}>
        <div style={{ fontSize: 56, textAlign: "center", marginBottom: 16, color: "#e8829a" }}>★</div>
        <h2 style={{ ...s.heading, marginBottom: 8 }}>Thank you!</h2>
        <p style={s.sub}>Your feedback helps us bring better salons to Whim.</p>
      </div>
    );
  }

  return (
    <div style={s.card}>
      {/* Progress dots */}
      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 28 }}>
        {QUESTIONS.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === step ? 20 : 8,
              height: 8,
              borderRadius: 4,
              background: i <= step ? "#e8829a" : "rgba(232,130,154,0.2)",
              transition: "width 0.2s ease, background 0.2s ease",
            }}
          />
        ))}
      </div>

      <p style={s.question}>{currentQuestion.label}</p>

      <div style={{ marginBottom: 32 }}>
        <StarRow
          value={currentRating}
          onChange={(v) => setRating(currentQuestion.key, v)}
        />
      </div>

      {error && (
        <p style={{ color: "#c0392b", fontSize: 13, textAlign: "center", marginBottom: 16 }}>
          {error}
        </p>
      )}

      <button
        onClick={handleNext}
        disabled={!canProceed || submitting}
        style={{
          ...s.btn,
          opacity: canProceed && !submitting ? 1 : 0.4,
          cursor: canProceed && !submitting ? "pointer" : "not-allowed",
        }}
      >
        {submitting
          ? "Submitting..."
          : step < QUESTIONS.length - 1
          ? "Next"
          : "Submit"}
      </button>

      <p style={s.skip} onClick={() => step < QUESTIONS.length - 1 ? setStep((s) => s + 1) : submit()}>
        Skip
      </p>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <div style={s.page}>
      <div style={s.wordmark}>Whim</div>
      <p style={s.tagline}>Quick review — 3 questions, no writing</p>

      <Suspense fallback={<div style={s.card}><p style={s.sub}>Loading...</p></div>}>
        <ReviewForm />
      </Suspense>

      <p style={s.footer}>Your feedback is anonymous and only used to improve Whim.</p>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100svh",
    background: "#fdf0f5",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 16px",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  wordmark: {
    fontSize: 40,
    fontWeight: 800,
    color: "#e8829a",
    letterSpacing: "-1px",
    marginBottom: 4,
  },
  tagline: {
    fontSize: 13,
    color: "#a08c96",
    marginBottom: 28,
    textAlign: "center",
  },
  card: {
    width: "100%",
    maxWidth: 380,
    background: "#fff",
    borderRadius: 24,
    padding: "32px 28px",
    border: "1px solid rgba(232,130,154,0.15)",
    boxShadow: "0 8px 40px rgba(61,44,53,0.1)",
    textAlign: "center",
  },
  heading: {
    fontSize: 22,
    fontWeight: 700,
    color: "#3d2c35",
  },
  question: {
    fontSize: 17,
    fontWeight: 600,
    color: "#3d2c35",
    marginBottom: 24,
    lineHeight: 1.4,
  },
  sub: {
    fontSize: 14,
    color: "#a08c96",
    lineHeight: 1.6,
  },
  btn: {
    width: "100%",
    background: "#e8829a",
    color: "#fff",
    border: "none",
    borderRadius: 100,
    padding: "15px 0",
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 12,
    transition: "opacity 0.15s ease",
  },
  skip: {
    fontSize: 13,
    color: "#a08c96",
    cursor: "pointer",
    textDecoration: "underline",
    textUnderlineOffset: 2,
  },
  footer: {
    marginTop: 24,
    fontSize: 11,
    color: "#c4b0b8",
    textAlign: "center",
    maxWidth: 320,
  },
};
