/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
  'পতিতা': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.PARTIAL,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'মেয়ে'
  },
  'বারোভাতারী': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.EXACT,
    repeat: _constants.default.FALSE,
    separators: _constants.default.FALSE,
    sub: 'বোকা'
  },
  'হালার পুতের': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.EXACT,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'হালা'
  },
  'নেংটা': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.PARTIAL,
    repeat: _constants.default.TRUE,
    separators: _constants.default.TRUE,
    sub: 'দুস্টু'
  },
  'হেডার পুতে': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.EXACT,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'পাগল'
  },
  'নটির ফুয়া': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.PARTIAL,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'দুস্টু'
  },
  'শালার পুতে': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.EXACT,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'ফাযিল'
  },
  'শুয়োরের বাচ্চা': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.PARTIAL,
    repeat: _constants.default.TRUE,
    separators: _constants.default.TRUE,
    sub: 'পাগল'
  },
  'কুত্তার বাচ্ছা': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.PARTIAL,
    repeat: _constants.default.TRUE,
    separators: _constants.default.TRUE,
    sub: 'দুস্টু'
  },
  'হারামির বাচ্চা': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.EXACT,
    repeat: _constants.default.FALSE,
    separators: _constants.default.FALSE,
    sub: 'বোকা'
  },
  'হারামজাদা': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.PARTIAL,
    repeat: _constants.default.TRUE,
    separators: _constants.default.TRUE,
    sub: 'বোকা'
  },
  'হারামখোর': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.EXACT,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'পাগল'
  },
  'খাঙ্কিরপোলা': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.EXACT,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'পাগল'
  },
  'চুদির ভাই': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.EXACT,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'বোকা'
  },
  'শালা': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.PARTIAL,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'দুস্টু'
  },
  'হাউয়ার নাতি': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.PARTIAL,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'দুস্টু'
  },
  'ভোদাই': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.EXACT,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'পাগল'
  },
  'মাগিবাজ': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.EXACT,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'মোটা'
  },
  'বেশ্যা': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.PARTIAL,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'পাগল'
  },
  'ধোন': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.PARTIAL,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'পাগল'
  },
  'পুকটি': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.PARTIAL,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'বোকা'
  },
  'বাইনচোদ': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.EXACT,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'দুস্টু'
  },
  'আবাল চোদা': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.EXACT,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'দুস্টু'
  },
  'বোকা চোদা': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.PARTIAL,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'বোকা'
  },
  'bokchod': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.EXACT,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'boka'
  },
  'bainchod': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.EXACT,
    repeat: _constants.default.FALSE,
    separators: _constants.default.FALSE,
    sub: 'boka'
  },
  'khankir chele': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.PARTIAL,
    repeat: _constants.default.TRUE,
    separators: _constants.default.FALSE,
    sub: 'chele'
  },
  'chodon': {
    lists: [],
    matchMethod: _constants.default.MATCH_METHODS.PARTIAL,
    repeat: _constants.default.TRUE,
    separators: _constants.default.TRUE,
    sub: 'chor'
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

/***/ 470:
/***/ ((__unused_webpack_module, exports) => {



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

/***/ 502:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



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


var _constants = _interopRequireDefault(__webpack_require__(357));

var _helper = __webpack_require__(582);

var _webAudioSites = _interopRequireDefault(__webpack_require__(502));

var _webConfig = _interopRequireDefault(__webpack_require__(863));

var _domain = _interopRequireDefault(__webpack_require__(50));

var _page = _interopRequireDefault(__webpack_require__(470));

var _logger = _interopRequireDefault(__webpack_require__(167));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const logger = new _logger.default();

class Popup {
  static async load(instance) {
    instance.cfg = await _webConfig.default.build(Popup._requiredConfig);
    instance.tab = await _domain.default.getCurrentTab();
    instance.url = new URL(instance.tab.url);
    instance.domain = _domain.default.byHostname(instance.url.hostname, instance.cfg.domains);
    instance.filterToggleProp = instance.cfg.enabledDomainsOnly ? 'enabled' : 'disabled';
    return instance;
  }

  constructor() {
    _defineProperty(this, "audioSiteKeys", void 0);

    _defineProperty(this, "cfg", void 0);

    _defineProperty(this, "domain", void 0);

    _defineProperty(this, "filterToggleProp", void 0);

    _defineProperty(this, "protected", void 0);

    _defineProperty(this, "tab", void 0);

    _defineProperty(this, "url", void 0);

    this.protected = false;
  } ////
  // Functions for Popup


  static disable(element) {
    element.disabled = true;
    element.classList.add('disabled');
  }

  static enable(element) {
    element.disabled = false;
    element.classList.remove('disabled');
  }

  static hide(element) {
    element.classList.remove('w3-show');
    element.classList.add('w3-hide');
  }

  static show(element) {
    element.classList.remove('w3-hide');
    element.classList.add('w3-show');
  }

  applyTheme() {
    const elements = [];
    elements.push(document.querySelector('body'));
    elements.push(document.querySelector('#footer'));
    elements.forEach(element => {
      element.classList.toggle('dark');
    });
    const table = document.querySelector('#summary > table');
    table.classList.toggle('w3-striped');
  }

  async filterMethodSelect() {
    const filterMethodSelect = document.getElementById('filterMethodSelect');
    this.cfg.filterMethod = filterMethodSelect.selectedIndex;

    try {
      await this.cfg.save('filterMethod');
      chrome.tabs.reload();
    } catch (e) {
      logger.error('Failed to update selected filter method.', e);
    }
  }

  async populateOptions(event) {
    await Popup.load(popup);

    if (this.cfg.darkMode) {
      this.applyTheme();
    }

    const domainFilter = document.getElementById('domainFilter');
    const domainToggle = document.getElementById('domainToggle');
    const domainModeSelect = document.getElementById('domainModeSelect');
    const filterMethodSelect = document.getElementById('filterMethodSelect');
    const wordListContainer = document.getElementById('wordListContainer');
    const wordlistSelect = document.getElementById('wordlistSelect');
    const audioWordlistSelect = document.getElementById('audioWordlistSelect');
    (0, _helper.dynamicList)(_constants.default.orderedArray(_constants.default.DOMAIN_MODES), domainModeSelect, true);
    domainModeSelect.selectedIndex = this.domain.getModeIndex();
    (0, _helper.dynamicList)(_constants.default.orderedArray(_constants.default.FILTER_METHODS), filterMethodSelect, true);
    filterMethodSelect.selectedIndex = this.cfg.filterMethod;

    if (this.cfg.wordlistsEnabled) {
      const wordlists = ['Default Wordlist'].concat(_webConfig.default._allWordlists, this.cfg.wordlists);
      const wordlistIndex = this.domain.wordlistId >= 0 ? this.domain.wordlistId + 1 : 0;
      (0, _helper.dynamicList)(wordlists, wordlistSelect);
      wordlistSelect.selectedIndex = wordlistIndex;

      if (this.cfg.muteAudio) {
        this.audioSiteKeys = Object.keys(_webAudioSites.default.combineSites(this.cfg.customAudioSites));

        if (this.audioSiteKeys.includes(this.domain.cfgKey)) {
          const audioWordlistIndex = this.domain.audioWordlistId >= 0 ? this.domain.audioWordlistId + 1 : 0;
          (0, _helper.dynamicList)(wordlists, audioWordlistSelect);
          audioWordlistSelect.selectedIndex = audioWordlistIndex;
          const audioWordlistContainer = document.getElementById('audioWordlistContainer');
          Popup.show(audioWordlistContainer);
        }
      }

      Popup.show(wordListContainer);
    }

    if (this.cfg.password && this.cfg.password != '') {
      this.protected = true;
      Popup.disable(domainFilter);
      Popup.disable(domainToggle);
      Popup.disable(domainModeSelect);
      Popup.disable(filterMethodSelect);
      Popup.disable(wordlistSelect);
      Popup.disable(audioWordlistSelect);
    } // Restricted pages


    if (_page.default.disabledProtocols.test(this.url.protocol) || this.domain.hostname == 'chrome.google.com') {
      domainFilter.checked = false;
      Popup.disable(domainFilter);
      Popup.disable(domainToggle);
      Popup.disable(domainModeSelect);
      Popup.disable(filterMethodSelect);
      Popup.disable(wordlistSelect);
      Popup.disable(audioWordlistSelect);
      return false;
    } // Set initial value for domain filter and disable options if they are not applicable


    if (this.domain.disabled || this.cfg.enabledDomainsOnly && !this.domain.enabled) {
      domainFilter.checked = false;
      Popup.disable(domainModeSelect);
      Popup.disable(filterMethodSelect);
      Popup.disable(wordlistSelect);
      Popup.disable(audioWordlistSelect);
    }
  }

  populateSummary(summary) {
    const summaryContainer = document.getElementById('summary');
    const table = summaryContainer.querySelector('table');
    const oldTBody = table.tBodies[0];
    const tBody = document.createElement('tbody');

    if (Object.keys(summary).length > 0) {
      const sortedKeys = Object.keys(summary).sort((a, b) => summary[b].count - summary[a].count);
      sortedKeys.forEach(key => {
        const row = tBody.insertRow();
        const wordCell = row.insertCell(0);
        wordCell.classList.add('w3-tooltip');
        const tooltipSpan = document.createElement('span');
        tooltipSpan.classList.add('summaryTooltip', 'w3-tag', 'w3-text');
        tooltipSpan.textContent = key;
        const wordSpan = document.createElement('span');
        wordSpan.textContent = summary[key].filtered;
        wordCell.appendChild(tooltipSpan);
        wordCell.appendChild(wordSpan);
        const countCell = row.insertCell(1);
        countCell.classList.add('w3-right');
        countCell.textContent = summary[key].count.toString();
      });
      summaryContainer.classList.remove('w3-hide');
    } else {
      summaryContainer.classList.add('w3-hide');
    }

    table.replaceChild(tBody, oldTBody);
  }

  async toggle(prop) {
    if (!this.protected) {
      this.domain[prop] = !this.domain[prop];

      try {
        await this.domain.save(this.cfg);
        chrome.tabs.reload();
      } catch (e) {
        logger.error(`Failed to toggle domain '${this.domain.hostname}'.`, e);
      }
    }
  }

  async updateDomainMode() {
    if (!this.protected) {
      const domainModeSelect = document.getElementById('domainModeSelect');
      this.domain.updateFromModeIndex(domainModeSelect.selectedIndex);

      try {
        await this.domain.save(this.cfg);
        chrome.tabs.reload();
      } catch (e) {
        logger.error(`Failed to update mode for domain '${this.domain.hostname}'.`, e);
      }
    }
  }

  async wordlistSelect(event) {
    const element = event.target;
    const type = element.id === 'wordlistSelect' ? 'wordlistId' : 'audioWordlistId';
    this.domain[type] = element.selectedIndex > 0 ? element.selectedIndex - 1 : undefined; // index 0 = use default (undefined)

    try {
      await this.domain.save(this.cfg);
      chrome.tabs.reload();
    } catch (e) {
      logger.error(`Failed to select wordlist for domain ${this.domain.hostname}.`, e);
    }
  }

} // Listen for data updates from filter


_defineProperty(Popup, "_requiredConfig", ['audioWordlistId', 'customAudioSites', 'darkMode', 'domains', 'enabledDomainsOnly', 'filterMethod', 'muteAudio', 'password', 'wordlistId', 'wordlists', 'wordlistsEnabled']);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.summary) {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, tabs => {
      if (sender.tab.id == tabs[0].id) {
        popup.populateSummary(request.summary);
      }
    });
  }
}); // Initial data request

chrome.tabs.query({
  active: true,
  currentWindow: true
}, tabs => {
  chrome.tabs.sendMessage(tabs[0].id, {
    popup: true
  });
});
const popup = new Popup(); ////
// Listeners

window.addEventListener('load', e => {
  popup.populateOptions();
});
document.getElementById('domainFilter').addEventListener('change', e => {
  popup.toggle(popup.filterToggleProp);
});
document.getElementById('domainModeSelect').addEventListener('change', e => {
  popup.updateDomainMode();
});
document.getElementById('filterMethodSelect').addEventListener('change', e => {
  popup.filterMethodSelect();
});
document.getElementById('wordlistSelect').addEventListener('change', e => {
  popup.wordlistSelect(e);
});
document.getElementById('audioWordlistSelect').addEventListener('change', e => {
  popup.wordlistSelect(e);
});
document.getElementById('options').addEventListener('click', e => {
  chrome.runtime.openOptionsPage();
});
})();

/******/ })()
;