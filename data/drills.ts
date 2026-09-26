import { SKILLS } from "./curriculum";
import type { Exercise } from "./curriculum";

export type QuestionType =
  | "ar-to-en"      // Show Arabic → pick English
  | "en-to-ar"      // Show English → pick Arabic
  | "root-identify" // Show word → pick its root
  | "root-to-word"  // Show root → pick a word from it
  | "verse-fill"    // Quranic verse with blank → pick the missing word
  | "true-false"    // Arabic grammar statement → correct or not
  | "exercise"      // Skill-specific hand-authored exercise

export interface DrillQuestion {
  type: QuestionType;
  arabic?: string;         // large Arabic display
  prompt: string;          // question text
  answer: string;          // correct option
  options: string[];       // 4 shuffled options
  explanation: string;     // shown after answering
  skillId: number;
}

// ── Master vocab pool ──────────────────────────────────────────────────────

export interface VocabEntry {
  arabic: string;
  transliteration: string;
  translation: string;
  root?: string;
  skillId: number;
}

const POOL: VocabEntry[] = SKILLS.flatMap((skill) =>
  skill.vocab.map((v) => ({
    arabic: v.arabic.split("/")[0].trim(),
    transliteration: v.transliteration.split("/")[0].trim(),
    translation: v.translation,
    root: v.root,
    skillId: skill.id,
  }))
);

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick<T>(arr: T[], n: number, exclude?: T[]): T[] {
  const pool = exclude ? arr.filter((x) => !exclude.includes(x)) : arr;
  return shuffle(pool).slice(0, n);
}

function wrongTranslations(correct: string, count = 3): string[] {
  return pick(
    POOL.map((v) => v.translation),
    count,
    [correct]
  );
}

function wrongArabic(correct: string, count = 3): string[] {
  return pick(
    POOL.map((v) => v.arabic),
    count,
    [correct]
  );
}

function wrongRoots(correct: string, count = 3): string[] {
  const roots = [...new Set(POOL.map((v) => v.root).filter(Boolean) as string[])];
  return pick(roots, count, [correct]);
}

// ── Question generators ────────────────────────────────────────────────────

function makeArToEn(entry: VocabEntry): DrillQuestion {
  const options = shuffle([entry.translation, ...wrongTranslations(entry.translation)]);
  return {
    type: "ar-to-en",
    arabic: entry.arabic,
    prompt: "What does this word mean?",
    answer: entry.translation,
    options,
    explanation: `${entry.arabic} (${entry.transliteration}) = ${entry.translation}`,
    skillId: entry.skillId,
  };
}

function makeEnToAr(entry: VocabEntry): DrillQuestion {
  const options = shuffle([entry.arabic, ...wrongArabic(entry.arabic)]);
  return {
    type: "en-to-ar",
    prompt: `Which Arabic word means "${entry.translation}"?`,
    answer: entry.arabic,
    options,
    explanation: `${entry.translation} = ${entry.arabic} (${entry.transliteration})`,
    skillId: entry.skillId,
  };
}

function makeRootIdentify(entry: VocabEntry): DrillQuestion | null {
  if (!entry.root) return null;
  const options = shuffle([entry.root, ...wrongRoots(entry.root)]);
  return {
    type: "root-identify",
    arabic: entry.arabic,
    prompt: "What are the three root letters (جذر) of this word?",
    answer: entry.root,
    options,
    explanation: `The root of ${entry.arabic} is ${entry.root} — it carries the core meaning.`,
    skillId: entry.skillId,
  };
}

function makeExercise(ex: Exercise, skillId: number): DrillQuestion | null {
  if (!ex.options || ex.options.length < 2) return null;
  const options = shuffle([...ex.options]);
  return {
    type: "exercise",
    prompt: ex.prompt,
    answer: ex.answer,
    options,
    explanation: `Correct: ${ex.answer}`,
    skillId,
  };
}

function makeRootToWord(entry: VocabEntry): DrillQuestion | null {
  if (!entry.root) return null;
  // Find other words from same root if any, else use wrong arabic
  const options = shuffle([entry.arabic, ...wrongArabic(entry.arabic)]);
  return {
    type: "root-to-word",
    prompt: `Which word comes from the root ${entry.root}?`,
    answer: entry.arabic,
    options,
    explanation: `${entry.arabic} (${entry.translation}) is built on the root ${entry.root}.`,
    skillId: entry.skillId,
  };
}

// Quranic verse fill-in questions — hand-authored for accuracy
const VERSE_FILL_BANK: DrillQuestion[] = [
  {
    type: "verse-fill",
    arabic: "بِسْمِ ___ الرَّحْمَٰنِ الرَّحِيمِ",
    prompt: 'Fill in the blank: "In the name of ___, the Compassionate, the Merciful."',
    answer: "اللَّهِ",
    options: shuffle(["اللَّهِ", "رَبِّ", "نَبِيِّ", "كِتَابِ"]),
    explanation: "بِسْمِ اللَّهِ — 'In the name of God' — the Basmalah opens every surah.",
    skillId: 1,
  },
  {
    type: "verse-fill",
    arabic: "قُلْ ___ اللَّهُ أَحَدٌ",
    prompt: 'Fill in the blank: "Say: ___ is God, the One."',
    answer: "هُوَ",
    options: shuffle(["هُوَ", "أَنَا", "هِيَ", "نَحْنُ"]),
    explanation: "هُوَ (he/it) — the pronoun referring to God's oneness in Surah Al-Ikhlas.",
    skillId: 5,
  },
  {
    type: "verse-fill",
    arabic: "ذَٰلِكَ ___ لَا رَيْبَ فِيهِ",
    prompt: 'Fill in the blank: "That is the ___ — no doubt in it."',
    answer: "الْكِتَابُ",
    options: shuffle(["الْكِتَابُ", "الرَّجُلُ", "الْيَوْمُ", "الْعِلْمُ"]),
    explanation: "ذَٰلِكَ الْكِتَابُ — 'That is the Book' — Al-Baqarah 2:2, referring to the Quran itself.",
    skillId: 6,
  },
  {
    type: "verse-fill",
    arabic: "الْحَمْدُ لِلَّهِ ___ الْعَالَمِينَ",
    prompt: 'Fill in the blank: "All praise to God, ___ of the worlds."',
    answer: "رَبِّ",
    options: shuffle(["رَبِّ", "عِلْمِ", "يَوْمِ", "نُورِ"]),
    explanation: "رَبِّ الْعَالَمِينَ — 'Lord of the worlds' — an iḍāfa (possessive) construction. Al-Fatiha 1:2.",
    skillId: 13,
  },
  {
    type: "verse-fill",
    arabic: "وَاللَّهُ ___ مَا تُسِرُّونَ وَمَا تُعْلِنُونَ",
    prompt: 'Fill in the blank: "And God ___ what you conceal and what you reveal."',
    answer: "يَعْلَمُ",
    options: shuffle(["يَعْلَمُ", "يَقُولُ", "يَرَى", "يُرِيدُ"]),
    explanation: "يَعْلَمُ — present-tense verb (3rd person masc.) from root ع-ل-م. An-Nahl 16:19.",
    skillId: 11,
  },
  {
    type: "verse-fill",
    arabic: "___ إِلَٰهَ إِلَّا اللَّهُ",
    prompt: 'Fill in the blank: "___ god but God."',
    answer: "لَا",
    options: shuffle(["لَا", "هَلْ", "مَا", "لَمْ"]),
    explanation: "لَا إِلَٰهَ إِلَّا اللَّهُ — the Shahada. لَا here negates the entire class of false gods.",
    skillId: 12,
  },
  {
    type: "verse-fill",
    arabic: "وَلِمَنْ خَافَ مَقَامَ رَبِّهِ ___",
    prompt: '"And for whoever feared the station of their Lord are ___."',
    answer: "جَنَّتَانِ",
    options: shuffle(["جَنَّتَانِ", "جَنَّةٌ", "جَنَّات", "جَنَّتَيْنِ"]),
    explanation: "جَنَّتَانِ — the dual form (two gardens). Ar-Rahman 55:46.",
    skillId: 15,
  },
  {
    type: "verse-fill",
    arabic: "قَالَ رَبِّ إِنِّي ___ نَفْسِي",
    prompt: '"He said: My Lord, I have ___ myself." (Musa speaking)',
    answer: "ظَلَمْتُ",
    options: shuffle(["ظَلَمْتُ", "عَلِمْتُ", "كَتَبْتُ", "رَأَيْتُ"]),
    explanation: "ظَلَمْتُ — past tense, 1st person: 'I wronged.' From root ظ-ل-م. Al-Qasas 28:16.",
    skillId: 16,
  },
  {
    type: "verse-fill",
    arabic: "وَعَلَّمَ آدَمَ الْأَسْمَاءَ ___",
    prompt: '"And He taught Adam the names of ___ things."',
    answer: "كُلَّهَا",
    options: shuffle(["كُلَّهَا", "بَعْضَهَا", "أَكْثَرَهَا", "كَثِيرَهَا"]),
    explanation: "كُلَّهَا — 'all of them.' The root system at work: Adam was taught the names (أَسْمَاء) of everything. Al-Baqarah 2:31.",
    skillId: 18,
  },
];

// True/false grammar questions
const TRUE_FALSE_BANK: DrillQuestion[] = [
  {
    type: "true-false",
    prompt: "In Arabic, adjectives come BEFORE the noun they describe.",
    answer: "False — adjectives follow the noun",
    options: ["True — adjectives come before", "False — adjectives follow the noun"],
    explanation: "Arabic adjectives (صِفَة) always follow the noun (مَوْصُوف): الْكِتَابُ الْكَبِيرُ = the big book.",
    skillId: 8,
  },
  {
    type: "true-false",
    prompt: "The definite article in Arabic (ال) always sounds like 'al-' regardless of the following letter.",
    answer: "False — it assimilates with sun letters",
    options: ["True — it always sounds like 'al-'", "False — it assimilates with sun letters"],
    explanation: "With sun letters (ت ث د ذ ر ز س ش ص ض ط ظ ل ن) the ل assimilates: الشَّمْس = ash-shams, not al-shams.",
    skillId: 7,
  },
  {
    type: "true-false",
    prompt: "يَعْلَمُ means 'he knew' (past tense).",
    answer: "False — it means 'he knows' (present tense)",
    options: ["True — it is past tense", "False — it means 'he knows' (present tense)"],
    explanation: "The prefix يَـ marks present tense. Past tense would be عَلِمَ (ʿalima). Root: ع-ل-م.",
    skillId: 11,
  },
  {
    type: "true-false",
    prompt: "In an iḍāfa (possessive) construction, the FIRST noun takes ال to show possession.",
    answer: "False — the first noun loses ال",
    options: ["True — the first noun takes ال", "False — the first noun loses ال"],
    explanation: "In iḍāfa, the first noun (مُضَاف) CANNOT take ال. رَبُّ الْعَالَمِينَ — رَبّ has no ال, الْعَالَمِينَ does.",
    skillId: 13,
  },
  {
    type: "true-false",
    prompt: "Broken plurals in Arabic are grammatically treated as masculine.",
    answer: "False — broken plurals are grammatically feminine",
    options: ["True — they are masculine", "False — broken plurals are grammatically feminine"],
    explanation: "Broken plurals are grammatically feminine: كُتُبٌ كَثِيرَةٌ (many books) — كَثِيرَة is feminine even though books aren't.",
    skillId: 14,
  },
  {
    type: "true-false",
    prompt: "هُوَ can refer to both God and a regular person in Arabic.",
    answer: "True — it is a general 3rd person masculine pronoun",
    options: ["True — it is a general 3rd person masculine pronoun", "False — هُوَ is only for God"],
    explanation: "هُوَ means 'he / it' — used for any masculine noun. In قُلْ هُوَ اللَّهُ أَحَدٌ it refers to God, but it's the regular pronoun.",
    skillId: 5,
  },
];

// ── Session generator ──────────────────────────────────────────────────────

export function generateSession(
  targetSkillIds: number[] | "all",
  count = 10
): DrillQuestion[] {
  const isAll = targetSkillIds === "all";
  const ids = isAll ? null : (targetSkillIds as number[]);

  const pool = ids ? POOL.filter(v => ids.includes(v.skillId)) : POOL;
  if (pool.length === 0) return [];

  // Extra banks: when targeting specific skills, ONLY use questions from those skills
  const verseFill = isAll
    ? VERSE_FILL_BANK
    : VERSE_FILL_BANK.filter(q => ids!.includes(q.skillId));
  const trueFalse = isAll
    ? TRUE_FALSE_BANK
    : TRUE_FALSE_BANK.filter(q => ids!.includes(q.skillId));

  // Skill-specific exercises: when drilling a single skill, use its hand-authored exercises first
  const exercises: DrillQuestion[] = [];
  if (!isAll && ids!.length > 0) {
    for (const id of ids!) {
      const skill = SKILLS.find(s => s.id === id);
      if (skill) {
        for (const ex of skill.exercises) {
          const q = makeExercise(ex, id);
          if (q) exercises.push(q);
        }
      }
    }
  }

  const extraBank = shuffle([...exercises, ...verseFill, ...trueFalse]);
  const generators = [makeArToEn, makeEnToAr, makeRootIdentify, makeRootToWord];
  const questions: DrillQuestion[] = [];
  let extraUsed = 0;
  const shuffledPool = shuffle(pool);
  let pi = 0;

  while (questions.length < count) {
    // Every ~3 vocab questions, inject a skill-relevant extra
    if (questions.length > 0 && questions.length % 3 === 0 && extraUsed < extraBank.length) {
      questions.push(extraBank[extraUsed++]);
      continue;
    }

    const entry = shuffledPool[pi % shuffledPool.length];
    pi++;

    const genFns = shuffle(generators);
    for (const gen of genFns) {
      const q = gen(entry);
      if (q) { questions.push(q); break; }
    }
  }

  return questions.slice(0, count);
}

export function getSkillColor(level: string): string {
  return level === "beginner"
    ? "#1A7A3E"
    : level === "intermediate"
    ? "#C4952A"
    : "#1A6B4A";
}

export function getSkillBg(level: string): string {
  return level === "beginner"
    ? "rgba(26,122,62,0.08)"
    : level === "intermediate"
    ? "rgba(196,149,42,0.08)"
    : "rgba(26,107,74,0.08)";
}
