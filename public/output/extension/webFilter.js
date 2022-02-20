/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 50:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


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

"use strict";


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

"use strict";


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

/***/ 394:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _constants = _interopRequireDefault(__webpack_require__(357));

var _word = _interopRequireDefault(__webpack_require__(812));

var _wordlist = _interopRequireDefault(__webpack_require__(709));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Filter {
  constructor() {
    _defineProperty(this, "cfg", void 0);

    _defineProperty(this, "counter", void 0);

    _defineProperty(this, "iWhitelist", void 0);

    _defineProperty(this, "whitelist", void 0);

    _defineProperty(this, "wordlistId", void 0);

    _defineProperty(this, "wordlists", void 0);

    this.counter = 0;
    this.iWhitelist = [];
    this.whitelist = [];
    this.wordlists = {};
  }

  buildWordlist(wordlistId, rebuild = false) {
    if (wordlistId === false) {
      wordlistId = this.wordlistId;
    } // Generate a new wordlist if required


    if (rebuild || !this.wordlists[wordlistId]) {
      this.wordlists[wordlistId] = new _wordlist.default(this.cfg, wordlistId);
    }

    return wordlistId;
  }

  checkWhitelist(match, string, matchStartIndex, word) {
    const whitelistLength = this.whitelist.length;
    const iWhitelistLength = this.iWhitelist.length;

    if (whitelistLength || iWhitelistLength) {
      // Check for exact/whole match (match case)
      if (whitelistLength && this.whitelist.includes(match)) {
        return true;
      } // Check for exact/whole match (case insensitive)


      if (iWhitelistLength && this.iWhitelist.includes(match.toLowerCase())) {
        return true;
      } // Check for partial match (match may not contain the full whitelisted word)


      if (word.matchMethod === _constants.default.MATCH_METHODS.PARTIAL) {
        const wordOptions = {
          matchMethod: _constants.default.MATCH_METHODS.WHOLE,
          repeat: _constants.default.FALSE,
          separators: _constants.default.FALSE,
          sub: ''
        };
        const wholeWordRegExp = new _word.default(match, wordOptions, this.cfg).regExp;
        let result;

        while ((result = wholeWordRegExp.exec(string)) !== null) {
          const resultMatch = result.length == 4 ? result[2] : result[0];
          const resultIndex = result.length == 4 ? result.index + result[1].length : result.index; // Make sure this is the match we want to check

          if (resultIndex <= matchStartIndex && resultIndex + resultMatch.length >= matchStartIndex + match.length) {
            if (whitelistLength && this.whitelist.includes(resultMatch)) {
              return true;
            }

            if (iWhitelistLength && this.iWhitelist.includes(resultMatch.toLowerCase())) {
              return true;
            }
          }
        }
      }
    }

    return false;
  }

  foundMatch(word, statsType) {
    this.counter++;
  }

  init(wordlistId = false) {
    this.iWhitelist = this.cfg.iWordWhitelist;
    this.whitelist = this.cfg.wordWhitelist;

    if (this.wordlistId === undefined) {
      this.wordlistId = this.cfg.wordlistId == null ? _constants.default.ALL_WORDS_WORDLIST_ID : this.cfg.wordlistId;
    }

    this.buildWordlist(wordlistId);
  }

  matchData(wordlist, index, match, args) {
    const word = wordlist.find(index);
    const string = args.pop();
    const matchStartIndex = args.pop();
    const captureGroups = args; // (boundary)(match)(boundary): Used internally for several types of matches:
    // - Remove Filter
    // - Unicode word boundaries (workaround)
    // - Edge punctuation

    const internalCaptureGroups = captureGroups.length > 0 && word.matchMethod !== _constants.default.MATCH_METHODS.REGEX;

    if (internalCaptureGroups) {
      match = captureGroups[1];
    }

    return {
      word: word,
      string: string,
      match: match,
      matchStartIndex: matchStartIndex,
      captureGroups: captureGroups,
      internalCaptureGroups: internalCaptureGroups
    };
  }

  rebuildWordlists() {
    Object.keys(this.wordlists).forEach(key => {
      this.buildWordlist(parseInt(key), true);
    });
  }

  replaceText(str, wordlistId = false, statsType = _constants.default.STATS_TYPE_TEXT) {
    wordlistId = this.buildWordlist(wordlistId);
    const wordlist = this.wordlists[wordlistId];

    switch (this.cfg.filterMethod) {
      case _constants.default.FILTER_METHODS.OFF:
      case _constants.default.FILTER_METHODS.CENSOR:
        wordlist.regExps.forEach((regExp, index) => {
          str = str.replace(regExp, (originalMatch, ...args) => {
            const {
              word,
              string,
              match,
              matchStartIndex,
              captureGroups,
              internalCaptureGroups
            } = this.matchData(wordlist, index, originalMatch, args);

            if (this.checkWhitelist(match, string, matchStartIndex, word)) {
              return match;
            } // Check for whitelisted match


            if (statsType) {
              this.foundMatch(word, statsType);
            } // Filter


            let censoredString = '';
            const censorLength = this.cfg.censorFixedLength > 0 ? this.cfg.censorFixedLength : match.length;

            if (this.cfg.preserveFirst && this.cfg.preserveLast) {
              censoredString = match[0] + this.cfg.censorCharacter.repeat(censorLength - 2) + match.slice(-1);
            } else if (this.cfg.preserveFirst) {
              censoredString = match[0] + this.cfg.censorCharacter.repeat(censorLength - 1);
            } else if (this.cfg.preserveLast) {
              censoredString = this.cfg.censorCharacter.repeat(censorLength - 1) + match.slice(-1);
            } else {
              censoredString = this.cfg.censorCharacter.repeat(censorLength);
            }

            if (internalCaptureGroups) {
              censoredString = captureGroups[0] + censoredString + captureGroups[2];
            }

            return censoredString;
          });
        });
        break;

      case _constants.default.FILTER_METHODS.SUBSTITUTE:
        wordlist.regExps.forEach((regExp, index) => {
          str = str.replace(regExp, (originalMatch, ...args) => {
            const {
              word,
              string,
              match,
              matchStartIndex,
              captureGroups,
              internalCaptureGroups
            } = this.matchData(wordlist, index, originalMatch, args);

            if (this.checkWhitelist(match, string, matchStartIndex, word)) {
              return match;
            } // Check for whitelisted match


            if (statsType) {
              this.foundMatch(word, statsType);
            } // Filter


            let sub = word.sub || this.cfg.defaultSubstitution; // Make substitution match case of original match

            if (!word.case && this.cfg.preserveCase) {
              if (_word.default.allUpperCase(match)) {
                sub = sub.toUpperCase();
              } else if (_word.default.eachWordCapitalized(match)) {
                sub = _word.default.capitalizeEachWord(sub);
              } else if (_word.default.firstCapitalized(match)) {
                sub = _word.default.capitalizeFirst(sub);
              }
            }

            if (this.cfg.substitutionMark) {
              sub = '[' + sub + ']';
            }

            if (internalCaptureGroups) {
              sub = captureGroups[0] + sub + captureGroups[2];
            }

            return sub;
          });
        });
        break;

      case _constants.default.FILTER_METHODS.REMOVE:
        wordlist.regExps.forEach((regExp, index) => {
          str = str.replace(regExp, (originalMatch, ...args) => {
            const {
              word,
              string,
              match,
              matchStartIndex,
              captureGroups,
              internalCaptureGroups
            } = this.matchData(wordlist, index, originalMatch, args);

            if (this.checkWhitelist(match.trim(), string, matchStartIndex, word)) {
              return match;
            } // Check for whitelisted match


            if (statsType) {
              this.foundMatch(word, statsType);
            } // Filter


            if (internalCaptureGroups) {
              if (_word.default.whitespaceRegExp.test(captureGroups[0]) && _word.default.whitespaceRegExp.test(captureGroups[2])) {
                // If both surrounds are whitespace (only need 1)
                return captureGroups[0];
              } else if (_word.default.nonWordRegExp.test(captureGroups[0]) || _word.default.nonWordRegExp.test(captureGroups[2])) {
                // If there is more than just whitesapce (ex. ',')
                return (captureGroups[0] + captureGroups[2]).trim();
              } else {
                return '';
              }
            } else {
              // Don't remove both leading and trailing whitespace
              if (_word.default.whitespaceRegExp.test(match[0]) && _word.default.whitespaceRegExp.test(match[match.length - 1])) {
                return match[0];
              } else {
                return '';
              }
            }
          });
        });
        break;
    }

    return str;
  }

  replaceTextResult(str, wordlistId = false, statsType = _constants.default.STATS_TYPE_TEXT) {
    const result = {
      original: str,
      filtered: this.replaceText(str, wordlistId, statsType),
      modified: false
    };
    result.modified = result.filtered != str;
    return result;
  }

}

exports.default = Filter;

/***/ }),

/***/ 582:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


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

"use strict";


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

/***/ 812:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _constants = _interopRequireDefault(__webpack_require__(357));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Word {
  static allLowerCase(string) {
    return string.toLowerCase() === string;
  }

  static allUpperCase(string) {
    return string.toUpperCase() === string;
  } // Note: Requires the input string to be all lower case


  static capitalizeEachWord(string) {
    const split = string.split(/[-_ ]+/i);
    split.forEach(word => {
      string = string.replace(word, this.capitalizeFirst(word));
    });
    return string;
  }

  static capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.substr(1);
  }

  static containsDoubleByte(str) {
    if (!str.length) return false;
    if (str.charCodeAt(0) > 127) return true;
    return Word._unicodeRegExp.test(str);
  }

  static eachWordCapitalized(string) {
    const split = string.split(/[-_ ]+/i);
    return split.every(word => this.firstCapitalized(word));
  } // /[-\/\\^$*+?.()|[\]{}]/g
  // /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g
  // Removing '-' for '/пресс-релиз/, giu'


  static escapeRegExp(str) {
    return str.replace(Word._escapeRegExp, '\\$&');
  }

  static firstCapitalized(string) {
    return string.charAt(0).toUpperCase() === string.charAt(0);
  }

  constructor(word, options, cfg) {
    _defineProperty(this, "_filterMethod", void 0);

    _defineProperty(this, "case", void 0);

    _defineProperty(this, "escaped", void 0);

    _defineProperty(this, "lists", void 0);

    _defineProperty(this, "matchMethod", void 0);

    _defineProperty(this, "matchRepeated", void 0);

    _defineProperty(this, "matchSeparators", void 0);

    _defineProperty(this, "regExp", void 0);

    _defineProperty(this, "sub", void 0);

    _defineProperty(this, "unicode", void 0);

    _defineProperty(this, "value", void 0);

    this.value = word;
    this.case = options.case > _constants.default.FALSE ? _constants.default.TRUE : _constants.default.FALSE;
    this.lists = options.lists === undefined ? [] : options.lists;
    this.matchMethod = options.matchMethod === undefined ? cfg.defaultWordMatchMethod : options.matchMethod;
    this.matchRepeated = options.repeat === undefined ? cfg.defaultWordRepeat : options.repeat;
    this.matchSeparators = options.separators === undefined ? cfg.defaultWordSeparators : options.separators;
    this.sub = options.sub === undefined ? cfg.defaultSubstitution : options.sub;
    this._filterMethod = options._filterMethod === undefined ? cfg.filterMethod : options._filterMethod;
    this.unicode = Word.containsDoubleByte(word);
    this.escaped = this.matchMethod === _constants.default.MATCH_METHODS.REGEX ? this.value : Word.escapeRegExp(this.value); // Don't escape a RegExp

    this.regExp = this.buildRegExp();
  }

  buildRegExp() {
    try {
      switch (this.matchMethod) {
        case _constants.default.MATCH_METHODS.PARTIAL:
          if (this._filterMethod === _constants.default.FILTER_METHODS.REMOVE) {
            // Match entire word that contains sub-string and surrounding whitespace
            // /\s?\b[\w-]*word[\w-]*\b\s?/gi
            if (this.unicode) {
              // Work around for lack of word boundary support for unicode characters
              // /(^|[\s.,'"+!?|-]?)[\w-]*(word)[\w-]*([\s.,'"+!?|-]?|$)/giu
              return new RegExp('(^|' + Word._unicodeWordBoundary + '?)([\\w-]*' + this.processedPhrase() + '[\\w-]*)(' + Word._unicodeWordBoundary + '?|$)', this.regexOptions());
            } else if (this.hasEdgePunctuation()) {
              // Begin or end with punctuation (not \w))
              return new RegExp('(^|\\s)([\\w-]*' + this.processedPhrase() + '[\\w-]*)(\\s|$)', this.regexOptions());
            } else {
              return new RegExp('\\s?\\b[\\w-]*' + this.processedPhrase() + '[\\w-]*\\b\\s?', this.regexOptions());
            }
          } else {
            // /word/gi
            return new RegExp(this.processedPhrase(), this.regexOptions());
          }

        case _constants.default.MATCH_METHODS.WHOLE:
          // /\b[\w-]*word[\w-]*\b/gi
          if (this.unicode) {
            // Work around for lack of word boundary support for unicode characters
            // (^|[\s.,'"+!?|-]*)([\S]*куче[\S]*)([\s.,'"+!?|-]*|$)/giu
            return new RegExp('(^|' + Word._unicodeWordBoundary + '*)([\\S]*' + this.processedPhrase() + '[\\S]*)(' + Word._unicodeWordBoundary + '*|$)', this.regexOptions());
          } else if (this.hasEdgePunctuation()) {
            // Begin or end with punctuation (not \w))
            return new RegExp('(^|\\s)([\\S]*' + this.processedPhrase() + '[\\S]*)(\\s|$)', this.regexOptions());
          } else {
            return new RegExp('\\b[\\w-]*' + this.processedPhrase() + '[\\w-]*\\b', this.regexOptions());
          }

        case _constants.default.MATCH_METHODS.REGEX:
          return new RegExp(this.value, this.regexOptions());

        case _constants.default.MATCH_METHODS.EXACT:
        default:
          // Match entire word that contains sub-string and surrounding whitespace
          // /\s?\bword\b\s?/gi
          if (this._filterMethod === _constants.default.FILTER_METHODS.REMOVE) {
            if (this.unicode) {
              // Work around for lack of word boundary support for unicode characters
              // /(^|[\s.,'"+!?|-])(word)([\s.,'"+!?|-]+|$)/giu
              return new RegExp('(^|' + Word._unicodeWordBoundary + ')(' + this.processedPhrase() + ')(' + Word._unicodeWordBoundary + '|$)', this.regexOptions());
            } else if (this.hasEdgePunctuation()) {
              // Begin or end with punctuation (not \w))
              return new RegExp('(^|\\s)(' + this.processedPhrase() + ')(\\s|$)', this.regexOptions());
            } else {
              return new RegExp('\\s?\\b' + this.processedPhrase() + '\\b\\s?', this.regexOptions());
            }
          } else {
            if (this.unicode) {
              // Work around for lack of word boundary support for unicode characters
              // /(^|[\s.,'"+!?|-]+)(word)([\s.,'"+!?|-]+|$)/giu
              return new RegExp('(^|' + Word._unicodeWordBoundary + '+)(' + this.processedPhrase() + ')(' + Word._unicodeWordBoundary + '+|$)', this.regexOptions());
            } else if (this.hasEdgePunctuation()) {
              // Begin or end with punctuation (not \w))
              return new RegExp('(^|\\s)(' + this.processedPhrase() + ')(\\s|$)', this.regexOptions());
            } else {
              // /\bword\b/gi
              return new RegExp('\\b' + this.processedPhrase() + '\\b', this.regexOptions());
            }
          }

      }
    } catch (e) {
      throw new Error('Failed to create RegExp for "' + this.value + '" - ' + e.name + ' ' + e.message);
    }
  }

  hasEdgePunctuation() {
    return Word._edgePunctuationRegExp.test(this.value);
  }

  processedPhrase() {
    const isEscaped = this.escaped.includes('\\');
    let val = '';
    const lastCharIndex = this.escaped.length - 1;

    for (let i = 0; i < this.escaped.length; i++) {
      // If the current character is a '\', add it and then move to next character
      if (isEscaped && this.escaped[i] === '\\') {
        val += this.escaped[i];
        i++;
      } // Add the current character


      val += this.escaped[i]; // Repeating characters
      // Word: /w+o+r+d+/g

      if (this.matchRepeated) {
        val += '+';
      } // Character separators
      // Word: /w[-_]*o[-_]*r[-_]*d*/g


      if (this.matchSeparators) {
        if (i != lastCharIndex) {
          val += Word.separatorsRegExp;
        }
      }
    }

    return val;
  }

  regexOptions() {
    let options = 'gi';

    if (this.unicode) {
      options += 'u';
    }

    return options;
  }

}

exports.default = Word;

_defineProperty(Word, "_edgePunctuationRegExp", /(^[,.'"!?%$]|[,.'"!?%$]$)/);

_defineProperty(Word, "_escapeRegExp", /[\/\\^$*+?.()|[\]{}]/g);

_defineProperty(Word, "_unicodeRegExp", /[^\u0000-\u00ff]/);

_defineProperty(Word, "_unicodeWordBoundary", '[\\s.,\'"+!?|-]');

_defineProperty(Word, "nonWordRegExp", new RegExp('^\\s*[^\\w]+\\s*$', 'g'));

_defineProperty(Word, "separatorsRegExp", '[-_ ]*');

_defineProperty(Word, "whitespaceRegExp", /^\s+$/);

/***/ }),

/***/ 709:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _constants = _interopRequireDefault(__webpack_require__(357));

var _word = _interopRequireDefault(__webpack_require__(812));

var _logger = _interopRequireDefault(__webpack_require__(167));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const logger = new _logger.default();

class Wordlist {
  constructor(cfg, wordlistId) {
    _defineProperty(this, "all", void 0);

    _defineProperty(this, "list", void 0);

    _defineProperty(this, "regExps", void 0);

    this.all = [];
    this.list = [];
    this.regExps = []; // Sort the words array by longest (most-specific) first

    const sorted = Object.keys(cfg.words).sort((a, b) => {
      return b.length - a.length;
    }); // Process list of words

    sorted.forEach(wordStr => {
      if (wordlistId === _constants.default.ALL_WORDS_WORDLIST_ID || !Array.isArray(cfg.words[wordStr].lists) || cfg.words[wordStr].lists.includes(wordlistId)) {
        try {
          const word = new _word.default(wordStr, cfg.words[wordStr], cfg);
          this.list.push(wordStr);
          this.all.push(word);
          this.regExps.push(word.regExp);
        } catch (e) {
          logger.warn(`Failed to add word to wordlist: '${wordStr}'.`);
        }
      }
    });
  }

  find(value) {
    if (typeof value === 'string') {
      return this.all[this.list.indexOf(value)];
    } else if (typeof value === 'number') {
      return this.all[value];
    }
  }

}

exports.default = Wordlist;

/***/ }),

/***/ 470:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Page {
  constructor() {
    _defineProperty(this, "xpathDocText", void 0);

    _defineProperty(this, "xpathNodeText", void 0);
  }

  // Returns true if a node should *not* be altered in any way
  static isForbiddenNode(node) {
    if (node.isContentEditable) {
      return true;
    } // Check if parentNode is a forbidden tag


    if (node.parentNode && (node.parentNode.isContentEditable || Page.forbiddenTags.includes(node.parentNode.nodeName))) {
      return true;
    } // Check if node is a forbidden tag


    return Page.forbiddenTags.includes(node.nodeName);
  }

}

exports.default = Page;

_defineProperty(Page, "disabledProtocols", new RegExp('(^chrome:|^about:|^[a-zA-Z]+-extension:)', 'i'));

_defineProperty(Page, "forbiddenNodeRegExp", new RegExp('^\s*(<[a-z].+?\/?>|{.+?:.+?;.*}|https?:\/\/[^\s]+$)'));

_defineProperty(Page, "forbiddenTags", ['SCRIPT', 'STYLE', 'INPUT', 'TEXTAREA', 'IFRAME', 'LINK']);

/***/ }),

/***/ 210:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _constants = _interopRequireDefault(__webpack_require__(357));

var _webAudioSites = _interopRequireDefault(__webpack_require__(502));

var _helper = __webpack_require__(582);

var _logger = _interopRequireDefault(__webpack_require__(167));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const logger = new _logger.default();

class WebAudio {
  constructor(filter) {
    _defineProperty(this, "cueRuleIds", void 0);

    _defineProperty(this, "enabledRuleIds", void 0);

    _defineProperty(this, "fetching", void 0);

    _defineProperty(this, "fillerAudio", void 0);

    _defineProperty(this, "fillerAudioPauseHandler", void 0);

    _defineProperty(this, "fillerAudioPlayHandler", void 0);

    _defineProperty(this, "filter", void 0);

    _defineProperty(this, "lastFilteredNode", void 0);

    _defineProperty(this, "lastFilteredText", void 0);

    _defineProperty(this, "lastProcessedText", void 0);

    _defineProperty(this, "muted", void 0);

    _defineProperty(this, "rules", void 0);

    _defineProperty(this, "sites", void 0);

    _defineProperty(this, "siteKey", void 0);

    _defineProperty(this, "supportedPage", void 0);

    _defineProperty(this, "unmuteTimeout", void 0);

    _defineProperty(this, "volume", void 0);

    _defineProperty(this, "watcherRuleIds", void 0);

    _defineProperty(this, "wordlistId", void 0);

    _defineProperty(this, "youTube", void 0);

    _defineProperty(this, "youTubeAutoSubsMax", void 0);

    _defineProperty(this, "youTubeAutoSubsMin", void 0);

    _defineProperty(this, "youTubeAutoSubsRule", void 0);

    _defineProperty(this, "youTubeAutoSubsTimeout", void 0);

    _defineProperty(this, "youTubeAutoSubsUnmuteDelay", void 0);

    this.filter = filter;
    this.cueRuleIds = [];
    this.enabledRuleIds = [];
    this.watcherRuleIds = [];

    if (this.filter.extension) {
      this.fillerAudio = this.initFillerAudio(this.filter.cfg.fillerAudio);
    }

    this.lastFilteredNode = null;
    this.lastFilteredText = '';
    this.lastProcessedText = '';
    this.muted = false;

    if (!filter.cfg.customAudioSites || typeof filter.cfg.customAudioSites !== 'object') {
      filter.cfg.customAudioSites = {};
    }

    this.sites = _webAudioSites.default.combineSites(filter.cfg.customAudioSites);
    this.volume = 1;
    this.wordlistId = filter.audioWordlistId;
    this.youTubeAutoSubsMax = filter.cfg.youTubeAutoSubsMax * 1000;
    this.youTubeAutoSubsMin = filter.cfg.youTubeAutoSubsMin;
    this.youTubeAutoSubsUnmuteDelay = 0; // Setup rules for current site

    this.siteKey = this.getSiteKey();
    this.rules = this.sites[this.siteKey];

    if (this.rules) {
      if (!Array.isArray(this.rules)) {
        this.rules = [this.rules];
      }

      this.rules.forEach(rule => {
        this.initRule(rule);
      });

      if (this.enabledRuleIds.length > 0) {
        this.supportedPage = true;
        this.initYouTube();
      }
    }
  }

  apfCaptionLine(rule, text) {
    const line = document.createElement('span');
    line.classList.add('APF-subtitle-line');
    line.style.background = 'black';
    line.style.color = 'white';
    line.style.fontSize = '3.5vw';
    line.style.paddingLeft = '4px';
    line.style.paddingRight = '4px';
    line.style.height = '18px';
    line.textContent = text;
    return line;
  }

  apfCaptionLines(rule, lines) {
    const apfLines = document.createElement('div');
    apfLines.classList.add('APF-subtitles');
    apfLines.style.bottom = '10px';
    apfLines.style.position = 'absolute';
    apfLines.style.textAlign = 'center';
    apfLines.style.width = '100%';
    lines.forEach(line => {
      apfLines.appendChild(line);
      apfLines.appendChild(document.createElement('br'));
    });
    return apfLines;
  }

  clean(subtitleContainer, ruleIndex = 0) {
    const rule = this.rules[ruleIndex];

    if (rule.mode === 'watcher') {
      return;
    } // If this is for a watcher rule, leave the text alone


    let filtered = false;

    if (subtitleContainer.nodeName && subtitleContainer.nodeName === '#text' && subtitleContainer.parentElement) {
      subtitleContainer = subtitleContainer.parentElement;
    }

    const subtitles = rule.subtitleSelector && subtitleContainer.querySelectorAll ? subtitleContainer.querySelectorAll(rule.subtitleSelector) : [subtitleContainer];

    if (subtitles.length === 0) {
      return;
    } // Process subtitles


    subtitles.forEach(subtitle => {
      // innerText handles line feeds/spacing better, but is not available to #text nodes
      const textMethod = subtitle.nodeName === '#text' ? 'textContent' : 'innerText';

      if (rule.convertBreaks === true && subtitle.nodeName !== '#text' && !WebAudio.brTagRegExp.test(subtitle[textMethod]) && WebAudio.brTagRegExp.test(subtitle.innerHTML)) {
        if (subtitle.style.whiteSpace !== 'pre') {
          subtitle.style.whiteSpace = 'pre';
        }

        subtitle.textContent = subtitle.innerHTML.replace(WebAudio.brTagRegExp, '\n');
      }

      const result = this.replaceTextResult(subtitle[textMethod]);

      if (result.modified) {
        filtered = true;
        this.mute(rule); // Mute the audio if we haven't already

        if (rule.filterSubtitles) {
          if (rule.preserveWhiteSpace && subtitle.style.whiteSpace !== 'pre') {
            subtitle.style.whiteSpace = 'pre';
          }

          if (rule.ignoreMutations) {
            this.filter.stopObserving();
          }

          subtitle[textMethod] = result.filtered;

          if (rule.ignoreMutations) {
            this.filter.startObserving();
          }
        }

        this.lastFilteredNode = subtitle;
        this.lastFilteredText = subtitle[textMethod];
      }
    }); // When captions/subtitles are spread across multiple mutations, check to see if a filtered node is still present

    if (!filtered) {
      if (this.lastFilteredNode && this.lastFilteredNode.parentElement && this.lastFilteredNode.textContent === this.lastFilteredText) {
        filtered = true;
      }
    }

    const shouldBeShown = this.subtitlesShouldBeShown(rule, filtered);
    shouldBeShown ? this.showSubtitles(rule, subtitles) : this.hideSubtitles(rule, subtitles);
  }

  cleanYouTubeAutoSubs(node) {
    // Found a new word, clear the max timeout
    if (this.youTubeAutoSubsTimeout != null) {
      clearTimeout(this.youTubeAutoSubsTimeout);
      this.youTubeAutoSubsTimeout = null;
    }

    const result = this.replaceTextResult(node.textContent);

    if (result.modified) {
      if (this.youTubeAutoSubsRule.filterSubtitles) {
        node.textContent = result.filtered;
      }

      this.mute(this.youTubeAutoSubsRule);
      this.youTubeAutoSubsUnmuteDelay = null;
      this.filter.updateCounterBadge(); // Set a timer to unmute if a max time was specified

      if (this.youTubeAutoSubsMax) {
        this.youTubeAutoSubsTimeout = window.setTimeout(this.youTubeAutoSubsMuteTimeout, this.youTubeAutoSubsMax, this);
      }
    } else {
      if (this.muted) {
        if (this.youTubeAutoSubsMin > 0) {
          const currentTime = document.getElementsByTagName(WebAudio.defaultVideoSelector)[0].currentTime;

          if (this.youTubeAutoSubsUnmuteDelay == null) {
            // Start tracking youTubeAutoSubsUnmuteDelay when next unfiltered word is found
            this.youTubeAutoSubsUnmuteDelay = currentTime;
          } else {
            if (currentTime < this.youTubeAutoSubsUnmuteDelay) {
              this.youTubeAutoSubsUnmuteDelay = 0;
            } // Reset youTubeAutoSubsUnmuteDelay if video reversed


            if (currentTime > this.youTubeAutoSubsUnmuteDelay + this.youTubeAutoSubsMin) {
              // Unmute if its been long enough
              this.unmute(this.youTubeAutoSubsRule);
            }
          }
        } else {
          // Unmute immediately if youTubeAutoSubsMin = 0
          this.unmute(this.youTubeAutoSubsRule);
        }
      }
    } // Hide YouTube auto text unless show all subtitles is set


    if (this.filter.cfg.showSubtitles !== _constants.default.SHOW_SUBTITLES.ALL) {
      const container = document.querySelector('div.ytp-caption-window-rollup span.captions-text');

      if (container.style.display == 'block') {
        container.style.display = 'none';
      }
    }
  }

  clearUnmuteTimeout(rule) {
    if (rule.unmuteDelay && this.unmuteTimeout != null) {
      clearTimeout(this.unmuteTimeout);
      this.unmuteTimeout = null;
    }
  }

  delayedUnmute(instance, rule) {
    const delayed = true;
    instance.unmute(rule, null, delayed);
    this.unmuteTimeout = null;
  }

  fillerAudioHandlePause() {
    this.fillerAudio.pause();
  }

  fillerAudioHandlePlay() {
    if (this.muted) {
      this.fillerAudio.play();
    }
  }

  getSiteKey() {
    if (this.sites.hasOwnProperty(this.filter.hostname)) {
      return this.filter.hostname;
    } else if (this.filter.iframe && this.filter.iframe.hostname && this.sites.hasOwnProperty(this.filter.iframe.hostname)) {
      return this.filter.iframe.hostname;
    }

    return '';
  } // Priority (requires cues): [overrideKey], label, language, kind (prefer caption/subtitle), order


  getVideoTextTrack(textTracks, rule, overrideKey) {
    let bestIndex = 0;
    let bestScore = 0;
    let foundCues = false; // Return the first match with cues if no other matches are found

    let perfectScore = 0;

    if (overrideKey && rule[overrideKey]) {
      perfectScore += 1000;
    }

    if (rule.videoCueLabel) {
      perfectScore += 100;
    }

    if (rule.videoCueLanguage) {
      perfectScore += 10;
    }

    if (rule.videoCueKind) {
      perfectScore += 1;
    } // Add one, because we will default to 'captions'/'subtitles'


    for (let i = 0; i < textTracks.length; i++) {
      const textTrack = textTracks[i];

      if (textTrack.cues.length === 0) {
        continue;
      }

      if (rule.videoCueRequireShowing && textTrack.mode !== 'showing') {
        continue;
      }

      let currentScore = 0;

      if (overrideKey && rule[overrideKey] && this.textTrackKeyTest(textTrack, WebAudio.textTrackRuleMappings[overrideKey], rule[overrideKey])) {
        currentScore += 1000;
      }

      if (rule.videoCueLabel && this.textTrackKeyTest(textTrack, WebAudio.textTrackRuleMappings.videoCueLabel, rule.videoCueLabel)) {
        currentScore += 100;
      }

      if (rule.videoCueLanguage && this.textTrackKeyTest(textTrack, WebAudio.textTrackRuleMappings.videoCueLanguage, rule.videoCueLanguage)) {
        currentScore += 10;
      }

      if (rule.videoCueKind) {
        if (this.textTrackKeyTest(textTrack, WebAudio.textTrackRuleMappings.videoCueKind, rule.videoCueKind)) {
          currentScore += 1;
        }
      } else {
        if (this.textTrackKeyTest(textTrack, WebAudio.textTrackRuleMappings.videoCueKind, 'captions') || this.textTrackKeyTest(textTrack, WebAudio.textTrackRuleMappings.videoCueKind, 'subtitles')) {
          currentScore += 1;
        }
      }

      if (currentScore === perfectScore) {
        return textTrack;
      }

      if (currentScore > bestScore || !foundCues) {
        bestScore = currentScore;
        bestIndex = i;
        foundCues = true;
      }
    }

    if (foundCues) {
      return textTracks[bestIndex];
    }
  } // Some sites ignore textTrack.mode = 'hidden' and will still show captions
  // This is a fallback (not preferred) method that can be used for hiding the cues


  hideCue(rule, cue) {
    cue.text = '';
    cue.position = 100;
    cue.size = 0;
  }

  hideSubtitles(rule, subtitles) {
    if (rule.displayVisibility && rule._displayElement) {
      // TODO: Only tested with Watcher: HBO Max. This may be a much better solution
      rule._displayElement.style.visibility = 'hidden';
    } else if (rule.displaySelector) {
      const root = rule.rootNode && subtitles && subtitles[0] ? subtitles[0].getRootNode() : document;

      if (root) {
        const container = root.querySelector(rule.displaySelector);

        if (container) {
          // Save the original display style if none was included in the rule
          if (rule.displayShow === '' && container.style.display !== '' && container.style.display !== rule.displayHide) {
            rule.displayShow = container.style.display;
          }

          container.style.setProperty('display', rule.displayHide); // , 'important');
        }
      }
    } else if (subtitles) {
      subtitles.forEach(subtitle => {
        subtitle.innerText = '';

        if (rule.removeSubtitleSpacing && subtitle.style) {
          if (subtitle.style.padding) {
            subtitle.style.padding = 0;
          }

          if (subtitle.style.margin) {
            subtitle.style.margin = 0;
          }
        }
      });
    }
  }

  initCueRule(rule) {
    if (rule.apfCaptions === true) {
      rule.videoCueHideCues = true;
    }

    if (rule.videoSelector === undefined) {
      rule.videoSelector = WebAudio.defaultVideoSelector;
    }

    if (rule.videoCueRequireShowing === undefined) {
      rule.videoCueRequireShowing = this.filter.cfg.muteCueRequireShowing;
    }

    if (rule.externalSub) {
      if (rule.externalSubTrackMode === undefined) {
        rule.externalSubTrackMode = 'showing';
      }

      if (rule.externalSubURLKey === undefined) {
        rule.externalSubURLKey = 'url';
      }

      if (rule.externalSubFormatKey === undefined) {
        rule.externalSubFormatKey = 'format';
      }

      if (rule.externalSubTrackLabel === undefined) {
        rule.externalSubTrackLabel = 'APF';
      }
    }
  }

  initDisplaySelector(rule) {
    if (rule.displaySelector !== undefined) {
      if (rule.displayHide === undefined) {
        rule.displayHide = 'none';
      }

      if (rule.displayShow === undefined) {
        rule.displayShow = '';
      }
    }
  }

  initDynamicRule(rule) {
    rule._dynamic = true;

    if (rule.dynamicTargetMode == undefined) {
      rule.disabled == true;
    }
  }

  initElementChildRule(rule) {
    if (!rule.parentSelector && !rule.parentSelectorAll) {
      rule.disabled = true;
    }
  }

  initElementRule(rule) {}

  initFillerAudio(name = '') {
    const fillerConfig = WebAudio.fillerConfig[name];

    if (fillerConfig) {
      const url = chrome.runtime.getURL(fillerConfig.fileName);
      const audioFiller = new Audio();
      audioFiller.src = url;
      audioFiller.loop = true;

      if (fillerConfig.volume) {
        audioFiller.volume = fillerConfig.volume;
      }

      if (fillerConfig.loopAfter) {
        audioFiller.ontimeupdate = () => {
          if (audioFiller.currentTime > fillerConfig.loopAfter) {
            audioFiller.currentTime = 0;
          }
        };
      }

      this.fillerAudioPauseHandler = this.fillerAudioHandlePause.bind(this);
      this.fillerAudioPlayHandler = this.fillerAudioHandlePlay.bind(this);
      return audioFiller;
    }
  }

  initRule(rule) {
    const ruleId = this.rules.indexOf(rule);

    if (rule.mode === undefined || (rule.mode == 'element' || rule.mode == 'elementChild') && !rule.tagName // Skip this rule if it doesn't apply to the current page
    || rule.iframe === true && this.filter.iframe == null || rule.iframe === false && this.filter.iframe != null) {
      rule.disabled = true;
    }

    if (!rule.disabled) {
      // Setup rule defaults
      if (rule.filterSubtitles == null) {
        rule.filterSubtitles = true;
      }

      if (this.filter.filterText == false) {
        rule.filterSubtitles = false;
      }

      this.initDisplaySelector(rule); // Allow rules to override global settings

      if (rule.muteMethod == null) {
        rule.muteMethod = this.filter.cfg.muteMethod;
      }

      if (rule.showSubtitles == null) {
        rule.showSubtitles = this.filter.cfg.showSubtitles;
      } // Ensure proper rule values


      if (rule.tagName != null && rule.tagName != '#text') {
        rule.tagName = rule.tagName.toUpperCase();
      }

      switch (rule.mode) {
        case 'cue':
          this.initCueRule(rule);

          if (!rule.disabled) {
            this.cueRuleIds.push(ruleId);
          }

          break;

        case 'dynamic':
          this.initDynamicRule(rule);
          break;

        case 'elementChild':
          this.initElementChildRule(rule);
          break;

        case 'element':
          this.initElementRule(rule);
          break;

        case 'text':
          this.initTextRule(rule);
          break;

        case 'watcher':
          this.initWatcherRule(rule);

          if (!rule.disabled) {
            this.watcherRuleIds.push(ruleId);
          }

          break;
      }

      if (!rule.disabled) {
        this.enabledRuleIds.push(ruleId);

        if (rule.mode == 'cue' && this.cueRuleIds.length === 1) {
          // Only for first rule
          setInterval(this.watchForVideo, 250, this);
        } else if (rule.mode == 'watcher') {
          setInterval(this.watcher, rule.checkInterval, this, ruleId);
        }
      }
    }
  }

  initTextRule(rule) {
    rule.tagName = '#text';

    if (rule.simpleUnmute === undefined) {
      rule.simpleUnmute = true;
    }
  }

  initWatcherRule(rule) {
    if (rule.checkInterval === undefined) {
      rule.checkInterval = 20;
    }

    if (rule.ignoreMutations === undefined) {
      rule.ignoreMutations = true;
    }

    if (rule.simpleUnmute === undefined) {
      rule.simpleUnmute = true;
    }

    if (rule.videoSelector === undefined) {
      rule.videoSelector = WebAudio.defaultVideoSelector;
    }
  }

  initYouTube() {
    if (['m.youtube.com', 'tv.youtube.com', 'www.youtube.com'].includes(this.siteKey)) {
      this.youTube = true; // Issue 251: YouTube is now filtering words out of auto-generated captions/subtitles

      const youTubeAutoCensor = '[ __ ]';
      const lists = this.wordlistId === _constants.default.ALL_WORDS_WORDLIST_ID ? [] : [this.wordlistId];
      const youTubeAutoCensorOptions = {
        lists: lists,
        matchMethod: _constants.default.MATCH_METHODS.PARTIAL,
        repeat: _constants.default.FALSE,
        separators: _constants.default.FALSE,
        sub: ''
      };
      this.filter.cfg.addWord(youTubeAutoCensor, youTubeAutoCensorOptions); // Setup rule for YouTube Auto Subs

      this.youTubeAutoSubsRule = {
        filterSubtitles: true,
        mode: 'ytauto',
        muteMethod: this.filter.cfg.muteMethod
      };
    }
  }

  mute(rule, video) {
    if (!this.muted) {
      this.muted = true;

      if (this.filter.cfg.collectStats) {
        this.filter.stats.mutes++;
      }

      switch (rule.muteMethod) {
        case _constants.default.MUTE_METHODS.TAB:
          chrome.runtime.sendMessage({
            mute: true
          });
          break;

        case _constants.default.MUTE_METHODS.VIDEO:
          if (!video) {
            video = document.querySelector(rule && rule.videoSelector ? rule.videoSelector : WebAudio.defaultVideoSelector);
          }

          if (video && video.volume != null) {
            this.volume = video.volume; // Save original volume

            video.volume = 0;
          }

          if (this.fillerAudio) {
            this.playFillerAudio(video);
          }

          break;
      }
    } // If we called mute and there is a delayedUnmute planned, clear it


    if (rule && rule.unmuteDelay && this.unmuteTimeout) {
      this.clearUnmuteTimeout(rule);
    }
  }

  newCue(start, end, text, options = {}) {
    try {
      const cue = new VTTCue((0, _helper.hmsToSeconds)(start), (0, _helper.hmsToSeconds)(end), text);

      if (options.align) {
        cue.align = options.align;
      }

      if (options.line) {
        cue.line = this.parseLineAndPositionSetting(options.line);
      }

      if (options.position) {
        cue.position = this.parseLineAndPositionSetting(options.position);
      }

      return cue;
    } catch (e) {
      logger.error(`[Audio] Failed to add cue: ( start: ${start}, end: ${end}, text: ${text} )`, e);
    }
  }

  newTextTrack(rule, video, cues) {
    if (video.textTracks) {
      const track = video.addTextTrack('captions', rule.externalSubTrackLabel, rule.videoCueLanguage);
      track.mode = rule.externalSubTrackMode;

      for (let i = 0; i < cues.length; i++) {
        track.addCue(cues[i]);
      }

      return track;
    }
  }

  parseLineAndPositionSetting(setting) {
    if (typeof setting == 'string' && setting != '') {
      if (setting == 'auto') {
        return 'auto';
      } else {
        return parseInt(setting);
      }
    }
  }

  parseSRT(srt) {
    const lines = srt.trim().replace('\r\n', '\n').split(/[\r\n]/).map(line => line.trim());
    const cues = [];
    let start = null;
    let end = null;
    let text = null;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].indexOf('-->') >= 0) {
        const splitted = lines[i].split(/[ \t]+-->[ \t]+/);

        if (splitted.length != 2) {
          throw 'Error when splitting "-->": ' + lines[i];
        }

        start = splitted[0];
        end = splitted[1];
      } else if (lines[i] == '') {
        if (start && end) {
          const cue = this.newCue(start, end, text);
          cues.push(cue);
          start = null;
          end = null;
          text = null;
        }
      } else if (start && end) {
        if (text == null) {
          text = lines[i];
        } else {
          text += '\n' + lines[i];
        }
      }
    }

    if (start && end) {
      const cue = this.newCue(start, end, text);
      cues.push(cue);
    }

    return cues;
  }

  parseSSA(ssa) {
    const cues = [];
    let endIndex, startIndex, textIndex;
    let foundEvents = false;
    const lines = ssa.split('\n');

    for (let i = 0; i < lines.length; i++) {
      if (!foundEvents) {
        if (lines[i].match(/^\[Events\]/i)) {
          foundEvents = true;
        }

        continue;
      }

      if (lines[i].match(/^format:/i)) {
        const format = lines[i].trim().split(',');
        endIndex = format.indexOf('End');
        startIndex = format.indexOf('Start');
        textIndex = format.indexOf('Text');
      } else if (lines[i].match(/^dialogue:/i)) {
        const line = lines[i].trim().split(',');
        const start = line[startIndex];
        const end = line[endIndex];
        const cleanText = line.slice(textIndex).join(',').replace(/\{\\\w.+?\}/g, '').split('\\N').reverse(); // Cleanup formatting and convert newlines

        for (let j = 0; j < cleanText.length; j++) {
          cues.push(this.newCue(start, end, cleanText[j]));
        }
      }
    }

    return cues;
  }

  parseVTT(input) {
    const cues = [];
    const lines = input.split('\n');
    const separator = new RegExp('\\s-->\\s');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.match(separator)) {
        // Timestamp [& option] line
        const parts = line.replace(separator, ' ').split(' ');
        let [start, end, ...extraOptions] = parts;
        start = start.replace(',', '.');
        end = end.replace(',', '.');
        const options = extraOptions.map(o => o.split(':')).reduce((acc, cur) => {
          acc[cur[0]] = cur[1];
          return acc;
        }, {}); // Get text

        const prevLine = lines[i - 1].trim();
        const nextLine = lines[i + 1].trim();
        const textStartRegex = new RegExp(`^<[cs]\\.${prevLine}>`);
        const textEndRegex = new RegExp('<\/[cs]>$');
        let text;

        if (nextLine.match(textStartRegex)) {
          text = nextLine.replace(textStartRegex, '').replace(textEndRegex, '');
        } else {
          text = nextLine;
        } // Handle the case when there are multiple cues that should be shown concurrently
        // The first line of the entry could look like "Caption-C8_1", and the subsequent entry would be "Caption-C8_2"


        if (prevLine && !prevLine.match(/_1$/)) {
          const previousCue = cues[cues.length - 1]; // If they share an endTime with the previous cue, but startTimes are different, make them match

          if (previousCue.startTime != (0, _helper.hmsToSeconds)(start) && previousCue.endTime == (0, _helper.hmsToSeconds)(end)) {
            start = (0, _helper.secondsToHMS)(previousCue.startTime);
          }
        }

        const cue = this.newCue(start, end, text, options); // Concurrent cues seem to be displayed backwards, so we'll reverse them: [a,b,c] -> [c,b,a]

        if (prevLine && !prevLine.match(/_1$/)) {
          const concurrentNumber = parseInt(prevLine.match(/_([2-9])$/)[1]);
          const firstConcurrentCueIndex = cues.length - concurrentNumber + 1; // Find the first concurrent index

          cues.splice(firstConcurrentCueIndex, 0, cue);
        } else {
          cues.push(cue);
        }

        i++; // Skip the next line because we already processed the text
      }
    }

    return cues;
  }

  playFillerAudio(video) {
    if (this.playing(video)) {
      this.fillerAudio.play();
      video.addEventListener('pause', this.fillerAudioPauseHandler);
      video.addEventListener('play', this.fillerAudioPlayHandler);
    }
  }

  playing(video) {
    return !!(video && video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);
  }

  processCues(cues, rule) {
    for (let i = 0; i < cues.length; i++) {
      const cue = cues[i];

      if (cue.hasOwnProperty('filtered')) {
        continue;
      }

      if (rule.videoCueSync) {
        cue.startTime += rule.videoCueSync;
        cue.endTime += rule.videoCueSync;
      }

      const result = this.replaceTextResult(cue.text);
      cue.originalText = cue.text;

      if (result.modified) {
        cue.filtered = true;

        if (rule.filterSubtitles) {
          cue.text = result.filtered;
        }
      } else {
        cue.filtered = false;
      }
    }
  }

  async processExternalSub(video, rule) {
    const textTrack = this.getVideoTextTrack(video.textTracks, rule, 'externalSubTrackLabel');

    if (!this.fetching && !textTrack) {
      try {
        const subsData = (0, _helper.getGlobalVariable)(rule.externalSubVar);

        if (Array.isArray(subsData)) {
          const found = subsData.find(subtitle => subtitle.language === rule.videoCueLanguage);

          if (!found) {
            throw `Failed to find subtitle for language: ${rule.videoCueLanguage}.`;
          }

          this.fetching = true;
          const subs = await (0, _helper.makeRequest)('GET', found[rule.externalSubURLKey]);

          if (typeof subs == 'string' && subs) {
            let parsedCues;

            switch (found[rule.externalSubFormatKey]) {
              case 'ass':
                parsedCues = this.parseSSA(subs);
                break;

              case 'srt':
                parsedCues = this.parseSRT(subs);
                break;

              case 'vtt':
                parsedCues = this.parseVTT(subs);
                break;

              default:
                throw `Unsupported subtitle type: ${found[rule.externalSubFormatKey]}`;
            }

            if (parsedCues) {
              const track = this.newTextTrack(rule, video, parsedCues);
              const cues = track.cues;
              this.processCues(cues, rule);
              this.fetching = false; // Hide old captions/subtitles

              if (rule.displaySelector) {
                const oldSubtitlesContainer = document.querySelector(rule.displaySelector);

                if (oldSubtitlesContainer) {
                  oldSubtitlesContainer.style.display = 'none';
                }
              }
            }
          } else {
            throw `Failed to download external subtitles from '${found[rule.externalSubURLKey]}'.`;
          }
        } else {
          throw `Failed to find subtitle variable: ${rule.externalSubVar}`;
        }
      } catch (e) {
        logger.error(`[Audio] Error using external subtitles for ${this.siteKey}.`, e);
      }
    }
  }

  processWatcherCaptions(rule, captions, data) {
    const initialCall = data.initialCall; // Check if this is the first call

    if (initialCall) {
      // Don't process the same filter again
      if (this.lastProcessedText && this.lastProcessedText === captions.textContent) {
        data.skipped = true;
        return false;
      } else {
        // These are new captions, unmute if muted
        this.unmute(rule);
        this.lastProcessedText = '';
      }

      data.initialCall = false;
      data.filtered = false;
    }

    if (captions.hasChildNodes()) {
      captions.childNodes.forEach(child => {
        this.processWatcherCaptions(rule, child, data);
      });
    } else {
      // Process child
      // innerText handles line feeds/spacing better, but is not available to #text nodes
      const textMethod = (captions && captions.nodeName) === '#text' ? 'textContent' : 'innerText'; // Don't process empty/whitespace nodes

      if (captions[textMethod] && captions[textMethod].trim()) {
        const result = this.replaceTextResult(captions[textMethod]);

        if (result.modified) {
          this.mute(rule);
          data.filtered = true;

          if (rule.filterSubtitles) {
            captions[textMethod] = result.filtered;
          }
        }
      }
    }

    if (initialCall) {
      this.lastProcessedText = captions.textContent;
    }
  } // TODO: Only tested with HBO Max


  processWatcherCaptionsArray(rule, captions, data) {
    const originalText = captions.map(caption => caption.textContent).join(' '); // Don't process the same filter again

    if (this.lastProcessedText && this.lastProcessedText === originalText) {
      data.skipped = true;
      return false;
    } else {
      // These are new captions, unmute if muted
      this.unmute(rule);
      this.lastProcessedText = '';
      data.filtered = false;
    }

    captions.forEach(caption => {
      rule.displayVisibility = true; // Requires .textContent()
      // Don't process empty/whitespace nodes

      if (caption.textContent && caption.textContent.trim()) {
        const result = this.replaceTextResult(caption.textContent);

        if (result.modified) {
          this.mute(rule);
          data.filtered = true;

          if (rule.filterSubtitles) {
            caption.textContent = result.filtered;
          }
        }
      }
    });
    this.lastProcessedText = captions.map(caption => caption.textContent).join(' ');
  }

  replaceTextResult(string, wordlistId = this.wordlistId, statsType = _constants.default.STATS_TYPE_AUDIO) {
    return this.filter.replaceTextResult(string, wordlistId, statsType);
  }

  showSubtitles(rule, subtitles) {
    if (rule.displayVisibility && rule._displayElement) {
      // TODO: Only tested with Watcher: HBO Max. This may be a much better solution
      rule._displayElement.style.visibility = 'visible';
    } else if (rule.displaySelector) {
      const root = rule.rootNode && subtitles && subtitles[0] ? subtitles[0].getRootNode() : document;

      if (root) {
        const container = root.querySelector(rule.displaySelector);

        if (container) {
          container.style.setProperty('display', rule.displayShow);
        }
      }
    }
  }

  stopFillerAudio() {
    this.fillerAudio.pause();
    this.fillerAudio.currentTime = 0;
  }

  subtitlesShouldBeShown(rule, filtered = false) {
    switch (rule.showSubtitles) {
      case _constants.default.SHOW_SUBTITLES.ALL:
        return true;

      case _constants.default.SHOW_SUBTITLES.FILTERED:
        return filtered;

      case _constants.default.SHOW_SUBTITLES.UNFILTERED:
        return !filtered;

      case _constants.default.SHOW_SUBTITLES.NONE:
        return false;
    }
  } // Checks if a node is a supported audio node.
  // Returns rule id upon first match, otherwise returns false


  supportedNode(node) {
    for (let i = 0; i < this.enabledRuleIds.length; i++) {
      const ruleId = this.enabledRuleIds[i];
      const rule = this.rules[ruleId];

      switch (rule.mode) {
        case 'element':
          if (node.nodeName == rule.tagName) {
            let failed = false;

            if (!failed && rule.className && (!node.className || !node.classList.contains(rule.className))) {
              failed = true;
            }

            if (!failed && rule.dataPropPresent && (!node.dataset || !node.dataset.hasOwnProperty(rule.dataPropPresent))) {
              failed = true;
            }

            if (!failed && rule.hasChildrenElements && (typeof node.childElementCount !== 'number' || node.childElementCount == 0)) {
              failed = true;
            }

            if (!failed && rule.subtitleSelector && (typeof node.querySelector !== 'function' || !node.querySelector(rule.subtitleSelector))) {
              failed = true;
            }

            if (!failed && rule.containsSelector && (typeof node.querySelector !== 'function' || !node.querySelector(rule.containsSelector))) {
              failed = true;
            }

            if (!failed) {
              return ruleId;
            }
          }

          break;

        case 'elementChild':
          if (node.nodeName === rule.tagName) {
            const root = rule.rootNode ? node.getRootNode() : document;

            if (root) {
              if (rule.parentSelector) {
                const parent = root.querySelector(rule.parentSelector);

                if (parent && parent.contains(node)) {
                  return ruleId;
                }
              } else {
                const parents = root.querySelectorAll(rule.parentSelectorAll);

                for (let j = 0; j < parents.length; j++) {
                  if (parents[j].contains(node)) {
                    return ruleId;
                  }
                }
              }
            }
          }

          break;

        case 'text':
          if (node.nodeName === rule.tagName) {
            const parent = document.querySelector(rule.parentSelector);

            if (parent && parent.contains(node)) {
              return ruleId;
            }
          }

          break;

        case 'watcher':
          if (node.parentElement && node.parentElement == document.querySelector(rule.subtitleSelector)) {
            return ruleId;
          }

          if (rule.parentSelector != null) {
            const parent = document.querySelector(rule.parentSelector);

            if (parent && parent.contains(node)) {
              return ruleId;
            }
          }

          break;

        case 'dynamic':
          // HBO Max: When playing a video, this node gets added, but doesn't include any context. Grabbing classList and then start watching.
          if (node.textContent === rule.dynamicTextKey) {
            rule.mode = rule.dynamicTargetMode; // TODO: Only working for HBO Max right now

            rule.parentSelectorAll = `${node.tagName.toLowerCase()}.${Array.from(node.classList).join('.')} ${rule.parentSelectorAll}`;
            this.initRule(rule);
          }

          break;
      }
    } // No matching rule was found


    return false;
  }

  textTrackKeyTest(textTrack, key, value) {
    return textTrack[key] && value && textTrack[key] === value;
  }

  unmute(rule, video, delayed = false) {
    if (this.muted) {
      // If we haven't already delayed unmute and we should (rule.unmuteDelay), set the timeout
      if (!delayed && rule && rule.unmuteDelay >= 0) {
        // If unmute is called after an unmute has been scheduled, remove the older one and schedule a new unmute
        if (this.unmuteTimeout == null) {
          this.clearUnmuteTimeout(rule);
        }

        this.unmuteTimeout = window.setTimeout(this.delayedUnmute, rule.unmuteDelay, this, rule);
        return;
      }

      this.muted = false;

      switch (rule.muteMethod) {
        case _constants.default.MUTE_METHODS.TAB:
          chrome.runtime.sendMessage({
            mute: false
          });
          break;

        case _constants.default.MUTE_METHODS.VIDEO:
          if (this.fillerAudio) {
            this.stopFillerAudio();
          }

          if (!video) {
            video = document.querySelector(rule && rule.videoSelector ? rule.videoSelector : WebAudio.defaultVideoSelector);
          }

          if (video && video.volume != null) {
            video.volume = this.volume;
          }

          break;
      }
    }
  }

  watcher(instance, ruleId = 0) {
    const rule = instance.rules[ruleId];
    const video = document.querySelector(rule.videoSelector);

    if (video && instance.playing(video)) {
      if (rule.ignoreMutations) {
        instance.filter.stopObserving();
      } // Stop observing when video is playing


      const data = {
        initialCall: true
      };
      let captions;

      if (rule.parentSelectorAll) {
        // TODO: Only tested with HBO Max
        const parents = Array.from(document.querySelectorAll(rule.parentSelectorAll)).filter(result => {
          return rule._dynamic && result.textContent !== rule.dynamicTextKey;
        });

        if (!rule._displayElement && parents[0] && parents[0].parentElement && parents[0].parentElement.parentElement && parents[0].parentElement.parentElement.parentElement) {
          rule._displayElement = parents[0].parentElement.parentElement.parentElement;
        }

        captions = parents.map(parent => parent.querySelector(rule.subtitleSelector));

        if (captions.length) {
          instance.processWatcherCaptionsArray(rule, captions, data);
        } else {
          // If there are no captions/subtitles: unmute and hide
          instance.watcherSimpleUnmute(rule, video);
        }
      } else if (rule.subtitleSelector) {
        captions = document.querySelector(rule.subtitleSelector);

        if (captions && captions.textContent && captions.textContent.trim()) {
          instance.processWatcherCaptions(rule, captions, data);
        } else {
          // If there are no captions/subtitles: unmute and hide
          instance.watcherSimpleUnmute(rule, video);
        }
      }

      if (data.skipped) {
        return false;
      }

      const shouldBeShown = instance.subtitlesShouldBeShown(rule, data.filtered);
      shouldBeShown ? instance.showSubtitles(rule) : instance.hideSubtitles(rule);

      if (data.filtered) {
        instance.filter.updateCounterBadge();
      }
    } else {
      if (rule.ignoreMutations) {
        instance.filter.startObserving();
      } // Start observing when video is not playing

    }
  }

  watchForVideo(instance) {
    for (let x = 0; x < instance.cueRuleIds.length; x++) {
      const rule = instance.rules[x];
      const video = document.querySelector(rule.videoSelector);

      if (video && video.textTracks && instance.playing(video)) {
        if (rule.externalSub) {
          instance.processExternalSub(video, rule);
        }

        const textTrack = instance.getVideoTextTrack(video.textTracks, rule);

        if (textTrack && !textTrack.oncuechange) {
          if (!rule.videoCueHideCues && rule.showSubtitles === _constants.default.SHOW_SUBTITLES.NONE) {
            textTrack.mode = 'hidden';
          }

          textTrack.oncuechange = () => {
            if (textTrack.activeCues && textTrack.activeCues.length > 0) {
              const activeCues = Array.from(textTrack.activeCues);
              const apfLines = []; // Process cues

              const processed = activeCues.some(activeCue => activeCue.hasOwnProperty('filtered'));

              if (!processed) {
                const allCues = Array.from(textTrack.cues);
                instance.processCues(allCues, rule);
              }

              const filtered = activeCues.some(activeCue => activeCue.filtered);
              filtered ? instance.mute(rule, video) : instance.unmute(rule, video);
              const shouldBeShown = instance.subtitlesShouldBeShown(rule, filtered);

              for (let i = 0; i < activeCues.length; i++) {
                const activeCue = activeCues[i];

                if (!shouldBeShown && rule.videoCueHideCues) {
                  instance.hideCue(rule, activeCue);
                }

                if (rule.apfCaptions) {
                  const text = filtered ? activeCue.text : activeCue.originalText;
                  const line = instance.apfCaptionLine(rule, text);
                  apfLines.unshift(line); // Cues seem to show up in reverse order
                }
              }

              if (apfLines.length) {
                const container = document.getElementById(rule.apfCaptionsSelector);
                const oldLines = container.querySelector('div.APF-subtitles');

                if (oldLines) {
                  oldLines.remove();
                }

                if (shouldBeShown) {
                  const apfCaptions = instance.apfCaptionLines(rule, apfLines);
                  container.appendChild(apfCaptions);
                }
              }

              if (!rule.videoCueHideCues) {
                textTrack.mode = shouldBeShown ? 'showing' : 'hidden';
              }

              if (rule.displaySelector) {
                // Hide original subtitles if using apfCaptions
                apfLines.length || !shouldBeShown ? instance.hideSubtitles(rule) : instance.showSubtitles(rule);
              }
            } else {
              // No active cues
              instance.unmute(rule, video);
            }
          }; // Pre-process all cues after setting oncuechange


          const allCues = Array.from(textTrack.cues);
          instance.processCues(allCues, rule);
        }
      }
    }
  }

  watcherSimpleUnmute(rule, video) {
    this.unmute(rule, video);

    if (rule.showSubtitles > 0) {
      this.hideSubtitles(rule, rule._displayElement);
    }
  }

  youTubeAutoSubsCurrentRow(node) {
    return !!(node.parentElement.parentElement == node.parentElement.parentElement.parentElement.lastChild);
  }

  youTubeAutoSubsMuteTimeout(instance) {
    const video = window.document.querySelector(WebAudio.defaultVideoSelector);

    if (video && instance.playing(video)) {
      instance.unmute(instance.youTubeAutoSubsRule);
    }

    instance.youTubeAutoSubsTimeout = null;
  }

  youTubeAutoSubsNodeIsSubtitleText(node) {
    const captionWindow = document.querySelector('div.caption-window'); // YouTube Auto-gen subs

    return !!(captionWindow && captionWindow.contains(node));
  }

  youTubeAutoSubsPresent() {
    return !!document.querySelector('div.ytp-caption-window-rollup');
  }

  youTubeAutoSubsSupportedNode(node) {
    if (node.nodeName == '#text' && node.textContent != '') {
      return !!this.youTubeAutoSubsNodeIsSubtitleText(node);
    }

    return false;
  }

}

exports.default = WebAudio;

_defineProperty(WebAudio, "brTagRegExp", new RegExp('<br>', 'i'));

_defineProperty(WebAudio, "defaultVideoSelector", 'video');

_defineProperty(WebAudio, "fillerConfig", {
  beep: {
    fileName: 'audio/beep.mp3',
    volume: 0.2
  },
  crickets: {
    fileName: 'audio/crickets.mp3',
    volume: 0.4
  },
  static: {
    fileName: 'audio/static.mp3',
    volume: 0.3
  }
});

_defineProperty(WebAudio, "textTrackRuleMappings", {
  externalSubTrackLabel: 'label',
  videoCueKind: 'kind',
  videoCueLabel: 'label',
  videoCueLanguage: 'language'
});

/***/ }),

/***/ 502:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _constants = _interopRequireDefault(__webpack_require__(357));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class WebAudioSites {
  static combineSites(sites = {}) {
    return Object.assign({}, WebAudioSites.sites, sites);
  }

}

exports.default = WebAudioSites;

_defineProperty(WebAudioSites, "sites", {
  'abc.com': [{
    className: 'akamai-caption-text',
    mode: 'element',
    tagName: 'DIV'
  }, {
    className: 'amp-caption-area',
    displaySelector: 'div.amp-caption-area',
    mode: 'element',
    muteMethod: _constants.default.MUTE_METHODS.VIDEO,
    subtitleSelector: 'div.amp-caption > p',
    tagName: 'DIV'
  }],
  'acorn.tv': [{
    iframe: true,
    mode: 'elementChild',
    parentSelector: 'div.vjs-text-track-display',
    simpleUnmute: true,
    subtitleSelector: ':scope div > div',
    tagName: 'DIV'
  }],
  'www.amazon.com': [{
    displayHide: 'none',
    displaySelector: 'div.webPlayerContainer div.f35bt6a',
    displayShow: '',
    iframe: false,
    mode: 'watcher',
    parentSelector: 'div.webPlayerContainer div p > span',
    subtitleSelector: 'div.webPlayerContainer div span > span',
    videoSelector: 'div.webPlayerElement video[src]'
  }],
  'www.amc.com': [{
    className: 'ttr-container',
    mode: 'element',
    subtitleSelector: 'span.ttr-cue',
    tagName: 'DIV'
  }, {
    mode: 'cue',
    videoCueLanguage: 'en',
    videoSelector: 'video'
  }],
  'tv.apple.com': [{
    displaySelector: 'div.video-container > div > div > div',
    mode: 'elementChild',
    muteMethod: _constants.default.MUTE_METHODS.TAB,
    parentSelector: 'div.video-container',
    preserveWhiteSpace: true,
    rootNode: true,
    subtitleSelector: 'div > div > div > div > div',
    tagName: 'DIV'
  }, {
    displaySelector: 'div.video-container > div > div > div',
    mode: 'elementChild',
    muteMethod: _constants.default.MUTE_METHODS.TAB,
    parentSelector: 'div.video-container',
    preserveWhiteSpace: true,
    rootNode: true,
    subtitleSelector: 'div > div > div > div > span',
    tagName: 'DIV'
  }],
  'www.att.tv': [{
    mode: 'cue',
    videoSelector: 'video#quickplayPlayer'
  }],
  'www.attwatchtv.com': [{
    mode: 'cue',
    videoSelector: 'video#quickplayPlayer'
  }],
  'www.britbox.com': [{
    className: 'bmpui-ui-subtitle-label',
    mode: 'element',
    tagName: 'SPAN'
  }, {
    className: 'bmpui-subtitle-region-container',
    mode: 'element',
    subtitleSelector: 'div.bmpui-container-wrapper > span.bmpui-ui-subtitle-label',
    tagName: 'div'
  }],
  'gem.cbc.ca': [{
    className: 'jw-text-track-container',
    mode: 'element',
    subtitleSelector: 'div.jw-text-track-cue',
    tagName: 'DIV'
  }],
  'www.cbs.com': [{
    mode: 'cue',
    videoCueLanguage: 'en',
    videoCueRequireShowing: false
  }],
  'www.crackle.com': [{
    ignoreMutations: true,
    mode: 'elementChild',
    parentSelector: 'div.clpp-subtitles-container',
    simpleUnmute: true,
    tagName: '#text'
  }],
  'www.criterionchannel.com': [{
    iframe: true,
    mode: 'cue',
    videoCueHideCues: true,
    videoCueRequireShowing: false
  }],
  'beta.crunchyroll.com': [{
    apfCaptions: true,
    apfCaptionsSelector: 'vilosVttJs',
    displaySelector: 'canvas#velocity-canvas',
    externalSub: true,
    externalSubTrackMode: 'hidden',
    externalSubVar: 'window.v1config.media.subtitles',
    iframe: true,
    mode: 'cue',
    videoCueLanguage: 'en-US',
    videoCueRequireShowing: false
  }],
  'www.crunchyroll.com': [{
    apfCaptions: true,
    apfCaptionsSelector: 'vilosVttJs',
    displaySelector: 'canvas#velocity-canvas',
    externalSub: true,
    externalSubTrackMode: 'hidden',
    externalSubVar: 'window.v1config.media.subtitles',
    iframe: true,
    mode: 'cue',
    videoCueLanguage: 'enUS',
    videoCueRequireShowing: false,
    videoSelector: 'video#player0'
  }],
  'www.cwtv.com': [{
    className: 'ttr-container',
    convertBreaks: true,
    mode: 'element',
    subtitleSelector: 'span.ttr-cue',
    tagName: 'DIV'
  }, {
    className: 'ttr-line',
    convertBreaks: true,
    mode: 'element',
    note: '[CC]',
    subtitleSelector: 'span.ttr-cue',
    tagName: 'DIV'
  }],
  'www.discoveryplus.com': [{
    displaySelector: 'div.cjRVXG',
    mode: 'cue',
    videoCueKind: 'captions',
    videoCueLanguage: 'en'
  }],
  'www.dishanywhere.com': [{
    className: 'bmpui-ui-subtitle-label',
    mode: 'element',
    tagName: 'SPAN'
  }, {
    className: 'bmpui-subtitle-region-container',
    mode: 'element',
    subtitleSelector: 'div.bmpui-container-wrapper > span.bmpui-ui-subtitle-label',
    tagName: 'div'
  }],
  'www.disneyplus.com': [{
    mode: 'cue',
    videoCueHideCues: true,
    videoSelector: 'video.btm-media-client-element'
  }],
  'www.fox.com': [{
    className: 'jw-text-track-container',
    mode: 'element',
    subtitleSelector: 'div.jw-text-track-cue',
    tagName: 'DIV'
  }],
  'www.fubo.tv': [{
    displayHide: 'none',
    displaySelector: 'div.bmpui-ui-subtitle-overlay',
    iframe: false,
    mode: 'watcher',
    parentSelector: 'div.bmpui-ui-subtitle-overlay',
    subtitleSelector: 'div.bmpui-ui-subtitle-overlay span'
  }],
  'www.funimation.com': [{
    iframe: true,
    mode: 'elementChild',
    parentSelector: 'div.vjs-text-track-display',
    simpleUnmute: true,
    subtitleSelector: ':scope div > div',
    tagName: 'DIV'
  }],
  'www.paramountplus.com': [{
    mode: 'cue',
    videoCueLanguage: 'en',
    videoCueRequireShowing: false
  }],
  'play.google.com': [{
    className: 'lava-timed-text-window',
    mode: 'element',
    subtitleSelector: 'span.lava-timed-text-caption',
    tagName: 'DIV'
  }],
  'play.hbomax.com': [{
    displayVisibility: true,
    dynamicTargetMode: 'watcher',
    dynamicTextKey: 'Example Text',
    mode: 'dynamic',
    parentSelectorAll: '> span',
    subtitleSelector: 'span'
  }],
  'www.hulu.com': [{
    className: 'caption-text-box',
    displaySelector: 'div.caption-text-box',
    mode: 'element',
    subtitleSelector: 'p',
    tagName: 'DIV'
  }, {
    displaySelector: 'div.CaptionBox',
    mode: 'elementChild',
    parentSelector: 'div.CaptionBox',
    tagName: 'P'
  }],
  'www.nbc.com': [{
    className: 'ttr-line',
    mode: 'element',
    subtitleSelector: 'span.ttr-cue',
    tagName: 'DIV'
  }, {
    mode: 'cue',
    videoCueLanguage: 'en'
  }],
  'www.netflix.com': [{
    className: 'player-timedtext-text-container',
    mode: 'element',
    subtitleSelector: 'span',
    tagName: 'DIV'
  }],
  'www.pbs.org': [{
    iframe: true,
    mode: 'element',
    subtitleSelector: 'div.vjs-text-track-cue > div',
    tagName: 'DIV'
  }],
  'www.peacocktv.com': [{
    displaySelector: 'div.video-player__subtitles',
    mode: 'elementChild',
    parentSelector: 'div.video-player__subtitles > div',
    simpleUnmute: true,
    tagName: '#text'
  }, {
    displaySelector: 'div.video-player__subtitles',
    mode: 'elementChild',
    parentSelector: 'div.video-player__subtitles > div',
    subtitleSelector: 'SPAN > SPAN',
    tagName: 'DIV'
  }, {
    displaySelector: 'div.video-player__subtitles',
    mode: 'elementChild',
    parentSelector: 'div.video-player__subtitles > div',
    tagName: 'SPAN'
  }],
  'www.philo.com': [{
    mode: 'cue'
  }],
  'app.plex.tv': [{
    dataPropPresent: 'dialogueId',
    mode: 'element',
    subtitleSelector: 'span > span',
    tagName: 'DIV'
  }, {
    containsSelector: 'div[data-dialogue-id]',
    mode: 'element',
    subtitleSelector: 'span > span',
    tagName: 'DIV'
  }],
  'pluto.tv': [{
    mode: 'cue',
    videoCueHideCues: true,
    videoCueRequireShowing: false
  }],
  'www.redbox.com': [{
    mode: 'elementChild',
    parentSelector: 'div.rb-text-container',
    subtitleSelector: 'SPAN',
    tagName: 'DIV'
  }],
  'watch.redeemtv.com': [{
    convertBreaks: true,
    displaySelector: 'div.vp-captions',
    mode: 'elementChild',
    parentSelector: 'div.vp-captions',
    tagName: 'SPAN'
  }],
  'www.showmax.com': [{
    ignoreMutations: true,
    mode: 'elementChild',
    parentSelector: 'div.contentWrapper > div.subtitles--3EXhT',
    simpleUnmute: true,
    tagName: '#text'
  }],
  'play.stan.com.au': [{
    ignoreMutations: true,
    mode: 'elementChild',
    parentSelector: 'div.clpp-subtitles-container',
    simpleUnmute: true,
    tagName: '#text'
  }],
  'www.starz.com': [{
    mode: 'elementChild',
    parentSelector: 'starz-captions > div.cue-list',
    tagName: 'SPAN'
  }],
  'www.syfy.com': [{
    className: 'ttr-line',
    mode: 'element',
    subtitleSelector: 'span.ttr-cue',
    tagName: 'DIV'
  }],
  'www.tntdrama.com': [{
    mode: 'cue',
    videoCueLanguage: 'en',
    videoSelector: 'video.top-media-element'
  }],
  'tubitv.com': [{
    mode: 'elementChild',
    parentSelector: 'div#captionsComponent',
    tagName: 'SPAN'
  }],
  'www.universalkids.com': [{
    mode: 'element',
    subtitleSelector: 'div.gwt-HTML',
    tagName: 'DIV'
  }],
  'www.usanetwork.com': [{
    className: 'ttr-line',
    mode: 'element',
    subtitleSelector: 'span.ttr-cue',
    tagName: 'DIV'
  }],
  'www.vudu.com': [{
    mode: 'element',
    subtitleSelector: 'span.subtitles',
    tagName: 'DIV'
  }],
  'vrv.co': [{
    displaySelector: 'div.libassjs-canvas-parent',
    externalSub: true,
    externalSubVar: 'window.vilos.content.captions',
    iframe: true,
    mode: 'cue',
    videoCueLanguage: 'en-US',
    videoCueRequireShowing: false
  }, {
    displaySelector: 'div.libassjs-canvas-parent',
    externalSub: true,
    externalSubVar: 'window.vilos.content.subtitles',
    iframe: true,
    mode: 'cue',
    videoCueLanguage: 'en-US',
    videoCueRequireShowing: false
  }],
  'm.youtube.com': [{
    className: 'caption-window',
    mode: 'element',
    subtitleSelector: 'span.ytp-caption-segment',
    tagName: 'DIV'
  }],
  'tv.youtube.com': [{
    className: 'caption-window',
    mode: 'element',
    subtitleSelector: 'span.ytp-caption-segment',
    tagName: 'DIV'
  }],
  'www.youtube.com': [{
    className: 'caption-window',
    mode: 'element',
    subtitleSelector: 'span.ytp-caption-segment',
    tagName: 'DIV'
  }]
});

/***/ }),

/***/ 863:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


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

/***/ }),

/***/ 894:
/***/ (function() {

// findAndReplaceDOMText v 0.4.6
// @author James Padolsey http://james.padolsey.com
// @license http://unlicense.org/UNLICENSE
//
// Matches the text of a DOM node against a regular expression
// and replaces each match (or node-separated portions of the match)
// in the specified element.
(function (root, factory) {
  // APF: Only run in a browser
  // if (typeof module === 'object' && module.exports) {
  //   // Node/CommonJS
  //   module.exports = factory();
  // } else if (typeof define === 'function' && define.amd) {
  //   // AMD. Register as an anonymous module.
  //   define(factory);
  // } else {
  //   // Browser globals
  //   root.findAndReplaceDOMText = factory();
  // }

  // APF: Only run in a browser
  if (typeof window !== 'undefined') {
    // Attach function to global scope
    window.findAndReplaceDOMText = factory();
  }
}(this, function factory() {

  var PORTION_MODE_RETAIN = 'retain';
  var PORTION_MODE_FIRST = 'first';

  var doc = document;
  var hasOwn = {}.hasOwnProperty;

  function escapeRegExp(s) {
    return String(s).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
  }

  function exposed() {
    // Try deprecated arg signature first:
    return deprecated.apply(null, arguments) || findAndReplaceDOMText.apply(null, arguments);
  }

  function deprecated(regex, node, replacement, captureGroup, elFilter) {
    if ((node && !node.nodeType) && arguments.length <= 2) {
      return false;
    }
    var isReplacementFunction = typeof replacement == 'function';

    if (isReplacementFunction) {
      replacement = (function(original) {
        return function(portion, match) {
          return original(portion.text, match.startIndex);
        };
      }(replacement));
    }

    // Awkward support for deprecated argument signature (<0.4.0)
    var instance = findAndReplaceDOMText(node, {

      find: regex,

      wrap: isReplacementFunction ? null : replacement,
      replace: isReplacementFunction ? replacement : '$' + (captureGroup || '&'),

      prepMatch: function(m, mi) {

        // Support captureGroup (a deprecated feature)

        if (!m[0]) throw 'findAndReplaceDOMText cannot handle zero-length matches';

        if (captureGroup > 0) {
          var cg = m[captureGroup];
          m.index += m[0].indexOf(cg);
          m[0] = cg;
        }

        m.endIndex = m.index + m[0].length;
        m.startIndex = m.index;
        m.index = mi;

        return m;
      },
      filterElements: elFilter
    });

    exposed.revert = function() {
      return instance.revert();
    };

    return true;
  }

  /**
* findAndReplaceDOMText
*
* Locates matches and replaces with replacementNode
*
* @param {Node} node Element or Text node to search within
* @param {RegExp} options.find The regular expression to match
* @param {String|Element} [options.wrap] A NodeName, or a Node to clone
* @param {String} [options.wrapClass] A classname to append to the wrapping element
* @param {String|Function} [options.replace='$&'] What to replace each match with
* @param {Function} [options.filterElements] A Function to be called to check whether to
*	process an element. (returning true = process element,
*	returning false = avoid element)
*/
  function findAndReplaceDOMText(node, options) {
    return new Finder(node, options);
  }

  exposed.NON_PROSE_ELEMENTS = {
    br:1, hr:1,
    // Media / Source elements:
    script:1, style:1, img:1, video:1, audio:1, canvas:1, svg:1, map:1, object:1,
    // Input elements
    input:1, textarea:1, select:1, option:1, optgroup: 1, button:1
  };

  exposed.NON_CONTIGUOUS_PROSE_ELEMENTS = {

    // Elements that will not contain prose or block elements where we don't
    // want prose to be matches across element borders:

    // Block Elements
    address:1, article:1, aside:1, blockquote:1, dd:1, div:1,
    dl:1, fieldset:1, figcaption:1, figure:1, footer:1, form:1, h1:1, h2:1, h3:1,
    h4:1, h5:1, h6:1, header:1, hgroup:1, hr:1, main:1, nav:1, noscript:1, ol:1,
    output:1, p:1, pre:1, section:1, ul:1,
    // Other misc. elements that are not part of continuous inline prose:
    br:1, li: 1, summary: 1, dt:1, details:1, rp:1, rt:1, rtc:1,
    // Media / Source elements:
    script:1, style:1, img:1, video:1, audio:1, canvas:1, svg:1, map:1, object:1,
    // Input elements
    input:1, textarea:1, select:1, option:1, optgroup:1, button:1,
    // Table related elements:
    table:1, tbody:1, thead:1, th:1, tr:1, td:1, caption:1, col:1, tfoot:1, colgroup:1

  };

  exposed.NON_INLINE_PROSE = function(el) {
    return hasOwn.call(exposed.NON_CONTIGUOUS_PROSE_ELEMENTS, el.nodeName.toLowerCase());
  };

  // Presets accessed via `options.preset` when calling findAndReplaceDOMText():
  exposed.PRESETS = {
    prose: {
      forceContext: exposed.NON_INLINE_PROSE,
      filterElements: function(el) {
        return !hasOwn.call(exposed.NON_PROSE_ELEMENTS, el.nodeName.toLowerCase());
      }
    }
  };

  exposed.Finder = Finder;

  /**
* Finder -- encapsulates logic to find and replace.
*/
  function Finder(node, options) {

    var preset = options.preset && exposed.PRESETS[options.preset];

    options.portionMode = options.portionMode || PORTION_MODE_RETAIN;

    if (preset) {
      for (var i in preset) {
        if (hasOwn.call(preset, i) && !hasOwn.call(options, i)) {
          options[i] = preset[i];
        }
      }
    }

    this.node = node;
    this.options = options;

    // Enable match-preparation method to be passed as option:
    this.prepMatch = options.prepMatch || this.prepMatch;

    this.reverts = [];

    this.matches = this.search();

    if (this.matches.length) {
      this.processMatches();
    }

  }

  Finder.prototype = {

    /**
  * Searches for all matches that comply with the instance's 'match' option
  */
    search: function() {

      var match;
      var matchIndex = 0;
      var offset = 0;
      var regex = this.options.find;
      var textAggregation = this.getAggregateText();
      var matches = [];
      var self = this;

      regex = typeof regex === 'string' ? RegExp(escapeRegExp(regex), 'g') : regex;

      matchAggregation(textAggregation);

      function matchAggregation(textAggregation) {
        for (var i = 0, l = textAggregation.length; i < l; ++i) {

          var text = textAggregation[i];

          if (typeof text !== 'string') {
            // Deal with nested contexts: (recursive)
            matchAggregation(text);
            continue;
          }

          if (regex.global) {
            while (match = regex.exec(text)) {
              matches.push(self.prepMatch(match, matchIndex++, offset));
            }
          } else {
            if (match = text.match(regex)) {
              matches.push(self.prepMatch(match, 0, offset));
            }
          }

          offset += text.length;
        }
      }

      return matches;

    },

    /**
  * Prepares a single match with useful meta info:
  */
    prepMatch: function(match, matchIndex, characterOffset) {

      if (!match[0]) {
        throw new Error('findAndReplaceDOMText cannot handle zero-length matches');
      }

      match.endIndex = characterOffset + match.index + match[0].length;
      match.startIndex = characterOffset + match.index;
      match.index = matchIndex;

      return match;
    },

    /**
  * Gets aggregate text within subject node
  */
    getAggregateText: function() {

      var elementFilter = this.options.filterElements;
      var forceContext = this.options.forceContext;

      return getText(this.node);

      /**
    * Gets aggregate text of a node without resorting
    * to broken innerText/textContent
    */
      function getText(node) {

        if (node.nodeType === Node.TEXT_NODE) {
          return [node.data];
        }

        if (elementFilter && !elementFilter(node)) {
          return [];
        }

        var txt = [''];
        var i = 0;

        if (node = node.firstChild) do {

          if (node.nodeType === Node.TEXT_NODE) {
            txt[i] += node.data;
            continue;
          }

          var innerText = getText(node);

          if (
            forceContext &&
         node.nodeType === Node.ELEMENT_NODE &&
         (forceContext === true || forceContext(node))
          ) {
            txt[++i] = innerText;
            txt[++i] = '';
          } else {
            if (typeof innerText[0] === 'string') {
              // Bridge nested text-node data so that they're
              // not considered their own contexts:
              // I.e. ['some', ['thing']] -> ['something']
              txt[i] += innerText.shift();
            }
            if (innerText.length) {
              txt[++i] = innerText;
              txt[++i] = '';
            }
          }
        } while (node = node.nextSibling);

        return txt;

      }

    },

    /**
  * Steps through the target node, looking for matches, and
  * calling replaceFn when a match is found.
  */
    processMatches: function() {

      var matches = this.matches;
      var node = this.node;
      var elementFilter = this.options.filterElements;

      var startPortion,
        endPortion,
        innerPortions = [],
        curNode = node,
        match = matches.shift(),
        atIndex = 0, // i.e. nodeAtIndex
        matchIndex = 0,
        portionIndex = 0,
        doAvoidNode,
        nodeStack = [node];

      out: while (true) {

        if (curNode.nodeType === Node.TEXT_NODE) {

          if (!endPortion && curNode.length + atIndex >= match.endIndex) {
            // We've found the ending
            // (Note that, in the case of a single portion, it'll be an
            // endPortion, not a startPortion.)
            endPortion = {
              node: curNode,
              index: portionIndex++,
              text: curNode.data.substring(match.startIndex - atIndex, match.endIndex - atIndex),

              // If it's the first match (atIndex==0) we should just return 0
              indexInMatch: atIndex === 0 ? 0 : atIndex - match.startIndex,

              indexInNode: match.startIndex - atIndex,
              endIndexInNode: match.endIndex - atIndex,
              isEnd: true
            };

          } else if (startPortion) {
            // Intersecting node
            innerPortions.push({
              node: curNode,
              index: portionIndex++,
              text: curNode.data,
              indexInMatch: atIndex - match.startIndex,
              indexInNode: 0 // always zero for inner-portions
            });
          }

          if (!startPortion && curNode.length + atIndex > match.startIndex) {
            // We've found the match start
            startPortion = {
              node: curNode,
              index: portionIndex++,
              indexInMatch: 0,
              indexInNode: match.startIndex - atIndex,
              endIndexInNode: match.endIndex - atIndex,
              text: curNode.data.substring(match.startIndex - atIndex, match.endIndex - atIndex)
            };
          }

          atIndex += curNode.data.length;

        }

        doAvoidNode = curNode.nodeType === Node.ELEMENT_NODE && elementFilter && !elementFilter(curNode);

        if (startPortion && endPortion) {

          curNode = this.replaceMatch(match, startPortion, innerPortions, endPortion);

          // processMatches has to return the node that replaced the endNode
          // and then we step back so we can continue from the end of the
          // match:

          atIndex -= (endPortion.node.data.length - endPortion.endIndexInNode);

          startPortion = null;
          endPortion = null;
          innerPortions = [];
          match = matches.shift();
          portionIndex = 0;
          matchIndex++;

          if (!match) {
            break; // no more matches
          }

        } else if (
          !doAvoidNode &&
       (curNode.firstChild || curNode.nextSibling)
        ) {
          // Move down or forward:
          if (curNode.firstChild) {
            nodeStack.push(curNode);
            curNode = curNode.firstChild;
          } else {
            curNode = curNode.nextSibling;
          }
          continue;
        }

        // Move forward or up:
        while (true) {
          if (curNode.nextSibling) {
            curNode = curNode.nextSibling;
            break;
          }
          curNode = nodeStack.pop();
          if (curNode === node) {
            break out;
          }
        }

      }

    },

    /**
  * Reverts ... TODO
  */
    revert: function() {
      // Reversion occurs backwards so as to avoid nodes subsequently
      // replaced during the matching phase (a forward process):
      for (var l = this.reverts.length; l--;) {
        this.reverts[l]();
      }
      this.reverts = [];
    },

    prepareReplacementString: function(string, portion, match) {
      var portionMode = this.options.portionMode;
      if (
        portionMode === PORTION_MODE_FIRST &&
     portion.indexInMatch > 0
      ) {
        return '';
      }
      string = string.replace(/\$(\d+|&|`|')/g, function($0, t) {
        var replacement;
        switch(t) {
          case '&':
            replacement = match[0];
            break;
          case '`':
            replacement = match.input.substring(0, match.startIndex);
            break;
          case '\'':
            replacement = match.input.substring(match.endIndex);
            break;
          default:
            replacement = match[+t] || '';
        }
        return replacement;
      });

      if (portionMode === PORTION_MODE_FIRST) {
        return string;
      }

      if (portion.isEnd) {
        return string.substring(portion.indexInMatch);
      }

      return string.substring(portion.indexInMatch, portion.indexInMatch + portion.text.length);
    },

    getPortionReplacementNode: function(portion, match) {

      var replacement = this.options.replace || '$&';
      // APF: Disable replacement wrapper (not used)
      // var wrapper = this.options.wrap;
      // var wrapperClass = this.options.wrapClass;

      // This is causing warnings due to unsafe innerHTML assignment
      // if (wrapper && wrapper.nodeType) {
      //   // Wrapper has been provided as a stencil-node for us to clone:
      //   var clone = doc.createElement('div');
      //   clone.innerHTML = wrapper.outerHTML || new XMLSerializer().serializeToString(wrapper);
      //   wrapper = clone.firstChild;
      // }

      if (typeof replacement == 'function') {
        replacement = replacement(portion, match);
        if (replacement && replacement.nodeType) {
          return replacement;
        }
        return doc.createTextNode(String(replacement));
      }

      // APF: Disable replacement wrapper (not used)
      // var el = typeof wrapper == 'string' ? doc.createElement(wrapper) : wrapper;

      // if (el && wrapperClass) {
      //   el.className = wrapperClass;
      // }

      // replacement = doc.createTextNode(
      //   this.prepareReplacementString(
      //     replacement, portion, match
      //   )
      // );

      // if (!replacement.data) {
      //   return replacement;
      // }

      // if (!el) {
      //   return replacement;
      // }

      // el.appendChild(replacement);

      // return el;
    },

    replaceMatch: function(match, startPortion, innerPortions, endPortion) {

      var matchStartNode = startPortion.node;
      var matchEndNode = endPortion.node;

      var precedingTextNode;
      var followingTextNode;

      if (matchStartNode === matchEndNode) {

        var node = matchStartNode;

        if (startPortion.indexInNode > 0) {
          // Add `before` text node (before the match)
          precedingTextNode = doc.createTextNode(node.data.substring(0, startPortion.indexInNode));
          node.parentNode.insertBefore(precedingTextNode, node);
        }

        // Create the replacement node:
        var newNode = this.getPortionReplacementNode(
          endPortion,
          match
        );

        node.parentNode.insertBefore(newNode, node);

        if (endPortion.endIndexInNode < node.length) { // ?????
          // Add `after` text node (after the match)
          followingTextNode = doc.createTextNode(node.data.substring(endPortion.endIndexInNode));
          node.parentNode.insertBefore(followingTextNode, node);
        }

        node.parentNode.removeChild(node);

        this.reverts.push(function() {
          if (precedingTextNode === newNode.previousSibling) {
            precedingTextNode.parentNode.removeChild(precedingTextNode);
          }
          if (followingTextNode === newNode.nextSibling) {
            followingTextNode.parentNode.removeChild(followingTextNode);
          }
          newNode.parentNode.replaceChild(node, newNode);
        });

        return newNode;

      } else {
        // Replace matchStartNode -> [innerMatchNodes...] -> matchEndNode (in that order)


        precedingTextNode = doc.createTextNode(
          matchStartNode.data.substring(0, startPortion.indexInNode)
        );

        followingTextNode = doc.createTextNode(
          matchEndNode.data.substring(endPortion.endIndexInNode)
        );

        var firstNode = this.getPortionReplacementNode(
          startPortion,
          match
        );

        var innerNodes = [];

        for (var i = 0, l = innerPortions.length; i < l; ++i) {
          var portion = innerPortions[i];
          var innerNode = this.getPortionReplacementNode(
            portion,
            match
          );
          portion.node.parentNode.replaceChild(innerNode, portion.node);
          this.reverts.push((function(portion, innerNode) {
            return function() {
              innerNode.parentNode.replaceChild(portion.node, innerNode);
            };
          }(portion, innerNode)));
          innerNodes.push(innerNode);
        }

        var lastNode = this.getPortionReplacementNode(
          endPortion,
          match
        );

        matchStartNode.parentNode.insertBefore(precedingTextNode, matchStartNode);
        matchStartNode.parentNode.insertBefore(firstNode, matchStartNode);
        matchStartNode.parentNode.removeChild(matchStartNode);

        matchEndNode.parentNode.insertBefore(lastNode, matchEndNode);
        matchEndNode.parentNode.insertBefore(followingTextNode, matchEndNode);
        matchEndNode.parentNode.removeChild(matchEndNode);

        this.reverts.push(function() {
          precedingTextNode.parentNode.removeChild(precedingTextNode);
          firstNode.parentNode.replaceChild(matchStartNode, firstNode);
          followingTextNode.parentNode.removeChild(followingTextNode);
          lastNode.parentNode.replaceChild(matchEndNode, lastNode);
        });

        return lastNode;
      }
    }

  };

  return exposed;

}));

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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
__webpack_unused_export__ = void 0;

var _constants = _interopRequireDefault(__webpack_require__(357));

var _domain = _interopRequireDefault(__webpack_require__(50));

var _filter = _interopRequireDefault(__webpack_require__(394));

var _page = _interopRequireDefault(__webpack_require__(470));

var _webAudio = _interopRequireDefault(__webpack_require__(210));

var _webConfig = _interopRequireDefault(__webpack_require__(863));

var _wordlist = _interopRequireDefault(__webpack_require__(709));

__webpack_require__(894);

var _logger = _interopRequireDefault(__webpack_require__(167));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const logger = new _logger.default();

class WebFilter extends _filter.default {
  constructor() {
    super();

    _defineProperty(this, "audio", void 0);

    _defineProperty(this, "audioOnly", void 0);

    _defineProperty(this, "audioWordlistId", void 0);

    _defineProperty(this, "cfg", void 0);

    _defineProperty(this, "domain", void 0);

    _defineProperty(this, "extension", void 0);

    _defineProperty(this, "filterText", void 0);

    _defineProperty(this, "hostname", void 0);

    _defineProperty(this, "iframe", void 0);

    _defineProperty(this, "location", void 0);

    _defineProperty(this, "mutePage", void 0);

    _defineProperty(this, "observer", void 0);

    _defineProperty(this, "processMutationTarget", void 0);

    _defineProperty(this, "processNode", void 0);

    _defineProperty(this, "shadowObserver", void 0);

    _defineProperty(this, "stats", void 0);

    _defineProperty(this, "summary", void 0);

    this.audioWordlistId = _constants.default.ALL_WORDS_WORDLIST_ID;
    this.extension = true;
    this.filterText = true;
    this.mutePage = false;
    this.processMutationTarget = false;
    this.stats = {
      mutes: 0,
      words: {}
    };
    this.summary = {};
  }

  advancedReplaceText(node, wordlistId, statsType = _constants.default.STATS_TYPE_TEXT) {
    if (node.parentNode || node === document) {
      this.wordlists[wordlistId].regExps.forEach(regExp => {
        // @ts-ignore: External library function
        findAndReplaceDOMText(node, {
          preset: 'prose',
          find: regExp,
          replace: (portion, match) => {
            // logger.debug('[APF] Advanced match found', node.textContent);
            if (portion.index === 0) {
              // Replace the whole match on the first portion and skip the rest
              return this.replaceText(match[0], wordlistId, statsType);
            } else {
              return '';
            }
          }
        });
      });
    } else {
      // ?: Might want to add support for processNode()
      this.cleanText(node, wordlistId, statsType);
    }
  }

  checkMutationForProfanity(mutation) {
    // console.count('[APF] this.checkMutationForProfanity() count'); // Benchmark: Filter
    // logger.debug('Mutation observed', mutation);
    mutation.addedNodes.forEach(node => {
      if (!_page.default.isForbiddenNode(node)) {
        // logger.debug('[APF] Added node(s):', node);
        if (this.mutePage) {
          this.cleanAudio(node);
        } else if (!this.audioOnly) {
          this.processNode(node, this.wordlistId);
        }
      } // else { logger.debug('Forbidden node', node); }

    }); // Check removed nodes to see if we should unmute

    if (this.mutePage && this.audio.muted) {
      mutation.removedNodes.forEach(node => {
        const supported = this.audio.supportedNode(node);
        const rule = supported !== false ? this.audio.rules[supported] : this.audio.rules[0]; // Use the matched rule, or the first rule

        if (supported !== false || node == this.audio.lastFilteredNode || node.contains(this.audio.lastFilteredNode) || rule.simpleUnmute && this.audio.lastFilteredText && this.audio.lastFilteredText.includes(node.textContent)) {
          this.audio.unmute(rule);
        }
      });
    }

    if (mutation.target) {
      if (mutation.target.nodeName === '#text') {
        this.checkMutationTargetTextForProfanity(mutation);
      } else if (this.processMutationTarget) {
        this.processNode(mutation.target, this.wordlistId);
      }
    }
  }

  checkMutationTargetTextForProfanity(mutation) {
    // console.count('checkMutationTargetTextForProfanity'); // Benchmark: Filter
    // logger.debug('Process mutation.target', mutation.target, mutation.target.data);
    if (!_page.default.isForbiddenNode(mutation.target)) {
      if (this.mutePage) {
        const supported = this.audio.supportedNode(mutation.target);
        const rule = supported !== false ? this.audio.rules[supported] : this.audio.rules[0]; // Use the matched rule, or the first rule

        if (supported !== false && rule.simpleUnmute) {
          // Supported node. Check if a previously filtered node is being removed
          if (this.audio.muted && mutation.oldValue && this.audio.lastFilteredText && this.audio.lastFilteredText.includes(mutation.oldValue)) {
            this.audio.unmute(rule);
          }

          this.audio.clean(mutation.target, supported);
        } else if (rule.simpleUnmute && this.audio.muted && !mutation.target.parentElement) {
          // Check for removing a filtered subtitle (no parent)
          if (this.audio.lastFilteredText && this.audio.lastFilteredText.includes(mutation.target.textContent)) {
            this.audio.unmute(rule);
          }
        } else if (!this.audioOnly) {
          // Filter regular text
          const result = this.replaceTextResult(mutation.target.data, this.wordlistId);

          if (result.modified) {
            mutation.target.data = result.filtered;
          }
        }
      } else if (!this.audioOnly) {
        // Filter regular text
        const result = this.replaceTextResult(mutation.target.data, this.wordlistId);

        if (result.modified) {
          mutation.target.data = result.filtered;
        }
      }
    } // else { logger.debug('Forbidden mutation.target node', mutation.target); }

  }

  cleanAudio(node) {
    // YouTube Auto subs
    if (this.audio.youTube && this.audio.youTubeAutoSubsPresent()) {
      if (this.audio.youTubeAutoSubsSupportedNode(node)) {
        if (this.audio.youTubeAutoSubsCurrentRow(node)) {
          // logger.debug('[Audio] YouTube subtitle node', node);
          this.audio.cleanYouTubeAutoSubs(node);
        } else if (!this.audioOnly) {
          this.processNode(node, this.wordlistId); // Clean the rest of the page
        }
      } else if (!this.audioOnly && !this.audio.youTubeAutoSubsNodeIsSubtitleText(node)) {
        this.processNode(node, this.wordlistId); // Clean the rest of the page
      }
    } else {
      // Other audio muting
      const supported = this.audio.supportedNode(node);

      if (supported !== false) {
        // logger.debug('[Audio] Audio subtitle node', node);
        this.audio.clean(node, supported);
      } else if (!this.audioOnly) {
        this.processNode(node, this.wordlistId); // Clean the rest of the page
      }
    }
  }

  cleanChildNode(node, wordlistId, statsType = _constants.default.STATS_TYPE_TEXT) {
    if (node.nodeName) {
      if (node.textContent && node.textContent.trim() != '') {
        const result = this.replaceTextResult(node.textContent, wordlistId, statsType);

        if (result.modified && this.filterText) {
          // logger.debug(`Normal node text changed: '${result.original}' to '${result.filtered}'.`);
          node.textContent = result.filtered;
        }
      } else if (node.nodeName == 'IMG') {
        this.cleanNodeAttribute(node, 'alt', wordlistId, statsType);
        this.cleanNodeAttribute(node, 'title', wordlistId, statsType);
      } else if (node.shadowRoot) {
        this.filterShadowRoot(node.shadowRoot, wordlistId, statsType);
      }
    } // else { logger.debug('Node without nodeName', node); }

  }

  cleanNode(node, wordlistId, statsType = _constants.default.STATS_TYPE_TEXT) {
    if (_page.default.isForbiddenNode(node)) {
      return false;
    }

    if (node.shadowRoot) {
      this.filterShadowRoot(node.shadowRoot, wordlistId, statsType);
    }

    if (node.childNodes.length > 0) {
      for (let i = 0; i < node.childNodes.length; i++) {
        this.cleanNode(node.childNodes[i], wordlistId, statsType);
      }
    } else {
      this.cleanChildNode(node, this.wordlistId, statsType);
    }
  }

  cleanNodeAttribute(node, attribute, wordlistId, statsType = _constants.default.STATS_TYPE_TEXT) {
    if (node[attribute] != '') {
      const result = this.replaceTextResult(node[attribute], wordlistId, statsType);

      if (result.modified && this.filterText) {
        node[attribute] = result.filtered;
      }
    }
  }

  async cleanPage() {
    this.cfg = await _webConfig.default.build();
    this.filterText = this.cfg.filterMethod !== _constants.default.FILTER_METHODS.OFF;
    this.domain = _domain.default.byHostname(this.hostname, this.cfg.domains);
    logger.info('Config loaded', this.cfg);
    const backgroundData = await this.getBackgroundData(); // Use domain-specific settings

    const message = {
      disabled: backgroundData.disabledTab || this.cfg.enabledDomainsOnly && !this.domain.enabled || this.domain.disabled
    };

    if (message.disabled) {
      logger.info(`Disabled for page '${this.hostname}'.`);
      chrome.runtime.sendMessage(message);
      return false;
    }

    if (this.domain.wordlistId !== undefined) {
      this.wordlistId = this.domain.wordlistId;
    }

    if (this.domain.audioWordlistId !== undefined) {
      this.audioWordlistId = this.domain.audioWordlistId;
    } // Detect if we should mute audio for the current page


    if (this.cfg.muteAudio) {
      this.audio = new _webAudio.default(this);
      this.mutePage = this.audio.supportedPage;

      if (this.mutePage) {
        logger.info(`[Audio] Enabling audio muting on ${this.hostname}.`); // Prebuild audio wordlist

        if (this.cfg.wordlistsEnabled && this.wordlistId != this.audio.wordlistId) {
          this.wordlists[this.audio.wordlistId] = new _wordlist.default(this.cfg, this.audio.wordlistId);
        }
      }
    } // Disable if muteAudioOnly mode is active and this is not a suported page


    if (this.cfg.muteAudioOnly) {
      if (this.mutePage) {
        this.audioOnly = true;
      } else {
        message.disabled = true;
        logger.info(`'${this.hostname}' is not an audio page and audio only mode is enabled. Exiting.`);
        chrome.runtime.sendMessage(message);
        return false;
      }
    }

    this.sendInitState(message);
    this.popupListener(); // Remove profanity from the main document and watch for new nodes

    this.init();
    logger.infoTime('Filter initialized.', this);

    if (!this.audioOnly) {
      this.processNode(document, this.wordlistId);
    }

    logger.infoTime('Initial page filtered.');
    this.updateCounterBadge();
    this.startObserving(document); // Track stats (if enabled)

    if (this.cfg.collectStats) {
      this.persistStats();
      window.setTimeout(filter.persistStats, 3000); // Persist once after 3 seconds

      window.setTimeout(filter.persistStats, 6000); // Persist once again after 3 more seconds

      window.setInterval(filter.persistStats, 10000); // Persist every 10 seconds after that
    }
  }

  cleanText(node, wordlistId, statsType = _constants.default.STATS_TYPE_TEXT) {
    if (_page.default.isForbiddenNode(node)) {
      return false;
    }

    if (node.shadowRoot) {
      this.filterShadowRoot(node.shadowRoot, wordlistId, statsType);
    }

    if (node.childElementCount > 0) {
      const treeWalker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT); // Note: This while loop skips processing on first node

      while (treeWalker.nextNode()) {
        if (treeWalker.currentNode.childNodes.length > 0) {
          treeWalker.currentNode.childNodes.forEach(childNode => {
            this.cleanText(childNode, wordlistId, statsType);
          });
        } else {
          if (!_page.default.isForbiddenNode(treeWalker.currentNode)) {
            this.cleanChildNode(treeWalker.currentNode, wordlistId, statsType);
          }
        }
      }
    } else {
      this.cleanChildNode(node, wordlistId, statsType);
    }
  }

  filterShadowRoot(shadowRoot, wordlistId, statsType = _constants.default.STATS_TYPE_TEXT) {
    this.shadowObserver.observe(shadowRoot, observerConfig);
    this.processNode(shadowRoot, wordlistId, statsType);
  }

  foundMatch(word, statsType) {
    super.foundMatch(word);

    if (this.cfg.showSummary) {
      if (this.summary[word.value]) {
        if (this.filterText) {
          this.summary[word.value].count += 1;
        } else {
          this.counter--; // Remove count if we've already found a match for this word when the filter is 'OFF'
        }
      } else {
        let result;

        if (word.matchMethod === _constants.default.MATCH_METHODS.REGEX) {
          result = word.sub || this.cfg.defaultSubstitution;
        } else {
          result = this.replaceText(word.value, _constants.default.ALL_WORDS_WORDLIST_ID, null); // Use all words because we are just filtering a word
        }

        this.summary[word.value] = {
          filtered: result,
          count: 1
        };
      }
    }

    if (this.cfg.collectStats) {
      const wordStats = this.stats.words;

      if (!wordStats[word.value]) {
        wordStats[word.value] = {
          [_constants.default.STATS_TYPE_AUDIO]: 0,
          [_constants.default.STATS_TYPE_TEXT]: 0
        };
      }

      if (this.filterText) {
        switch (statsType) {
          case _constants.default.STATS_TYPE_AUDIO:
            wordStats[word.value].audio++;
            break;

          case _constants.default.STATS_TYPE_TEXT:
            wordStats[word.value].text++;
            break;
        }
      }
    }
  }

  getBackgroundData() {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({
        backgroundData: true
      }, response => {
        if (!response) {
          response = {
            disabledTab: false
          };
        }

        resolve(response);
      });
    });
  }

  init(wordlistId = false) {
    super.init(wordlistId);

    if (this.domain.advanced) {
      this.processNode = this.advancedReplaceText;
    } else if (this.domain.deep) {
      this.processMutationTarget = true;
      this.processNode = this.cleanNode;
    } else {
      this.processNode = this.cleanText;
    }
  }

  async persistStats() {
    if (!_webConfig.default.chromeStorageAvailable()) {
      return false;
    }

    try {
      const words = Object.keys(filter.stats.words);

      if (words.length) {
        const {
          stats
        } = await _webConfig.default.getLocalStoragePromise({
          stats: {
            mutes: 0,
            words: {}
          }
        });
        const storedWords = stats.words;
        words.forEach(word => {
          if (!storedWords[word]) {
            storedWords[word] = {
              [_constants.default.STATS_TYPE_AUDIO]: 0,
              [_constants.default.STATS_TYPE_TEXT]: 0
            };
          }

          storedWords[word].audio += filter.stats.words[word].audio;
          storedWords[word].text += filter.stats.words[word].text;
        });
        stats.mutes += filter.stats.mutes;

        if (stats.startedAt == null) {
          stats.startedAt = Date.now();
        }

        await _webConfig.default.saveLocalStoragePromise({
          stats: stats
        });
        filter.stats = {
          mutes: 0,
          words: {}
        };
      }
    } catch (e) {
      logger.warn('Failed to save stats.', e);
    }
  } // Listen for data requests from Popup


  popupListener() {
    /* istanbul ignore next */
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (this.cfg.showSummary && request.popup && (this.counter > 0 || this.mutePage)) {
        chrome.runtime.sendMessage({
          mutePage: this.mutePage,
          summary: this.summary
        });
      }
    });
  }

  processMutations(mutations) {
    mutations.forEach(mutation => {
      filter.checkMutationForProfanity(mutation);
    });
    filter.updateCounterBadge();
  }

  sendInitState(message) {
    // Reset muted state on page load if we muted the tab audio
    if (this.cfg.muteAudio && this.cfg.muteMethod == _constants.default.MUTE_METHODS.TAB) {
      message.clearMute = true;
    } // Send page state to color icon badge


    if (!this.iframe) {
      message.setBadgeColor = true;
    }

    message.advanced = this.domain.advanced;
    message.mutePage = this.mutePage;

    if (this.mutePage && this.cfg.showCounter) {
      message.counter = this.counter;
    } // Always show counter when muting audio


    chrome.runtime.sendMessage(message);
  }

  startObserving(target = document, observer = this.observer) {
    observer.observe(target, observerConfig);
  }

  stopObserving(observer = this.observer) {
    const mutations = observer.takeRecords();
    observer.disconnect();

    if (mutations) {
      this.processMutations(mutations);
    }
  }

  updateCounterBadge() {
    /* istanbul ignore next */
    // console.count('updateCounterBadge'); // Benchmark: Filter
    if (this.counter > 0) {
      try {
        if (this.cfg.showCounter) chrome.runtime.sendMessage({
          counter: this.counter
        });
        if (this.cfg.showSummary) chrome.runtime.sendMessage({
          summary: this.summary
        });
      } catch (e) {
        if (e.message !== 'Extension context invalidated.') {
          logger.warn('Failed to sendMessage', e);
        }
      }
    }
  }

}

__webpack_unused_export__ = WebFilter;
const filter = new WebFilter();
const observerConfig = {
  characterData: true,
  characterDataOldValue: true,
  childList: true,
  subtree: true
};

if (typeof window !== 'undefined' && ['[object Window]', '[object ContentScriptGlobalScope]'].includes({}.toString.call(window))) {
  filter.observer = new MutationObserver(filter.processMutations);
  filter.shadowObserver = new MutationObserver(filter.processMutations); // The hostname should resolve to the browser window's URI (or the parent of an IFRAME) for disabled/advanced page checks

  if (window != window.top) {
    filter.iframe = document.location;

    try {
      // same domain
      filter.hostname = window.parent.location.hostname;
    } catch (e) {
      // different domain
      if (document.referrer) {
        filter.hostname = new URL(document.referrer).hostname;
      } else {
        filter.hostname = document.location.hostname;
      }
    }
  } else {
    filter.hostname = document.location.hostname;
  }
  /* istanbul ignore next */


  filter.cleanPage();
}
})();

/******/ })()
;