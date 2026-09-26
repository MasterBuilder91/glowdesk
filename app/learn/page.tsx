"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { SKILLS, getComprehensionPercent } from "@/data/curriculum";
import type { Skill } from "@/data/curriculum";
import { generateSession, getSkillColor } from "@/data/drills";
import type { DrillQuestion } from "@/data/drills";

// ── Audio ────────────────────────────────────────────────────────────────────

async function speak(text: string) {
  try {
    const res = await fetch(`/api/tts?text=${encodeURIComponent(text)}`);
    if (res.ok && res.status !== 204) {
      const buf = await res.arrayBuffer();
      const ctx = new AudioContext();
      const decoded = await ctx.decodeAudioData(buf);
      const src = ctx.createBufferSource();
      src.buffer = decoded;
      src.connect(ctx.destination);
      src.start();
      return;
    }
  } catch {}
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ar-SA";
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

// ── Constants ────────────────────────────────────────────────────────────────

const BEGINNER = SKILLS.filter((s) => s.level === "beginner");
const INTERMEDIATE = SKILLS.filter((s) => s.level === "intermediate");
const ADVANCED = SKILLS.filter((s) => s.level === "advanced");
const ALL_IDS = SKILLS.map((s) => s.id);

function randomEncouragement(score: number, total: number) {
  if (score === total) return "Perfect. The words are yours now.";
  if (score >= total * 0.8) return "Strong session. Root it deep.";
  if (score >= total * 0.6) return "Good base — repeat until perfect.";
  return "Review the misses. That's where the learning is.";
}

// ── Drill helpers ─────────────────────────────────────────────────────────────

function typeBadge(type: DrillQuestion["type"]) {
  const map: Record<DrillQuestion["type"], { label: string; color: string }> = {
    "ar-to-en":      { label: "Arabic → English",  color: "#1A7A3E" },
    "en-to-ar":      { label: "English → Arabic",  color: "#1A6B4A" },
    "root-identify": { label: "Find the Root",      color: "#7B4F12" },
    "root-to-word":  { label: "Root → Word",        color: "#7B4F12" },
    "verse-fill":    { label: "Quranic Verse",      color: "#1A4F6E" },
    "true-false":    { label: "Grammar Rule",       color: "#4A1A6E" },
  };
  return map[type] ?? { label: "Drill", color: "#333" };
}

// ── SkillCard ─────────────────────────────────────────────────────────────────

function SkillCard({
  skill,
  onStudy,
  onDrill,
}: {
  skill: Skill;
  onStudy: () => void;
  onDrill: () => void;
}) {
  const color = getSkillColor(skill.level);
  return (
    <div
      className="gdsk-card"
      style={{ "--card-color": color } as React.CSSProperties}
    >
      <div className="gdsk-card-num">Skill {skill.id}</div>
      <div className="gdsk-card-arabic font-arabic">{skill.arabicTitle}</div>
      <div className="gdsk-card-title">{skill.title}</div>
      <div className="gdsk-card-tagline">{skill.tagline}</div>
      <div className="gdsk-card-meta">
        <span>{skill.vocab.length} words</span>
        <span>+{skill.comprehensionGain}%</span>
      </div>
      <div className="gdsk-card-actions">
        <button className="gdsk-btn-study" onClick={onStudy}>Study</button>
        <button className="gdsk-btn-drill" onClick={onDrill}>Drill</button>
      </div>
    </div>
  );
}

function LevelSection({
  title,
  skills,
  color,
  onStudy,
  onDrill,
}: {
  title: string;
  skills: Skill[];
  color: string;
  onStudy: (s: Skill) => void;
  onDrill: (s: Skill) => void;
}) {
  return (
    <section style={{ marginBottom: 48 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color }}>
          {title}
        </span>
        <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        <span style={{ fontSize: 12, color: "var(--ink-3)" }}>{skills.length} skills</span>
      </div>
      <div className="gdsk-grid">
        {skills.map((s) => (
          <SkillCard key={s.id} skill={s} onStudy={() => onStudy(s)} onDrill={() => onDrill(s)} />
        ))}
      </div>
    </section>
  );
}

// ── Hub ───────────────────────────────────────────────────────────────────────

function Hub({
  onStudy,
  onDrill,
  onQuickDrill,
  streak,
  totalDrilled,
}: {
  onStudy: (s: Skill) => void;
  onDrill: (s: Skill) => void;
  onQuickDrill: () => void;
  streak: number;
  totalDrilled: number;
}) {
  const comprehension = getComprehensionPercent(ALL_IDS);
  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 5vw 80px" }}>
      <div className="gdsk-hero">
        <div className="gdsk-hero-arabic font-arabic">اِقْرَأِ الْقُرْآنَ وَافْهَمْهُ</div>
        <div className="gdsk-hero-sub">Read the Quran. Understand it.</div>
        <div className="gdsk-stats">
          <div className="gdsk-stat">
            <div className="gdsk-stat-num" style={{ color: "#E85D04" }}>
              {streak > 0 ? `🔥 ${streak}` : "—"}
            </div>
            <div className="gdsk-stat-label">day streak</div>
          </div>
          <div className="gdsk-stat-div" />
          <div className="gdsk-stat">
            <div className="gdsk-stat-num">{totalDrilled}</div>
            <div className="gdsk-stat-label">words drilled</div>
          </div>
          <div className="gdsk-stat-div" />
          <div className="gdsk-stat">
            <div className="gdsk-stat-num" style={{ color: "var(--accent)" }}>{comprehension}%</div>
            <div className="gdsk-stat-label">Quran comprehension</div>
          </div>
          <div className="gdsk-stat-div" />
          <div className="gdsk-stat">
            <div className="gdsk-stat-num">18</div>
            <div className="gdsk-stat-label">skills</div>
          </div>
        </div>
        <button className="gdsk-quick-drill" onClick={onQuickDrill}>
          <span style={{ fontSize: 20 }}>⚡</span>
          Quick Drill — All Skills
          <span style={{ fontSize: 13, opacity: 0.7, marginLeft: 4 }}>10 random questions</span>
        </button>
      </div>

      <LevelSection title="Beginner"     skills={BEGINNER}     color="#1A7A3E" onStudy={onStudy} onDrill={onDrill} />
      <LevelSection title="Intermediate" skills={INTERMEDIATE} color="#C4952A" onStudy={onStudy} onDrill={onDrill} />
      <LevelSection title="Advanced"     skills={ADVANCED}     color="#1A6B4A" onStudy={onStudy} onDrill={onDrill} />

      <div className="gdsk-live-cta">
        <div>
          <p style={{ fontSize: 17, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>
            Ready for live instruction?
          </p>
          <p style={{ fontSize: 14, color: "var(--ink-2)" }}>
            12 live classes / month with your teacher — $50/month via Skool.
          </p>
        </div>
        <a
          href="https://www.skool.com/master-builder-arabic-lab-7688"
          target="_blank"
          rel="noopener noreferrer"
          className="gdsk-skool-btn"
        >
          Join live classes →
        </a>
      </div>
    </div>
  );
}

// ── Lesson ────────────────────────────────────────────────────────────────────

function Lesson({
  skill,
  onBack,
  onStartDrill,
}: {
  skill: Skill;
  onBack: () => void;
  onStartDrill: () => void;
}) {
  const color = getSkillColor(skill.level);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);

  async function playVocab(arabic: string, i: number) {
    setPlayingIdx(i);
    await speak(arabic);
    setPlayingIdx(null);
  }

  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 5vw 80px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 0 32px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 14, color: "var(--ink-2)", cursor: "pointer", padding: "6px 0" }}>
          ← Back
        </button>
        <span style={{ color: "var(--border)", fontSize: 14 }}>|</span>
        <span style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color, fontWeight: 700 }}>
          Skill {skill.id} · {skill.level}
        </span>
      </div>

      <div style={{ marginBottom: 40 }}>
        <div className="font-arabic" style={{ fontSize: "clamp(40px,6vw,64px)", color, marginBottom: 4, lineHeight: 1.4, direction: "rtl" }}>
          {skill.arabicTitle}
        </div>
        <h1 className="font-display" style={{ fontSize: "clamp(26px,3vw,36px)", fontWeight: 700, color: "var(--ink)", marginBottom: 12, letterSpacing: "-0.02em" }}>
          {skill.title}
        </h1>
        <p style={{ fontSize: 17, color: "var(--ink-2)", lineHeight: 1.7, borderLeft: `3px solid ${color}`, paddingLeft: 16 }}>
          {skill.tagline}
        </p>
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "24px 28px", marginBottom: 24 }}>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: "var(--ink)" }}>{skill.explanation}</p>
      </div>

      <div style={{ background: "rgba(196,149,42,0.06)", border: "1px solid rgba(196,149,42,0.25)", borderRadius: 10, padding: "16px 20px", marginBottom: 40 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C4952A", marginRight: 8 }}>Watch for:</span>
        <span style={{ fontSize: 14, color: "var(--ink-2)" }}>{skill.watchFor}</span>
      </div>

      <h2 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", marginBottom: 20, letterSpacing: "-0.02em" }}>
        Vocabulary
      </h2>
      <div className="gdsk-vocab-grid">
        {skill.vocab.map((v, i) => (
          <div key={i} className="gdsk-vocab-card">
            <button className="gdsk-vocab-play" onClick={() => playVocab(v.arabic, i)}>
              {playingIdx === i ? "▶" : "♪"}
            </button>
            <div className="font-arabic gdsk-vocab-arabic" onClick={() => playVocab(v.arabic, i)} title="Click to hear">
              {v.arabic}
            </div>
            <div style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 2 }}>{v.transliteration}</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{v.translation}</div>
            {v.root && (
              <div style={{ fontSize: 11, color: "#7B4F12", background: "rgba(123,79,18,0.08)", borderRadius: 4, padding: "2px 8px", marginTop: 6, display: "inline-block" }}>
                root: {v.root}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ margin: "40px 0" }}>
        <h2 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", marginBottom: 20, letterSpacing: "-0.02em" }}>
          Quranic Example
        </h2>
        <div style={{ background: "var(--surface)", border: `1px solid var(--border)`, borderTop: `3px solid ${color}`, borderRadius: 12, padding: "28px 32px" }}>
          <div className="font-arabic" style={{ fontSize: "clamp(24px,3.5vw,36px)", color: "var(--ink)", direction: "rtl", lineHeight: 2, marginBottom: 12, cursor: "pointer" }}
               onClick={() => speak(skill.quranExample.arabic)} title="Click to hear">
            {skill.quranExample.arabic}
          </div>
          <div style={{ fontSize: 14, color: "var(--ink-3)", marginBottom: 8, fontStyle: "italic" }}>{skill.quranExample.transliteration}</div>
          <div style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.6, marginBottom: 8 }}>{skill.quranExample.translation}</div>
          <div style={{ fontSize: 12, color: "var(--ink-3)" }}>— {skill.quranExample.source}</div>
        </div>
      </div>

      <div className="gdsk-drill-cta">
        <div>
          <p style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Ready to drill this skill?</p>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)" }}>8 randomized questions drawn from this lesson.</p>
        </div>
        <button className="gdsk-btn-drill-lg" onClick={onStartDrill}>Start Drill →</button>
      </div>
    </div>
  );
}

// ── Drill Session ─────────────────────────────────────────────────────────────

type AnswerState = "idle" | "correct" | "wrong";

function DrillSession({
  questions,
  onComplete,
  onBack,
}: {
  questions: DrillQuestion[];
  onComplete: (score: number, total: number) => void;
  onBack: () => void;
}) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [wrongs, setWrongs] = useState<DrillQuestion[]>([]);
  const [animKey, setAnimKey] = useState(0);
  const scoreRef = useRef(0);

  const q = questions[current];
  const progress = (current / questions.length) * 100;

  const handleSelect = useCallback(
    (option: string) => {
      if (selected !== null) return;
      setSelected(option);
      const isCorrect = option === q.answer;
      setAnswerState(isCorrect ? "correct" : "wrong");
      if (isCorrect) {
        scoreRef.current += 1;
        setScore((s) => s + 1);
      } else {
        setWrongs((w) => [...w, q]);
      }
    },
    [selected, q]
  );

  function handleNext() {
    const nextIdx = current + 1;
    if (nextIdx >= questions.length) {
      setFinished(true);
      onComplete(scoreRef.current, questions.length);
    } else {
      setCurrent(nextIdx);
      setSelected(null);
      setAnswerState("idle");
      setAnimKey((k) => k + 1);
    }
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (finished) return;
      if ((e.key === " " || e.key === "Enter") && selected !== null) {
        handleNext();
        return;
      }
      const n = parseInt(e.key);
      if (!isNaN(n) && n >= 1 && n <= q.options.length && selected === null) {
        handleSelect(q.options[n - 1]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selected, q, handleSelect, handleNext, finished]);

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="gdsk-drill-wrap">
        <div className="gdsk-score-card">
          <div className="gdsk-score-num" style={{ color: pct >= 80 ? "var(--accent)" : pct >= 60 ? "#C4952A" : "#C0392B" }}>
            {score}<span style={{ fontSize: "0.45em", color: "var(--ink-3)", fontWeight: 400 }}> / {questions.length}</span>
          </div>
          <div className="gdsk-score-pct">{pct}% correct</div>
          <p className="gdsk-score-msg">{randomEncouragement(score, questions.length)}</p>

          {wrongs.length > 0 && (
            <div className="gdsk-misses">
              <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 12 }}>
                Review these
              </p>
              {wrongs.map((w, i) => (
                <div key={i} className="gdsk-miss-row">
                  {w.arabic && (
                    <span className="font-arabic" style={{ fontSize: 22, color: "var(--ink)", marginRight: 12 }}>{w.arabic}</span>
                  )}
                  <span style={{ fontSize: 13, color: "var(--ink-2)" }}>{w.answer}</span>
                </div>
              ))}
            </div>
          )}

          <div className="gdsk-score-actions">
            <button className="gdsk-btn-again" onClick={onBack}>← Back to Hub</button>
          </div>
        </div>
      </div>
    );
  }

  const badge = typeBadge(q.type);
  const isArOptions = q.type === "en-to-ar" || q.type === "root-to-word";

  return (
    <div className="gdsk-drill-wrap">
      <div className="gdsk-drill-header">
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 13, color: "var(--ink-3)", cursor: "pointer" }}>
          ← exit
        </button>
        <div className="gdsk-progress-bar">
          <div className="gdsk-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span style={{ fontSize: 13, color: "var(--ink-3)", whiteSpace: "nowrap" }}>
          {current + 1} / {questions.length}
        </span>
      </div>

      <div className="gdsk-q-area" key={animKey}>
        <div className="gdsk-type-badge" style={{ background: `${badge.color}18`, color: badge.color }}>
          {badge.label}
        </div>

        {q.arabic && (
          <div className="font-arabic gdsk-q-arabic" onClick={() => speak(q.arabic!)} title="Tap to hear">
            {q.arabic}
          </div>
        )}

        <p className="gdsk-q-prompt">{q.prompt}</p>

        <div className={`gdsk-options ${q.options.length === 2 ? "gdsk-options-2" : "gdsk-options-4"}`}>
          {q.options.map((opt, i) => {
            let cls = "gdsk-opt";
            if (selected !== null) {
              if (opt === q.answer) cls += " gdsk-opt-correct";
              else if (opt === selected) cls += " gdsk-opt-wrong";
              else cls += " gdsk-opt-dim";
            }
            return (
              <button key={i} className={cls} onClick={() => handleSelect(opt)} disabled={selected !== null}>
                <span className="gdsk-opt-num">{i + 1}</span>
                <span className={isArOptions ? "font-arabic gdsk-opt-arabic-text" : "gdsk-opt-text"}>
                  {opt}
                </span>
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <div className="gdsk-explanation">
            <span style={{ marginRight: 8 }}>{answerState === "correct" ? "✓" : "✗"}</span>
            {q.explanation}
          </div>
        )}

        {selected !== null && (
          <button className="gdsk-next-btn" onClick={handleNext}>
            {current + 1 < questions.length ? "Next →" : "See results →"}
          </button>
        )}

        {selected === null && (
          <p className="gdsk-hint">Press 1–{q.options.length} or click an option</p>
        )}
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const STYLES = `
  @keyframes gdsk-fade-up {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes gdsk-shake {
    0%,100% { transform: translateX(0); }
    15%     { transform: translateX(-9px); }
    35%     { transform: translateX(9px); }
    55%     { transform: translateX(-5px); }
    75%     { transform: translateX(5px); }
  }
  @keyframes gdsk-pop {
    0%  { transform: scale(0.9); opacity: 0; }
    60% { transform: scale(1.02); opacity: 1; }
    100%{ transform: scale(1); }
  }
  @keyframes gdsk-glow {
    0%   { box-shadow: 0 0 0 0 rgba(26,122,62,0.45); }
    70%  { box-shadow: 0 0 0 14px rgba(26,122,62,0); }
    100% { box-shadow: 0 0 0 0 rgba(26,122,62,0); }
  }

  /* Hero */
  .gdsk-hero { padding: 48px 0 40px; margin-bottom: 40px; border-bottom: 1px solid var(--border); }
  .gdsk-hero-arabic { font-size: clamp(28px,4vw,48px); color: var(--accent); direction: rtl; text-align: center; line-height: 1.7; margin-bottom: 4px; }
  .gdsk-hero-sub { text-align: center; font-size: 14px; color: var(--ink-3); font-style: italic; margin-bottom: 32px; }
  .gdsk-stats { display: flex; align-items: center; justify-content: center; background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 20px 0; margin-bottom: 24px; flex-wrap: wrap; }
  .gdsk-stat { flex: 1; min-width: 100px; text-align: center; padding: 0 24px; }
  .gdsk-stat-num { font-family: 'Crimson Pro', Georgia, serif; font-size: 28px; font-weight: 700; color: var(--ink); letter-spacing: -0.03em; }
  .gdsk-stat-label { font-size: 11px; color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 2px; }
  .gdsk-stat-div { width: 1px; height: 40px; background: var(--border); flex-shrink: 0; }
  .gdsk-quick-drill { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 16px 24px; background: var(--ink); color: var(--bg); border: none; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer; transition: background 0.15s, transform 0.1s; }
  .gdsk-quick-drill:hover { background: #2a2825; transform: translateY(-1px); }
  .gdsk-quick-drill:active { transform: translateY(0); }

  /* Skill grid */
  .gdsk-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  @media (max-width: 800px) { .gdsk-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 520px) { .gdsk-grid { grid-template-columns: 1fr; } }

  /* Skill card */
  .gdsk-card { background: var(--surface); border: 1px solid var(--border); border-left: 3px solid var(--card-color, var(--accent)); border-radius: 12px; padding: 20px 18px 16px; transition: box-shadow 0.18s, transform 0.18s; display: flex; flex-direction: column; }
  .gdsk-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.09); transform: translateY(-2px); }
  .gdsk-card-num { font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--card-color, var(--accent)); margin-bottom: 8px; }
  .gdsk-card-arabic { font-size: 28px; color: var(--ink); direction: rtl; line-height: 1.5; margin-bottom: 4px; }
  .gdsk-card-title { font-size: 15px; font-weight: 700; color: var(--ink); margin-bottom: 6px; }
  .gdsk-card-tagline { font-size: 12px; color: var(--ink-3); line-height: 1.5; flex: 1; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .gdsk-card-meta { display: flex; gap: 12px; font-size: 11px; color: var(--ink-3); margin-bottom: 12px; }
  .gdsk-card-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .gdsk-btn-study { padding: 8px 0; border: 1px solid var(--border); background: none; border-radius: 7px; font-size: 13px; font-weight: 600; color: var(--ink-2); cursor: pointer; transition: background 0.12s, color 0.12s; }
  .gdsk-btn-study:hover { background: var(--bg); color: var(--ink); }
  .gdsk-btn-drill { padding: 8px 0; border: none; background: var(--card-color, var(--accent)); border-radius: 7px; font-size: 13px; font-weight: 700; color: #fff; cursor: pointer; transition: opacity 0.12s, transform 0.1s; }
  .gdsk-btn-drill:hover { opacity: 0.88; transform: translateY(-1px); }

  /* Live class banner */
  .gdsk-live-cta { display: flex; align-items: center; justify-content: space-between; gap: 20px; background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 24px 28px; flex-wrap: wrap; }
  .gdsk-skool-btn { display: inline-block; background: var(--accent); color: #fff; padding: 12px 24px; border-radius: 9px; font-weight: 700; font-size: 14px; text-decoration: none; white-space: nowrap; transition: opacity 0.12s; }
  .gdsk-skool-btn:hover { opacity: 0.85; }

  /* Vocab grid */
  .gdsk-vocab-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; margin-bottom: 0; }
  .gdsk-vocab-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 16px 14px 14px; position: relative; transition: box-shadow 0.15s; }
  .gdsk-vocab-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.07); }
  .gdsk-vocab-play { position: absolute; top: 10px; right: 10px; background: none; border: 1px solid var(--border); border-radius: 50%; width: 26px; height: 26px; font-size: 11px; cursor: pointer; color: var(--ink-3); display: flex; align-items: center; justify-content: center; transition: background 0.1s; }
  .gdsk-vocab-play:hover { background: var(--bg); color: var(--accent); }
  .gdsk-vocab-arabic { font-size: 28px; direction: rtl; cursor: pointer; color: var(--ink); line-height: 1.6; margin-bottom: 4px; }

  /* Drill CTA in lesson */
  .gdsk-drill-cta { display: flex; align-items: center; justify-content: space-between; gap: 20px; background: var(--ink); border-radius: 14px; padding: 24px 28px; flex-wrap: wrap; }
  .gdsk-btn-drill-lg { background: var(--accent); color: #fff; border: none; padding: 13px 28px; border-radius: 9px; font-size: 15px; font-weight: 700; cursor: pointer; white-space: nowrap; transition: opacity 0.12s, transform 0.1s; }
  .gdsk-btn-drill-lg:hover { opacity: 0.88; transform: translateY(-1px); }

  /* Drill session wrapper */
  .gdsk-drill-wrap { min-height: calc(100vh - 56px); display: flex; flex-direction: column; align-items: center; padding: 0 5vw 60px; }
  .gdsk-drill-header { display: flex; align-items: center; gap: 16px; width: 100%; max-width: 640px; padding: 20px 0 32px; }
  .gdsk-progress-bar { flex: 1; height: 6px; background: var(--border); border-radius: 999px; overflow: hidden; }
  .gdsk-progress-fill { height: 100%; background: var(--accent); border-radius: 999px; transition: width 0.4s ease; }

  /* Question area */
  .gdsk-q-area { width: 100%; max-width: 600px; animation: gdsk-fade-up 0.35s ease both; display: flex; flex-direction: column; align-items: center; }
  .gdsk-type-badge { font-size: 11px; font-weight: 700; letter-spacing: 0.13em; text-transform: uppercase; padding: 4px 12px; border-radius: 999px; margin-bottom: 20px; }
  .gdsk-q-arabic { font-size: clamp(44px, 8vw, 72px); color: var(--ink); direction: rtl; line-height: 1.5; text-align: center; cursor: pointer; transition: opacity 0.1s; margin-bottom: 16px; text-shadow: 0 2px 16px rgba(0,0,0,0.06); }
  .gdsk-q-arabic:hover { opacity: 0.7; }
  .gdsk-q-prompt { font-size: 17px; color: var(--ink-2); text-align: center; line-height: 1.5; margin-bottom: 36px; max-width: 480px; }

  /* Options */
  .gdsk-options { display: grid; gap: 10px; width: 100%; margin-bottom: 0; }
  .gdsk-options-4 { grid-template-columns: 1fr 1fr; }
  .gdsk-options-2 { grid-template-columns: 1fr 1fr; }
  @media (max-width: 480px) { .gdsk-options-4, .gdsk-options-2 { grid-template-columns: 1fr; } }

  .gdsk-opt { display: flex; align-items: center; gap: 12px; padding: 16px 18px; background: var(--surface); border: 1.5px solid var(--border); border-radius: 12px; cursor: pointer; text-align: left; transition: border-color 0.15s, background 0.15s, transform 0.1s; min-height: 62px; }
  .gdsk-opt:hover:not(:disabled) { border-color: var(--accent); background: var(--bg); transform: translateY(-1px); }
  .gdsk-opt:disabled { cursor: default; }
  .gdsk-opt-num { font-size: 11px; font-weight: 700; color: var(--ink-3); background: var(--bg); border: 1px solid var(--border); border-radius: 5px; min-width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .gdsk-opt-text { font-size: 15px; color: var(--ink); font-weight: 500; }
  .gdsk-opt-arabic-text { font-family: 'Amiri', serif; font-size: 22px; color: var(--ink); direction: rtl; }

  .gdsk-opt-correct { background: rgba(26,122,62,0.1) !important; border-color: #1A7A3E !important; animation: gdsk-glow 0.6s ease; }
  .gdsk-opt-correct .gdsk-opt-num { background: #1A7A3E; color: #fff; border-color: #1A7A3E; }
  .gdsk-opt-correct .gdsk-opt-text, .gdsk-opt-correct .gdsk-opt-arabic-text { color: #1A7A3E; font-weight: 700; }

  .gdsk-opt-wrong { background: rgba(192,57,43,0.08) !important; border-color: #C0392B !important; animation: gdsk-shake 0.4s ease; }
  .gdsk-opt-wrong .gdsk-opt-num { background: #C0392B; color: #fff; border-color: #C0392B; }
  .gdsk-opt-wrong .gdsk-opt-text, .gdsk-opt-wrong .gdsk-opt-arabic-text { color: #C0392B; }

  .gdsk-opt-dim { opacity: 0.38; }

  .gdsk-explanation { margin-top: 24px; padding: 16px 20px; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; font-size: 14px; color: var(--ink-2); line-height: 1.7; animation: gdsk-fade-up 0.25s ease both; width: 100%; text-align: left; }
  .gdsk-next-btn { margin-top: 20px; padding: 14px 40px; background: var(--ink); color: var(--bg); border: none; border-radius: 10px; font-size: 16px; font-weight: 700; cursor: pointer; transition: background 0.15s, transform 0.1s; animation: gdsk-fade-up 0.2s ease 0.1s both; }
  .gdsk-next-btn:hover { background: #2a2825; transform: translateY(-1px); }
  .gdsk-hint { font-size: 12px; color: var(--ink-3); margin-top: 24px; }

  /* Score screen */
  .gdsk-score-card { width: 100%; max-width: 520px; margin: 60px auto 0; background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 48px 40px; text-align: center; animation: gdsk-pop 0.4s ease; }
  .gdsk-score-num { font-family: 'Crimson Pro', Georgia, serif; font-size: 80px; font-weight: 700; letter-spacing: -0.04em; line-height: 1; margin-bottom: 8px; }
  .gdsk-score-pct { font-size: 15px; color: var(--ink-3); margin-bottom: 16px; }
  .gdsk-score-msg { font-size: 18px; font-style: italic; color: var(--ink-2); margin-bottom: 32px; line-height: 1.5; }
  .gdsk-misses { background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 16px; margin-bottom: 28px; text-align: left; }
  .gdsk-miss-row { display: flex; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border); }
  .gdsk-miss-row:last-child { border-bottom: none; }
  .gdsk-score-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  .gdsk-btn-again { padding: 13px 28px; border: 1px solid var(--border); background: none; border-radius: 9px; font-size: 14px; font-weight: 600; color: var(--ink); cursor: pointer; transition: background 0.12s; }
  .gdsk-btn-again:hover { background: var(--bg); }
`;

// ── Root ──────────────────────────────────────────────────────────────────────

type Mode = "hub" | "lesson" | "drill";

export default function LearnPage() {
  const [mode, setMode] = useState<Mode>("hub");
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [drillQuestions, setDrillQuestions] = useState<DrillQuestion[]>([]);
  const [streak, setStreak] = useState(0);
  const [totalDrilled, setTotalDrilled] = useState(0);

  useEffect(() => {
    try {
      setStreak(parseInt(localStorage.getItem("gdsk-streak") ?? "0") || 0);
      setTotalDrilled(parseInt(localStorage.getItem("gdsk-drilled") ?? "0") || 0);
    } catch {}
  }, []);

  function startDrill(skill: Skill) {
    setDrillQuestions(generateSession([skill.id], 8));
    setMode("drill");
  }

  function startQuickDrill() {
    setDrillQuestions(generateSession("all", 10));
    setMode("drill");
  }

  function handleStudy(skill: Skill) {
    setSelectedSkill(skill);
    setMode("lesson");
  }

  function handleDrillComplete(score: number, total: number) {
    try {
      const newTotal = totalDrilled + score;
      const today = new Date().toDateString();
      const last = localStorage.getItem("gdsk-last-drill-date") ?? "";
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const newStreak = last === today ? streak : last === yesterday ? streak + 1 : 1;
      localStorage.setItem("gdsk-drilled", String(newTotal));
      localStorage.setItem("gdsk-streak", String(newStreak));
      localStorage.setItem("gdsk-last-drill-date", today);
      setTotalDrilled(newTotal);
      setStreak(newStreak);
    } catch {}
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "var(--bg)", borderBottom: "1px solid var(--border)", padding: "0 5vw", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
        <Link href="/" className="font-display" style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-0.02em" }}>
          Glow<span style={{ color: "var(--accent)" }}>Desk</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {mode !== "hub" && (
            <button onClick={() => setMode("hub")} style={{ background: "none", border: "none", fontSize: 13, color: "var(--ink-2)", cursor: "pointer" }}>
              ← Hub
            </button>
          )}
          <Link href="/pricing" style={{ color: "var(--ink-2)", fontSize: 13 }}>Live classes</Link>
          <a href="https://www.skool.com/master-builder-arabic-lab-7688" target="_blank" rel="noopener noreferrer"
             style={{ background: "var(--accent)", color: "#fff", padding: "6px 14px", borderRadius: 7, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
            $50/mo →
          </a>
        </div>
      </nav>

      {mode === "hub" && (
        <Hub
          onStudy={handleStudy}
          onDrill={startDrill}
          onQuickDrill={startQuickDrill}
          streak={streak}
          totalDrilled={totalDrilled}
        />
      )}

      {mode === "lesson" && selectedSkill && (
        <Lesson
          skill={selectedSkill}
          onBack={() => setMode("hub")}
          onStartDrill={() => startDrill(selectedSkill)}
        />
      )}

      {mode === "drill" && (
        <DrillSession
          questions={drillQuestions}
          onComplete={handleDrillComplete}
          onBack={() => setMode("hub")}
        />
      )}
    </>
  );
}
