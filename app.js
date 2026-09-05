"use strict";

/* =========================================================
   Deutsch Trainer
   Dictionary Edition
========================================================= */


/* =========================================================
   Configuration
========================================================= */

const CONFIG = {
  maxCardFiles: 20,

  todayCount: 5,

  storage: {
    bookmarks: "deutsch_trainer_bookmarks_v2",
    learningStatus: "deutsch_trainer_learning_status_v2",
    todayWords: "deutsch_trainer_today_words_v2",
    uiLanguage: "deutsch_trainer_ui_language_v2"
  },

  validPos: [
    "noun",
    "verb",
    "adj",
    "adv",
    "prep",
    "conj",
    "pron",
    "particle",
    "interj",
    "phrase",
    "idiom"
  ]
};


/* =========================================================
   State
========================================================= */

const state = {
  cards: [],
  filteredCards: [],

  bookmarks: new Set(),
  learningStatus: {},

  todayWordIds: [],

  selectedCard: null,

  uiLanguage: "ja"
};


/* =========================================================
   DOM
========================================================= */

const dom = {
  dictionaryView:
    document.getElementById("dictionaryView"),

  detailView:
    document.getElementById("detailView"),

  wordCount:
    document.getElementById("wordCount"),

  languageToggle:
    document.getElementById("languageToggle"),

  todayWordList:
    document.getElementById("todayWordList"),

  refreshTodayButton:
    document.getElementById("refreshTodayButton"),

  searchInput:
    document.getElementById("searchInput"),

  clearSearchButton:
    document.getElementById("clearSearchButton"),

  levelFilter:
    document.getElementById("levelFilter"),

  posFilter:
    document.getElementById("posFilter"),

  freqFilter:
    document.getElementById("freqFilter"),

  statusFilter:
    document.getElementById("statusFilter"),

  bookmarkFilter:
    document.getElementById("bookmarkFilter"),

  tagFilter:
    document.getElementById("tagFilter"),

  sortSelect:
    document.getElementById("sortSelect"),

  resetFiltersButton:
    document.getElementById("resetFiltersButton"),

  activeFilterSummary:
    document.getElementById("activeFilterSummary"),

  filteredWordCount:
    document.getElementById("filteredWordCount"),

  dictionaryWordList:
    document.getElementById("dictionaryWordList"),

  backToDictionaryButton:
    document.getElementById("backToDictionaryButton"),

  detailCard:
    document.getElementById("detailCard"),

  detailWord:
    document.getElementById("detailWord"),

  detailPronunciation:
    document.getElementById("detailPronunciation"),

  detailMeta:
    document.getElementById("detailMeta"),

  detailTags:
    document.getElementById("detailTags"),

  bookmarkButton:
    document.getElementById("bookmarkButton"),

  statusUnsetButton:
    document.getElementById("statusUnsetButton"),

  statusKnownButton:
    document.getElementById("statusKnownButton"),

  statusLearningButton:
    document.getElementById("statusLearningButton"),

  meaningSection:
    document.getElementById("meaningSection"),

  detailMeaning:
    document.getElementById("detailMeaning"),

  nuanceSection:
    document.getElementById("nuanceSection"),

  detailNuance:
    document.getElementById("detailNuance"),

  conjugationSection:
    document.getElementById("conjugationSection"),

  detailConjugation:
    document.getElementById("detailConjugation"),

  minimalSection:
    document.getElementById("minimalSection"),

  detailMinimal:
    document.getElementById("detailMinimal"),

  equivalentsSection:
    document.getElementById("equivalentsSection"),

  detailEquivalents:
    document.getElementById("detailEquivalents"),

  etymologySection:
    document.getElementById("etymologySection"),

  detailEtymology:
    document.getElementById("detailEtymology"),

  exampleSection:
    document.getElementById("exampleSection"),

  detailExample:
    document.getElementById("detailExample"),

  taskSection:
    document.getElementById("taskSection"),

  detailTask:
    document.getElementById("detailTask"),

  toast:
    document.getElementById("toast")
};


/* =========================================================
   Start
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  init
);


async function init() {
  try {
    loadLocalState();

    bindEvents();

    updateLanguageToggle();

    state.cards =
      await loadAllCardFiles();

    validateAndNormalizeCards();

    populateTagFilter();

    restoreTodayWords();

    renderTodayWords();

    applyFilters();

    updateGlobalWordCount();

    handleInitialUrlState();
  } catch (error) {
    console.error(error);

    showFatalError(
      "カードの読み込み中にエラーが発生しました。JSONの構文またはファイル名を確認してください。"
    );
  }
}


/* =========================================================
   Card File Loading
========================================================= */

async function loadAllCardFiles() {
  const cards = [];

  const fileNames = [
    "cards.json"
  ];

  for (
    let i = 2;
    i <= CONFIG.maxCardFiles;
    i += 1
  ) {
    fileNames.push(
      `cards${i}.json`
    );
  }

  let foundAnyFile = false;

  for (
    const fileName
    of fileNames
  ) {
    try {
      const response =
        await fetch(
          `./${fileName}`,
          {
            cache: "no-store"
          }
        );

      if (!response.ok) {
        continue;
      }

      const data =
        await response.json();

      const extracted =
        extractCardsFromJson(data);

      if (
        extracted.length > 0
      ) {
        foundAnyFile = true;

        cards.push(
          ...extracted
        );
      }
    } catch (error) {
      console.warn(
        `Could not load ${fileName}`,
        error
      );
    }
  }

  if (!foundAnyFile) {
    throw new Error(
      "No card JSON files could be loaded."
    );
  }

  return cards;
}


function extractCardsFromJson(data) {
  if (
    Array.isArray(data)
  ) {
    return data;
  }

  if (
    data &&
    Array.isArray(data.cards)
  ) {
    return data.cards;
  }

  return [];
}


/* =========================================================
   Validation / Normalization
========================================================= */

function validateAndNormalizeCards() {
  const seenIds =
    new Set();

  const seenSids =
    new Set();

  const normalized =
    [];

  for (
    const rawCard
    of state.cards
  ) {
    if (
      !rawCard ||
      typeof rawCard !== "object"
    ) {
      continue;
    }

    const card = {
      ...rawCard
    };

    if (
      !card.id ||
      !card.word
    ) {
      console.warn(
        "Card skipped because id or word is missing:",
        card
      );

      continue;
    }

    if (
      seenIds.has(card.id)
    ) {
      console.warn(
        `Duplicate id: ${card.id}`
      );

      continue;
    }

    seenIds.add(card.id);

    if (card.sid) {
      if (
        seenSids.has(card.sid)
      ) {
        console.warn(
          `Duplicate sid: ${card.sid}`
        );

        continue;
      }

      seenSids.add(card.sid);
    }

    card.tags =
      Array.isArray(card.tags)
        ? card.tags
        : [];

    card.grammar =
      card.grammar &&
      typeof card.grammar === "object"
        ? card.grammar
        : {};

    if (
      card.grammar.pos &&
      !CONFIG.validPos.includes(
        card.grammar.pos
      )
    ) {
      console.warn(
        `Unknown POS "${card.grammar.pos}" in ${card.word}`
      );
    }

    normalized.push(card);
  }

  state.cards =
    normalized;
}


/* =========================================================
   Local Storage
========================================================= */

function loadLocalState() {
  state.bookmarks =
    new Set(
      readJsonStorage(
        CONFIG.storage.bookmarks,
        []
      )
    );

  state.learningStatus =
    readJsonStorage(
      CONFIG.storage.learningStatus,
      {}
    );

  state.uiLanguage =
    localStorage.getItem(
      CONFIG.storage.uiLanguage
    ) || "ja";

  if (
    state.uiLanguage !== "ja" &&
    state.uiLanguage !== "de"
  ) {
    state.uiLanguage = "ja";
  }
}


function readJsonStorage(
  key,
  fallback
) {
  try {
    const raw =
      localStorage.getItem(key);

    if (!raw) {
      return fallback;
    }

    return JSON.parse(raw);
  } catch (error) {
    console.warn(
      `Storage read error: ${key}`,
      error
    );

    return fallback;
  }
}


function saveBookmarks() {
  localStorage.setItem(
    CONFIG.storage.bookmarks,
    JSON.stringify(
      [...state.bookmarks]
    )
  );
}


function saveLearningStatus() {
  localStorage.setItem(
    CONFIG.storage.learningStatus,
    JSON.stringify(
      state.learningStatus
    )
  );
}


function saveUiLanguage() {
  localStorage.setItem(
    CONFIG.storage.uiLanguage,
    state.uiLanguage
  );
}


/* =========================================================
   Today's Five Words
========================================================= */

function getTodayKey() {
  const now =
    new Date();

  const year =
    now.getFullYear();

  const month =
    String(
      now.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const day =
    String(
      now.getDate()
    ).padStart(
      2,
      "0"
    );

  return `${year}-${month}-${day}`;
}


function restoreTodayWords() {
  const stored =
    readJsonStorage(
      CONFIG.storage.todayWords,
      null
    );

  const today =
    getTodayKey();

  if (
    stored &&
    stored.date === today &&
    Array.isArray(stored.ids)
  ) {
    const validIds =
      stored.ids.filter(
        id =>
          state.cards.some(
            card =>
              card.id === id
          )
      );

    if (
      validIds.length ===
      CONFIG.todayCount
    ) {
      state.todayWordIds =
        validIds;

      return;
    }
  }

  generateTodayWords();
}


function generateTodayWords() {
  const selected =
    weightedRandomCards(
      state.cards,
      CONFIG.todayCount
    );

  state.todayWordIds =
    selected.map(
      card => card.id
    );

  localStorage.setItem(
    CONFIG.storage.todayWords,
    JSON.stringify({
      date: getTodayKey(),
      ids: state.todayWordIds
    })
  );
}


function weightedRandomCards(
  cards,
  count
) {
  if (
    cards.length <= count
  ) {
    return [...cards];
  }

  const pool =
    cards.map(
      card => ({
        card,
        weight:
          getTodayWeight(card)
      })
    );

  const result = [];

  while (
    result.length < count &&
    pool.length > 0
  ) {
    const totalWeight =
      pool.reduce(
        (
          sum,
          item
        ) =>
          sum + item.weight,
        0
      );

    let random =
      Math.random() *
      totalWeight;

    let selectedIndex = 0;

    for (
      let i = 0;
      i < pool.length;
      i += 1
    ) {
      random -=
        pool[i].weight;

      if (
        random <= 0
      ) {
        selectedIndex = i;

        break;
      }
    }

    result.push(
      pool[selectedIndex].card
    );

    pool.splice(
      selectedIndex,
      1
    );
  }

  return result;
}


function getTodayWeight(card) {
  const freq =
    normalizeString(
      card.freq
    );

  let weight = 1;

  if (
    freq === "very rare"
  ) {
    weight = 3.4;
  } else if (
    freq === "rare"
  ) {
    weight = 2.8;
  } else if (
    freq === "sometimes"
  ) {
    weight = 1.8;
  } else if (
    freq === "often"
  ) {
    weight = 1.1;
  } else if (
    freq === "very often"
  ) {
    weight = 0.8;
  }

  const status =
    getLearningStatus(
      card.id
    );

  if (
    status === "known"
  ) {
    weight *= 0.65;
  }

  if (
    status === "learning"
  ) {
    weight *= 1.45;
  }

  return weight;
}


function renderTodayWords() {
  dom.todayWordList.innerHTML =
    "";

  const cards =
    state.todayWordIds
      .map(
        id =>
          state.cards.find(
            card =>
              card.id === id
          )
      )
      .filter(Boolean);

  if (
    cards.length === 0
  ) {
    dom.todayWordList.innerHTML =
      `
        <div class="empty-message">
          今日の単語がありません。
        </div>
      `;

    return;
  }

  for (
    const card
    of cards
  ) {
    dom.todayWordList.appendChild(
      createHeadlineItem(card)
    );
  }
}


/* =========================================================
   Filters
========================================================= */

function applyFilters() {
  const search =
    normalizeString(
      dom.searchInput.value
    );

  const level =
    dom.levelFilter.value;

  const pos =
    dom.posFilter.value;

  const freq =
    dom.freqFilter.value;

  const status =
    dom.statusFilter.value;

  const bookmark =
    dom.bookmarkFilter.value;

  const tag =
    dom.tagFilter.value;

  let result =
    [...state.cards];


  /* Search */

  if (search) {
    result =
      result.filter(
        card =>
          buildSearchText(card)
            .includes(search)
      );
  }


  /* Level */

  if (level) {
    result =
      result.filter(
        card =>
          cardMatchesLevel(
            card,
            level
          )
      );
  }


  /* POS */

  if (pos) {
    result =
      result.filter(
        card =>
          card.grammar?.pos === pos
      );
  }


  /* Frequency */

  if (freq) {
    result =
      result.filter(
        card =>
          normalizeString(
            card.freq
          ) ===
          normalizeString(freq)
      );
  }


  /* Learning Status */

  if (status) {
    result =
      result.filter(
        card =>
          getLearningStatus(
            card.id
          ) === status
      );
  }


  /* Bookmark */

  if (
    bookmark ===
    "bookmarked"
  ) {
    result =
      result.filter(
        card =>
          state.bookmarks.has(
            card.id
          )
      );
  }


  /* Tag */

  if (tag) {
    result =
      result.filter(
        card =>
          card.tags.includes(tag)
      );
  }


  result =
    sortCards(
      result,
      dom.sortSelect.value
    );

  state.filteredCards =
    result;

  renderDictionaryList();

  renderFilterSummary();
}


/* =========================================================
   Search Text
========================================================= */

function buildSearchText(card) {
  const parts = [
    card.word,
    card.id,
    card.sid,
    card.level,
    card.freq,

    ...(card.tags || []),

    extractLocalizedText(
      card.meaning
    ),

    extractLocalizedText(
      card.nuance
    ),

    extractLocalizedText(
      card.minimal
    ),

    extractLocalizedText(
      card.etymology
    ),

    extractLocalizedText(
      card.example
    ),

    extractLocalizedText(
      card.task
    ),

    flattenObjectText(
      card.equivalents
    ),

    flattenObjectText(
      card.conjugation
    )
  ];

  return normalizeString(
    parts
      .filter(Boolean)
      .join(" ")
  );
}


function flattenObjectText(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  if (
    Array.isArray(value)
  ) {
    return value
      .map(flattenObjectText)
      .join(" ");
  }

  if (
    typeof value === "object"
  ) {
    return Object.values(value)
      .map(flattenObjectText)
      .join(" ");
  }

  return "";
}


function extractLocalizedText(value) {
  return flattenObjectText(value);
}


/* =========================================================
   Level Matching
========================================================= */

function cardMatchesLevel(
  card,
  selectedLevel
) {
  if (!card.level) {
    return false;
  }

  const normalized =
    String(card.level)
      .toUpperCase()
      .replace(/\s+/g, "");

  return normalized.includes(
    selectedLevel.toUpperCase()
  );
}


/* =========================================================
   Sorting
========================================================= */

function sortCards(
  cards,
  mode
) {
  const result =
    [...cards];

  switch (mode) {
    case "reverse":

      result.sort(
        (a, b) =>
          compareWords(
            b.word,
            a.word
          )
      );

      break;


    case "sid-new":

      result.sort(
        (a, b) =>
          compareSid(
            b.sid,
            a.sid
          )
      );

      break;


    case "sid-old":

      result.sort(
        (a, b) =>
          compareSid(
            a.sid,
            b.sid
          )
      );

      break;


    case "level":

      result.sort(
        compareByLevel
      );

      break;


    case "alphabetical":
    default:

      result.sort(
        (a, b) =>
          compareWords(
            a.word,
            b.word
          )
      );

      break;
  }

  return result;
}


function compareWords(
  a,
  b
) {
  return String(a || "")
    .localeCompare(
      String(b || ""),
      "de",
      {
        sensitivity: "base"
      }
    );
}


function compareSid(
  a,
  b
) {
  return String(a || "")
    .localeCompare(
      String(b || "")
    );
}


function compareByLevel(
  a,
  b
) {
  const order = {
    A1: 1,
    A2: 2,
    B1: 3,
    B2: 4,
    C1: 5,
    C2: 6
  };

  const aLevel =
    getLowestLevelRank(
      a.level,
      order
    );

  const bLevel =
    getLowestLevelRank(
      b.level,
      order
    );

  if (
    aLevel !== bLevel
  ) {
    return aLevel - bLevel;
  }

  return compareWords(
    a.word,
    b.word
  );
}


function getLowestLevelRank(
  level,
  order
) {
  if (!level) {
    return 999;
  }

  const matches =
    String(level)
      .toUpperCase()
      .match(
        /A1|A2|B1|B2|C1|C2/g
      );

  if (
    !matches ||
    matches.length === 0
  ) {
    return 999;
  }

  return Math.min(
    ...matches.map(
      item =>
        order[item] || 999
    )
  );
}


/* =========================================================
   Dictionary List
========================================================= */

function renderDictionaryList() {
  dom.dictionaryWordList.innerHTML =
    "";

  const count =
    state.filteredCards.length;

  dom.filteredWordCount.textContent =
    `${count} ${
      count === 1
        ? "Wort"
        : "Wörter"
    }`;

  if (
    count === 0
  ) {
    dom.dictionaryWordList.innerHTML =
      `
        <div class="empty-message">
          条件に一致する単語がありません。
        </div>
      `;

    return;
  }

  const fragment =
    document.createDocumentFragment();

  for (
    const card
    of state.filteredCards
  ) {
    fragment.appendChild(
      createHeadlineItem(card)
    );
  }

  dom.dictionaryWordList.appendChild(
    fragment
  );
}


function createHeadlineItem(card) {
  const button =
    document.createElement("button");

  button.type =
    "button";

  button.className =
    "headline-item";

  button.dataset.cardId =
    card.id;

  const word =
    document.createElement("span");

  word.className =
    "headline-word";

  word.textContent =
    card.word;


  const meta =
    document.createElement("span");

  meta.className =
    "headline-meta";

  const indicators = [];

  if (
    state.bookmarks.has(
      card.id
    )
  ) {
    indicators.push("★");
  }

  const status =
    getLearningStatus(
      card.id
    );

  if (
    status === "known"
  ) {
    indicators.push("✓");
  } else if (
    status === "learning"
  ) {
    indicators.push("●");
  }

  meta.textContent =
    indicators.join(" ");

  button.append(
    word,
    meta
  );

  button.addEventListener(
    "click",
    () =>
      openCard(card.id)
  );

  return button;
}


/* =========================================================
   Tag Filter
========================================================= */

function populateTagFilter() {
  const tags =
    new Set();

  for (
    const card
    of state.cards
  ) {
    for (
      const tag
      of card.tags || []
    ) {
      if (tag) {
        tags.add(tag);
      }
    }
  }

  const sortedTags =
    [...tags].sort(
      (
        a,
        b
      ) =>
        a.localeCompare(
          b,
          "de",
          {
            sensitivity: "base"
          }
        )
    );

  for (
    const tag
    of sortedTags
  ) {
    const option =
      document.createElement(
        "option"
      );

    option.value =
      tag;

    option.textContent =
      tag;

    dom.tagFilter.appendChild(
      option
    );
  }
}


/* =========================================================
   Filter Summary
========================================================= */

function renderFilterSummary() {
  const active = [];

  if (
    dom.searchInput.value.trim()
  ) {
    active.push(
      `検索: ${dom.searchInput.value.trim()}`
    );
  }

  if (
    dom.levelFilter.value
  ) {
    active.push(
      `Level: ${dom.levelFilter.value}`
    );
  }

  if (
    dom.posFilter.value
  ) {
    active.push(
      `Wortart: ${
        formatPosLabel(
          dom.posFilter.value
        )
      }`
    );
  }

  if (
    dom.freqFilter.value
  ) {
    active.push(
      `Freq: ${dom.freqFilter.value}`
    );
  }

  if (
    dom.statusFilter.value
  ) {
    active.push(
      `Status: ${
        formatLearningStatus(
          dom.statusFilter.value
        )
      }`
    );
  }

  if (
    dom.bookmarkFilter.value
  ) {
    active.push(
      "Bookmark"
    );
  }

  if (
    dom.tagFilter.value
  ) {
    active.push(
      `Tag: ${dom.tagFilter.value}`
    );
  }

  dom.activeFilterSummary.textContent =
    active.length
      ? active.join(" · ")
      : "";
}


/* =========================================================
   Open / Close Detail
========================================================= */

function openCard(cardId) {
  const card =
    state.cards.find(
      item =>
        item.id === cardId
    );

  if (!card) {
    return;
  }

  state.selectedCard =
    card;

  renderDetail(card);

  dom.dictionaryView.classList.add(
    "hidden"
  );

  dom.detailView.classList.remove(
    "hidden"
  );

  dom.detailView.setAttribute(
    "aria-hidden",
    "false"
  );

  window.scrollTo({
    top: 0,
    behavior: "auto"
  });

  const url =
    new URL(
      window.location.href
    );

  url.searchParams.set(
    "word",
    card.id
  );

  history.pushState(
    {
      cardId: card.id
    },
    "",
    url
  );
}


function closeDetail({
  updateHistory = true
} = {}) {
  state.selectedCard =
    null;

  dom.detailView.classList.add(
    "hidden"
  );

  dom.detailView.setAttribute(
    "aria-hidden",
    "true"
  );

  dom.dictionaryView.classList.remove(
    "hidden"
  );

  if (updateHistory) {
    const url =
      new URL(
        window.location.href
      );

    url.searchParams.delete(
      "word"
    );

    history.pushState(
      {},
      "",
      url
    );
  }
}


/* =========================================================
   Detail Rendering
========================================================= */

function renderDetail(card) {
  dom.detailWord.textContent =
    card.word || "";

  renderPronunciation(card);

  renderMeta(card);

  renderTags(card);

  updateBookmarkButton(card);

  updateStatusButtons(card);

  renderLocalizedSection(
    dom.meaningSection,
    dom.detailMeaning,
    card.meaning
  );

  renderLocalizedSection(
    dom.nuanceSection,
    dom.detailNuance,
    card.nuance
  );

  renderConjugation(card);

  renderLocalizedSection(
    dom.minimalSection,
    dom.detailMinimal,
    card.minimal
  );

  renderEquivalents(card);

  renderLocalizedSection(
    dom.etymologySection,
    dom.detailEtymology,
    card.etymology
  );

  renderLocalizedSection(
    dom.exampleSection,
    dom.detailExample,
    card.example
  );

  renderLocalizedSection(
    dom.taskSection,
    dom.detailTask,
    card.task
  );
}


/* =========================================================
   Pronunciation
========================================================= */

function renderPronunciation(card) {
  const pronunciation =
    getPronunciationText(card);

  if (!pronunciation) {
    dom.detailPronunciation.textContent =
      "";

    dom.detailPronunciation.classList.add(
      "hidden"
    );

    return;
  }

  dom.detailPronunciation.textContent =
    pronunciation;

  dom.detailPronunciation.classList.remove(
    "hidden"
  );
}


function getPronunciationText(card) {
  const value =
    card.pronunciation;

  if (!value) {
    return "";
  }

  if (
    typeof value === "string"
  ) {
    return value;
  }

  if (
    typeof value === "object"
  ) {
    if (value.ipa) {
      return value.ipa;
    }

    if (value.IPA) {
      return value.IPA;
    }
  }

  return "";
}


/* =========================================================
   Meta
========================================================= */

function renderMeta(card) {
  const parts = [];

  if (
    card.grammar?.pos
  ) {
    parts.push(
      formatPosLabel(
        card.grammar.pos
      )
    );
  }

  if (
    card.grammar?.gender
  ) {
    parts.push(
      formatGender(
        card.grammar.gender
      )
    );
  }

  if (card.level) {
    parts.push(
      card.level
    );
  }

  if (card.freq) {
    parts.push(
      card.freq
    );
  }

  if (card.sid) {
    parts.push(
      card.sid
    );
  }

  dom.detailMeta.textContent =
    parts.join(" · ");
}


function formatPosLabel(pos) {
  const labels = {
    noun: "N",
    verb: "V",
    adj: "Adj",
    adv: "Adv",
    prep: "Prep",
    conj: "Conj",
    pron: "Pron",
    particle: "Partikel",
    interj: "Interj",
    phrase: "Phrase",
    idiom: "Redewendung"
  };

  return labels[pos] || pos;
}


function formatGender(gender) {
  const labels = {
    m: "Mask.",
    f: "Fem.",
    n: "Neutr.",
    "m/f": "m/f"
  };

  return labels[gender] ||
    gender;
}


/* =========================================================
   Tags
========================================================= */

function renderTags(card) {
  dom.detailTags.innerHTML =
    "";

  if (
    !Array.isArray(card.tags) ||
    card.tags.length === 0
  ) {
    return;
  }

  for (
    const tag
    of card.tags
  ) {
    const span =
      document.createElement(
        "span"
      );

    span.className =
      "tag-chip";

    span.textContent =
      tag;

    dom.detailTags.appendChild(
      span
    );
  }
}


/* =========================================================
   Localized Sections
========================================================= */

function renderLocalizedSection(
  sectionElement,
  targetElement,
  value
) {
  if (
    !value ||
    typeof value !== "object"
  ) {
    sectionElement.classList.add(
      "hidden"
    );

    targetElement.innerHTML =
      "";

    return;
  }

  const primaryLanguage =
    state.uiLanguage;

  const secondaryLanguage =
    primaryLanguage === "ja"
      ? "de"
      : "ja";

  const primaryText =
    value[primaryLanguage];

  const secondaryText =
    value[secondaryLanguage];

  if (
    !primaryText &&
    !secondaryText
  ) {
    sectionElement.classList.add(
      "hidden"
    );

    targetElement.innerHTML =
      "";

    return;
  }

  sectionElement.classList.remove(
    "hidden"
  );

  targetElement.innerHTML =
    "";

  if (primaryText) {
    const primary =
      document.createElement(
        "div"
      );

    primary.className =
      primaryLanguage === "ja"
        ? "detail-japanese"
        : "detail-german";

    primary.textContent =
      primaryText;

    targetElement.appendChild(
      primary
    );
  }

  if (secondaryText) {
    const secondary =
      document.createElement(
        "div"
      );

    secondary.className =
      secondaryLanguage === "ja"
        ? "detail-japanese"
        : "detail-german";

    secondary.textContent =
      secondaryText;

    targetElement.appendChild(
      secondary
    );
  }
}


/* =========================================================
   Equivalents
========================================================= */

function renderEquivalents(card) {
  const equivalents =
    card.equivalents;

  if (
    !equivalents ||
    typeof equivalents !== "object" ||
    Object.keys(equivalents).length === 0
  ) {
    dom.equivalentsSection.classList.add(
      "hidden"
    );

    dom.detailEquivalents.innerHTML =
      "";

    return;
  }

  dom.equivalentsSection.classList.remove(
    "hidden"
  );

  dom.detailEquivalents.innerHTML =
    "";

  const wrapper =
    document.createElement(
      "div"
    );

  wrapper.className =
    "equivalent-list";

  const languageOrder = [
    "en",
    "it",
    "fr",
    "es"
  ];

  const keys =
    Object.keys(equivalents)
      .sort(
        (
          a,
          b
        ) => {
          const aIndex =
            languageOrder.indexOf(a);

          const bIndex =
            languageOrder.indexOf(b);

          const aRank =
            aIndex === -1
              ? 999
              : aIndex;

          const bRank =
            bIndex === -1
              ? 999
              : bIndex;

          return aRank - bRank;
        }
      );

  for (
    const lang
    of keys
  ) {
    const values =
      equivalents[lang];

    const text =
      Array.isArray(values)
        ? values.join(", ")
        : String(values || "");

    if (!text) {
      continue;
    }

    const row =
      document.createElement(
        "div"
      );

    row.className =
      "equivalent-row";

    const label =
      document.createElement(
        "div"
      );

    label.className =
      "equivalent-lang";

    label.textContent =
      lang;

    const value =
      document.createElement(
        "div"
      );

    value.className =
      "equivalent-values";

    value.textContent =
      text;

    row.append(
      label,
      value
    );

    wrapper.appendChild(
      row
    );
  }

  dom.detailEquivalents.appendChild(
    wrapper
  );
}


/* =========================================================
   Conjugation
========================================================= */

function renderConjugation(card) {
  const conjugation =
    card.conjugation;

  if (
    !conjugation ||
    typeof conjugation !== "object"
  ) {
    dom.conjugationSection.classList.add(
      "hidden"
    );

    dom.detailConjugation.innerHTML =
      "";

    return;
  }

  dom.conjugationSection.classList.remove(
    "hidden"
  );

  dom.detailConjugation.innerHTML =
    "";

  const wrapper =
    document.createElement(
      "div"
    );

  wrapper.className =
    "conjugation-block";


  /* Variant model */

  if (
    Array.isArray(
      conjugation.variants
    )
  ) {
    for (
      const variant
      of conjugation.variants
    ) {
      wrapper.appendChild(
        createConjugationVariant(
          variant
        )
      );
    }
  } else {

    /* Simple model */

    wrapper.appendChild(
      createConjugationVariant(
        conjugation
      )
    );
  }

  dom.detailConjugation.appendChild(
    wrapper
  );
}


function createConjugationVariant(
  data
) {
  const container =
    document.createElement(
      "div"
    );

  container.className =
    "conjugation-variant";


  const titleParts = [];

  if (data.meaning) {
    titleParts.push(
      data.meaning
    );
  }

  if (data.stress) {
    titleParts.push(
      data.stress
    );
  }

  if (
    titleParts.length > 0
  ) {
    const title =
      document.createElement(
        "div"
      );

    title.className =
      "conjugation-variant-title";

    title.textContent =
      titleParts.join(" · ");

    container.appendChild(
      title
    );
  }


  const grid =
    document.createElement(
      "div"
    );

  grid.className =
    "conjugation-grid";


  const rows = [
    [
      "Präsens",
      data.present
    ],
    [
      "Präteritum",
      data.preterite
    ],
    [
      "Perfekt",
      data.perfect
    ],
    [
      "Partizip II",
      data.participle2
    ],
    [
      "Trennbar",
      formatBoolean(
        data.separable
      )
    ]
  ];


  for (
    const [
      label,
      value
    ]
    of rows
  ) {
    if (
      value === "" ||
      value === null ||
      value === undefined
    ) {
      continue;
    }

    const labelElement =
      document.createElement(
        "div"
      );

    labelElement.className =
      "conjugation-label";

    labelElement.textContent =
      label;


    const valueElement =
      document.createElement(
        "div"
      );

    valueElement.className =
      "conjugation-value";

    valueElement.textContent =
      value;


    grid.append(
      labelElement,
      valueElement
    );
  }

  container.appendChild(
    grid
  );

  return container;
}


function formatBoolean(value) {
  if (
    value === true
  ) {
    return "ja";
  }

  if (
    value === false
  ) {
    return "nein";
  }

  return value;
}


/* =========================================================
   Bookmark
========================================================= */

function toggleBookmark() {
  const card =
    state.selectedCard;

  if (!card) {
    return;
  }

  if (
    state.bookmarks.has(
      card.id
    )
  ) {
    state.bookmarks.delete(
      card.id
    );

    showToast(
      "ブックマークを解除しました"
    );
  } else {
    state.bookmarks.add(
      card.id
    );

    showToast(
      "ブックマークしました"
    );
  }

  saveBookmarks();

  updateBookmarkButton(card);

  renderTodayWords();

  applyFilters();
}


function updateBookmarkButton(card) {
  const bookmarked =
    state.bookmarks.has(
      card.id
    );

  dom.bookmarkButton.textContent =
    bookmarked
      ? "★"
      : "☆";

  dom.bookmarkButton.classList.toggle(
    "active",
    bookmarked
  );

  dom.bookmarkButton.setAttribute(
    "aria-pressed",
    bookmarked
      ? "true"
      : "false"
  );
}


/* =========================================================
   Learning Status
========================================================= */

function getLearningStatus(cardId) {
  const value =
    state.learningStatus[
      cardId
    ];

  if (
    value === "known" ||
    value === "learning"
  ) {
    return value;
  }

  return "unset";
}


function setLearningStatus(status) {
  const card =
    state.selectedCard;

  if (!card) {
    return;
  }

  if (
    status === "unset"
  ) {
    delete state.learningStatus[
      card.id
    ];
  } else {
    state.learningStatus[
      card.id
    ] = status;
  }

  saveLearningStatus();

  updateStatusButtons(card);

  renderTodayWords();

  applyFilters();

  if (
    status === "known"
  ) {
    showToast(
      "「覚えた」に設定しました"
    );
  } else if (
    status === "learning"
  ) {
    showToast(
      "「まだ覚えていない」に設定しました"
    );
  } else {
    showToast(
      "習得状態を未設定に戻しました"
    );
  }
}


function updateStatusButtons(card) {
  const status =
    getLearningStatus(
      card.id
    );

  const buttons = [
    dom.statusUnsetButton,
    dom.statusKnownButton,
    dom.statusLearningButton
  ];

  for (
    const button
    of buttons
  ) {
    button.classList.toggle(
      "active",
      button.dataset.status ===
        status
    );
  }
}


function formatLearningStatus(
  status
) {
  const labels = {
    known: "覚えた",
    learning: "まだ覚えていない",
    unset: "未設定"
  };

  return labels[status] ||
    status;
}


/* =========================================================
   JP / DE Toggle
========================================================= */

function toggleUiLanguage() {
  state.uiLanguage =
    state.uiLanguage === "ja"
      ? "de"
      : "ja";

  saveUiLanguage();

  updateLanguageToggle();

  if (
    state.selectedCard
  ) {
    renderDetail(
      state.selectedCard
    );
  }
}


function updateLanguageToggle() {
  dom.languageToggle.textContent =
    state.uiLanguage === "ja"
      ? "JP"
      : "DE";

  dom.languageToggle.title =
    state.uiLanguage === "ja"
      ? "日本語を優先表示"
      : "Deutsch zuerst";
}


/* =========================================================
   Reset Filters
========================================================= */

function resetFilters() {
  dom.searchInput.value =
    "";

  dom.levelFilter.value =
    "";

  dom.posFilter.value =
    "";

  dom.freqFilter.value =
    "";

  dom.statusFilter.value =
    "";

  dom.bookmarkFilter.value =
    "";

  dom.tagFilter.value =
    "";

  dom.sortSelect.value =
    "alphabetical";

  applyFilters();
}


/* =========================================================
   Counts
========================================================= */

function updateGlobalWordCount() {
  const count =
    state.cards.length;

  dom.wordCount.textContent =
    `${count} ${
      count === 1
        ? "Wort"
        : "Wörter"
    }`;
}


/* =========================================================
   URL / Browser History
========================================================= */

function handleInitialUrlState() {
  const url =
    new URL(
      window.location.href
    );

  const cardId =
    url.searchParams.get(
      "word"
    );

  if (!cardId) {
    return;
  }

  const exists =
    state.cards.some(
      card =>
        card.id === cardId
    );

  if (exists) {
    openCardWithoutHistory(
      cardId
    );
  }
}


function openCardWithoutHistory(
  cardId
) {
  const card =
    state.cards.find(
      item =>
        item.id === cardId
    );

  if (!card) {
    return;
  }

  state.selectedCard =
    card;

  renderDetail(card);

  dom.dictionaryView.classList.add(
    "hidden"
  );

  dom.detailView.classList.remove(
    "hidden"
  );

  dom.detailView.setAttribute(
    "aria-hidden",
    "false"
  );
}


window.addEventListener(
  "popstate",
  () => {
    const url =
      new URL(
        window.location.href
      );

    const cardId =
      url.searchParams.get(
        "word"
      );

    if (cardId) {
      openCardWithoutHistory(
        cardId
      );
    } else {
      closeDetail({
        updateHistory: false
      });
    }
  }
);


/* =========================================================
   Events
========================================================= */

function bindEvents() {
  dom.searchInput.addEventListener(
    "input",
    applyFilters
  );

  dom.clearSearchButton.addEventListener(
    "click",
    () => {
      dom.searchInput.value =
        "";

      applyFilters();

      dom.searchInput.focus();
    }
  );


  const filters = [
    dom.levelFilter,
    dom.posFilter,
    dom.freqFilter,
    dom.statusFilter,
    dom.bookmarkFilter,
    dom.tagFilter,
    dom.sortSelect
  ];

  for (
    const element
    of filters
  ) {
    element.addEventListener(
      "change",
      applyFilters
    );
  }


  dom.resetFiltersButton.addEventListener(
    "click",
    resetFilters
  );


  dom.refreshTodayButton.addEventListener(
    "click",
    () => {
      generateTodayWords();

      renderTodayWords();

      showToast(
        "今日の5語を更新しました"
      );
    }
  );


  dom.languageToggle.addEventListener(
    "click",
    toggleUiLanguage
  );


  dom.backToDictionaryButton.addEventListener(
    "click",
    () => {
      if (
        history.state &&
        history.state.cardId
      ) {
        history.back();
      } else {
        closeDetail();
      }
    }
  );


  dom.bookmarkButton.addEventListener(
    "click",
    toggleBookmark
  );


  dom.statusUnsetButton.addEventListener(
    "click",
    () =>
      setLearningStatus(
        "unset"
      )
  );


  dom.statusKnownButton.addEventListener(
    "click",
    () =>
      setLearningStatus(
        "known"
      )
  );


  dom.statusLearningButton.addEventListener(
    "click",
    () =>
      setLearningStatus(
        "learning"
      )
  );
}


/* =========================================================
   Toast
========================================================= */

let toastTimer =
  null;


function showToast(message) {
  if (
    toastTimer
  ) {
    clearTimeout(
      toastTimer
    );
  }

  dom.toast.textContent =
    message;

  dom.toast.classList.remove(
    "hidden"
  );

  toastTimer =
    setTimeout(
      () => {
        dom.toast.classList.add(
          "hidden"
        );
      },
      1800
    );
}


/* =========================================================
   Fatal Error
========================================================= */

function showFatalError(message) {
  dom.todayWordList.innerHTML =
    `
      <div class="empty-message">
        ${escapeHtml(message)}
      </div>
    `;

  dom.dictionaryWordList.innerHTML =
    `
      <div class="empty-message">
        ${escapeHtml(message)}
      </div>
    `;

  dom.wordCount.textContent =
    "読み込みエラー";
}


/* =========================================================
   Utility
========================================================= */

function normalizeString(value) {
  return String(
    value ?? ""
  )
    .normalize("NFKC")
    .toLocaleLowerCase("de-DE")
    .trim();
}


function escapeHtml(value) {
  return String(value)
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );
}
