"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  SKILLS,
  FREE_SKILLS,
  getComprehensionPercent,
  SKILL_LEVEL_LABELS,
  type Skill,
} from "@/data/curriculum";

const LEVEL_COLORS: Record<string, string> = {
  beginner: "var(--good)",
  intermediate: "var(--gold)",
  advanced: "var(--accent)",
};

function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ar-SA";
  u.rate = 0.85;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

function ProgressBar({ percent }: { percent: number }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>
          Quran comprehension
        </span>
        <span
          style={{ fontSize: 20, fontWeight: 700, color: "var(--accent)" }}
          className="font-display"
        >
          {percent}%
        </span>
      </div>
      <div
        style={{
          height: 8,
          background: "var(--border)",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${percent}%`,
            background: `linear-gradient(90deg, var(--accent), var(--gold))`,
            borderRadius: 999,
            transition: "width 0.6s ease",
          }}
        />
      </div>
      <p style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 6 }}>
        Unlock all 18 skills → up to 85% Quran comprehension
      </p>
    </div>
  );
}

function SkillRow({
  skill,
  isActive,
  isUnlocked,
  isFree,
  onClick,
}: {
  skill: Skill;
  isActive: boolean;
  isUnlocked: boolean;
  isFree: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        background: isActive ? "var(--accent-light)" : "transparent",
        border: isActive
          ? "1px solid var(--accent)"
          : "1px solid transparent",
        borderRadius: 10,
        padding: "12px 14px",
        cursor: isUnlocked ? "pointer" : "default",
        opacity: isUnlocked ? 1 : 0.45,
        marginBottom: 6,
        display: "flex",
        alignItems: "center",
        gap: 12,
        transition: "background 0.15s, border-color 0.15s",
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: isActive ? "var(--accent)" : "var(--ink-3)",
          minWidth: 20,
        }}
      >
        {skill.id}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "var(--ink)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {skill.title}
        </p>
        <p
          className="font-arabic"
          style={{
            fontSize: 12,
            color: "var(--ink-2)",
            marginTop: 2,
          }}
        >
          {skill.arabicTitle}
        </p>
      </div>
      {!isFree && !isUnlocked && (
        <span style={{ fontSize: 13, color: "var(--ink-3)" }}>🔒</span>
      )}
      {isFree && !isUnlocked && (
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: "var(--good)",
            background: "rgba(26,122,62,0.12)",
            padding: "2px 8px",
            borderRadius: 999,
          }}
        >
          Free
        </span>
      )}
    </button>
  );
}

function ExerciseCard({
  exercise,
  skillId,
}: {
  exercise: Skill["exercises"][0];
  skillId: number;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const key = `ex-${skillId}-${exercise.prompt.slice(0, 20)}`;

  useEffect(() => {
    try {
      setSelected(localStorage.getItem(key));
    } catch {}
  }, [key]);

  function choose(opt: string) {
    setSelected(opt);
    try {
      localStorage.setItem(key, opt);
    } catch {}
  }

  const answered = selected !== null;
  const correct = selected === exercise.answer;

  return (
    <div
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: 20,
        marginTop: 16,
      }}
    >
      <p
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "var(--ink)",
          marginBottom: 14,
        }}
      >
        {exercise.prompt}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {exercise.options?.map((opt) => {
          const isSelected = selected === opt;
          const isCorrect = opt === exercise.answer;
          let bg = "var(--surface)";
          let border = "var(--border)";
          let color = "var(--ink)";
          if (answered && isSelected && correct) {
            bg = "rgba(26,122,62,0.12)";
            border = "var(--good)";
            color = "var(--good)";
          } else if (answered && isSelected && !correct) {
            bg = "rgba(179,49,31,0.1)";
            border = "var(--bad)";
            color = "var(--bad)";
          } else if (answered && isCorrect) {
            bg = "rgba(26,122,62,0.08)";
            border = "var(--good)";
          }

          return (
            <button
              key={opt}
              onClick={() => !answered && choose(opt)}
              style={{
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: 8,
                padding: "10px 14px",
                textAlign: "left",
                fontSize: 14,
                color,
                cursor: answered ? "default" : "pointer",
                fontWeight: isSelected ? 600 : 400,
                transition: "all 0.15s",
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <p
          style={{
            fontSize: 13,
            marginTop: 12,
            color: correct ? "var(--good)" : "var(--bad)",
            fontWeight: 600,
          }}
        >
          {correct ? "✓ Correct" : `✗ Correct answer: ${exercise.answer}`}
        </p>
      )}
    </div>
  );
}

function LessonPanel({ skill, isPro }: { skill: Skill; isPro: boolean }) {
  if (!isPro && !FREE_SKILLS.includes(skill.id)) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 48,
          textAlign: "center",
          gap: 20,
        }}
      >
        <span style={{ fontSize: 48 }}>🔒</span>
        <h2
          className="font-display"
          style={{ fontSize: 28, fontWeight: 700, color: "var(--ink)" }}
        >
          {skill.title}
        </h2>
        <p style={{ fontSize: 16, color: "var(--ink-2)", maxWidth: 400, lineHeight: 1.7 }}>
          This skill is part of the full curriculum. Upgrade to unlock all 18
          skills, exercises, and 12 live classes per month.
        </p>
        <Link
          href="/pricing"
          style={{
            background: "var(--ink)",
            color: "var(--bg)",
            padding: "14px 32px",
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 15,
          }}
        >
          Unlock everything — $50/month →
        </Link>
        <p style={{ fontSize: 13, color: "var(--ink-3)" }}>
          Includes 12 live classes per month with your teacher.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px 40px", maxWidth: 720, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: LEVEL_COLORS[skill.level],
          }}
        >
          {SKILL_LEVEL_LABELS[skill.level]} · Skill {skill.id}
        </span>
        <h1
          className="font-display"
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: "var(--ink)",
            margin: "8px 0 4px",
            letterSpacing: "-0.02em",
          }}
        >
          {skill.title}
        </h1>
        <p className="font-arabic" style={{ fontSize: 22, color: "var(--ink-2)" }}>
          {skill.arabicTitle}
        </p>
      </div>

      {/* Tagline */}
      <div
        style={{
          background: "var(--accent-light)",
          border: "1px solid var(--accent)",
          borderRadius: 10,
          padding: "14px 18px",
          marginBottom: 28,
        }}
      >
        <p style={{ fontSize: 15, color: "var(--ink)", fontWeight: 500, lineHeight: 1.6 }}>
          {skill.tagline}
        </p>
      </div>

      {/* Explanation */}
      <p
        style={{
          fontSize: 16,
          color: "var(--ink-2)",
          lineHeight: 1.85,
          marginBottom: 28,
        }}
      >
        {skill.explanation}
      </p>

      {/* Watch for */}
      <div
        style={{
          background: "rgba(196, 149, 42, 0.08)",
          border: "1px solid var(--gold)",
          borderRadius: 10,
          padding: "14px 18px",
          marginBottom: 32,
        }}
      >
        <p
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--gold)",
            marginBottom: 6,
          }}
        >
          Watch for
        </p>
        <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.7 }}>
          {skill.watchFor}
        </p>
      </div>

      {/* Vocabulary */}
      <h2
        style={{
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--ink-3)",
          marginBottom: 16,
        }}
      >
        Vocabulary
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 10,
          marginBottom: 36,
        }}
      >
        {skill.vocab.map((v) => (
          <div
            key={v.arabic}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              padding: "14px 16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <span
                className="font-arabic"
                style={{ fontSize: 28, color: "var(--ink)" }}
              >
                {v.arabic.split("/")[0].trim()}
              </span>
              <button
                onClick={() => speak(v.arabic.split("/")[0].trim())}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 18,
                  padding: 4,
                }}
                title="Hear it"
                aria-label="Play audio"
              >
                🔊
              </button>
            </div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>
              {v.transliteration.split("/")[0].trim()}
            </p>
            <p style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 2 }}>
              {v.translation}
            </p>
            {v.root && (
              <p
                className="font-arabic"
                style={{
                  fontSize: 12,
                  color: "var(--accent)",
                  marginTop: 6,
                  fontWeight: 700,
                }}
              >
                ج.ذ.ر: {v.root}
              </p>
            )}
            {v.frequency && (
              <p style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 4 }}>
                ×{v.frequency.toLocaleString()} in Quran
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Root note */}
      {skill.rootNote && (
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: "20px 24px",
            marginBottom: 32,
          }}
        >
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: 10,
            }}
          >
            Key Patterns
          </p>
          <p
            className="font-arabic"
            style={{ fontSize: 16, color: "var(--ink)", lineHeight: 1.9 }}
          >
            {skill.rootNote}
          </p>
        </div>
      )}

      {/* Quran example */}
      <h2
        style={{
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--ink-3)",
          marginBottom: 16,
        }}
      >
        Where this shows up — Qurʾān
      </h2>
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: "28px 28px 24px",
          marginBottom: 36,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <p
            className="font-arabic"
            style={{
              fontSize: 28,
              color: "var(--ink)",
              lineHeight: 1.8,
              direction: "rtl",
              textAlign: "right",
              flex: 1,
            }}
            onClick={() => speak(skill.quranExample.arabic)}
          >
            {skill.quranExample.arabic}
          </p>
          <button
            onClick={() => speak(skill.quranExample.arabic)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 20,
              padding: "4px 8px",
              marginLeft: 12,
              flexShrink: 0,
            }}
            aria-label="Play audio"
          >
            🔊
          </button>
        </div>
        <p style={{ fontSize: 14, color: "var(--ink-2)", fontStyle: "italic", marginBottom: 8, lineHeight: 1.6 }}>
          {skill.quranExample.transliteration}
        </p>
        <p style={{ fontSize: 15, color: "var(--ink)", fontWeight: 500, marginBottom: 12 }}>
          "{skill.quranExample.translation}"
        </p>
        <p
          style={{
            fontSize: 12,
            color: "var(--ink-3)",
            background: "var(--surface-2)",
            padding: "4px 12px",
            borderRadius: 999,
            display: "inline-block",
          }}
        >
          {skill.quranExample.source}
        </p>
      </div>

      {/* Exercises */}
      {skill.exercises.length > 0 && (
        <>
          <h2
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--ink-3)",
              marginBottom: 4,
            }}
          >
            Quick check
          </h2>
          {skill.exercises.map((ex, i) => (
            <ExerciseCard key={i} exercise={ex} skillId={skill.id} />
          ))}
        </>
      )}

      {/* Next skill prompt */}
      <div
        style={{
          marginTop: 48,
          paddingTop: 28,
          borderTop: "1px solid var(--border)",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        {skill.id < SKILLS.length && (
          <div style={{ fontSize: 14, color: "var(--ink-2)" }}>
            Up next: <strong style={{ color: "var(--ink)" }}>Skill {skill.id + 1} — {SKILLS[skill.id].title}</strong>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LearnPage() {
  const [activeSkillId, setActiveSkillId] = useState(1);
  const [unlockedIds] = useState<number[]>(SKILLS.map((s) => s.id));
  const isPro = true;

  const activeSkill = SKILLS.find((s) => s.id === activeSkillId) ?? SKILLS[0];
  const comprehension = getComprehensionPercent(unlockedIds);

  const grouped = [
    { label: "Beginner", skills: SKILLS.filter((s) => s.level === "beginner") },
    { label: "Intermediate", skills: SKILLS.filter((s) => s.level === "intermediate") },
    { label: "Advanced", skills: SKILLS.filter((s) => s.level === "advanced") },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        background: "var(--bg)",
      }}
    >
      {/* Top nav */}
      <header
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "0 24px",
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          background: "var(--bg)",
        }}
      >
        <Link
          href="/"
          className="font-display"
          style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.02em" }}
        >
          Glow<span style={{ color: "var(--accent)" }}>Desk</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link
            href="/pricing"
            style={{
              fontSize: 13,
              color: "var(--ink-2)",
            }}
          >
            Join live classes →
          </Link>
        </div>
      </header>

      {/* Main split */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <aside
          style={{
            width: 280,
            flexShrink: 0,
            borderRight: "1px solid var(--border)",
            overflowY: "auto",
            padding: "20px 16px",
            background: "var(--bg)",
          }}
        >
          <ProgressBar percent={comprehension} />

          {grouped.map(({ label, skills }) => (
            <div key={label} style={{ marginBottom: 24 }}>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--ink-3)",
                  marginBottom: 8,
                  paddingLeft: 6,
                }}
              >
                {label}
              </p>
              {skills.map((skill) => {
                const isFree = FREE_SKILLS.includes(skill.id);
                const isUnlocked = isPro || isFree;
                return (
                  <SkillRow
                    key={skill.id}
                    skill={skill}
                    isActive={activeSkillId === skill.id}
                    isUnlocked={isUnlocked}
                    isFree={isFree}
                    onClick={() => setActiveSkillId(skill.id)}
                  />
                );
              })}
            </div>
          ))}

          <Link
            href="/pricing"
            style={{
              display: "block",
              background: "var(--accent-light)",
              color: "var(--accent)",
              padding: "12px 16px",
              borderRadius: 10,
              textAlign: "center",
              fontWeight: 600,
              fontSize: 14,
              marginTop: 8,
              border: "1px solid var(--accent)",
            }}
          >
            Join live classes — $50/mo →
          </Link>
        </aside>

        {/* Content */}
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            background: "var(--bg)",
          }}
        >
          <LessonPanel skill={activeSkill} isPro={isPro} />
        </main>
      </div>
    </div>
  );
}
