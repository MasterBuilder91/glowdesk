"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  STARTER_VERBS, CONJUGATION_SLOTS, FORM_LABELS,
  generateConjugationsForVerb,
} from "@/data/sarf";
import type { Verb, Tense, Voice } from "@/data/sarf";

const AVAILABLE_FORMS = [1, 2, 3, 4, 5, 6, 7, 8, 10];
const FORM_NUMS = ["","I","II","III","IV","V","VI","VII","VIII","IX","X"];
const TENSE_LABELS: Record<Tense, { ar: string; en: string }> = {
  madi:   { ar: "الماضي",   en: "Past" },
  mudari: { ar: "المضارع",  en: "Present" },
  amr:    { ar: "الأمر",    en: "Imperative" },
};

type View = "hub" | "verbs" | "drill";

// ─── Hub ─────────────────────────────────────────────────────────────────────

function Hub({ onVerbs, onScaleDrill }: { onVerbs: (form?: number) => void; onScaleDrill: () => void }) {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <header className="border-b border-stone-800 px-4 py-3 flex items-center gap-3">
        <Link href="/learn" className="text-stone-400 hover:text-stone-100 text-sm">← Learn</Link>
        <span className="text-stone-600">|</span>
        <h1 className="font-semibold text-stone-100">Sarf Trainer</h1>
        <span className="ml-auto text-xs text-stone-500 bg-stone-900 px-2 py-0.5 rounded">
          {STARTER_VERBS.length} verbs
        </span>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="text-6xl font-bold mb-2" style={{ fontFamily: "serif", direction: "rtl" }}>
            الصَّرْف
          </div>
          <p className="text-stone-400 text-sm leading-relaxed max-w-sm mx-auto">
            Arabic morphology — conjugate verbs across all 10 forms, 14 pronoun slots,
            3 tenses, active and passive voice.
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => onVerbs()}
            className="flex-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl py-3 font-semibold transition-colors"
          >
            Browse Verbs
          </button>
          <button
            onClick={onScaleDrill}
            className="flex-1 bg-stone-800 hover:bg-stone-700 text-stone-100 rounded-xl py-3 font-semibold border border-stone-700 transition-colors"
          >
            Random Drill
          </button>
        </div>

        {/* Form grid */}
        <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-3">
          Browse by Form
        </h2>
        <div className="grid grid-cols-1 gap-2">
          {AVAILABLE_FORMS.map(f => {
            const label = FORM_LABELS[f];
            const count = STARTER_VERBS.filter(v => v.form === f).length;
            return (
              <button
                key={f}
                onClick={() => onVerbs(f)}
                className="flex items-center gap-4 bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-stone-600 rounded-xl px-4 py-3 text-left transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-stone-800 group-hover:bg-emerald-900/40 flex items-center justify-center shrink-0 transition-colors">
                  <span className="text-xs font-bold text-stone-400 group-hover:text-emerald-400">{FORM_NUMS[f]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xl" style={{ fontFamily: "serif", direction: "rtl" }}>{label.ar}</span>
                    <span className="text-xs text-stone-500">{label.pattern}</span>
                  </div>
                  <div className="text-xs text-stone-500 truncate">{label.meaning}</div>
                </div>
                <span className="text-xs text-stone-600 shrink-0">{count}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Verb List ────────────────────────────────────────────────────────────────

function VerbList({
  initialForm,
  onBack,
  onDrill,
}: {
  initialForm?: number;
  onBack: () => void;
  onDrill: (verbId: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [filterQuranic, setFilterQuranic] = useState(false);
  const [filterForm, setFilterForm] = useState<number>(initialForm ?? 0);

  const filtered = useMemo(() =>
    STARTER_VERBS.filter(v => {
      if (filterQuranic && !v.isQuranic) return false;
      if (filterForm > 0 && v.form !== filterForm) return false;
      if (!search) return true;
      return (
        v.meaningEn.toLowerCase().includes(search.toLowerCase()) ||
        v.root.includes(search) ||
        v.madi.includes(search)
      );
    }),
    [search, filterQuranic, filterForm]
  );

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <header className="border-b border-stone-800 px-4 py-3 flex items-center gap-3 sticky top-0 bg-stone-950 z-10">
        <button onClick={onBack} className="text-stone-400 hover:text-stone-100 text-sm">← Back</button>
        <span className="text-stone-600">|</span>
        <h1 className="font-semibold text-stone-100">Verb Library</h1>
        <span className="ml-auto text-xs text-stone-500">{filtered.length} verbs</span>
      </header>

      <div className="max-w-lg mx-auto px-4 pt-4">
        {/* Search + Quranic toggle */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search meaning, root, or Arabic…"
            className="flex-1 bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-emerald-600"
          />
          <button
            onClick={() => setFilterQuranic(!filterQuranic)}
            className={`px-3 rounded-lg text-xs font-medium border transition-all ${
              filterQuranic
                ? "bg-amber-600/20 border-amber-500/40 text-amber-400"
                : "border-stone-700 text-stone-400 hover:text-stone-100"
            }`}
          >
            ☪
          </button>
        </div>

        {/* Form chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <button
            onClick={() => setFilterForm(0)}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
              filterForm === 0
                ? "bg-emerald-700/30 border-emerald-600/40 text-emerald-400"
                : "border-stone-700 text-stone-400 hover:text-stone-100"
            }`}
          >
            All
          </button>
          {AVAILABLE_FORMS.map(f => (
            <button
              key={f}
              onClick={() => setFilterForm(filterForm === f ? 0 : f)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                filterForm === f
                  ? "bg-emerald-700/30 border-emerald-600/40 text-emerald-400"
                  : "border-stone-700 text-stone-400 hover:text-stone-100"
              }`}
            >
              <span style={{ fontFamily: "serif", direction: "rtl" }}>{FORM_LABELS[f].ar}</span>
              <span className="opacity-60">({STARTER_VERBS.filter(v => v.form === f).length})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pb-8 space-y-2">
        {filtered.map(verb => (
          <button
            key={verb.id}
            onClick={() => onDrill(verb.id)}
            className="w-full bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-stone-600 rounded-xl px-4 py-3 text-left group transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl shrink-0" style={{ fontFamily: "serif", direction: "rtl" }}>
                {verb.madi}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-stone-100 truncate">{verb.meaningEn}</div>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-800 text-stone-400">{verb.root}</span>
                  {verb.form > 1 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/40 text-emerald-400 font-medium">
                      Form {FORM_NUMS[verb.form]}
                    </span>
                  )}
                  {verb.isQuranic && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-900/30 text-amber-500">☪ Quranic</span>
                  )}
                </div>
              </div>
              <span className="text-stone-600 group-hover:text-stone-400 transition-colors text-lg">→</span>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-stone-500 text-sm">No verbs match.</div>
        )}
      </div>
    </div>
  );
}

// ─── Drill ────────────────────────────────────────────────────────────────────

function Drill({
  verb,
  onBack,
  onNextRandom,
}: {
  verb: Verb;
  onBack: () => void;
  onNextRandom: () => void;
}) {
  const [tense, setTense]   = useState<Tense>("madi");
  const [voice, setVoice]   = useState<Voice>("active");
  const [slotIdx, setSlotIdx] = useState(0);
  const [done, setDone]     = useState(false);

  const validSlots = tense === "amr"
    ? CONJUGATION_SLOTS.filter(s => s.slotId >= 7 && s.slotId <= 12)
    : CONJUGATION_SLOTS;

  const conjugations = generateConjugationsForVerb(verb, tense, voice);

  function handleTense(t: Tense) {
    setTense(t);
    setSlotIdx(0);
    setDone(false);
  }
  function handleVoice(v: Voice) {
    setVoice(v);
    setSlotIdx(0);
    setDone(false);
  }
  function handleNext() {
    if (slotIdx + 1 >= validSlots.length) {
      setDone(true);
    } else {
      setSlotIdx(s => s + 1);
    }
  }
  function handleRestart() {
    setSlotIdx(0);
    setDone(false);
  }

  const progress = validSlots.length ? (slotIdx / validSlots.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-stone-800 px-4 py-3 shrink-0">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={onBack} className="text-stone-400 hover:text-stone-100 text-sm">← Verbs</button>
          </div>

          {/* Verb hero */}
          <div className="text-center mb-3">
            <div className="text-5xl leading-none mb-1" style={{ fontFamily: "serif", direction: "rtl" }}>
              {verb.madi}
            </div>
            <div className="flex items-center justify-center gap-3 text-sm">
              <span className="text-stone-400 font-mono">{verb.root}</span>
              <span className="text-emerald-400">{verb.meaningEn}</span>
              {verb.form > 1 && (
                <span className="text-xs px-2 py-0.5 rounded bg-stone-800 text-stone-400">
                  Form {FORM_NUMS[verb.form]}
                </span>
              )}
            </div>
          </div>

          {/* Tense tabs */}
          <div className="flex gap-1 bg-stone-900 rounded-xl p-1 mb-2">
            {(["madi", "mudari", "amr"] as Tense[]).map(t => (
              <button
                key={t}
                onClick={() => handleTense(t)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  tense === t
                    ? "bg-emerald-700 text-white"
                    : "text-stone-400 hover:text-stone-100"
                }`}
              >
                <span className="block text-base" style={{ fontFamily: "serif", direction: "rtl" }}>{TENSE_LABELS[t].ar}</span>
                <span className="block text-[10px] font-normal">{TENSE_LABELS[t].en}</span>
              </button>
            ))}
          </div>

          {/* Voice toggle */}
          {tense !== "amr" && (
            <div className="flex gap-1 bg-stone-900 rounded-lg p-1 mb-2">
              {(["active", "passive"] as Voice[]).map(v => (
                <button
                  key={v}
                  onClick={() => handleVoice(v)}
                  className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${
                    voice === v
                      ? "bg-stone-700 text-stone-100"
                      : "text-stone-500 hover:text-stone-300"
                  }`}
                >
                  {v === "active" ? "مَعْلُوم (Active)" : "مَجْهُول (Passive)"}
                </button>
              ))}
            </div>
          )}

          {/* Progress bar */}
          {!done && (
            <div className="h-1 bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </header>

      {/* Conjugation slots */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-lg mx-auto px-4 py-4">
          {done ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-5xl mb-4">✓</div>
              <h2 className="text-2xl font-bold mb-2">Drill Complete</h2>
              <p className="text-stone-400 text-sm mb-8">
                {validSlots.length} slots · {verb.madi} · {TENSE_LABELS[tense].en}{tense !== "amr" ? ` ${voice}` : ""}
              </p>
              <div className="flex flex-col gap-3 w-full max-w-xs">
                <button
                  onClick={onNextRandom}
                  className="w-full bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl py-3 font-semibold transition-colors"
                >
                  Next Random Verb
                </button>
                <button
                  onClick={handleRestart}
                  className="w-full bg-stone-800 hover:bg-stone-700 text-stone-100 rounded-xl py-3 font-semibold border border-stone-700 transition-colors"
                >
                  Drill Again
                </button>
                <button
                  onClick={onBack}
                  className="w-full text-stone-400 hover:text-stone-100 text-sm py-2 transition-colors"
                >
                  Back to verbs
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {validSlots.map((slot, index) => {
                const conj = conjugations.find(c => c.slotId === slot.slotId);
                const isActive = index === slotIdx;
                const isCompleted = index < slotIdx;
                return (
                  <div
                    key={slot.slotId}
                    className={`flex items-center gap-4 rounded-xl border px-4 py-3 transition-all duration-200 ${
                      isActive
                        ? "border-emerald-700/60 bg-emerald-950/30"
                        : isCompleted
                        ? "border-stone-800/50 bg-stone-900/40 opacity-40"
                        : "border-stone-800 bg-stone-900/40 opacity-60"
                    }`}
                  >
                    {/* Pronoun */}
                    <div className="w-20 shrink-0 text-right">
                      <div
                        className={`text-lg ${isActive ? "text-emerald-400" : "text-stone-300"}`}
                        style={{ fontFamily: "serif", direction: "rtl" }}
                      >
                        {slot.pronounAr}
                      </div>
                      <div className="text-[10px] text-stone-500">{slot.pronounEn}</div>
                    </div>

                    {/* Conjugation */}
                    <div className="flex-1 text-right">
                      {conj ? (
                        <div
                          className={`transition-all ${isActive ? "text-3xl text-stone-100" : "text-xl text-stone-300"}`}
                          style={{ fontFamily: "serif", direction: "rtl" }}
                        >
                          {conj.formText}
                        </div>
                      ) : (
                        <span className="text-stone-600 text-sm italic">—</span>
                      )}
                    </div>

                    {/* Check */}
                    <div className="w-5 shrink-0 text-center">
                      {isCompleted && <span className="text-emerald-500 text-sm">✓</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Footer action */}
      {!done && (
        <div className="border-t border-stone-800 shrink-0 px-4 py-4 bg-stone-950">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-between mb-2 text-xs text-stone-500">
              <span>Slot {slotIdx + 1} / {validSlots.length}</span>
              <span>{Math.round(progress)}% done</span>
            </div>
            <button
              onClick={handleNext}
              className="w-full bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl py-4 font-semibold text-lg transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Root Page ────────────────────────────────────────────────────────────────

export default function SarfPage() {
  const [view, setView] = useState<View>("hub");
  const [initialForm, setInitialForm] = useState<number | undefined>(undefined);
  const [currentVerbId, setCurrentVerbId] = useState<string | null>(null);

  function goVerbs(form?: number) {
    setInitialForm(form);
    setView("verbs");
  }

  function goDrill(verbId: string) {
    setCurrentVerbId(verbId);
    setView("drill");
  }

  function goScaleDrill() {
    // Pick a random Form I verb
    const form1 = STARTER_VERBS.filter(v => v.form === 1);
    const random = form1[Math.floor(Math.random() * form1.length)];
    goDrill(random.id);
  }

  function nextRandom() {
    const currentVerb = STARTER_VERBS.find(v => v.id === currentVerbId);
    const sameForm = STARTER_VERBS.filter(v => v.form === (currentVerb?.form ?? 1));
    const others = sameForm.filter(v => v.id !== currentVerbId);
    const next = others.length ? others[Math.floor(Math.random() * others.length)] : sameForm[0];
    if (next) goDrill(next.id);
  }

  const currentVerb = STARTER_VERBS.find(v => v.id === currentVerbId);

  if (view === "verbs") {
    return (
      <VerbList
        initialForm={initialForm}
        onBack={() => setView("hub")}
        onDrill={goDrill}
      />
    );
  }

  if (view === "drill" && currentVerb) {
    return (
      <Drill
        verb={currentVerb}
        onBack={() => setView("verbs")}
        onNextRandom={nextRandom}
      />
    );
  }

  return (
    <Hub
      onVerbs={goVerbs}
      onScaleDrill={goScaleDrill}
    />
  );
}
