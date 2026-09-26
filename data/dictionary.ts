// ── Types ─────────────────────────────────────────────────────────────────────

export interface DictEntry {
  ar: string;
  translit: string;
  en: string;
}

export interface AlphabetLetter {
  ar: string;
  translit: string;
  name: string;
  forms: string;
  nc?: boolean; // non-connecting
}

export interface Harakah {
  mark: string;
  sound: string;
}

export interface BuiltLetter extends AlphabetLetter {
  harakah: Harakah | null;
}

// ── Vowel marks ───────────────────────────────────────────────────────────────

export const HARAKAT: Harakah[] = [
  { mark: "َ", sound: "fatḥah (a)" },
  { mark: "ِ", sound: "kasrah (i)" },
  { mark: "ُ", sound: "ḍammah (u)" },
  { mark: "ْ", sound: "sukūn (—)" },
  { mark: "ّ", sound: "shaddah (double)" },
  { mark: "ً", sound: "tanwīn fatḥ (an)" },
  { mark: "ٍ", sound: "tanwīn kasr (in)" },
  { mark: "ٌ", sound: "tanwīn ḍamm (un)" },
];

// ── Alphabet ──────────────────────────────────────────────────────────────────

export const ALPHABET: AlphabetLetter[] = [
  { ar: "ا", translit: "ā / a", name: "alif",           forms: "ا ـا ـا",   nc: true  },
  { ar: "ب", translit: "b",     name: "bāʾ",            forms: "بـ ـبـ ـب"           },
  { ar: "ت", translit: "t",     name: "tāʾ",            forms: "تـ ـتـ ـت"           },
  { ar: "ث", translit: "th",    name: "thāʾ",           forms: "ثـ ـثـ ـث"           },
  { ar: "ج", translit: "j",     name: "jīm",            forms: "جـ ـجـ ـج"           },
  { ar: "ح", translit: "ḥ",     name: "ḥāʾ",            forms: "حـ ـحـ ـح"           },
  { ar: "خ", translit: "kh",    name: "khāʾ",           forms: "خـ ـخـ ـخ"           },
  { ar: "د", translit: "d",     name: "dāl",            forms: "د ـد ـد",    nc: true  },
  { ar: "ذ", translit: "dh",    name: "dhāl",           forms: "ذ ـذ ـذ",    nc: true  },
  { ar: "ر", translit: "r",     name: "rāʾ",            forms: "ر ـر ـر",    nc: true  },
  { ar: "ز", translit: "z",     name: "zāy",            forms: "ز ـز ـز",    nc: true  },
  { ar: "س", translit: "s",     name: "sīn",            forms: "سـ ـسـ ـس"           },
  { ar: "ش", translit: "sh",    name: "shīn",           forms: "شـ ـشـ ـش"           },
  { ar: "ص", translit: "ṣ",     name: "ṣād",            forms: "صـ ـصـ ـص"           },
  { ar: "ض", translit: "ḍ",     name: "ḍād",            forms: "ضـ ـضـ ـض"           },
  { ar: "ط", translit: "ṭ",     name: "ṭāʾ",            forms: "طـ ـطـ ـط"           },
  { ar: "ظ", translit: "ẓ",     name: "ẓāʾ",            forms: "ظـ ـظـ ـظ"           },
  { ar: "ع", translit: "ʿ",     name: "ʿayn",           forms: "عـ ـعـ ـع"           },
  { ar: "غ", translit: "gh",    name: "ghayn",          forms: "غـ ـغـ ـغ"           },
  { ar: "ف", translit: "f",     name: "fāʾ",            forms: "فـ ـفـ ـف"           },
  { ar: "ق", translit: "q",     name: "qāf",            forms: "قـ ـقـ ـق"           },
  { ar: "ك", translit: "k",     name: "kāf",            forms: "كـ ـكـ ـك"           },
  { ar: "ل", translit: "l",     name: "lām",            forms: "لـ ـلـ ـل"           },
  { ar: "م", translit: "m",     name: "mīm",            forms: "مـ ـمـ ـم"           },
  { ar: "ن", translit: "n",     name: "nūn",            forms: "نـ ـنـ ـن"           },
  { ar: "ه", translit: "h",     name: "hāʾ",            forms: "هـ ـهـ ـه"           },
  { ar: "و", translit: "w / ū", name: "wāw",            forms: "و ـو ـو",    nc: true  },
  { ar: "ي", translit: "y / ī", name: "yāʾ",            forms: "يـ ـيـ ـي"           },
  { ar: "ى", translit: "ā",     name: "alif maqṣūrah",  forms: "— — ـى",    nc: true  },
];

// Physical Arabic keyboard rows
export const KB_ROWS: string[][] = [
  ["ض","ص","ث","ق","ف","غ","ع","ه","خ","ح"],
  ["ش","س","ي","ب","ل","ا","ت","ن","م","ك"],
  ["ج","ط","ظ","د","ذ","ر","ز","و","ى"],
];

// ── Dictionary (general vocab + Quranic words) ────────────────────────────────

export const DICTIONARY: DictEntry[] = [
  {ar:"أَنَا",translit:"anā",en:"I"},{ar:"أَنْتَ",translit:"anta",en:"you (to a man)"},{ar:"أَنْتِ",translit:"anti",en:"you (to a woman)"},
  {ar:"هُوَ",translit:"huwa",en:"he / it"},{ar:"هِيَ",translit:"hiya",en:"she / it"},{ar:"نَحْنُ",translit:"naḥnu",en:"we"},
  {ar:"هُمْ",translit:"hum",en:"they (m.)"},{ar:"هُنَّ",translit:"hunna",en:"they (f.)"},
  {ar:"هَذَا",translit:"hādhā",en:"this (m.)"},{ar:"هَذِهِ",translit:"hādhihi",en:"this (f.)"},
  {ar:"ذَلِكَ",translit:"dhālika",en:"that (m.)"},{ar:"تِلْكَ",translit:"tilka",en:"that (f.)"},
  {ar:"كِتَاب",translit:"kitāb",en:"book"},{ar:"بَيْت",translit:"bayt",en:"house"},{ar:"سَيَّارَة",translit:"sayyārah",en:"car"},
  {ar:"مَدْرَسَة",translit:"madrasah",en:"school"},{ar:"قَلَم",translit:"qalam",en:"pen"},{ar:"شَمْس",translit:"shams",en:"sun"},
  {ar:"قَمَر",translit:"qamar",en:"moon"},{ar:"بَاب",translit:"bāb",en:"door"},{ar:"طَاوِلَة",translit:"ṭāwilah",en:"table"},
  {ar:"رَجُل",translit:"rajul",en:"man"},{ar:"مَدِينَة",translit:"madīnah",en:"city"},{ar:"وَلَد",translit:"walad",en:"boy"},
  {ar:"بِنْت",translit:"bint",en:"girl"},{ar:"مَسْجِد",translit:"masjid",en:"mosque"},
  {ar:"كَبِير",translit:"kabīr",en:"big"},{ar:"صَغِير",translit:"ṣaghīr",en:"small"},{ar:"جَمِيل",translit:"jamīl",en:"beautiful"},
  {ar:"جَدِيد",translit:"jadīd",en:"new"},{ar:"قَدِيم",translit:"qadīm",en:"old"},
  {ar:"فِي",translit:"fī",en:"in"},{ar:"عَلَى",translit:"ʿalā",en:"on"},{ar:"مِنْ",translit:"min",en:"from"},
  {ar:"إِلَى",translit:"ilā",en:"to"},{ar:"مَعَ",translit:"maʿa",en:"with"},{ar:"تَحْتَ",translit:"taḥta",en:"under"},
  {ar:"فَوْقَ",translit:"fawqa",en:"above"},{ar:"بَيْنَ",translit:"bayna",en:"between"},
  {ar:"كَتَبَ",translit:"kataba",en:"he wrote"},{ar:"دَرَسَ",translit:"darasa",en:"he studied"},{ar:"فَهِمَ",translit:"fahima",en:"he understood"},
  {ar:"ذَهَبَ",translit:"dhahaba",en:"he went"},{ar:"شَرِبَ",translit:"shariba",en:"he drank"},
  {ar:"أَكَلَ",translit:"akala",en:"he ate"},{ar:"قَالَ",translit:"qāla",en:"he said"},
  {ar:"لَا",translit:"lā",en:"no / not"},{ar:"هَلْ",translit:"hal",en:"yes/no question marker"},
  {ar:"مَنْ",translit:"man",en:"who"},{ar:"أَيْنَ",translit:"ayna",en:"where"},
  {ar:"مَتَى",translit:"matā",en:"when"},{ar:"كَيْفَ",translit:"kayfa",en:"how"},
  {ar:"اللَّه",translit:"Allāh",en:"God"},{ar:"رَبّ",translit:"rabb",en:"Lord"},{ar:"رَحْمَة",translit:"raḥmah",en:"mercy"},
  {ar:"رَسُول",translit:"rasūl",en:"messenger"},{ar:"نَبِيّ",translit:"nabiyy",en:"prophet"},
  {ar:"جَنَّة",translit:"jannah",en:"Paradise"},{ar:"دُنْيَا",translit:"dunyā",en:"this worldly life"},
  {ar:"آخِرَة",translit:"ākhirah",en:"the Hereafter"},
  {ar:"وَاحِد",translit:"wāḥid",en:"one"},{ar:"اثْنَان",translit:"ithnān",en:"two"},{ar:"ثَلَاثَة",translit:"thalāthah",en:"three"},
  {ar:"أَرْبَعَة",translit:"arbaʿah",en:"four"},{ar:"خَمْسَة",translit:"khamsah",en:"five"},
  {ar:"أَب",translit:"ab",en:"father"},{ar:"أُمّ",translit:"umm",en:"mother"},{ar:"أَخ",translit:"akh",en:"brother"},
  {ar:"أُخْت",translit:"ukht",en:"sister"},
  {ar:"أَحْمَر",translit:"aḥmar",en:"red"},{ar:"أَزْرَق",translit:"azraq",en:"blue"},{ar:"أَخْضَر",translit:"akhḍar",en:"green"},
  {ar:"وَ",translit:"wa",en:"and"},{ar:"إِنَّ",translit:"inna",en:"indeed / verily"},
  {ar:"الرَّحْمَن",translit:"ar-Raḥmān",en:"The Most Merciful"},{ar:"الرَّحِيم",translit:"ar-Raḥīm",en:"The Especially Merciful"},
  {ar:"الحَمْد",translit:"al-ḥamd",en:"praise"},{ar:"سُبْحَان",translit:"subḥān",en:"glory"},
  {ar:"عَظِيم",translit:"ʿaẓīm",en:"great / immense"},{ar:"عَلِيم",translit:"ʿalīm",en:"All-Knowing"},
  {ar:"حَكِيم",translit:"ḥakīm",en:"All-Wise"},{ar:"قَدِير",translit:"qadīr",en:"All-Powerful"},
  {ar:"غَفُور",translit:"ghafūr",en:"Oft-Forgiving"},{ar:"نُور",translit:"nūr",en:"light"},
  {ar:"يَوْم",translit:"yawm",en:"day"},{ar:"نَاس",translit:"nās",en:"people / mankind"},
  {ar:"أَرْض",translit:"arḍ",en:"earth / land"},{ar:"سَمَاء",translit:"samāʾ",en:"sky / heaven"},
  {ar:"قَلْب",translit:"qalb",en:"heart"},{ar:"نَفْس",translit:"nafs",en:"soul / self"},
  {ar:"عَبْد",translit:"ʿabd",en:"servant / worshipper"},{ar:"وَقْت",translit:"waqt",en:"time"},
  {ar:"صَلَاة",translit:"ṣalāh",en:"prayer"},{ar:"صِرَاط",translit:"ṣirāṭ",en:"path / road"},
  {ar:"حَقّ",translit:"ḥaqq",en:"truth / right"},{ar:"عَمَل",translit:"ʿamal",en:"deed / work"},
  {ar:"كَثِير",translit:"kathīr",en:"many / much"},{ar:"حَسَن",translit:"ḥasan",en:"good / fine"},
  {ar:"مُسْتَقِيم",translit:"mustaqīm",en:"straight / upright"},
  {ar:"قَبْل",translit:"qabl",en:"before"},{ar:"بَعْد",translit:"baʿd",en:"after"},
  {ar:"نَعَم",translit:"naʿam",en:"yes"},{ar:"اسْم",translit:"ism",en:"name"},
  {ar:"كَلِمَة",translit:"kalimah",en:"word"},{ar:"لُغَة",translit:"lughah",en:"language"},
  {ar:"مَاء",translit:"māʾ",en:"water"},{ar:"طَعَام",translit:"ṭaʿām",en:"food"},
  {ar:"صَدِيق",translit:"ṣadīq",en:"friend"},
];

// ── Quranic verb database (250 verb lemmas, by frequency) ─────────────────────

export const VERB_DB: DictEntry[] = [
  {ar:"قَالَ",translit:"ق-و-ل",en:"he said"},{ar:"كَانَ",translit:"ك-و-ن",en:"he was"},
  {ar:"ءَامَنَ",translit:"ا-م-ن",en:"he believed"},{ar:"عَلِمَ",translit:"ع-ل-م",en:"he knew"},
  {ar:"جَعَلَ",translit:"ج-ع-ل",en:"he made"},{ar:"كَفَرَ",translit:"ك-ف-ر",en:"he disbelieved"},
  {ar:"جَاءَ",translit:"ج-ي-ا",en:"he came"},{ar:"عَمِلَ",translit:"ع-م-ل",en:"he did / worked"},
  {ar:"رَأَى",translit:"ر-ا-ي",en:"he saw"},{ar:"شَاءَ",translit:"ش-ي-ا",en:"he willed"},
  {ar:"خَلَقَ",translit:"خ-ل-ق",en:"he created"},{ar:"أَنْزَلَ",translit:"ن-ز-ل",en:"he sent down"},
  {ar:"كَذَّبَ",translit:"ك-ذ-ب",en:"he denied / rejected"},{ar:"دَعَا",translit:"د-ع-و",en:"he called / prayed"},
  {ar:"هَدَى",translit:"ه-د-ي",en:"he guided"},{ar:"أَرَادَ",translit:"ر-و-د",en:"he intended / wanted"},
  {ar:"أَرْسَلَ",translit:"ر-س-ل",en:"he sent"},{ar:"أَخَذَ",translit:"ا-خ-ذ",en:"he took / seized"},
  {ar:"عَبَدَ",translit:"ع-ب-د",en:"he worshipped"},{ar:"ظَلَمَ",translit:"ظ-ل-م",en:"he wronged"},
  {ar:"سَأَلَ",translit:"س-ا-ل",en:"he asked"},{ar:"وَجَدَ",translit:"و-ج-د",en:"he found"},
  {ar:"فَعَلَ",translit:"ف-ع-ل",en:"he did"},{ar:"ذَكَرَ",translit:"ذ-ك-ر",en:"he remembered / mentioned"},
  {ar:"خَافَ",translit:"خ-و-ف",en:"he feared"},{ar:"قَتَلَ",translit:"ق-ت-ل",en:"he killed"},
  {ar:"رَجَعَ",translit:"ر-ج-ع",en:"he returned"},{ar:"سَمِعَ",translit:"س-م-ع",en:"he heard"},
  {ar:"أَمَرَ",translit:"ا-م-ر",en:"he commanded"},{ar:"دَخَلَ",translit:"د-خ-ل",en:"he entered"},
  {ar:"أَطَاعَ",translit:"ط-و-ع",en:"he obeyed"},{ar:"وَعَدَ",translit:"و-ع-د",en:"he promised"},
  {ar:"أَنْفَقَ",translit:"ن-ف-ق",en:"he spent"},{ar:"غَفَرَ",translit:"غ-ف-ر",en:"he forgave"},
  {ar:"تَابَ",translit:"ت-و-ب",en:"he repented"},{ar:"كَسَبَ",translit:"ك-س-ب",en:"he earned"},
  {ar:"تَلَا",translit:"ت-ل-و",en:"he recited"},{ar:"رَزَقَ",translit:"ر-ز-ق",en:"he provided"},
  {ar:"نَصَرَ",translit:"ن-ص-ر",en:"he helped"},{ar:"صَبَرَ",translit:"ص-ب-ر",en:"he was patient"},
  {ar:"ضَرَبَ",translit:"ض-ر-ب",en:"he struck / set forth"},{ar:"أَقَامَ",translit:"ق-و-م",en:"he established"},
  {ar:"خَرَجَ",translit:"خ-ر-ج",en:"he went out / left"},{ar:"ضَلَّ",translit:"ض-ل-ل",en:"he went astray"},
  {ar:"بَعَثَ",translit:"ب-ع-ث",en:"he raised / sent"},{ar:"أَهْلَكَ",translit:"ه-ل-ك",en:"he destroyed"},
  {ar:"زَادَ",translit:"ز-ي-د",en:"he increased"},{ar:"كَتَبَ",translit:"ك-ت-ب",en:"he wrote"},
  {ar:"ظَنَّ",translit:"ظ-ن-ن",en:"he thought"},{ar:"شَكَرَ",translit:"ش-ك-ر",en:"he was grateful"},
  {ar:"حَكَمَ",translit:"ح-ك-م",en:"he judged"},{ar:"شَهِدَ",translit:"ش-ه-د",en:"he testified"},
  {ar:"سَبَّحَ",translit:"س-ب-ح",en:"he glorified"},{ar:"حَمَلَ",translit:"ح-م-ل",en:"he carried"},
  {ar:"عَذَّبَ",translit:"ع-ذ-ب",en:"he punished"},{ar:"عَلَّمَ",translit:"ع-ل-م",en:"he taught"},
  {ar:"بَلَغَ",translit:"ب-ل-غ",en:"he reached"},{ar:"تَرَكَ",translit:"ت-ر-ك",en:"he left"},
  {ar:"حَرَّمَ",translit:"ح-ر-م",en:"he forbade"},{ar:"مَاتَ",translit:"م-و-ت",en:"he died"},
  {ar:"غَضِبَ",translit:"غ-ض-ب",en:"he was angry"},{ar:"جَمَعَ",translit:"ج-م-ع",en:"he gathered"},
  {ar:"رَفَعَ",translit:"ر-ف-ع",en:"he raised"},{ar:"أَسْلَمَ",translit:"س-ل-م",en:"he submitted"},
  {ar:"وَهَبَ",translit:"و-ه-ب",en:"he granted / bestowed"},{ar:"أَحْسَنَ",translit:"ح-س-ن",en:"he did good"},
  {ar:"كَتَمَ",translit:"ك-ت-م",en:"he concealed"},{ar:"نَزَلَ",translit:"ن-ز-ل",en:"he descended"},
  {ar:"وَسِعَ",translit:"و-س-ع",en:"he encompassed"},{ar:"فَتَحَ",translit:"ف-ت-ح",en:"he opened / gave victory"},
  {ar:"فَرِحَ",translit:"ف-ر-ح",en:"he rejoiced"},{ar:"قَرَأَ",translit:"ق-ر-ا",en:"he read / recited"},
  {ar:"سَجَدَ",translit:"س-ج-د",en:"he prostrated"},{ar:"قَامَ",translit:"ق-و-م",en:"he stood up"},
  {ar:"كَفَى",translit:"ك-ف-ي",en:"he was sufficient"},{ar:"دَرَسَ",translit:"د-ر-س",en:"he studied"},
  {ar:"سَكَنَ",translit:"س-ك-ن",en:"he dwelled"},{ar:"شَرِبَ",translit:"ش-ر-ب",en:"he drank"},
  {ar:"صَدَقَ",translit:"ص-د-ق",en:"he was truthful"},{ar:"ذَهَبَ",translit:"ذ-ه-ب",en:"he went"},
  {ar:"عَرَفَ",translit:"ع-ر-ف",en:"he knew / recognized"},{ar:"رَكَعَ",translit:"ر-ك-ع",en:"he bowed"},
  {ar:"سَارَ",translit:"س-ي-ر",en:"he traveled"},{ar:"أَبَى",translit:"ا-ب-ي",en:"he refused"},
  {ar:"حَفِظَ",translit:"ح-ف-ظ",en:"he guarded / protected"},{ar:"نَسِيَ",translit:"ن-س-ي",en:"he forgot"},
  {ar:"عَادَ",translit:"ع-و-د",en:"he returned"},{ar:"خَشِيَ",translit:"خ-ش-ي",en:"he feared"},
  {ar:"أَفْلَحَ",translit:"ف-ل-ح",en:"he succeeded"},{ar:"زَكَّى",translit:"ز-ك-و",en:"he purified"},
  {ar:"أَنْجَى",translit:"ن-ج-و",en:"he saved"},{ar:"بَنَى",translit:"ب-ن-ي",en:"he built"},
  {ar:"قَدَرَ",translit:"ق-د-ر",en:"he had power"},{ar:"عَصَى",translit:"ع-ص-ي",en:"he disobeyed"},
  {ar:"عَفَا",translit:"ع-ف-و",en:"he pardoned"},{ar:"هَاجَرَ",translit:"ه-ج-ر",en:"he emigrated"},
  {ar:"وَقَى",translit:"و-ق-ي",en:"he protected"},{ar:"خَسِرَ",translit:"خ-س-ر",en:"he lost"},
  {ar:"فَسَقَ",translit:"ف-س-ق",en:"he disobeyed defiantly"},{ar:"فَطَرَ",translit:"ف-ط-ر",en:"he created"},
  {ar:"نَبَذَ",translit:"ن-ب-ذ",en:"he threw / cast"},{ar:"غَلَبَ",translit:"غ-ل-ب",en:"he overcame"},
  {ar:"مَكَرَ",translit:"م-ك-ر",en:"he plotted"},{ar:"أَذِنَ",translit:"ا-ذ-ن",en:"he permitted"},
  {ar:"بَدَأَ",translit:"ب-د-ا",en:"he began"},{ar:"جَهَرَ",translit:"ج-ه-ر",en:"he spoke loudly"},
  {ar:"خَتَمَ",translit:"خ-ت-م",en:"he sealed"},{ar:"دَفَعَ",translit:"د-ف-ع",en:"he repelled"},
  {ar:"رَجَمَ",translit:"ر-ج-م",en:"he stoned"},{ar:"رَكِبَ",translit:"ر-ك-ب",en:"he rode"},
  {ar:"سَبَقَ",translit:"س-ب-ق",en:"he preceded"},{ar:"سَعَى",translit:"س-ع-ي",en:"he strove"},
  {ar:"طَبَعَ",translit:"ط-ب-ع",en:"he sealed"},{ar:"طَغَى",translit:"ط-غ-ي",en:"he transgressed"},
  {ar:"فَرَضَ",translit:"ف-ر-ض",en:"he ordained"},{ar:"قَعَدَ",translit:"ق-ع-د",en:"he sat"},
  {ar:"كَرِهَ",translit:"ك-ر-ه",en:"he disliked"},{ar:"لَعَنَ",translit:"ل-ع-ن",en:"he cursed"},
  {ar:"مَنَعَ",translit:"م-ن-ع",en:"he prevented"},{ar:"وَقَعَ",translit:"و-ق-ع",en:"he fell / occurred"},
  {ar:"هَمَّ",translit:"ه-م-م",en:"he intended / planned"},{ar:"زَاغَ",translit:"ز-ي-غ",en:"he deviated"},
  {ar:"ظَهَرَ",translit:"ظ-ه-ر",en:"he appeared"},{ar:"طَعِمَ",translit:"ط-ع-م",en:"he ate / tasted"},
  {ar:"نَفَعَ",translit:"ن-ف-ع",en:"he benefited"},{ar:"حَضَرَ",translit:"ح-ض-ر",en:"he attended"},
  {ar:"دَلَّ",translit:"د-ل-ل",en:"he indicated"},{ar:"ضَاقَ",translit:"ض-ي-ق",en:"he was straitened"},
  {ar:"عَدَلَ",translit:"ع-د-ل",en:"he was just"},{ar:"كَشَفَ",translit:"ك-ش-ف",en:"he uncovered"},
  {ar:"مَرَّ",translit:"م-ر-ر",en:"he passed"},{ar:"نَزَعَ",translit:"ن-ز-ع",en:"he withdrew"},
  {ar:"وَدَّ",translit:"و-د-د",en:"he loved / wished"},{ar:"بَسَطَ",translit:"ب-س-ط",en:"he extended"},
  {ar:"خَسَفَ",translit:"خ-س-ف",en:"he caused to swallow"},{ar:"صَرَفَ",translit:"ص-ر-ف",en:"he diverted"},
  {ar:"عَقَرَ",translit:"ع-ق-ر",en:"he hamstrung"},{ar:"فَصَلَ",translit:"ف-ص-ل",en:"he set out / judged"},
  {ar:"قَرَّبَ",translit:"ق-ر-ب",en:"he brought close"},{ar:"وَرِثَ",translit:"و-ر-ث",en:"he inherited"},
  {ar:"أَيَّدَ",translit:"ا-ي-د",en:"he supported"},{ar:"تَبِعَ",translit:"ت-ب-ع",en:"he followed"},
  {ar:"شَرَحَ",translit:"ش-ر-ح",en:"he expanded / opened"},{ar:"صَلَّى",translit:"ص-ل-و",en:"he prayed"},
  {ar:"طَهَّرَ",translit:"ط-ه-ر",en:"he purified"},{ar:"عَدَّ",translit:"ع-د-د",en:"he counted"},
  {ar:"غَلَّ",translit:"غ-ل-ل",en:"he defrauded"},{ar:"فَرَّطَ",translit:"ف-ر-ط",en:"he neglected"},
  {ar:"قَبَضَ",translit:"ق-ب-ض",en:"he withheld"},{ar:"كَفَّ",translit:"ك-ف-ف",en:"he restrained"},
  {ar:"نَهَى",translit:"ن-ه-ي",en:"he forbade"},{ar:"هَوَى",translit:"ه-و-ي",en:"he desired"},
  {ar:"بَثَّ",translit:"ب-ث-ث",en:"he dispersed"},{ar:"زَيَّنَ",translit:"ز-ي-ن",en:"he adorned"},
  {ar:"صَدَّ",translit:"ص-د-د",en:"he hindered"},{ar:"طَلَّقَ",translit:"ط-ل-ق",en:"he divorced"},
  {ar:"عَجَّلَ",translit:"ع-ج-ل",en:"he hastened"},{ar:"قَدَّمَ",translit:"ق-د-م",en:"he sent forth"},
  {ar:"كَلَّمَ",translit:"ك-ل-م",en:"he spoke to"},{ar:"مَدَّ",translit:"م-د-د",en:"he extended"},
  {ar:"نَجَّى",translit:"ن-ج-و",en:"he saved / delivered"},{ar:"وَصَّى",translit:"و-ص-ي",en:"he enjoined"},
  {ar:"بَيَّنَ",translit:"ب-ي-ن",en:"he made clear"},{ar:"حَاقَ",translit:"ح-ي-ق",en:"he surrounded"},
  {ar:"دَمَّرَ",translit:"د-م-ر",en:"he destroyed"},{ar:"رَدَّ",translit:"ر-د-د",en:"he turned back"},
  {ar:"شَرَحَ",translit:"ش-ر-ح",en:"he opened"},{ar:"ضَرَبَ",translit:"ض-ر-ب",en:"he struck"},
  {ar:"عَرَضَ",translit:"ع-ر-ض",en:"he displayed"},{ar:"فَقِهَ",translit:"ف-ق-ه",en:"he understood"},
  {ar:"قَصَّ",translit:"ق-ص-ص",en:"he narrated"},{ar:"كَذَبَ",translit:"ك-ذ-ب",en:"he lied"},
  {ar:"نَفَخَ",translit:"ن-ف-خ",en:"he blew"},{ar:"وَفَّى",translit:"و-ف-ي",en:"he fulfilled"},
  {ar:"أَحْيَا",translit:"ح-ي-ي",en:"he gave life"},{ar:"أَصْبَحَ",translit:"ص-ب-ح",en:"he became"},
  {ar:"بَارَكَ",translit:"ب-ر-ك",en:"he blessed"},{ar:"جَاهَدَ",translit:"ج-ه-د",en:"he strove"},
  {ar:"حَرَصَ",translit:"ح-ر-ص",en:"he was eager"},{ar:"دَبَّرَ",translit:"د-ب-ر",en:"he planned"},
  {ar:"رَحِمَ",translit:"ر-ح-م",en:"he had mercy"},{ar:"سَلَّمَ",translit:"س-ل-م",en:"he submitted / greeted"},
  {ar:"صَبَّ",translit:"ص-ب-ب",en:"he poured"},{ar:"عَظَّمَ",translit:"ع-ظ-م",en:"he glorified"},
  {ar:"فَصَّلَ",translit:"ف-ص-ل",en:"he explained in detail"},{ar:"قَضَى",translit:"ق-ض-ي",en:"he decreed"},
  {ar:"كَرَّمَ",translit:"ك-ر-م",en:"he honored"},{ar:"مَلَكَ",translit:"م-ل-ك",en:"he owned / ruled"},
  {ar:"نَبَّأَ",translit:"ن-ب-ا",en:"he informed"},{ar:"وَسَّعَ",translit:"و-س-ع",en:"he expanded"},
  {ar:"أَنْعَمَ",translit:"ن-ع-م",en:"he bestowed favor"},{ar:"تَعَالَى",translit:"ع-ل-و",en:"He is exalted"},
];

// ── Utilities ─────────────────────────────────────────────────────────────────

export interface BareChar {
  letter: string;
  marks: string;
}

export function bareWithMarks(ar: string): BareChar[] {
  const out: BareChar[] = [];
  for (const ch of ar) {
    if (/[ً-ْٰ]/.test(ch)) {
      if (out.length) out[out.length - 1].marks += ch;
    } else if (ALPHABET.some((l) => l.ar === ch) || ch === "ى") {
      out.push({ letter: ch, marks: "" });
    }
  }
  return out;
}

export function spellWord(word: BuiltLetter[]): string {
  let out = "";
  for (let i = 0; i < word.length; i++) {
    const l = word[i];
    const h = l.harakah;
    const next = word[i + 1];

    if (l.ar === "ى") { out += "ā"; continue; }
    if (["و", "ي", "ا"].includes(l.ar) && !h) {
      out += l.ar === "و" ? "ū" : l.ar === "ي" ? "ī" : "ā";
      continue;
    }

    let cons = l.translit.split(" ")[0].replace("/", "").trim();
    if (l.ar === "و") cons = "w";
    if (l.ar === "ي") cons = "y";
    if (l.ar === "ا") cons = "";

    if (!h) { out += cons; continue; }

    const vm = h.sound.match(/\(([^)]+)\)/);
    const v = vm ? vm[1] : "";

    if (v === "—") { out += cons; continue; }
    if (v === "double") { out += cons + cons; continue; }
    if (v.includes("n")) { out += cons + v.replace("n", "") + "n"; continue; }

    if (next && !next.harakah) {
      if (v === "a" && (next.ar === "ا" || next.ar === "ى")) { out += cons + "ā"; i++; continue; }
      if (v === "u" && next.ar === "و") { out += cons + "ū"; i++; continue; }
      if (v === "i" && next.ar === "ي") { out += cons + "ī"; i++; continue; }
    }
    out += cons + v;
  }
  return out;
}

// ── Game words (for Letter Blaster) ──────────────────────────────────────────

const ALL_WORDS: DictEntry[] = [...DICTIONARY, ...VERB_DB];

export const GAME_WORDS: DictEntry[] = ALL_WORDS.filter((d) => {
  if (d.ar.includes(" ")) return false;
  const clean = d.ar.replace(/[ً-ْٰ]/g, "");
  const letters = bareWithMarks(clean).map((x) => x.letter);
  if (letters.length < 3 || letters.length > 6) return false;
  return letters.every((ch) => ALPHABET.some((l) => l.ar === ch) || ch === "ى");
});

// Combined flat pool for quizzes (strip verb roots — use word forms only)
export const FULL_DICT: DictEntry[] = ALL_WORDS;

export function lookupWord(ar: string): { exact: DictEntry | null; bare: DictEntry[] } {
  const clean = ar.replace(/[ً-ْٰ]/g, "");
  const exact = ALL_WORDS.find((d) => d.ar === ar) ?? null;
  const bare = exact
    ? []
    : ALL_WORDS.filter((d) => d.ar.replace(/[ً-ْٰ]/g, "") === clean);
  return { exact, bare };
}
