/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 569:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _constants = _interopRequireDefault(__webpack_require__(357));

var _helper = __webpack_require__(582);

var _webConfig = _interopRequireDefault(__webpack_require__(863));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class DataMigration {
  // Only append so the order stays the same (oldest first).
  constructor(config) {
    _defineProperty(this, "cfg", void 0);

    this.cfg = config;
  }

  static async build() {
    const cfg = await _webConfig.default.build();
    return new DataMigration(cfg);
  }

  static latestMigration() {
    return DataMigration.migrations[DataMigration.migrations.length - 1];
  }

  static migrationNeeded(oldVersion) {
    return (0, _helper.isVersionOlder)((0, _helper.getVersion)(oldVersion), (0, _helper.getVersion)(DataMigration.latestMigration().version));
  } // [2.7.0]


  addWordlistsToWords() {
    const cfg = this.cfg;
    Object.keys(cfg.words).forEach(key => {
      const word = cfg.words[key];

      if (!Array.isArray(word.lists)) {
        word.lists = [];
      }
    });
  } // This will look at the version (from before the update) and perform data migrations if necessary


  byVersion(oldVersion) {
    const version = (0, _helper.getVersion)(oldVersion);
    let migrated = false;
    DataMigration.migrations.forEach(migration => {
      if ((0, _helper.isVersionOlder)(version, (0, _helper.getVersion)(migration.version))) {
        migrated = true;
        this[migration.name]();
      }
    });
    return migrated;
  } // [2.3.0]


  fixSmartWatch() {
    const cfg = this.cfg;
    const originalWord = 'twat';
    const originalWordConf = {
      matchMethod: _constants.default.MATCH_METHODS.PARTIAL,
      repeat: true,
      sub: 'dumbo'
    };
    const update = {
      twat: {
        matchMethod: _constants.default.MATCH_METHODS.EXACT,
        repeat: true,
        sub: 'dumbo'
      },
      twats: {
        matchMethod: _constants.default.MATCH_METHODS.EXACT,
        repeat: true,
        sub: 'dumbos'
      }
    };

    if (cfg.words[originalWord] && cfg.words[originalWord].matchMethod == originalWordConf.matchMethod && cfg.words[originalWord].sub == originalWordConf.sub) {
      Object.keys(update).forEach(word => {
        cfg.words[word] = update[word];
      });
    }
  } // [1.0.13] - updateRemoveWordsFromStorage - transition from previous words structure under the hood


  moveToNewWordsStorage() {
    chrome.storage.sync.get({
      'words': null
    }, oldWords => {
      if (oldWords.words) {
        chrome.storage.sync.set({
          '_words0': oldWords.words
        }, () => {
          if (!chrome.runtime.lastError) {
            // Remove old words
            chrome.storage.sync.remove('words');
          }
        });
      }
    });
  } // This setting has caused some issues for users specifically with Disney+.
  // This migration should only run once, and sets it to the new default of false.


  overwriteMuteCueRequireShowingDefault() {
    const cfg = this.cfg;

    if (cfg.muteCueRequireShowing === true) {
      cfg.muteCueRequireShowing = false;
    }
  }

  removeGlobalMatchMethod() {
    const cfg = this.cfg;

    if (cfg.globalMatchMethod !== undefined) {
      Object.keys(cfg.words).forEach(name => {
        const word = cfg.words[name]; // Move RegExp from 4 to 3

        if (word.matchMethod === 4) {
          word.matchMethod = _constants.default.MATCH_METHODS.REGEX;
        }
      });
      cfg.remove('globalMatchMethod');
    }
  }

  removeOldDomainArrays() {
    const cfg = this.cfg;

    if (!cfg.domains) {
      cfg.domains = {};
    }

    const propsToDelete = {
      advancedDomains: 'adv',
      disabledDomains: 'disabled',
      enabledDomains: 'enabled'
    };
    Object.keys(propsToDelete).forEach(propToDelete => {
      if (cfg[propToDelete] && Array.isArray(cfg[propToDelete])) {
        if (cfg[propToDelete].length > 0) {
          cfg[propToDelete].forEach(domain => {
            if (domain) {
              if (cfg.domains[domain] == null) {
                cfg.domains[domain] = {};
              }

              cfg.domains[domain][propsToDelete[propToDelete]] = true;
            }
          });
        }
      }

      delete cfg[propToDelete];
    });
  }

  runImportMigrations() {
    let migrated = false;
    DataMigration.migrations.forEach(migration => {
      if (migration.runOnImport) {
        migrated = true;
        this[migration.name]();
      }
    });
    return migrated;
  } // [1.1.0] - Downcase and trim each word in the list (NOTE: This MAY result in losing some words)


  sanitizeWords() {
    this.cfg.sanitizeWords();
  } // [1.2.0] - Change from a word having many substitutions to a single substitution ({words: []} to {sub: ''})


  singleWordSubstitution() {
    const cfg = this.cfg;
    Object.keys(cfg.words).forEach(word => {
      const wordObj = cfg.words[word];

      if (wordObj.hasOwnProperty('words')) {
        // @ts-ignore: Old 'words' doesn't exist on Interface.
        wordObj.sub = wordObj.words[0] || ''; // @ts-ignore: Old 'words' doesn't exist on Interface.

        delete wordObj.words;
      }
    });
  } // [2.1.4] - Update default sub values


  updateDefaultSubs() {
    const cfg = this.cfg;
    const updatedWords = {
      bastard: {
        original: 'jerk',
        update: 'idiot'
      },
      bitch: {
        original: 'jerk',
        update: 'bench'
      },
      cocksucker: {
        original: 'idiot',
        update: 'suckup'
      },
      cunt: {
        original: 'explative',
        update: 'expletive'
      },
      fag: {
        original: 'slur',
        update: 'gay'
      },
      faggot: {
        original: 'slur',
        update: 'gay'
      },
      fags: {
        original: 'slur',
        update: 'gays'
      },
      fuck: {
        original: 'fudge',
        update: 'freak'
      },
      goddammit: {
        original: 'goshdangit',
        update: 'dangit'
      },
      jackass: {
        original: 'idiot',
        update: 'jerk'
      },
      nigga: {
        original: 'ethnic slur',
        update: 'bruh'
      },
      nigger: {
        original: 'ethnic slur',
        update: 'man'
      },
      niggers: {
        original: 'ethnic slurs',
        update: 'people'
      },
      tits: {
        original: 'explative',
        update: 'chest'
      },
      twat: {
        original: 'explative',
        update: 'dumbo'
      }
    };
    Object.keys(updatedWords).forEach(updatedWord => {
      if (cfg.words[updatedWord]) {
        const wordObj = cfg.words[updatedWord];

        if (wordObj.sub == updatedWords[updatedWord].original) {
          wordObj.sub = updatedWords[updatedWord].update;
        }
      }
    });
  } // [2.22.0] - Update word repeat and separator data types


  updateWordRepeatAndSeparatorDataTypes() {
    const cfg = this.cfg;
    Object.keys(cfg.words).forEach(word => {
      const wordOptions = cfg.words[word]; // @ts-ignore: Converting repeat from boolean to number

      if (wordOptions.repeat === true || wordOptions.repeat === false) {
        wordOptions.repeat = (0, _helper.booleanToNumber)(wordOptions.repeat);
      } else if (wordOptions.repeat == null) {
        wordOptions.repeat = cfg.defaultWordRepeat;
      } // @ts-ignore: Converting separators from boolean to number


      if (wordOptions.separators === true || wordOptions.separators === false) {
        wordOptions.separators = (0, _helper.booleanToNumber)(wordOptions.separators);
      } else if (wordOptions.separators == null) {
        wordOptions.separators = cfg.defaultWordSeparators;
      }
    });
  }

}

exports.default = DataMigration;

_defineProperty(DataMigration, "migrations", [{
  version: '1.0.13',
  name: 'moveToNewWordsStorage',
  runOnImport: false
}, {
  version: '1.1.0',
  name: 'sanitizeWords',
  runOnImport: true
}, {
  version: '1.2.0',
  name: 'singleWordSubstitution',
  runOnImport: true
}, {
  version: '2.1.4',
  name: 'updateDefaultSubs',
  runOnImport: false
}, {
  version: '2.3.0',
  name: 'fixSmartWatch',
  runOnImport: false
}, {
  version: '2.7.0',
  name: 'addWordlistsToWords',
  runOnImport: true
}, {
  version: '2.7.0',
  name: 'removeGlobalMatchMethod',
  runOnImport: true
}, {
  version: '2.7.0',
  name: 'removeOldDomainArrays',
  runOnImport: true
}, {
  version: '2.12.0',
  name: 'overwriteMuteCueRequireShowingDefault',
  runOnImport: false
}, {
  version: '2.22.0',
  name: 'updateWordRepeatAndSeparatorDataTypes',
  runOnImport: true
}]);

/***/ }),

/***/ 50:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _constants = _interopRequireDefault(__webpack_require__(357));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Domain {
  static byHostname(hostname, domains) {
    const cfgKey = Domain.findDomainKey(hostname, domains) || hostname;
    const domain = Domain.byKey(cfgKey, domains);
    domain.hostname = hostname;
    return domain;
  }

  static byKey(key, domains) {
    return new Domain(key, domains[key]);
  }

  static findDomainKey(hostname, domains) {
    const sorted = Object.keys(domains).sort((a, b) => {
      return b.length - a.length;
    });
    return sorted.find(key => new RegExp(`(^|.)${key}$`).test(hostname));
  }

  static getCurrentTab() {
    /* istanbul ignore next */
    return new Promise((resolve, reject) => {
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, tabs => {
        resolve(tabs[0]);
      });
    });
  }

  static sortedKeys(domains) {
    return Object.keys(domains).sort((a, b) => {
      const domainA = a.match(/\w*\.\w*$/)[0];
      const domainB = b.match(/\w*\.\w*$/)[0];
      return domainA < domainB ? -1 : domainA > domainB ? 1 : 0;
    });
  }

  constructor(key, domainCfg) {
    _defineProperty(this, "advanced", void 0);

    _defineProperty(this, "audioWordlistId", void 0);

    _defineProperty(this, "cfg", void 0);

    _defineProperty(this, "cfgKey", void 0);

    _defineProperty(this, "deep", void 0);

    _defineProperty(this, "disabled", void 0);

    _defineProperty(this, "enabled", void 0);

    _defineProperty(this, "hostname", void 0);

    _defineProperty(this, "tab", void 0);

    _defineProperty(this, "wordlistId", void 0);

    this.cfgKey = key;
    this.cfg = {};

    if (!domainCfg) {
      Object.assign(this.cfg, Domain._domainCfgDefaults);
    } else {
      this.cfg = domainCfg;
    }

    this.updateFromCfg();
  }

  getModeIndex() {
    if (this.advanced) {
      return _constants.default.DOMAIN_MODES.ADVANCED;
    } else if (this.deep) {
      return _constants.default.DOMAIN_MODES.DEEP;
    } else {
      return _constants.default.DOMAIN_MODES.NORMAL;
    }
  } // Updates the config from the domain and saves it


  async save(cfg) {
    if (cfg.domains) {
      this.updateCfg();

      if (JSON.stringify(this.cfg) === '{}') {
        // Nothing to save, so remove it
        delete cfg.domains[this.cfgKey];
      } else {
        cfg.domains[this.cfgKey] = this.cfg;
      }

      return await cfg.save('domains');
    }
  }

  updateCfg() {
    this.cfg.adv = this.advanced === true ? true : undefined;
    this.cfg.deep = this.deep === true ? true : undefined;
    this.cfg.disabled = this.disabled === true ? true : undefined;
    this.cfg.enabled = this.enabled === true ? true : undefined;
    this.cfg.wordlist = this.wordlistId >= 0 ? this.wordlistId : undefined;
    this.cfg.audioList = this.audioWordlistId >= 0 ? this.audioWordlistId : undefined;
  }

  updateFromCfg() {
    this.advanced = this.cfg.adv;
    this.deep = this.cfg.deep;
    this.disabled = this.cfg.disabled;
    this.enabled = this.cfg.enabled;
    this.wordlistId = this.cfg.wordlist;
    this.audioWordlistId = this.cfg.audioList;
  }

  updateFromModeIndex(index) {
    switch (index) {
      case _constants.default.DOMAIN_MODES.NORMAL:
        this.advanced = false;
        this.deep = false;
        break;

      case _constants.default.DOMAIN_MODES.ADVANCED:
        this.advanced = true;
        this.deep = false;
        break;

      case _constants.default.DOMAIN_MODES.DEEP:
        this.advanced = false;
        this.deep = true;
        break;
    }
  }

}

exports.default = Domain;

_defineProperty(Domain, "_domainCfgDefaults", {
  adv: undefined,
  audioList: undefined,
  deep: undefined,
  disabled: undefined,
  enabled: undefined,
  wordlist: undefined
});

/***/ }),

/***/ 513:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _constants = _interopRequireDefault(__webpack_require__(357));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Config {
  constructor(data = {}) {
    _defineProperty(this, "censorCharacter", void 0);

    _defineProperty(this, "censorFixedLength", void 0);

    _defineProperty(this, "defaultSubstitution", void 0);

    _defineProperty(this, "defaultWordMatchMethod", void 0);

    _defineProperty(this, "defaultWordRepeat", void 0);

    _defineProperty(this, "defaultWordSeparators", void 0);

    _defineProperty(this, "filterMethod", void 0);

    _defineProperty(this, "filterWordList", void 0);

    _defineProperty(this, "iWordWhitelist", void 0);

    _defineProperty(this, "preserveCase", void 0);

    _defineProperty(this, "preserveFirst", void 0);

    _defineProperty(this, "preserveLast", void 0);

    _defineProperty(this, "showCounter", void 0);

    _defineProperty(this, "showSummary", void 0);

    _defineProperty(this, "substitutionMark", void 0);

    _defineProperty(this, "wordlistId", void 0);

    _defineProperty(this, "wordlists", void 0);

    _defineProperty(this, "wordlistsEnabled", void 0);

    _defineProperty(this, "words", void 0);

    _defineProperty(this, "wordWhitelist", void 0);

    Object.assign(this, Config._defaults, data);
  }

  addWord(str, options = this.defaultWordOptions()) {
    str = str.trim();
    options = Object.assign({}, this.defaultWordOptions(), options);

    if (options.matchMethod !== _constants.default.MATCH_METHODS.REGEX) {
      str = str.toLowerCase();
    }

    if (Object.keys(this.words).includes(str)) {
      return false; // Already exists
    } else {
      options.sub = options.case ? options.sub.trim() : options.sub.trim().toLowerCase();
      this.words[str] = options;
      return true;
    }
  }

  defaultWordOptions() {
    return {
      lists: [],
      matchMethod: this.defaultWordMatchMethod,
      repeat: this.defaultWordRepeat,
      separators: this.defaultWordSeparators,
      sub: ''
    };
  }

  removeWord(str) {
    str = str.trim();
    const lower = str.toLowerCase();

    if (Object.keys(this.words).includes(lower)) {
      delete this.words[lower];
      return true;
    } else if (this.words[str]) {
      delete this.words[str];
      return true;
    } else {
      return false;
    }
  }

  repeatForWord(word) {
    if (this.words[word].repeat === _constants.default.TRUE || this.words[word].repeat === _constants.default.FALSE) {
      return this.words[word].repeat;
    } else {
      return this.defaultWordRepeat;
    }
  }

  sanitizeWords() {
    const sanitizedWords = {};
    Object.keys(this.words).sort().forEach(key => {
      sanitizedWords[key.trim().toLowerCase()] = this.words[key];
    });
    this.words = sanitizedWords;
  }

}

exports.default = Config;

_defineProperty(Config, "_allWordlists", ['All words']);

_defineProperty(Config, "_defaults", {
  censorCharacter: '*',
  censorFixedLength: 0,
  defaultSubstitution: 'censored',
  defaultWordMatchMethod: _constants.default.MATCH_METHODS.EXACT,
  defaultWordRepeat: _constants.default.FALSE,
  defaultWordSeparators: _constants.default.FALSE,
  filterMethod: _constants.default.FILTER_METHODS.SUBSTITUTE,
  filterWordList: true,
  iWordWhitelist: [],
  preserveCase: true,
  preserveFirst: true,
  preserveLast: false,
  showCounter: true,
  showSummary: true,
  substitutionMark: false,
  wordlistId: 0,
  wordlists: ['Wordlist 1', 'Wordlist 2', 'Wordlist 3', 'Wordlist 4', 'Wordlist 5', 'Wordlist 6'],
  wordlistsEnabled: true,
  wordWhitelist: []
});

_defineProperty(Config, "_defaultWords", {
  'সুদির ভাই': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.EXACT,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'ভাই'
  },
  'মাদার সান': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.EXACT,
    repeat: _constants.default.FALSE,
    separators: _constants.default.FALSE,
    sub: 'বোকা'
  },
  'asshole': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.PARTIAL,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'jerk'
  },
  'badass': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.PARTIAL,
    repeat: _constants.default.TRUE,
    separators: _constants.default.TRUE,
    sub: 'cool'
  },
  'bastard': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.PARTIAL,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'idiot'
  },
  'bitch': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.PARTIAL,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'bench'
  },
  'cocksucker': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.PARTIAL,
    repeat: _constants.default.TRUE,
    separators: _constants.default.TRUE,
    sub: 'suckup'
  },
  'cunt': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.PARTIAL,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'expletive'
  },
  'dammit': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.PARTIAL,
    repeat: _constants.default.FALSE,
    separators: _constants.default.TRUE,
    sub: 'dangit'
  },
  'damn': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.PARTIAL,
    repeat: _constants.default.FALSE,
    separators: _constants.default.FALSE,
    sub: 'dang'
  },
  'dumbass': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.PARTIAL,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'idiot'
  },
  'fag': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.EXACT,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'gay'
  },
  'faggot': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.PARTIAL,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'gay'
  },
  'fags': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.EXACT,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'gays'
  },
  'fuck': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.PARTIAL,
    repeat: _constants.default.TRUE,
    separators: _constants.default.TRUE,
    sub: 'freak'
  },
  'goddammit': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.PARTIAL,
    repeat: _constants.default.TRUE,
    separators: _constants.default.TRUE,
    sub: 'dangit'
  },
  'hell': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.EXACT,
    repeat: _constants.default.FALSE,
    separators: _constants.default.FALSE,
    sub: 'heck'
  },
  'jackass': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.PARTIAL,
    repeat: _constants.default.TRUE,
    separators: _constants.default.TRUE,
    sub: 'jerk'
  },
  'nigga': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.EXACT,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'bruh'
  },
  'nigger': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.EXACT,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'man'
  },
  'niggers': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.EXACT,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'people'
  },
  'piss': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.PARTIAL,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'pee'
  },
  'pissed': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.PARTIAL,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'ticked'
  },
  'pussies': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.EXACT,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'softies'
  },
  'pussy': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.EXACT,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'softie'
  },
  'shit': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.PARTIAL,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'crap'
  },
  'slut': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.PARTIAL,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'tramp'
  },
  'tits': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.PARTIAL,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'chest'
  },
  'twat': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.EXACT,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'dumbo'
  },
  'twats': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.EXACT,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'dumbos'
  },
  'whore': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.PARTIAL,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'tramp'
  }
});

/***/ }),

/***/ 357:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _helper = __webpack_require__(582);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Constants {
  // Named Constants
  // Helper Functions
  static filterMethodName(id) {
    return this.nameById(this.FILTER_METHODS, id);
  }

  static matchMethodName(id) {
    return this.nameById(this.MATCH_METHODS, id);
  }

  static nameById(obj, id) {
    return (0, _helper.upperCaseFirst)(Object.entries(obj).filter(arr => arr[1] === id)[0][0]);
  }

  static orderedArray(obj) {
    const result = [];
    Object.values(obj).sort().forEach(id => {
      result.push(Constants.nameById(obj, id));
    });
    return result;
  }

}

exports.default = Constants;

_defineProperty(Constants, "ALL_WORDS_WORDLIST_ID", 0);

_defineProperty(Constants, "DOMAIN_MODES", {
  NORMAL: 0,
  ADVANCED: 1,
  DEEP: 2
});

_defineProperty(Constants, "FALSE", 0);

_defineProperty(Constants, "FILTER_METHODS", {
  CENSOR: 0,
  SUBSTITUTE: 1,
  REMOVE: 2,
  OFF: 3
});

_defineProperty(Constants, "MATCH_METHODS", {
  EXACT: 0,
  PARTIAL: 1,
  WHOLE: 2,
  REGEX: 3
});

_defineProperty(Constants, "MUTE_METHODS", {
  TAB: 0,
  VIDEO: 1,
  NONE: 2
});

_defineProperty(Constants, "SHOW_SUBTITLES", {
  ALL: 0,
  FILTERED: 1,
  UNFILTERED: 2,
  NONE: 3
});

_defineProperty(Constants, "STATS_TYPE_AUDIO", 'audio');

_defineProperty(Constants, "STATS_TYPE_TEXT", 'text');

_defineProperty(Constants, "TRUE", 1);

/***/ }),

/***/ 582:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.booleanToNumber = booleanToNumber;
exports.dynamicList = dynamicList;
exports.exportToFile = exportToFile;
exports.formatNumber = formatNumber;
exports.getGlobalVariable = getGlobalVariable;
exports.getVersion = getVersion;
exports.hmsToSeconds = hmsToSeconds;
exports.injectScript = injectScript;
exports.isVersionOlder = isVersionOlder;
exports.makeRequest = makeRequest;
exports.numberToBoolean = numberToBoolean;
exports.numberWithCommas = numberWithCommas;
exports.readFile = readFile;
exports.removeChildren = removeChildren;
exports.removeFromArray = removeFromArray;
exports.secondsToHMS = secondsToHMS;
exports.upperCaseFirst = upperCaseFirst;

var _constants = _interopRequireDefault(__webpack_require__(357));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function booleanToNumber(value) {
  return value ? _constants.default.TRUE : _constants.default.FALSE;
}
/* istanbul ignore next */


function dynamicList(list, select, upperCaseFirstChar = false, title) {
  removeChildren(select);
  const array = title !== undefined ? [title].concat(list) : list;
  array.forEach(item => {
    const option = document.createElement('option');
    option.value = title && item === title ? '' : item;
    option.textContent = upperCaseFirstChar ? upperCaseFirst(item) : item;
    select.appendChild(option);
  });
}

function exportToFile(dataStr, fileName = 'data.txt') {
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', fileName);
  linkElement.click();
  linkElement.remove();
} // Format numbers up to 1B to be 4 characters or less


function formatNumber(number) {
  const length = number.toString().length;

  if (length <= 3) {
    // 0 - 999
    return number.toString();
  } else if (length <= 6) {
    // 1,000 - 999,999
    const n = (number / 1000).toPrecision();
    const index = n.indexOf('.');
    return (index >= -1 && index <= 1 ? n.substr(0, 3) : n.substr(0, index)) + 'k';
  } else if (length <= 9) {
    // 1,000,000 - 999,999,999
    const n = (number / 1000000).toPrecision();
    const index = n.indexOf('.');
    return (index >= -1 && index <= 1 ? n.substr(0, 3) : n.substr(0, index)) + 'M';
  } else {
    // >= 1,000,000,000
    return '1G+';
  }
}

function getGlobalVariable(code, id = 'APFData') {
  const script = document.createElement('script');
  script.id = id;
  script.textContent = `document.getElementById("${id}").textContent = JSON.stringify(${code})`;
  document.documentElement.appendChild(script);
  const result = document.querySelector(`script#${id}`).textContent;
  script.remove();
  return JSON.parse(result);
} // /^\d+\.\d+\.\d+$/


function getVersion(version) {
  const versionValues = version.split('.');
  return {
    major: parseInt(versionValues[0]),
    minor: parseInt(versionValues[1]),
    patch: parseInt(versionValues[2])
  };
} // NOTE: This function requires the hh:mm:ss.ff format


function hmsToSeconds(timeStr, precision = 3) {
  const [hh = '0', mm = '0', ss = '0'] = (timeStr || '0:0:0').split(':');
  const hour = parseInt(hh, 10) || 0;
  const minute = parseInt(mm, 10) || 0;
  const second = parseFloat(ss) || 0;
  return parseFloat((hour * 3600 + minute * 60 + second).toFixed(precision));
}

function injectScript(file, node, id = '') {
  const th = document.getElementsByTagName(node)[0];
  const s = document.createElement('script');
  s.setAttribute('type', 'text/javascript');

  if (id) {
    s.id = id;
  }

  s.setAttribute('src', file);
  th.appendChild(s);
} // Is the provided version lower than the minimum version?


function isVersionOlder(version, minimum) {
  if (version.major < minimum.major) {
    return true;
  } else if (version.major == minimum.major && version.minor < minimum.minor) {
    return true;
  } else if (version.major == minimum.major && version.minor == minimum.minor && version.patch < minimum.patch) {
    return true;
  }

  return false;
}

function makeRequest(method, url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);

    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(this.response);
      } else {
        reject({
          status: this.status,
          statusText: this.statusText
        });
      }
    };

    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: this.statusText
      });
    };

    xhr.send();
  });
}

function numberToBoolean(value) {
  return value > _constants.default.FALSE;
}

function numberWithCommas(number) {
  if (typeof Intl == 'object' && typeof Intl.NumberFormat == 'function') {
    if (typeof number === 'string') {
      number = parseInt(number).toString();
    }

    return number.toLocaleString();
  } else {
    number = number.toString(); // Get numbers before `.` (if present)

    const decimalIndex = number.indexOf('.');
    let output = decimalIndex === -1 ? number : number.slice(0, decimalIndex); // Insert commas every 3 digits from the right

    for (let i = output.length - 3; i > 0; i -= 3) {
      output = output.slice(0, i) + ',' + output.slice(i);
    } // Append fractional part


    if (decimalIndex !== -1) {
      output += number.slice(decimalIndex);
    }

    return output;
  }
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();

    fr.onload = () => {
      resolve(fr.result);
    };

    fr.readAsText(file);
  });
}

function removeChildren(element) {
  if (element.hasChildNodes) {
    while (element.firstChild) {
      element.firstChild.remove();
    }
  }
}

function removeFromArray(array, element) {
  return array.filter(e => e !== element);
}

function secondsToHMS(seconds) {
  return new Date(seconds * 1000).toISOString().substr(11, 12);
}

function upperCaseFirst(str, lowerCaseRest = true) {
  let value = str.charAt(0).toUpperCase();
  value += lowerCaseRest ? str.toLowerCase().slice(1) : str.slice(1);
  return value;
}

/***/ }),

/***/ 167:
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* eslint-disable no-console */
class Logger {
  constructor(level = Logger.defaultLevel, tag) {
    _defineProperty(this, "level", void 0);

    _defineProperty(this, "prefix", void 0);

    _defineProperty(this, "debug", (message, ...data) => {
      if (Logger.debugLevel >= this.level) {
        this.output(Logger.debugName, message, data);
      }
    });

    _defineProperty(this, "debugTime", (message, ...data) => {
      if (Logger.debugLevel >= this.level) {
        this.outputTime(Logger.debugName, message, data);
      }
    });

    _defineProperty(this, "error", (message, ...data) => {
      if (Logger.errorLevel >= this.level) {
        this.output(Logger.errorName, message, data);
      }
    });

    _defineProperty(this, "errorTime", (message, ...data) => {
      if (Logger.errorLevel >= this.level) {
        this.outputTime(Logger.errorName, message, data);
      }
    });

    _defineProperty(this, "info", (message, ...data) => {
      if (Logger.infoLevel >= this.level) {
        this.output(Logger.infoName, message, data);
      }
    });

    _defineProperty(this, "infoTime", (message, ...data) => {
      if (Logger.infoLevel >= this.level) {
        this.outputTime(Logger.infoName, message, data);
      }
    });

    _defineProperty(this, "warn", (message, ...data) => {
      if (Logger.warnLevel >= this.level) {
        this.output(Logger.warnName, message, data);
      }
    });

    _defineProperty(this, "warnTime", (message, ...data) => {
      if (Logger.warnLevel >= this.level) {
        this.outputTime(Logger.warnName, message, data);
      }
    });

    this.level = level;
    this.prefix = `[${Logger.app}] `;

    if (tag) {
      this.prefix = `${this.prefix}[${tag}] `;
    }
  }

  output(level, message, data = []) {
    if (data.length) {
      console[level](this.prefix + message, data);
    } else {
      console[level](this.prefix + message);
    }
  }

  outputTime(level, message, data = []) {
    const now = new Date().toLocaleString();

    if (data.length) {
      console[level](now, this.prefix + message, data);
    } else {
      console[level](now, this.prefix + message);
    }
  }

}

exports.default = Logger;

_defineProperty(Logger, "app", 'APF');

_defineProperty(Logger, "debugLevel", 0);

_defineProperty(Logger, "debugName", 'debug');

_defineProperty(Logger, "errorLevel", 3);

_defineProperty(Logger, "errorName", 'error');

_defineProperty(Logger, "infoLevel", 1);

_defineProperty(Logger, "infoName", 'info');

_defineProperty(Logger, "warnLevel", 2);

_defineProperty(Logger, "warnName", 'warn');

_defineProperty(Logger, "defaultLevel", Logger.warnLevel);

/***/ }),

/***/ 863:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _constants = _interopRequireDefault(__webpack_require__(357));

var _config = _interopRequireDefault(__webpack_require__(513));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class WebConfig extends _config.default {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  // https://developer.chrome.com/apps/storage chrome.storage.sync.QUOTA_BYTES_PER_ITEM
  static async build(keys = []) {
    if (typeof keys === 'string') {
      keys = [keys];
    }

    const asyncResult = await WebConfig.getConfig(keys);
    const instance = new WebConfig(asyncResult);
    return instance;
  } // Call build() to create a new instance


  constructor(asyncParam) {
    if (typeof asyncParam === 'undefined') {
      throw new Error('Cannot be called directly. call build()');
    }

    super(); // Get the Config defaults

    _defineProperty(this, "_splitContainerKeys", void 0);

    _defineProperty(this, "audioWordlistId", void 0);

    _defineProperty(this, "customAudioSites", void 0);

    _defineProperty(this, "darkMode", void 0);

    _defineProperty(this, "domains", void 0);

    _defineProperty(this, "enabledDomainsOnly", void 0);

    _defineProperty(this, "fillerAudio", void 0);

    _defineProperty(this, "muteAudio", void 0);

    _defineProperty(this, "muteAudioOnly", void 0);

    _defineProperty(this, "muteCueRequireShowing", void 0);

    _defineProperty(this, "muteMethod", void 0);

    _defineProperty(this, "password", void 0);

    _defineProperty(this, "showSubtitles", void 0);

    _defineProperty(this, "showUpdateNotification", void 0);

    _defineProperty(this, "collectStats", void 0);

    _defineProperty(this, "youTubeAutoSubsMax", void 0);

    _defineProperty(this, "youTubeAutoSubsMin", void 0);

    this._splitContainerKeys = {};
    Object.assign(this, WebConfig._classDefaults, asyncParam); // Separate due to _defineProperty()
  }

  static chromeStorageAvailable() {
    return !!(chrome && chrome.storage && chrome.storage.sync && chrome.storage.local);
  } // Combine all ._[prop]* into .[prop]


  static combineData(data, prop) {
    data[prop] = {};

    if (data[`_${prop}0`] !== undefined) {
      const dataKeys = WebConfig.getDataContainerKeys(data, prop); // Add all _[prop]* to .[prop] and remove _[prop]*

      dataKeys.forEach(key => {
        Object.assign(data[prop], data[key]);
        delete data[key];
      });
      return dataKeys;
    }
  } // Async call to get provided keys (or default keys) from chrome storage


  static getConfig(keys) {
    return new Promise((resolve, reject) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
      }

      let request = null; // Get all data from storage

      if (keys.length > 0 && !keys.some(key => WebConfig._splittingKeys.includes(key))) {
        request = {};
        keys.forEach(key => {
          request[key] = WebConfig._defaults[key];
        });
      }

      chrome.storage.sync.get(request, items => {
        // Add internal tracker for split keys
        items._splitContainerKeys = {}; // Ensure defaults for undefined settings

        Object.keys(WebConfig._defaults).forEach(defaultKey => {
          if ((request == null || keys.includes(defaultKey)) && items[defaultKey] === undefined) {
            items[defaultKey] = WebConfig._defaults[defaultKey];
          }
        }); // Add words if requested, and provide _defaultWords if needed

        if (keys.length === 0 || keys.includes('words')) {
          // Use default words if none were provided
          if (items._words0 === undefined || Object.keys(items._words0).length == 0) {
            items._words0 = _config.default._defaultWords;
          }
        }

        WebConfig._splittingKeys.forEach(splittingKey => {
          const splitKeys = WebConfig.combineData(items, splittingKey);

          if (splitKeys) {
            items._splitContainerKeys[splittingKey] = splitKeys;
          }
        }); // Remove keys we didn't request (Required when requests for specific keys include ones that supports splitting)


        if (request !== null && keys.length > 0) {
          Object.keys(items).forEach(item => {
            if (!keys.includes(item)) {
              delete items[item];
            }
          });
        }

        resolve(items);
      });
    });
  } // Find all _[prop]* to combine


  static getDataContainerKeys(data, prop) {
    const pattern = new RegExp(`^_${prop}\\d+`);
    const containerKeys = Object.keys(data).filter(key => pattern.test(key));
    return containerKeys;
  }

  static getLocalStoragePromise(keys) {
    if (typeof keys === 'string') {
      keys = [keys];
    }

    return new Promise((resolve, reject) => {
      chrome.storage.local.get(keys, data => {
        chrome.runtime.lastError ? reject(chrome.runtime.lastError.message) : resolve(data);
      });
    });
  }

  static removeLocalStoragePromise(keys) {
    if (keys === 'ALL') {
      return new Promise((resolve, reject) => {
        chrome.storage.local.clear(() => {
          chrome.runtime.lastError ? reject(chrome.runtime.lastError.message) : resolve(0);
        });
      });
    }

    if (typeof keys === 'string') {
      keys = [keys];
    }

    return new Promise((resolve, reject) => {
      chrome.storage.local.remove(keys, () => {
        chrome.runtime.lastError ? reject(chrome.runtime.lastError.message) : resolve(0);
      });
    });
  }

  static saveLocalStoragePromise(data) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set(data, () => {
        chrome.runtime.lastError ? reject(chrome.runtime.lastError.message) : resolve(0);
      });
    });
  } // Order and remove `_` prefixed values


  ordered() {
    return Object.keys(this).sort().reduce((obj, key) => {
      if (key[0] != '_') {
        obj[key] = this[key];
      }

      return obj;
    }, {});
  }

  remove(props) {
    if (typeof props === 'string') {
      props = [props];
    }

    chrome.storage.sync.remove(props);
    props.forEach(prop => {
      delete this[prop];
    });
  }

  reset() {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.clear(() => {
        chrome.runtime.lastError ? reject(chrome.runtime.lastError.message) : resolve(0);
      });
    });
  } // Pass a key or array of keys to save, or save everything


  save(props = []) {
    if (typeof props === 'string') {
      props = [props];
    }

    const data = {}; // Save everything

    if (props.length === 0) {
      props = Object.keys(WebConfig._defaults);
      props.push('words'); // words is not part of _defaults
    }

    props.forEach(prop => {
      if (WebConfig._splittingKeys.includes(prop)) {
        Object.assign(data, this.splitData(prop));
      } else {
        data[prop] = this[prop];
      }
    }); // If we have more containers in storage than are needed, remove them

    if (Object.keys(this._splitContainerKeys).length !== 0 && props.some(prop => WebConfig._splittingKeys.includes(prop))) {
      WebConfig._splittingKeys.forEach(splittingKey => {
        if (props.includes(splittingKey)) {
          const newContainerKeys = WebConfig.getDataContainerKeys(data, splittingKey);

          if (this._splitContainerKeys[splittingKey]) {
            const containersToRemove = this._splitContainerKeys[splittingKey].filter(oldKey => !newContainerKeys.includes(oldKey));

            if (containersToRemove.length !== 0) {
              this.remove(containersToRemove);
              this._splitContainerKeys[splittingKey] = newContainerKeys;
            }
          }
        }
      });
    }

    return new Promise((resolve, reject) => {
      chrome.storage.sync.set(data, () => {
        chrome.runtime.lastError ? reject(chrome.runtime.lastError.message) : resolve(0);
      });
    });
  }

  splitData(key) {
    const encoder = new TextEncoder();
    let currentContainerNum = 0;
    let currentBytes = 2; // For double-quotes around entire stringified JSON

    const data = {};
    let currentContainer = `_${key}${currentContainerNum}`;
    data[currentContainer] = {};
    currentBytes += encoder.encode(`{"${currentContainer}":{}}`).length;
    Object.keys(this[key]).sort().forEach(item => {
      let newBytes = encoder.encode(`",${item}":`).length; // This leads to an extra ',' for the last entry

      newBytes += encoder.encode(JSON.stringify(this[key][item])).length; // Next word would be too big, setup next container

      if (currentBytes + newBytes >= WebConfig._maxBytes) {
        currentContainerNum++;
        currentContainer = `_${key}${currentContainerNum}`;
        data[currentContainer] = {};
        currentBytes = encoder.encode(`"${currentContainer}":{}`).length;
      } // Adding a word


      currentBytes += newBytes;
      data[currentContainer][item] = this[key][item];
    });
    return data;
  }

}

exports.default = WebConfig;

_defineProperty(WebConfig, "_classDefaults", {
  audioWordlistId: 0,
  customAudioSites: null,
  darkMode: false,
  domains: {},
  enabledDomainsOnly: false,
  fillerAudio: '',
  muteAudio: false,
  muteAudioOnly: false,
  muteCueRequireShowing: false,
  muteMethod: _constants.default.MUTE_METHODS.TAB,
  password: null,
  showSubtitles: _constants.default.SHOW_SUBTITLES.ALL,
  collectStats: true,
  showUpdateNotification: true,
  youTubeAutoSubsMax: 0,
  youTubeAutoSubsMin: 0
});

_defineProperty(WebConfig, "QUOTA_BYTES_PER_ITEM", 8192);

_defineProperty(WebConfig, "_defaults", Object.assign({}, _config.default._defaults, WebConfig._classDefaults));

_defineProperty(WebConfig, "_splittingKeys", ['domains', 'words']);

_defineProperty(WebConfig, "_maxBytes", 8000);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {


var _dataMigration = _interopRequireDefault(__webpack_require__(569));

var _domain = _interopRequireDefault(__webpack_require__(50));

var _webConfig = _interopRequireDefault(__webpack_require__(863));

var _helper = __webpack_require__(582);

var _logger = _interopRequireDefault(__webpack_require__(167));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _logger.default();
const backgroundStorage = {
  tabs: {}
}; ////
// Functions
//

function contextMenusOnClick(info, tab) {
  switch (info.menuItemId) {
    case 'addSelection':
      processSelection('addWord', info.selectionText);
      break;

    case 'disableTabOnce':
      disableTabOnce(tab.id);
      break;

    case 'options':
      chrome.runtime.openOptionsPage();
      break;

    case 'removeSelection':
      processSelection('removeWord', info.selectionText);
      break;

    case 'toggleAdvancedForDomain':
      toggleDomain(new URL(tab.url).hostname, 'advanced');
      break;

    case 'toggleForDomain':
      toggleDomain(new URL(tab.url).hostname, 'disable');
      break;

    case 'toggleTabDisable':
      toggleTabDisable(tab.id);
      break;
  }
}

function disableTabOnce(id) {
  saveTabOptions(id, {
    disabledOnce: true
  });
  chrome.tabs.reload();
}

function getTabOptions(id) {
  return storedTab(id) ? backgroundStorage.tabs[id] : saveNewTabOptions(id);
}

function notificationsOnClick(notificationId) {
  switch (notificationId) {
    case 'extensionUpdate':
      chrome.notifications.clear('extensionUpdate');
      chrome.tabs.create({
        url: 'https://github.com/richardfrost/AdvancedProfanityFilter/releases'
      });
      break;
  }
} // Actions for extension install or upgrade


function onInstalled(details) {
  if (details.reason == 'install') {
    chrome.runtime.openOptionsPage();
  } else if (details.reason == 'update') {
    const thisVersion = chrome.runtime.getManifest().version;
    logger.info(`Updated from ${details.previousVersion} to ${thisVersion}`); // Open options page to show new features
    // chrome.runtime.openOptionsPage();
    // Run any data migrations on update

    runUpdateMigrations(details.previousVersion); // Display update notification

    chrome.storage.sync.get({
      showUpdateNotification: true
    }, data => {
      if (data.showUpdateNotification) {
        chrome.notifications.create('extensionUpdate', {
          'type': 'basic',
          'title': 'Advanced Profanity Filter',
          'message': 'Update installed, click for changelog.',
          'iconUrl': 'img/icon64.png',
          'isClickable': true
        });
      }
    });
  }
}

function onMessage(request, sender, sendResponse) {
  if (request.disabled === true) {
    chrome.browserAction.setIcon({
      path: 'img/icon19-disabled.png',
      tabId: sender.tab.id
    });
  } else if (request.backgroundData === true) {
    const response = {
      disabledTab: false
    };
    const tabOptions = getTabOptions(sender.tab.id);

    if (tabOptions.disabled || tabOptions.disabledOnce) {
      response.disabledTab = true;

      if (tabOptions.disabledOnce) {
        tabOptions.disabledOnce = false;
      }
    }

    sendResponse(response);
  } else {
    // Set badge color
    // chrome.browserAction.setBadgeBackgroundColor({ color: [138, 43, 226, 255], tabId: sender.tab.id }); // Blue Violet
    // chrome.browserAction.setBadgeBackgroundColor({ color: [85, 85, 85, 255], tabId: sender.tab.id }); // Grey (Default)
    // chrome.browserAction.setBadgeBackgroundColor({ color: [236, 147, 41, 255], tabId: sender.tab.id }); // Orange
    if (request.setBadgeColor) {
      if (request.mutePage) {
        chrome.browserAction.setBadgeBackgroundColor({
          color: [34, 139, 34, 255],
          tabId: sender.tab.id
        }); // Forest Green - Audio
      } else if (request.advanced) {
        chrome.browserAction.setBadgeBackgroundColor({
          color: [211, 45, 39, 255],
          tabId: sender.tab.id
        }); // Red - Advanced
      } else {
        chrome.browserAction.setBadgeBackgroundColor({
          color: [66, 133, 244, 255],
          tabId: sender.tab.id
        }); // Blue - Normal
      }
    } // Show count of words filtered on badge


    if (request.counter != undefined) {
      chrome.browserAction.setBadgeText({
        text: (0, _helper.formatNumber)(request.counter),
        tabId: sender.tab.id
      });
    } // Set mute state for tab


    if (request.mute != undefined) {
      chrome.tabs.update(sender.tab.id, {
        muted: request.mute
      });
    } // Unmute on page reload


    if (request.clearMute === true && sender.tab != undefined) {
      const {
        muted,
        reason,
        extensionId
      } = sender.tab.mutedInfo;

      if (muted && reason == 'extension' && extensionId == chrome.runtime.id) {
        chrome.tabs.update(sender.tab.id, {
          muted: false
        });
      }
    }
  }
} // Add selected word/phrase and reload page (unless already present)


async function processSelection(action, selection) {
  const cfg = await _webConfig.default.build('words');
  const result = cfg[action](selection);

  if (result) {
    try {
      await cfg.save();
      chrome.tabs.reload();
    } catch (e) {
      logger.errorTime(`Failed to process selection '${selection}'.`, e);
    }
  }
}

async function runUpdateMigrations(previousVersion) {
  if (_dataMigration.default.migrationNeeded(previousVersion)) {
    const cfg = await _webConfig.default.build();
    const migration = new _dataMigration.default(cfg);
    const migrated = migration.byVersion(previousVersion);
    if (migrated) cfg.save();
  }
}

function saveNewTabOptions(id, options = {}) {
  const _defaults = {
    disabled: false,
    disabledOnce: false
  };
  const tabOptions = Object.assign({}, _defaults, options);
  tabOptions.id = id;
  tabOptions.registeredAt = new Date().getTime();
  backgroundStorage.tabs[id] = tabOptions;
  return tabOptions;
}

function saveTabOptions(id, options = {}) {
  return storedTab(id) ? Object.assign(getTabOptions(id), options) : saveNewTabOptions(id, options);
}

function storedTab(id) {
  return backgroundStorage.tabs.hasOwnProperty(id);
}

function tabsOnActivated(tab) {
  const tabId = tab ? tab.tabId : chrome.tabs.TAB_ID_NONE;

  if (!storedTab(tabId)) {
    saveTabOptions(tabId);
  }
}

function tabsOnRemoved(tabId) {
  if (storedTab(tabId)) {
    delete backgroundStorage.tabs[tabId];
  }
}

async function toggleDomain(hostname, action) {
  const cfg = await _webConfig.default.build(['domains', 'enabledDomainsOnly']);

  const domain = _domain.default.byHostname(hostname, cfg.domains);

  switch (action) {
    case 'disable':
      cfg.enabledDomainsOnly ? domain.enabled = !domain.enabled : domain.disabled = !domain.disabled;
      break;

    case 'advanced':
      domain.advanced = !domain.advanced;
      break;
  }

  try {
    await domain.save(cfg);
    chrome.tabs.reload();
  } catch (e) {
    logger.error(`Failed to modify '${action}' for domain '${domain.cfgKey}'.`, e, domain);
  }
}

function toggleTabDisable(id) {
  const tabOptions = getTabOptions(id);
  tabOptions.disabled = !tabOptions.disabled;
  chrome.tabs.reload();
} ////
// Context menu
//


chrome.contextMenus.removeAll(() => {
  chrome.contextMenus.create({
    id: 'addSelection',
    title: 'Add selection to filter',
    contexts: ['selection'],
    documentUrlPatterns: ['file://*/*', 'http://*/*', 'https://*/*']
  });
  chrome.contextMenus.create({
    id: 'removeSelection',
    title: 'Remove selection from filter',
    contexts: ['selection'],
    documentUrlPatterns: ['file://*/*', 'http://*/*', 'https://*/*']
  });
  chrome.contextMenus.create({
    id: 'disableTabOnce',
    title: 'Disable once',
    contexts: ['all'],
    documentUrlPatterns: ['http://*/*', 'https://*/*']
  });
  chrome.contextMenus.create({
    id: 'toggleTabDisable',
    title: 'Toggle for tab',
    contexts: ['all'],
    documentUrlPatterns: ['http://*/*', 'https://*/*']
  });
  chrome.contextMenus.create({
    id: 'toggleForDomain',
    title: 'Toggle for domain',
    contexts: ['all'],
    documentUrlPatterns: ['http://*/*', 'https://*/*']
  });
  chrome.contextMenus.create({
    id: 'toggleAdvancedForDomain',
    title: 'Toggle advanced for domain',
    contexts: ['all'],
    documentUrlPatterns: ['http://*/*', 'https://*/*']
  });
  chrome.contextMenus.create({
    id: 'options',
    title: 'Options',
    contexts: ['all']
  });
}); ////
// Listeners
//

chrome.contextMenus.onClicked.addListener((info, tab) => {
  contextMenusOnClick(info, tab);
});
chrome.notifications.onClicked.addListener(notificationId => {
  notificationsOnClick(notificationId);
});
chrome.runtime.onInstalled.addListener(details => {
  onInstalled(details);
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  onMessage(request, sender, sendResponse);
});
chrome.tabs.onActivated.addListener(tab => {
  tabsOnActivated(tab);
});
chrome.tabs.onRemoved.addListener(tabId => {
  tabsOnRemoved(tabId);
});
})();

/******/ })()
;