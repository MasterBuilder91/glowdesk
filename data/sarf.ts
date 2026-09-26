// Sarf trainer data — ported from quran-word-flow

export type Tense = "madi" | "mudari" | "amr";
export type Voice = "active" | "passive";

export interface ConjugationSlot {
  slotId: number;
  pronounAr: string;
  pronounEn: string;
  person: "3rd" | "2nd" | "1st";
  gender: "masc" | "fem" | "both";
  numberType: "singular" | "dual" | "plural";
}

export interface Verb {
  id: string;
  root: string;
  form: number;
  madi: string;
  mudari: string;
  masdar?: string;
  ismFail?: string;
  ismMafool?: string;
  meaningEn: string;
  verbType: "salim" | "mahmuz" | "mudaaf" | "mithal" | "ajwaf" | "naqis" | "lafif";
  isTransitive: boolean;
  isQuranic: boolean;
  quranicReference?: string;
}

export interface Conjugation {
  verbId: string;
  tense: Tense;
  voice: Voice;
  slotId: number;
  formText: string;
}

export interface Stage {
  id: number;
  nameAr: string;
  nameEn: string;
  description: string;
  unlockThreshold: number;
}

// ─── Pronoun Slots ───────────────────────────────────────────────────────────

export const CONJUGATION_SLOTS: ConjugationSlot[] = [
  { slotId: 1,  pronounAr: "هُوَ",    pronounEn: "He",        person: "3rd", gender: "masc", numberType: "singular" },
  { slotId: 2,  pronounAr: "هُمَا",   pronounEn: "They (2m)", person: "3rd", gender: "masc", numberType: "dual" },
  { slotId: 3,  pronounAr: "هُمْ",    pronounEn: "They (m)",  person: "3rd", gender: "masc", numberType: "plural" },
  { slotId: 4,  pronounAr: "هِيَ",    pronounEn: "She",       person: "3rd", gender: "fem",  numberType: "singular" },
  { slotId: 5,  pronounAr: "هُمَا",   pronounEn: "They (2f)", person: "3rd", gender: "fem",  numberType: "dual" },
  { slotId: 6,  pronounAr: "هُنَّ",   pronounEn: "They (f)",  person: "3rd", gender: "fem",  numberType: "plural" },
  { slotId: 7,  pronounAr: "أَنْتَ",  pronounEn: "You (m)",   person: "2nd", gender: "masc", numberType: "singular" },
  { slotId: 8,  pronounAr: "أَنْتُمَا", pronounEn: "You (2m)", person: "2nd", gender: "masc", numberType: "dual" },
  { slotId: 9,  pronounAr: "أَنْتُمْ", pronounEn: "You (m+)", person: "2nd", gender: "masc", numberType: "plural" },
  { slotId: 10, pronounAr: "أَنْتِ",  pronounEn: "You (f)",   person: "2nd", gender: "fem",  numberType: "singular" },
  { slotId: 11, pronounAr: "أَنْتُمَا", pronounEn: "You (2f)", person: "2nd", gender: "fem",  numberType: "dual" },
  { slotId: 12, pronounAr: "أَنْتُنَّ", pronounEn: "You (f+)", person: "2nd", gender: "fem",  numberType: "plural" },
  { slotId: 13, pronounAr: "أَنَا",   pronounEn: "I",         person: "1st", gender: "both", numberType: "singular" },
  { slotId: 14, pronounAr: "نَحْنُ",  pronounEn: "We",        person: "1st", gender: "both", numberType: "plural" },
];

export const STAGES: Stage[] = [
  { id: 1, nameAr: "الأساس",    nameEn: "The Foundation", description: "Form I conjugation — past, present, imperative", unlockThreshold: 0 },
  { id: 2, nameAr: "الأوزان",   nameEn: "The Scales",     description: "All 10 verb forms — patterns, meanings, usage",  unlockThreshold: 150 },
  { id: 3, nameAr: "الحروف",    nameEn: "The Particles",  description: "Particles that modify verb meaning",              unlockThreshold: 400 },
  { id: 4, nameAr: "المشتقّات", nameEn: "The Derivatives",description: "Derived nouns — participles, verbal nouns",       unlockThreshold: 700 },
  { id: 5, nameAr: "التركيب",   nameEn: "The Structure",  description: "Verbs inside sentences — Nahwu integration",      unlockThreshold: 1000 },
];

// ─── Verb Library ────────────────────────────────────────────────────────────

export const STARTER_VERBS: Verb[] = [
  // ─── Form I (فَعَلَ) ───
  { id:"v1",   root:"ك-ت-ب", form:1, madi:"كَتَبَ",    mudari:"يَكْتُبُ",    masdar:"كِتَابَة",    ismFail:"كَاتِب",    ismMafool:"مَكْتُوب",   meaningEn:"he wrote",          verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v2",   root:"ن-ص-ر", form:1, madi:"نَصَرَ",    mudari:"يَنْصُرُ",    masdar:"نَصْر",       ismFail:"نَاصِر",    ismMafool:"مَنْصُور",   meaningEn:"he helped",         verbType:"salim", isTransitive:true,  isQuranic:true,  quranicReference:"47:7" },
  { id:"v3",   root:"ف-ت-ح", form:1, madi:"فَتَحَ",    mudari:"يَفْتَحُ",    masdar:"فَتْح",       ismFail:"فَاتِح",    ismMafool:"مَفْتُوح",   meaningEn:"he opened",         verbType:"salim", isTransitive:true,  isQuranic:true,  quranicReference:"48:1" },
  { id:"v4",   root:"ج-ل-س", form:1, madi:"جَلَسَ",    mudari:"يَجْلِسُ",    masdar:"جُلُوس",      ismFail:"جَالِس",                            meaningEn:"he sat",            verbType:"salim", isTransitive:false, isQuranic:false },
  { id:"v5",   root:"ذ-ه-ب", form:1, madi:"ذَهَبَ",    mudari:"يَذْهَبُ",    masdar:"ذَهَاب",      ismFail:"ذَاهِب",                            meaningEn:"he went",           verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"v6",   root:"خ-ر-ج", form:1, madi:"خَرَجَ",    mudari:"يَخْرُجُ",    masdar:"خُرُوج",      ismFail:"خَارِج",                            meaningEn:"he exited",         verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"v7",   root:"د-خ-ل", form:1, madi:"دَخَلَ",    mudari:"يَدْخُلُ",    masdar:"دُخُول",      ismFail:"دَاخِل",                            meaningEn:"he entered",        verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"v8",   root:"ع-ل-م", form:1, madi:"عَلِمَ",    mudari:"يَعْلَمُ",    masdar:"عِلْم",       ismFail:"عَالِم",    ismMafool:"مَعْلُوم",   meaningEn:"he knew",           verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v9",   root:"س-م-ع", form:1, madi:"سَمِعَ",    mudari:"يَسْمَعُ",    masdar:"سَمْع",       ismFail:"سَامِع",    ismMafool:"مَسْمُوع",   meaningEn:"he heard",          verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v10",  root:"ض-ر-ب", form:1, madi:"ضَرَبَ",    mudari:"يَضْرِبُ",    masdar:"ضَرْب",       ismFail:"ضَارِب",    ismMafool:"مَضْرُوب",   meaningEn:"he struck",         verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v11",  root:"ط-ل-ب", form:1, madi:"طَلَبَ",    mudari:"يَطْلُبُ",    masdar:"طَلَب",       ismFail:"طَالِب",    ismMafool:"مَطْلُوب",   meaningEn:"he sought",         verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v12",  root:"ر-ك-ب", form:1, madi:"رَكِبَ",    mudari:"يَرْكَبُ",    masdar:"رُكُوب",      ismFail:"رَاكِب",                            meaningEn:"he rode",           verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v13",  root:"ع-ب-د", form:1, madi:"عَبَدَ",    mudari:"يَعْبُدُ",    masdar:"عِبَادَة",    ismFail:"عَابِد",    ismMafool:"مَعْبُود",   meaningEn:"he worshipped",     verbType:"salim", isTransitive:true,  isQuranic:true,  quranicReference:"1:5" },
  { id:"v14",  root:"ح-م-د", form:1, madi:"حَمِدَ",    mudari:"يَحْمَدُ",    masdar:"حَمْد",       ismFail:"حَامِد",    ismMafool:"مَحْمُود",   meaningEn:"he praised",        verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v15",  root:"ش-ك-ر", form:1, madi:"شَكَرَ",    mudari:"يَشْكُرُ",    masdar:"شُكْر",       ismFail:"شَاكِر",    ismMafool:"مَشْكُور",   meaningEn:"he thanked",        verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v16",  root:"ص-ب-ر", form:1, madi:"صَبَرَ",    mudari:"يَصْبِرُ",    masdar:"صَبْر",       ismFail:"صَابِر",                            meaningEn:"he was patient",    verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"v17",  root:"ن-ز-ل", form:1, madi:"نَزَلَ",    mudari:"يَنْزِلُ",    masdar:"نُزُول",      ismFail:"نَازِل",                            meaningEn:"he descended",      verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"v18",  root:"ح-ك-م", form:1, madi:"حَكَمَ",    mudari:"يَحْكُمُ",    masdar:"حُكْم",       ismFail:"حَاكِم",                            meaningEn:"he judged",         verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v19",  root:"غ-ف-ر", form:1, madi:"غَفَرَ",    mudari:"يَغْفِرُ",    masdar:"مَغْفِرَة",   ismFail:"غَافِر",    ismMafool:"مَغْفُور",   meaningEn:"he forgave",        verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v20",  root:"ش-ر-ب", form:1, madi:"شَرِبَ",    mudari:"يَشْرَبُ",    masdar:"شُرْب",       ismFail:"شَارِب",    ismMafool:"مَشْرُوب",   meaningEn:"he drank",          verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v21",  root:"ق-ت-ل", form:1, madi:"قَتَلَ",    mudari:"يَقْتُلُ",    masdar:"قَتْل",       ismFail:"قَاتِل",    ismMafool:"مَقْتُول",   meaningEn:"he killed",         verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v22",  root:"ح-م-ل", form:1, madi:"حَمَلَ",    mudari:"يَحْمِلُ",    masdar:"حَمْل",       ismFail:"حَامِل",    ismMafool:"مَحْمُول",   meaningEn:"he carried",        verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v23",  root:"ع-م-ل", form:1, madi:"عَمِلَ",    mudari:"يَعْمَلُ",    masdar:"عَمَل",       ismFail:"عَامِل",                            meaningEn:"he worked",         verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v24",  root:"ق-ط-ع", form:1, madi:"قَطَعَ",    mudari:"يَقْطَعُ",    masdar:"قَطْع",       ismFail:"قَاطِع",    ismMafool:"مَقْطُوع",   meaningEn:"he cut",            verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v25",  root:"ج-م-ع", form:1, madi:"جَمَعَ",    mudari:"يَجْمَعُ",    masdar:"جَمْع",       ismFail:"جَامِع",    ismMafool:"مَجْمُوع",   meaningEn:"he gathered",       verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v26",  root:"ز-ر-ع", form:1, madi:"زَرَعَ",    mudari:"يَزْرَعُ",    masdar:"زَرْع",       ismFail:"زَارِع",    ismMafool:"مَزْرُوع",   meaningEn:"he planted",        verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v27",  root:"ش-غ-ل", form:1, madi:"شَغَلَ",    mudari:"يَشْغَلُ",    masdar:"شُغْل",       ismFail:"شَاغِل",    ismMafool:"مَشْغُول",   meaningEn:"he occupied",       verbType:"salim", isTransitive:true,  isQuranic:false },
  { id:"v28",  root:"ف-ع-ل", form:1, madi:"فَعَلَ",    mudari:"يَفْعَلُ",    masdar:"فِعْل",       ismFail:"فَاعِل",    ismMafool:"مَفْعُول",   meaningEn:"he did",            verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v29",  root:"ج-ع-ل", form:1, madi:"جَعَلَ",    mudari:"يَجْعَلُ",    masdar:"جَعْل",       ismFail:"جَاعِل",    ismMafool:"مَجْعُول",   meaningEn:"he made",           verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v30",  root:"ل-ب-س", form:1, madi:"لَبِسَ",    mudari:"يَلْبَسُ",    masdar:"لُبْس",       ismFail:"لَابِس",    ismMafool:"مَلْبُوس",   meaningEn:"he wore",           verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v31",  root:"ر-ج-ع", form:1, madi:"رَجَعَ",    mudari:"يَرْجِعُ",    masdar:"رُجُوع",      ismFail:"رَاجِع",                            meaningEn:"he returned",       verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"v32",  root:"ح-ف-ظ", form:1, madi:"حَفِظَ",    mudari:"يَحْفَظُ",    masdar:"حِفْظ",       ismFail:"حَافِظ",    ismMafool:"مَحْفُوظ",   meaningEn:"he memorized",      verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v33",  root:"ت-ر-ك", form:1, madi:"تَرَكَ",    mudari:"يَتْرُكُ",    masdar:"تَرْك",       ismFail:"تَارِك",    ismMafool:"مَتْرُوك",   meaningEn:"he left",           verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v34",  root:"ك-س-ب", form:1, madi:"كَسَبَ",    mudari:"يَكْسِبُ",    masdar:"كَسْب",       ismFail:"كَاسِب",    ismMafool:"مَكْسُوب",   meaningEn:"he earned",         verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v35",  root:"ع-ر-ف", form:1, madi:"عَرَفَ",    mudari:"يَعْرِفُ",    masdar:"مَعْرِفَة",   ismFail:"عَارِف",    ismMafool:"مَعْرُوف",   meaningEn:"he recognized",     verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v36",  root:"ص-ن-ع", form:1, madi:"صَنَعَ",    mudari:"يَصْنَعُ",    masdar:"صُنْع",       ismFail:"صَانِع",    ismMafool:"مَصْنُوع",   meaningEn:"he manufactured",   verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v37",  root:"ر-ز-ق", form:1, madi:"رَزَقَ",    mudari:"يَرْزُقُ",    masdar:"رِزْق",       ismFail:"رَازِق",    ismMafool:"مَرْزُوق",   meaningEn:"he provided",       verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v38",  root:"ل-ع-ب", form:1, madi:"لَعِبَ",    mudari:"يَلْعَبُ",    masdar:"لَعِب",       ismFail:"لَاعِب",                            meaningEn:"he played",         verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"v39",  root:"ب-ح-ث", form:1, madi:"بَحَثَ",    mudari:"يَبْحَثُ",    masdar:"بَحْث",       ismFail:"بَاحِث",                            meaningEn:"he searched",       verbType:"salim", isTransitive:false, isQuranic:false },
  { id:"v40",  root:"ط-ب-خ", form:1, madi:"طَبَخَ",    mudari:"يَطْبُخُ",    masdar:"طَبْخ",       ismFail:"طَابِخ",    ismMafool:"مَطْبُوخ",   meaningEn:"he cooked",         verbType:"salim", isTransitive:true,  isQuranic:false },
  { id:"v41",  root:"م-ن-ع", form:1, madi:"مَنَعَ",    mudari:"يَمْنَعُ",    masdar:"مَنْع",       ismFail:"مَانِع",    ismMafool:"مَمْنُوع",   meaningEn:"he prevented",      verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v42",  root:"ف-ه-م", form:1, madi:"فَهِمَ",    mudari:"يَفْهَمُ",    masdar:"فَهْم",       ismFail:"فَاهِم",    ismMafool:"مَفْهُوم",   meaningEn:"he understood",     verbType:"salim", isTransitive:true,  isQuranic:false },
  { id:"v43",  root:"غ-س-ل", form:1, madi:"غَسَلَ",    mudari:"يَغْسِلُ",    masdar:"غَسْل",       ismFail:"غَاسِل",    ismMafool:"مَغْسُول",   meaningEn:"he washed",         verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v44",  root:"ق-ب-ل", form:1, madi:"قَبِلَ",    mudari:"يَقْبَلُ",    masdar:"قَبُول",      ismFail:"قَابِل",    ismMafool:"مَقْبُول",   meaningEn:"he accepted",       verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v45",  root:"ع-ر-ض", form:1, madi:"عَرَضَ",    mudari:"يَعْرِضُ",    masdar:"عَرْض",       ismFail:"عَارِض",    ismMafool:"مَعْرُوض",   meaningEn:"he presented",      verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v46",  root:"ح-ص-ل", form:1, madi:"حَصَلَ",    mudari:"يَحْصُلُ",    masdar:"حُصُول",      ismFail:"حَاصِل",                            meaningEn:"he obtained",       verbType:"salim", isTransitive:false, isQuranic:false },
  { id:"v47",  root:"ك-ش-ف", form:1, madi:"كَشَفَ",    mudari:"يَكْشِفُ",    masdar:"كَشْف",       ismFail:"كَاشِف",    ismMafool:"مَكْشُوف",   meaningEn:"he revealed",       verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v48",  root:"س-ك-ن", form:1, madi:"سَكَنَ",    mudari:"يَسْكُنُ",    masdar:"سُكْن",       ismFail:"سَاكِن",                            meaningEn:"he dwelt",          verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"v49",  root:"ع-ج-ب", form:1, madi:"عَجِبَ",    mudari:"يَعْجَبُ",    masdar:"عَجَب",       ismFail:"عَاجِب",                            meaningEn:"he wondered",       verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"v50",  root:"خ-ل-ق", form:1, madi:"خَلَقَ",    mudari:"يَخْلُقُ",    masdar:"خَلْق",       ismFail:"خَالِق",    ismMafool:"مَخْلُوق",   meaningEn:"he created",        verbType:"salim", isTransitive:true,  isQuranic:true,  quranicReference:"96:1" },
  { id:"v51",  root:"ح-ض-ر", form:1, madi:"حَضَرَ",    mudari:"يَحْضُرُ",    masdar:"حُضُور",      ismFail:"حَاضِر",                            meaningEn:"he attended",       verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"v52",  root:"ن-ش-ر", form:1, madi:"نَشَرَ",    mudari:"يَنْشُرُ",    masdar:"نَشْر",       ismFail:"نَاشِر",    ismMafool:"مَنْشُور",   meaningEn:"he spread",         verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v53",  root:"ع-ق-د", form:1, madi:"عَقَدَ",    mudari:"يَعْقِدُ",    masdar:"عَقْد",       ismFail:"عَاقِد",    ismMafool:"مَعْقُود",   meaningEn:"he tied",           verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v54",  root:"ح-ب-س", form:1, madi:"حَبَسَ",    mudari:"يَحْبِسُ",    masdar:"حَبْس",       ismFail:"حَابِس",    ismMafool:"مَحْبُوس",   meaningEn:"he imprisoned",     verbType:"salim", isTransitive:true,  isQuranic:false },
  { id:"v55",  root:"ر-ق-ب", form:1, madi:"رَقَبَ",    mudari:"يَرْقُبُ",    masdar:"رِقَابَة",    ismFail:"رَاقِب",                            meaningEn:"he watched",        verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v56",  root:"ب-ع-ث", form:1, madi:"بَعَثَ",    mudari:"يَبْعَثُ",    masdar:"بَعْث",       ismFail:"بَاعِث",    ismMafool:"مَبْعُوث",   meaningEn:"he sent",           verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v57",  root:"ف-ر-ض", form:1, madi:"فَرَضَ",    mudari:"يَفْرِضُ",    masdar:"فَرْض",       ismFail:"فَارِض",    ismMafool:"مَفْرُوض",   meaningEn:"he imposed",        verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v58",  root:"ر-س-م", form:1, madi:"رَسَمَ",    mudari:"يَرْسُمُ",    masdar:"رَسْم",       ismFail:"رَاسِم",    ismMafool:"مَرْسُوم",   meaningEn:"he drew",           verbType:"salim", isTransitive:true,  isQuranic:false },
  { id:"v59",  root:"ع-ت-ب", form:1, madi:"عَتَبَ",    mudari:"يَعْتِبُ",    masdar:"عَتْب",       ismFail:"عَاتِب",                            meaningEn:"he rebuked",        verbType:"salim", isTransitive:true,  isQuranic:false },
  { id:"v60",  root:"ل-ح-ق", form:1, madi:"لَحِقَ",    mudari:"يَلْحَقُ",    masdar:"لَحَاق",      ismFail:"لَاحِق",                            meaningEn:"he caught up",      verbType:"salim", isTransitive:true,  isQuranic:false },
  { id:"v61",  root:"ص-د-ق", form:1, madi:"صَدَقَ",    mudari:"يَصْدُقُ",    masdar:"صِدْق",       ismFail:"صَادِق",                            meaningEn:"he was truthful",   verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"v62",  root:"ك-ذ-ب", form:1, madi:"كَذَبَ",    mudari:"يَكْذِبُ",    masdar:"كَذِب",       ismFail:"كَاذِب",                            meaningEn:"he lied",           verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"v63",  root:"ك-ف-ر", form:1, madi:"كَفَرَ",    mudari:"يَكْفُرُ",    masdar:"كُفْر",       ismFail:"كَافِر",                            meaningEn:"he disbelieved",    verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"v64",  root:"ظ-ل-م", form:1, madi:"ظَلَمَ",    mudari:"يَظْلِمُ",    masdar:"ظُلْم",       ismFail:"ظَالِم",    ismMafool:"مَظْلُوم",   meaningEn:"he oppressed",      verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v65",  root:"ع-ذ-ب", form:1, madi:"عَذَبَ",    mudari:"يَعْذِبُ",    masdar:"عَذَاب",      ismFail:"مُعَذِّب",                          meaningEn:"he tormented",      verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v66",  root:"ر-ح-م", form:1, madi:"رَحِمَ",    mudari:"يَرْحَمُ",    masdar:"رَحْمَة",     ismFail:"رَاحِم",    ismMafool:"مَرْحُوم",   meaningEn:"he had mercy",      verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v67",  root:"ق-ص-د", form:1, madi:"قَصَدَ",    mudari:"يَقْصِدُ",    masdar:"قَصْد",       ismFail:"قَاصِد",    ismMafool:"مَقْصُود",   meaningEn:"he intended",       verbType:"salim", isTransitive:true,  isQuranic:false },
  { id:"v68",  root:"ح-ر-ث", form:1, madi:"حَرَثَ",    mudari:"يَحْرُثُ",    masdar:"حَرْث",       ismFail:"حَارِث",                            meaningEn:"he plowed",         verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v69",  root:"ب-ط-ش", form:1, madi:"بَطَشَ",    mudari:"يَبْطِشُ",    masdar:"بَطْش",       ismFail:"بَاطِش",                            meaningEn:"he seized",         verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v70",  root:"ف-ص-ل", form:1, madi:"فَصَلَ",    mudari:"يَفْصِلُ",    masdar:"فَصْل",       ismFail:"فَاصِل",    ismMafool:"مَفْصُول",   meaningEn:"he separated",      verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v71",  root:"ط-ب-ع", form:1, madi:"طَبَعَ",    mudari:"يَطْبَعُ",    masdar:"طَبْع",       ismFail:"طَابِع",    ismMafool:"مَطْبُوع",   meaningEn:"he sealed",         verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v72",  root:"ص-ر-ف", form:1, madi:"صَرَفَ",    mudari:"يَصْرِفُ",    masdar:"صَرْف",       ismFail:"صَارِف",    ismMafool:"مَصْرُوف",   meaningEn:"he spent",          verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v73",  root:"ع-ت-ق", form:1, madi:"عَتَقَ",    mudari:"يَعْتِقُ",    masdar:"عِتْق",       ismFail:"عَاتِق",                            meaningEn:"he freed",          verbType:"salim", isTransitive:true,  isQuranic:false },
  { id:"v74",  root:"ع-ب-ر", form:1, madi:"عَبَرَ",    mudari:"يَعْبُرُ",    masdar:"عُبُور",      ismFail:"عَابِر",                            meaningEn:"he crossed",        verbType:"salim", isTransitive:true,  isQuranic:false },
  { id:"v75",  root:"ف-ك-ر", form:1, madi:"فَكَرَ",    mudari:"يَفْكُرُ",    masdar:"فِكْر",       ismFail:"فَاكِر",                            meaningEn:"he thought",        verbType:"salim", isTransitive:false, isQuranic:false },
  { id:"v76",  root:"ر-ف-ع", form:1, madi:"رَفَعَ",    mudari:"يَرْفَعُ",    masdar:"رَفْع",       ismFail:"رَافِع",    ismMafool:"مَرْفُوع",   meaningEn:"he raised",         verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v77",  root:"ق-ص-ر", form:1, madi:"قَصَرَ",    mudari:"يَقْصُرُ",    masdar:"قَصْر",       ismFail:"قَاصِر",    ismMafool:"مَقْصُور",   meaningEn:"he shortened",      verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v78",  root:"ن-ق-ل", form:1, madi:"نَقَلَ",    mudari:"يَنْقُلُ",    masdar:"نَقْل",       ismFail:"نَاقِل",    ismMafool:"مَنْقُول",   meaningEn:"he transferred",    verbType:"salim", isTransitive:true,  isQuranic:false },
  { id:"v79",  root:"س-ج-د", form:1, madi:"سَجَدَ",    mudari:"يَسْجُدُ",    masdar:"سُجُود",      ismFail:"سَاجِد",                            meaningEn:"he prostrated",     verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"v80",  root:"ك-ب-ر", form:1, madi:"كَبِرَ",    mudari:"يَكْبَرُ",    masdar:"كِبَر",       ismFail:"كَابِر",                            meaningEn:"he grew great",     verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"v81",  root:"ص-ل-ح", form:1, madi:"صَلَحَ",    mudari:"يَصْلُحُ",    masdar:"صَلَاح",      ismFail:"صَالِح",                            meaningEn:"he was righteous",  verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"v82",  root:"ف-ض-ل", form:1, madi:"فَضَلَ",    mudari:"يَفْضُلُ",    masdar:"فَضْل",       ismFail:"فَاضِل",                            meaningEn:"he surpassed",      verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v83",  root:"ب-خ-ل", form:1, madi:"بَخِلَ",    mudari:"يَبْخَلُ",    masdar:"بُخْل",       ismFail:"بَاخِل",                            meaningEn:"he was stingy",     verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"v84",  root:"ق-ب-ض", form:1, madi:"قَبَضَ",    mudari:"يَقْبِضُ",    masdar:"قَبْض",       ismFail:"قَابِض",    ismMafool:"مَقْبُوض",   meaningEn:"he seized",         verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v85",  root:"ب-ع-د", form:1, madi:"بَعُدَ",    mudari:"يَبْعُدُ",    masdar:"بُعْد",       ismFail:"بَعِيد",                            meaningEn:"he was far",        verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"v86",  root:"ق-ر-ب", form:1, madi:"قَرُبَ",    mudari:"يَقْرُبُ",    masdar:"قُرْب",       ismFail:"قَرِيب",                            meaningEn:"he was near",       verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"v87",  root:"ح-ص-د", form:1, madi:"حَصَدَ",    mudari:"يَحْصُدُ",    masdar:"حَصَاد",      ismFail:"حَاصِد",    ismMafool:"مَحْصُود",   meaningEn:"he harvested",      verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v88",  root:"ه-ل-ك", form:1, madi:"هَلَكَ",    mudari:"يَهْلِكُ",    masdar:"هَلَاك",      ismFail:"هَالِك",                            meaningEn:"he perished",       verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"v89",  root:"ع-ب-ث", form:1, madi:"عَبَثَ",    mudari:"يَعْبَثُ",    masdar:"عَبَث",       ismFail:"عَابِث",                            meaningEn:"he tampered",       verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"v90",  root:"ش-ه-د", form:1, madi:"شَهِدَ",    mudari:"يَشْهَدُ",    masdar:"شَهَادَة",    ismFail:"شَاهِد",    ismMafool:"مَشْهُود",   meaningEn:"he witnessed",      verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v91",  root:"ق-ب-ر", form:1, madi:"قَبَرَ",    mudari:"يَقْبُرُ",    masdar:"قَبْر",                                                   meaningEn:"he buried",         verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v92",  root:"ح-ز-ن", form:1, madi:"حَزِنَ",    mudari:"يَحْزَنُ",    masdar:"حُزْن",       ismFail:"حَزِين",                            meaningEn:"he grieved",        verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"v93",  root:"ف-ر-ح", form:1, madi:"فَرِحَ",    mudari:"يَفْرَحُ",    masdar:"فَرَح",       ismFail:"فَرِح",                             meaningEn:"he rejoiced",       verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"v94",  root:"غ-ض-ب", form:1, madi:"غَضِبَ",    mudari:"يَغْضَبُ",    masdar:"غَضَب",       ismFail:"غَاضِب",                            meaningEn:"he was angry",      verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"v95",  root:"ج-ب-ر", form:1, madi:"جَبَرَ",    mudari:"يَجْبُرُ",    masdar:"جَبْر",       ismFail:"جَابِر",                            meaningEn:"he compelled",      verbType:"salim", isTransitive:true,  isQuranic:false },
  { id:"v96",  root:"س-ب-ق", form:1, madi:"سَبَقَ",    mudari:"يَسْبِقُ",    masdar:"سَبْق",       ismFail:"سَابِق",    ismMafool:"مَسْبُوق",   meaningEn:"he preceded",       verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v97",  root:"ن-ظ-ر", form:1, madi:"نَظَرَ",    mudari:"يَنْظُرُ",    masdar:"نَظَر",       ismFail:"نَاظِر",    ismMafool:"مَنْظُور",   meaningEn:"he looked",         verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"v98",  root:"ذ-ك-ر", form:1, madi:"ذَكَرَ",    mudari:"يَذْكُرُ",    masdar:"ذِكْر",       ismFail:"ذَاكِر",    ismMafool:"مَذْكُور",   meaningEn:"he remembered",     verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v99",  root:"ش-ر-ح", form:1, madi:"شَرَحَ",    mudari:"يَشْرَحُ",    masdar:"شَرْح",       ismFail:"شَارِح",    ismMafool:"مَشْرُوح",   meaningEn:"he explained",      verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v100", root:"ب-ع-ض", form:1, madi:"بَعَضَ",    mudari:"يَبْعَضُ",    masdar:"بَعْض",                                                   meaningEn:"he divided",        verbType:"salim", isTransitive:true,  isQuranic:false },
  { id:"v101", root:"ط-ر-ق", form:1, madi:"طَرَقَ",    mudari:"يَطْرُقُ",    masdar:"طَرْق",       ismFail:"طَارِق",                            meaningEn:"he knocked",        verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v102", root:"ق-ع-د", form:1, madi:"قَعَدَ",    mudari:"يَقْعُدُ",    masdar:"قُعُود",      ismFail:"قَاعِد",                            meaningEn:"he sat down",       verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"v103", root:"خ-ط-ب", form:1, madi:"خَطَبَ",    mudari:"يَخْطُبُ",    masdar:"خُطْبَة",     ismFail:"خَاطِب",                            meaningEn:"he gave a sermon",  verbType:"salim", isTransitive:true,  isQuranic:false },
  { id:"v104", root:"ح-ق-د", form:1, madi:"حَقَدَ",    mudari:"يَحْقِدُ",    masdar:"حِقْد",       ismFail:"حَاقِد",                            meaningEn:"he held a grudge",  verbType:"salim", isTransitive:false, isQuranic:false },
  { id:"v105", root:"ر-ج-م", form:1, madi:"رَجَمَ",    mudari:"يَرْجُمُ",    masdar:"رَجْم",       ismFail:"رَاجِم",    ismMafool:"مَرْجُوم",   meaningEn:"he stoned",         verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v106", root:"ب-ل-غ", form:1, madi:"بَلَغَ",    mudari:"يَبْلُغُ",    masdar:"بُلُوغ",      ismFail:"بَالِغ",                            meaningEn:"he reached",        verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v107", root:"خ-ت-م", form:1, madi:"خَتَمَ",    mudari:"يَخْتِمُ",    masdar:"خَتْم",       ismFail:"خَاتِم",    ismMafool:"مَخْتُوم",   meaningEn:"he sealed",         verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v108", root:"ح-ف-ر", form:1, madi:"حَفَرَ",    mudari:"يَحْفِرُ",    masdar:"حَفْر",       ismFail:"حَافِر",    ismMafool:"مَحْفُور",   meaningEn:"he dug",            verbType:"salim", isTransitive:true,  isQuranic:false },
  { id:"v109", root:"ز-ع-م", form:1, madi:"زَعَمَ",    mudari:"يَزْعُمُ",    masdar:"زَعْم",       ismFail:"زَاعِم",                            meaningEn:"he claimed",        verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v110", root:"ع-ص-م", form:1, madi:"عَصَمَ",    mudari:"يَعْصِمُ",    masdar:"عِصْمَة",     ismFail:"عَاصِم",    ismMafool:"مَعْصُوم",   meaningEn:"he protected",      verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v111", root:"ف-ل-ح", form:1, madi:"فَلَحَ",    mudari:"يَفْلَحُ",    masdar:"فَلَاح",      ismFail:"فَالِح",                            meaningEn:"he succeeded",      verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"v112", root:"ك-ر-م", form:1, madi:"كَرُمَ",    mudari:"يَكْرُمُ",    masdar:"كَرَم",       ismFail:"كَرِيم",                            meaningEn:"he was generous",   verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"v113", root:"ح-ل-ف", form:1, madi:"حَلَفَ",    mudari:"يَحْلِفُ",    masdar:"حَلِف",       ismFail:"حَالِف",                            meaningEn:"he swore",          verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"v114", root:"خ-ب-ط", form:1, madi:"خَبَطَ",    mudari:"يَخْبِطُ",    masdar:"خَبْط",       ismFail:"خَابِط",                            meaningEn:"he struck wildly",  verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v115", root:"ر-ع-د", form:1, madi:"رَعَدَ",    mudari:"يَرْعُدُ",    masdar:"رَعْد",                                                   meaningEn:"it thundered",      verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"v116", root:"ب-ر-ق", form:1, madi:"بَرَقَ",    mudari:"يَبْرُقُ",    masdar:"بَرْق",                                                   meaningEn:"it flashed",        verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"v117", root:"ع-ص-ر", form:1, madi:"عَصَرَ",    mudari:"يَعْصِرُ",    masdar:"عَصْر",       ismFail:"عَاصِر",    ismMafool:"مَعْصُور",   meaningEn:"he squeezed",       verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v118", root:"ق-ل-ب", form:1, madi:"قَلَبَ",    mudari:"يَقْلِبُ",    masdar:"قَلْب",       ismFail:"قَالِب",    ismMafool:"مَقْلُوب",   meaningEn:"he turned over",    verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"v119", root:"ع-ل-ق", form:1, madi:"عَلَقَ",    mudari:"يَعْلُقُ",    masdar:"عَلَق",       ismFail:"عَالِق",                            meaningEn:"he clung",          verbType:"salim", isTransitive:false, isQuranic:true,  quranicReference:"96:2" },
  { id:"v120", root:"خ-ش-ع", form:1, madi:"خَشَعَ",    mudari:"يَخْشَعُ",    masdar:"خُشُوع",      ismFail:"خَاشِع",                            meaningEn:"he humbled himself", verbType:"salim", isTransitive:false, isQuranic:true },
  // ─── Form II (فَعَّلَ) ───
  { id:"f2t",  root:"ع-ل-م", form:2, madi:"عَلَّمَ",   mudari:"يُعَلِّمُ",   masdar:"تَعْلِيم",    ismFail:"مُعَلِّم",  ismMafool:"مُعَلَّم",   meaningEn:"he taught",         verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"f2v1", root:"ن-ز-ل", form:2, madi:"نَزَّلَ",   mudari:"يُنَزِّلُ",   masdar:"تَنْزِيل",    ismFail:"مُنَزِّل",  ismMafool:"مُنَزَّل",   meaningEn:"he sent down",      verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"f2v2", root:"ق-د-م", form:2, madi:"قَدَّمَ",   mudari:"يُقَدِّمُ",   masdar:"تَقْدِيم",    ismFail:"مُقَدِّم",  ismMafool:"مُقَدَّم",   meaningEn:"he presented",      verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"f2v3", root:"ب-ش-ر", form:2, madi:"بَشَّرَ",   mudari:"يُبَشِّرُ",   masdar:"تَبْشِير",    ismFail:"مُبَشِّر",  ismMafool:"مُبَشَّر",   meaningEn:"he gave glad tidings", verbType:"salim", isTransitive:true, isQuranic:true },
  { id:"f2v4", root:"س-ب-ح", form:2, madi:"سَبَّحَ",   mudari:"يُسَبِّحُ",   masdar:"تَسْبِيح",    ismFail:"مُسَبِّح",                          meaningEn:"he glorified",      verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"f2v5", root:"ك-ب-ر", form:2, madi:"كَبَّرَ",   mudari:"يُكَبِّرُ",   masdar:"تَكْبِير",    ismFail:"مُكَبِّر",  ismMafool:"مُكَبَّر",   meaningEn:"he magnified",      verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"f2v6", root:"ح-ر-م", form:2, madi:"حَرَّمَ",   mudari:"يُحَرِّمُ",   masdar:"تَحْرِيم",    ismFail:"مُحَرِّم",  ismMafool:"مُحَرَّم",   meaningEn:"he forbade",        verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"f2v7", root:"ك-ل-م", form:2, madi:"كَلَّمَ",   mudari:"يُكَلِّمُ",   masdar:"تَكْلِيم",    ismFail:"مُكَلِّم",  ismMafool:"مُكَلَّم",   meaningEn:"he spoke to",       verbType:"salim", isTransitive:true,  isQuranic:true },
  // ─── Form III (فَاعَلَ) ───
  { id:"f3t",  root:"ق-ت-ل", form:3, madi:"قَاتَلَ",   mudari:"يُقَاتِلُ",   masdar:"مُقَاتَلَة",  ismFail:"مُقَاتِل",  ismMafool:"مُقَاتَل",   meaningEn:"he fought",         verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"f3v1", root:"ج-ه-د", form:3, madi:"جَاهَدَ",   mudari:"يُجَاهِدُ",   masdar:"مُجَاهَدَة",  ismFail:"مُجَاهِد",                          meaningEn:"he strove",         verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"f3v2", root:"ن-ص-ر", form:3, madi:"نَاصَرَ",   mudari:"يُنَاصِرُ",   masdar:"مُنَاصَرَة",  ismFail:"مُنَاصِر",                          meaningEn:"he supported",      verbType:"salim", isTransitive:true,  isQuranic:false },
  { id:"f3v3", root:"ح-س-ب", form:3, madi:"حَاسَبَ",   mudari:"يُحَاسِبُ",   masdar:"مُحَاسَبَة",  ismFail:"مُحَاسِب",                          meaningEn:"he held accountable", verbType:"salim", isTransitive:true, isQuranic:true },
  { id:"f3v4", root:"ب-ر-ك", form:3, madi:"بَارَكَ",   mudari:"يُبَارِكُ",   masdar:"مُبَارَكَة",  ismFail:"مُبَارِك",                          meaningEn:"he blessed",        verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"f3v5", root:"خ-ط-ب", form:3, madi:"خَاطَبَ",   mudari:"يُخَاطِبُ",   masdar:"مُخَاطَبَة",  ismFail:"مُخَاطِب",                          meaningEn:"he addressed",      verbType:"salim", isTransitive:true,  isQuranic:false },
  // ─── Form IV (أَفْعَلَ) ───
  { id:"f4t",  root:"خ-ر-ج", form:4, madi:"أَخْرَجَ",  mudari:"يُخْرِجُ",    masdar:"إِخْرَاج",    ismFail:"مُخْرِج",   ismMafool:"مُخْرَج",    meaningEn:"he extracted",      verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"f4v1", root:"ن-ز-ل", form:4, madi:"أَنْزَلَ",  mudari:"يُنْزِلُ",    masdar:"إِنْزَال",    ismFail:"مُنْزِل",   ismMafool:"مُنْزَل",    meaningEn:"he sent down",      verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"f4v2", root:"ر-س-ل", form:4, madi:"أَرْسَلَ",  mudari:"يُرْسِلُ",    masdar:"إِرْسَال",    ismFail:"مُرْسِل",   ismMafool:"مُرْسَل",    meaningEn:"he sent",           verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"f4v3", root:"س-ل-م", form:4, madi:"أَسْلَمَ",  mudari:"يُسْلِمُ",    masdar:"إِسْلَام",    ismFail:"مُسْلِم",                           meaningEn:"he submitted",      verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"f4v4", root:"ح-س-ن", form:4, madi:"أَحْسَنَ",  mudari:"يُحْسِنُ",    masdar:"إِحْسَان",    ismFail:"مُحْسِن",                           meaningEn:"he did good",       verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"f4v5", root:"د-خ-ل", form:4, madi:"أَدْخَلَ",  mudari:"يُدْخِلُ",    masdar:"إِدْخَال",    ismFail:"مُدْخِل",   ismMafool:"مُدْخَل",    meaningEn:"he admitted",       verbType:"salim", isTransitive:true,  isQuranic:true },
  // ─── Form V (تَفَعَّلَ) ───
  { id:"f5t",  root:"ع-ل-م", form:5, madi:"تَعَلَّمَ", mudari:"يَتَعَلَّمُ", masdar:"تَعَلُّم",    ismFail:"مُتَعَلِّم",                        meaningEn:"he learned",        verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"f5v1", root:"ك-ل-م", form:5, madi:"تَكَلَّمَ", mudari:"يَتَكَلَّمُ", masdar:"تَكَلُّم",    ismFail:"مُتَكَلِّم",                        meaningEn:"he spoke",          verbType:"salim", isTransitive:false, isQuranic:false },
  { id:"f5v2", root:"ق-د-م", form:5, madi:"تَقَدَّمَ", mudari:"يَتَقَدَّمُ", masdar:"تَقَدُّم",    ismFail:"مُتَقَدِّم",                        meaningEn:"he advanced",       verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"f5v3", root:"ف-ك-ر", form:5, madi:"تَفَكَّرَ", mudari:"يَتَفَكَّرُ", masdar:"تَفَكُّر",    ismFail:"مُتَفَكِّر",                        meaningEn:"he contemplated",   verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"f5v4", root:"ذ-ك-ر", form:5, madi:"تَذَكَّرَ", mudari:"يَتَذَكَّرُ", masdar:"تَذَكُّر",    ismFail:"مُتَذَكِّر",                        meaningEn:"he remembered",     verbType:"salim", isTransitive:false, isQuranic:true },
  // ─── Form VI (تَفَاعَلَ) ───
  { id:"f6t",  root:"ب-ع-د", form:6, madi:"تَبَاعَدَ", mudari:"يَتَبَاعَدُ", masdar:"تَبَاعُد",    ismFail:"مُتَبَاعِد",                        meaningEn:"to keep apart from one another", verbType:"salim", isTransitive:false, isQuranic:false },
  { id:"f6v1", root:"ب-ر-ك", form:6, madi:"تَبَارَكَ", mudari:"يَتَبَارَكُ", masdar:"تَبَارُك",    ismFail:"مُتَبَارِك",                        meaningEn:"to be abundantly blessed", verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"f6v2", root:"ن-ص-ر", form:6, madi:"تَنَاصَرَ", mudari:"يَتَنَاصَرُ", masdar:"تَنَاصُر",    ismFail:"مُتَنَاصِر",                        meaningEn:"to support one another", verbType:"salim", isTransitive:false, isQuranic:false },
  { id:"f6v3", root:"ب-د-ل", form:6, madi:"تَبَادَلَ", mudari:"يَتَبَادَلُ", masdar:"تَبَادُل",    ismFail:"مُتَبَادِل",                        meaningEn:"to exchange mutually", verbType:"salim", isTransitive:false, isQuranic:false },
  // ─── Form VII (اِنْفَعَلَ) ───
  { id:"f7t",  root:"ك-س-ر", form:7, madi:"اِنْكَسَرَ", mudari:"يَنْكَسِرُ", masdar:"اِنْكِسَار",  ismFail:"مُنْكَسِر",                        meaningEn:"it broke",          verbType:"salim", isTransitive:false, isQuranic:false },
  { id:"f7v1", root:"ف-ت-ح", form:7, madi:"اِنْفَتَحَ", mudari:"يَنْفَتِحُ", masdar:"اِنْفِتَاح",  ismFail:"مُنْفَتِح",                        meaningEn:"it opened",         verbType:"salim", isTransitive:false, isQuranic:false },
  { id:"f7v2", root:"ق-ل-ب", form:7, madi:"اِنْقَلَبَ", mudari:"يَنْقَلِبُ", masdar:"اِنْقِلَاب",  ismFail:"مُنْقَلِب",                        meaningEn:"it overturned",     verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"f7v3", root:"ط-ل-ق", form:7, madi:"اِنْطَلَقَ", mudari:"يَنْطَلِقُ", masdar:"اِنْطِلَاق",  ismFail:"مُنْطَلِق",                        meaningEn:"he set out",        verbType:"salim", isTransitive:false, isQuranic:true },
  // ─── Form VIII (اِفْتَعَلَ) ───
  { id:"f8t",  root:"ج-م-ع", form:8, madi:"اِجْتَمَعَ", mudari:"يَجْتَمِعُ", masdar:"اِجْتِمَاع",  ismFail:"مُجْتَمِع",                        meaningEn:"he gathered",       verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"f8v1", root:"ك-س-ب", form:8, madi:"اِكْتَسَبَ", mudari:"يَكْتَسِبُ", masdar:"اِكْتِسَاب",  ismFail:"مُكْتَسِب",  ismMafool:"مُكْتَسَب", meaningEn:"he earned",        verbType:"salim", isTransitive:true,  isQuranic:true },
  { id:"f8v2", root:"خ-ل-ف", form:8, madi:"اِخْتَلَفَ", mudari:"يَخْتَلِفُ", masdar:"اِخْتِلَاف",  ismFail:"مُخْتَلِف",                        meaningEn:"he differed",       verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"f8v3", root:"ف-خ-ر", form:8, madi:"اِفْتَخَرَ", mudari:"يَفْتَخِرُ", masdar:"اِفْتِخَار",  ismFail:"مُفْتَخِر",                        meaningEn:"he was proud",      verbType:"salim", isTransitive:false, isQuranic:false },
  { id:"f8v4", root:"ح-ر-م", form:8, madi:"اِحْتَرَمَ", mudari:"يَحْتَرِمُ", masdar:"اِحْتِرَام",  ismFail:"مُحْتَرِم",  ismMafool:"مُحْتَرَم", meaningEn:"he respected",     verbType:"salim", isTransitive:true,  isQuranic:false },
  // ─── Form X (اِسْتَفْعَلَ) ───
  { id:"f10t",  root:"غ-ف-ر", form:10, madi:"اِسْتَغْفَرَ", mudari:"يَسْتَغْفِرُ", masdar:"اِسْتِغْفَار", ismFail:"مُسْتَغْفِر", meaningEn:"he sought forgiveness", verbType:"salim", isTransitive:true, isQuranic:true },
  { id:"f10v1", root:"خ-ر-ج", form:10, madi:"اِسْتَخْرَجَ", mudari:"يَسْتَخْرِجُ", masdar:"اِسْتِخْرَاج", ismFail:"مُسْتَخْرِج", ismMafool:"مُسْتَخْرَج", meaningEn:"he extracted", verbType:"salim", isTransitive:true, isQuranic:true },
  { id:"f10v2", root:"ك-ب-ر", form:10, madi:"اِسْتَكْبَرَ", mudari:"يَسْتَكْبِرُ", masdar:"اِسْتِكْبَار", ismFail:"مُسْتَكْبِر", meaningEn:"he was arrogant",   verbType:"salim", isTransitive:false, isQuranic:true },
  { id:"f10v3", root:"ع-م-ل", form:10, madi:"اِسْتَعْمَلَ", mudari:"يَسْتَعْمِلُ", masdar:"اِسْتِعْمَال", ismFail:"مُسْتَعْمِل", ismMafool:"مُسْتَعْمَل", meaningEn:"he used", verbType:"salim", isTransitive:true, isQuranic:false },
  { id:"f10v4", root:"ق-ب-ل", form:10, madi:"اِسْتَقْبَلَ", mudari:"يَسْتَقْبِلُ", masdar:"اِسْتِقْبَال", ismFail:"مُسْتَقْبِل", ismMafool:"مُسْتَقْبَل", meaningEn:"he received", verbType:"salim", isTransitive:true, isQuranic:false },
];

export function getVerbById(id: string): Verb | undefined {
  return STARTER_VERBS.find(v => v.id === id);
}

// ─── Form Labels ─────────────────────────────────────────────────────────────

export const FORM_LABELS: Record<number, { ar: string; pattern: string; meaning: string }> = {
  1:  { ar: "فَعَلَ",     pattern: "faʿala",    meaning: "Base form" },
  2:  { ar: "فَعَّلَ",    pattern: "faʿʿala",   meaning: "Intensive / causative" },
  3:  { ar: "فَاعَلَ",    pattern: "fāʿala",    meaning: "Mutual / reciprocal" },
  4:  { ar: "أَفْعَلَ",   pattern: "ʾafʿala",   meaning: "Causative / transitive" },
  5:  { ar: "تَفَعَّلَ",  pattern: "tafaʿʿala", meaning: "Reflexive of II" },
  6:  { ar: "تَفَاعَلَ",  pattern: "tafāʿala",  meaning: "Reciprocal / pretense" },
  7:  { ar: "اِنْفَعَلَ", pattern: "infaʿala",  meaning: "Passive / reflexive" },
  8:  { ar: "اِفْتَعَلَ", pattern: "iftaʿala",  meaning: "Reflexive / middle" },
  9:  { ar: "اِفْعَلَّ",  pattern: "ifʿalla",   meaning: "Colors / defects" },
  10: { ar: "اِسْتَفْعَلَ", pattern: "istafʿala", meaning: "Seeking / requesting" },
};

// ─── Template Verb Records ───────────────────────────────────────────────────

export const FORM_TEMPLATE_VERBS: Record<number, Verb> = {
  1:  STARTER_VERBS.find(v => v.id === "v1")!,
  2:  STARTER_VERBS.find(v => v.id === "f2t")!,
  3:  STARTER_VERBS.find(v => v.id === "f3t")!,
  4:  STARTER_VERBS.find(v => v.id === "f4t")!,
  5:  STARTER_VERBS.find(v => v.id === "f5t")!,
  6:  STARTER_VERBS.find(v => v.id === "f6t")!,
  7:  STARTER_VERBS.find(v => v.id === "f7t")!,
  8:  STARTER_VERBS.find(v => v.id === "f8t")!,
  10: STARTER_VERBS.find(v => v.id === "f10t")!,
};

// ─── Pre-computed Template Conjugations ──────────────────────────────────────

export const KATABA_CONJUGATIONS: Conjugation[] = [
  // Past Active
  { verbId:"v1", tense:"madi", voice:"active", slotId:1,  formText:"كَتَبَ" },
  { verbId:"v1", tense:"madi", voice:"active", slotId:2,  formText:"كَتَبَا" },
  { verbId:"v1", tense:"madi", voice:"active", slotId:3,  formText:"كَتَبُوا" },
  { verbId:"v1", tense:"madi", voice:"active", slotId:4,  formText:"كَتَبَتْ" },
  { verbId:"v1", tense:"madi", voice:"active", slotId:5,  formText:"كَتَبَتَا" },
  { verbId:"v1", tense:"madi", voice:"active", slotId:6,  formText:"كَتَبْنَ" },
  { verbId:"v1", tense:"madi", voice:"active", slotId:7,  formText:"كَتَبْتَ" },
  { verbId:"v1", tense:"madi", voice:"active", slotId:8,  formText:"كَتَبْتُمَا" },
  { verbId:"v1", tense:"madi", voice:"active", slotId:9,  formText:"كَتَبْتُمْ" },
  { verbId:"v1", tense:"madi", voice:"active", slotId:10, formText:"كَتَبْتِ" },
  { verbId:"v1", tense:"madi", voice:"active", slotId:11, formText:"كَتَبْتُمَا" },
  { verbId:"v1", tense:"madi", voice:"active", slotId:12, formText:"كَتَبْتُنَّ" },
  { verbId:"v1", tense:"madi", voice:"active", slotId:13, formText:"كَتَبْتُ" },
  { verbId:"v1", tense:"madi", voice:"active", slotId:14, formText:"كَتَبْنَا" },
  // Past Passive
  { verbId:"v1", tense:"madi", voice:"passive", slotId:1,  formText:"كُتِبَ" },
  { verbId:"v1", tense:"madi", voice:"passive", slotId:2,  formText:"كُتِبَا" },
  { verbId:"v1", tense:"madi", voice:"passive", slotId:3,  formText:"كُتِبُوا" },
  { verbId:"v1", tense:"madi", voice:"passive", slotId:4,  formText:"كُتِبَتْ" },
  { verbId:"v1", tense:"madi", voice:"passive", slotId:5,  formText:"كُتِبَتَا" },
  { verbId:"v1", tense:"madi", voice:"passive", slotId:6,  formText:"كُتِبْنَ" },
  { verbId:"v1", tense:"madi", voice:"passive", slotId:7,  formText:"كُتِبْتَ" },
  { verbId:"v1", tense:"madi", voice:"passive", slotId:8,  formText:"كُتِبْتُمَا" },
  { verbId:"v1", tense:"madi", voice:"passive", slotId:9,  formText:"كُتِبْتُمْ" },
  { verbId:"v1", tense:"madi", voice:"passive", slotId:10, formText:"كُتِبْتِ" },
  { verbId:"v1", tense:"madi", voice:"passive", slotId:11, formText:"كُتِبْتُمَا" },
  { verbId:"v1", tense:"madi", voice:"passive", slotId:12, formText:"كُتِبْتُنَّ" },
  { verbId:"v1", tense:"madi", voice:"passive", slotId:13, formText:"كُتِبْتُ" },
  { verbId:"v1", tense:"madi", voice:"passive", slotId:14, formText:"كُتِبْنَا" },
  // Present Active
  { verbId:"v1", tense:"mudari", voice:"active", slotId:1,  formText:"يَكْتُبُ" },
  { verbId:"v1", tense:"mudari", voice:"active", slotId:2,  formText:"يَكْتُبَانِ" },
  { verbId:"v1", tense:"mudari", voice:"active", slotId:3,  formText:"يَكْتُبُونَ" },
  { verbId:"v1", tense:"mudari", voice:"active", slotId:4,  formText:"تَكْتُبُ" },
  { verbId:"v1", tense:"mudari", voice:"active", slotId:5,  formText:"تَكْتُبَانِ" },
  { verbId:"v1", tense:"mudari", voice:"active", slotId:6,  formText:"يَكْتُبْنَ" },
  { verbId:"v1", tense:"mudari", voice:"active", slotId:7,  formText:"تَكْتُبُ" },
  { verbId:"v1", tense:"mudari", voice:"active", slotId:8,  formText:"تَكْتُبَانِ" },
  { verbId:"v1", tense:"mudari", voice:"active", slotId:9,  formText:"تَكْتُبُونَ" },
  { verbId:"v1", tense:"mudari", voice:"active", slotId:10, formText:"تَكْتُبِينَ" },
  { verbId:"v1", tense:"mudari", voice:"active", slotId:11, formText:"تَكْتُبَانِ" },
  { verbId:"v1", tense:"mudari", voice:"active", slotId:12, formText:"تَكْتُبْنَ" },
  { verbId:"v1", tense:"mudari", voice:"active", slotId:13, formText:"أَكْتُبُ" },
  { verbId:"v1", tense:"mudari", voice:"active", slotId:14, formText:"نَكْتُبُ" },
  // Present Passive
  { verbId:"v1", tense:"mudari", voice:"passive", slotId:1,  formText:"يُكْتَبُ" },
  { verbId:"v1", tense:"mudari", voice:"passive", slotId:2,  formText:"يُكْتَبَانِ" },
  { verbId:"v1", tense:"mudari", voice:"passive", slotId:3,  formText:"يُكْتَبُونَ" },
  { verbId:"v1", tense:"mudari", voice:"passive", slotId:4,  formText:"تُكْتَبُ" },
  { verbId:"v1", tense:"mudari", voice:"passive", slotId:5,  formText:"تُكْتَبَانِ" },
  { verbId:"v1", tense:"mudari", voice:"passive", slotId:6,  formText:"يُكْتَبْنَ" },
  { verbId:"v1", tense:"mudari", voice:"passive", slotId:7,  formText:"تُكْتَبُ" },
  { verbId:"v1", tense:"mudari", voice:"passive", slotId:8,  formText:"تُكْتَبَانِ" },
  { verbId:"v1", tense:"mudari", voice:"passive", slotId:9,  formText:"تُكْتَبُونَ" },
  { verbId:"v1", tense:"mudari", voice:"passive", slotId:10, formText:"تُكْتَبِينَ" },
  { verbId:"v1", tense:"mudari", voice:"passive", slotId:11, formText:"تُكْتَبَانِ" },
  { verbId:"v1", tense:"mudari", voice:"passive", slotId:12, formText:"تُكْتَبْنَ" },
  { verbId:"v1", tense:"mudari", voice:"passive", slotId:13, formText:"أُكْتَبُ" },
  { verbId:"v1", tense:"mudari", voice:"passive", slotId:14, formText:"نُكْتَبُ" },
  // Imperative
  { verbId:"v1", tense:"amr", voice:"active", slotId:7,  formText:"اُكْتُبْ" },
  { verbId:"v1", tense:"amr", voice:"active", slotId:8,  formText:"اُكْتُبَا" },
  { verbId:"v1", tense:"amr", voice:"active", slotId:9,  formText:"اُكْتُبُوا" },
  { verbId:"v1", tense:"amr", voice:"active", slotId:10, formText:"اُكْتُبِي" },
  { verbId:"v1", tense:"amr", voice:"active", slotId:11, formText:"اُكْتُبَا" },
  { verbId:"v1", tense:"amr", voice:"active", slotId:12, formText:"اُكْتُبْنَ" },
];

function buildConjugations(
  id: string,
  past: { active: string[]; passive: string[] },
  present: { active: string[]; passive: string[] },
  imperative: string[]
): Conjugation[] {
  const slots = [1,2,3,4,5,6,7,8,9,10,11,12,13,14];
  const impSlots = [7,8,9,10,11,12];
  const r: Conjugation[] = [];
  for (let i = 0; i < 14; i++) {
    r.push({ verbId:id, tense:"madi",   voice:"active",  slotId:slots[i], formText:past.active[i] });
    r.push({ verbId:id, tense:"madi",   voice:"passive", slotId:slots[i], formText:past.passive[i] });
    r.push({ verbId:id, tense:"mudari", voice:"active",  slotId:slots[i], formText:present.active[i] });
    r.push({ verbId:id, tense:"mudari", voice:"passive", slotId:slots[i], formText:present.passive[i] });
  }
  for (let i = 0; i < 6; i++) {
    r.push({ verbId:id, tense:"amr", voice:"active", slotId:impSlots[i], formText:imperative[i] });
  }
  return r;
}

const FORM2 = buildConjugations("f2t",
  { active:  ["عَلَّمَ","عَلَّمَا","عَلَّمُوا","عَلَّمَتْ","عَلَّمَتَا","عَلَّمْنَ","عَلَّمْتَ","عَلَّمْتُمَا","عَلَّمْتُمْ","عَلَّمْتِ","عَلَّمْتُمَا","عَلَّمْتُنَّ","عَلَّمْتُ","عَلَّمْنَا"],
    passive: ["عُلِّمَ","عُلِّمَا","عُلِّمُوا","عُلِّمَتْ","عُلِّمَتَا","عُلِّمْنَ","عُلِّمْتَ","عُلِّمْتُمَا","عُلِّمْتُمْ","عُلِّمْتِ","عُلِّمْتُمَا","عُلِّمْتُنَّ","عُلِّمْتُ","عُلِّمْنَا"] },
  { active:  ["يُعَلِّمُ","يُعَلِّمَانِ","يُعَلِّمُونَ","تُعَلِّمُ","تُعَلِّمَانِ","يُعَلِّمْنَ","تُعَلِّمُ","تُعَلِّمَانِ","تُعَلِّمُونَ","تُعَلِّمِينَ","تُعَلِّمَانِ","تُعَلِّمْنَ","أُعَلِّمُ","نُعَلِّمُ"],
    passive: ["يُعَلَّمُ","يُعَلَّمَانِ","يُعَلَّمُونَ","تُعَلَّمُ","تُعَلَّمَانِ","يُعَلَّمْنَ","تُعَلَّمُ","تُعَلَّمَانِ","تُعَلَّمُونَ","تُعَلَّمِينَ","تُعَلَّمَانِ","تُعَلَّمْنَ","أُعَلَّمُ","نُعَلَّمُ"] },
  ["عَلِّمْ","عَلِّمَا","عَلِّمُوا","عَلِّمِي","عَلِّمَا","عَلِّمْنَ"]
);

const FORM3 = buildConjugations("f3t",
  { active:  ["قَاتَلَ","قَاتَلَا","قَاتَلُوا","قَاتَلَتْ","قَاتَلَتَا","قَاتَلْنَ","قَاتَلْتَ","قَاتَلْتُمَا","قَاتَلْتُمْ","قَاتَلْتِ","قَاتَلْتُمَا","قَاتَلْتُنَّ","قَاتَلْتُ","قَاتَلْنَا"],
    passive: ["قُوتِلَ","قُوتِلَا","قُوتِلُوا","قُوتِلَتْ","قُوتِلَتَا","قُوتِلْنَ","قُوتِلْتَ","قُوتِلْتُمَا","قُوتِلْتُمْ","قُوتِلْتِ","قُوتِلْتُمَا","قُوتِلْتُنَّ","قُوتِلْتُ","قُوتِلْنَا"] },
  { active:  ["يُقَاتِلُ","يُقَاتِلَانِ","يُقَاتِلُونَ","تُقَاتِلُ","تُقَاتِلَانِ","يُقَاتِلْنَ","تُقَاتِلُ","تُقَاتِلَانِ","تُقَاتِلُونَ","تُقَاتِلِينَ","تُقَاتِلَانِ","تُقَاتِلْنَ","أُقَاتِلُ","نُقَاتِلُ"],
    passive: ["يُقَاتَلُ","يُقَاتَلَانِ","يُقَاتَلُونَ","تُقَاتَلُ","تُقَاتَلَانِ","يُقَاتَلْنَ","تُقَاتَلُ","تُقَاتَلَانِ","تُقَاتَلُونَ","تُقَاتَلِينَ","تُقَاتَلَانِ","تُقَاتَلْنَ","أُقَاتَلُ","نُقَاتَلُ"] },
  ["قَاتِلْ","قَاتِلَا","قَاتِلُوا","قَاتِلِي","قَاتِلَا","قَاتِلْنَ"]
);

const FORM4 = buildConjugations("f4t",
  { active:  ["أَخْرَجَ","أَخْرَجَا","أَخْرَجُوا","أَخْرَجَتْ","أَخْرَجَتَا","أَخْرَجْنَ","أَخْرَجْتَ","أَخْرَجْتُمَا","أَخْرَجْتُمْ","أَخْرَجْتِ","أَخْرَجْتُمَا","أَخْرَجْتُنَّ","أَخْرَجْتُ","أَخْرَجْنَا"],
    passive: ["أُخْرِجَ","أُخْرِجَا","أُخْرِجُوا","أُخْرِجَتْ","أُخْرِجَتَا","أُخْرِجْنَ","أُخْرِجْتَ","أُخْرِجْتُمَا","أُخْرِجْتُمْ","أُخْرِجْتِ","أُخْرِجْتُمَا","أُخْرِجْتُنَّ","أُخْرِجْتُ","أُخْرِجْنَا"] },
  { active:  ["يُخْرِجُ","يُخْرِجَانِ","يُخْرِجُونَ","تُخْرِجُ","تُخْرِجَانِ","يُخْرِجْنَ","تُخْرِجُ","تُخْرِجَانِ","تُخْرِجُونَ","تُخْرِجِينَ","تُخْرِجَانِ","تُخْرِجْنَ","أُخْرِجُ","نُخْرِجُ"],
    passive: ["يُخْرَجُ","يُخْرَجَانِ","يُخْرَجُونَ","تُخْرَجُ","تُخْرَجَانِ","يُخْرَجْنَ","تُخْرَجُ","تُخْرَجَانِ","تُخْرَجُونَ","تُخْرَجِينَ","تُخْرَجَانِ","تُخْرَجْنَ","أُخْرَجُ","نُخْرَجُ"] },
  ["أَخْرِجْ","أَخْرِجَا","أَخْرِجُوا","أَخْرِجِي","أَخْرِجَا","أَخْرِجْنَ"]
);

const FORM5 = buildConjugations("f5t",
  { active:  ["تَعَلَّمَ","تَعَلَّمَا","تَعَلَّمُوا","تَعَلَّمَتْ","تَعَلَّمَتَا","تَعَلَّمْنَ","تَعَلَّمْتَ","تَعَلَّمْتُمَا","تَعَلَّمْتُمْ","تَعَلَّمْتِ","تَعَلَّمْتُمَا","تَعَلَّمْتُنَّ","تَعَلَّمْتُ","تَعَلَّمْنَا"],
    passive: ["تُعُلِّمَ","تُعُلِّمَا","تُعُلِّمُوا","تُعُلِّمَتْ","تُعُلِّمَتَا","تُعُلِّمْنَ","تُعُلِّمْتَ","تُعُلِّمْتُمَا","تُعُلِّمْتُمْ","تُعُلِّمْتِ","تُعُلِّمْتُمَا","تُعُلِّمْتُنَّ","تُعُلِّمْتُ","تُعُلِّمْنَا"] },
  { active:  ["يَتَعَلَّمُ","يَتَعَلَّمَانِ","يَتَعَلَّمُونَ","تَتَعَلَّمُ","تَتَعَلَّمَانِ","يَتَعَلَّمْنَ","تَتَعَلَّمُ","تَتَعَلَّمَانِ","تَتَعَلَّمُونَ","تَتَعَلَّمِينَ","تَتَعَلَّمَانِ","تَتَعَلَّمْنَ","أَتَعَلَّمُ","نَتَعَلَّمُ"],
    passive: ["يُتَعَلَّمُ","يُتَعَلَّمَانِ","يُتَعَلَّمُونَ","تُتَعَلَّمُ","تُتَعَلَّمَانِ","يُتَعَلَّمْنَ","تُتَعَلَّمُ","تُتَعَلَّمَانِ","تُتَعَلَّمُونَ","تُتَعَلَّمِينَ","تُتَعَلَّمَانِ","تُتَعَلَّمْنَ","أُتَعَلَّمُ","نُتَعَلَّمُ"] },
  ["تَعَلَّمْ","تَعَلَّمَا","تَعَلَّمُوا","تَعَلَّمِي","تَعَلَّمَا","تَعَلَّمْنَ"]
);

const FORM6 = buildConjugations("f6t",
  { active:  ["تَبَاعَدَ","تَبَاعَدَا","تَبَاعَدُوا","تَبَاعَدَتْ","تَبَاعَدَتَا","تَبَاعَدْنَ","تَبَاعَدْتَ","تَبَاعَدْتُمَا","تَبَاعَدْتُمْ","تَبَاعَدْتِ","تَبَاعَدْتُمَا","تَبَاعَدْتُنَّ","تَبَاعَدْتُ","تَبَاعَدْنَا"],
    passive: ["تُبُوعِدَ","تُبُوعِدَا","تُبُوعِدُوا","تُبُوعِدَتْ","تُبُوعِدَتَا","تُبُوعِدْنَ","تُبُوعِدْتَ","تُبُوعِدْتُمَا","تُبُوعِدْتُمْ","تُبُوعِدْتِ","تُبُوعِدْتُمَا","تُبُوعِدْتُنَّ","تُبُوعِدْتُ","تُبُوعِدْنَا"] },
  { active:  ["يَتَبَاعَدُ","يَتَبَاعَدَانِ","يَتَبَاعَدُونَ","تَتَبَاعَدُ","تَتَبَاعَدَانِ","يَتَبَاعَدْنَ","تَتَبَاعَدُ","تَتَبَاعَدَانِ","تَتَبَاعَدُونَ","تَتَبَاعَدِينَ","تَتَبَاعَدَانِ","تَتَبَاعَدْنَ","أَتَبَاعَدُ","نَتَبَاعَدُ"],
    passive: ["يُتَبَاعَدُ","يُتَبَاعَدَانِ","يُتَبَاعَدُونَ","تُتَبَاعَدُ","تُتَبَاعَدَانِ","يُتَبَاعَدْنَ","تُتَبَاعَدُ","تُتَبَاعَدَانِ","تُتَبَاعَدُونَ","تُتَبَاعَدِينَ","تُتَبَاعَدَانِ","تُتَبَاعَدْنَ","أُتَبَاعَدُ","نُتَبَاعَدُ"] },
  ["تَبَاعَدْ","تَبَاعَدَا","تَبَاعَدُوا","تَبَاعَدِي","تَبَاعَدَا","تَبَاعَدْنَ"]
);

const FORM7_active = ["اِنْكَسَرَ","اِنْكَسَرَا","اِنْكَسَرُوا","اِنْكَسَرَتْ","اِنْكَسَرَتَا","اِنْكَسَرْنَ","اِنْكَسَرْتَ","اِنْكَسَرْتُمَا","اِنْكَسَرْتُمْ","اِنْكَسَرْتِ","اِنْكَسَرْتُمَا","اِنْكَسَرْتُنَّ","اِنْكَسَرْتُ","اِنْكَسَرْنَا"];
const FORM7_pres   = ["يَنْكَسِرُ","يَنْكَسِرَانِ","يَنْكَسِرُونَ","تَنْكَسِرُ","تَنْكَسِرَانِ","يَنْكَسِرْنَ","تَنْكَسِرُ","تَنْكَسِرَانِ","تَنْكَسِرُونَ","تَنْكَسِرِينَ","تَنْكَسِرَانِ","تَنْكَسِرْنَ","أَنْكَسِرُ","نَنْكَسِرُ"];
const FORM7 = buildConjugations("f7t",
  { active: FORM7_active, passive: FORM7_active },
  { active: FORM7_pres,   passive: FORM7_pres },
  ["اِنْكَسِرْ","اِنْكَسِرَا","اِنْكَسِرُوا","اِنْكَسِرِي","اِنْكَسِرَا","اِنْكَسِرْنَ"]
);

const FORM8 = buildConjugations("f8t",
  { active:  ["اِجْتَمَعَ","اِجْتَمَعَا","اِجْتَمَعُوا","اِجْتَمَعَتْ","اِجْتَمَعَتَا","اِجْتَمَعْنَ","اِجْتَمَعْتَ","اِجْتَمَعْتُمَا","اِجْتَمَعْتُمْ","اِجْتَمَعْتِ","اِجْتَمَعْتُمَا","اِجْتَمَعْتُنَّ","اِجْتَمَعْتُ","اِجْتَمَعْنَا"],
    passive: ["اُجْتُمِعَ","اُجْتُمِعَا","اُجْتُمِعُوا","اُجْتُمِعَتْ","اُجْتُمِعَتَا","اُجْتُمِعْنَ","اُجْتُمِعْتَ","اُجْتُمِعْتُمَا","اُجْتُمِعْتُمْ","اُجْتُمِعْتِ","اُجْتُمِعْتُمَا","اُجْتُمِعْتُنَّ","اُجْتُمِعْتُ","اُجْتُمِعْنَا"] },
  { active:  ["يَجْتَمِعُ","يَجْتَمِعَانِ","يَجْتَمِعُونَ","تَجْتَمِعُ","تَجْتَمِعَانِ","يَجْتَمِعْنَ","تَجْتَمِعُ","تَجْتَمِعَانِ","تَجْتَمِعُونَ","تَجْتَمِعِينَ","تَجْتَمِعَانِ","تَجْتَمِعْنَ","أَجْتَمِعُ","نَجْتَمِعُ"],
    passive: ["يُجْتَمَعُ","يُجْتَمَعَانِ","يُجْتَمَعُونَ","تُجْتَمَعُ","تُجْتَمَعَانِ","يُجْتَمَعْنَ","تُجْتَمَعُ","تُجْتَمَعَانِ","تُجْتَمَعُونَ","تُجْتَمَعِينَ","تُجْتَمَعَانِ","تُجْتَمَعْنَ","أُجْتَمَعُ","نُجْتَمَعُ"] },
  ["اِجْتَمِعْ","اِجْتَمِعَا","اِجْتَمِعُوا","اِجْتَمِعِي","اِجْتَمِعَا","اِجْتَمِعْنَ"]
);

const FORM10 = buildConjugations("f10t",
  { active:  ["اِسْتَغْفَرَ","اِسْتَغْفَرَا","اِسْتَغْفَرُوا","اِسْتَغْفَرَتْ","اِسْتَغْفَرَتَا","اِسْتَغْفَرْنَ","اِسْتَغْفَرْتَ","اِسْتَغْفَرْتُمَا","اِسْتَغْفَرْتُمْ","اِسْتَغْفَرْتِ","اِسْتَغْفَرْتُمَا","اِسْتَغْفَرْتُنَّ","اِسْتَغْفَرْتُ","اِسْتَغْفَرْنَا"],
    passive: ["اُسْتُغْفِرَ","اُسْتُغْفِرَا","اُسْتُغْفِرُوا","اُسْتُغْفِرَتْ","اُسْتُغْفِرَتَا","اُسْتُغْفِرْنَ","اُسْتُغْفِرْتَ","اُسْتُغْفِرْتُمَا","اُسْتُغْفِرْتُمْ","اُسْتُغْفِرْتِ","اُسْتُغْفِرْتُمَا","اُسْتُغْفِرْتُنَّ","اُسْتُغْفِرْتُ","اُسْتُغْفِرْنَا"] },
  { active:  ["يَسْتَغْفِرُ","يَسْتَغْفِرَانِ","يَسْتَغْفِرُونَ","تَسْتَغْفِرُ","تَسْتَغْفِرَانِ","يَسْتَغْفِرْنَ","تَسْتَغْفِرُ","تَسْتَغْفِرَانِ","تَسْتَغْفِرُونَ","تَسْتَغْفِرِينَ","تَسْتَغْفِرَانِ","تَسْتَغْفِرْنَ","أَسْتَغْفِرُ","نَسْتَغْفِرُ"],
    passive: ["يُسْتَغْفَرُ","يُسْتَغْفَرَانِ","يُسْتَغْفَرُونَ","تُسْتَغْفَرُ","تُسْتَغْفَرَانِ","يُسْتَغْفَرْنَ","تُسْتَغْفَرُ","تُسْتَغْفَرَانِ","تُسْتَغْفَرُونَ","تُسْتَغْفَرِينَ","تُسْتَغْفَرَانِ","تُسْتَغْفَرْنَ","أُسْتَغْفَرُ","نُسْتَغْفَرُ"] },
  ["اِسْتَغْفِرْ","اِسْتَغْفِرَا","اِسْتَغْفِرُوا","اِسْتَغْفِرِي","اِسْتَغْفِرَا","اِسْتَغْفِرْنَ"]
);

export const ALL_FORM_CONJUGATIONS: Conjugation[] = [
  ...FORM2, ...FORM3, ...FORM4, ...FORM5, ...FORM6, ...FORM7, ...FORM8, ...FORM10,
];

// ─── Conjugation Engine ──────────────────────────────────────────────────────

function stripDiacritics(text: string): string {
  return text.replace(/[ً-ٰٟ]/g, "");
}

function extractRootLetters(verb: Verb): string[] {
  return verb.root.split("-").map(l => l.trim());
}

function isDiacritic(char: string): boolean {
  const code = char.charCodeAt(0);
  return (code >= 0x064b && code <= 0x065f) || code === 0x0670;
}

function getNextLetterWithDiacritics(text: string): string {
  if (!text.length) return "";
  let i = 1;
  while (i < text.length && isDiacritic(text[i])) i++;
  return text.substring(0, i);
}

function getOriginalChars(original: string, strippedCount: number): string {
  let count = 0;
  let i = 0;
  while (i < original.length && count < strippedCount) {
    if (!isDiacritic(original[i])) count++;
    i++;
    while (i < original.length && isDiacritic(original[i])) i++;
  }
  return original.substring(0, i);
}

interface FormSegment { text: string; type: "root" | "pattern"; }

function decomposeForm(formText: string, verb: Verb): FormSegment[] {
  const rootLetters = extractRootLetters(verb);
  const stripped = stripDiacritics(formText);
  const segments: FormSegment[] = [];
  let remaining = formText;
  let strippedRemaining = stripped;
  let rootIdx = 0;
  while (remaining.length > 0) {
    if (rootIdx < rootLetters.length) {
      const rootLetter = rootLetters[rootIdx];
      const pos = strippedRemaining.indexOf(rootLetter);
      if (pos > 0) {
        const patternChars = getOriginalChars(remaining, pos);
        segments.push({ text: patternChars, type: "pattern" });
        remaining = remaining.substring(patternChars.length);
        strippedRemaining = stripDiacritics(remaining);
      }
      if (pos >= 0) {
        const rootChars = getNextLetterWithDiacritics(remaining);
        segments.push({ text: rootChars, type: "root" });
        remaining = remaining.substring(rootChars.length);
        strippedRemaining = stripDiacritics(remaining);
        rootIdx++;
      } else {
        segments.push({ text: remaining, type: "pattern" });
        remaining = "";
      }
    } else {
      segments.push({ text: remaining, type: "pattern" });
      remaining = "";
    }
  }
  return segments;
}

function getTemplateData(form: number): { templateVerb: Verb; conjugations: Conjugation[] } | null {
  if (form === 1) return { templateVerb: FORM_TEMPLATE_VERBS[1], conjugations: KATABA_CONJUGATIONS };
  const templateVerb = FORM_TEMPLATE_VERBS[form];
  if (!templateVerb) return null;
  return { templateVerb, conjugations: ALL_FORM_CONJUGATIONS.filter(c => c.verbId === templateVerb.id) };
}

export function generateConjugationsForVerb(verb: Verb, tense: Tense, voice: Voice): Conjugation[] {
  const data = getTemplateData(verb.form);
  if (!data) return [];
  const { templateVerb, conjugations } = data;
  const templates = conjugations.filter(c => c.tense === tense && c.voice === voice);
  if (verb.id === templateVerb.id) return templates;
  const targetRoot = extractRootLetters(verb);
  if (targetRoot.length !== 3) return [];
  return templates.map(template => {
    const segments = decomposeForm(template.formText, templateVerb);
    let rootLetterIndex = 0;
    const newText = segments.map(segment => {
      if (segment.type !== "root") return segment.text;
      const targetLetter = targetRoot[rootLetterIndex++];
      if (!targetLetter) return segment.text;
      return targetLetter + segment.text.slice(1);
    }).join("");
    return { ...template, verbId: verb.id, formText: newText };
  });
}
