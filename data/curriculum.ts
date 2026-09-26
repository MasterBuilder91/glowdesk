export type SkillLevel = "beginner" | "intermediate" | "advanced";

export interface VocabItem {
  arabic: string;
  transliteration: string;
  translation: string;
  root?: string;
  frequency?: number; // times in Quran
}

export interface QuranExample {
  arabic: string;
  transliteration: string;
  translation: string;
  source: string;
  highlight?: string; // which word to highlight
}

export interface Exercise {
  type: "match" | "translate" | "identify" | "fill";
  prompt: string;
  options?: string[];
  answer: string;
}

export interface Skill {
  id: number;
  slug: string;
  title: string;
  arabicTitle: string;
  level: SkillLevel;
  comprehensionGain: number; // % Quran coverage added after mastering
  tagline: string;
  explanation: string;
  watchFor: string;
  vocab: VocabItem[];
  quranExample: QuranExample;
  exercises: Exercise[];
  rootNote?: string; // for skill 18 specifically
}

export const SKILLS: Skill[] = [
  {
    id: 1,
    slug: "letters",
    title: "Letters & Forms",
    arabicTitle: "الْحُرُوف",
    level: "beginner",
    comprehensionGain: 5,
    tagline: "28 letters. Each one changes shape depending on where it sits in a word.",
    explanation:
      "Arabic is written right to left in a connected cursive script. Most letters take one of four shapes: isolated, beginning, middle, or end of a word — like how print and cursive look different. The shapes look different, but the letter is the same. Learn to recognize the core shape, and the positions follow.",
    watchFor:
      "Don't memorize shapes from a chart in isolation. Always meet a letter inside a real word — the shape only makes sense in context.",
    vocab: [
      { arabic: "بَيْت", transliteration: "bayt", translation: "house", root: "ب-ي-ت" },
      { arabic: "كِتَاب", transliteration: "kitāb", translation: "book", root: "ك-ت-ب" },
      { arabic: "نُور", transliteration: "nūr", translation: "light", root: "ن-و-ر" },
      { arabic: "عِلْم", transliteration: "ʿilm", translation: "knowledge", root: "ع-ل-م" },
    ],
    quranExample: {
      arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      transliteration: "bismillāhi r-raḥmāni r-raḥīm",
      translation: "In the name of God, the Compassionate, the Merciful.",
      source: "Qurʾān — Al-Fātiḥah 1:1 (Basmalah)",
      highlight: "بِسْمِ",
    },
    exercises: [
      {
        type: "identify",
        prompt: "Which letter is this: ب",
        options: ["bā (b)", "nūn (n)", "tā (t)", "yā (y)"],
        answer: "bā (b)",
      },
      {
        type: "identify",
        prompt: "Find the letter ع in this word: عِلْم",
        options: ["First letter", "Second letter", "Third letter", "Fourth letter"],
        answer: "First letter",
      },
    ],
  },
  {
    id: 2,
    slug: "vowels",
    title: "Short Vowels",
    arabicTitle: "الْحَرَكَات",
    level: "beginner",
    comprehensionGain: 5,
    tagline: "Three tiny marks that tell you exactly how to pronounce every word.",
    explanation:
      "Arabic has three short vowels written as marks above or below letters. Fatḥa (a) sits above — like a small diagonal stroke. Kasra (i) sits below. Ḍamma (u) sits above like a small hook. Most printed Qurans include these marks (called tashkeel or ḥarakāt), so you can pronounce every word correctly even as a beginner.",
    watchFor:
      "In everyday Arabic text these marks are often omitted. But in the Quran they're always there. For now, use fully-vowelled texts — don't rush to reading without vowels.",
    vocab: [
      { arabic: "بَيْت", transliteration: "bayt", translation: "house" },
      { arabic: "كِتَاب", transliteration: "kitāb", translation: "book" },
      { arabic: "نُور", transliteration: "nūr", translation: "light" },
      { arabic: "جَنَّة", transliteration: "janna", translation: "garden / paradise", root: "ج-ن-ن" },
    ],
    quranExample: {
      arabic: "وَاللَّهُ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
      transliteration: "wa-llāhu ʿalā kulli shayʾin qadīr",
      translation: "And God has power over all things.",
      source: "Qurʾān — Al-Baqarah 2:284",
      highlight: "قَدِيرٌ",
    },
    exercises: [
      {
        type: "identify",
        prompt: "The mark beneath the letter in كِتَاب is called:",
        options: ["Kasra (i)", "Fatḥa (a)", "Ḍamma (u)", "Sukūn (no vowel)"],
        answer: "Kasra (i)",
      },
    ],
  },
  {
    id: 3,
    slug: "sounding-out",
    title: "Sounding Out Letters",
    arabicTitle: "التَّجْوِيد الأَسَاسِي",
    level: "beginner",
    comprehensionGain: 5,
    tagline: "Join letters into syllables. This is where reading actually starts.",
    explanation:
      "Once you know the letters and vowels, you can sound out any Arabic word — even ones you've never seen. The rule is simple: each consonant takes the vowel above or below it. A ّ (shadda) doubles the letter. A ْ (sukūn) means no vowel follows. A ـة (tā marbūṭa) at the end sounds like 'a' or is silent.",
    watchFor:
      "Don't skip the vowel signs. Even if you eventually read without them, understanding them now trains your ear for correct pronunciation.",
    vocab: [
      { arabic: "رَبّ", transliteration: "rabb", translation: "Lord / Sustainer", root: "ر-ب-ب", frequency: 960 },
      { arabic: "نَفْس", transliteration: "nafs", translation: "soul / self", root: "ن-ف-س", frequency: 295 },
      { arabic: "أُمَّة", transliteration: "umma", translation: "community / nation", root: "أ-م-م" },
    ],
    quranExample: {
      arabic: "رَبِّ الْعَالَمِينَ",
      transliteration: "rabbi l-ʿālamīn",
      translation: "Lord of all the worlds.",
      source: "Qurʾān — Al-Fātiḥah 1:2",
      highlight: "رَبِّ",
    },
    exercises: [
      {
        type: "translate",
        prompt: "Sound out and read: رَبّ",
        options: ["rabb", "rabbi", "rubba", "rub"],
        answer: "rabb",
      },
    ],
  },
  {
    id: 4,
    slug: "simple-words",
    title: "High-Frequency Words",
    arabicTitle: "الكَلِمَات الأَسَاسِيَّة",
    level: "beginner",
    comprehensionGain: 10,
    tagline: "The 30 words that appear most in the Quran. Learn these first.",
    explanation:
      "The Quran uses about 77,000 words total, but the most common 300 roots account for over 70% of them. These aren't random vocabulary — they're the architecture of the text. Master these 30 words and you'll recognize them on almost every page of the Quran.",
    watchFor:
      "Don't just memorize translations. Notice the root letters each time. اللَّه, إِلَٰه, أَلَهَ all share the root ا-ل-ه. That connection is more valuable than the translation.",
    vocab: [
      { arabic: "اللَّه", transliteration: "allāh", translation: "God", frequency: 2699 },
      { arabic: "رَبّ", transliteration: "rabb", translation: "Lord", root: "ر-ب-ب", frequency: 960 },
      { arabic: "يَوْم", transliteration: "yawm", translation: "day", root: "ي-و-م", frequency: 475 },
      { arabic: "قَوْل", transliteration: "qawl", translation: "saying / word", root: "ق-و-ل", frequency: 443 },
      { arabic: "أَرْض", transliteration: "arḍ", translation: "earth / land", root: "أ-ر-ض", frequency: 461 },
      { arabic: "عِلْم", transliteration: "ʿilm", translation: "knowledge", root: "ع-ل-م", frequency: 382 },
      { arabic: "نَاس", transliteration: "nās", translation: "people", root: "ن-و-س", frequency: 241 },
      { arabic: "كِتَاب", transliteration: "kitāb", translation: "book", root: "ك-ت-ب", frequency: 319 },
    ],
    quranExample: {
      arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      transliteration: "bismillāhi r-raḥmāni r-raḥīm — al-ḥamdu lillāhi rabbi l-ʿālamīn",
      translation: "In the name of God, the Compassionate, the Merciful — All praise belongs to God, Lord of all the worlds.",
      source: "Qurʾān — Al-Fātiḥah 1:1-2",
      highlight: "اللَّهِ",
    },
    exercises: [
      {
        type: "translate",
        prompt: "What does يَوْم mean?",
        options: ["day", "night", "month", "year"],
        answer: "day",
      },
      {
        type: "match",
        prompt: "Match: عِلْم",
        options: ["knowledge", "earth", "people", "book"],
        answer: "knowledge",
      },
    ],
  },
  {
    id: 5,
    slug: "pronouns",
    title: "Pronouns",
    arabicTitle: "الضَّمَائِر",
    level: "beginner",
    comprehensionGain: 5,
    tagline: "Who is speaking, who is being spoken to, who is being spoken about.",
    explanation:
      "Arabic pronouns are embedded into verbs, but they also appear as standalone words. The key ones: هُوَ (he), هِيَ (she), أَنْتَ (you, masc.), أَنْتِ (you, fem.), أَنَا (I), هُمْ (they, masc.), هُنَّ (they, fem.), نَحْنُ (we). The Quran uses نَحْنُ (We) for God speaking of Himself — a royal 'we' of majesty.",
    watchFor:
      "Arabic distinguishes masculine and feminine throughout. هُوَ vs هِيَ, أَنْتَ vs أَنْتِ — this will matter for every verb and adjective you learn.",
    vocab: [
      { arabic: "هُوَ", transliteration: "huwa", translation: "he / it (masc.)" },
      { arabic: "هِيَ", transliteration: "hiya", translation: "she / it (fem.)" },
      { arabic: "أَنْتَ", transliteration: "anta", translation: "you (masc.)" },
      { arabic: "أَنَا", transliteration: "anā", translation: "I" },
      { arabic: "هُمْ", transliteration: "hum", translation: "they (masc.)" },
      { arabic: "نَحْنُ", transliteration: "naḥnu", translation: "we" },
    ],
    quranExample: {
      arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
      transliteration: "qul huwa llāhu aḥad",
      translation: "Say: He is God, the One.",
      source: "Qurʾān — Al-Ikhlāṣ 112:1",
      highlight: "هُوَ",
    },
    exercises: [
      {
        type: "translate",
        prompt: "What does نَحْنُ mean?",
        options: ["we", "they", "he", "you"],
        answer: "we",
      },
    ],
  },
  {
    id: 6,
    slug: "demonstratives",
    title: "Demonstratives",
    arabicTitle: "أَسْمَاء الإِشَارَة",
    level: "beginner",
    comprehensionGain: 3,
    tagline: "This, that, these, those — the pointing words of Arabic.",
    explanation:
      "هَٰذَا means 'this' (masculine), هَٰذِهِ means 'this' (feminine). ذَٰلِكَ means 'that' (masculine), تِلْكَ means 'that' (feminine). In Arabic, putting a demonstrative next to a definite noun makes a sentence: هَٰذَا الْكِتَابُ = 'This is the book.' No verb needed.",
    watchFor:
      "The word ذَٰلِكَ (that) is one of the most common words in the Quran. It often refers back to the Quran itself: ذَٰلِكَ الْكِتَابُ — 'That is the Book.'",
    vocab: [
      { arabic: "هَٰذَا", transliteration: "hādhā", translation: "this (masc.)" },
      { arabic: "هَٰذِهِ", transliteration: "hādhihi", translation: "this (fem.)" },
      { arabic: "ذَٰلِكَ", transliteration: "dhālika", translation: "that (masc.)", frequency: 544 },
      { arabic: "تِلْكَ", transliteration: "tilka", translation: "that (fem.)" },
    ],
    quranExample: {
      arabic: "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ",
      transliteration: "dhālikal-kitābu lā rayba fīh",
      translation: "That is the Book — no doubt in it.",
      source: "Qurʾān — Al-Baqarah 2:2",
      highlight: "ذَٰلِكَ",
    },
    exercises: [
      {
        type: "translate",
        prompt: "What does ذَٰلِكَ mean?",
        options: ["that (masc.)", "this (fem.)", "he", "the"],
        answer: "that (masc.)",
      },
    ],
  },
  {
    id: 7,
    slug: "gender-the",
    title: "Gender & The",
    arabicTitle: "التَّذْكِير والتَّأْنِيث والتَّعْرِيف",
    level: "intermediate",
    comprehensionGain: 8,
    tagline: "Every noun is masculine or feminine. ال (the) is how you make it definite.",
    explanation:
      "Arabic has two genders: masculine (default) and feminine (usually ending in ة). Adding ال before a noun makes it definite: كِتَاب = a book, الْكِتَاب = the book. When ال meets certain letters (sun letters: ت ث د ذ ر ز س ش ص ض ط ظ ل ن), the ل assimilates: الرَّجُل (ar-rajul, not al-rajul). With moon letters, it stays: الْكِتَاب (al-kitāb).",
    watchFor:
      "The hamzat al-waṣl in اَلـ is only pronounced when you begin speech. Mid-sentence, the vowel drops: وَالْكِتَابِ (wa-l-kitābi), not (wa-al-kitābi).",
    vocab: [
      { arabic: "الْكِتَاب", transliteration: "al-kitāb", translation: "the book" },
      { arabic: "الرَّجُل", transliteration: "ar-rajul", translation: "the man" },
      { arabic: "الْمَرْأَة", transliteration: "al-marʾa", translation: "the woman" },
      { arabic: "الْعِلْم", transliteration: "al-ʿilm", translation: "the knowledge" },
      { arabic: "السَّمَاء", transliteration: "as-samāʾ", translation: "the sky / heaven", root: "س-م-و", frequency: 310 },
    ],
    quranExample: {
      arabic: "وَالسَّمَاءِ وَالْأَرْضِ",
      transliteration: "wa-s-samāʾi wa-l-arḍ",
      translation: "And by the sky and the earth.",
      source: "Qurʾān — various (frequent oath formula)",
      highlight: "السَّمَاءِ",
    },
    exercises: [
      {
        type: "fill",
        prompt: "Make كِتَاب definite:",
        options: ["الْكِتَاب", "كِتَابٌ", "كِتَابَة", "كُتُب"],
        answer: "الْكِتَاب",
      },
    ],
  },
  {
    id: 8,
    slug: "adjectives",
    title: "Adjective Agreement",
    arabicTitle: "الصِّفَة والمَوْصُوف",
    level: "intermediate",
    comprehensionGain: 5,
    tagline: "In Arabic, adjectives follow the noun and must match it in gender and definiteness.",
    explanation:
      "An Arabic adjective (صِفَة) follows its noun (مَوْصُوف) and must agree in gender, number, and definiteness. كِتَابٌ كَبِيرٌ = a big book. الْكِتَابُ الْكَبِيرُ = the big book. Feminine adjective adds ة: مَرْأَةٌ كَبِيرَةٌ = a big woman. If the noun has ال, the adjective must also have ال.",
    watchFor:
      "Broken plurals (irregular plural forms) are treated as grammatically feminine. كُتُبٌ كَثِيرَةٌ (many books) — كَثِيرَة is feminine even though books aren't.",
    vocab: [
      { arabic: "كَبِير", transliteration: "kabīr", translation: "big / great", root: "ك-ب-ر" },
      { arabic: "صَغِير", transliteration: "ṣaghīr", translation: "small", root: "ص-غ-ر" },
      { arabic: "كَثِير", transliteration: "kathīr", translation: "many / much", root: "ك-ث-ر", frequency: 74 },
      { arabic: "عَظِيم", transliteration: "ʿaẓīm", translation: "mighty / tremendous", root: "ع-ظ-م", frequency: 109 },
      { arabic: "عَلِيم", transliteration: "ʿalīm", translation: "all-knowing", root: "ع-ل-م", frequency: 162 },
    ],
    quranExample: {
      arabic: "وَهُوَ الْعَلِيُّ الْعَظِيمُ",
      transliteration: "wa-huwa l-ʿaliyyu l-ʿaẓīm",
      translation: "And He is the Most High, the Tremendous.",
      source: "Qurʾān — Al-Baqarah 2:255 (Āyat al-Kursī)",
      highlight: "الْعَظِيمُ",
    },
    exercises: [
      {
        type: "fill",
        prompt: "Complete: الْكِتَابُ _____ (the big book)",
        options: ["الْكَبِيرُ", "كَبِيرٌ", "كَبِيرَة", "الْكَبِيرَة"],
        answer: "الْكَبِيرُ",
      },
    ],
  },
  {
    id: 9,
    slug: "prepositions",
    title: "Prepositions",
    arabicTitle: "حُرُوف الجَرّ",
    level: "intermediate",
    comprehensionGain: 8,
    tagline: "Eight short words that appear on almost every line of the Quran.",
    explanation:
      "Arabic prepositions are called حُرُوف الجَرّ (letters of pulling) because they pull the following noun into the genitive case (kasra or ـِ ending). Key prepositions: فِي (in/at), عَلَى (on/upon), مِن (from/of), إِلَى (to/toward), عَن (about/from), مَع (with), بِ (by/with — attached), لِ (for/to — attached).",
    watchFor:
      "فِي اللَّه means 'in God' but also 'for the sake of God.' عَن may mean 'from,' 'about,' or 'on behalf of' depending on context. Context always wins over literal translation.",
    vocab: [
      { arabic: "فِي", transliteration: "fī", translation: "in / at / on", frequency: 1692 },
      { arabic: "عَلَى", transliteration: "ʿalā", translation: "on / upon / over", frequency: 1320 },
      { arabic: "مِن", transliteration: "min", translation: "from / of / some of", frequency: 3226 },
      { arabic: "إِلَى", transliteration: "ilā", translation: "to / toward / until", frequency: 742 },
      { arabic: "لِ", transliteration: "li", translation: "for / to / belonging to", frequency: 2192 },
    ],
    quranExample: {
      arabic: "لِلَّهِ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ",
      transliteration: "lillāhi mā fī s-samāwāti wa-mā fī l-arḍ",
      translation: "To God belongs whatever is in the heavens and whatever is in the earth.",
      source: "Qurʾān — Al-Baqarah 2:284",
      highlight: "فِي",
    },
    exercises: [
      {
        type: "translate",
        prompt: "What does مِن mean?",
        options: ["from / of", "in / at", "on / upon", "to / toward"],
        answer: "from / of",
      },
    ],
  },
  {
    id: 10,
    slug: "location-words",
    title: "Location & Time Words",
    arabicTitle: "الظُّرُوف",
    level: "intermediate",
    comprehensionGain: 4,
    tagline: "Where and when — the adverbs of place and time.",
    explanation:
      "Arabic adverbs of place and time (ظُرُوف) answer 'where' and 'when.' They're often nouns in the genitive case following a preposition, but many appear independently. Key ones: فَوْق (above), تَحْت (below), أَمَام (in front), وَرَاء (behind), قَبْل (before), بَعْد (after), عِنْد (at/with/in the possession of), حَيْث (wherever/where).",
    watchFor:
      "قَبْل and بَعْد are huge in the Quran. They often appear in their tanwīn form: قَبْلًا/قَبْلُ, or followed by مَا or a noun.",
    vocab: [
      { arabic: "فَوْق", transliteration: "fawq", translation: "above / over" },
      { arabic: "تَحْت", transliteration: "taḥt", translation: "below / under" },
      { arabic: "قَبْل", transliteration: "qabl", translation: "before", frequency: 184 },
      { arabic: "بَعْد", transliteration: "baʿd", translation: "after / then", frequency: 185 },
      { arabic: "عِنْد", transliteration: "ʿinda", translation: "at / with / near / in possession of", frequency: 264 },
      { arabic: "حَيْث", transliteration: "ḥaythu", translation: "wherever / where" },
    ],
    quranExample: {
      arabic: "مِن قَبْلُ وَمِن بَعْدُ",
      transliteration: "min qablu wa-min baʿdu",
      translation: "Before and after.",
      source: "Qurʾān — Ar-Rūm 30:4",
      highlight: "قَبْلُ",
    },
    exercises: [
      {
        type: "translate",
        prompt: "What does عِنْد mean?",
        options: ["at / with / in possession of", "above", "before", "after"],
        answer: "at / with / in possession of",
      },
    ],
  },
  {
    id: 11,
    slug: "present-verbs",
    title: "Present-Tense Verbs",
    arabicTitle: "الفِعْل المُضَارِع",
    level: "intermediate",
    comprehensionGain: 8,
    tagline: "He does, she does, you do, I do — the living action of the Quran.",
    explanation:
      "Present-tense verbs in Arabic (الفِعْل المُضَارِع) use prefixes and suffixes to mark who is doing the action. The root pattern for 'he writes' is يَكْتُبُ (ya-k-t-u-bu). Change the prefix: تَكْتُبُ = she writes, أَكْتُبُ = I write, نَكْتُبُ = we write, تَكْتُبُ = you write. The root letters (ك-ت-ب) stay constant — only the prefix changes.",
    watchFor:
      "The prefix يَـ marks 3rd person masculine (he/it/they). This is by far the most common verb form in the Quran. When you see يَـ, you know a verb is coming.",
    vocab: [
      { arabic: "يَعْلَمُ", transliteration: "yaʿlamu", translation: "he knows", root: "ع-ل-م", frequency: 97 },
      { arabic: "يَقُولُ", transliteration: "yaqūlu", translation: "he says", root: "ق-و-ل" },
      { arabic: "يَرَى", transliteration: "yarā", translation: "he sees", root: "ر-أ-ي" },
      { arabic: "يُرِيدُ", transliteration: "yurīdu", translation: "he wants / intends", root: "ر-و-د", frequency: 47 },
      { arabic: "يَشَاء", transliteration: "yashāʾ", translation: "he wills", root: "ش-ي-أ", frequency: 87 },
    ],
    quranExample: {
      arabic: "وَاللَّهُ يَعْلَمُ مَا تُسِرُّونَ وَمَا تُعْلِنُونَ",
      transliteration: "wa-llāhu yaʿlamu mā tussirrūna wa-mā tuʿlinūn",
      translation: "And God knows what you conceal and what you reveal.",
      source: "Qurʾān — An-Naḥl 16:19",
      highlight: "يَعْلَمُ",
    },
    exercises: [
      {
        type: "translate",
        prompt: "What does يَعْلَمُ mean?",
        options: ["he knows", "he says", "he sees", "he wants"],
        answer: "he knows",
      },
    ],
  },
  {
    id: 12,
    slug: "negation-questions",
    title: "Negation & Questions",
    arabicTitle: "النَّفْي والاسْتِفْهَام",
    level: "intermediate",
    comprehensionGain: 4,
    tagline: "How Arabic says no, not, and never — and how it asks yes/no and open questions.",
    explanation:
      "To negate a present-tense verb, put لَا before it: لَا يَعْلَمُ = he does not know. To negate the past tense, use لَمْ + jussive (apocopate) form: لَمْ يَعْلَمْ = he did not know. For nominal sentences, use لَيْسَ: لَيْسَ كَمِثْلِهِ شَيْء = there is nothing like Him. Questions: هَلْ is a yes/no marker (هَلْ تَعْلَمُ؟ = Do you know?). مَا asks 'what', مَنْ asks 'who', أَيْن 'where', كَيْف 'how', لِمَاذَا 'why'.",
    watchFor:
      "لَا in the Quran often introduces absolute prohibition: لَا تُشْرِكْ بِاللَّهِ = Do not associate partners with God. The jussive mood (dropping the final short vowel) marks commands and prohibitions.",
    vocab: [
      { arabic: "لَا", transliteration: "lā", translation: "no / not / do not", frequency: 6274 },
      { arabic: "لَمْ", transliteration: "lam", translation: "did not (negates past)", frequency: 303 },
      { arabic: "لَيْسَ", transliteration: "laysa", translation: "is not / are not", frequency: 134 },
      { arabic: "هَلْ", transliteration: "hal", translation: "? (yes/no question marker)", frequency: 401 },
      { arabic: "مَا", transliteration: "mā", translation: "what / that which / not", frequency: 2898 },
    ],
    quranExample: {
      arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ",
      transliteration: "lā ilāha illā llāh",
      translation: "There is no god but God.",
      source: "Qurʾān — the Shahāda formula, throughout",
      highlight: "لَا",
    },
    exercises: [
      {
        type: "translate",
        prompt: "لَا يَعْلَمُ means:",
        options: ["he does not know", "he knows", "does he know?", "what does he know?"],
        answer: "he does not know",
      },
    ],
  },
  {
    id: 13,
    slug: "idafa",
    title: "Possession (Iḍāfa)",
    arabicTitle: "الإِضَافَة",
    level: "advanced",
    comprehensionGain: 7,
    tagline: "The possessive chain. Two nouns back to back = 'X of Y' or 'Y's X'.",
    explanation:
      "Iḍāfa (إِضَافَة, lit. addition) is the Arabic possessive construction. Put two nouns together: the first (المُضَاف) loses its tanwīn, the second (المُضَاف إِلَيْه) takes genitive (kasra): كِتَابُ الطَّالِبِ = the student's book / the book of the student. The first noun also loses ال. Iḍāfa chains can be long: كِتَابُ عِلْمِ اللَّهِ = the book of the knowledge of God.",
    watchFor:
      "The first noun in an iḍāfa cannot take ال — if you see الـ before a noun, it cannot be in iḍāfa with the next noun. But رَبُّ الْعَالَمِينَ is an iḍāfa: رَبّ (without ال) + الْعَالَمِينَ (with ال).",
    vocab: [
      { arabic: "رَبُّ الْعَالَمِينَ", transliteration: "rabbu l-ʿālamīn", translation: "Lord of the worlds" },
      { arabic: "عِبَادُ اللَّهِ", transliteration: "ʿibādu llāh", translation: "servants of God" },
      { arabic: "كِتَابُ اللَّهِ", transliteration: "kitābu llāh", translation: "the Book of God" },
      { arabic: "رَحْمَةُ اللَّهِ", transliteration: "raḥmatu llāh", translation: "the mercy of God", root: "ر-ح-م" },
    ],
    quranExample: {
      arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      transliteration: "al-ḥamdu lillāhi rabbi l-ʿālamīn",
      translation: "All praise belongs to God, Lord of all the worlds.",
      source: "Qurʾān — Al-Fātiḥah 1:2",
      highlight: "رَبِّ الْعَالَمِينَ",
    },
    exercises: [
      {
        type: "translate",
        prompt: "كِتَابُ اللَّهِ means:",
        options: ["the Book of God", "God's books", "a book for God", "the Book is God"],
        answer: "the Book of God",
      },
    ],
  },
  {
    id: 14,
    slug: "plurals",
    title: "Plurals",
    arabicTitle: "الجَمْع",
    level: "advanced",
    comprehensionGain: 6,
    tagline: "Sound plurals follow rules. Broken plurals are patterns you learn by feel.",
    explanation:
      "Arabic has three types of plurals. Sound masculine plural: add ـُونَ (nom.) or ـِينَ (acc./gen.) — مُسْلِمُونَ (Muslims). Sound feminine plural: change ة to ات — مُسْلِمَات. Broken plurals: the internal pattern of the word changes — كِتَاب → كُتُب, رَجُل → رِجَال, وَلَد → أَوْلَاد. Most common Arabic nouns use broken plurals, so you need to learn them.",
    watchFor:
      "Broken plurals are grammatically feminine, so adjectives agreeing with them take feminine form: كُتُبٌ كَثِيرَةٌ (many books). This trips up even intermediate students.",
    vocab: [
      { arabic: "كُتُب", transliteration: "kutub", translation: "books (pl. of كِتَاب)" },
      { arabic: "رِجَال", transliteration: "rijāl", translation: "men (pl. of رَجُل)" },
      { arabic: "أَيَّام", transliteration: "ayyām", translation: "days (pl. of يَوْم)", root: "ي-و-م" },
      { arabic: "أَنْبِيَاء", transliteration: "anbiyāʾ", translation: "prophets (pl. of نَبِيّ)", root: "ن-ب-أ" },
      { arabic: "مُؤْمِنُونَ", transliteration: "muʾminūn", translation: "believers (pl. of مُؤْمِن)", root: "أ-م-ن" },
    ],
    quranExample: {
      arabic: "إِنَّ الْمُؤْمِنِينَ إِخْوَةٌ",
      transliteration: "inna l-muʾminīna ikhwa",
      translation: "Indeed the believers are brothers.",
      source: "Qurʾān — Al-Ḥujurāt 49:10",
      highlight: "الْمُؤْمِنِينَ",
    },
    exercises: [
      {
        type: "translate",
        prompt: "أَيَّام is the plural of يَوْم. What does it mean?",
        options: ["days", "nights", "years", "months"],
        answer: "days",
      },
    ],
  },
  {
    id: 15,
    slug: "dual",
    title: "Dual Number",
    arabicTitle: "الْمُثَنَّى",
    level: "advanced",
    comprehensionGain: 3,
    tagline: "Arabic has a special form just for 'two of something' — not singular, not plural.",
    explanation:
      "The dual in Arabic (المثنى) adds ـَانِ (nominative) or ـَيْنِ (acc./gen.) to the singular noun. كِتَابٌ → كِتَابَانِ (two books, subject) / كِتَابَيْنِ (two books, object/after preposition). For words ending in ة, drop the ة and add تَانِ/تَيْنِ: مَدِينَةٌ → مَدِينَتَانِ (two cities). Verbs also have dual forms.",
    watchFor:
      "The dual suffix ـَانِ is only used when the two items are the subject of a verb. If they follow a preposition or are the object, use ـَيْنِ. This case distinction shows up often in the Quran.",
    vocab: [
      { arabic: "عَيْنَانِ", transliteration: "ʿaynāni", translation: "two eyes" },
      { arabic: "يَدَانِ", transliteration: "yadāni", translation: "two hands" },
      { arabic: "جَنَّتَانِ", transliteration: "jannatāni", translation: "two gardens" },
      { arabic: "مَلَكَانِ", transliteration: "malakāni", translation: "two angels" },
    ],
    quranExample: {
      arabic: "وَلِمَنْ خَافَ مَقَامَ رَبِّهِ جَنَّتَانِ",
      transliteration: "wa-li-man khāfa maqāma rabbihi jannatān",
      translation: "And for whoever feared the station of their Lord are two gardens.",
      source: "Qurʾān — Ar-Raḥmān 55:46",
      highlight: "جَنَّتَانِ",
    },
    exercises: [
      {
        type: "translate",
        prompt: "جَنَّتَانِ means:",
        options: ["two gardens", "a garden", "many gardens", "the garden"],
        answer: "two gardens",
      },
    ],
  },
  {
    id: 16,
    slug: "past-verbs",
    title: "Past-Tense Verbs",
    arabicTitle: "الفِعْل الْمَاضِي",
    level: "advanced",
    comprehensionGain: 7,
    tagline: "What happened. The past tense is the most common verb form in Quranic narrative.",
    explanation:
      "Past-tense verbs (الفِعْل الماضي) in Arabic are built on the root with the pattern فَعَلَ (faʿala). He wrote: كَتَبَ. She wrote: كَتَبَتْ. They (m.) wrote: كَتَبُوا. You (m.) wrote: كَتَبْتَ. I wrote: كَتَبْتُ. The root letters stay constant; suffixes change to mark person, gender, and number. Quranic stories (قَصَص) — Adam, Noah, Ibrahim, Musa — are narrated almost entirely in past tense.",
    watchFor:
      "The 3rd person masculine singular (faʿala) is the dictionary form. When you look up a verb in an Arabic dictionary, you look under the past-tense, 3rd-person masculine singular — not the infinitive.",
    vocab: [
      { arabic: "قَالَ", transliteration: "qāla", translation: "he said", root: "ق-و-ل", frequency: 1722 },
      { arabic: "كَانَ", transliteration: "kāna", translation: "he was / it was", root: "ك-و-ن", frequency: 1358 },
      { arabic: "خَلَقَ", transliteration: "khalaqa", translation: "he created", root: "خ-ل-ق", frequency: 69 },
      { arabic: "جَاءَ", transliteration: "jāʾa", translation: "he came", root: "ج-ي-أ", frequency: 275 },
      { arabic: "أَرْسَلَ", transliteration: "arsala", translation: "he sent", root: "ر-س-ل", frequency: 127 },
    ],
    quranExample: {
      arabic: "قَالَ رَبِّ إِنِّي ظَلَمْتُ نَفْسِي",
      transliteration: "qāla rabbi innī ẓalamtu nafsī",
      translation: "He said: My Lord, I have wronged myself.",
      source: "Qurʾān — Al-Qaṣaṣ 28:16 (Mūsā speaking)",
      highlight: "قَالَ",
    },
    exercises: [
      {
        type: "translate",
        prompt: "كَانَ means:",
        options: ["he was / it was", "he is", "he will be", "he becomes"],
        answer: "he was / it was",
      },
    ],
  },
  {
    id: 17,
    slug: "high-frequency",
    title: "Quran High-Frequency Words",
    arabicTitle: "كَلِمَات القُرْآن الشَّائِعَة",
    level: "advanced",
    comprehensionGain: 10,
    tagline: "The top 50 Quranic words by frequency. Know these and you recognize most of what you read.",
    explanation:
      "The Quran's 77,439 words are built from about 1,750 unique roots. But frequency is wildly unequal. The top 10 words alone account for about 25% of all word occurrences. The top 50 cover around 45%. Learning these words by root — not by rote — means you're also learning the dozens of derived forms from each root.",
    watchFor:
      "Some of these words have multiple meanings depending on context. مَا means 'what,' 'that which,' 'not' (past negation), or introduces subordinate clauses. Context — and the grammar you've built up — tells you which.",
    vocab: [
      { arabic: "إِنَّ", transliteration: "inna", translation: "indeed / verily / that", frequency: 1621 },
      { arabic: "كَانَ", transliteration: "kāna", translation: "was / were", root: "ك-و-ن", frequency: 1358 },
      { arabic: "أَن", transliteration: "an", translation: "that / to (subordinator)", frequency: 1264 },
      { arabic: "قُلْ", transliteration: "qul", translation: "say! (command)", root: "ق-و-ل", frequency: 332 },
      { arabic: "إِذَا", transliteration: "idhā", translation: "when / if (future)", frequency: 408 },
      { arabic: "إِلَّا", transliteration: "illā", translation: "except / but / only", frequency: 663 },
      { arabic: "قَدْ", transliteration: "qad", translation: "indeed / already (particle)", frequency: 441 },
      { arabic: "بَلْ", transliteration: "bal", translation: "rather / but", frequency: 151 },
    ],
    quranExample: {
      arabic: "إِنَّ اللَّهَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
      transliteration: "inna llāha ʿalā kulli shayʾin qadīr",
      translation: "Indeed God has power over all things.",
      source: "Qurʾān — Al-Baqarah 2:20",
      highlight: "إِنَّ",
    },
    exercises: [
      {
        type: "translate",
        prompt: "إِلَّا means:",
        options: ["except / only", "indeed", "when", "already"],
        answer: "except / only",
      },
    ],
  },
  {
    id: 18,
    slug: "root-pattern",
    title: "Root & Pattern — The Real Secret",
    arabicTitle: "الجَذْر والوَزْن",
    level: "advanced",
    comprehensionGain: 15,
    tagline: "Every Arabic word is built from a 3-letter root on a fixed pattern. Crack the code.",
    explanation:
      "Arabic is a root-based language. Nearly every word is built from a 3-letter root (جَذْر) placed into a pattern (وَزْن). The root ك-ت-ب carries the idea of 'writing.' Put it into different patterns: كَتَبَ = he wrote (verb, past), يَكْتُبُ = he writes (verb, present), كِتَاب = book (noun of result), كَاتِب = writer (active participle), مَكْتُوب = written/letter (passive participle), كِتَابَة = the act of writing (verbal noun), مَكْتَبَة = library (place of writing). Seven words, one root.",
    watchFor:
      "Once you internalize common patterns (فَعَّلَ = intensive verb, فَاعِل = doer, مَفْعُول = done-to, فِعَال = result noun, مَفْعَلَة = place noun), you can guess unknown words correctly most of the time. This is the real advantage that lets you read classical Arabic without a dictionary.",
    rootNote:
      "The key patterns to internalize: فَعَلَ/يَفْعُلُ (basic verb), فَعَّلَ (intensive/causative), أَفْعَلَ (causative), تَفَاعَلَ (mutual), اِفْتَعَلَ (reflexive), فِعَال (noun of result), فَاعِل (active participle = doer), مَفْعُول (passive participle = done-to), مَفْعَلَة (place noun), مَصْدَر (verbal noun).",
    vocab: [
      { arabic: "كَتَبَ / كِتَاب / كَاتِب / مَكْتُوب / مَكْتَبَة", transliteration: "kataba / kitāb / kātib / maktūb / maktaba", translation: "wrote / book / writer / letter / library", root: "ك-ت-ب" },
      { arabic: "عَلِمَ / عِلْم / عَالِم / مَعْلُوم / مَعْلَمَة", transliteration: "ʿalima / ʿilm / ʿālim / maʿlūm / maʿlama", translation: "knew / knowledge / scholar / known / landmark", root: "ع-ل-م" },
      { arabic: "رَحِمَ / رَحْمَة / رَحِيم / رَحْمَان", transliteration: "raḥima / raḥma / raḥīm / raḥmān", translation: "had mercy / mercy / merciful / the All-Merciful", root: "ر-ح-م" },
    ],
    quranExample: {
      arabic: "وَعَلَّمَ آدَمَ الْأَسْمَاءَ كُلَّهَا",
      transliteration: "wa-ʿallama ādama l-asmāʾa kullahā",
      translation: "And He taught Adam the names of all things.",
      source: "Qurʾān — Al-Baqarah 2:31",
      highlight: "وَعَلَّمَ",
    },
    exercises: [
      {
        type: "match",
        prompt: "What pattern does كَاتِب (writer) follow?",
        options: ["فَاعِل (active participle = doer)", "مَفْعُول (passive = done-to)", "فِعَال (result noun)", "مَفْعَلَة (place noun)"],
        answer: "فَاعِل (active participle = doer)",
      },
    ],
  },
];

export const FREE_SKILLS = [1, 2, 3, 4, 5]; // First 5 free

export function getComprehensionPercent(unlockedSkillIds: number[]): number {
  const gained = SKILLS.filter((s) => unlockedSkillIds.includes(s.id)).reduce(
    (sum, s) => sum + s.comprehensionGain,
    0
  );
  return Math.min(gained, 85);
}

export const SKILL_LEVEL_LABELS: Record<SkillLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};
