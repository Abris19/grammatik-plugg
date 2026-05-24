export type WordClass =
  | 'substantiv'
  | 'verb'
  | 'adjektiv'
  | 'adverb'
  | 'pronomen'
  | 'preposition'
  | 'konjunktion'
  | 'subjunktion'
  | 'interjektion';

export const WORD_CLASS_COLORS: Record<WordClass, string> = {
  substantiv: '#3B82F6',
  verb: '#EF4444',
  adjektiv: '#10B981',
  adverb: '#F59E0B',
  pronomen: '#8B5CF6',
  preposition: '#EC4899',
  konjunktion: '#06B6D4',
  subjunktion: '#84CC16',
  interjektion: '#F97316',
};

export const WORD_CLASS_BG: Record<WordClass, string> = {
  substantiv: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  verb: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  adjektiv: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  adverb: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  pronomen: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300',
  preposition: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
  konjunktion: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300',
  subjunktion: 'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-300',
  interjektion: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
};

export const WORD_CLASS_EMOJIS: Record<WordClass, string> = {
  substantiv: '📦',
  verb: '⚡',
  adjektiv: '🎨',
  adverb: '🔍',
  pronomen: '👤',
  preposition: '📍',
  konjunktion: '🔗',
  subjunktion: '🔀',
  interjektion: '😮',
};

export const ALL_WORD_CLASSES: WordClass[] = [
  'substantiv', 'verb', 'adjektiv', 'adverb', 'pronomen',
  'preposition', 'konjunktion', 'subjunktion', 'interjektion',
];

export interface GrammarSection {
  id: WordClass;
  name: string;
  shortDef: string;
  fullDef: string;
  trick: string;
  subtypes?: { name: string; examples: string[] }[];
  rules?: { title: string; content: string; examples?: string[] }[];
  examples: string[];
  coloredExamples?: { text: string; wordClass: WordClass }[][];
  pitfalls?: string[];
  flashcards: { front: string; back: string }[];
}

export const GRAMMAR_DATA: GrammarSection[] = [
  {
    id: 'substantiv',
    name: 'Substantiv',
    shortDef: 'Namn på levande varelser, ting, platser och abstrakta begrepp',
    fullDef:
      'Substantiv är namn på levande varelser, växter, ting, ämnen, platser och abstrakta begrepp. Du känner igen dem på att du kan sätta en, ett eller flera framför. Vissa ord kan man sätta mycket framför (ämnesnamn).',
    trick: 'Kan du sätta "en", "ett" eller "flera" framför? → Substantiv!',
    subtypes: [
      { name: 'Artnamn', examples: ['kvinna', 'abborre', 'ros', 'golv', 'stol', 'hund'] },
      { name: 'Kollektiver', examples: ['folk', 'skolklass', 'familj', 'lag', 'publik'] },
      { name: 'Egennamn', examples: ['Kerstin', 'London', 'Svartån', 'Sverige', 'Maria'] },
      { name: 'Ämnesnamn', examples: ['vatten', 'guld', 'järn', 'siden', 'snus', 'luft'] },
      { name: 'Abstrakta', examples: ['kärlek', 'förhoppning', 'godhet', 'frihet', 'glädje'] },
    ],
    rules: [
      {
        title: 'Numerus (antal)',
        content: 'Singular = ett. Plural = flera. Fem pluraländelser: -or, -ar, -er, -r, -n samt 0-ändelse.',
        examples: ['mössor (–or)', 'stilar (–ar)', 'drifter (–er)', 'tår (–r)', 'äpplen (–n)', 'hus (0-ändelse)'],
      },
      {
        title: 'Vokalväxling i plural',
        content: 'Vissa substantiv byter vokal i plural.',
        examples: ['gås → gäss', 'mus → möss', 'bok → böcker', 'man → män', 'hand → händer'],
      },
      {
        title: 'Kasus',
        content: 'Grundform (nominativ) och genitiv. Genitiv anger ägande — lägg till -s. OBS! Ingen apostrof i svenska!',
        examples: ['flickans bil ✓', "flickan's bil ✗", 'Kalles cykel ✓', "Kalle's cykel ✗"],
      },
      {
        title: 'Genus',
        content: 'Utrum (en-ord) = maskulinum + femininum. Neutrum = ett-ord.',
        examples: ['en mus → musen', 'ett hus → huset', 'en flicka → flickan', 'ett barn → barnet'],
      },
      {
        title: 'Bestämd/obestämd form',
        content: 'Obestämd: en/ett/flera framför. Bestämd: suffixet -en/-et/-na/-a bakom, ibland föregås av den/det/de.',
        examples: ['mus → möss → musen → mössen', 'hus → hus → huset → husen', 'flicka → flickor → flickan → flickorna'],
      },
    ],
    examples: ['en kvinna', 'ett hus', 'flera böcker', 'Kerstins cykel', 'kärlek'],
    pitfalls: [
      'Ingen genitivapostrof: "Kalles bil", INTE "Kalle\'s bil"',
      'Ämnesnamn kan inte räknas: "mycket vatten", INTE "en vatten"',
    ],
    flashcards: [
      { front: 'Vad är ett substantiv?', back: 'Namn på levande varelser, växter, ting, ämnen, platser och abstrakta begrepp. Kan föregås av en, ett eller flera.' },
      { front: 'Vilka fem pluraländelser finns?', back: '-or (mössor), -ar (stilar), -er (drifter), -r (tår), -n (äpplen), samt 0-ändelse (hus).' },
      { front: 'Hur bildas genitiv på svenska?', back: 'Lägg till -s direkt efter ordet. INGEN apostrof! "flickans bil", inte "flickan\'s bil".' },
      { front: 'Vad är skillnaden på utrum och neutrum?', back: 'Utrum = en-ord (inkluderar maskulinum och femininum). Neutrum = ett-ord.' },
      { front: 'Nämn fem abstrakta substantiv', back: 'Kärlek, förhoppning, godhet, frihet, glädje.' },
      { front: 'Vad är ett kollektiv-substantiv?', back: 'Betecknar en grupp som en enhet: folk, skolklass, familj, lag, publik.' },
    ],
  },
  {
    id: 'verb',
    name: 'Verb',
    shortDef: 'Ord för handlingar och skeenden — springer, hoppar, kör',
    fullDef:
      'Verb är ord för saker man gör eller det som sker. De böjs i tempus (tid) och har en tema med tre former: infinitiv, imperfekt (preteritum) och supinum.',
    trick: 'Kan du sätta "att" framför? → Verb! (att köpa, att springa)',
    rules: [
      {
        title: 'Tema (tre former)',
        content: 'Infinitiv → Preteritum (imperfekt) → Supinum',
        examples: [
          'Svaga verb (regelbundna): såga–sågade–sågat, köpa–köpte–köpt, leka–lekte–lekt',
          'Starka verb (oregelbundna, vokalväxling): se–såg–sett, skriva–skrev–skrivit, springa–sprang–sprungit',
        ],
      },
      {
        title: 'Tempus (tidsformer)',
        content: 'Sju tidsformer anger när något sker.',
        examples: [
          'Infinitiv: "att köpa"',
          'Presens (nu): "nu köper jag"',
          'Preteritum (förfluten): "igår köpte jag"',
          'Perfekt (nyligen): "har köpt"',
          'Pluskvamperfekt (före annan händelse): "hade köpt"',
          'Futurum (framtid): "ska köpa"',
          'Imperativ (uppmaning): "Köp!"',
        ],
      },
      {
        title: 'Hjälpverb',
        content: 'Kan inte stå ensamma — måste följas av ett huvudverb.',
        examples: ['har, hade, ska, skulle, är, var, blir, blev, vill, ville, bör, borde, kunna, kunde, få, fick, måste'],
      },
      {
        title: 'Dubbelt supinum — VANLIG FEL!',
        content: 'Verb efter supinum ska stå i infinitiv (grundform), INTE supinum.',
        examples: ['✗ Han hade hunnit somnat.', '✓ Han hade hunnit somna.', '✗ Hon hade försökt ätit.', '✓ Hon hade försökt äta.'],
      },
      {
        title: 'Aktiv och passiv form',
        content: 'Aktiv: subjektet utför handlingen. Passiv: subjektet utsätts för handlingen (–s-form).',
        examples: ['Aktiv: Lokföraren kör tåget.', 'Passiv: Tåget körs av lokföraren.'],
      },
      {
        title: 'Particip',
        content: 'Verbformer som fungerar som adjektiv.',
        examples: ['Perfekt particip: "bilen är borstad", "ett välskrivet brev"', 'Presens particip: "en troende människa", "cyklande barn"'],
      },
      {
        title: 'Deponens-verb',
        content: 'Slutar på -s i alla former men har aktiv betydelse.',
        examples: ['hoppas, önskas, minnas, trivas, hälsas, kallas'],
      },
    ],
    examples: ['att springa', 'hon springer', 'han sprang', 'de har sprungit'],
    pitfalls: [
      'Dubbelt supinum: "hade hunnit somnat" → ska vara "hade hunnit somna"',
      'Hjälpverb kan inte stå utan huvudverb',
    ],
    flashcards: [
      { front: 'Vad är ett verbs tema?', back: 'De tre grundformerna: Infinitiv – Preteritum – Supinum. Ex: köpa–köpte–köpt.' },
      { front: 'Vad är skillnaden på svaga och starka verb?', back: 'Svaga verb (regelbundna) bildar preteritum med ändelse (-de/-te/-dde). Starka verb byter vokal: se–såg–sett.' },
      { front: 'Vad är dubbelt supinum och varför är det fel?', back: 'Att använda supinum efter ett supinum: "hade hunnit somnat". Rätt: "hade hunnit somna" — verbet efter supinum ska stå i infinitiv.' },
      { front: 'Vilka sju tempus finns?', back: 'Infinitiv, presens, preteritum (imperfekt), perfekt, pluskvamperfekt, futurum, imperativ.' },
      { front: 'Ge fem exempel på hjälpverb', back: 'har, hade, ska, skulle, är, var, blir, vill, bör, måste.' },
      { front: 'Vad är aktiv och passiv form?', back: 'Aktiv: subjektet gör handlingen ("kör tåget"). Passiv: subjektet utsätts ("körs av lokföraren").' },
    ],
  },
  {
    id: 'adjektiv',
    name: 'Adjektiv',
    shortDef: 'Beskriver substantiv — hur något är eller ser ut',
    fullDef:
      'Adjektiv beskriver saker och ting. De böjs efter det ord de bestämmer — detta kallas kongruensböjning. De kompareras i tre grader: positiv, komparativ och superlativ.',
    trick: 'Beskriver ett substantiv och svarar på frågan "hur ser det ut/hur är det?"',
    rules: [
      {
        title: 'Kongruensböjning',
        content: 'Adjektivet anpassas efter substantivets genus, numerus och bestämdhet.',
        examples: [
          'Utrum: Den snälle mannen / En snäll man',
          'Femininum: Den snälla kvinnan / En snäll kvinna',
          'Neutrum: Det röda huset / Ett rött hus',
          'Plural: De snälla barnen / Snälla barn',
        ],
      },
      {
        title: 'Komparation',
        content: 'Tre grader: positiv (grundform), komparativ (mer), superlativ (mest).',
        examples: [
          'tjock – tjockare – tjockast',
          'hög – högre – högst',
          'låg – lägre – lägst',
          'gammal – äldre – äldst',
          'ung – yngre – yngst',
          'dålig – sämre – sämst (oregelbunden!)',
          'bra – bättre – bäst (oregelbunden!)',
          'lång – längre – längst',
        ],
      },
      {
        title: 'Komparation med mer/mest',
        content: 'Långa adjektiv kompareras med mer/mest.',
        examples: ['intresserad – mer intresserad – mest intresserad', 'engagerad – mer engagerad – mest engagerad'],
      },
    ],
    examples: ['en stor bil', 'ett rött hus', 'snälla barn', 'tjockare bok', 'den äldste mannen'],
    pitfalls: [
      'Kongruens: "ett rött hus" (inte "ett röd hus")',
      'Adjektiv kompareras, adverb gör det inte',
    ],
    flashcards: [
      { front: 'Vad är kongruensböjning?', back: 'Adjektivet anpassas efter substantivets genus (en/ett), numerus (singular/plural) och bestämdhet.' },
      { front: 'Komparera adjektivet "dålig"', back: 'dålig – sämre – sämst (oregelbunden komparation).' },
      { front: 'Komparera adjektivet "bra"', back: 'bra – bättre – bäst (oregelbunden komparation).' },
      { front: 'Hur kompareras långa adjektiv?', back: 'Med mer/mest: "intresserad – mer intresserad – mest intresserad".' },
      { front: 'Vad heter de tre graderna i komparation?', back: 'Positiv (grundform), komparativ (mer), superlativ (mest).' },
      { front: 'Böj "gammal" i komparativ och superlativ', back: 'gammal – äldre – äldst.' },
    ],
  },
  {
    id: 'adverb',
    name: 'Adverb',
    shortDef: 'Bestämmer verb, adjektiv eller andra adverb — svarar på hur? när? var? vart?',
    fullDef:
      'Adverb bestämmer (modifierar) verb, adjektiv eller andra adverb. De svarar på frågorna hur? (sättsadverb), när? (tidsadverb), var? vart? (rumsadverb). Till skillnad från adjektiv kan adverb INTE kompareras.',
    trick: 'Svarar på hur? när? var? vart? och kan INTE kompareras!',
    rules: [
      {
        title: 'Tre typer av adverb',
        content: 'Sätts-, tids- och rumsadverb.',
        examples: [
          'Sättsadverb (hur?): vackert, snabbt, försiktigt',
          'Tidsadverb (när?): igår, nu, snart, alltid, aldrig',
          'Rumsadverb (var/vart?): hem, hit, dit, här, där, ute',
        ],
      },
      {
        title: 'Adverb kan INTE kompareras',
        content: 'Det är skillnaden mot adjektiv. Adjektiv kompareras, adverb inte.',
        examples: [
          'Adjektiv: hög – högre – högst',
          'Adverb: högt (men INTE *högtare, *högtast)',
          'Adjektiv: snabb – snabbare – snabbast',
          'Adverb: snabbt (men INTE *snabbtare)',
        ],
      },
      {
        title: 'Var vs. vart',
        content: '"Var" = befintlighet (var befinner sig något). "Vart" = riktning (vart är man på väg).',
        examples: [
          'Var är du? ✓ (befintlighet)',
          'Vart ska du? ✓ (riktning/destination)',
          '*Vart bor du? ✗ (fel — bor = befintlighet)',
          '*Var ska du? ✗ (fel — ska = riktning)',
        ],
      },
    ],
    examples: ['Prästen sjunger vackert.', 'Den mycket snälle mannen.', 'Igår simmade jag.', 'Han gick hem.'],
    pitfalls: [
      '"Var" = befintlighet, "vart" = riktning',
      'Adverb kan INTE kompareras: högt, INTE *högtare',
    ],
    flashcards: [
      { front: 'Vad är skillnaden på adverb och adjektiv?', back: 'Adjektiv beskriver substantiv och kan kompareras. Adverb bestämmer verb/adjektiv/adverb och kan INTE kompareras.' },
      { front: 'Vad är skillnaden på "var" och "vart"?', back: '"Var" = befintlighet (Var är du?). "Vart" = riktning (Vart ska du?). "Vart bor du?" är FEL.' },
      { front: 'Ge exempel på tidsadverb', back: 'igår, nu, snart, alltid, aldrig, sedan, redan, fortfarande.' },
      { front: 'Ge exempel på rumsadverb', back: 'hem, hit, dit, här, där, ute, inne, borta, upp, ner.' },
      { front: 'Kan "högt" kompareras?', back: 'Nej! Högt är ett adverb och adverb kompareras inte. Däremot kompareras adjektivet "hög": hög–högre–högst.' },
    ],
  },
  {
    id: 'pronomen',
    name: 'Pronomen',
    shortDef: 'Ersätter ett substantiv eller syftar tillbaka på ett',
    fullDef:
      'Pronomen är ersättningsord som oftast ersätter ett substantiv. Det finns flera typer: personliga, possessiva, reflexiva, demonstrativa, relativa och interrogativa pronomen.',
    trick: 'Ersätter ett substantiv: "flickan" → "hon", "bilen" → "den"',
    subtypes: [
      { name: 'Personliga (subj/obj)', examples: ['jag/mig', 'du/dig', 'han/honom', 'hon/henne', 'den/det', 'vi/oss', 'ni/er', 'de/dem'] },
      { name: 'Possessiva', examples: ['min/mitt/mina', 'din/ditt/dina', 'hans', 'hennes', 'dess', 'vår/vårt/våra', 'er/ert/era', 'deras'] },
      { name: 'Reflexiva', examples: ['mig', 'dig', 'sig', 'oss', 'er', 'sig'] },
      { name: 'Demonstrativa', examples: ['den/det/de', 'denne/denna/detta/dessa', 'den här/det här/de här', 'den där/det där/de där'] },
      { name: 'Relativa', examples: ['som', 'vilken/vilket/vilka', 'vars', 'vad'] },
      { name: 'Interrogativa (frågepronomen)', examples: ['vem', 'vems', 'vad', 'vad för en', 'vilken', 'vilkens', 'hurudan'] },
    ],
    rules: [
      {
        title: 'de vs. dem',
        content: '"De" = subjektsform, "dem" = objektsform. Tricket: byt ut mot "vi" (de) eller "oss" (dem).',
        examples: [
          'De springer. (= Vi springer → de) ✓',
          'Jag såg dem. (= Jag såg oss → dem) ✓',
          '*Dem springer. ✗',
        ],
      },
      {
        title: 'sin/hans/hennes',
        content: '"Sin/sitt/sina" syftar på subjektet i samma sats. "hans/hennes" syftar på en annan person.',
        examples: [
          'Kalle tog sin cykel. (Kalles egen cykel) ✓',
          'Kalle tog hans cykel. (Någon annans cykel) ✓',
          '*Kalle tog sin bror sin cykel. ✗',
        ],
      },
    ],
    examples: ['Jag ser henne.', 'Det är deras hus.', 'Filmen, vars regissör..., fick pris.', 'Vem är det?'],
    pitfalls: [
      'de/dem: "de" = subjekt, "dem" = objekt',
      'sin = syftar på subjektet, hans/hennes = annan person',
    ],
    flashcards: [
      { front: 'Hur skiljer man på "de" och "dem"?', back: '"De" = subjektsform (byt mot "vi"). "Dem" = objektsform (byt mot "oss"). "De springer" ✓, "Jag såg dem" ✓.' },
      { front: 'Vad är skillnaden på "sin" och "hans/hennes"?', back: '"Sin/sitt/sina" syftar tillbaka på subjektet i meningen. "hans/hennes" syftar på en annan person.' },
      { front: 'Vilka är de personliga pronomens objektsformer?', back: 'mig, dig, honom, henne, den/det, oss, er, dem.' },
      { front: 'Vad är ett relativt pronomen? Ge exempel.', back: 'Syftar bakåt på ett substantiv. Exempel: som, vilken, vilket, vars, vad. "Filmen, vars regissör hade avlidit, fick pris."' },
      { front: 'Vad är ett reflexivt pronomen?', back: 'Syftar på subjektet i satsen: mig, dig, sig, oss, er, sig. "Hon tvättade sig."' },
    ],
  },
  {
    id: 'preposition',
    name: 'Preposition',
    shortDef: 'Småord som anger plats, riktning, tid eller relation',
    fullDef:
      'Prepositioner är korta ord som anger läge, riktning, tid eller relation. De står alltid tillsammans med ett substantiv eller pronomen (prepositionalfras).',
    trick: 'Litet ord som anger "var?", "vart?", "när?" eller "hur?" i förhållande till något annat.',
    rules: [
      {
        title: 'Vanliga prepositioner',
        content: 'Prepositioner anger rumsliga och tidsmässiga relationer.',
        examples: ['på, under, mot, ovanför, i, av, med, till, från, om, för, vid, hos, utan', 'i skolan, på bordet, under sängen, mot väggen, framför huset'],
      },
    ],
    examples: ['boken på bordet', 'under bron', 'mot vinden', 'i skolan', 'av trä'],
    pitfalls: ['Förväxla inte prepositioner med adverb: "Han gick in" (adverb) vs "Han gick in i rummet" (preposition)'],
    flashcards: [
      { front: 'Vad är en preposition?', back: 'Småord som anger plats, riktning, tid eller relation. Står med substantiv/pronomen: på bordet, under bron.' },
      { front: 'Ge fem exempel på prepositioner', back: 'på, under, mot, ovanför, i, av, med, till, från, om.' },
      { front: 'Vad är en prepositionalfras?', back: 'Preposition + substantiv/pronomen: "på bordet", "under bron", "mot vinden".' },
    ],
  },
  {
    id: 'konjunktion',
    name: 'Konjunktion',
    shortDef: 'Bindeord som förenar ord, fraser och satser på lika nivå',
    fullDef:
      'Konjunktioner är bindeord som förenar ord, fraser eller satser på samma syntaktiska nivå (samordning). De kallas ibland FANBOYS: för, och, men, eller, utan.',
    trick: 'Förenar två likvärdiga delar: "och", "men", "eller", "utan", "för"',
    rules: [
      {
        title: 'Samordnande konjunktioner',
        content: 'Binder ihop satser eller delar av samma rang (samordning).',
        examples: ['och: "Jag gillar glass och du gillar tårta."', 'men: "Han ville, men han kunde inte."', 'eller: "Te eller kaffe?"', 'utan: "Inte stor, utan liten."', 'för: "Jag stannar, för det regnar."'],
      },
    ],
    examples: ['Jag gillar glass och du gillar tårta.', 'Han spelar piano men hon sjunger.', 'Te eller kaffe?'],
    pitfalls: ['Förväxla inte konjunktion (samordnar) med subjunktion (underordnar)'],
    flashcards: [
      { front: 'Vad är en konjunktion?', back: 'Bindeord som förenar ord/fraser/satser på samma nivå (samordning): och, men, eller, utan, för.' },
      { front: 'Nämn fem vanliga konjunktioner', back: 'och, men, eller, utan, för.' },
      { front: 'Skillnad på konjunktion och subjunktion?', back: 'Konjunktion = samordnar lika delar. Subjunktion = inleder underordnad bisats.' },
    ],
  },
  {
    id: 'subjunktion',
    name: 'Subjunktion',
    shortDef: 'Bindeord som inleder underordnade bisatser',
    fullDef:
      'Subjunktioner är bindeord som inleder bisatser och underordnar dem under en huvudsats. De skapar ett beroendeförhållande mellan bisatsen och huvudsatsen.',
    trick: 'Inleder en bisats som är beroende av huvudsatsen: "eftersom", "att", "när", "om"',
    rules: [
      {
        title: 'Vanliga subjunktioner',
        content: 'Inleder bisatser med olika betydelse.',
        examples: [
          'Tid: när, då, innan, sedan, medan, tills',
          'Orsak: eftersom, därför att, emedan',
          'Villkor: om, ifall, såvida',
          'Koncessiv: fastän, trots att, även om',
          'Följd: att, så att',
          'Komplementsatt: att',
        ],
      },
    ],
    examples: ['Jag gillar att sova när jag är ledig.', 'Eftersom det regnar stannar vi inne.', 'Om du vill kan du komma.'],
    pitfalls: ['Subjunktion inleder alltid en bisats — bisatsen kan inte stå ensam'],
    flashcards: [
      { front: 'Vad är en subjunktion?', back: 'Bindeord som inleder underordnade bisatser: när, då, innan, eftersom, om, att, fastän, medan.' },
      { front: 'Nämn fyra subjunktioner', back: 'när, eftersom, om, att, innan, medan, fastän, trots att.' },
      { front: 'Ge ett exempel på en subjunktion i en mening', back: '"Jag gillar att sova när jag är ledig." Subjunktion: "när" inleder bisatsen "när jag är ledig".' },
    ],
  },
  {
    id: 'interjektion',
    name: 'Interjektion',
    shortDef: 'Utrop som uttrycker en känsla — aj!, hurra!, usch!',
    fullDef:
      'Interjektioner är utrop eller ljud som uttrycker en känsla eller reaktion. De är inte grammatiskt bundna till resten av meningen och kan stå ensamma.',
    trick: 'Uttrycker en känsla direkt — ofta följt av utropstecken!',
    rules: [
      {
        title: 'Typer av interjektioner',
        content: 'Interjektioner kan uttrycka smärta, glädje, äckel, förvåning m.m.',
        examples: ['Smärta: aj!, au!', 'Glädje: hurra!, jippi!', 'Äckel/obehag: usch!, fy!, pfft!', 'Förvåning: oj!, wow!', 'Uppmaning: hej!, psst!, hallå!'],
      },
    ],
    examples: ['Aj, det gjorde ont!', 'Hurra, vi vann!', 'Usch, vad kallt det är!', 'Fy, det luktar!'],
    pitfalls: [],
    flashcards: [
      { front: 'Vad är en interjektion?', back: 'Utrop som uttrycker en känsla: aj!, hurra!, usch!, fy!. Grammatiskt fristående från resten av meningen.' },
      { front: 'Ge fyra exempel på interjektioner', back: 'Aj! (smärta), Hurra! (glädje), Usch! (äckel), Oj! (förvåning).' },
    ],
  },
];
