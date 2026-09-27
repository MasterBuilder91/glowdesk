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
    "exercise":      { label: "Skill Exercise",     color: "#5A2A6E" },
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
  onHarakat,
  streak,
  totalDrilled,
}: {
  onStudy: (s: Skill) => void;
  onDrill: (s: Skill) => void;
  onQuickDrill: () => void;
  onBlaster: () => void;
  onBuilder: () => void;
  onAlphabet: () => void;
  onHarakat: () => void;
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

      <section style={{ marginBottom: 48 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#1A6B4A" }}>
            Games &amp; Tools
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>
        <div className="gdsk-game-cards">
          <div className="gdsk-game-card" onClick={onAlphabet}>
            <div className="gdsk-game-icon font-arabic" style={{ fontSize: 28 }}>ا ب ت</div>
            <div className="gdsk-game-title">Alphabet — Lesson 1</div>
            <div className="gdsk-game-desc">Start here. 28 letters, why they go right to left, 4 forms each, and audio for every letter.</div>
            <div className="gdsk-game-tag" style={{ color: "#4A1A6E" }}>First lesson</div>
          </div>
          <div className="gdsk-game-card" onClick={onHarakat}>
            <div className="gdsk-game-icon font-arabic" style={{ fontSize: 22 }}>حَرَكَات</div>
            <div className="gdsk-game-title">Harakat Drill</div>
            <div className="gdsk-game-desc">Tap the correct floating harakah bubble (fatḥa, kasra, ḍamma, sukūn) to vowelize each letter.</div>
            <div className="gdsk-game-tag" style={{ color: "#7A1A6B" }}>Vowel marks</div>
          </div>
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
          <Link href="/sarf" className="gdsk-game-card" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="gdsk-game-icon font-arabic" style={{ fontFamily: "serif" }}>الصَّرْف</div>
            <div className="gdsk-game-title">Sarf Trainer</div>
            <div className="gdsk-game-desc">Conjugate 181+ verbs across all 10 forms + quadriliteral, 14 pronoun slots, active/passive.</div>
            <div className="gdsk-game-tag" style={{ color: "#1A6B4A" }}>Morphology drill</div>
          </Link>
        </div>
      </section>

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

// ── Alphabet Lesson ───────────────────────────────────────────────────────────

const LETTER_DETAIL: Record<string, {
  sound: string;
  tip: string;
  example: string;
  exampleMeaning: string;
  group: string;
  sun: boolean;
}> = {
  "ا": { sound: "aa / silent", tip: "Holds a vowel sound (like 'a' in 'father') or stays silent when carrying no vowel. It never stands alone — it always needs a harakah.", example: "اللَّه", exampleMeaning: "God", group: "vowel-carrier", sun: false },
  "ب": { sound: "b", tip: "Exactly like English 'b' in 'boat'. One dot below.", example: "بَيْت", exampleMeaning: "house", group: "easy", sun: false },
  "ت": { sound: "t", tip: "Touch the tip of your tongue to your upper teeth — slightly further forward than English 't'. Two dots above.", example: "تَوْبَة", exampleMeaning: "repentance", group: "easy", sun: true },
  "ث": { sound: "th", tip: "Like 'th' in 'think' — tongue lightly between your teeth. Three dots above.", example: "ثَمَر", exampleMeaning: "fruit", group: "easy", sun: true },
  "ج": { sound: "j", tip: "Like 'j' in 'jump' (Egyptian Arabic) or 'dge' in 'edge'. One dot inside the letter.", example: "جَنَّة", exampleMeaning: "paradise", group: "easy", sun: false },
  "ح": { sound: "ḥ (deep H)", tip: "UNIQUE TO ARABIC — exhale sharply from the throat without voicing it, like whispering the deepest possible 'h'. Not the same as ه.", example: "حَمْد", exampleMeaning: "praise", group: "guttural", sun: false },
  "خ": { sound: "kh", tip: "Like the sound in Scottish 'loch' or German 'Bach' — a raspy friction at the back of the throat. Like ح but with vibration.", example: "خَيْر", exampleMeaning: "goodness", group: "back-of-throat", sun: false },
  "د": { sound: "d", tip: "Touch the tongue tip to your upper teeth — like English 'd' but slightly more forward. Non-connecting letter.", example: "دِين", exampleMeaning: "religion", group: "easy", sun: true },
  "ذ": { sound: "dh", tip: "Like 'th' in 'this' or 'the' — voiced version of ث, tongue between teeth with buzzing. Non-connecting.", example: "ذِكْر", exampleMeaning: "remembrance", group: "easy", sun: true },
  "ر": { sound: "r (rolled)", tip: "A light tongue-tap or slight roll, like Spanish 'r' in 'pero'. Closer to the teeth than English 'r'. Non-connecting.", example: "رَحْمَة", exampleMeaning: "mercy", group: "easy", sun: true },
  "ز": { sound: "z", tip: "Exactly like English 'z' in 'zero'. Non-connecting.", example: "زَكَاة", exampleMeaning: "charity (Zakah)", group: "easy", sun: true },
  "س": { sound: "s", tip: "Like English 's' in 'sun' — never 'z'. Distinguish this from its emphatic version ص.", example: "سَلَام", exampleMeaning: "peace", group: "easy", sun: true },
  "ش": { sound: "sh", tip: "Like 'sh' in 'shoe' or 'ship'. Three dots above the basic shape of س.", example: "شَمْس", exampleMeaning: "sun", group: "easy", sun: true },
  "ص": { sound: "ṣ (emphatic S)", tip: "A darker, heavier 's' — press the back of the tongue down and back. The rest of the mouth widens. All vowels near it become darker.", example: "صَلَاة", exampleMeaning: "prayer (Salah)", group: "emphatic", sun: true },
  "ض": { sound: "ḍ (emphatic D)", tip: "UNIQUELY ARABIC — Arabic is called 'the language of ḍ'. A heavy 'd' made with the side of the tongue pressed to the upper teeth. Deeper than ظ.", example: "ضَوْء", exampleMeaning: "light", group: "emphatic", sun: true },
  "ط": { sound: "ṭ (emphatic T)", tip: "A heavy, dark 't' — back of tongue presses down, like saying 't' while holding your jaw wide open. Companion to ت.", example: "طَرِيق", exampleMeaning: "road / path", group: "emphatic", sun: true },
  "ظ": { sound: "ẓ (emphatic DH)", tip: "Emphatic version of ذ — heavy 'dh' with tongue between teeth and the back of mouth open. Many Arabs today pronounce it like ض.", example: "ظُلْم", exampleMeaning: "injustice", group: "emphatic", sun: true },
  "ع": { sound: "ʿayn (voiced guttural)", tip: "UNIQUE TO ARABIC — the throat tightens and vibrates. Like ح but voiced. No equivalent in English. This is the 'ayn' in words like Quran (which starts with ق, not ع).", example: "عِلْم", exampleMeaning: "knowledge", group: "guttural", sun: false },
  "غ": { sound: "gh (gargled R)", tip: "Like the Parisian French 'r' in 'Paris' — a raspy, gargled sound from the very back of the mouth. Voiced version of خ.", example: "غَفُور", exampleMeaning: "All-Forgiving", group: "back-of-throat", sun: false },
  "ف": { sound: "f", tip: "Exactly like English 'f' in 'faith' — upper teeth on lower lip. One dot above.", example: "فُرْقَان", exampleMeaning: "criterion (Al-Furqan)", group: "easy", sun: false },
  "ق": { sound: "q (uvular K)", tip: "A 'k' sound made from the very back of the throat, behind the uvula. English 'k' is too far forward. Two dots above.", example: "قُرْآن", exampleMeaning: "The Quran", group: "back-of-throat", sun: false },
  "ك": { sound: "k", tip: "Like English 'k' in 'king' or 'c' in 'cat'. Lighter than ق.", example: "كَلِمَة", exampleMeaning: "word", group: "easy", sun: false },
  "ل": { sound: "l", tip: "Like English 'l' but with the tongue tip on the upper teeth. In اللَّه it becomes heavy (dark L).", example: "لَيْل", exampleMeaning: "night", group: "easy", sun: true },
  "م": { sound: "m", tip: "Exactly like English 'm' in 'moon' — lips pressed together.", example: "مَاء", exampleMeaning: "water", group: "easy", sun: false },
  "ن": { sound: "n", tip: "Like English 'n' in 'night'. One dot above, like ب has one dot below.", example: "نُور", exampleMeaning: "light", group: "easy", sun: true },
  "ه": { sound: "h (soft H)", tip: "A soft, airy 'h' like English 'h' in 'house'. Different from ح which is a deep guttural 'h'.", example: "هُدًى", exampleMeaning: "guidance", group: "easy", sun: false },
  "و": { sound: "w / ūū", tip: "As a consonant: 'w' like 'water'. As a long vowel: 'oo' like 'moon'. Non-connecting. Alef, Waw, and Ya are the three long-vowel letters.", example: "وَحْي", exampleMeaning: "revelation (waḥy)", group: "vowel-carrier", sun: false },
  "ي": { sound: "y / īī", tip: "As a consonant: 'y' like 'yes'. As a long vowel: 'ee' like 'teen'. Two dots below in isolated/final form. Alef, Waw, and Ya are the three long-vowel letters.", example: "يَوْم", exampleMeaning: "day", group: "vowel-carrier", sun: false },
  "ى": { sound: "ā (long A)", tip: "The 'alif maqsurah' — appears at the end of words. Looks like ي without dots. Carries the long 'aa' sound. Non-connecting.", example: "مُوسَى", exampleMeaning: "Moses", group: "vowel-carrier", sun: false },
};

const ALPHA_GROUPS: Record<string, { label: string; color: string; bg: string; desc: string }> = {
  "easy":          { label: "Familiar", color: "#1A7A3E", bg: "rgba(26,122,62,0.1)", desc: "Close to English sounds" },
  "vowel-carrier": { label: "Vowel Carrier", color: "#1A4A8A", bg: "rgba(26,74,138,0.1)", desc: "Carry long vowel sounds" },
  "back-of-throat": { label: "Back of Throat", color: "#8A4A10", bg: "rgba(138,74,16,0.1)", desc: "Produced at back of mouth" },
  "emphatic":      { label: "Emphatic", color: "#6A1A7A", bg: "rgba(106,26,122,0.1)", desc: "Heavy versions of light sounds" },
  "guttural":      { label: "Pharyngeal", color: "#8A1A2A", bg: "rgba(138,26,42,0.1)", desc: "Deep in the throat — no English parallel" },
};

const ALPHA_FILTERS = [
  { key: "all",            label: "All 28" },
  { key: "easy",           label: "Familiar" },
  { key: "emphatic",       label: "Emphatic" },
  { key: "guttural",       label: "Pharyngeal" },
  { key: "back-of-throat", label: "Back of Throat" },
  { key: "vowel-carrier",  label: "Vowel Carriers" },
  { key: "sun",            label: "Sun Letters" },
  { key: "moon",           label: "Moon Letters" },
  { key: "nc",             label: "Non-Connecting" },
];

const AR_LETTER_NAMES: Record<string, string> = {
  "ا": "أَلِف", "ب": "بَاء", "ت": "تَاء", "ث": "ثَاء", "ج": "جِيم",
  "ح": "حَاء", "خ": "خَاء", "د": "دَال", "ذ": "ذَال", "ر": "رَاء",
  "ز": "زَاي", "س": "سِين", "ش": "شِين", "ص": "صَاد", "ض": "ضَاد",
  "ط": "طَاء", "ظ": "ظَاء", "ع": "عَيْن", "غ": "غَيْن", "ف": "فَاء",
  "ق": "قَاف", "ك": "كَاف", "ل": "لَام", "م": "مِيم", "ن": "نُون",
  "ه": "هَاء", "و": "وَاو", "ي": "يَاء", "ى": "أَلِف مَقْصُورَة",
};

function AlphabetRef({ onBack }: { onBack: () => void }) {
  const [showIntro, setShowIntro] = useState(true);
  const [selected, setSelected] = useState<number | null>(null);
  const [filter, setFilter] = useState("all");
  const [playing, setPlaying] = useState(false);

  const letter = selected !== null ? ALPHABET[selected] : null;
  const detail = letter ? LETTER_DETAIL[letter.ar] : null;

  const filtered = ALPHABET.filter((l) => {
    if (filter === "all") return true;
    const d = LETTER_DETAIL[l.ar];
    if (filter === "sun")  return !!d?.sun;
    if (filter === "moon") return d ? !d.sun : false;
    if (filter === "nc")   return !!l.nc;
    return d?.group === filter;
  });

  async function playLetter(ar: string, exampleWord: string) {
    if (playing) return;
    setPlaying(true);
    const arName = AR_LETTER_NAMES[ar] || ar;
    await speak(arName);
    setTimeout(async () => {
      await speak(exampleWord);
      setPlaying(false);
    }, 900);
  }

  // ── Intro screen ────────────────────────────────────────────────────────────
  if (showIntro) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 5vw 80px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 0 32px" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 14, color: "var(--ink-2)", cursor: "pointer" }}>← Back</button>
          <span style={{ color: "var(--border)" }}>|</span>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)" }}>Lesson 1 — الْحُرُوف</span>
        </div>

        {/* RTL demo */}
        <div style={{ textAlign: "center", padding: "24px 0 20px" }}>
          <div style={{ fontSize: 36, fontFamily: "var(--font-arabic)", color: "var(--accent)", direction: "rtl", letterSpacing: 6 }}>
            ا ← ب ← ت ← ث ← ج ← ح ← خ ← د ← ذ ← ر ← ز ← س ← ش ← ص ← ض ← ط ← ظ ← ع ← غ ← ف ← ق ← ك ← ل ← م ← ن ← ه ← و ← ي
          </div>
          <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 10, letterSpacing: "0.08em" }}>
            ← Arabic flows this direction — right to left
          </div>
        </div>

        {/* Why RTL */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "22px 24px", marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>
            Why does Arabic go right to left?
          </div>
          <div style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.8 }}>
            Arabic belongs to the Semitic family of scripts — the same family as Hebrew and Aramaic. These languages have written right to left since ancient times, when scribes would inscribe letters into stone and clay tablets moving from right to left. That tradition was preserved through thousands of years. When the Quran was revealed to the Prophet Muhammad ﷺ in the 7th century, it was written in this same right-to-left direction, and that is how every Arabic text — Quranic and otherwise — flows to this day.
          </div>
          <div style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.8, marginTop: 10 }}>
            It is not backwards. It is simply a different starting point — the right edge instead of the left. Once your eye adjusts, it feels completely natural.
          </div>
        </div>

        {/* What you'll learn */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "22px 24px", marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
            What you are about to learn
          </div>
          {[
            { icon: "٢٨", title: "28 consonant letters", body: "Arabic writes only consonants. There are no separate vowel letters — the vowels are added as tiny marks above or below the letters." },
            { icon: "٤", title: "4 shapes per letter", body: "Every letter changes form depending on where it appears in a word: alone, at the start, in the middle, or at the end." },
            { icon: "☀", title: "Sun & Moon letters", body: "14 letters cause the definite article ال to assimilate — the 'l' sound merges into the letter. The other 14 keep the 'l' clear. You will learn which is which." },
            { icon: "♪", title: "Tap to hear each letter", body: "Every letter has an audio button. You will hear the letter's Arabic name and an example word spoken by a native Arabic voice." },
          ].map(({ icon, title, body }) => (
            <div key={title} style={{ display: "flex", gap: 14, marginBottom: 14 }}>
              <div style={{ minWidth: 32, height: 32, borderRadius: 8, background: "rgba(26,122,62,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: "var(--accent)", fontFamily: "var(--font-arabic)", flexShrink: 0 }}>{icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", marginBottom: 3 }}>{title}</div>
                <div style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6 }}>{body}</div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => setShowIntro(false)} style={{
          width: "100%", padding: "16px 0", borderRadius: 12, border: "none",
          background: "var(--accent)", color: "#fff", fontSize: 16, fontWeight: 700,
          cursor: "pointer", letterSpacing: "0.04em",
        }}>
          Begin Lesson — Meet the Letters →
        </button>
      </div>
    );
  }

  // ── Letter detail view ──────────────────────────────────────────────────────
  if (letter && detail) {
    const group = ALPHA_GROUPS[detail.group];
    const formParts = letter.forms.split(" ");
    const forms = [
      { label: "Isolated", sub: "alone",          form: letter.ar },
      { label: "Initial",  sub: "start of word",  form: formParts[0] || "—" },
      { label: "Medial",   sub: "middle of word", form: formParts[1] || "—" },
      { label: "Final",    sub: "end of word",    form: formParts[2] || "—" },
    ];
    return (
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 5vw 80px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 0 24px" }}>
          <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", fontSize: 14, color: "var(--ink-2)", cursor: "pointer" }}>← All Letters</button>
          <span style={{ color: "var(--border)" }}>|</span>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)" }}>
            Letter {selected! + 1} of {ALPHABET.length}
          </span>
        </div>

        {/* Hero letter */}
        <div style={{ textAlign: "center", padding: "28px 0 20px" }}>
          <div style={{ fontSize: 110, lineHeight: 1.1, fontFamily: "var(--font-arabic)", color: "var(--accent)" }}>{letter.ar}</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", marginTop: 10 }}>{letter.name}</div>
          <div style={{ fontSize: 15, color: "var(--ink-2)", marginTop: 4, fontStyle: "italic" }}>/{letter.translit}/</div>

          {/* Audio button */}
          <button onClick={() => playLetter(letter.ar, detail.example)} disabled={playing} style={{
            marginTop: 16, padding: "10px 28px", borderRadius: 30, border: "2px solid var(--accent)",
            background: playing ? "var(--accent)" : "transparent",
            color: playing ? "#fff" : "var(--accent)",
            fontSize: 14, fontWeight: 700, cursor: playing ? "default" : "pointer",
            transition: "all 0.15s", letterSpacing: "0.04em",
          }}>
            {playing ? "▶ Playing…" : "♪ Hear it"}
          </button>

          <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
            <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: detail.sun ? "rgba(200,100,0,0.12)" : "rgba(0,70,200,0.1)", color: detail.sun ? "#C86400" : "#0046C8" }}>
              {detail.sun ? "☀ Sun Letter" : "☽ Moon Letter"}
            </span>
            {letter.nc && (
              <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: "rgba(100,0,100,0.1)", color: "#640064" }}>Non-Connecting</span>
            )}
            {group && (
              <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: group.bg, color: group.color }}>{group.label}</span>
            )}
          </div>
        </div>

        {/* How it sounds */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 22px", marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>How it sounds</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>{detail.sound}</div>
          <div style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.7 }}>{detail.tip}</div>
        </div>

        {/* 4 forms */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 22px", marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>4 Positional Forms</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {forms.map(({ label, sub, form }) => (
              <div key={label} style={{ textAlign: "center", padding: "14px 6px 10px", borderRadius: 8, background: "var(--bg)", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 34, fontFamily: "var(--font-arabic)", color: "var(--ink)", direction: "rtl", lineHeight: 1.4, marginBottom: 8 }}>{form}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--ink)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
                <div style={{ fontSize: 9, color: "var(--ink-3)", marginTop: 2 }}>{sub}</div>
              </div>
            ))}
          </div>
          {letter.nc && (
            <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 8, background: "rgba(196,149,42,0.08)", border: "1px solid rgba(196,149,42,0.2)", fontSize: 12, color: "#8A6020", lineHeight: 1.6 }}>
              <strong>Non-connecting:</strong> This letter only connects to the letter before it, never to the one after. The letter following it starts a fresh stroke.
            </div>
          )}
        </div>

        {/* Example word */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 22px", marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Example Word</div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ fontSize: 46, fontFamily: "var(--font-arabic)", color: "var(--ink)", direction: "rtl", lineHeight: 1.3 }}>{detail.example}</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>{detail.exampleMeaning}</div>
              <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 4 }}>Listen for the {letter.name} sound</div>
            </div>
          </div>
        </div>

        {/* Sun/Moon explanation */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 22px", marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
            {detail.sun ? "☀ Sun Letter — ال Assimilation" : "☽ Moon Letter — ال Stays Clear"}
          </div>
          {detail.sun ? (
            <div style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.7 }}>
              When <span style={{ fontFamily: "var(--font-arabic)", fontSize: 16 }}>ال</span> (the) comes before a sun letter, the <span style={{ fontFamily: "var(--font-arabic)", fontSize: 16 }}>ل</span> disappears into the letter.{" "}
              <strong>al-{letter.name.split(" ")[0]}</strong> is pronounced as{" "}
              <strong>a<span style={{ textDecoration: "underline" }}>{letter.translit.replace(/[^a-z]/g, "")}</span>-</strong>.{" "}
              Example: <span style={{ fontFamily: "var(--font-arabic)", fontSize: 16 }}>الشَّمْس</span> = ash-shams (not al-shams).
            </div>
          ) : (
            <div style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.7 }}>
              When <span style={{ fontFamily: "var(--font-arabic)", fontSize: 16 }}>ال</span> (the) comes before a moon letter, you pronounce the <span style={{ fontFamily: "var(--font-arabic)", fontSize: 16 }}>ل</span> clearly.{" "}
              <strong>al-{letter.name.split(" ")[0]}</strong> stays as <strong>al-</strong>.{" "}
              Example: <span style={{ fontFamily: "var(--font-arabic)", fontSize: 16 }}>الْقَمَر</span> = al-qamar.
            </div>
          )}
        </div>

        {/* Prev / Next */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button onClick={() => setSelected(Math.max(0, selected! - 1))} disabled={selected === 0}
            style={{ padding: "10px 22px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--ink)", cursor: selected === 0 ? "not-allowed" : "pointer", opacity: selected === 0 ? 0.4 : 1, fontSize: 13, fontWeight: 600 }}>
            ← Prev
          </button>
          <button onClick={() => setSelected(null)}
            style={{ padding: "10px 22px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--ink-2)", cursor: "pointer", fontSize: 13 }}>
            All Letters
          </button>
          <button onClick={() => setSelected(Math.min(ALPHABET.length - 1, selected! + 1))} disabled={selected === ALPHABET.length - 1}
            style={{ padding: "10px 22px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--ink)", cursor: selected === ALPHABET.length - 1 ? "not-allowed" : "pointer", opacity: selected === ALPHABET.length - 1 ? 0.4 : 1, fontSize: 13, fontWeight: 600 }}>
            Next →
          </button>
        </div>
      </div>
    );
  }

  // ── Grid view ───────────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 940, margin: "0 auto", padding: "0 5vw 80px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 0 24px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 14, color: "var(--ink-2)", cursor: "pointer" }}>← Back</button>
        <span style={{ color: "var(--border)" }}>|</span>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)" }}>
          Lesson 1 — الْحُرُوف — The 28 Letters
        </span>
      </div>

      <div style={{ padding: "4px 0 20px" }}>
        <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.75, maxWidth: 620, margin: 0 }}>
          Arabic has 28 consonant letters. All vowels are added as small marks <em>(harakāt)</em>.
          Every letter has up to 4 forms depending on its position in the word.
          Letters flow <strong>right to left</strong>. Click any letter to learn how it sounds.
        </p>
      </div>

      {/* Filter bar */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 22 }}>
        {ALPHA_FILTERS.map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(key)} style={{
            padding: "5px 13px", borderRadius: 20,
            border: `1px solid ${filter === key ? "var(--accent)" : "var(--border)"}`,
            background: filter === key ? "var(--accent)" : "var(--surface)",
            color: filter === key ? "#fff" : "var(--ink-2)",
            fontSize: 11, fontWeight: 600, cursor: "pointer",
          }}>{label}</button>
        ))}
      </div>

      {/* Sun/Moon explainer — shown when one is selected */}
      {(filter === "sun" || filter === "moon") && (
        <div style={{ padding: "14px 18px", borderRadius: 10, background: "var(--surface)", border: "1px solid var(--border)", marginBottom: 20, fontSize: 13, color: "var(--ink-2)", lineHeight: 1.65 }}>
          {filter === "sun"
            ? "☀ Sun letters absorb the ل of ال. Writing: اَلشَّمْس — Reading: ash-shams. The doubled letter shows the assimilation (shaddah)."
            : "☽ Moon letters keep the ل of ال fully pronounced. Writing: اَلْقَمَر — Reading: al-qamar."}
        </div>
      )}

      {/* RTL letter grid */}
      <div className="gdsk-alpha-grid" style={{ direction: "rtl" }}>
        {filtered.map((l) => {
          const d = LETTER_DETAIL[l.ar];
          const grp = d ? ALPHA_GROUPS[d.group] : null;
          const idx = ALPHABET.indexOf(l);
          return (
            <button key={l.ar} onClick={() => setSelected(idx)} className="gdsk-alpha-card gdsk-alpha-card-btn" style={{ direction: "ltr" }}>
              <div className="font-arabic gdsk-alpha-letter">{l.ar}</div>
              <div className="gdsk-alpha-name">{l.name}</div>
              <div className="gdsk-alpha-translit">{l.translit}</div>
              {d && (
                <div style={{ marginTop: 5, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: d.sun ? "#C86400" : "#0046C8" }}>
                    {d.sun ? "☀ sun" : "☽ moon"}
                  </span>
                  {grp && (
                    <span style={{ fontSize: 8, fontWeight: 600, color: grp.color, background: grp.bg, padding: "1px 6px", borderRadius: 4 }}>
                      {grp.label}
                    </span>
                  )}
                  {l.nc && (
                    <span style={{ fontSize: 8, color: "#C4952A", fontWeight: 700 }}>non-conn.</span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Harakat Drill (bubble game) ───────────────────────────────────────────────

const HRKT_MARKS = [
  { mark: "َ", name: "Fatḥa",  roman: "a",  display: "بَ" },
  { mark: "ِ", name: "Kasra",   roman: "i",  display: "بِ" },
  { mark: "ُ", name: "Ḍamma",   roman: "u",  display: "بُ" },
  { mark: "ْ", name: "Sukūn",   roman: "°",  display: "بْ" },
];

interface HLetter { base: string; mark: string; }

const HRKT_WORDS: { arabic: string; english: string; letters: HLetter[] }[] = [
  { arabic: "نُور",   english: "light",      letters: [{base:"ن",mark:"ُ"},{base:"و",mark:""},{base:"ر",mark:""}] },
  { arabic: "بَيْت", english: "house",  letters: [{base:"ب",mark:"َ"},{base:"ي",mark:"ْ"},{base:"ت",mark:""}] },
  { arabic: "عِلْم", english: "knowledge", letters: [{base:"ع",mark:"ِ"},{base:"ل",mark:"ْ"},{base:"م",mark:""}] },
  { arabic: "قَلَم", english: "pen",    letters: [{base:"ق",mark:"َ"},{base:"ل",mark:"َ"},{base:"م",mark:""}] },
  { arabic: "رَجُل", english: "man",    letters: [{base:"ر",mark:"َ"},{base:"ج",mark:"ُ"},{base:"ل",mark:""}] },
  { arabic: "يَوْم", english: "day",    letters: [{base:"ي",mark:"َ"},{base:"و",mark:"ْ"},{base:"م",mark:""}] },
  { arabic: "مِنْ",        english: "from",   letters: [{base:"م",mark:"ِ"},{base:"ن",mark:"ْ"}] },
  { arabic: "فِعْل", english: "verb",   letters: [{base:"ف",mark:"ِ"},{base:"ع",mark:"ْ"},{base:"ل",mark:""}] },
  { arabic: "نَفْس", english: "soul",   letters: [{base:"ن",mark:"َ"},{base:"ف",mark:"ْ"},{base:"س",mark:""}] },
  { arabic: "كِتَاب", english: "book", letters: [{base:"ك",mark:"ِ"},{base:"ت",mark:"َ"},{base:"ا",mark:""},{base:"ب",mark:""}] },
  { arabic: "عَمَل", english: "work",   letters: [{base:"ع",mark:"َ"},{base:"م",mark:"َ"},{base:"ل",mark:""}] },
  { arabic: "رَحِم", english: "mercy",  letters: [{base:"ر",mark:"َ"},{base:"ح",mark:"ِ"},{base:"م",mark:""}] },
  { arabic: "صَبْر", english: "patience", letters: [{base:"ص",mark:"َ"},{base:"ب",mark:"ْ"},{base:"ر",mark:""}] },
  { arabic: "قَلْب", english: "heart",  letters: [{base:"ق",mark:"َ"},{base:"ل",mark:"ْ"},{base:"ب",mark:""}] },
  { arabic: "عَقْل", english: "mind",   letters: [{base:"ع",mark:"َ"},{base:"ق",mark:"ْ"},{base:"ل",mark:""}] },
];

const BASIC_MARKS = new Set(["َ", "ِ", "ُ", "ْ"]);

// Bubble positions (top, right, bottom, left of center)
const BUBBLE_POS = [
  { top: "6%",  left: "50%", transform: "translateX(-50%)" },
  { top: "50%", left: "88%", transform: "translateY(-50%)" },
  { top: "78%", left: "50%", transform: "translateX(-50%)" },
  { top: "50%", left: "6%",  transform: "translateY(-50%)" },
];

function HarakatDrill({ onBack }: { onBack: () => void }) {
  const [wordIdx, setWordIdx] = useState(0);
  const [letterIdx, setLetterIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [wordsDone, setWordsDone] = useState(0);
  const [bubbleState, setBubbleState] = useState<Record<string, "idle" | "hit" | "wrong">>({});
  const [win, setWin] = useState(false);
  const [locked, setLocked] = useState(false);

  const word = HRKT_WORDS[wordIdx % HRKT_WORDS.length];
  const drillable = word.letters.filter(l => BASIC_MARKS.has(l.mark));
  const current = drillable[letterIdx];

  function resetBubbles() { setBubbleState({}); }

  function tap(mark: string) {
    if (locked || !current) return;
    setLocked(true);
    const correct = mark === current.mark;
    setBubbleState(prev => ({ ...prev, [mark]: correct ? "hit" : "wrong" }));
    if (correct) {
      setScore(s => s + 10);
      setTimeout(() => {
        resetBubbles();
        const nextLi = letterIdx + 1;
        if (nextLi >= drillable.length) {
          setWin(true);
          setWordsDone(w => w + 1);
          setScore(s => s + 20);
          setTimeout(() => {
            setWin(false);
            setWordIdx(i => i + 1);
            setLetterIdx(0);
            setLocked(false);
          }, 1600);
        } else {
          setLetterIdx(nextLi);
          setLocked(false);
        }
      }, 700);
    } else {
      setScore(s => Math.max(0, s - 5));
      setTimeout(() => {
        setBubbleState(prev => ({ ...prev, [mark]: "idle" }));
        setLocked(false);
      }, 500);
    }
  }

  const markInfo = HRKT_MARKS.find(h => h.mark === current?.mark);

  return (
    <div className="hrkt-wrap">
      <div className="hrkt-header">
        <button onClick={onBack} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.6)", fontSize:13, cursor:"pointer" }}>← exit</button>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:13, color:"rgba(255,255,255,0.5)", marginBottom:2 }}>Harakat Drill</div>
          <div style={{ fontSize:18, fontWeight:700, color:"#FFD580" }}>{wordsDone} words · {score} pts</div>
        </div>
        <div style={{ width:48 }} />
      </div>

      {/* Target word */}
      <div style={{ textAlign:"center", padding:"12px 0 4px" }}>
        <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:4 }}>
          Vowelize: {word.english}
        </div>
        <div className="font-arabic hrkt-word-progress" dir="rtl">
          {word.letters.map((l, i) => {
            const di = drillable.findIndex(d => d === l);
            const isDrillable = di >= 0;
            const isRevealed = !isDrillable || di < letterIdx || win;
            const isCurrent = isDrillable && di === letterIdx && !win;
            return (
              <span key={i} className={isCurrent ? "hrkt-current-letter" : ""} style={{ opacity: isRevealed || isCurrent ? 1 : 0.2, transition: "opacity 0.3s" }}>
                {l.base}{isRevealed ? l.mark : ""}
              </span>
            );
          })}
        </div>
      </div>

      {/* Bubble field */}
      <div className="hrkt-field">
        {/* Center letter */}
        <div className="hrkt-center font-arabic">
          {current?.base ?? "✓"}
        </div>

        {/* 4 harakah bubbles */}
        {!win && HRKT_MARKS.map((h, i) => {
          const state = bubbleState[h.mark] ?? "idle";
          return (
            <button
              key={h.mark}
              className={`hrkt-bubble hrkt-bbl-${state}`}
              style={{ ...BUBBLE_POS[i], animationDelay: `${i * 0.5}s` }}
              onClick={() => tap(h.mark)}
              disabled={locked}
            >
              <span className="font-arabic hrkt-bbl-ar">{h.display}</span>
              <span className="hrkt-bbl-name">{h.name}</span>
              <span className="hrkt-bbl-roman">{h.roman}</span>
            </button>
          );
        })}

        {win && (
          <div className="hrkt-win">
            <div className="font-arabic" style={{ fontSize:52, color:"#FFD580", direction:"rtl" }}>{word.arabic}</div>
            <div style={{ fontSize:16, color:"#fff", marginTop:6 }}>{word.english}</div>
            {markInfo && <div style={{ fontSize:13, color:"rgba(255,255,255,0.55)", marginTop:4 }}>+20 pts — next word…</div>}
          </div>
        )}
      </div>

      {/* Harakah key reference */}
      <div className="hrkt-legend">
        {HRKT_MARKS.map(h => (
          <div key={h.mark} className="hrkt-legend-item">
            <span className="font-arabic hrkt-legend-ar">{h.display}</span>
            <span className="hrkt-legend-name">{h.name} · "{h.roman}"</span>
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
  .gdsk-wb-word { font-size: clamp(36px,6vw,60px); line-height: 1.6; color: var(--ink); cursor: default; }
  .gdsk-wb-letter { cursor: pointer; border-bottom: 3px solid transparent; transition: border-color 0.12s; }
  .gdsk-wb-letter:hover { border-bottom-color: rgba(26,107,74,0.4); }
  .gdsk-wb-selected { border-bottom: 3px solid #C4952A !important; }
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

  /* Harakat Drill */
  .hrkt-wrap { min-height: calc(100vh - 56px); display: flex; flex-direction: column; align-items: stretch; background: radial-gradient(ellipse at 50% 20%, #1a0a2e 0%, #06030f 100%); color: #fff; }
  .hrkt-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 5vw; border-bottom: 1px solid rgba(255,255,255,0.07); }
  .hrkt-word-progress { font-size: clamp(36px,6vw,56px); line-height: 1.8; letter-spacing: 0.04em; color: #fff; margin: 0; display: flex; justify-content: center; gap: 2px; flex-direction: row-reverse; }
  .hrkt-current-letter { color: #FFD580; filter: drop-shadow(0 0 8px rgba(255,213,128,0.6)); }
  .hrkt-field { flex: 1; position: relative; min-height: 300px; max-height: 340px; margin: 16px 5vw 0; border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; background: rgba(255,255,255,0.02); }
  .hrkt-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); font-size: 80px; color: #fff; line-height: 1; pointer-events: none; filter: drop-shadow(0 0 16px rgba(255,255,255,0.15)); }
  .hrkt-bubble { position: absolute; width: 86px; height: 86px; border-radius: 50%; background: rgba(255,255,255,0.07); border: 1.5px solid rgba(255,255,255,0.2); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; cursor: pointer; animation: gdsk-drift 3.5s ease-in-out infinite; transition: background 0.12s, border-color 0.12s; }
  .hrkt-bubble:hover:not(:disabled) { background: rgba(255,255,255,0.15); border-color: rgba(255,213,128,0.5); }
  .hrkt-bubble:disabled { cursor: default; }
  .hrkt-bbl-ar { font-size: 30px; color: #fff; line-height: 1; pointer-events: none; }
  .hrkt-bbl-name { font-size: 9px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.08em; pointer-events: none; }
  .hrkt-bbl-roman { font-size: 11px; font-weight: 700; color: #FFD580; pointer-events: none; }
  .hrkt-bbl-idle  { }
  .hrkt-bbl-hit   { background: rgba(26,122,62,0.4) !important; border-color: #1A7A3E !important; animation: gdsk-boom 0.45s ease forwards !important; }
  .hrkt-bbl-wrong { background: rgba(192,57,43,0.3) !important; border-color: #C0392B !important; animation: gdsk-shake 0.4s ease !important; }
  .hrkt-win { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(0,0,0,0.72); backdrop-filter: blur(4px); animation: gdsk-pop 0.3s ease; border-radius: 20px; }
  .hrkt-legend { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; padding: 14px 5vw 24px; }
  .hrkt-legend-item { display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 6px 12px; }
  .hrkt-legend-ar { font-size: 20px; color: #FFD580; }
  .hrkt-legend-name { font-size: 11px; color: rgba(255,255,255,0.55); }

  /* Alphabet */
  .gdsk-alpha-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; }
  .gdsk-alpha-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 16px 12px 12px; display: flex; flex-direction: column; align-items: center; gap: 4px; transition: box-shadow 0.15s; }
  .gdsk-alpha-card-btn { cursor: pointer; appearance: none; -webkit-appearance: none; text-align: center; }
  .gdsk-alpha-card-btn:hover { box-shadow: 0 4px 18px rgba(0,0,0,0.10); border-color: var(--accent); }
  .gdsk-alpha-letter { font-size: 42px; color: var(--accent); line-height: 1.4; }
  .gdsk-alpha-name { font-size: 12px; font-weight: 700; color: var(--ink); }
  .gdsk-alpha-translit { font-size: 10px; color: var(--ink-3); }
  .gdsk-alpha-forms { font-size: 13px; color: var(--ink-2); letter-spacing: 0.05em; }
  .gdsk-alpha-nc { font-size: 9px; color: #C4952A; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; background: rgba(196,149,42,0.1); padding: 2px 6px; border-radius: 4px; }

  /* Games hub section */
  .gdsk-game-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; margin-top: 16px; }
  @media (max-width: 500px) { .gdsk-game-cards { grid-template-columns: 1fr; } }
  .gdsk-game-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 24px 22px; display: flex; flex-direction: column; gap: 6px; cursor: pointer; transition: box-shadow 0.18s, transform 0.18s; }
  .gdsk-game-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.09); transform: translateY(-2px); }
  .gdsk-game-icon { font-size: 32px; margin-bottom: 6px; }
  .gdsk-game-title { font-size: 16px; font-weight: 700; color: var(--ink); }
  .gdsk-game-desc { font-size: 13px; color: var(--ink-3); line-height: 1.5; }
  .gdsk-game-tag { font-size: 10px; font-weight: 700; letter-spacing: 0.13em; text-transform: uppercase; margin-top: 8px; }
`;

// ── Root ──────────────────────────────────────────────────────────────────────

type Mode = "hub" | "lesson" | "drill" | "blaster" | "builder" | "alphabet" | "harakat";

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
          onHarakat={() => setMode("harakat")}
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

      {mode === "blaster"  && <LetterBlaster onBack={() => setMode("hub")} />}
      {mode === "builder"  && <WordBuilder onBack={() => setMode("hub")} />}
      {mode === "alphabet" && <AlphabetRef onBack={() => setMode("hub")} />}
      {mode === "harakat"  && <HarakatDrill onBack={() => setMode("hub")} />}
    </>
  );
}
