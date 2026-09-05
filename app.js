"use strict";


/* =========================================================
   Deutsch Trainer
   Dictionary Edition v3
========================================================= */


/* =========================================================
   Configuration
========================================================= */

const CONFIG = {
  maxCardFiles: 20,

  todayCount: 5,

  storage: {
    bookmarks:
      "deutsch_trainer_bookmarks_v3",

    learningStatus:
      "deutsch_trainer_learning_status_v3",

    todayWords:
      "deutsch_trainer_today_words_v3",

    uiLanguage:
      "deutsch_trainer_ui_language_v3",

    theme:
      "deutsch_trainer_theme_v3"
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
   UI Text
========================================================= */

const UI_TEXT = {

  ja: {
    todayTitle:
      "今日の5語",

    todaySubtitle:
      "Heute – 5 Wörter",

    searchLabel:
      "検索",

    searchPlaceholder:
      "単語・意味・例文などを検索",

    dictionaryTitle:
      "Wörterbuch",

    dictionarySubtitle:
      "辞書・絞り込み",

    reset:
      "リセット",

    level:
      "Level",

    pos:
      "Wortart",

    frequency:
      "Häufigkeit",

    status:
      "習得状態",

    bookmark:
      "Bookmark",

    tag:
      "Tag",

    sort:
      "Sortierung",

    all:
      "すべて",

    known:
      "覚えた",

    learning:
      "まだ覚えていない",

    unset:
      "未設定",

    bookmarkOnly:
      "ブックマークのみ",

    newest:
      "新しいカード順",

    oldest:
      "古いカード順",

    levelSort:
      "レベル順",

    back:
      "← Wörterbuch",

    meaning:
      "意味",

    nuance:
      "ニュアンス",

    conjugation:
      "活用",

    collocations:
      "コロケーション",

    minimal:
      "Minimal",

    equivalents:
      "他言語相当語",

    etymology:
      "語源",

    example:
      "例文",

    task:
      "Task",

    learningStatus:
      "習得状態",

    statusUnset:
      "○ 未設定",

    statusKnown:
      "✓ 覚えた",

    statusLearning:
      "● まだ覚えていない",

    loadingToday:
      "読み込み中...",

    loadingDictionary:
      "辞書を読み込み中...",

    noTodayWords:
      "今日の単語がありません。",

    noResults:
      "条件に一致する単語がありません。",

    refreshToday:
      "今日の5語を更新しました",

    bookmarked:
      "ブックマークしました",

    bookmarkRemoved:
      "ブックマークを解除しました",

    setKnown:
      "「覚えた」に設定しました",

    setLearning:
      "「まだ覚えていない」に設定しました",

    setUnset:
      "習得状態を未設定に戻しました",

    loadError:
      "カードの読み込み中にエラーが発生しました。JSONの構文またはファイル名を確認してください。",

    searchPrefix:
      "検索",

    posPrefix:
      "Wortart",

    levelPrefix:
      "Level",

    freqPrefix:
      "Freq",

    statusPrefix:
      "Status",

    tagPrefix:
      "Tag"
  },


  de: {
    todayTitle:
      "Heutige 5 Wörter",

    todaySubtitle:
      "Tägliche Auswahl",

    searchLabel:
      "Suche",

    searchPlaceholder:
      "Wort, Bedeutung, Beispielsatz usw. suchen",

    dictionaryTitle:
      "Wörterbuch",

    dictionarySubtitle:
      "Suche und Filter",

    reset:
      "Zurücksetzen",

    level:
      "Niveau",

    pos:
      "Wortart",

    frequency:
      "Häufigkeit",

    status:
      "Lernstatus",

    bookmark:
      "Lesezeichen",

    tag:
      "Tag",

    sort:
      "Sortierung",

    all:
      "Alle",

    known:
      "Gelernt",

    learning:
      "Noch nicht gelernt",

    unset:
      "Nicht markiert",

    bookmarkOnly:
      "Nur Lesezeichen",

    newest:
      "Neueste zuerst",

    oldest:
      "Älteste zuerst",

    levelSort:
      "Nach Niveau",

    back:
      "← Wörterbuch",

    meaning:
      "Bedeutung",

    nuance:
      "Nuance",

    conjugation:
      "Konjugation",

    collocations:
      "Kollokationen",

    minimal:
      "Abgrenzung",

    equivalents:
      "Entsprechungen",

    etymology:
      "Etymologie",

    example:
      "Beispielsatz",

    task:
      "Aufgabe",

    learningStatus:
      "Lernstatus",

    statusUnset:
      "○ Nicht markiert",

    statusKnown:
      "✓ Gelernt",

    statusLearning:
      "● Noch nicht gelernt",

    loadingToday:
      "Wörter werden geladen...",

    loadingDictionary:
      "Wörterbuch wird geladen...",

    noTodayWords:
      "Keine Wörter für heute.",

    noResults:
      "Keine passenden Wörter gefunden.",

    refreshToday:
      "Die heutigen 5 Wörter wurden aktualisiert.",

    bookmarked:
      "Als Lesezeichen gespeichert.",

    bookmarkRemoved:
      "Lesezeichen entfernt.",

    setKnown:
      "Als gelernt markiert.",

    setLearning:
      "Als noch nicht gelernt markiert.",

    setUnset:
      "Lernstatus zurückgesetzt.",

    loadError:
      "Beim Laden der Karten ist ein Fehler aufgetreten. Bitte JSON-Syntax und Dateinamen prüfen.",

    searchPrefix:
      "Suche",

    posPrefix:
      "Wortart",

    levelPrefix:
      "Niveau",

    freqPrefix:
      "Häufigkeit",

    statusPrefix:
      "Lernstatus",

    tagPrefix:
      "Tag"
  }
};


/* =========================================================
   State
========================================================= */

const state = {
  cards: [],
  filteredCards: [],

  bookmarks:
    new Set(),

  learningStatus:
    {},

  todayWordIds:
    [],

  selectedCard:
    null,

  uiLanguage:
    "ja",

  theme:
    "dark"
};


/* =========================================================
   DOM
========================================================= */

const dom = {
  dictionaryView:
    document.getElementById(
      "dictionaryView"
    ),

  detailView:
    document.getElementById(
      "detailView"
    ),

  wordCount:
    document.getElementById(
      "wordCount"
    ),

  languageToggle:
    document.getElementById(
      "languageToggle"
    ),

  themeToggle:
    document.getElementById(
      "themeToggle"
    ),

  themeColorMeta:
    document.getElementById(
      "themeColorMeta"
    ),


  /* Today */

  todayTitle:
    document.getElementById(
      "todayTitle"
    ),

  todaySubtitle:
    document.getElementById(
      "todaySubtitle"
    ),

  todayWordList:
    document.getElementById(
      "todayWordList"
    ),

  refreshTodayButton:
    document.getElementById(
      "refreshTodayButton"
    ),


  /* Search */

  searchLabel:
    document.getElementById(
      "searchLabel"
    ),

  searchInput:
    document.getElementById(
      "searchInput"
    ),

  clearSearchButton:
    document.getElementById(
      "clearSearchButton"
    ),


  /* Dictionary */

  dictionaryTitle:
    document.getElementById(
      "dictionaryTitle"
    ),

  dictionarySubtitle:
    document.getElementById(
      "dictionarySubtitle"
    ),

  resetFiltersButton:
    document.getElementById(
      "resetFiltersButton"
    ),


  /* Labels */

  levelLabel:
    document.getElementById(
      "levelLabel"
    ),

  posLabel:
    document.getElementById(
      "posLabel"
    ),

  freqLabel:
    document.getElementById(
      "freqLabel"
    ),

  statusLabel:
    document.getElementById(
      "statusLabel"
    ),

  bookmarkLabel:
    document.getElementById(
      "bookmarkLabel"
    ),

  tagLabel:
    document.getElementById(
      "tagLabel"
    ),

  sortLabel:
    document.getElementById(
      "sortLabel"
    ),


  /* Filters */

  levelFilter:
    document.getElementById(
      "levelFilter"
    ),

  posFilter:
    document.getElementById(
      "posFilter"
    ),

  freqFilter:
    document.getElementById(
      "freqFilter"
    ),

  statusFilter:
    document.getElementById(
      "statusFilter"
    ),

  bookmarkFilter:
    document.getElementById(
      "bookmarkFilter"
    ),

  tagFilter:
    document.getElementById(
      "tagFilter"
    ),

  sortSelect:
    document.getElementById(
      "sortSelect"
    ),


  /* Options */

  levelAllOption:
    document.getElementById(
      "levelAllOption"
    ),

  posAllOption:
    document.getElementById(
      "posAllOption"
    ),

  freqAllOption:
    document.getElementById(
      "freqAllOption"
    ),

  statusAllOption:
    document.getElementById(
      "statusAllOption"
    ),

  statusKnownOption:
    document.getElementById(
      "statusKnownOption"
    ),

  statusLearningOption:
    document.getElementById(
      "statusLearningOption"
    ),

  statusUnsetOption:
    document.getElementById(
      "statusUnsetOption"
    ),

  bookmarkAllOption:
    document.getElementById(
      "bookmarkAllOption"
    ),

  bookmarkOnlyOption:
    document.getElementById(
      "bookmarkOnlyOption"
    ),

  tagAllOption:
    document.getElementById(
      "tagAllOption"
    ),

  sortNewOption:
    document.getElementById(
      "sortNewOption"
    ),

  sortOldOption:
    document.getElementById(
      "sortOldOption"
    ),

  sortLevelOption:
    document.getElementById(
      "sortLevelOption"
    ),


  /* Results */

  activeFilterSummary:
    document.getElementById(
      "activeFilterSummary"
    ),

  filteredWordCount:
    document.getElementById(
      "filteredWordCount"
    ),

  dictionaryWordList:
    document.getElementById(
      "dictionaryWordList"
    ),


  /* Detail */

  backToDictionaryButton:
    document.getElementById(
      "backToDictionaryButton"
    ),

  detailWord:
    document.getElementById(
      "detailWord"
    ),

  detailPronunciation:
    document.getElementById(
      "detailPronunciation"
    ),

  detailMeta:
    document.getElementById(
      "detailMeta"
    ),

  detailTags:
    document.getElementById(
      "detailTags"
    ),

  bookmarkButton:
    document.getElementById(
      "bookmarkButton"
    ),


  /* Learning */

  learningStatusLabel:
    document.getElementById(
      "learningStatusLabel"
    ),

  statusUnsetButton:
    document.getElementById(
      "statusUnsetButton"
    ),

  statusKnownButton:
    document.getElementById(
      "statusKnownButton"
    ),

  statusLearningButton:
    document.getElementById(
      "statusLearningButton"
    ),


  /* Sections */

  meaningSection:
    document.getElementById(
      "meaningSection"
    ),

  meaningTitle:
    document.getElementById(
      "meaningTitle"
    ),

  detailMeaning:
    document.getElementById(
      "detailMeaning"
    ),


  nuanceSection:
    document.getElementById(
      "nuanceSection"
    ),

  nuanceTitle:
    document.getElementById(
      "nuanceTitle"
    ),

  detailNuance:
    document.getElementById(
      "detailNuance"
    ),


  conjugationSection:
    document.getElementById(
      "conjugationSection"
    ),

  conjugationTitle:
    document.getElementById(
      "conjugationTitle"
    ),

  detailConjugation:
    document.getElementById(
      "detailConjugation"
    ),


  collocationsSection:
    document.getElementById(
      "collocationsSection"
    ),

  collocationsTitle:
    document.getElementById(
      "collocationsTitle"
    ),

  detailCollocations:
    document.getElementById(
      "detailCollocations"
    ),


  minimalSection:
    document.getElementById(
      "minimalSection"
    ),

  minimalTitle:
    document.getElementById(
      "minimalTitle"
    ),

  detailMinimal:
    document.getElementById(
      "detailMinimal"
    ),


  equivalentsSection:
    document.getElementById(
      "equivalentsSection"
    ),

  equivalentsTitle:
    document.getElementById(
      "equivalentsTitle"
    ),

  detailEquivalents:
    document.getElementById(
      "detailEquivalents"
    ),


  etymologySection:
    document.getElementById(
      "etymologySection"
    ),

  etymologyTitle:
    document.getElementById(
      "etymologyTitle"
    ),

  detailEtymology:
    document.getElementById(
      "detailEtymology"
    ),


  exampleSection:
    document.getElementById(
      "exampleSection"
    ),

  exampleTitle:
    document.getElementById(
      "exampleTitle"
    ),

  detailExample:
    document.getElementById(
      "detailExample"
    ),


  taskSection:
    document.getElementById(
      "taskSection"
    ),

  taskTitle:
    document.getElementById(
      "taskTitle"
    ),

  detailTask:
    document.getElementById(
      "detailTask"
    ),


  /* Toast */

  toast:
    document.getElementById(
      "toast"
    )
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

    applyTheme();

    bindEvents();

    state.cards =
      await loadAllCardFiles();

    validateAndNormalizeCards();

    populateTagFilter();

    restoreTodayWords();

    updateUiLanguage();

    renderTodayWords();

    applyFilters();

    updateGlobalWordCount();

    handleInitialUrlState();
  } catch (error) {
    console.error(error);

    showFatalError(
      text("loadError")
    );
  }
}


/* =========================================================
   Text Helper
========================================================= */

function text(key) {
  return (
    UI_TEXT[state.uiLanguage]?.[key] ||
    UI_TEXT.ja[key] ||
    key
  );
}


/* =========================================================
   Card Loading
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

  let foundAnyFile =
    false;

  for (
    const fileName
    of fileNames
  ) {
    try {
      const response =
        await fetch(
          `./${fileName}`,
          {
            cache:
              "no-store"
          }
        );

      if (!response.ok) {
        continue;
      }

      const data =
        await response.json();

      const extracted =
        extractCardsFromJson(
          data
        );

      if (
        extracted.length > 0
      ) {
        foundAnyFile =
          true;

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
    Array.isArray(
      data.cards
    )
  ) {
    return data.cards;
  }

  return [];
}


/* =========================================================
   Validation
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
      typeof rawCard !==
        "object"
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
      seenIds.has(
        card.id
      )
    ) {
      console.warn(
        `Duplicate id: ${card.id}`
      );

      continue;
    }

    seenIds.add(
      card.id
    );

    if (card.sid) {
      if (
        seenSids.has(
          card.sid
        )
      ) {
        console.warn(
          `Duplicate sid: ${card.sid}`
        );

        continue;
      }

      seenSids.add(
        card.sid
      );
    }

    card.tags =
      Array.isArray(
        card.tags
      )
        ? card.tags
        : [];

    card.grammar =
      card.grammar &&
      typeof card.grammar ===
        "object"
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

    normalized.push(
      card
    );
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

  state.theme =
    localStorage.getItem(
      CONFIG.storage.theme
    ) || "dark";

  if (
    !["ja", "de"].includes(
      state.uiLanguage
    )
  ) {
    state.uiLanguage =
      "ja";
  }

  if (
    !["dark", "light"].includes(
      state.theme
    )
  ) {
    state.theme =
      "dark";
  }
}


function readJsonStorage(
  key,
  fallback
) {
  try {
    const raw =
      localStorage.getItem(
        key
      );

    if (!raw) {
      return fallback;
    }

    return JSON.parse(
      raw
    );
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
      [
        ...state.bookmarks
      ]
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


function saveTheme() {
  localStorage.setItem(
    CONFIG.storage.theme,
    state.theme
  );
}


/* =========================================================
   Theme
========================================================= */

function toggleTheme() {
  state.theme =
    state.theme ===
      "dark"
      ? "light"
      : "dark";

  saveTheme();

  applyTheme();
}


function applyTheme() {
  document.documentElement
    .setAttribute(
      "data-theme",
      state.theme
    );

  if (
    state.theme ===
    "dark"
  ) {
    dom.themeToggle.textContent =
      "☀︎";

    dom.themeToggle.title =
      "Light Mode";

    dom.themeColorMeta
      ?.setAttribute(
        "content",
        "#0b0b0b"
      );
  } else {
    dom.themeToggle.textContent =
      "☾";

    dom.themeToggle.title =
      "Dark Mode";

    dom.themeColorMeta
      ?.setAttribute(
        "content",
        "#f5f5f5"
      );
  }
}


/* =========================================================
   UI Language
========================================================= */

function toggleUiLanguage() {
  state.uiLanguage =
    state.uiLanguage ===
      "ja"
      ? "de"
      : "ja";

  saveUiLanguage();

  updateUiLanguage();

  renderTodayWords();

  applyFilters();

  if (
    state.selectedCard
  ) {
    renderDetail(
      state.selectedCard
    );
  }
}


function updateUiLanguage() {
  document.documentElement.lang =
    state.uiLanguage ===
      "ja"
      ? "ja"
      : "de";

  dom.languageToggle.textContent =
    state.uiLanguage ===
      "ja"
      ? "DE"
      : "JP";

  dom.languageToggle.title =
    state.uiLanguage ===
      "ja"
      ? "Deutsch anzeigen"
      : "日本語表示";


  dom.todayTitle.textContent =
    text(
      "todayTitle"
    );

  dom.todaySubtitle.textContent =
    text(
      "todaySubtitle"
    );

  dom.searchLabel.textContent =
    text(
      "searchLabel"
    );

  dom.searchInput.placeholder =
    text(
      "searchPlaceholder"
    );

  dom.dictionaryTitle.textContent =
    text(
      "dictionaryTitle"
    );

  dom.dictionarySubtitle.textContent =
    text(
      "dictionarySubtitle"
    );

  dom.resetFiltersButton.textContent =
    text(
      "reset"
    );

  dom.levelLabel.textContent =
    text(
      "level"
    );

  dom.posLabel.textContent =
    text(
      "pos"
    );

  dom.freqLabel.textContent =
    text(
      "frequency"
    );

  dom.statusLabel.textContent =
    text(
      "status"
    );

  dom.bookmarkLabel.textContent =
    text(
      "bookmark"
    );

  dom.tagLabel.textContent =
    text(
      "tag"
    );

  dom.sortLabel.textContent =
    text(
      "sort"
    );


  /* All options */

  dom.levelAllOption.textContent =
    text(
      "all"
    );

  dom.posAllOption.textContent =
    text(
      "all"
    );

  dom.freqAllOption.textContent =
    text(
      "all"
    );

  dom.statusAllOption.textContent =
    text(
      "all"
    );

  dom.bookmarkAllOption.textContent =
    text(
      "all"
    );

  dom.tagAllOption.textContent =
    text(
      "all"
    );


  /* Status */

  dom.statusKnownOption.textContent =
    text(
      "known"
    );

  dom.statusLearningOption.textContent =
    text(
      "learning"
    );

  dom.statusUnsetOption.textContent =
    text(
      "unset"
    );


  /* Bookmark */

  dom.bookmarkOnlyOption.textContent =
    text(
      "bookmarkOnly"
    );


  /* Sorting */

  dom.sortNewOption.textContent =
    text(
      "newest"
    );

  dom.sortOldOption.textContent =
    text(
      "oldest"
    );

  dom.sortLevelOption.textContent =
    text(
      "levelSort"
    );


  /* Detail */

  dom.backToDictionaryButton.textContent =
    text(
      "back"
    );

  dom.meaningTitle.textContent =
    text(
      "meaning"
    );

  dom.nuanceTitle.textContent =
    text(
      "nuance"
    );

  dom.conjugationTitle.textContent =
    text(
      "conjugation"
    );

  dom.collocationsTitle.textContent =
    text(
      "collocations"
    );

  dom.minimalTitle.textContent =
    text(
      "minimal"
    );

  dom.equivalentsTitle.textContent =
    text(
      "equivalents"
    );

  dom.etymologyTitle.textContent =
    text(
      "etymology"
    );

  dom.exampleTitle.textContent =
    text(
      "example"
    );

  dom.taskTitle.textContent =
    text(
      "task"
    );


  /* Learning Buttons */

  dom.learningStatusLabel.textContent =
    text(
      "learningStatus"
    );

  dom.statusUnsetButton.textContent =
    text(
      "statusUnset"
    );

  dom.statusKnownButton.textContent =
    text(
      "statusKnown"
    );

  dom.statusLearningButton.textContent =
    text(
      "statusLearning"
    );


  updateGlobalWordCount();
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

  return (
    `${year}-${month}-${day}`
  );
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
    Array.isArray(
      stored.ids
    )
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
      card =>
        card.id
    );

  localStorage.setItem(
    CONFIG.storage.todayWords,
    JSON.stringify({
      date:
        getTodayKey(),

      ids:
        state.todayWordIds
    })
  );
}


function weightedRandomCards(
  cards,
  count
) {
  if (
    cards.length <=
    count
  ) {
    return [
      ...cards
    ];
  }

  const pool =
    cards.map(
      card => ({
        card,
        weight:
          getTodayWeight(
            card
          )
      })
    );

  const result =
    [];

  while (
    result.length <
      count &&
    pool.length > 0
  ) {
    const totalWeight =
      pool.reduce(
        (
          sum,
          item
        ) =>
          sum +
          item.weight,
        0
      );

    let random =
      Math.random() *
      totalWeight;

    let selectedIndex =
      0;

    for (
      let i = 0;
      i <
      pool.length;
      i += 1
    ) {
      random -=
        pool[i].weight;

      if (
        random <= 0
      ) {
        selectedIndex =
          i;

        break;
      }
    }

    result.push(
      pool[
        selectedIndex
      ].card
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

  let weight =
    1;

  if (
    freq ===
    "very rare"
  ) {
    weight =
      3.4;
  } else if (
    freq ===
    "rare"
  ) {
    weight =
      2.8;
  } else if (
    freq ===
    "sometimes"
  ) {
    weight =
      1.8;
  } else if (
    freq ===
    "often"
  ) {
    weight =
      1.1;
  } else if (
    freq ===
    "very often"
  ) {
    weight =
      0.8;
  }

  const status =
    getLearningStatus(
      card.id
    );

  if (
    status ===
    "known"
  ) {
    weight *=
      0.65;
  }

  if (
    status ===
    "learning"
  ) {
    weight *=
      1.45;
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
              card.id ===
              id
          )
      )
      .filter(
        Boolean
      );

  if (
    cards.length ===
    0
  ) {
    dom.todayWordList.innerHTML =
      `
        <div class="empty-message">
          ${escapeHtml(
            text(
              "noTodayWords"
            )
          )}
        </div>
      `;

    return;
  }

  for (
    const card
    of cards
  ) {
    dom.todayWordList
      .appendChild(
        createHeadlineItem(
          card
        )
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
    [
      ...state.cards
    ];


  if (search) {
    result =
      result.filter(
        card =>
          buildSearchText(
            card
          ).includes(
            search
          )
      );
  }


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


  if (pos) {
    result =
      result.filter(
        card =>
          card.grammar
            ?.pos === pos
      );
  }


  if (freq) {
    result =
      result.filter(
        card =>
          normalizeString(
            card.freq
          ) ===
          normalizeString(
            freq
          )
      );
  }


  if (status) {
    result =
      result.filter(
        card =>
          getLearningStatus(
            card.id
          ) ===
          status
      );
  }


  if (
    bookmark ===
    "bookmarked"
  ) {
    result =
      result.filter(
        card =>
          state.bookmarks
            .has(
              card.id
            )
      );
  }


  if (tag) {
    result =
      result.filter(
        card =>
          card.tags
            .includes(
              tag
            )
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

    ...(
      card.tags ||
      []
    ),

    flattenObjectText(
      card.meaning
    ),

    flattenObjectText(
      card.nuance
    ),

    flattenObjectText(
      card.minimal
    ),

    flattenObjectText(
      card.etymology
    ),

    flattenObjectText(
      card.example
    ),

    flattenObjectText(
      card.task
    ),

    flattenObjectText(
      card.equivalents
    ),

    flattenObjectText(
      card.conjugation
    ),

    flattenObjectText(
      card.collocations
    ),

    flattenObjectText(
      card.pronunciation
    )
  ];

  return normalizeString(
    parts
      .filter(
        Boolean
      )
      .join(
        " "
      )
  );
}


function flattenObjectText(value) {
  if (
    value === null ||
    value ===
      undefined
  ) {
    return "";
  }

  if (
    typeof value ===
      "string" ||
    typeof value ===
      "number" ||
    typeof value ===
      "boolean"
  ) {
    return String(
      value
    );
  }

  if (
    Array.isArray(
      value
    )
  ) {
    return value
      .map(
        flattenObjectText
      )
      .join(
        " "
      );
  }

  if (
    typeof value ===
      "object"
  ) {
    return Object
      .values(
        value
      )
      .map(
        flattenObjectText
      )
      .join(
        " "
      );
  }

  return "";
}


/* =========================================================
   Level Matching
========================================================= */

function cardMatchesLevel(
  card,
  selectedLevel
) {
  if (
    !card.level
  ) {
    return false;
  }

  const normalized =
    String(
      card.level
    )
      .toUpperCase()
      .replace(
        /\s+/g,
        ""
      );

  return normalized
    .includes(
      selectedLevel
        .toUpperCase()
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
    [
      ...cards
    ];

  switch (mode) {

    case "reverse":

      result.sort(
        (
          a,
          b
        ) =>
          compareWords(
            b.word,
            a.word
          )
      );

      break;


    case "sid-new":

      result.sort(
        (
          a,
          b
        ) =>
          compareSid(
            b.sid,
            a.sid
          )
      );

      break;


    case "sid-old":

      result.sort(
        (
          a,
          b
        ) =>
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
        (
          a,
          b
        ) =>
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
  return String(
    a ||
    ""
  ).localeCompare(
    String(
      b ||
      ""
    ),
    "de",
    {
      sensitivity:
        "base"
    }
  );
}


function compareSid(
  a,
  b
) {
  return String(
    a ||
    ""
  ).localeCompare(
    String(
      b ||
      ""
    )
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
    aLevel !==
    bLevel
  ) {
    return (
      aLevel -
      bLevel
    );
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
    String(
      level
    )
      .toUpperCase()
      .match(
        /A1|A2|B1|B2|C1|C2/g
      );

  if (
    !matches ||
    matches.length ===
      0
  ) {
    return 999;
  }

  return Math.min(
    ...matches.map(
      item =>
        order[item] ||
        999
    )
  );
}


/* =========================================================
   Dictionary List
========================================================= */

function renderDictionaryList() {
  dom.dictionaryWordList
    .innerHTML =
    "";

  const count =
    state.filteredCards
      .length;

  dom.filteredWordCount
    .textContent =
    formatWordCount(
      count
    );

  if (
    count ===
    0
  ) {
    dom.dictionaryWordList
      .innerHTML =
      `
        <div class="empty-message">
          ${escapeHtml(
            text(
              "noResults"
            )
          )}
        </div>
      `;

    return;
  }

  const fragment =
    document
      .createDocumentFragment();

  for (
    const card
    of state.filteredCards
  ) {
    fragment.appendChild(
      createHeadlineItem(
        card
      )
    );
  }

  dom.dictionaryWordList
    .appendChild(
      fragment
    );
}


function createHeadlineItem(card) {
  const button =
    document.createElement(
      "button"
    );

  button.type =
    "button";

  button.className =
    "headline-item";

  button.dataset.cardId =
    card.id;


  const word =
    document.createElement(
      "span"
    );

  word.className =
    "headline-word";

  word.textContent =
    card.word;


  const meta =
    document.createElement(
      "span"
    );

  meta.className =
    "headline-meta";

  const indicators =
    [];

  if (
    state.bookmarks
      .has(
        card.id
      )
  ) {
    indicators.push(
      "★"
    );
  }

  const status =
    getLearningStatus(
      card.id
    );

  if (
    status ===
    "known"
  ) {
    indicators.push(
      "✓"
    );
  } else if (
    status ===
    "learning"
  ) {
    indicators.push(
      "●"
    );
  }

  meta.textContent =
    indicators.join(
      " "
    );

  button.append(
    word,
    meta
  );

  button.addEventListener(
    "click",
    () =>
      openCard(
        card.id
      )
  );

  return button;
}


/* =========================================================
   Tag Filter
========================================================= */

function populateTagFilter() {
  const currentValue =
    dom.tagFilter.value;

  const tags =
    new Set();

  for (
    const card
    of state.cards
  ) {
    for (
      const tag
      of card.tags ||
      []
    ) {
      if (tag) {
        tags.add(
          tag
        );
      }
    }
  }

  while (
    dom.tagFilter
      .options.length >
    1
  ) {
    dom.tagFilter.remove(
      1
    );
  }

  const sortedTags =
    [
      ...tags
    ].sort(
      (
        a,
        b
      ) =>
        a.localeCompare(
          b,
          "de",
          {
            sensitivity:
              "base"
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

    dom.tagFilter
      .appendChild(
        option
      );
  }

  if (
    sortedTags.includes(
      currentValue
    )
  ) {
    dom.tagFilter.value =
      currentValue;
  }
}


/* =========================================================
   Filter Summary
========================================================= */

function renderFilterSummary() {
  const active =
    [];

  if (
    dom.searchInput
      .value
      .trim()
  ) {
    active.push(
      `${text(
        "searchPrefix"
      )}: ${
        dom.searchInput
          .value
          .trim()
      }`
    );
  }

  if (
    dom.levelFilter.value
  ) {
    active.push(
      `${text(
        "levelPrefix"
      )}: ${
        dom.levelFilter
          .value
      }`
    );
  }

  if (
    dom.posFilter.value
  ) {
    active.push(
      `${text(
        "posPrefix"
      )}: ${
        formatPosLabel(
          dom.posFilter
            .value
        )
      }`
    );
  }

  if (
    dom.freqFilter.value
  ) {
    active.push(
      `${text(
        "freqPrefix"
      )}: ${
        dom.freqFilter
          .value
      }`
    );
  }

  if (
    dom.statusFilter.value
  ) {
    active.push(
      `${text(
        "statusPrefix"
      )}: ${
        formatLearningStatus(
          dom.statusFilter
            .value
        )
      }`
    );
  }

  if (
    dom.bookmarkFilter
      .value
  ) {
    active.push(
      text(
        "bookmark"
      )
    );
  }

  if (
    dom.tagFilter.value
  ) {
    active.push(
      `${text(
        "tagPrefix"
      )}: ${
        dom.tagFilter
          .value
      }`
    );
  }

  dom.activeFilterSummary
    .textContent =
    active.length
      ? active.join(
          " · "
        )
      : "";
}


/* =========================================================
   Detail Navigation
========================================================= */

function openCard(cardId) {
  const card =
    state.cards.find(
      item =>
        item.id ===
        cardId
    );

  if (!card) {
    return;
  }

  state.selectedCard =
    card;

  renderDetail(
    card
  );

  dom.dictionaryView
    .classList.add(
      "hidden"
    );

  dom.detailView
    .classList.remove(
      "hidden"
    );

  dom.detailView
    .setAttribute(
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
      cardId:
        card.id
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

  dom.detailView
    .classList.add(
      "hidden"
    );

  dom.detailView
    .setAttribute(
      "aria-hidden",
      "true"
    );

  dom.dictionaryView
    .classList.remove(
      "hidden"
    );

  if (
    updateHistory
  ) {
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
    card.word ||
    "";

  renderPronunciation(
    card
  );

  renderMeta(
    card
  );

  renderTags(
    card
  );

  updateBookmarkButton(
    card
  );

  updateStatusButtons(
    card
  );

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

  renderConjugation(
    card
  );

  renderCollocations(
    card
  );

  renderLocalizedSection(
    dom.minimalSection,
    dom.detailMinimal,
    card.minimal
  );

  renderEquivalents(
    card
  );

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
    getPronunciationText(
      card
    );

  if (!pronunciation) {
    dom.detailPronunciation
      .textContent =
      "";

    dom.detailPronunciation
      .classList.add(
        "hidden"
      );

    return;
  }

  dom.detailPronunciation
    .textContent =
    pronunciation;

  dom.detailPronunciation
    .classList.remove(
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
    typeof value ===
    "string"
  ) {
    return value;
  }

  if (
    typeof value ===
    "object"
  ) {
    if (
      value.ipa
    ) {
      return value.ipa;
    }

    if (
      value.IPA
    ) {
      return value.IPA;
    }
  }

  return "";
}


/* =========================================================
   Meta
========================================================= */

function renderMeta(card) {
  const parts =
    [];

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

  if (
    card.level
  ) {
    parts.push(
      card.level
    );
  }

  if (
    card.freq
  ) {
    parts.push(
      card.freq
    );
  }

  if (
    card.sid
  ) {
    parts.push(
      card.sid
    );
  }

  dom.detailMeta
    .textContent =
    parts.join(
      " · "
    );
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
    particle:
      "Partikel",
    interj:
      "Interj",
    phrase:
      "Phrase",
    idiom:
      "Redewendung"
  };

  return (
    labels[pos] ||
    pos
  );
}


function formatGender(gender) {
  const labels = {
    m: "Mask.",
    f: "Fem.",
    n: "Neutr.",
    "m/f": "m/f"
  };

  return (
    labels[gender] ||
    gender
  );
}


/* =========================================================
   Tags
========================================================= */

function renderTags(card) {
  dom.detailTags
    .innerHTML =
    "";

  if (
    !Array.isArray(
      card.tags
    ) ||
    card.tags.length ===
      0
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

    dom.detailTags
      .appendChild(
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
    typeof value !==
      "object"
  ) {
    sectionElement
      .classList.add(
        "hidden"
      );

    targetElement
      .innerHTML =
      "";

    return;
  }

  const primaryLanguage =
    state.uiLanguage;

  const secondaryLanguage =
    primaryLanguage ===
      "ja"
      ? "de"
      : "ja";

  const primaryText =
    value[
      primaryLanguage
    ];

  const secondaryText =
    value[
      secondaryLanguage
    ];

  if (
    !primaryText &&
    !secondaryText
  ) {
    sectionElement
      .classList.add(
        "hidden"
      );

    targetElement
      .innerHTML =
      "";

    return;
  }

  sectionElement
    .classList.remove(
      "hidden"
    );

  targetElement
    .innerHTML =
    "";

  if (
    primaryText
  ) {
    const primary =
      document.createElement(
        "div"
      );

    primary.className =
      primaryLanguage ===
        "ja"
        ? "detail-japanese"
        : "detail-german";

    primary.textContent =
      primaryText;

    targetElement
      .appendChild(
        primary
      );
  }

  if (
    secondaryText
  ) {
    const secondary =
      document.createElement(
        "div"
      );

    secondary.className =
      secondaryLanguage ===
        "ja"
        ? "detail-japanese"
        : "detail-german";

    secondary.textContent =
      secondaryText;

    targetElement
      .appendChild(
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
    typeof equivalents !==
      "object" ||
    Object.keys(
      equivalents
    ).length ===
      0
  ) {
    dom.equivalentsSection
      .classList.add(
        "hidden"
      );

    dom.detailEquivalents
      .innerHTML =
      "";

    return;
  }

  dom.equivalentsSection
    .classList.remove(
      "hidden"
    );

  dom.detailEquivalents
    .innerHTML =
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
    Object.keys(
      equivalents
    )
      .sort(
        (
          a,
          b
        ) => {
          const aIndex =
            languageOrder
              .indexOf(
                a
              );

          const bIndex =
            languageOrder
              .indexOf(
                b
              );

          const aRank =
            aIndex === -1
              ? 999
              : aIndex;

          const bRank =
            bIndex === -1
              ? 999
              : bIndex;

          return (
            aRank -
            bRank
          );
        }
      );

  for (
    const lang
    of keys
  ) {
    const values =
      equivalents[
        lang
      ];

    const valueText =
      Array.isArray(
        values
      )
        ? values.join(
            ", "
          )
        : String(
            values ||
            ""
          );

    if (
      !valueText
    ) {
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
      valueText;


    row.append(
      label,
      value
    );

    wrapper.appendChild(
      row
    );
  }

  dom.detailEquivalents
    .appendChild(
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
    typeof conjugation !==
      "object"
  ) {
    dom.conjugationSection
      .classList.add(
        "hidden"
      );

    dom.detailConjugation
      .innerHTML =
      "";

    return;
  }

  dom.conjugationSection
    .classList.remove(
      "hidden"
    );

  dom.detailConjugation
    .innerHTML =
    "";

  const wrapper =
    document.createElement(
      "div"
    );

  wrapper.className =
    "conjugation-block";


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
    wrapper.appendChild(
      createConjugationVariant(
        conjugation
      )
    );
  }

  dom.detailConjugation
    .appendChild(
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


  const titleParts =
    [];

  if (
    data.meaning
  ) {
    titleParts.push(
      data.meaning
    );
  }

  if (
    data.stress
  ) {
    titleParts.push(
      data.stress
    );
  }

  if (
    titleParts.length >
    0
  ) {
    const title =
      document.createElement(
        "div"
      );

    title.className =
      "conjugation-variant-title";

    title.textContent =
      titleParts.join(
        " · "
      );

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
      value ===
        undefined
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
    value ===
    true
  ) {
    return "ja";
  }

  if (
    value ===
    false
  ) {
    return "nein";
  }

  return value;
}


/* =========================================================
   Collocations
========================================================= */

function renderCollocations(card) {
  const collocations =
    card.collocations;

  if (
    !collocations
  ) {
    hideCollocations();

    return;
  }


  /* Array format */

  if (
    Array.isArray(
      collocations
    )
  ) {
    if (
      collocations.length ===
      0
    ) {
      hideCollocations();

      return;
    }

    renderCollocationArray(
      collocations
    );

    return;
  }


  /* Localized object format */

  if (
    typeof collocations ===
      "object" &&
    (
      collocations.ja ||
      collocations.de
    )
  ) {
    renderLocalizedSection(
      dom.collocationsSection,
      dom.detailCollocations,
      collocations
    );

    return;
  }


  /* String */

  if (
    typeof collocations ===
      "string"
  ) {
    dom.collocationsSection
      .classList.remove(
        "hidden"
      );

    dom.detailCollocations
      .textContent =
      collocations;

    return;
  }


  hideCollocations();
}


function hideCollocations() {
  dom.collocationsSection
    .classList.add(
      "hidden"
    );

  dom.detailCollocations
    .innerHTML =
    "";
}


function renderCollocationArray(
  collocations
) {
  dom.collocationsSection
    .classList.remove(
      "hidden"
    );

  dom.detailCollocations
    .innerHTML =
    "";

  const wrapper =
    document.createElement(
      "div"
    );

  wrapper.className =
    "collocation-list";

  for (
    const item
    of collocations
  ) {
    if (
      !item
    ) {
      continue;
    }

    if (
      typeof item ===
      "string"
    ) {
      const simple =
        document.createElement(
          "div"
        );

      simple.className =
        "collocation-item";

      simple.textContent =
        item;

      wrapper.appendChild(
        simple
      );

      continue;
    }

    if (
      typeof item !==
      "object"
    ) {
      continue;
    }

    const container =
      document.createElement(
        "div"
      );

    container.className =
      "collocation-item";


    /* German */

    if (
      item.de
    ) {
      const de =
        document.createElement(
          "div"
        );

      de.className =
        "collocation-de";

      de.textContent =
        item.de;

      container.appendChild(
        de
      );
    }


    /* Japanese */

    if (
      item.ja
    ) {
      const ja =
        document.createElement(
          "div"
        );

      ja.className =
        "collocation-ja";

      ja.textContent =
        item.ja;

      container.appendChild(
        ja
      );
    }


    /* Note */

    if (
      item.note
    ) {
      const note =
        document.createElement(
          "div"
        );

      note.className =
        "collocation-note";

      note.textContent =
        item.note;

      container.appendChild(
        note
      );
    }


    if (
      container.childNodes
        .length >
      0
    ) {
      wrapper.appendChild(
        container
      );
    }
  }


  if (
    wrapper.childNodes
      .length ===
    0
  ) {
    hideCollocations();

    return;
  }

  dom.detailCollocations
    .appendChild(
      wrapper
    );
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
    state.bookmarks
      .has(
        card.id
      )
  ) {
    state.bookmarks
      .delete(
        card.id
      );

    showToast(
      text(
        "bookmarkRemoved"
      )
    );
  } else {
    state.bookmarks
      .add(
        card.id
      );

    showToast(
      text(
        "bookmarked"
      )
    );
  }

  saveBookmarks();

  updateBookmarkButton(
    card
  );

  renderTodayWords();

  applyFilters();
}


function updateBookmarkButton(card) {
  const bookmarked =
    state.bookmarks
      .has(
        card.id
      );

  dom.bookmarkButton
    .textContent =
    bookmarked
      ? "★"
      : "☆";

  dom.bookmarkButton
    .classList.toggle(
      "active",
      bookmarked
    );

  dom.bookmarkButton
    .setAttribute(
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
    value ===
      "known" ||
    value ===
      "learning"
  ) {
    return value;
  }

  return "unset";
}


function setLearningStatus(
  status
) {
  const card =
    state.selectedCard;

  if (!card) {
    return;
  }

  if (
    status ===
    "unset"
  ) {
    delete state
      .learningStatus[
        card.id
      ];
  } else {
    state.learningStatus[
      card.id
    ] =
      status;
  }

  saveLearningStatus();

  updateStatusButtons(
    card
  );

  renderTodayWords();

  applyFilters();


  if (
    status ===
    "known"
  ) {
    showToast(
      text(
        "setKnown"
      )
    );
  } else if (
    status ===
    "learning"
  ) {
    showToast(
      text(
        "setLearning"
      )
    );
  } else {
    showToast(
      text(
        "setUnset"
      )
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
    button.classList
      .toggle(
        "active",
        button.dataset
          .status ===
          status
      );
  }
}


function formatLearningStatus(
  status
) {
  if (
    status ===
    "known"
  ) {
    return text(
      "known"
    );
  }

  if (
    status ===
    "learning"
  ) {
    return text(
      "learning"
    );
  }

  return text(
    "unset"
  );
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
  if (
    !dom.wordCount
  ) {
    return;
  }

  dom.wordCount.textContent =
    formatWordCount(
      state.cards.length
    );
}


function formatWordCount(
  count
) {
  if (
    state.uiLanguage ===
    "de"
  ) {
    return `${count} ${
      count === 1
        ? "Wort"
        : "Wörter"
    }`;
  }

  return `${count}語`;
}


/* =========================================================
   URL / History
========================================================= */

function handleInitialUrlState() {
  const url =
    new URL(
      window.location.href
    );

  const cardId =
    url.searchParams
      .get(
        "word"
      );

  if (!cardId) {
    return;
  }

  const exists =
    state.cards.some(
      card =>
        card.id ===
        cardId
    );

  if (
    exists
  ) {
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
        item.id ===
        cardId
    );

  if (!card) {
    return;
  }

  state.selectedCard =
    card;

  renderDetail(
    card
  );

  dom.dictionaryView
    .classList.add(
      "hidden"
    );

  dom.detailView
    .classList.remove(
      "hidden"
    );

  dom.detailView
    .setAttribute(
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
      url.searchParams
        .get(
          "word"
        );

    if (
      cardId
    ) {
      openCardWithoutHistory(
        cardId
      );
    } else {
      closeDetail({
        updateHistory:
          false
      });
    }
  }
);


/* =========================================================
   Events
========================================================= */

function bindEvents() {

  dom.searchInput
    .addEventListener(
      "input",
      applyFilters
    );


  dom.clearSearchButton
    .addEventListener(
      "click",
      () => {
        dom.searchInput.value =
          "";

        applyFilters();

        dom.searchInput
          .focus();
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


  dom.resetFiltersButton
    .addEventListener(
      "click",
      resetFilters
    );


  dom.refreshTodayButton
    .addEventListener(
      "click",
      () => {
        generateTodayWords();

        renderTodayWords();

        showToast(
          text(
            "refreshToday"
          )
        );
      }
    );


  dom.languageToggle
    .addEventListener(
      "click",
      toggleUiLanguage
    );


  dom.themeToggle
    .addEventListener(
      "click",
      toggleTheme
    );


  dom.backToDictionaryButton
    .addEventListener(
      "click",
      () => {
        if (
          history.state &&
          history.state
            .cardId
        ) {
          history.back();
        } else {
          closeDetail();
        }
      }
    );


  dom.bookmarkButton
    .addEventListener(
      "click",
      toggleBookmark
    );


  dom.statusUnsetButton
    .addEventListener(
      "click",
      () =>
        setLearningStatus(
          "unset"
        )
    );


  dom.statusKnownButton
    .addEventListener(
      "click",
      () =>
        setLearningStatus(
          "known"
        )
    );


  dom.statusLearningButton
    .addEventListener(
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
        dom.toast
          .classList.add(
            "hidden"
          );
      },
      1800
    );
}


/* =========================================================
   Fatal Error
========================================================= */

function showFatalError(
  message
) {
  dom.todayWordList
    .innerHTML =
    `
      <div class="empty-message">
        ${escapeHtml(
          message
        )}
      </div>
    `;

  dom.dictionaryWordList
    .innerHTML =
    `
      <div class="empty-message">
        ${escapeHtml(
          message
        )}
      </div>
    `;

  dom.wordCount
    .textContent =
    "Error";
}


/* =========================================================
   Utility
========================================================= */

function normalizeString(
  value
) {
  return String(
    value ??
    ""
  )
    .normalize(
      "NFKC"
    )
    .toLocaleLowerCase(
      "de-DE"
    )
    .trim();
}


function escapeHtml(
  value
) {
  return String(
    value
  )
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