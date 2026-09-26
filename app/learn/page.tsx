"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { SKILLS, getComprehensionPercent } from "@/data/curriculum";
import type { Skill } from "@/data/curriculum";
import { generateSession, getSkillColor } from "@/data/drills";
import type { DrillQuestion } from "@/data/drills";
import {
  ALPHABET, HARAKAT, KB_ROWS, GAME_WORDS,
  bareWithMarks, spellWord, lookupWord,
} from "@/data/dictionary";
import type { BuiltLetter, DictEntry } from "@/data/dictionary";

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
  onBlaster,
  onBuilder,
  onAlphabet,
  streak,
  totalDrilled,
}: {
  onStudy: (s: Skill) => void;
  onDrill: (s: Skill) => void;
  onQuickDrill: () => void;
  onBlaster: () => void;
  onBuilder: () => void;
  onAlphabet: () => void;
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

      <section style={{ marginBottom: 48 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#1A6B4A" }}>
            Games &amp; Tools
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>
        <div className="gdsk-game-cards">
          <div className="gdsk-game-card" onClick={onBlaster}>
            <div className="gdsk-game-icon">☄️</div>
            <div className="gdsk-game-title">Letter Blaster</div>
            <div className="gdsk-game-desc">Click floating letters in the right order to spell the word. 350+ words.</div>
            <div className="gdsk-game-tag" style={{ color: "#C4952A" }}>Spelling game</div>
          </div>
          <div className="gdsk-game-card" onClick={onBuilder}>
            <div className="gdsk-game-icon">⌨️</div>
            <div className="gdsk-game-title">Word Builder</div>
            <div className="gdsk-game-desc">Type on a real Arabic keyboard, add vowel marks, and get live dictionary feedback.</div>
            <div className="gdsk-game-tag" style={{ color: "#1A6B4A" }}>Interactive tool</div>
          </div>
          <div className="gdsk-game-card" onClick={onAlphabet}>
            <div className="gdsk-game-icon">ا</div>
            <div className="gdsk-game-title">Alphabet Chart</div>
            <div className="gdsk-game-desc">All 28 Arabic letters with name, transliteration, positional forms, and connection notes.</div>
            <div className="gdsk-game-tag" style={{ color: "#4A1A6E" }}>Reference</div>
          </div>
          <Link href="/sarf" className="gdsk-game-card" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="gdsk-game-icon" style={{ fontFamily: "serif" }}>الصَّرْف</div>
            <div className="gdsk-game-title">Sarf Trainer</div>
            <div className="gdsk-game-desc">Conjugate 155+ verbs across all 10 forms, 14 pronoun slots, past/present/imperative, active/passive.</div>
            <div className="gdsk-game-tag" style={{ color: "#1A6B4A" }}>Morphology drill</div>
          </Link>
        </div>
      </section>

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

// ── Letter Blaster ────────────────────────────────────────────────────────────

interface Asteroid {
  id: string;
  letter: string;
  x: number;
  y: number;
  delay: number;
  state: "floating" | "hit" | "wrong";
}

function genPositions(count: number): { x: number; y: number }[] {
  const pts: { x: number; y: number }[] = [];
  let tries = 0;
  while (pts.length < count && tries < 500) {
    tries++;
    const x = 6 + Math.random() * 82;
    const y = 8 + Math.random() * 72;
    const ok = pts.every((p) => Math.hypot(p.x - x, p.y - y) > 14);
    if (ok) pts.push({ x, y });
  }
  while (pts.length < count) pts.push({ x: 10 + Math.random() * 70, y: 10 + Math.random() * 70 });
  return pts;
}

function LetterBlaster({ onBack }: { onBack: () => void }) {
  const [word, setWord] = useState<DictEntry | null>(null);
  const [targetLetters, setTargetLetters] = useState<string[]>([]);
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [nextIdx, setNextIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [words, setWords] = useState(0);
  const [win, setWin] = useState(false);

  const startRound = useCallback(() => {
    const w = GAME_WORDS[Math.floor(Math.random() * GAME_WORDS.length)];
    const clean = w.ar.replace(/[ً-ْٰ]/g, "");
    const tl = bareWithMarks(clean).map((b) => b.letter);
    const allAlpha = ALPHABET.map((l) => l.ar);
    const decoys: string[] = [];
    while (decoys.length < Math.max(4, 8 - tl.length)) {
      const r = allAlpha[Math.floor(Math.random() * allAlpha.length)];
      if (!decoys.includes(r)) decoys.push(r);
    }
    const combined = [...tl, ...decoys];
    const positions = genPositions(combined.length);
    const asts: Asteroid[] = combined
      .map((letter, i) => ({
        id: `${letter}-${i}-${Date.now()}`,
        letter,
        x: positions[i].x,
        y: positions[i].y,
        delay: Math.random() * 2,
        state: "floating" as const,
      }))
      .sort(() => Math.random() - 0.5);
    setWord(w);
    setTargetLetters(tl);
    setAsteroids(asts);
    setNextIdx(0);
    setWin(false);
  }, []);

  useEffect(() => { startRound(); }, [startRound]);

  function blast(id: string) {
    const ast = asteroids.find((a) => a.id === id);
    if (!ast || ast.state !== "floating") return;
    if (ast.letter === targetLetters[nextIdx]) {
      setAsteroids((prev) => prev.map((a) => a.id === id ? { ...a, state: "hit" } : a));
      const ni = nextIdx + 1;
      setNextIdx(ni);
      setScore((s) => s + 10);
      if (ni >= targetLetters.length) {
        setWin(true);
        setWords((w) => w + 1);
        setScore((s) => s + 20);
        setTimeout(startRound, 1800);
      }
    } else {
      setAsteroids((prev) => prev.map((a) => a.id === id ? { ...a, state: "wrong" } : a));
      setScore((s) => Math.max(0, s - 5));
      setTimeout(() => setAsteroids((prev) => prev.map((a) => a.id === id ? { ...a, state: "floating" } : a)), 400);
    }
  }

  const progress = targetLetters.map((l, i) => i < nextIdx ? l : "_").join(" ");

  return (
    <div className="gdsk-blaster-wrap">
      <div className="gdsk-blaster-header">
        <button onClick={onBack} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", fontSize: 13, cursor: "pointer" }}>← exit</button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>Letter Blaster</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#FFD580" }}>{words} words · {score} pts</div>
        </div>
        <div style={{ width: 48 }} />
      </div>

      <div className="gdsk-blaster-clue">
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginRight: 8, textTransform: "uppercase", letterSpacing: "0.12em" }}>Spell:</span>
        <span style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>{word?.en ?? "—"}</span>
      </div>

      <div className="gdsk-blaster-progress font-arabic" style={{ direction: "rtl" }}>
        {targetLetters.map((l, i) => (
          <span key={i} style={{ opacity: i < nextIdx ? 1 : 0.25, transition: "opacity 0.3s", margin: "0 4px", color: "#FFD580", fontSize: 32 }}>
            {l}
          </span>
        ))}
      </div>

      <div className="gdsk-blaster-field">
        {asteroids.map((a) => (
          <button
            key={a.id}
            className={`gdsk-asteroid gdsk-ast-${a.state}`}
            style={{
              left: `${a.x}%`,
              top: `${a.y}%`,
              animationDelay: `${a.delay}s`,
              visibility: a.state === "hit" ? "hidden" : "visible",
            }}
            onClick={() => blast(a.id)}
          >
            <span className="font-arabic">{a.letter}</span>
          </button>
        ))}
        {win && (
          <div className="gdsk-blast-win">
            <div className="font-arabic" style={{ fontSize: 48, color: "#FFD580", direction: "rtl" }}>{word?.ar}</div>
            <div style={{ fontSize: 16, color: "#fff", marginTop: 8 }}>{word?.en}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>+20 pts — next round…</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Word Builder ──────────────────────────────────────────────────────────────

interface WBLetter {
  ar: string;
  harakah: string | null;
  id: number;
}

let wbId = 0;

function WordBuilder({ onBack }: { onBack: () => void }) {
  const [letters, setLetters] = useState<WBLetter[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const wordStr = letters.map((l) => l.ar + (l.harakah ?? "")).join("");

  const builtForSpell: BuiltLetter[] = letters.map((l) => {
    const alpha = ALPHABET.find((a) => a.ar === l.ar) ?? { ar: l.ar, translit: l.ar, name: l.ar, forms: "" };
    return { ...alpha, harakah: l.harakah ? (HARAKAT.find((h) => h.mark === l.harakah) ?? null) : null };
  });
  const translit = letters.length ? spellWord(builtForSpell) : "";
  const { exact, bare } = letters.length ? lookupWord(wordStr) : { exact: null, bare: [] };

  function addLetter(ar: string) {
    const newLetter: WBLetter = { ar, harakah: null, id: wbId++ };
    setLetters((prev) => [...prev, newLetter]);
    setSelectedIdx(letters.length);
  }

  function applyHarakah(mark: string) {
    if (selectedIdx === null) return;
    setLetters((prev) => prev.map((l, i) => i === selectedIdx ? { ...l, harakah: l.harakah === mark ? null : mark } : l));
  }

  function eraseLast() {
    if (!letters.length) return;
    setLetters((prev) => prev.slice(0, -1));
    setSelectedIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : null));
  }

  function clearAll() {
    setLetters([]);
    setSelectedIdx(null);
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 5vw 80px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 0 28px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 14, color: "var(--ink-2)", cursor: "pointer" }}>← Back</button>
        <span style={{ color: "var(--border)" }}>|</span>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)" }}>Word Builder</span>
      </div>

      {/* Display */}
      <div className="gdsk-wb-display" onClick={() => setSelectedIdx(null)}>
        {letters.length === 0 ? (
          <span style={{ color: "var(--ink-3)", fontSize: 18, fontStyle: "italic" }}>Start typing below…</span>
        ) : (
          <>
            <div className="font-arabic gdsk-wb-word" style={{ direction: "rtl" }}>
              {letters.map((l, i) => (
                <span key={l.id} className={`gdsk-wb-letter ${selectedIdx === i ? "gdsk-wb-selected" : ""}`}
                      onClick={(e) => { e.stopPropagation(); setSelectedIdx(i); }}>
                  {l.ar}{l.harakah ?? ""}
                </span>
              ))}
            </div>
            {translit && <div className="gdsk-wb-translit">{translit}</div>}
            {exact && <div className="gdsk-wb-match gdsk-wb-exact">✅ <em>{exact.translit}</em> — {exact.en}</div>}
            {!exact && bare.length > 0 && <div className="gdsk-wb-match gdsk-wb-maybe">🟡 could be: {bare.slice(0,2).map(b => b.en).join(", ")}</div>}
          </>
        )}
      </div>

      {/* Harakah */}
      <div className="gdsk-wb-harakat">
        {HARAKAT.map((h) => (
          <button key={h.mark} className="gdsk-wb-hk"
                  title={h.sound}
                  style={{ background: letters[selectedIdx ?? -1]?.harakah === h.mark ? "var(--accent)" : undefined,
                           color: letters[selectedIdx ?? -1]?.harakah === h.mark ? "#fff" : undefined }}
                  onClick={() => applyHarakah(h.mark)}>
            <span className="font-arabic">{"ب" + h.mark}</span>
          </button>
        ))}
      </div>

      {/* Keyboard */}
      <div className="gdsk-kb">
        {KB_ROWS.map((row, ri) => (
          <div key={ri} className="gdsk-kb-row">
            {row.map((ar) => (
              <button key={ar} className="gdsk-kb-key font-arabic" onClick={() => addLetter(ar)}>{ar}</button>
            ))}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "center" }}>
        <button className="gdsk-wb-ctrl" onClick={eraseLast} disabled={!letters.length}>⌫ Erase</button>
        <button className="gdsk-wb-ctrl" onClick={clearAll} disabled={!letters.length}>Clear all</button>
        {wordStr && <button className="gdsk-wb-ctrl" onClick={() => speak(wordStr)}>♪ Hear it</button>}
      </div>

      {/* Demo words */}
      <div style={{ marginTop: 28, borderTop: "1px solid var(--border)", paddingTop: 20 }}>
        <p style={{ fontSize: 12, color: "var(--ink-3)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.1em" }}>Try these</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[{ar:"بيت",en:"house"},{ar:"قلم",en:"pen"},{ar:"كتاب",en:"book"},{ar:"درس",en:"lesson"},{ar:"نور",en:"light"}].map(({ ar, en }) => (
            <button key={ar} className="gdsk-wb-demo font-arabic" onClick={() => {
              const bare2 = bareWithMarks(ar.replace(/[ً-ْٰ]/g, ""));
              setLetters(bare2.map((b) => ({ ar: b.letter, harakah: null, id: wbId++ })));
              setSelectedIdx(null);
            }}>
              {ar} <span style={{ fontFamily: "inherit", fontSize: 11, color: "var(--ink-3)" }}>{en}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Alphabet Reference ────────────────────────────────────────────────────────

function AlphabetRef({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 5vw 80px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 0 28px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 14, color: "var(--ink-2)", cursor: "pointer" }}>← Back</button>
        <span style={{ color: "var(--border)" }}>|</span>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)" }}>
          Arabic Alphabet — 28 Letters
        </span>
      </div>
      <div className="gdsk-alpha-grid">
        {ALPHABET.map((l, i) => (
          <div key={i} className="gdsk-alpha-card">
            <div className="font-arabic gdsk-alpha-letter">{l.ar}</div>
            <div className="gdsk-alpha-name">{l.name}</div>
            <div className="gdsk-alpha-translit">{l.translit}</div>
            <div className="gdsk-alpha-forms font-arabic" style={{ direction: "rtl" }}>{l.forms}</div>
            {l.nc && <div className="gdsk-alpha-nc">non-connecting</div>}
          </div>
        ))}
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

  /* Letter Blaster */
  @keyframes gdsk-drift {
    0%,100% { transform: translate(0,0) rotate(0deg); }
    20%     { transform: translate(-10px,-14px) rotate(4deg); }
    45%     { transform: translate(12px,-8px) rotate(-3deg); }
    70%     { transform: translate(-6px,12px) rotate(2deg); }
  }
  @keyframes gdsk-boom {
    0%   { transform: scale(1);   opacity: 1; background: rgba(255,210,50,0.6); }
    35%  { transform: scale(2.4); opacity: 0.7; }
    100% { transform: scale(0);   opacity: 0; }
  }

  .gdsk-blaster-wrap { min-height: calc(100vh - 56px); display: flex; flex-direction: column; align-items: stretch; background: radial-gradient(ellipse at 50% 30%, #0a1a2e 0%, #050c16 100%); color: #fff; }
  .gdsk-blaster-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 5vw; border-bottom: 1px solid rgba(255,255,255,0.08); }
  .gdsk-blaster-clue { text-align: center; padding: 16px 5vw 4px; }
  .gdsk-blaster-progress { display: flex; justify-content: center; padding: 8px 5vw 12px; min-height: 52px; letter-spacing: 0.08em; }
  .gdsk-blaster-field { flex: 1; position: relative; min-height: 340px; overflow: hidden; margin: 0 5vw; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; background: rgba(255,255,255,0.02); }

  .gdsk-asteroid { position: absolute; width: 54px; height: 54px; border-radius: 50%; background: rgba(255,255,255,0.08); border: 1.5px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; cursor: pointer; animation: gdsk-drift 3.4s ease-in-out infinite; transition: background 0.1s; transform: translate(-50%,-50%); }
  .gdsk-asteroid:hover { background: rgba(255,255,255,0.16); border-color: rgba(255,210,50,0.6); }
  .gdsk-asteroid .font-arabic { font-size: 24px; color: #fff; pointer-events: none; }
  .gdsk-ast-hit  { animation: gdsk-boom 0.4s ease forwards !important; }
  .gdsk-ast-wrong { animation: gdsk-shake 0.4s ease !important; border-color: #C0392B !important; background: rgba(192,57,43,0.25) !important; }

  .gdsk-blast-win { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); animation: gdsk-pop 0.3s ease; border-radius: 16px; }

  /* Word Builder */
  .gdsk-wb-display { min-height: 120px; background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 24px 28px; display: flex; flex-direction: column; align-items: center; justify-content: center; margin-bottom: 20px; gap: 8px; }
  .gdsk-wb-word { font-size: clamp(36px,6vw,60px); line-height: 1.6; letter-spacing: 0.02em; color: var(--ink); cursor: default; }
  .gdsk-wb-letter { padding: 0 3px; border-radius: 4px; cursor: pointer; transition: background 0.12s; }
  .gdsk-wb-letter:hover { background: rgba(26,107,74,0.1); }
  .gdsk-wb-selected { background: rgba(196,149,42,0.18) !important; outline: 2px solid #C4952A; border-radius: 4px; }
  .gdsk-wb-translit { font-size: 15px; color: var(--ink-3); letter-spacing: 0.05em; font-style: italic; }
  .gdsk-wb-match { font-size: 14px; padding: 6px 16px; border-radius: 8px; }
  .gdsk-wb-exact { background: rgba(26,122,62,0.08); color: var(--accent); }
  .gdsk-wb-maybe { background: rgba(196,149,42,0.08); color: #7B4F12; }

  .gdsk-wb-harakat { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; margin-bottom: 14px; }
  .gdsk-wb-hk { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 6px 12px; cursor: pointer; font-size: 18px; line-height: 1; transition: background 0.12s, color 0.12s; }
  .gdsk-wb-hk:hover { border-color: var(--accent); }

  .gdsk-kb { display: flex; flex-direction: column; gap: 8px; align-items: center; }
  .gdsk-kb-row { display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; }
  .gdsk-kb-key { width: 44px; height: 44px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; font-size: 22px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.1s, transform 0.08s; color: var(--ink); }
  .gdsk-kb-key:hover { background: var(--bg); transform: translateY(-1px); }
  .gdsk-kb-key:active { transform: translateY(0); background: rgba(26,107,74,0.12); }
  @media (max-width: 480px) { .gdsk-kb-key { width: 36px; height: 36px; font-size: 18px; } }

  .gdsk-wb-ctrl { padding: 9px 20px; background: none; border: 1px solid var(--border); border-radius: 8px; font-size: 13px; color: var(--ink-2); cursor: pointer; transition: background 0.12s; }
  .gdsk-wb-ctrl:hover:not(:disabled) { background: var(--bg); }
  .gdsk-wb-ctrl:disabled { opacity: 0.35; cursor: default; }
  .gdsk-wb-demo { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 8px 16px; font-size: 22px; cursor: pointer; color: var(--ink); transition: border-color 0.12s; display: flex; flex-direction: column; align-items: center; gap: 2px; }
  .gdsk-wb-demo:hover { border-color: var(--accent); }

  /* Alphabet */
  .gdsk-alpha-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
  .gdsk-alpha-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 16px 12px 12px; display: flex; flex-direction: column; align-items: center; gap: 4px; transition: box-shadow 0.15s; }
  .gdsk-alpha-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.07); }
  .gdsk-alpha-letter { font-size: 40px; color: var(--accent); line-height: 1.4; }
  .gdsk-alpha-name { font-size: 13px; font-weight: 700; color: var(--ink); }
  .gdsk-alpha-translit { font-size: 11px; color: var(--ink-3); }
  .gdsk-alpha-forms { font-size: 13px; color: var(--ink-2); letter-spacing: 0.05em; }
  .gdsk-alpha-nc { font-size: 9px; color: #C4952A; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; background: rgba(196,149,42,0.1); padding: 2px 6px; border-radius: 4px; }

  /* Games hub section */
  .gdsk-game-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 16px; }
  @media (max-width: 700px) { .gdsk-game-cards { grid-template-columns: 1fr; } }
  .gdsk-game-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 24px 22px; display: flex; flex-direction: column; gap: 6px; cursor: pointer; transition: box-shadow 0.18s, transform 0.18s; }
  .gdsk-game-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.09); transform: translateY(-2px); }
  .gdsk-game-icon { font-size: 32px; margin-bottom: 6px; }
  .gdsk-game-title { font-size: 16px; font-weight: 700; color: var(--ink); }
  .gdsk-game-desc { font-size: 13px; color: var(--ink-3); line-height: 1.5; }
  .gdsk-game-tag { font-size: 10px; font-weight: 700; letter-spacing: 0.13em; text-transform: uppercase; margin-top: 8px; }
`;

// ── Root ──────────────────────────────────────────────────────────────────────

type Mode = "hub" | "lesson" | "drill" | "blaster" | "builder" | "alphabet";

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
          onBlaster={() => setMode("blaster")}
          onBuilder={() => setMode("builder")}
          onAlphabet={() => setMode("alphabet")}
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

      {mode === "blaster" && <LetterBlaster onBack={() => setMode("hub")} />}
      {mode === "builder" && <WordBuilder onBack={() => setMode("hub")} />}
      {mode === "alphabet" && <AlphabetRef onBack={() => setMode("hub")} />}
    </>
  );
}
