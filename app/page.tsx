"use client";

import { FormEvent, useMemo, useState } from "react";

const CATALOG_URL = "https://www.seduo.cz/seznam-kurzu";
const VERIFIED_AT = "23. 7. 2026";
const CATEGORY_URLS: Record<string, string> = {
  "Leadership": "https://www.seduo.cz/kategorie/leadership",
  "Obchod": "https://www.seduo.cz/kategorie/obchod",
  "Komunikace": "https://www.seduo.cz/kategorie/komunikace",
  "Prezentace": "https://www.seduo.cz/kategorie/prezentace",
  "Marketing": "https://www.seduo.cz/kategorie/marketing",
  "Osobní rozvoj": "https://www.seduo.cz/kategorie/osobni-rozvoj",
  "Produktivita": "https://www.seduo.cz/kategorie/produktivita",
  "Projekty": "https://www.seduo.cz/kategorie/projekty",
  "HR a Právo": "https://www.seduo.cz/kategorie/hr-pravo",
  "Digitální dovednosti": "https://www.seduo.cz/kategorie/digitalni-dovednosti",
};

type Seniority = "junior" | "medior" | "senior";
type Stage = "Zakotvit základy" | "Rozšířit dovednosti" | "Použít v praxi";
type ContentTab = "courses" | "microlearning" | "academies" | "webinars" | "podcasts" | "programs";

type Course = {
  id: string;
  title: string;
  lecturer: string;
  sourceUrl: string;
  imageUrl: string;
  duration: string;
  rating?: string;
  tags: string[];
  stage: Stage;
  relevance: string;
  learning: string;
  audience: string;
};

const courses: Course[] = [
  {
    id: "ai-maxikurz",
    title: "Maxikurz umělé inteligence: kompletní průvodce AI světem",
    lecturer: "Daniel Gamrot",
    duration: "2 h 35 min",
    rating: "95 % · 462 hodnocení",
    sourceUrl: "https://www.seduo.cz/maxikurz-umele-inteligence",
    imageUrl: "https://seduocz.educdn.cz/images/130871-maxikurz-ai.jpg:preview3x",
    tags: ["general", "manager", "project", "hr", "ld", "marketing", "it", "sales", "production", "assistant", "operations", "analyst", "finance"],
    stage: "Rozšířit dovednosti",
    relevance: "Univerzální doplňková volba pro praktické využití AI napříč profesemi.",
    learning:
      "Jak používat ChatGPT, Microsoft Copilot, Google Gemini a další AI nástroje pro texty, rešerše, dokumenty, data, prezentace i automatizaci.",
    audience:
      "Pro každého, kdo chce zapojit AI do každodenní práce bez nutnosti technického vzdělání.",
  },
  {
    id: "communication-self-defense",
    title: "Komunikační sebeobrana: reagujte pohotově v každé situaci",
    lecturer: "Martin Vasquez",
    duration: "45 min",
    rating: "96 % · 434 hodnocení",
    sourceUrl: "https://www.seduo.cz/komunikacni-sebeobrana",
    imageUrl: "https://seduocz.educdn.cz/images/131813-vazquez-komunikacni-sebeobrana4.jpg:preview3x",
    tags: ["general", "manager", "project", "hr", "ld", "marketing", "it", "sales", "production", "assistant", "operations", "analyst", "finance"],
    stage: "Použít v praxi",
    relevance: "Univerzální komunikační trénink a nejstudovanější videokurz Seduo za květen 2026.",
    learning:
      "Jak zachovat klid a pohotově reagovat na kritiku, tlak, nepříjemnou otázku nebo nečekanou situaci.",
    audience: "Pro všechny role, které komunikují s kolegy, zákazníky nebo vedením.",
  },
  {
    id: "mental-resilience",
    title: "Mentální odolnost: jak ustát tlak každodenního života",
    lecturer: "Jan Ženatý",
    duration: "52 min",
    rating: "95 % · 2 297 hodnocení",
    sourceUrl: "https://www.seduo.cz/mentalni-odolnost-jak-ustat-tlak-kazdodenniho-zivota",
    imageUrl: "https://seduocz.educdn.cz/images/128781-jan-zenaty-mentailni.jpg:preview3x",
    tags: ["general", "manager", "project", "hr", "ld", "marketing", "it", "sales", "production", "assistant", "operations", "analyst", "finance"],
    stage: "Rozšířit dovednosti",
    relevance: "Doplňuje profesní rozvoj o wellbeing, zvládání stresu a prevenci vyčerpání.",
    learning:
      "Jak lépe zvládat stres, pracovat s negativními scénáři, obnovovat energii a budovat psychickou odolnost.",
    audience: "Pro každého, kdo chce dlouhodobě zvládat pracovní tlak zdravěji.",
  },
  {
    id: "labor-law",
    title: "Pracovní právo pro HR a manažery",
    lecturer: "Jakub Oliva",
    duration: "2 h 04 min",
    sourceUrl: "https://www.seduo.cz/pracovni-pravo-pro-hr-a-manazery",
    imageUrl: "https://seduocz.educdn.cz/images/126550-jakub-oliva-pracovni-pravo-pro-hr-a-manazery.jpg:preview3x",
    tags: ["hr", "manager", "executive"],
    stage: "Rozšířit dovednosti",
    relevance: "Pokrývá pracovněprávní situace, které řeší HR a vedoucí zaměstnanci.",
    learning: "Praktické základy pracovního práva od nástupu přes vedení týmu až po ukončení spolupráce.",
    audience: "Pro HR specialisty, personalisty, manažery a vedení firem.",
  },
  {
    id: "recruitment",
    title: "Úspěšný nábor od A po Z",
    lecturer: "Tamara Ksandrová",
    duration: "1 h 19 min",
    sourceUrl: "https://www.seduo.cz/uspesny-nabor-od-a-po-z",
    imageUrl: "https://seduocz.educdn.cz/images/126544-tamara-ksandrova-nabor-od-a-do-z.jpg:preview3x",
    tags: ["hr"],
    stage: "Zakotvit základy",
    relevance: "Rozvíjí jednu z hlavních odborných kompetencí HR a recruiterů.",
    learning: "Jak připravit inzerát, vyhledat a oslovit kandidáty, vést pohovor, spolupracovat s manažery a nábor měřit.",
    audience: "Pro recruitery, HR specialisty a manažery zapojené do náboru.",
  },
  {
    id: "modern-sales",
    title: "Moderní prodej II: praktický průvodce prodejním rozhovorem",
    lecturer: "Peter Strcula",
    duration: "46 min",
    sourceUrl: "https://www.seduo.cz/moderni-prodej-ii",
    imageUrl: "https://seduocz.educdn.cz/images/131687-prodej2-cz.jpg:preview3x",
    tags: ["sales", "sales-leader", "customer"],
    stage: "Použít v praxi",
    relevance: "Je přímo zaměřený na praktický obchodní rozhovor a práci s námitkami.",
    learning: "Cold call, vedení schůzky, zjišťování potřeb, zvládání námitek, vyjednávání o ceně a uzavření obchodu.",
    audience: "Pro obchodní zástupce, account manažery a vedoucí obchodních týmů.",
  },
  {
    id: "ai-project",
    title: "AI pro projekťáky: váš parťák pro plánování, realizaci i reporting",
    lecturer: "Jiří Krátký",
    duration: "49 min",
    sourceUrl: "https://www.seduo.cz/ai-pro-projektaky-vas-partak-pro-planovani-realizaci-i-reporting",
    imageUrl: "https://seduocz.educdn.cz/images/130211-kratky-ai-projektaci-cz.png:preview3x",
    tags: ["project", "operations", "manager"],
    stage: "Rozšířit dovednosti",
    relevance: "Propojuje projektové řízení s konkrétním praktickým využitím AI.",
    learning: "Jak s AI připravit WBS, harmonogram, RACI, rizika, zápisy, prezentace a status reporty.",
    audience: "Pro projektové manažery, koordinátory, PMO a vedoucí projektů.",
  },
  {
    id: "leadership-max",
    title: "Maxikurz leadershipu s Filipem Kahounem",
    lecturer: "Filip Kahoun",
    duration: "2 h 41 min",
    sourceUrl: "https://www.seduo.cz/maxikurz-leadershipu",
    imageUrl: "https://seduocz.educdn.cz/images/131063-filip-kahoun-maxikurz.jpg:preview3x",
    tags: ["manager", "executive", "sales-leader", "hr-leader", "production"],
    stage: "Rozšířit dovednosti",
    relevance: "Uceleně rozvíjí vedení sebe, motivaci lidí a stavbu silného týmu.",
    learning: "Seberegulaci, motivaci, delegování, zpětnou vazbu, týmovou kulturu a převod priorit do akčního plánu.",
    audience: "Pro nové i zkušené vedoucí, manažery a ředitele.",
  },
  {
    id: "cyber-security",
    title: "10 hacků pro digitální bezpečnost",
    lecturer: "Karol Suchánek",
    duration: "44 min",
    sourceUrl: "https://www.seduo.cz/10-hacku-pro-digitalni-bezpecnost",
    imageUrl: "https://seduocz.educdn.cz/images/129291-karol-suchanek-hacky-cz.jpg:preview3x",
    tags: ["it", "assistant", "general", "finance", "operations"],
    stage: "Zakotvit základy",
    relevance: "Bezpečná digitální práce je důležitá pro technické i netechnické role.",
    learning: "Jak chránit účty, hesla, komunikaci, platby, soukromí a rozpoznávat běžné online hrozby.",
    audience: "Pro uživatele digitálních nástrojů napříč firmou, zvlášť IT, finance a administrativu.",
  },
  {
    id: "canva",
    title: "Canva pro každého: tvořte grafiku jako od profíka",
    lecturer: "Linda Martišková (Nezhybová)",
    duration: "1 h 47 min",
    sourceUrl: "https://www.seduo.cz/canva-pro-kazdeho-tvorte-grafiku-jako-od-profika",
    imageUrl: "https://seduocz.educdn.cz/images/128861-canva-cz.jpg:preview3x",
    tags: ["marketing", "assistant", "ld", "hr"],
    stage: "Rozšířit dovednosti",
    relevance: "Rozvíjí praktickou tvorbu prezentací, vizuálů a interního či marketingového obsahu.",
    learning: "Práci se šablonami, jednotným vizuálním stylem, prezentacemi, videem a AI nástroji v Canvě.",
    audience: "Pro marketing, HR, L&D, administrativu a každého, kdo připravuje vizuální materiály.",
  },
  {
    id: "power-bi",
    title: "Microsoft Power BI: vizualizace dat prakticky",
    lecturer: "Pavel Lasák",
    duration: "1 h 48 min",
    sourceUrl: "https://www.seduo.cz/microsoft-power-bi-vizualizace-dat",
    imageUrl: "https://seduocz.educdn.cz/images/127637-sharepoint-power-bi-vizualizace.jpg:preview3x",
    tags: ["analyst", "finance", "quality", "process-engineer"],
    stage: "Rozšířit dovednosti",
    relevance: "Pomáhá převést data do přehledných reportů a podkladů pro rozhodování.",
    learning: "Jak vytvářet interaktivní reporty, dashboardy a srozumitelné vizualizace v Power BI.",
    audience: "Pro analytiky, controlling, finance, kvalitu a procesní role.",
  },
  {
    id: "ld-smart",
    title: "Vzdělávání chytře: rozvíjejte lidi s malým týmem i rozpočtem",
    lecturer: "Bohunka Hihlánová",
    duration: "54 min",
    sourceUrl:
      "https://www.seduo.cz/vzdelavani-chytre-rozvijejte-lidi-s-malym-tymem-i-rozpoctem",
    imageUrl: "https://seduocz.educdn.cz/images/131841-vzdelavani-chytre.jpg:preview3x",
    tags: ["ld", "hr", "manager"],
    stage: "Zakotvit základy",
    relevance: "Pomáhá propojit rozvoj lidí s prioritami firmy a dostupnými zdroji.",
    learning:
      "Jak nastavit vzdělávání s jasnými prioritami, vazbou na byznys a realistickým rozpočtem.",
    audience:
      "Pro L&D a HR profesionály i pro každého, komu rozvoj lidí nově připadl do agendy.",
  },
  {
    id: "project-minimum",
    title: "Projektové minimum: základy projektového řízení pro každého",
    lecturer: "Lenka Čápová",
    duration: "55 min",
    sourceUrl: "https://www.seduo.cz/projektove-mininum",
    imageUrl: "https://seduocz.educdn.cz/images/129545-lenka-capova-projektove-minimum-pro-kazdeho-v2.jpg:preview3x",
    tags: ["project", "manager", "hr", "ld", "marketing", "general"],
    stage: "Zakotvit základy",
    relevance: "Dává jednoduchý rámec pro vedení úkolů, akcí a menších projektů.",
    learning:
      "Jak určit priority a pravidla, vytvořit plán, ošetřit rizika a formulovat úkoly.",
    audience:
      "Pro koordinátory, office manažery, HR, marketéry a lidi, kteří vedou projekt bez formální role projekťáka.",
  },
  {
    id: "project-atoz",
    title: "Projekty od A do Z: od prvního nápadu až po hladké spuštění",
    lecturer: "Jiří Krátký",
    duration: "1 h 03 min",
    sourceUrl:
      "https://www.seduo.cz/projektove-rizeni-od-a-do-z-od-prvniho-napadu-az-po-hladke-spusteni",
    imageUrl: "https://seduocz.educdn.cz/images/130820-projekty-od-a-do-z.jpg:preview3x",
    tags: ["project", "manager", "marketing", "it"],
    stage: "Rozšířit dovednosti",
    relevance: "Pokrývá celý životní cyklus projektu od záměru po uzavření.",
    learning:
      "Cíle a výstupy, volbu přístupu, WBS, harmonogram, rozpočet, rizika, stakeholdery, RACI, kanban a reporting.",
    audience:
      "Pro projektové manažery, vedoucí týmů a každého, kdo odpovídá za dodání výsledku.",
  },
  {
    id: "excel",
    title: "Profíkem v Excelu za 7 hodin",
    lecturer: "Pavel Lasák",
    duration: "6 h 24 min",
    sourceUrl: "https://www.seduo.cz/kurz-microsoft-excel",
    imageUrl: "https://seduocz.educdn.cz/images/125073-pavel-lasak-microsoft-excel-za-7-hod-cz.jpg:preview3x",
    tags: ["analyst", "finance", "hr", "marketing", "general"],
    stage: "Rozšířit dovednosti",
    relevance: "Rozvíjí praktickou práci s tabulkami a daty v Excelu pro Windows.",
    learning:
      "Práci s listy a tabulkami, filtry, řazení, funkce, grafy, kontingenční tabulky a Power Query.",
    audience:
      "Pro role, které pravidelně zpracovávají, kontrolují nebo prezentují data.",
  },
  {
    id: "productivity",
    title: "Maxikurz osobní produktivity",
    lecturer: "Daniel Gamrot",
    duration: "2 h 48 min",
    sourceUrl: "https://www.seduo.cz/maxikurz--osobni-produktivity",
    imageUrl: "https://seduocz.educdn.cz/images/126150-daniel-osobni-produktivita.jpg:preview3x",
    tags: ["general", "manager", "project", "hr", "ld", "marketing", "it", "sales"],
    stage: "Zakotvit základy",
    relevance: "Pomáhá vytvořit udržitelný systém práce s prioritami, úkoly a pozorností.",
    learning:
      "Jak si vyjasnit priority, vytvořit produktivní rutiny, pracovat s úkoly, návyky a soustředěním.",
    audience: "Pro manažery, členy týmů, OSVČ i další vytížené profesionály.",
  },
  {
    id: "manager-tips",
    title: "Manažerské tipy pro každý den: jak řešit nábor, výkon i konflikty",
    lecturer: "Filip Kahoun",
    duration: "1 h 55 min",
    sourceUrl: "https://www.seduo.cz/manazerske-tipy-pro-kazdy-den",
    imageUrl: "https://seduocz.educdn.cz/images/131057-filip-kahoun-tipy.jpg:preview3x",
    tags: ["manager", "hr"],
    stage: "Použít v praxi",
    relevance: "Přináší praktické postupy pro každodenní vedení lidí.",
    learning:
      "Jak pracovat s náborem, výkonem týmu, každodenní komunikací, náročnými kolegy a krizovými situacemi.",
    audience: "Pro začínající i zkušenější manažery a vedoucí týmů.",
  },
  {
    id: "influential-comms",
    title: "Vlivná komunikace. Umění zapojit ke spolupráci",
    lecturer: "Denis Bulejka",
    duration: "38 min",
    sourceUrl: "https://www.seduo.cz/vlivna-komunikace-umeni-zapojit-ke-spolupraci",
    imageUrl: "https://seduocz.educdn.cz/images/129125-vlivna-komunikace-cz.jpg:preview3x",
    tags: ["general", "manager", "project", "hr", "ld", "marketing", "it", "sales"],
    stage: "Rozšířit dovednosti",
    relevance: "Podporuje spolupráci napříč týmy i bez formální autority.",
    learning:
      "Jak získat spolupráci bez tlaku, budovat důvěru, komunikovat jasně a předcházet nedorozuměním.",
    audience: "Pro členy týmů, projektové role i manažery.",
  },
  {
    id: "conflicts",
    title: "Zvládání konfliktů v práci: jak udržet klid a najít řešení",
    lecturer: "Martina Georgievová",
    duration: "52 min",
    sourceUrl: "https://www.seduo.cz/zvladani-konfliktu-v-praci",
    imageUrl: "https://seduocz.educdn.cz/images/130109-geogrgievova-konflikty.jpg:preview3x",
    tags: ["manager", "hr", "ld", "sales", "general"],
    stage: "Použít v praxi",
    relevance: "Pomáhá zvládat napětí a hledat konstruktivní řešení pracovních konfliktů.",
    learning:
      "Jak rozpoznat obranné reakce, pracovat s emocemi, deeskalovat napětí a hledat řešení podle zájmů stran.",
    audience: "Pro manažery, HR, zákaznické role i členy týmů.",
  },
  {
    id: "customer-service",
    title: "Zákaznický servis: poskytování výjimečné zákaznické zkušenosti",
    lecturer: "Lucie Mešková",
    duration: "44 min",
    sourceUrl:
      "https://www.seduo.cz/zakaznicky-servis-poskytovani-vyjimecne-zakaznicke-zkusenosti",
    imageUrl: "https://seduocz.educdn.cz/images/130434-skvely-zakaznicky-servis-v3-cz.jpg:preview3x",
    tags: ["sales", "customer", "manager"],
    stage: "Použít v praxi",
    relevance: "Rozvíjí profesionální péči o zákazníka a zvládání náročných situací.",
    learning:
      "Jak porozumět potřebám zákazníka, řešit námitky a stížnosti a pracovat se standardy kvality.",
    audience:
      "Pro prodejce, recepční, pracovníky klientských center a vedoucí zákaznických týmů.",
  },
  {
    id: "production-master",
    title: "Mistr ve výrobě: jak vést pracovníky a získat respekt",
    lecturer: "Tomáš Železník",
    duration: "41 min",
    sourceUrl:
      "https://www.seduo.cz/mistr-ve-vyrobe-jak-vest-pracovniky-a-ziskat-respekt",
    imageUrl: "https://seduocz.educdn.cz/images/128162-tomas-zeleznik-mistr-ve-vyrobe-cz.jpg:preview3x",
    tags: ["production", "manager"],
    stage: "Zakotvit základy",
    relevance: "Řeší konkrétní situace při každodenním vedení lidí ve výrobním provozu.",
    learning:
      "Jak komunikovat s pracovníky, získat respekt, prosazovat pravidla, řešit konflikty a vést náročné rozhovory.",
    audience: "Pro výrobní mistry, supervizory a výrobní manažery.",
  },
  {
    id: "task-assignment",
    title: "Staňte se mistrem zadávání úkolů",
    lecturer: "Renata Novotná",
    duration: "41 min",
    sourceUrl: "https://www.seduo.cz/stante-se-mistrem-zadavani-ukolu",
    imageUrl: "https://seduocz.educdn.cz/images/110410-04-mzu-cz.jpeg:preview3x",
    tags: ["production", "manager", "assistant", "operations"],
    stage: "Použít v praxi",
    relevance: "Pomáhá zadávat práci srozumitelně a omezit chyby, nedorozumění a předělávání.",
    learning:
      "Zásady kvalitního zadání, přizpůsobení různým lidem, kontrolu úkolů a zpětnou vazbu.",
    audience: "Pro mistry, manažery, koordinátory a každého, kdo zadává práci druhým.",
  },
  {
    id: "leader-start",
    title: "Průvodce začínajícího lídra: jak získat respekt a nepohořet",
    lecturer: "Filip Kahoun",
    duration: "1 h 11 min",
    sourceUrl: "https://www.seduo.cz/pruvodce-zacinajiciho-lidra",
    imageUrl: "https://seduocz.educdn.cz/images/131052-filip-kahoun-pruvodce.jpg:preview3x",
    tags: ["production", "manager"],
    stage: "Zakotvit základy",
    relevance: "Dává praktický rámec pro bezpečný vstup do vedoucí role.",
    learning:
      "Očekávání od lídra, motivaci, rozvoj lidí, přechod z kolegy na nadřízeného a první kroky v roli.",
    audience: "Pro nové manažery, mistry a vedoucí týmů.",
  },
  {
    id: "quality-basics",
    title: "Úvod do řízení kvality",
    lecturer: "Miloslav Chlan",
    duration: "1 h 34 min",
    sourceUrl: "https://www.seduo.cz/uvod-do-rizeni-kvality",
    imageUrl: "https://seduocz.educdn.cz/images/122494-chlan-rizeni-kvality.jpg:preview3x",
    tags: ["production", "operations"],
    stage: "Rozšířit dovednosti",
    relevance: "Rozšiřuje provozní pohled o základní principy plánování, řízení a hodnocení kvality.",
    learning: "Základy kvality, uvažování kvalitáře, PDCA a základní nástroje kvality.",
    audience: "Pro lidi ve výrobě, kvalitě a navazujících průmyslových rolích.",
  },
];

type Microlearning = {
  title: string;
  duration: string;
  course: string;
  sourceUrl: string;
  tags: string[];
};

const microlearning: Microlearning[] = [
  {
    title: "Určete si jasné priority",
    duration: "3:22",
    course: "Projektové minimum: základy projektového řízení pro každého",
    sourceUrl: "https://www.seduo.cz/projektove-mininum",
    tags: ["project", "manager", "hr", "ld", "marketing", "production", "assistant", "operations", "general"],
  },
  {
    title: "Správně formulujte úkoly",
    duration: "5:38",
    course: "Projektové minimum: základy projektového řízení pro každého",
    sourceUrl: "https://www.seduo.cz/projektove-mininum",
    tags: ["project", "manager", "hr", "ld", "production", "assistant", "operations", "general"],
  },
  {
    title: "Nepleťte si naléhavé a důležité",
    duration: "3:14",
    course: "Maxikurz osobní produktivity",
    sourceUrl: "https://www.seduo.cz/maxikurz--osobni-produktivity",
    tags: ["general", "manager", "project", "hr", "ld", "marketing", "it", "sales", "production", "assistant", "operations"],
  },
  {
    title: "Zaměřte se na to, co má dopad",
    duration: "3:25",
    course: "Maxikurz osobní produktivity",
    sourceUrl: "https://www.seduo.cz/maxikurz--osobni-produktivity",
    tags: ["general", "manager", "project", "hr", "ld", "marketing", "it", "sales", "production", "assistant", "operations"],
  },
  {
    title: "Jak si správně říct o pomoc",
    duration: "4:23",
    course: "Vlivná komunikace. Umění zapojit ke spolupráci",
    sourceUrl: "https://www.seduo.cz/vlivna-komunikace-umeni-zapojit-ke-spolupraci",
    tags: ["general", "manager", "project", "hr", "ld", "marketing", "it", "sales", "production", "assistant", "operations"],
  },
  {
    title: "Jak předcházet konfliktům a nedorozuměním",
    duration: "3:32",
    course: "Vlivná komunikace. Umění zapojit ke spolupráci",
    sourceUrl: "https://www.seduo.cz/vlivna-komunikace-umeni-zapojit-ke-spolupraci",
    tags: ["general", "manager", "project", "hr", "ld", "sales", "production", "assistant", "operations"],
  },
  {
    title: "První pomoc při konfliktu: jak se uklidnit, když jste v konfliktu",
    duration: "3:57",
    course: "Zvládání konfliktů v práci: jak udržet klid a najít řešení",
    sourceUrl: "https://www.seduo.cz/zvladani-konfliktu-v-praci",
    tags: ["manager", "hr", "ld", "sales", "production", "assistant", "operations", "general"],
  },
  {
    title: "Námitka není útok",
    duration: "6:53",
    course: "Zákaznický servis: poskytování výjimečné zákaznické zkušenosti",
    sourceUrl:
      "https://www.seduo.cz/zakaznicky-servis-poskytovani-vyjimecne-zakaznicke-zkusenosti",
    tags: ["sales", "customer", "manager"],
  },
  {
    title: "Najít a nahradit",
    duration: "3:16",
    course: "Profíkem v Excelu za 7 hodin",
    sourceUrl: "https://www.seduo.cz/kurz-microsoft-excel",
    tags: ["analyst", "finance", "hr", "marketing", "general"],
  },
];

const seduoResources = [
  {
    icon: "🎬",
    title: "Katalog kurzů",
    description: "Oficiální seznam vzdělávacího obsahu Seduo.",
    url: "https://www.seduo.cz/seznam-kurzu-pdf",
  },
  {
    icon: "👨🏻",
    title: "Lektoři",
    description: "Profily odborníků a jejich kurzy.",
    url: "https://www.seduo.cz/lektori",
  },
  {
    icon: "🤷🏻",
    title: "Webináře #naživo",
    description: "Aktuální online webináře s možností přihlášení.",
    url: "https://www.seduo.cz/nazivo",
  },
  {
    icon: "👂🏻",
    title: "Podcasty",
    description: "Rozhovory a povídání s odborníky Seduo.",
    url: "https://www.seduo.cz/vsechny-kurzy?kompetence=831",
  },
  {
    icon: "🎓",
    title: "Vzdělávací programy",
    description: "Tematicky sestavené rozvojové programy.",
    url: "https://www.seduo.cz/vzdelavaci-programy",
  },
  {
    icon: "📚",
    title: "Akademie",
    description: "Výukové celky rozložené do několika týdnů.",
    url: "https://www.seduo.cz/akademie",
    note: "Mentální odolnost · 30. 9.–21. 10. 2026",
  },
  {
    icon: "⚡",
    title: "Microlearning",
    description: "Krátké praktické microkurzy; vyžaduje licenci Seduo + Microlearning.",
    url: "https://www.seduo.cz/stranka/microlearning",
  },
  {
    icon: "▶",
    title: "Seznámení se Seduo",
    description: "Desetiminutové video pro nové studenty.",
    url: "https://www.loom.com/share/6ffda844578343cd805457c6ba90b5e1",
  },
];

const contentTabs: { key: ContentTab; label: string; icon: string }[] = [
  { key: "courses", label: "Videokurzy", icon: "🎬" },
  { key: "microlearning", label: "Microlearning", icon: "⚡" },
  { key: "academies", label: "Akademie", icon: "📚" },
  { key: "webinars", label: "Webináře", icon: "◉" },
  { key: "podcasts", label: "Podcasty", icon: "🎧" },
  { key: "programs", label: "Programy", icon: "🎓" },
];

const featuredPodcasts = [
  {
    title: "Seduo podcast: První pomocí nejde ublížit",
    lecturer: "Marek Dvořák a Seduo.cz",
    duration: "42 min",
    rating: "98 %",
    description: "Co dělat u nehody, kdy volat záchranku a jak se nebát správně zahájit resuscitaci.",
    url: "https://www.seduo.cz/seduo-podcast-prvni-pomoci-nejde-ublizit",
    imageUrl: "https://seduocz.educdn.cz/images/126992-podcast-dvorak.jpg:preview3x",
  },
  {
    title: "Seduo podcast: Neztraťte klid, empatii a kontakt sami se sebou",
    lecturer: "Zuzana Čaputová a Seduo.cz",
    duration: "42 min",
    rating: "97 %",
    description: "O zvládání tlaku, empatii, autenticitě a návratu k vnitřnímu klidu.",
    url: "https://www.seduo.cz/seduo-podcast-neztratte-klid-empatii-a-kontakt-sami-se-sebou",
    imageUrl: "https://seduocz.educdn.cz/images/131959-podcast-caputova.jpg:preview3x",
  },
  {
    title: "Seduo podcast: Dejte vašemu tělu aspoň 11 minut denně",
    lecturer: "Michal Novotný a Seduo.cz",
    duration: "53 min",
    rating: "98 %",
    description: "Praktické principy pohybu, regenerace a péče o tělo při sedavé práci.",
    url: "https://www.seduo.cz/seduo-podcast-dejte-vasemu-telu-aspon-11-minut-denne",
    imageUrl: "https://seduocz.educdn.cz/images/131899-podcast-novotny.jpg:preview3x",
  },
  {
    title: "Seduo podcast: Průvodce spokojeným dnem od budíku až po usnutí",
    lecturer: "Jan Ženatý a Seduo.cz",
    duration: "1 h 01 min",
    rating: "96 %",
    description: "Jak pracovat s energií, soustředěním, odpočinkem a zdravým denním rytmem.",
    url: "https://www.seduo.cz/seduo-podcast-pruvodce-spokojenym-dnem-od-budiku-az-po-usnuti",
    imageUrl: "https://seduocz.educdn.cz/images/131069-podcast-zenaty.jpg:preview3x",
  },
];

const formatPortals: Record<Exclude<ContentTab, "courses" | "microlearning">, {
  title: string;
  description: string;
  url: string;
  linkLabel: string;
  imageUrl?: string;
  imageAlt?: string;
}> = {
  academies: {
    title: "Akademie mentální odolnosti",
    description: "Čtyřtýdenní podzimní Akademie s Janem Ženatým · 30. 9.–21. 10. 2026. Praktické nástroje pro zvládání tlaku, stresu a předcházení vyčerpání.",
    url: "https://www.seduo.cz/akademie",
    linkLabel: "Zobrazit Akademii",
    imageUrl: "https://www.seduo.cz/soubor/akademie-mentalni-odolnosti-ilustrace.png",
    imageAlt: "Oficiální ilustrace Akademie mentální odolnosti Seduo",
  },
  webinars: {
    title: "Webináře #naživo",
    description: "Živé online vzdělávání. Dostupnost a termíny se mění, proto odkazujeme přímo na aktuální nabídku.",
    url: "https://www.seduo.cz/nazivo",
    linkLabel: "Zobrazit aktuální webináře",
  },
  podcasts: {
    title: "Podcasty Seduo",
    description: "Rozhovory a audio obsah vhodný jako lehčí doplněk vzdělávacího plánu.",
    url: "https://www.seduo.cz/vsechny-kurzy?kompetence=831",
    linkLabel: "Procházet podcasty",
  },
  programs: {
    title: "Vzdělávací programy",
    description: "Tematicky sestavené celky pro souvislejší rozvoj. Konkrétní program vybírejte podle aktuální nabídky.",
    url: "https://www.seduo.cz/vzdelavaci-programy",
    linkLabel: "Zobrazit vzdělávací programy",
  },
};

const roleOptions = [
  "Generální ředitel",
  "Obchodní ředitel",
  "Finanční ředitel",
  "Personální ředitel",
  "Vedoucí oddělení",
  "Projektový manažer",
  "Vedoucí výroby",
  "Mistr výroby",
  "Operátor výroby",
  "Technik údržby",
  "Pracovník kvality",
  "HR specialista",
  "Obchodní zástupce",
  "Customer Service Specialist",
  "Procesní / výrobní inženýr",
];

const quickRoleOptions = [
  "Vedoucí oddělení",
  "Projektový manažer",
  "Mistr výroby",
  "Personalista",
  "Obchodní zástupce",
];

const roleGroups = [
  {
    title: "Management a vedení",
    icon: "◆",
    roles: ["Generální ředitel", "Obchodní ředitel", "Finanční ředitel", "Personální ředitel", "Vedoucí oddělení", "Projektový manažer", "Vedoucí výroby"],
  },
  {
    title: "Výroba, technika a provoz",
    icon: "⚙",
    roles: ["Mistr výroby", "Operátor výroby", "Technik údržby", "Pracovník kvality", "Procesní / výrobní inženýr", "Logistik"],
  },
  {
    title: "HR a rozvoj lidí",
    icon: "◎",
    roles: ["HR specialista", "Personalista", "Recruiter", "L&D specialista", "Mzdová účetní"],
  },
  {
    title: "Obchod, zákazníci a marketing",
    icon: "↗",
    roles: ["Obchodní zástupce", "Key Account Manager", "Customer Service Specialist", "Marketingový specialista", "Social Media Manager"],
  },
  {
    title: "Finance, data a IT",
    icon: "▥",
    roles: ["Účetní", "Controller", "Finanční analytik", "Datový analytik", "IT specialista", "Software Developer"],
  },
  {
    title: "Administrativa a organizace",
    icon: "◫",
    roles: ["Asistent vedení", "Office Manager", "Administrativní pracovník", "Nákupčí", "Učitel", "Sociální pracovník"],
  },
];

const roleProfiles = [
  {
    key: "ld",
    words: ["l&d", "learning", "vzděláv", "rozvoj lidí", "talent"],
    label: "L&D / rozvoj lidí",
    description:
      "Role propojuje potřeby lidí, týmů a byznysu do smysluplného vzdělávání a hlídá jeho praktický dopad.",
    skills: ["Analýza vzdělávacích potřeb", "Tvorba rozvojových plánů", "Facilitace", "Komunikace se stakeholdery", "Projektové řízení", "Vyhodnocování dopadu", "Práce s prioritami"],
    categories: ["HR a Právo", "Leadership", "Komunikace", "Projekty", "Produktivita"],
  },
  {
    key: "hr",
    words: ["hr", "personalist", "recruit", "nábor", "people", "human resources"],
    label: "HR",
    description:
      "Role pečuje o zaměstnaneckou zkušenost a podporuje manažery i zaměstnance v klíčových personálních situacích.",
    skills: ["Komunikace", "Nábor a adaptace", "Práce s talenty", "Pracovní organizace", "Řešení konfliktů", "Projektové řízení", "Práce s daty"],
    categories: ["HR a Právo", "Leadership", "Komunikace", "Projekty", "Digitální dovednosti"],
  },
  {
    key: "executive",
    words: ["generální ředitel", "ceo", "výkonný ředitel"],
    label: "Vrcholové řízení organizace",
    description:
      "Role určuje směr organizace, propojuje strategii s realizací, vede klíčové manažery a odpovídá za rozhodování napříč firmou.",
    skills: ["Strategické rozhodování", "Leadership", "Řízení změny", "Delegování", "Komunikace", "Práce se stakeholdery", "Prioritizace"],
    categories: ["Leadership", "Projekty", "Komunikace", "Produktivita", "Osobní rozvoj"],
  },
  {
    key: "sales-leader",
    words: ["obchodní ředitel", "sales director", "vedoucí obchodu"],
    label: "Řízení obchodu",
    description:
      "Role odpovídá za obchodní výsledky, vedení obchodního týmu, zákaznickou zkušenost a převod strategie do každodenního výkonu.",
    skills: ["Obchodní strategie", "Vedení týmu", "Řízení výkonu", "Vyjednávání", "Zákaznická zkušenost", "Komunikace", "Delegování"],
    categories: ["Obchod", "Leadership", "Komunikace", "Produktivita", "Projekty"],
  },
  {
    key: "finance-leader",
    words: ["finanční ředitel", "cfo", "finance director"],
    label: "Finanční řízení",
    description:
      "Role zajišťuje spolehlivé finanční řízení, kvalitní podklady pro rozhodování a srozumitelnou komunikaci výsledků vedení firmy.",
    skills: ["Finanční řízení", "Práce s daty", "Strategické rozhodování", "Reporting", "Leadership", "Projektové řízení", "Komunikace"],
    categories: ["Digitální dovednosti", "Leadership", "Projekty", "Komunikace", "Produktivita"],
  },
  {
    key: "hr-leader",
    words: ["personální ředitel", "hr director", "people director"],
    label: "Strategické řízení HR",
    description:
      "Role propojuje personální strategii s potřebami organizace, rozvíjí manažery a nastavuje prostředí pro výkon i růst lidí.",
    skills: ["HR strategie", "Rozvoj lidí", "Leadership", "Talent management", "Řízení změny", "Komunikace", "Práce s daty"],
    categories: ["HR a Právo", "Leadership", "Komunikace", "Projekty", "Digitální dovednosti"],
  },
  {
    key: "production",
    words: ["mistr ve výrobě", "mistr výroby", "výrobní mistr", "směnový mistr", "vedoucí výroby", "supervizor výroby", "předák", "výroba", "manufactur"],
    label: "Mistr / vedoucí ve výrobě",
    description:
      "Role převádí výrobní plán do každodenní práce směny, rozděluje úkoly, podporuje výkon a bezpečnou spolupráci a řeší provozní situace.",
    skills: ["Vedení směny", "Jasné zadávání úkolů", "Řízení výkonu", "Komunikace s týmem", "Řešení konfliktů", "Prioritizace", "Provozní zlepšování"],
    categories: ["Leadership", "Komunikace", "Produktivita", "Projekty", "Osobní rozvoj"],
  },
  {
    key: "assistant",
    words: ["asistent", "assistant", "office manager", "recepč", "sekret", "administrativ", "back office", "koordinátor kanceláře"],
    label: "Asistence / administrativa",
    description:
      "Role zajišťuje plynulý chod agendy, koordinuje úkoly a termíny, komunikuje napříč firmou a připravuje spolehlivé podklady.",
    skills: ["Organizace práce", "Prioritizace", "Koordinace úkolů", "Profesionální komunikace", "Microsoft Excel", "Řešení problémů", "Práce s termíny"],
    categories: ["Produktivita", "Komunikace", "Digitální dovednosti", "Projekty", "Osobní rozvoj"],
  },
  {
    key: "operations",
    words: ["provoz", "operativ", "logistik", "sklad", "nákup", "procurement", "supply chain", "kvalit", "quality", "facility", "dodavatel"],
    label: "Provoz / logistika / kvalita",
    description:
      "Role koordinuje procesy, termíny a návaznosti mezi lidmi či dodavateli a pomáhá udržet provoz spolehlivý a srozumitelně řízený.",
    skills: ["Plánování provozu", "Prioritizace", "Koordinace", "Řízení rizik", "Komunikace", "Řešení problémů", "Práce s daty"],
    categories: ["Projekty", "Produktivita", "Komunikace", "Digitální dovednosti", "Leadership"],
  },
  {
    key: "production-operator",
    words: ["operátor výroby", "výrobní operátor"],
    label: "Operátor výroby",
    description:
      "Role zajišťuje spolehlivé provedení výrobních úkolů, dodržování pracovních a kvalitativních standardů a spolupráci v rámci směny.",
    skills: ["Dodržování standardů", "Kvalita práce", "Týmová komunikace", "Organizace práce", "Řešení problémů", "Bezpečnost", "Práce s prioritami"],
    categories: ["Produktivita", "Komunikace", "Osobní rozvoj", "Digitální dovednosti", "Leadership"],
  },
  {
    key: "maintenance",
    words: ["technik údržby", "údržbář", "maintenance", "elektrotechnik"],
    label: "Technická údržba",
    description:
      "Role udržuje zařízení a provoz v bezpečném a spolehlivém stavu, řeší závady a koordinuje priority s výrobou.",
    skills: ["Řešení problémů", "Prioritizace", "Technická komunikace", "Plánování", "Práce s daty", "Spolupráce", "Řízení rizik"],
    categories: ["Projekty", "Produktivita", "Komunikace", "Digitální dovednosti", "Osobní rozvoj"],
  },
  {
    key: "quality",
    words: ["pracovník kvality", "specialista kvality", "quality specialist", "kontrolor kvality"],
    label: "Kvalita",
    description:
      "Role pomáhá plánovat, kontrolovat a zlepšovat kvalitu, pracuje s odchylkami a srozumitelně komunikuje požadavky napříč provozem.",
    skills: ["Řízení kvality", "Analýza odchylek", "Práce s daty", "Procesní myšlení", "Komunikace", "Řešení problémů", "Projektová spolupráce"],
    categories: ["Digitální dovednosti", "Projekty", "Komunikace", "Produktivita", "Leadership"],
  },
  {
    key: "process-engineer",
    words: ["procesní / výrobní inženýr", "procesní inženýr", "výrobní inženýr", "process engineer", "technolog", "lean specialista"],
    label: "Procesní / výrobní inženýrství",
    description:
      "Role analyzuje a zlepšuje výrobní procesy, zavádí změny a propojuje technické řešení s kvalitou, daty a potřebami provozu.",
    skills: ["Procesní zlepšování", "Projektové řízení", "Práce s daty", "Řízení kvality", "Analýza problémů", "Komunikace změn", "Prioritizace"],
    categories: ["Projekty", "Digitální dovednosti", "Produktivita", "Komunikace", "Leadership"],
  },
  {
    key: "manager",
    words: ["manaž", "manager", "vedouc", "team lead", "leader", "ředitel"],
    label: "Vedení lidí",
    description:
      "Role vytváří podmínky pro výkon týmu, nastavuje směr, rozděluje odpovědnost a řeší náročné situace.",
    skills: ["Vedení lidí", "Delegování", "Zpětná vazba", "Řízení výkonu", "Komunikace", "Řešení konfliktů", "Projektové řízení"],
    categories: ["Leadership", "Komunikace", "Projekty", "Produktivita", "HR a Právo"],
  },
  {
    key: "project",
    words: ["projekt", "project", "product owner", "scrum", "koordinátor"],
    label: "Projektové řízení",
    description:
      "Role převádí zadání do plánu, propojuje stakeholdery a udržuje rozsah, termíny, rizika i komunikaci pod kontrolou.",
    skills: ["Plánování", "Řízení rizik", "Práce se stakeholdery", "Prioritizace", "Reporting", "Týmová komunikace", "Facilitace"],
    categories: ["Projekty", "Komunikace", "Produktivita", "Leadership", "Digitální dovednosti"],
  },
  {
    key: "analyst",
    words: ["analyt", "controll", "finance", "účet", "data", "report", "auditor", "ekonom"],
    label: "Analytická role",
    description:
      "Role převádí data do srozumitelných podkladů pro rozhodování a dbá na přesnost, strukturu a interpretaci.",
    skills: ["Analytické myšlení", "Práce s daty", "Microsoft Excel", "Vizualizace", "Interpretace výsledků", "Prezentace", "Prioritizace"],
    categories: ["Digitální dovednosti", "Prezentace", "Produktivita", "Komunikace", "Projekty"],
  },
  {
    key: "sales",
    words: ["obchod", "sales", "account", "customer", "zákaz", "klient", "prodej"],
    label: "Obchod / péče o zákazníka",
    description:
      "Role rozvíjí vztahy se zákazníky, hledá jejich potřeby a převádí je do důvěryhodného řešení a dlouhodobé spolupráce.",
    skills: ["Péče o zákazníka", "Aktivní naslouchání", "Vyjednávání", "Práce s námitkami", "Prezentace hodnoty", "Organizace práce", "Řešení konfliktů"],
    categories: ["Obchod", "Komunikace", "Prezentace", "Produktivita", "Osobní rozvoj"],
  },
  {
    key: "marketing",
    words: ["marketing", "brand", "content", "social", "copy"],
    label: "Marketing",
    description:
      "Role propojuje potřeby publika, značku, obsah a kampaně a vyhodnocuje, co přináší očekávaný dopad.",
    skills: ["Práce s publikem", "Tvorba obsahu", "Projektové řízení", "Analytika", "Prezentace", "Komunikace", "Prioritizace"],
    categories: ["Marketing", "Komunikace", "Prezentace", "Projekty", "Digitální dovednosti"],
  },
  {
    key: "it",
    words: ["it ", "developer", "vývoj", "program", "tech", "admin", "software"],
    label: "IT / technická role",
    description:
      "Role řeší technické potřeby spolehlivě a srozumitelně, spolupracuje se zadavateli a dodává změny v dohodnuté kvalitě.",
    skills: ["Řešení problémů", "Technická komunikace", "Projektová spolupráce", "Prioritizace", "Dokumentace", "Práce se stakeholdery", "Soustředění"],
    categories: ["Digitální dovednosti", "Projekty", "Produktivita", "Komunikace", "Osobní rozvoj"],
  },
];

const fallbackProfile = {
  key: "general",
  label: "Obecná profesní role",
  description:
    "Zadanou profesi nelze bezpečně přiřadit k užšímu profilu. Plán proto stojí jen na přenositelných dovednostech.",
  skills: ["Komunikace", "Organizace práce", "Prioritizace", "Spolupráce", "Řešení problémů"],
  categories: ["Komunikace", "Produktivita", "Osobní rozvoj", "Projekty"],
};

const exactRoleProfile: Record<string, string> = {
  "generální ředitel": "executive",
  "obchodní ředitel": "sales-leader",
  "finanční ředitel": "finance-leader",
  "personální ředitel": "hr-leader",
  "vedoucí oddělení": "manager",
  "projektový manažer": "project",
  "vedoucí výroby": "production",
  "mistr výroby": "production",
  "operátor výroby": "production-operator",
  "technik údržby": "maintenance",
  "pracovník kvality": "quality",
  "hr specialista": "hr",
  "obchodní zástupce": "sales",
  "customer service specialist": "sales",
  "procesní / výrobní inženýr": "process-engineer",
  "logistik": "operations",
  "personalista": "hr",
  "recruiter": "hr",
  "l&d specialista": "ld",
  "mzdová účetní": "hr",
  "key account manager": "sales",
  "marketingový specialista": "marketing",
  "social media manager": "marketing",
  "účetní": "analyst",
  "controller": "analyst",
  "finanční analytik": "analyst",
  "datový analytik": "analyst",
  "it specialista": "it",
  "software developer": "it",
  "asistent vedení": "assistant",
  "office manager": "assistant",
  "administrativní pracovník": "assistant",
  "nákupčí": "operations",
  "učitel": "general",
  "sociální pracovník": "general",
};

export function findProfile(role: string) {
  const normalized = role.toLocaleLowerCase("cs").trim();
  const exactKey = exactRoleProfile[normalized];
  if (exactKey) {
    return roleProfiles.find((profile) => profile.key === exactKey) ?? fallbackProfile;
  }

  return (
    roleProfiles.find((profile) =>
      profile.words.some((word) => normalized.includes(word)),
    ) ?? fallbackProfile
  );
}

const roleCoursePriority: Record<string, string[]> = {
  executive: ["leadership-max", "manager-tips", "project-atoz", "communication-self-defense", "influential-comms", "mental-resilience", "productivity", "task-assignment", "project-minimum", "cyber-security"],
  "sales-leader": ["modern-sales", "customer-service", "leadership-max", "communication-self-defense", "influential-comms", "conflicts", "manager-tips", "task-assignment", "productivity", "project-atoz"],
  "finance-leader": ["power-bi", "excel", "leadership-max", "project-atoz", "cyber-security", "influential-comms", "productivity", "manager-tips", "project-minimum", "mental-resilience"],
  "hr-leader": ["labor-law", "recruitment", "ld-smart", "leadership-max", "manager-tips", "conflicts", "influential-comms", "project-minimum", "excel", "canva"],
  ld: ["ld-smart", "canva", "project-minimum", "influential-comms", "productivity", "conflicts", "recruitment", "project-atoz", "excel", "labor-law"],
  hr: ["recruitment", "labor-law", "ld-smart", "conflicts", "influential-comms", "excel", "project-minimum", "canva", "productivity", "manager-tips"],
  production: ["production-master", "task-assignment", "quality-basics", "leadership-max", "conflicts", "project-minimum", "manager-tips", "influential-comms", "productivity", "cyber-security"],
  "production-operator": ["quality-basics", "cyber-security", "influential-comms", "productivity", "mental-resilience", "conflicts", "project-minimum", "task-assignment", "production-master", "excel"],
  maintenance: ["cyber-security", "quality-basics", "project-minimum", "productivity", "excel", "project-atoz", "mental-resilience", "influential-comms", "task-assignment", "production-master"],
  quality: ["quality-basics", "power-bi", "excel", "project-minimum", "project-atoz", "cyber-security", "influential-comms", "productivity", "conflicts", "task-assignment"],
  "process-engineer": ["quality-basics", "power-bi", "project-atoz", "ai-project", "project-minimum", "excel", "productivity", "influential-comms", "task-assignment", "cyber-security"],
  assistant: ["productivity", "excel", "canva", "project-minimum", "cyber-security", "influential-comms", "communication-self-defense", "task-assignment", "project-atoz", "customer-service"],
  operations: ["project-atoz", "ai-project", "project-minimum", "quality-basics", "cyber-security", "task-assignment", "excel", "influential-comms", "productivity", "conflicts"],
  manager: ["leadership-max", "manager-tips", "leader-start", "task-assignment", "communication-self-defense", "conflicts", "influential-comms", "project-atoz", "productivity", "labor-law"],
  project: ["ai-project", "project-atoz", "project-minimum", "power-bi", "influential-comms", "productivity", "communication-self-defense", "conflicts", "excel", "task-assignment"],
  analyst: ["power-bi", "excel", "project-minimum", "cyber-security", "productivity", "influential-comms", "project-atoz", "communication-self-defense", "conflicts", "quality-basics"],
  sales: ["modern-sales", "customer-service", "communication-self-defense", "influential-comms", "conflicts", "productivity", "project-minimum", "manager-tips", "excel", "mental-resilience"],
  marketing: ["canva", "project-minimum", "project-atoz", "excel", "influential-comms", "productivity", "communication-self-defense", "customer-service", "cyber-security", "conflicts"],
  it: ["cyber-security", "ai-project", "project-atoz", "productivity", "project-minimum", "influential-comms", "communication-self-defense", "excel", "conflicts", "quality-basics"],
  general: ["productivity", "communication-self-defense", "influential-comms", "project-minimum", "cyber-security", "mental-resilience", "conflicts", "excel", "project-atoz", "task-assignment"],
};

const seniorityStageScore: Record<Seniority, Record<Stage, number>> = {
  junior: {
    "Zakotvit základy": 14,
    "Rozšířit dovednosti": 5,
    "Použít v praxi": 7,
  },
  medior: {
    "Zakotvit základy": 6,
    "Rozšířit dovednosti": 11,
    "Použít v praxi": 9,
  },
  senior: {
    "Zakotvit základy": 1,
    "Rozšířit dovednosti": 11,
    "Použít v praxi": 14,
  },
};

const seniorityCourseScore: Record<Seniority, Record<string, number>> = {
  junior: {
    "leader-start": 12,
    "task-assignment": 8,
    "project-minimum": 6,
    productivity: 5,
    "communication-self-defense": 4,
    "leadership-max": -5,
  },
  medior: {
    "manager-tips": 6,
    "leadership-max": 5,
    "task-assignment": 4,
    conflicts: 4,
    "influential-comms": 4,
    "project-atoz": 3,
    "leader-start": 2,
  },
  senior: {
    "leadership-max": 12,
    "manager-tips": 8,
    "influential-comms": 7,
    conflicts: 6,
    "project-atoz": 5,
    "mental-resilience": 4,
    "task-assignment": -3,
    "project-minimum": -4,
    "leader-start": -9,
  },
};

export function chooseCourses(profileKey: string, seniority: Seniority) {
  const priority = roleCoursePriority[profileKey] ?? roleCoursePriority.general;
  const priorityPosition = new Map(priority.map((id, index) => [id, index]));
  const relevantCourses = courses.filter(
    (course) =>
      priorityPosition.has(course.id) ||
      course.tags.includes(profileKey) ||
      course.tags.includes("general"),
  );

  const roleCourses = relevantCourses
    .map((course) => {
      const index = priorityPosition.get(course.id);
      const rolePriorityScore =
        index === undefined ? 0 : (priority.length - index) * 3;
      const roleTagScore = course.tags.includes(profileKey) ? 8 : 0;
      const transferableScore = course.tags.includes("general") ? 1 : 0;
      const stageScore = seniorityStageScore[seniority][course.stage];
      const courseScore = seniorityCourseScore[seniority][course.id] ?? 0;

      return {
        course,
        score:
          rolePriorityScore +
          roleTagScore +
          transferableScore +
          stageScore +
          courseScore,
      };
    })
    .sort((a, b) => b.score - a.score)
    .map(({ course }) => course);

  const primary = roleCourses.slice(0, 9);
  const secondaryIds = [
    "ai-maxikurz",
    "mental-resilience",
    ...roleCourses.slice(9).map((course) => course.id),
    "communication-self-defense",
    "cyber-security",
    "productivity",
    "influential-comms",
    "project-minimum",
    "conflicts",
  ].filter((id): id is string => Boolean(id));
  const secondary = secondaryIds
    .map((id) => courses.find((course) => course.id === id))
    .filter((course): course is Course => Boolean(course))
    .filter(
      (course, index, items) =>
        !primary.some((primaryCourse) => primaryCourse.id === course.id) &&
        items.findIndex((item) => item.id === course.id) === index,
    )
    .slice(0, 3);

  return [...primary, ...secondary];
}

function chooseMicrolearning(profileKey: string) {
  const exactMatches = microlearning.filter((item) => item.tags.includes(profileKey));
  const transferableSkills = microlearning.filter((item) => item.tags.includes("general"));
  const verifiedSelection = [...exactMatches, ...transferableSkills].filter(
    (item, index, items) =>
      items.findIndex(
        (candidate) =>
          candidate.title === item.title && candidate.sourceUrl === item.sourceUrl,
      ) === index,
  );

  return verifiedSelection.slice(0, 4);
}

export default function Home() {
  const [role, setRole] = useState("L&D specialista");
  const [seniority, setSeniority] = useState<Seniority>("medior");
  const [submitted, setSubmitted] = useState({ role, seniority });
  const [activeTab, setActiveTab] = useState<ContentTab>("courses");
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const profile = useMemo(() => findProfile(submitted.role), [submitted.role]);
  const selectedCourses = useMemo(
    () => chooseCourses(profile.key, submitted.seniority),
    [profile.key, submitted.seniority],
  );
  const selectedMicrolearning = useMemo(
    () => chooseMicrolearning(profile.key),
    [profile.key],
  );
  const primaryCourses = selectedCourses.slice(0, 9);
  const secondaryCourses = selectedCourses.slice(9, 12);
  const foundationCourses = selectedCourses
    .filter((course) => course.stage === "Zakotvit základy")
    .slice(0, 2);
  const developmentCourses = selectedCourses
    .filter((course) => course.stage === "Rozšířit dovednosti")
    .slice(0, 2);
  const practiceCourses = selectedCourses
    .filter((course) => course.stage === "Použít v praxi")
    .slice(0, 1);
  const wellbeingCourse = courses.find((course) => course.id === "mental-resilience");
  const topCourse = courses.find((course) => course.id === "communication-self-defense");
  const roadmapSteps = [
    {
      months: "Měsíc 1",
      title: "Zorientovat se v roli",
      description: "Začněte nejdůležitějšími základy a jedním konkrétním pracovním návykem.",
      courses: foundationCourses,
      task: "Vyberte jednu situaci, ve které novou dovednost použijete ještě tento týden.",
    },
    {
      months: "Měsíc 2–3",
      title: "Rozvinout klíčové dovednosti",
      description: "Prohlubte odbornost a přidejte praktické digitální nebo AI dovednosti.",
      courses: developmentCourses,
      task: "Vytvořte malý výstup pro svou práci a požádejte kolegu o zpětnou vazbu.",
    },
    {
      months: "Měsíc 4",
      title: "Wellbeing a odolnost",
      description: "Zastavte se u energie, zvládání tlaku a dlouhodobě udržitelného výkonu.",
      courses: wellbeingCourse ? [wellbeingCourse] : [],
      task: "Zaveďte jeden krátký regenerační návyk a sledujte jeho dopad po dobu 14 dnů.",
      badge: "WELLBEING",
    },
    {
      months: "Měsíc 5–6",
      title: "Použít, sdílet a upevnit",
      description: "Přeneste učení do reálné situace a uzavřete cestu sdílením zkušenosti.",
      courses: [
        ...(topCourse ? [topCourse] : []),
        ...practiceCourses,
      ].slice(0, 2),
      task: "Použijte dovednost v praxi, zhodnoťte výsledek a domluvte si další rozvojový krok.",
      badge: "TOP 1 · KVĚTEN 2026",
    },
  ];

  function submit(event: FormEvent) {
    event.preventDefault();
    if (role.trim()) {
      setSubmitted({ role: role.trim(), seniority });
      setActiveTab("courses");
      setRoleMenuOpen(false);
    }
  }

  function selectRole(nextRole: string) {
    setRole(nextRole);
    setSubmitted({ role: nextRole, seniority });
    setActiveTab("courses");
    setRoleMenuOpen(false);
  }

  const seniorityLabel = {
    junior: "Junior",
    medior: "Medior",
    senior: "Senior",
  }[submitted.seniority];

  const renderCourseCard = (course: Course, priority: "Hlavní volba" | "Doplňkový kurz") => (
    <article className={`course-card ${priority === "Hlavní volba" ? "course-card-primary" : ""}`} key={course.id}>
      <div className="course-cover">
        <img src={course.imageUrl} alt={`Náhled kurzu ${course.title}`} />
        <span aria-hidden="true">{priority === "Hlavní volba" ? "★" : "＋"}</span>
        <small>{course.stage}</small>
      </div>
      <div className="course-body">
        <div className="course-label-row">
          <span className="priority-label">{priority}</span>
          <span className="course-duration">
            {course.duration}{course.rating ? ` · ★ ${course.rating}` : ""}
          </span>
        </div>
        <h3>
          <a href={course.sourceUrl} target="_blank" rel="noreferrer">{course.title}</a>
        </h3>
        <p className="lecturer">Lektor/ka: <strong>{course.lecturer}</strong></p>
        <p className="course-relevance">{course.relevance}</p>
        <div className="course-facts">
          <p><span>✓</span>{course.learning}</p>
          <p><span>✓</span>{course.audience}</p>
        </div>
        <div className="course-links">
          <a href={course.sourceUrl} target="_blank" rel="noreferrer">Otevřít kurz ↗</a>
          <a href={CATALOG_URL} target="_blank" rel="noreferrer">Celý katalog Seduo</a>
        </div>
      </div>
    </article>
  );

  return (
    <main id="top">
      <header className="hero">
        <nav className="topbar">
          <a className="brand" href="#top" aria-label="Seduo Plán domů">
            <span className="brand-mark">s</span>
            <span>seduo plán</span>
          </a>
          <div className="verified-pill"><span>✓</span> Ověřený katalog</div>
        </nav>

        <div className="hero-content">
          <p className="eyebrow">✣ L&amp;D KARIÉRNÍ ASISTENT SEDUO</p>
          <h1>Vzdělávací plán<br />pro každou profesi</h1>
          <p className="hero-lead">
            Hlavní i doplňkové kurzy a krátké ověřené lekce — vždy jen z přesně
            dohledatelných zdrojů Seduo.cz.
          </p>
          <div className="hero-stats">
            <div><strong>400+</strong><span>videokurzů Seduo</span></div>
            <div><strong>300+</strong><span>Microlearning kurzů</span></div>
            <div><strong>12</strong><span>doporučených kurzů pro vás</span></div>
            <div><strong>6 měsíců</strong><span>navazující rozvoj</span></div>
          </div>
        </div>
      </header>

      <div className="page-shell">
        <form className="search-card" onSubmit={submit}>
          <div className="search-copy">
            <p>✣ Bezpečné doporučení</p>
            <h2>Koho chcete rozvíjet?</h2>
            <span>Zadejte profesi a senioritu. Uvidíte pouze ověřitelné položky.</span>
          </div>
          <div className="search-controls">
            <label htmlFor="role">Vyberte nebo napište profesi</label>
            <div className="role-row">
              <div className="role-picker">
                <input
                  id="role"
                  value={role}
                  onChange={(event) => {
                    setRole(event.target.value);
                    setRoleMenuOpen(true);
                  }}
                  onFocus={() => setRoleMenuOpen(true)}
                  placeholder="Např. Generální ředitel"
                  autoComplete="organization-title"
                  aria-expanded={roleMenuOpen}
                  aria-controls="role-picker-menu"
                  aria-haspopup="dialog"
                />
                <button
                  className="role-picker-toggle"
                  type="button"
                  aria-label={roleMenuOpen ? "Skrýt výběr profesí" : "Zobrazit výběr profesí"}
                  onClick={() => setRoleMenuOpen((open) => !open)}
                >
                  <span aria-hidden="true">⌄</span>
                </button>
                {roleMenuOpen && (
                  <div className="role-picker-menu" id="role-picker-menu">
                    <div className="role-picker-menu-head">
                      <div>
                        <strong>Vyberte profesi</strong>
                        <span>{roleGroups.reduce((sum, group) => sum + group.roles.length, 0)} rolí podle oblastí</span>
                      </div>
                      <button
                        type="button"
                        aria-label="Zavřít výběr profesí"
                        onClick={() => setRoleMenuOpen(false)}
                      >
                        ×
                      </button>
                    </div>
                    <div className="role-picker-groups">
                      {roleGroups.map((group) => (
                        <details className="role-group" key={group.title}>
                          <summary>
                            <span className="role-group-icon" aria-hidden="true">{group.icon}</span>
                            <strong>{group.title}</strong>
                            <small>{group.roles.length} rolí</small>
                            <b aria-hidden="true">⌄</b>
                          </summary>
                          <div className="role-group-list">
                            {group.roles.map((groupRole) => (
                              <button type="button" onClick={() => selectRole(groupRole)} key={groupRole}>
                                {groupRole}<span aria-hidden="true">→</span>
                              </button>
                            ))}
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <select
                aria-label="Seniorita"
                value={seniority}
                onChange={(event) => {
                  const nextSeniority = event.target.value as Seniority;
                  setSeniority(nextSeniority);
                  setSubmitted((current) => ({
                    ...current,
                    seniority: nextSeniority,
                  }));
                  setActiveTab("courses");
                }}
              >
                <option value="junior">Junior</option>
                <option value="medior">Medior</option>
                <option value="senior">Senior</option>
              </select>
              <button type="submit">Vytvořit plán <span>→</span></button>
            </div>
            <div className="examples" aria-label="Příklady profesí">
              <span>Zkuste:</span>
              {quickRoleOptions.map((example) => (
                <button
                  type="button"
                  key={example}
                  onClick={() => selectRole(example)}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </form>

        <section className="result-shell" aria-live="polite">
          <div className="result-heading">
            <div>
              <p className="section-number">VZDĚLÁVACÍ PLÁN</p>
              <h2>{submitted.role}</h2>
            </div>
            <p className="source-stamp">Ověřeno {VERIFIED_AT}<strong>{seniorityLabel}</strong></p>
          </div>

          <div className="analysis-grid">
            <article className="role-card">
              <div className="analysis-icon">◎</div>
              <div>
                <p className="card-kicker">ANALÝZA ROLE</p>
                <h3>{profile.label}</h3>
                <p>{profile.description}</p>
              </div>
            </article>
            <article className="skills-card">
              <p className="card-kicker">KLÍČOVÉ DOVEDNOSTI</p>
              <div className="skill-list">
                {profile.skills.map((skill) => <span key={skill}>✓ {skill}</span>)}
              </div>
            </article>
          </div>

          <div className="content-tabs" role="tablist" aria-label="Formáty vzdělávacího plánu">
            {contentTabs.map((tab) => (
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === tab.key}
                className={activeTab === tab.key ? "active" : ""}
                onClick={() => setActiveTab(tab.key)}
                key={tab.key}
              >
                <span aria-hidden="true">{tab.icon}</span>
                {tab.label}
                {tab.key === "courses" && <b>{selectedCourses.length}</b>}
                {tab.key === "microlearning" && <b>{selectedMicrolearning.length}</b>}
              </button>
            ))}
          </div>

          {activeTab === "courses" && (selectedCourses.length ? (
            <>
              <section className="recommendation-section">
                <div className="section-heading">
                  <div className="section-icon">★</div>
                  <div>
                    <p className="section-number">9 NEJSILNĚJŠÍCH SHOD</p>
                    <h2>Hlavní doporučené videokurzy</h2>
                    <span>Nejpřímější ověřené shody s rolí a senioritou.</span>
                  </div>
                </div>
                <div className="primary-grid">
                  {primaryCourses.map((course) => renderCourseCard(course, "Hlavní volba"))}
                </div>
              </section>

              {secondaryCourses.length > 0 && (
                <section className="recommendation-section secondary-section">
                  <div className="section-heading">
                    <div className="section-icon soft">＋</div>
                    <div>
                      <p className="section-number">ŠIRŠÍ ROZVOJ</p>
                      <h2>Vedlejší vhodné kurzy</h2>
                      <span>Další 3 ověřené kurzy pro širší profesní rozvoj.</span>
                    </div>
                  </div>
                  <div className="secondary-grid">
                    {secondaryCourses.map((course) => renderCourseCard(course, "Doplňkový kurz"))}
                  </div>
                </section>
              )}
            </>
          ) : (
            <div className="empty-state">
              <span>!</span>
              <div>
                <h3>Pro tuto profesi nemáme dostatečně jistou shodu.</h3>
                <p>Konkrétní kurzy ani microlearning proto neuvádíme. Použijte bezpečné kategorie níže.</p>
              </div>
            </div>
          ))}

          {activeTab === "microlearning" && (
            selectedMicrolearning.length > 0 ? (
              <section className="micro-section tab-panel">
                <div className="section-heading">
                  <div className="section-icon micro">⚡</div>
                  <div>
                    <p className="section-number">KRÁTKÉ OVĚŘENÉ LEKCE</p>
                    <h2>Microlearning do pracovního týdne</h2>
                    <span>Konkrétní krátké lekce; dostupnost závisí na licenci Seduo + Microlearning.</span>
                  </div>
                </div>
                <div className="micro-grid">
                  {selectedMicrolearning.map((item, index) => (
                    <a className="micro-card" href={item.sourceUrl} target="_blank" rel="noreferrer" key={`${item.title}-${index}`}>
                      <div className="micro-thumb">
                        <img
                          src={courses.find((course) => course.sourceUrl === item.sourceUrl)?.imageUrl}
                          alt=""
                        />
                        <span aria-hidden="true">▶</span>
                      </div>
                      <div>
                        <span>{item.duration} min</span>
                        <h3>{item.title}</h3>
                        <p>Z kurzu: {item.course}</p>
                      </div>
                      <b>↗</b>
                    </a>
                  ))}
                </div>
                <a className="portal-link" href="https://www.seduo.cz/stranka/microlearning" target="_blank" rel="noreferrer">
                  Otevřít nabídku Microlearning Seduo ↗
                </a>
              </section>
            ) : (
              <div className="empty-state">
                <span>!</span>
                <div>
                  <h3>Pro tuto profesi nemáme ověřenou konkrétní microlekci.</h3>
                  <p>Otevřete aktuální nabídku Microlearning přímo na Seduo.</p>
                </div>
              </div>
            )
          )}

          {activeTab === "podcasts" && (
            <section className="podcast-section tab-panel">
              <div className="section-heading">
                <div className="section-icon podcast">🎧</div>
                <div>
                  <p className="section-number">OVĚŘENÝ VÝBĚR SEDUO</p>
                  <h2>Podcasty pro lehčí rozvoj</h2>
                  <span>Aktuální univerzální témata pro wellbeing, odolnost a zdravý pracovní rytmus.</span>
                </div>
              </div>
              <div className="podcast-grid">
                {featuredPodcasts.map((podcast) => (
                  <a
                    className="podcast-card"
                    href={podcast.url}
                    target="_blank"
                    rel="noreferrer"
                    key={podcast.title}
                  >
                    <div className="podcast-cover">
                      <img src={podcast.imageUrl} alt={`Náhled podcastu ${podcast.title}`} />
                      <span aria-hidden="true">▶</span>
                    </div>
                    <div className="podcast-body">
                      <div>
                        <small>{podcast.duration}</small>
                        <b>★ {podcast.rating}</b>
                      </div>
                      <h3>{podcast.title}</h3>
                      <p>{podcast.lecturer}</p>
                      <span>{podcast.description}</span>
                      <strong>Otevřít podcast ↗</strong>
                    </div>
                  </a>
                ))}
              </div>
              <a
                className="portal-link"
                href="https://www.seduo.cz/kategorie/podcasty"
                target="_blank"
                rel="noreferrer"
              >
                Procházet všechny podcasty Seduo ↗
              </a>
            </section>
          )}

          {activeTab !== "courses" && activeTab !== "microlearning" && activeTab !== "podcasts" && (() => {
            const portal = formatPortals[activeTab];
            return (
              <section className="format-portal tab-panel">
                {portal.imageUrl ? (
                  <div className="format-portal-image">
                    <img src={portal.imageUrl} alt={portal.imageAlt ?? ""} />
                  </div>
                ) : (
                  <div className="format-portal-icon" aria-hidden="true">
                    {contentTabs.find((tab) => tab.key === activeTab)?.icon}
                  </div>
                )}
                <div>
                  <p className="section-number">OVĚŘENÝ ROZCESTNÍK</p>
                  <h2>{portal.title}</h2>
                  <p>{portal.description}</p>
                  <a href={portal.url} target="_blank" rel="noreferrer">{portal.linkLabel} ↗</a>
                </div>
              </section>
            );
          })()}

          <section className="categories">
            <div>
              <p className="section-number">BEZPEČNÁ ALTERNATIVA</p>
              <h2>Relevantní kategorie Seduo</h2>
            </div>
            <div className="category-tags">
              {profile.categories.map((category) => (
                <a
                  href={CATEGORY_URLS[category] ?? CATALOG_URL}
                  target="_blank"
                  rel="noreferrer"
                  key={category}
                >
                  {category}<span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </section>

          <section className="roadmap">
            <div className="section-heading">
              <div className="section-icon">6</div>
              <div>
                <p className="section-number">NAVAZUJÍCÍ ROZVOJ</p>
                <h2>Jednoduchá 6měsíční vzdělávací cesta</h2>
                <span>Odbornost, AI, wellbeing a bezpečný přenos nových dovedností do praxe.</span>
              </div>
            </div>
            <div className="timeline">
              {roadmapSteps.map((step, index) => (
                  <article key={step.title} className="timeline-step">
                    <div className="timeline-number">{index + 1}</div>
                    <div className="timeline-meta">
                      <p>{step.months}</p>
                      {step.badge && <span>{step.badge}</span>}
                    </div>
                    <h3>{step.title}</h3>
                    <p className="timeline-description">{step.description}</p>
                    {step.courses.length ? (
                      <ul>
                        {step.courses.map((course) => (
                          <li key={course.id}>
                            <a href={course.sourceUrl} target="_blank" rel="noreferrer">
                              <img src={course.imageUrl} alt="" />
                              <span>
                                <strong>{course.title}</strong>
                                <small>{course.lecturer} · {course.duration}</small>
                              </span>
                              <b aria-hidden="true">↗</b>
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="no-course">Bez konkrétní ověřené shody.</span>
                    )}
                    <div className="timeline-task">
                      <strong>Praktický krok</strong>
                      <span>{step.task}</span>
                    </div>
                  </article>
                ))}
            </div>
          </section>

          <section className="resources-section">
            <div className="section-heading">
              <div className="section-icon resources">↗</div>
              <div>
                <p className="section-number">OFICIÁLNÍ ZDROJE SEDUO</p>
                <h2>Další formáty pro vzdělávací plán</h2>
                <span>Ověřené rozcestníky pro doplnění kurzu o živé, krátké nebo navazující formáty.</span>
              </div>
            </div>
            <div className="resources-grid">
              {seduoResources.map((resource) => (
                <a href={resource.url} target="_blank" rel="noreferrer" className="resource-card" key={resource.title}>
                  <span className="resource-icon" aria-hidden="true">{resource.icon}</span>
                  <div>
                    <h3>{resource.title}</h3>
                    <p>{resource.description}</p>
                    {resource.note && <small>{resource.note}</small>}
                  </div>
                  <b aria-hidden="true">↗</b>
                </a>
              ))}
            </div>
          </section>
        </section>
      </div>

      <footer>
        <div className="footer-brand"><span className="brand-mark">s</span><strong>Seduo Plán</strong></div>
        <p>Doporučení vychází pouze z ručně ověřených detailů kurzů a lekcí. Před přiřazením vždy zkontrolujte ověřovací zdroj.</p>
        <a href={CATALOG_URL} target="_blank" rel="noreferrer">Seznam kurzů Seduo.cz ↗</a>
      </footer>
    </main>
  );
}
