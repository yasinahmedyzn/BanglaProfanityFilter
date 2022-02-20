/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 306:
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Bookmarklet {
  // Input (share link): https://www.dropbox.com/s/id/apfBookmarklet.js?dl=0
  // Output: https://dl.dropbox.com/s/id/apfBookmarklet.js?raw=1
  static dropboxDownloadURL(url) {
    const match = url.match(Bookmarklet.dropboxRegExp);

    if (match) {
      return url.replace(/\/www\./, '/dl.').replace(/\?dl=0/, '?raw=1');
    }

    return url;
  } // Input: https://raw.githubusercontent.com/user/project/branch/apfBookmarklet.js
  // Output: https://cdn.jsdelivr.net/gh/user/project@branch/apfBookmarklet.js


  static githubDownloadURL(url) {
    const match = url.match(Bookmarklet.githubRawRegExp);

    if (match && match[1] && match[2] && match[3] && match[4]) {
      const user = match[1];
      const project = match[2];
      const branch = match[3];
      const filename = match[4];
      return `https://cdn.jsdelivr.net/gh/${user}/${project}@${branch}/${filename}`;
    }

    return url;
  } // Input (raw): https://gist.githubusercontent.com/user/gist_id/raw/revision_id/apfBookmarklet.js
  // Input (uses default filename): https://gist.github.com/user/gist_id
  // Output: https://cdn.statically.io/gist/user/gist_id/raw/apfBookmarklet.js?env=dev


  static gitHubGistDownloadURL(url) {
    let match = url.match(Bookmarklet.gitHubGistRawRegExp);

    if (match && match[1] && match[2]) {
      const user = match[1];
      const gistId = match[2];
      const filename = match[3];
      return `https://cdn.statically.io/gist/${user}/${gistId}/raw/${filename}?env=dev`;
    } else {
      match = url.match(Bookmarklet.gitHubGistLinkRegExp);

      if (match && match[1] && match[2]) {
        const user = match[1];
        const gistId = match[2];
        return `https://cdn.statically.io/gist/${user}/${gistId}/raw/${Bookmarklet._defaultFilename}?env=dev`;
      }
    }

    return url;
  } // Input (share link): https://drive.google.com/file/d/id/view?usp=sharing
  // Output: https://drive.google.com/uc?export=view&id=id


  static googleDriveDownloadURL(url) {
    const match = url.match(Bookmarklet.googleDriveRegExp);

    if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }

    return url;
  }

  static processDownloadURL(url) {
    const originalUrl = url;

    if (originalUrl === url) {
      url = Bookmarklet.dropboxDownloadURL(url);
    }

    if (originalUrl === url) {
      url = Bookmarklet.githubDownloadURL(url);
    }

    if (originalUrl === url) {
      url = Bookmarklet.gitHubGistDownloadURL(url);
    }

    if (originalUrl === url) {
      url = Bookmarklet.googleDriveDownloadURL(url);
    }

    return url;
  }

  static async injectConfig(config = null) {
    const prefix = '/* @preserve - Start User Config */';
    const postfix = '/* @preserve - End User Config */';
    const configRegExp = new RegExp(`${prefix.replace(/[\/\*]/g, '\\$&')}[\\S\\s]\*${postfix.replace(/[\/\*]/g, '\\$&')}`, 'm');
    const origURL = './bookmarkletFilter.js';
    const lowerCaseLettersRegExp = new RegExp('^[a-z]$');
    const response = await fetch(origURL);
    const code = await response.text();
    const cfgCode = code.match(configRegExp).toString();

    try {
      const variable = cfgCode.match(/^const ([a-z])=/m)[1];

      if (lowerCaseLettersRegExp.test(variable)) {
        return code.replace(configRegExp, `${prefix}\nconst ${variable}=${JSON.stringify(config)}\n${postfix}`);
      } else {
        throw 'Unable to set user config - using defaults';
      }
    } catch (e) {
      window.alert('Unable to read config - using defaults');
      return code;
    }
  }

  constructor(url) {
    _defineProperty(this, "hostedUrl", void 0);

    this.hostedUrl = Bookmarklet.processDownloadURL(url);
  }

  destination() {
    const prefix = '(function(){if(!document.querySelector("script.apfBookmarklet")){const apfScriptEl=document.body.appendChild(document.createElement("script"));apfScriptEl.type="text/javascript";apfScriptEl.src="';
    const postfix = '";apfScriptEl.className="apfBookmarklet";}})()';
    return 'javascript:' + encodeURIComponent(prefix + this.hostedUrl + postfix);
  }

}

exports.default = Bookmarklet;

_defineProperty(Bookmarklet, "_defaultBookmarklet", 'https://raw.githubusercontent.com/richardfrost/AdvancedProfanityFilter/master/bookmarklet.js');

_defineProperty(Bookmarklet, "_defaultFilename", 'apfBookmarklet.js');

_defineProperty(Bookmarklet, "dropboxRegExp", /^https:\/\/www\.dropbox\.com\/[a-z]\/\w+?\/[\w\-\.]+?\?dl=0$/);

_defineProperty(Bookmarklet, "gitHubGistLinkRegExp", /^https:\/\/gist\.github\.com\/([\w\-]+?)\/([\w\-]+?)$/);

_defineProperty(Bookmarklet, "gitHubGistRawRegExp", /^https:\/\/gist\.githubusercontent\.com\/([\w\-]+?)\/([\w\-]+?)\/raw\/[\w\-]+?\/([\w\-.]+?)$/);

_defineProperty(Bookmarklet, "githubRawRegExp", /^https:\/\/raw\.githubusercontent\.com\/([\w-]+?)\/([\w-]+?)\/([\w-]+?)\/([\w-.]+?)$/);

_defineProperty(Bookmarklet, "googleDriveRegExp", /^https:\/\/drive\.google\.com\/file\/[a-z]\/(.+?)\/view/);

/***/ }),

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

/***/ 394:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



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

/***/ 812:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



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

/***/ 997:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _optionPage = _interopRequireDefault(__webpack_require__(205));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class OptionAuth {
  authenticate(evt) {
    const passwordInput = document.getElementById('passwordInput');

    if (passwordInput.value == this.password) {
      this.authenticated = true;

      _optionPage.default.closeModal('passwordModal');

      _optionPage.default.show(document.getElementById('main'));

      _optionPage.default.hideInputError(passwordInput);
    } else {
      _optionPage.default.showInputError(passwordInput);
    }
  }

  constructor(password) {
    _defineProperty(this, "authenticated", void 0);

    _defineProperty(this, "password", void 0);

    this.password = password;
    this.authenticated = false;
  }

  setPassword(optionPage) {
    const password = document.getElementById('setPassword');
    optionPage.cfg.password = password.value;
    optionPage.saveProp('password');
    password.value = '';
    this.setPasswordButton(optionPage);
  }

  setPasswordButton(optionPage) {
    const passwordText = document.getElementById('setPassword');
    const passwordBtn = document.getElementById('setPasswordBtn');

    if (optionPage.cfg.password) {
      // Password already set
      _optionPage.default.enableBtn(passwordBtn);

      if (passwordText.value) {
        // Password field filled
        passwordBtn.innerText = 'SET';
      } else {
        // Empty password field
        passwordBtn.innerText = 'REMOVE';
      }
    } else {
      // Password not already set
      passwordBtn.innerText = 'SET';

      if (passwordText.value) {
        // Password field filled
        _optionPage.default.enableBtn(passwordBtn);
      } else {
        // Empty password field
        _optionPage.default.disableBtn(passwordBtn);
      }
    }
  }

}

exports.default = OptionAuth;

/***/ }),

/***/ 205:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _constants = _interopRequireDefault(__webpack_require__(357));

var _helper = __webpack_require__(582);

var _webConfig = _interopRequireDefault(__webpack_require__(863));

var _filter = _interopRequireDefault(__webpack_require__(394));

var _domain = _interopRequireDefault(__webpack_require__(50));

var _optionAuth = _interopRequireDefault(__webpack_require__(997));

var _dataMigration = _interopRequireDefault(__webpack_require__(569));

var _bookmarklet = _interopRequireDefault(__webpack_require__(306));

var _webAudioSites = _interopRequireDefault(__webpack_require__(502));

var _logger = _interopRequireDefault(__webpack_require__(167));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const logger = new _logger.default();

class OptionPage {
  static closeModal(id) {
    OptionPage.hide(document.getElementById(id));
  }

  static configureConfirmModal(settings = {}, contentElement) {
    const modalTitle = document.getElementById('confirmModalTitle');
    const modalContent = document.getElementById('confirmModalContent');
    const modalHeader = document.querySelector('#confirmModal header');
    const backupButtonContainer = document.querySelector('#confirmModal span.confirmBackupButton');
    const backupButton = document.querySelector('#confirmModal button#confirmModalBackup');
    (0, _helper.removeChildren)(modalContent);
    const defaults = {
      backup: false,
      content: 'Are you sure?',
      title: 'Please Confirm',
      titleClass: 'w3-flat-peter-river'
    };
    settings = Object.assign(defaults, settings);

    if (!contentElement) {
      contentElement = document.createElement('span');
      contentElement.textContent = settings.content;
    }

    modalTitle.textContent = settings.title;
    modalContent.appendChild(contentElement);
    modalHeader.className = `w3-container ${settings.titleClass}`;

    if (settings.backup) {
      OptionPage.show(backupButtonContainer);
      OptionPage.enableBtn(backupButton);
    } else {
      OptionPage.hide(backupButtonContainer);
      OptionPage.disableBtn(backupButton);
    }
  }

  static configureStatusModal(content, title, titleColor) {
    const modalTitle = document.getElementById('statusModalTitle');
    const modalContent = document.getElementById('statusModalContent');
    const modalHeader = document.querySelector('#statusModal header');
    const contentElement = document.createElement('span');
    (0, _helper.removeChildren)(modalContent);
    modalTitle.textContent = title;
    contentElement.textContent = content;
    modalContent.appendChild(contentElement);
    modalHeader.className = `w3-container ${titleColor}`;
  }

  static disableBtn(element) {
    element.classList.add('disabled');
    element.classList.add('w3-flat-silver');
  }

  static enableBtn(element) {
    element.classList.remove('disabled');
    element.classList.remove('w3-flat-silver');
  }

  static hide(element) {
    element.classList.remove('w3-show');
    element.classList.add('w3-hide');
  }

  static hideInputError(element) {
    element.classList.remove('w3-border-red');

    try {
      element.setCustomValidity('');
    } catch (e) {// If HTML5 validation not supported, the modal will suffice
    }
  }

  static hideStatus() {
    const notificationPanel = document.getElementById('notificationPanel');
    OptionPage.hide(notificationPanel);
  }

  static openModal(id) {
    OptionPage.show(document.getElementById(id));
  }

  static show(element) {
    element.classList.remove('w3-hide');
    element.classList.add('w3-show');
  }

  static showErrorModal(content = 'The requested action failed. Please try again or contact support.', title = 'Error', titleColor = 'w3-red') {
    this.configureStatusModal(content, title, titleColor);
    OptionPage.openModal('statusModal');
  }

  static showInputError(element, message = '') {
    element.classList.add('w3-border-red');

    if (message) {
      try {
        element.setCustomValidity(message);
        element.reportValidity();
      } catch (e) {
        OptionPage.showWarningModal(message);
      }
    }
  }

  static showStatusModal(content = 'Status updated.', title = 'Status', titleColor = 'w3-flat-peter-river') {
    this.configureStatusModal(content, title, titleColor);
    OptionPage.openModal('statusModal');
  }

  static showWarningModal(content = 'Invalid input.', title = 'Warning', titleColor = 'w3-orange') {
    this.configureStatusModal(content, title, titleColor);
    OptionPage.openModal('statusModal');
  }

  constructor() {
    _defineProperty(this, "auth", void 0);

    _defineProperty(this, "cfg", void 0);

    _defineProperty(this, "themeButtons", void 0);

    _defineProperty(this, "themeElements", void 0);

    this.themeButtons = OptionPage.themeButtonSelectors.map(selector => {
      return document.querySelector(selector);
    });
    this.themeElements = OptionPage.themeElementSelectors.map(selector => {
      return document.querySelector(selector);
    });
  }

  applyTheme() {
    const darkApplied = this.themeElements[0].classList.contains('dark');

    if (darkApplied != this.cfg.darkMode) {
      this.themeElements.forEach(element => {
        element.classList.toggle('dark');
      });
      this.themeButtons.forEach(element => {
        element.classList.toggle('w3-hide');
      });
      const statsWordTable = document.querySelector('table#statsWordTable');
      statsWordTable.classList.toggle('w3-striped');
    }
  }

  backupConfig() {
    const padded = num => {
      return ('0' + num).slice(-2);
    };

    const date = new Date();
    const today = `${date.getFullYear()}-${padded(date.getMonth() + 1)}-${padded(date.getDate())}`;
    const time = `${padded(date.getHours())}${padded(date.getMinutes())}${padded(date.getSeconds())}`;
    (0, _helper.exportToFile)(JSON.stringify(this.cfg.ordered(), null, 2), `apf-backup-${today}_${time}.json`);
  }

  bulkEditorAddRow(word = '', data = undefined) {
    const table = document.querySelector('#bulkWordEditorModal table#bulkWordEditorTable');

    if (data === undefined) {
      data = {
        lists: [],
        matchMethod: this.cfg.defaultWordMatchMethod,
        repeat: this.cfg.defaultWordRepeat,
        separators: this.cfg.defaultWordSeparators,
        sub: ''
      };
    } // Build row


    const row = table.tBodies[0].insertRow();
    row.classList.add('bulkWordRow'); // Add data

    const cellRemoveRow = row.insertCell(0);
    const cellWord = row.insertCell(1);
    const cellSub = row.insertCell(2);
    const cellSubCase = row.insertCell(3);
    const cellMatchMethod = row.insertCell(4);
    const cellRepeat = row.insertCell(5);
    const cellSeparators = row.insertCell(6);
    const removeButton = document.createElement('button');
    removeButton.textContent = 'X';
    removeButton.addEventListener('click', e => {
      this.bulkEditorRemoveRow(e);
    });
    cellRemoveRow.appendChild(removeButton);
    const wordInput = document.createElement('input');
    wordInput.type = 'text';
    wordInput.classList.add('bulkAddWordText');
    wordInput.value = word;
    cellWord.appendChild(wordInput);
    const subInput = document.createElement('input');
    subInput.type = 'text';
    cellSub.appendChild(subInput);
    subInput.value = data.sub;
    const subCaseInput = document.createElement('input');
    subCaseInput.type = 'checkbox';
    subCaseInput.name = 'subCase';
    subCaseInput.checked = (0, _helper.numberToBoolean)(data.case);
    cellSubCase.appendChild(subCaseInput);
    const matchMethodSelect = document.createElement('select');

    _constants.default.orderedArray(_constants.default.MATCH_METHODS).forEach((matchMethod, index) => {
      const matchMethodUpper = matchMethod.toUpperCase();
      const optionElement = document.createElement('option');
      optionElement.value = _constants.default.MATCH_METHODS[matchMethodUpper].toString();
      optionElement.classList.add(`bulkMatchMethod${_constants.default.MATCH_METHODS[matchMethodUpper]}`);
      optionElement.textContent = matchMethod;
      matchMethodSelect.appendChild(optionElement);
    });

    matchMethodSelect.selectedIndex = data.matchMethod;
    cellMatchMethod.appendChild(matchMethodSelect);
    const repeatInput = document.createElement('input');
    repeatInput.type = 'checkbox';
    repeatInput.name = 'repeat';
    repeatInput.checked = (0, _helper.numberToBoolean)(data.repeat);
    cellRepeat.appendChild(repeatInput);
    const separatorsInput = document.createElement('input');
    separatorsInput.type = 'checkbox';
    separatorsInput.name = 'separators';
    separatorsInput.checked = (0, _helper.numberToBoolean)(data.separators);
    cellSeparators.appendChild(separatorsInput);
    const existingCellCount = row.cells.length;
    this.cfg.wordlists.forEach((wordlist, index) => {
      const cell = row.insertCell(index + existingCellCount);
      const wordlistInput = document.createElement('input');
      wordlistInput.type = 'checkbox';
      wordlistInput.name = 'wordlists';
      wordlistInput.classList.add('wordlistData');
      wordlistInput.dataset.col = (index + 1).toString();
      wordlistInput.checked = data.lists.includes(index + 1);
      cell.appendChild(wordlistInput);
    }); // Scroll to the bottom if this is a new word row

    if (word === '') {
      table.parentElement.scrollTop = table.parentElement.scrollHeight - table.parentElement.clientHeight;
      wordInput.focus();
    }
  }

  bulkEditorAddWords() {
    const bulkAddWordsText = document.querySelector('#bulkWordEditorModal textarea#bulkAddWordsText');
    const text = bulkAddWordsText.value;

    if (text != '') {
      const table = document.querySelector('#bulkWordEditorModal table#bulkWordEditorTable');
      const lines = text.toLowerCase().split('\n');
      const words = lines.map(line => line.trim());
      const uniqueWords = words.filter((word, index) => words.indexOf(word) === index); // Remove any words that already exist in the current table

      const currentWords = this.bulkEditorCurrentWords();
      const wordsToAdd = uniqueWords.filter(newWord => !currentWords.includes(newWord)); // Add the new words to the table

      wordsToAdd.forEach(word => {
        if (word != '') {
          this.bulkEditorAddRow(word);
        }
      }); // Scroll to the bottom

      table.parentElement.scrollTop = table.parentElement.scrollHeight - table.parentElement.clientHeight; // Clear textarea after adding to the table

      bulkAddWordsText.value = '';
    }
  }

  bulkEditorRemoveAll() {
    const tBody = document.querySelector('#bulkWordEditorModal table tbody');
    (0, _helper.removeChildren)(tBody);
    this.bulkEditorAddRow();
  }

  bulkEditorRemoveRow(event) {
    const table = document.querySelector('#bulkWordEditorModal table#bulkWordEditorTable');
    const row = event.target.parentElement.parentElement;
    table.deleteRow(row.rowIndex);
  }

  async bulkEditorSave() {
    const table = document.querySelector('#bulkWordEditorModal table#bulkWordEditorTable');
    const failed = {};
    this.cfg.words = {};
    table.querySelectorAll('tr.bulkWordRow').forEach(tr => {
      const cells = tr.querySelectorAll('td');
      const lists = [];
      const wordlistSelectionsInput = tr.querySelectorAll('input[name="wordlists"]');
      wordlistSelectionsInput.forEach((wordlist, index) => {
        if (wordlist.checked) {
          lists.push(index + 1);
        }
      });
      const name = cells[1].querySelector('input').value;

      if (name != '') {
        const wordOptions = {
          case: (0, _helper.booleanToNumber)(cells[3].querySelector('input').checked),
          lists: lists,
          matchMethod: cells[4].querySelector('select').selectedIndex,
          repeat: (0, _helper.booleanToNumber)(cells[5].querySelector('input').checked),
          separators: (0, _helper.booleanToNumber)(cells[6].querySelector('input').checked),
          sub: cells[2].querySelector('input').value
        };
        const success = this.cfg.addWord(name, wordOptions);

        if (!success) {
          failed[name] = wordOptions;
        }
      }
    });

    try {
      await this.cfg.save('words');
      OptionPage.closeModal('bulkWordEditorModal');
      OptionPage.showStatusModal('Words saved successfully.');
      filter.rebuildWordlists();
      this.populateOptions();
    } catch (e) {
      logger.warn('Failed to save.', e);
      OptionPage.showErrorModal(`Failed to save. [Error: ${e}]`);
    }
  }

  bulkEditorWordlistCheckbox(event) {
    const checked = event.target.checked;
    document.querySelectorAll(`#bulkWordEditorModal table td input.wordlistData[data-col="${event.target.dataset.col}"]`).forEach(box => {
      box.checked = checked;
    });
  }

  bulkEditorCurrentWords() {
    const table = document.querySelector('#bulkWordEditorModal table#bulkWordEditorTable');
    const words = [];
    table.querySelectorAll('tr > td > input.bulkAddWordText').forEach((wordText, index) => {
      words.push(wordText.value);
    });
    return words;
  }

  bulkWordEditorHeaderRow() {
    const row = document.createElement('tr');
    const removeCell = document.createElement('th');
    const removeButton = document.createElement('button');
    removeButton.textContent = 'X';
    removeButton.id = 'bulkEditorRemoveAll';
    removeButton.addEventListener('click', e => {
      this.bulkEditorRemoveAll();
    });
    const removeSpan = document.createElement('span');
    removeSpan.textContent = ' Remove';
    removeCell.appendChild(removeButton);
    removeCell.appendChild(removeSpan);
    row.appendChild(removeCell);
    const normalHeaders = ['Word', 'Substitution', 'Substitution Case', 'Match Method', 'Repeated', 'Separators'];
    normalHeaders.forEach(item => {
      const cell = document.createElement('th');
      const cellSpan = document.createElement('span');
      cellSpan.textContent = item;
      cell.appendChild(cellSpan);
      row.appendChild(cell);
    });
    this.cfg.wordlists.forEach((wordlist, i) => {
      const cell = document.createElement('th');
      const inputLabel = document.createElement('label');
      const input = document.createElement('input');
      const span = document.createElement('span');
      input.type = 'checkbox';
      input.classList.add('wordlistHeader');
      input.dataset.col = (i + 1).toString();
      span.textContent = ` ${wordlist}`; // TODO: Fix spacing

      inputLabel.appendChild(input);
      inputLabel.appendChild(span);
      cell.appendChild(inputLabel);
      row.appendChild(cell);
    });
    return row;
  }

  configInlineToggle() {
    const input = document.getElementById('configInlineInput');
    const configText = document.getElementById('configText');

    if (input.checked) {
      OptionPage.show(configText);
      this.exportConfig();
    } else {
      OptionPage.hide(configText);
      configText.value = '';
    }
  }

  confirm(evt, action) {
    const ok = document.getElementById('confirmModalOK');
    ok.removeEventListener('click', bulkEditorSave);
    ok.removeEventListener('click', importConfig);
    ok.removeEventListener('click', removeAllWords);
    ok.removeEventListener('click', restoreDefaults);
    ok.removeEventListener('click', setPassword);
    ok.removeEventListener('click', statsReset);
    let content;
    let italics;

    switch (action) {
      case 'bulkEditorSave':
        content = document.createElement('span');
        italics = document.createElement('i');
        content.textContent = 'Are you sure you want to save these changes?\n\n';
        italics.textContent = 'Make sure you have a backup first!';
        content.appendChild(italics);
        OptionPage.configureConfirmModal({
          backup: true
        }, content);
        ok.addEventListener('click', bulkEditorSave);
        break;

      case 'importConfig':
        {
          OptionPage.configureConfirmModal({
            content: 'Are you sure you want to overwrite your existing settings?',
            backup: true
          });
          ok.addEventListener('click', importConfig);
          break;
        }

      case 'removeAllWords':
        content = document.createElement('span');
        italics = document.createElement('i');
        content.textContent = 'Are you sure you want to remove all words?\n\n';
        italics.textContent = '(Note: The default words will return if no words are added)';
        content.appendChild(italics);
        OptionPage.configureConfirmModal({}, content);
        ok.addEventListener('click', removeAllWords);
        break;

      case 'statsReset':
        OptionPage.configureConfirmModal({
          content: 'Are you sure you want to reset filter statistics?'
        });
        ok.addEventListener('click', statsReset);
        break;

      case 'restoreDefaults':
        OptionPage.configureConfirmModal({
          content: 'Are you sure you want to restore defaults?',
          backup: true
        });
        ok.addEventListener('click', restoreDefaults);
        break;

      case 'setPassword':
        {
          const passwordText = document.getElementById('setPassword');
          const passwordBtn = document.getElementById('setPasswordBtn');
          if (passwordBtn.classList.contains('disabled')) return false;
          const message = passwordText.value == '' ? 'Are you sure you want to remove the password?' : `Are you sure you want to set the password to '${passwordText.value}'?`;
          OptionPage.configureConfirmModal({
            content: message
          });
          ok.addEventListener('click', setPassword);
          break;
        }
    }

    OptionPage.openModal('confirmModal');
  }

  confirmModalBackup() {
    const backupButton = document.querySelector('#confirmModal button#confirmModalBackup');

    if (!backupButton.classList.contains('disabled')) {
      this.backupConfig();
      OptionPage.disableBtn(backupButton);
    }
  }

  async exportBookmarkletFile() {
    const code = await _bookmarklet.default.injectConfig(this.cfg.ordered());
    (0, _helper.exportToFile)(code, 'apfBookmarklet.js');
  }

  exportConfig() {
    const input = document.getElementById('configInlineInput');

    if (input.checked) {
      // inline editor
      const configText = document.getElementById('configText');
      configText.value = JSON.stringify(this.cfg.ordered(), null, 2);
    } else {
      this.backupConfig();
    }
  }

  importConfig(e) {
    const input = document.getElementById('configInlineInput');

    if (input.checked) {
      // inline editor
      const configText = document.getElementById('configText');
      this.importConfigText(configText.value);
    } else {
      const importFileInput = document.getElementById('importFileInput');
      importFileInput.click();
    }
  }

  async importConfigFile(e) {
    const file = e.target.files[0];
    const importFileInput = document.getElementById('importFileInput');
    const fileText = await (0, _helper.readFile)(file);
    this.importConfigText(fileText);
    importFileInput.value = '';
  }

  async importConfigText(cfg) {
    try {
      const importedCfg = new _webConfig.default(JSON.parse(cfg));
      const migration = new _dataMigration.default(importedCfg);
      migration.runImportMigrations();
      const resetSuccess = await this.restoreDefaults(null, true);

      if (resetSuccess) {
        try {
          this.cfg = importedCfg;
          await this.cfg.save();
          OptionPage.showStatusModal('Settings imported successfully.');
          this.init();
        } catch (e) {
          logger.warn('Failed to import settings.', e);
          OptionPage.showErrorModal(`Failed to import settings. [Error: ${e}]`);
        }
      }
    } catch (e) {
      OptionPage.showErrorModal('Failed to import settings.');
    }
  }

  async init() {
    this.cfg = await _webConfig.default.build();
    if (!this.auth) this.auth = new _optionAuth.default(this.cfg.password);
    filter.cfg = this.cfg;
    filter.init(); // logger.debug(`Password: '${this.cfg.password}', Authenticated: ${this.auth.authenticated}`);

    if (this.cfg.password && !this.auth.authenticated) {
      OptionPage.openModal('passwordModal');
      document.getElementById('passwordInput').focus();
    } else {
      OptionPage.show(document.getElementById('main'));
    }

    this.applyTheme();
    this.populateOptions();
  }

  populateAudio() {
    const muteAudioInput = document.getElementById('muteAudio');
    const fillerAudioSelect = document.getElementById('fillerAudioSelect');
    const muteAudioOnlyInput = document.getElementById('muteAudioOnly');
    const muteCueRequireShowingInput = document.getElementById('muteCueRequireShowing');
    const selectedMuteMethod = document.querySelector(`input[name=audioMuteMethod][value='${this.cfg.muteMethod}']`);
    const selectedshowSubtitle = document.querySelector(`input[name=audioShowSubtitles][value='${this.cfg.showSubtitles}']`);
    const muteAudioOptionsContainer = document.getElementById('muteAudioOptionsContainer');
    const audioYouTubeAutoSubsMin = document.getElementById('audioYouTubeAutoSubsMin');
    const audioYouTubeAutoSubsMax = document.getElementById('audioYouTubeAutoSubsMax');
    const customAudioSitesTextArea = document.getElementById('customAudioSitesText');
    muteAudioInput.checked = this.cfg.muteAudio;
    fillerAudioSelect.value = this.cfg.fillerAudio;
    muteAudioOnlyInput.checked = this.cfg.muteAudioOnly;
    muteCueRequireShowingInput.checked = this.cfg.muteCueRequireShowing;
    this.cfg.muteAudio ? OptionPage.show(muteAudioOptionsContainer) : OptionPage.hide(muteAudioOptionsContainer);
    selectedMuteMethod.checked = true;
    selectedshowSubtitle.checked = true;
    audioYouTubeAutoSubsMin.value = this.cfg.youTubeAutoSubsMin.toString();
    audioYouTubeAutoSubsMax.value = this.cfg.youTubeAutoSubsMax.toString();
    customAudioSitesTextArea.value = this.cfg.customAudioSites ? JSON.stringify(this.cfg.customAudioSites, null, 2) : '';
  }

  populateBookmarkletPage() {
    const bookmarkletConfig = document.querySelector('input[name="bookmarkletConfig"]:checked');
    const bookmarkletCustomConfig = document.getElementById('bookmarkletCustomConfig');

    if (bookmarkletConfig.value == 'default') {
      OptionPage.hide(bookmarkletCustomConfig);
      this.updateBookmarklet(_bookmarklet.default._defaultBookmarklet);
    } else {
      OptionPage.show(bookmarkletCustomConfig);
      this.updateHostedBookmarklet();
    }
  }

  populateConfig() {
    this.auth.setPasswordButton(option);
  }

  populateDomain() {
    const domainsSelect = document.getElementById('domainSelect');
    const domainText = document.getElementById('domainText');
    const domainModeSelect = document.getElementById('domainModeSelect');
    const domainDisabledCheck = document.getElementById('domainDisabledCheck');
    const domainEnabledCheck = document.getElementById('domainEnabledCheck');
    const domainWordlistSelect = document.getElementById('domainWordlistSelect');
    const domainAudioWordlistSelect = document.getElementById('domainAudioWordlistSelect');
    const domainRemoveBtn = document.getElementById('domainRemove');
    const key = domainsSelect.value;
    domainText.value = key;
    let domainCfg;

    if (!key) {
      // New record
      OptionPage.disableBtn(domainRemoveBtn);
      domainCfg = Object.assign({}, _domain.default._domainCfgDefaults);
    } else {
      // Existing record
      OptionPage.enableBtn(domainRemoveBtn);
      domainCfg = this.cfg.domains[domainsSelect.value];
    }

    const domainKey = domainText.value.trim().toLowerCase();

    if (domainKey == '') {
      // No data
      domainModeSelect.selectedIndex = _constants.default.DOMAIN_MODES.NORMAL;
    } else {
      const domain = new _domain.default(domainKey, domainCfg);
      domainModeSelect.selectedIndex = domain.getModeIndex();
    }

    domainDisabledCheck.checked = domainCfg.disabled;
    domainEnabledCheck.checked = domainCfg.enabled;
    const wordlist = domainCfg.wordlist >= 0 ? domainCfg.wordlist + 1 : 0;
    const audioList = domainCfg.audioList >= 0 ? domainCfg.audioList + 1 : 0;
    domainWordlistSelect.selectedIndex = wordlist;
    domainAudioWordlistSelect.selectedIndex = audioList;
  }

  populateDomainPage() {
    const domainModeSelect = document.getElementById('domainModeSelect');
    const domainsSelect = document.getElementById('domainSelect');
    const domainText = document.getElementById('domainText');
    const mode = this.cfg.enabledDomainsOnly ? 'minimal' : 'normal';
    const domainMode = document.querySelector(`input[name=domainMode][value='${mode}']`);
    const wordlistContainer = document.getElementById('domainWordlistContainer');
    const audioWordlistContainer = document.getElementById('domainAudioWordlistContainer');
    domainMode.checked = true;
    const domainDisabledLabel = document.getElementById('domainDisabledLabel');
    const domainEnabledLabel = document.getElementById('domainEnabledLabel');
    OptionPage.hideInputError(domainText);
    (0, _helper.removeChildren)(domainsSelect);

    const domains = _domain.default.sortedKeys(this.cfg.domains);

    domains.unshift('Add, or update existing...');
    domains.forEach(domain => {
      const optionElement = document.createElement('option');
      optionElement.textContent = domain;
      optionElement.value = domain === domains[0] ? '' : domain;
      domainsSelect.appendChild(optionElement);
    });

    if (mode === 'minimal') {
      OptionPage.hide(domainDisabledLabel);
      OptionPage.show(domainEnabledLabel);
    } else {
      OptionPage.hide(domainEnabledLabel);
      OptionPage.show(domainDisabledLabel);
    }

    (0, _helper.dynamicList)(_constants.default.orderedArray(_constants.default.DOMAIN_MODES), domainModeSelect, true);

    if (this.cfg.wordlistsEnabled) {
      OptionPage.show(wordlistContainer);
      const domainWordlistSelect = document.getElementById('domainWordlistSelect');
      const domainAudioWordlistSelect = document.getElementById('domainAudioWordlistSelect');
      const wordlists = ['Default'].concat(_webConfig.default._allWordlists, this.cfg.wordlists);
      (0, _helper.dynamicList)(wordlists, domainWordlistSelect);

      if (this.cfg.muteAudio) {
        OptionPage.show(audioWordlistContainer);
        (0, _helper.dynamicList)(wordlists, domainAudioWordlistSelect);
      } else {
        OptionPage.hide(audioWordlistContainer);
      }
    } else {
      OptionPage.hide(wordlistContainer);
      OptionPage.hide(audioWordlistContainer);
    }

    this.populateDomain();
  }

  populateOptions() {
    this.populateSettings();
    this.populateWordPage();
    this.populateWhitelist();
    this.populateWordlists();
    this.populateDomainPage();
    this.populateAudio();
    this.populateConfig();
    this.populateStats();
    this.populateTest();
  }

  populateSettings() {
    this.updateFilterOptions(); // Settings

    const selectedFilter = document.getElementById(`filter${_constants.default.filterMethodName(this.cfg.filterMethod)}`);
    const showCounter = document.getElementById('showCounter');
    const showSummary = document.getElementById('showSummary');
    const showUpdateNotification = document.getElementById('showUpdateNotification');
    const filterWordList = document.getElementById('filterWordList');
    selectedFilter.checked = true;
    showCounter.checked = this.cfg.showCounter;
    showSummary.checked = this.cfg.showSummary;
    showUpdateNotification.checked = this.cfg.showUpdateNotification;
    filterWordList.checked = this.cfg.filterWordList; // Censor Settings

    const preserveFirst = document.getElementById('preserveFirst');
    const preserveLast = document.getElementById('preserveLast');
    const censorCharacterSelect = document.getElementById('censorCharacterSelect');
    const censorFixedLengthSelect = document.getElementById('censorFixedLengthSelect');
    preserveFirst.checked = this.cfg.preserveFirst;
    preserveLast.checked = this.cfg.preserveLast;
    censorCharacterSelect.value = this.cfg.censorCharacter;
    censorFixedLengthSelect.selectedIndex = this.cfg.censorFixedLength; // Substitution Settings

    const preserveCase = document.getElementById('preserveCase');
    const substitutionMark = document.getElementById('substitutionMark');
    preserveCase.checked = this.cfg.preserveCase;
    substitutionMark.checked = this.cfg.substitutionMark; // Default Settings

    const defaultWordMatchMethodSelect = document.getElementById('defaultWordMatchMethodSelect');
    const defaultWordRepeat = document.getElementById('defaultWordRepeat');
    const defaultWordSeparators = document.getElementById('defaultWordSeparators');
    defaultWordRepeat.checked = (0, _helper.numberToBoolean)(this.cfg.defaultWordRepeat);
    defaultWordSeparators.checked = (0, _helper.numberToBoolean)(this.cfg.defaultWordSeparators);
    const defaultWordSubstitution = document.getElementById('defaultWordSubstitutionText');
    defaultWordSubstitution.value = this.cfg.defaultSubstitution;
    (0, _helper.removeChildren)(defaultWordMatchMethodSelect);

    for (let i = 0; i < 3; i++) {
      // Skip Regex
      const optionElement = document.createElement('option');
      const matchMethodName = (0, _helper.upperCaseFirst)(_constants.default.matchMethodName(i));
      optionElement.value = matchMethodName;
      optionElement.textContent = matchMethodName;
      defaultWordMatchMethodSelect.appendChild(optionElement);
    }

    defaultWordMatchMethodSelect.selectedIndex = this.cfg.defaultWordMatchMethod;
  }

  async populateStats() {
    try {
      filter.buildWordlist(_constants.default.ALL_WORDS_WORDLIST_ID);
      const {
        stats
      } = await _webConfig.default.getLocalStoragePromise({
        stats: {
          mutes: 0,
          words: {}
        }
      }); // Prepare data (collect totals, add words without stats, sort output)

      let totalFiltered = 0;
      const allWords = filter.wordlists[_constants.default.ALL_WORDS_WORDLIST_ID].list;
      allWords.forEach(word => {
        const wordStats = stats.words[word];

        if (wordStats) {
          wordStats.total = wordStats.audio + wordStats.text;
          totalFiltered += wordStats.total;
        } else {
          stats.words[word] = {
            audio: 0,
            text: 0,
            total: 0
          };
        }
      });
      const alphaSortedWords = allWords.sort();
      const sortedWords = alphaSortedWords.sort((a, b) => stats.words[b].total - stats.words[a].total);
      const statsWordContainer = document.querySelector('div#statsWordContainer');
      const statsWordTable = statsWordContainer.querySelector('table#statsWordTable'); // Table body

      const tBody = document.createElement('tbody');
      sortedWords.forEach(word => {
        const wordStats = stats.words[word];
        const row = tBody.insertRow();
        const wordCell = row.insertCell(0);
        wordCell.classList.add('w3-tooltip');
        const tooltipSpan = document.createElement('span');
        tooltipSpan.classList.add('statsTooltip', 'w3-tag', 'w3-text');
        tooltipSpan.textContent = word;
        const wordSpan = document.createElement('span');
        wordSpan.textContent = filter.replaceText(word, _constants.default.ALL_WORDS_WORDLIST_ID, null);
        wordCell.appendChild(tooltipSpan);
        wordCell.appendChild(wordSpan);
        const textCell = row.insertCell(1);
        textCell.textContent = (0, _helper.numberWithCommas)(wordStats.text);
        const audioCell = row.insertCell(2);
        audioCell.textContent = (0, _helper.numberWithCommas)(wordStats.audio);
        const totalCell = row.insertCell(3);
        totalCell.textContent = (0, _helper.numberWithCommas)(wordStats.total);
      });
      const oldTBody = statsWordTable.tBodies[0];
      statsWordTable.replaceChild(tBody, oldTBody); // Options

      const collectStats = document.getElementById('collectStats');
      collectStats.checked = this.cfg.collectStats; // Summary

      const statsSummaryTotal = document.querySelector('table#statsSummaryTable td#statsSummaryTotal');
      statsSummaryTotal.textContent = (0, _helper.numberWithCommas)(totalFiltered);
      const statsSummaryMutes = document.querySelector('table#statsSummaryTable td#statsSummaryMutes');
      statsSummaryMutes.textContent = (0, _helper.numberWithCommas)(stats.mutes);
      const statsSummarySince = document.querySelector('table#statsSummaryTable td#statsSummarySince');
      statsSummarySince.textContent = stats.startedAt ? new Date(stats.startedAt).toLocaleString() : '';
    } catch (e) {
      logger.warn('Failed to populate stats.', e);
      OptionPage.showErrorModal(`Failed to populate stats. [Error: ${e}]`);
    }
  }

  populateTest() {
    const testText = document.getElementById('testText');
    const filteredTestText = document.getElementById('filteredTestText');

    if (testText.value === '') {
      filteredTestText.textContent = 'Enter some text above to test the filter...';
    } else {
      if (option.cfg.filterMethod === _constants.default.FILTER_METHODS.OFF) {
        filteredTestText.textContent = testText.value;
      } else {
        filteredTestText.textContent = filter.replaceText(testText.value, filter.cfg.wordlistId, null);
      }
    }
  }

  populateWhitelist() {
    const regExp = RegExp(' [*]$');
    const sensitiveList = filter.cfg.wordWhitelist.map(item => {
      return item + ' *';
    });
    const list = [].concat(sensitiveList, filter.cfg.iWordWhitelist).sort();
    const whitelist = document.getElementById('whitelist');
    (0, _helper.removeChildren)(whitelist);
    list.unshift('Add, or update existing...');
    list.forEach(item => {
      const optionElement = document.createElement('option');
      optionElement.value = item === list[0] ? '' : item.replace(regExp, '');
      optionElement.dataset.sensitive = regExp.test(item).toString();
      optionElement.textContent = item;
      whitelist.appendChild(optionElement);
    });
    this.populateWhitelistWord();
  }

  populateWhitelistWord() {
    const whitelist = document.getElementById('whitelist');
    const whitelistRemove = document.getElementById('whitelistRemove');
    const whitelistText = document.getElementById('whitelistText');
    const selected = whitelist.selectedOptions[0];

    if (selected.value == '') {
      // New word
      whitelistText.value = '';
      OptionPage.disableBtn(whitelistRemove); // Default to case-insensitive

      const whitelistCase = document.getElementById('whitelistInsensitive');
      whitelistCase.checked = true;
    } else {
      whitelistText.value = selected.value;
      const caseId = selected.dataset.sensitive === 'true' ? 'whitelistSensitive' : 'whitelistInsensitive';
      const whitelistCase = document.getElementById(caseId);
      whitelistCase.checked = true;
      OptionPage.enableBtn(whitelistRemove);
    }
  }

  populateWord() {
    const wordList = document.getElementById('wordList');
    const wordText = document.getElementById('wordText');
    const wordMatchRepeated = document.getElementById('wordMatchRepeated');
    const wordMatchSeparators = document.getElementById('wordMatchSeparators');
    const substitutionText = document.getElementById('substitutionText');
    const substitutionCase = document.getElementById('substitutionCase');
    const wordRemove = document.getElementById('wordRemove');
    const word = wordList.value;
    const wordWordlistDiv = document.getElementById('wordWordlistDiv');
    const wordlistSelections = document.querySelectorAll('div#wordlistSelections input');
    OptionPage.hideInputError(wordText);
    OptionPage.hideInputError(substitutionText);

    if (word == '') {
      // New word
      wordText.value = '';
      OptionPage.disableBtn(wordRemove);
      const selectedMatchMethod = document.getElementById(`wordMatch${(0, _helper.upperCaseFirst)(_constants.default.matchMethodName(this.cfg.defaultWordMatchMethod))}`);
      selectedMatchMethod.checked = true;
      wordMatchRepeated.checked = (0, _helper.numberToBoolean)(this.cfg.defaultWordRepeat);
      wordMatchSeparators.checked = (0, _helper.numberToBoolean)(this.cfg.defaultWordSeparators);
      substitutionText.value = '';
      substitutionCase.checked = false;
      wordlistSelections.forEach((wordlist, index) => {
        wordlist.checked = index == this.cfg.wordlistId - 1 || this.cfg.muteAudio && index == this.cfg.audioWordlistId - 1;
      });
    } else {
      // Existing word
      OptionPage.enableBtn(wordRemove);
      const wordCfg = this.cfg.words[word];
      wordText.value = word;
      const selectedMatchMethod = document.getElementById(`wordMatch${(0, _helper.upperCaseFirst)(_constants.default.matchMethodName(wordCfg.matchMethod))}`);
      selectedMatchMethod.checked = true;
      wordMatchRepeated.checked = (0, _helper.numberToBoolean)(wordCfg.repeat);
      wordMatchSeparators.checked = (0, _helper.numberToBoolean)(wordCfg.separators === undefined ? this.cfg.defaultWordSeparators : wordCfg.separators);
      substitutionText.value = wordCfg.sub;
      substitutionCase.checked = (0, _helper.numberToBoolean)(wordCfg.case);
      wordlistSelections.forEach((wordlist, index) => {
        wordlist.checked = wordCfg.lists.includes(index + 1);
      });
    }

    if (this.cfg.wordlistsEnabled) {
      OptionPage.show(wordWordlistDiv);
    } else {
      OptionPage.hide(wordWordlistDiv);
    }
  }

  populateWordlist() {
    const wordlistSelect = document.getElementById('wordlistSelect');
    const wordlistText = document.getElementById('wordlistText');
    wordlistText.value = wordlistSelect.value;
  }

  populateWordlists(selectedIndex = 0) {
    const wordlistsEnabledInput = document.getElementById('wordlistsEnabled');
    const wordlistContainer = document.getElementById('wordlistContainer');
    wordlistsEnabledInput.checked = this.cfg.wordlistsEnabled;

    if (this.cfg.wordlistsEnabled) {
      const wordlistSelect = document.getElementById('wordlistSelect');
      const textWordlistSelect = document.getElementById('textWordlistSelect');
      const audioWordlistDiv = document.getElementById('audioWordlistDiv');
      const audioWordlistSelect = document.getElementById('audioWordlistSelect');
      (0, _helper.dynamicList)(this.cfg.wordlists, wordlistSelect);
      (0, _helper.dynamicList)(_webConfig.default._allWordlists.concat(this.cfg.wordlists), textWordlistSelect);
      wordlistSelect.selectedIndex = selectedIndex;
      textWordlistSelect.selectedIndex = this.cfg.wordlistId;

      if (this.cfg.muteAudio) {
        (0, _helper.dynamicList)(_webConfig.default._allWordlists.concat(this.cfg.wordlists), audioWordlistSelect);
        audioWordlistSelect.selectedIndex = this.cfg.audioWordlistId;
        OptionPage.show(audioWordlistDiv);
      } else {
        OptionPage.hide(audioWordlistDiv);
      }

      OptionPage.show(wordlistContainer);
      this.populateWordlist();
    } else {
      OptionPage.hide(wordlistContainer);
    }
  }

  populateWordPage() {
    let wordlistFilter = filter;
    const selections = document.getElementById('wordlistSelections');
    const wordsSelect = document.getElementById('wordList');
    (0, _helper.removeChildren)(wordsSelect); // Workaround for remove filter method

    if (filter.cfg.filterWordList && filter.cfg.filterMethod === 2) {
      wordlistFilter = new _filter.default(); // Works because we are only changing a native value (filterMethod: number)

      wordlistFilter.cfg = new _webConfig.default(Object.assign({}, this.cfg, {
        filterMethod: 0
      }));
      wordlistFilter.init();
    }

    const words = Object.keys(this.cfg.words).sort();
    words.unshift('Add, or update existing...');
    words.forEach(word => {
      let filteredWord = word;

      if (word != words[0] && wordlistFilter.cfg.filterWordList) {
        if (wordlistFilter.cfg.words[word].matchMethod === _constants.default.MATCH_METHODS.REGEX) {
          // Regexp
          filteredWord = wordlistFilter.cfg.words[word].sub || wordlistFilter.cfg.defaultSubstitution;
        } else {
          filteredWord = wordlistFilter.replaceText(word, _constants.default.ALL_WORDS_WORDLIST_ID, null);
        }
      }

      const optionElement = document.createElement('option');
      optionElement.value = word === words[0] ? '' : word;
      optionElement.dataset.filtered = filteredWord;
      optionElement.textContent = filteredWord;
      wordsSelect.appendChild(optionElement);
    }); // Dynamically create the wordlist selection checkboxes

    if (selections.hasChildNodes()) {
      (0, _helper.removeChildren)(selections);
    }

    this.cfg.wordlists.forEach((list, index) => {
      const div = document.createElement('div');
      const label = document.createElement('label');
      const input = document.createElement('input');
      const name = document.createTextNode(list);
      input.type = 'checkbox';
      input.classList.add('w3-check');
      input.name = 'wordlistSelection';
      input.value = index.toString();
      label.appendChild(input);
      label.appendChild(name);
      div.appendChild(label);
      selections.appendChild(div);
    });
    this.populateWord();
  }

  removeAllWords(evt) {
    this.cfg.words = {};
    const wordList = document.getElementById('wordList');
    wordList.selectedIndex = 0;
    filter.rebuildWordlists();
    this.populateOptions();
  }

  async removeDomain(event) {
    const domainsSelect = document.getElementById('domainSelect');

    if (domainsSelect.value) {
      delete this.cfg.domains[domainsSelect.value];

      try {
        await this.cfg.save('domains');
        this.populateDomainPage();
      } catch (e) {
        logger.warn(`Failed to remove domain '${domainsSelect.value}'.`, e);
        OptionPage.showErrorModal(`Failed to remove domain '${domainsSelect.value}'. [Error: ${e}]`);
        return false;
      }
    }
  }

  async removeWhitelist(evt) {
    const whitelist = document.getElementById('whitelist');
    const selected = whitelist.selectedOptions[0];
    const originalWord = selected.value;
    const originalCase = selected.dataset.sensitive === 'true' ? 'sensitive' : 'insensitive';
    const originalListName = originalCase === 'sensitive' ? 'wordWhitelist' : 'iWordWhitelist';
    this.cfg[originalListName] = (0, _helper.removeFromArray)(this.cfg[originalListName], originalWord);

    try {
      await this.cfg.save(originalListName);
      filter.init();
      this.populateOptions();
    } catch (e) {
      logger.warn(`Failed to remove '${originalWord} from whitelist.`, e);
      OptionPage.showErrorModal(`Failed to remove '${originalWord} from whitelist. [Error: ${e}]`);
      return false;
    }
  }

  async removeWord(evt) {
    if (evt.target.classList.contains('disabled')) return false;
    const wordList = document.getElementById('wordList');
    const word = wordList.value;
    let result = this.cfg.removeWord(word);

    if (result) {
      result = await this.saveOptions(evt);

      if (result) {
        // Update states and Reset word form
        wordList.selectedIndex = 0;
        filter.rebuildWordlists();
        this.populateOptions();
      }
    }
  }

  async renameWordlist() {
    const wordlistSelect = document.getElementById('wordlistSelect');
    const wordlistText = document.getElementById('wordlistText');
    const name = wordlistText.value.trim();
    const index = wordlistSelect.selectedIndex;

    if (wordlistText.checkValidity()) {
      // Make sure there are no duplicates
      if (this.cfg.wordlists.includes(name)) {
        OptionPage.showInputError(wordlistText, 'Please enter a unique name.');
        return false;
      }

      this.cfg.wordlists[index] = name;

      if (await this.saveProp('wordlists')) {
        this.populateWordlists(index);
        this.populateWordPage();
      } else {
        OptionPage.showErrorModal('Failed to save name.');
      }
    } else {
      OptionPage.showInputError(wordlistText, 'Please enter a valid name.');
    }
  }

  async restoreDefaults(evt, silent = false) {
    try {
      await this.cfg.reset();
      if (!silent) OptionPage.showStatusModal('Default settings restored.');
      this.init();
      return true;
    } catch (e) {
      logger.warn('Error restoring defaults.', e);
      OptionPage.showErrorModal(`Error restoring defaults. [Error: ${e}]`);
      return false;
    }
  }

  async saveCustomAudioSites() {
    const customAudioSitesTextArea = document.getElementById('customAudioSitesText');

    try {
      const text = customAudioSitesTextArea.value;
      this.cfg.customAudioSites = text == '' ? null : JSON.parse(text);

      if (await this.saveProp('customAudioSites')) {
        customAudioSitesTextArea.value = this.cfg.customAudioSites ? JSON.stringify(this.cfg.customAudioSites, null, 2) : '';
        OptionPage.showStatusModal('Custom Audio Sites saved.');
      }
    } catch (e) {
      OptionPage.showErrorModal('Failed to save custom audio sites. Please make sure it is valid JSON.');
    }
  }

  async saveDomain(event) {
    const domainsSelect = document.getElementById('domainSelect');
    const domainText = document.getElementById('domainText');
    const domainModeSelect = document.getElementById('domainModeSelect');
    const domainDisabledCheck = document.getElementById('domainDisabledCheck');
    const domainEnabledCheck = document.getElementById('domainEnabledCheck');
    const domainWordlistSelect = document.getElementById('domainWordlistSelect');
    const domainAudioWordlistSelect = document.getElementById('domainAudioWordlistSelect');
    const originalKey = domainsSelect.value;
    const newKey = domainText.value.trim().toLowerCase();

    if (newKey == '') {
      // No data
      OptionPage.showInputError(domainText, 'Please enter a value.');
      return false;
    }

    if (domainText.checkValidity()) {
      OptionPage.hideInputError(domainText);

      if (newKey != originalKey) {
        delete this.cfg.domains[originalKey];
      } // URL changed: remove old entry


      const wordlist = domainWordlistSelect.selectedIndex > 0 ? domainWordlistSelect.selectedIndex - 1 : undefined;
      const audioList = domainAudioWordlistSelect.selectedIndex > 0 ? domainAudioWordlistSelect.selectedIndex - 1 : undefined;
      const newDomainCfg = {
        audioList: audioList,
        disabled: domainDisabledCheck.checked,
        enabled: domainEnabledCheck.checked,
        wordlist: wordlist
      };
      const domain = new _domain.default(newKey, newDomainCfg);
      domain.updateFromModeIndex(domainModeSelect.selectedIndex);
      const error = await domain.save(this.cfg);

      if (error) {
        OptionPage.showErrorModal();
        return false;
      } else {
        this.populateDomainPage();
      }
    } else {
      OptionPage.showInputError(domainText, 'Valid domain example: google.com or www.google.com');
      return false;
    }
  }

  async saveOptions(evt) {
    // Gather current settings
    const censorCharacterSelect = document.getElementById('censorCharacterSelect');
    const censorFixedLengthSelect = document.getElementById('censorFixedLengthSelect');
    const defaultWordMatchMethodSelect = document.getElementById('defaultWordMatchMethodSelect');
    const defaultWordRepeat = document.getElementById('defaultWordRepeat');
    const defaultWordSeparators = document.getElementById('defaultWordSeparators');
    const preserveCase = document.getElementById('preserveCase');
    const preserveFirst = document.getElementById('preserveFirst');
    const preserveLast = document.getElementById('preserveLast');
    const showCounter = document.getElementById('showCounter');
    const showSummary = document.getElementById('showSummary');
    const showUpdateNotification = document.getElementById('showUpdateNotification');
    const filterWordList = document.getElementById('filterWordList');
    const substitutionMark = document.getElementById('substitutionMark');
    const defaultWordSubstitution = document.getElementById('defaultWordSubstitutionText');
    const domainMode = document.querySelector('input[name="domainMode"]:checked');
    const muteAudioInput = document.getElementById('muteAudio');
    const fillerAudioSelect = document.getElementById('fillerAudioSelect');
    const muteAudioOnlyInput = document.getElementById('muteAudioOnly');
    const muteCueRequireShowingInput = document.getElementById('muteCueRequireShowing');
    const muteMethodInput = document.querySelector('input[name="audioMuteMethod"]:checked');
    const showSubtitlesInput = document.querySelector('input[name="audioShowSubtitles"]:checked');
    const wordlistsEnabledInput = document.getElementById('wordlistsEnabled');
    const collectStats = document.getElementById('collectStats');
    this.cfg.censorCharacter = censorCharacterSelect.value;
    this.cfg.censorFixedLength = censorFixedLengthSelect.selectedIndex;
    this.cfg.defaultWordMatchMethod = defaultWordMatchMethodSelect.selectedIndex;
    this.cfg.defaultWordRepeat = (0, _helper.booleanToNumber)(defaultWordRepeat.checked);
    this.cfg.defaultWordSeparators = (0, _helper.booleanToNumber)(defaultWordSeparators.checked);
    this.cfg.preserveCase = preserveCase.checked;
    this.cfg.preserveFirst = preserveFirst.checked;
    this.cfg.preserveLast = preserveLast.checked;
    this.cfg.showCounter = showCounter.checked;
    this.cfg.showSummary = showSummary.checked;
    this.cfg.showUpdateNotification = showUpdateNotification.checked;
    this.cfg.filterWordList = filterWordList.checked;
    this.cfg.substitutionMark = substitutionMark.checked;
    this.cfg.defaultSubstitution = defaultWordSubstitution.value.trim().toLowerCase();
    this.cfg.enabledDomainsOnly = domainMode.value === 'minimal';
    this.cfg.muteAudio = muteAudioInput.checked;
    this.cfg.fillerAudio = fillerAudioSelect.value;
    this.cfg.muteAudioOnly = muteAudioOnlyInput.checked;
    this.cfg.muteCueRequireShowing = muteCueRequireShowingInput.checked;
    this.cfg.muteMethod = parseInt(muteMethodInput.value);
    this.cfg.showSubtitles = parseInt(showSubtitlesInput.value);
    this.cfg.wordlistsEnabled = wordlistsEnabledInput.checked;
    this.cfg.collectStats = collectStats.checked; // Save settings

    try {
      await this.cfg.save();
      this.init();
      return true;
    } catch (e) {
      logger.warn('Settings not saved! Please try again.', e);
      OptionPage.showErrorModal(`Settings not saved! Please try again. [Error: ${e}]`);
      return false;
    }
  }

  async saveProp(prop) {
    try {
      await this.cfg.save(prop);
      return true;
    } catch (e) {
      logger.warn(`Failed to save '${prop}'.`, e);
      OptionPage.showErrorModal(`Failed to save '${prop}'. [Error: ${e}]`);
      return false;
    }
  }

  async saveWhitelist(evt) {
    const whitelist = document.getElementById('whitelist');
    const selected = whitelist.selectedOptions[0];
    const selectedCase = document.querySelector('input[name="whitelistCase"]:checked');
    const whitelistText = document.getElementById('whitelistText');
    const propsToSave = [];
    const newCase = selectedCase.value;
    const newWord = newCase === 'sensitive' ? whitelistText.value : whitelistText.value.toLowerCase();
    const newListName = newCase === 'sensitive' ? 'wordWhitelist' : 'iWordWhitelist';

    if (whitelistText.value === '') {
      OptionPage.showInputError(whitelistText, 'Please enter a valid word/phrase.');
      return false;
    }

    if (this.cfg[newListName].indexOf(newWord) > -1) {
      OptionPage.showInputError(whitelistText, 'Already whitelisted.');
      return false;
    }

    if (whitelistText.checkValidity()) {
      if (selected.value === '') {
        // New word
        this.cfg[newListName].push(newWord);
        propsToSave.push(newListName);
      } else {
        // Modifying existing word
        const originalWord = selected.value;
        const originalCase = selected.dataset.sensitive === 'true' ? 'sensitive' : 'insensitive';
        const originalListName = originalCase === 'sensitive' ? 'wordWhitelist' : 'iWordWhitelist';

        if (originalWord != newWord || originalCase != newCase) {
          this.cfg[originalListName] = (0, _helper.removeFromArray)(this.cfg[originalListName], originalWord);
          this.cfg[newListName].push(newWord);
          originalListName === newListName ? propsToSave.push(newListName) : propsToSave.push(originalListName, newListName);
        }
      }

      if (propsToSave.length) {
        propsToSave.forEach(prop => {
          this.cfg[prop] = this.cfg[prop].sort();
        });

        try {
          await this.cfg.save(propsToSave);
          filter.init();
          this.populateOptions();
        } catch (e) {
          logger.warn('Failed to update whitelist.', e);
          OptionPage.showErrorModal(`Failed to update whitelist. [Error: ${e}]`);
          return false;
        }
      }
    } else {
      OptionPage.showInputError(whitelistText, 'Please enter a valid word/phrase.');
    }
  }

  async saveWord(evt) {
    const wordList = document.getElementById('wordList');
    const wordText = document.getElementById('wordText');
    const wordMatchRepeated = document.getElementById('wordMatchRepeated');
    const wordMatchSeparators = document.getElementById('wordMatchSeparators');
    const substitutionText = document.getElementById('substitutionText');
    const substitutionCase = document.getElementById('substitutionCase');
    const selectedMatchMethod = document.querySelector('input[name="wordMatchMethod"]:checked');
    const wordlistSelectionsInput = document.querySelectorAll('div#wordlistSelections input');
    let added = true;
    let word = wordText.value.trim();
    const subCase = (0, _helper.booleanToNumber)(substitutionCase.checked);
    const sub = (0, _helper.numberToBoolean)(subCase) ? substitutionText.value.trim() : substitutionText.value.trim().toLowerCase();
    const matchMethod = _constants.default.MATCH_METHODS[selectedMatchMethod.value];

    if (matchMethod !== _constants.default.MATCH_METHODS.REGEX) {
      word = word.toLowerCase();
    }

    if (word == '') {
      OptionPage.showInputError(wordText, 'Please enter a valid word/phrase.');
      return false;
    } // Make sure word and substitution are different


    if (word == sub) {
      OptionPage.showInputError(substitutionText, 'Word and substitution must be different.');
      return false;
    }

    if (wordText.checkValidity()) {
      const lists = [];
      wordlistSelectionsInput.forEach((wordlist, index) => {
        if (wordlist.checked) {
          lists.push(index + 1);
        }
      });
      const wordOptions = {
        case: subCase,
        lists: lists,
        matchMethod: matchMethod,
        repeat: (0, _helper.booleanToNumber)(wordMatchRepeated.checked),
        separators: (0, _helper.booleanToNumber)(wordMatchSeparators.checked),
        sub: sub
      }; // Check for endless substitution loop

      if (wordOptions.matchMethod != _constants.default.MATCH_METHODS.REGEX) {
        const subFilter = new _filter.default();
        const words = {};
        words[word] = wordOptions;
        subFilter.cfg = new _webConfig.default(Object.assign({}, this.cfg, {
          filterMethod: _constants.default.FILTER_METHODS.SUBSTITUTE
        }, {
          words: words
        }));
        subFilter.init();
        const first = subFilter.replaceTextResult(word, _constants.default.ALL_WORDS_WORDLIST_ID, null);
        const second = subFilter.replaceTextResult(first.filtered, _constants.default.ALL_WORDS_WORDLIST_ID, null);

        if (first.filtered != second.filtered) {
          OptionPage.showInputError(substitutionText, "Substitution can't contain word (causes an endless loop).");
          return false;
        }
      } // Test for a valid Regex


      if (wordOptions.matchMethod === _constants.default.MATCH_METHODS.REGEX) {
        const subFilter = new _filter.default();
        const words = {};
        words[word] = wordOptions;
        subFilter.cfg = new _webConfig.default(Object.assign({}, this.cfg, {
          words: words
        }));
        subFilter.init();

        if (subFilter.wordlists[subFilter.wordlistId].regExps.length === 0) {
          OptionPage.showInputError(wordText, 'Invalid Regex.');
          return false;
        }
      }

      if (wordList.value === '') {
        // New record
        logger.info(`Adding new word: '${word}'.`, wordOptions);
        added = this.cfg.addWord(word, wordOptions);
      } else {
        // Updating existing record
        const originalWord = wordList.value;

        if (originalWord == word) {
          // Word options changed
          logger.info(`Modifying existing word options for '${word}'.`, wordOptions);
          this.cfg.words[word] = wordOptions;
        } else {
          // Existing word modified
          logger.info(`Rename existing word '${originalWord}' to '${word}'.`, wordOptions);
          added = this.cfg.addWord(word, wordOptions);

          if (added) {
            delete this.cfg.words[originalWord];
          } else {
            OptionPage.showInputError(wordText, `'${word}' already in list.`);
          }
        }
      }

      if (added) {
        try {
          await this.saveOptions(evt); // Update states and Reset word form

          filter.rebuildWordlists();
          this.populateOptions();
        } catch (e) {
          logger.warn(`Failed to update word '${word}'.`, e);
          OptionPage.showErrorModal(`Failed to update word '${word}'. [Error: ${e}]`);
          this.cfg.removeWord(word);
          return false;
        }
      } else {
        OptionPage.showInputError(wordText, `'${word}' already in list.`);
      }
    } else {
      OptionPage.showInputError(wordText, 'Please enter a valid word/phrase.');
    }
  }

  async selectFilterMethod(evt) {
    this.cfg.filterMethod = _constants.default.FILTER_METHODS[evt.target.value];

    if (await this.saveProp('filterMethod')) {
      filter.rebuildWordlists();
      this.populateOptions();
    }
  }

  async setDefaultWordlist(element) {
    const prop = element.id === 'textWordlistSelect' ? 'wordlistId' : 'audioWordlistId';
    this.cfg[prop] = element.selectedIndex;

    if (!(await this.saveProp(prop))) {
      OptionPage.showErrorModal('Failed to update defult wordlist.');
      return false;
    }

    this.populateOptions();
  }

  showBulkWordEditor() {
    const modalId = 'bulkWordEditorModal';
    const title = document.querySelector(`#${modalId} h5.modalTitle`);
    const tableContainer = document.querySelector(`#${modalId} div.tableContainer`);
    const table = tableContainer.querySelector('table');
    title.textContent = 'Bulk Word Editor';

    if (table.tHead.rows.length === 0) {
      table.tHead.appendChild(this.bulkWordEditorHeaderRow());
    }

    const tBody = table.querySelector('tbody');
    (0, _helper.removeChildren)(tBody); // Add current words to the table

    const wordKeys = Object.keys(this.cfg.words);

    if (wordKeys.length === 0) {
      this.bulkEditorAddRow();
    } else {
      wordKeys.forEach(key => {
        this.bulkEditorAddRow(key, this.cfg.words[key]);
      });
    }

    tableContainer.querySelectorAll('th input.wordlistHeader').forEach(el => {
      el.addEventListener('click', e => {
        this.bulkEditorWordlistCheckbox(e);
      });
    });
    OptionPage.openModal(modalId);
  }

  showSupportedAudioSiteConfig() {
    const select = document.querySelector('#supportedAudioSitesModal select#siteSelect');
    const textArea = document.querySelector('#supportedAudioSitesModal div#modalContentRight textarea');
    const config = {};
    config[select.value] = _webAudioSites.default.sites[select.value];
    textArea.textContent = JSON.stringify(config, null, 2);
  }

  showSupportedAudioSites() {
    const title = document.querySelector('#supportedAudioSitesModal h5.modalTitle');
    title.textContent = 'Supported Audio Sites';
    const contentLeft = document.querySelector('#supportedAudioSitesModal div#modalContentLeft');
    const select = contentLeft.querySelector('#siteSelect');
    (0, _helper.removeChildren)(select);
    const sortedSites = Object.keys(_webAudioSites.default.sites).sort((a, b) => {
      const domainA = a.match(/\w*\.\w*$/)[0];
      const domainB = b.match(/\w*\.\w*$/)[0];
      return domainA < domainB ? -1 : domainA > domainB ? 1 : 0;
    });
    sortedSites.forEach(site => {
      const optionElement = document.createElement('option');
      optionElement.value = site;
      optionElement.textContent = site;
      select.appendChild(optionElement);
    });
    this.showSupportedAudioSiteConfig();
    OptionPage.openModal('supportedAudioSitesModal');
  }

  async statsReset() {
    try {
      await _webConfig.default.removeLocalStoragePromise('stats');
      this.populateStats();
    } catch (e) {
      logger.warn('Failed to reset stats.', e);
      OptionPage.showErrorModal(`Failed to reset stats. [Error: ${e}]`);
    }
  }

  switchPage(evt) {
    const currentTab = document.querySelector(`#menu a.${OptionPage.activeClass}`);
    const newTab = evt.target;
    currentTab.classList.remove(OptionPage.activeClass);
    newTab.classList.add(OptionPage.activeClass);
    const currentPage = document.getElementById(currentTab.textContent.toLowerCase() + 'Page');
    const newPage = document.getElementById(newTab.textContent.toLowerCase() + 'Page');
    OptionPage.hide(currentPage);
    OptionPage.show(newPage);

    switch (newTab.textContent.toLowerCase()) {
      case 'test':
        document.getElementById('testText').focus();
        break;
    }
  }

  async toggleTheme() {
    this.cfg.darkMode = !this.cfg.darkMode;
    await this.cfg.save('darkMode');
    this.applyTheme();
  }

  updateBookmarklet(url) {
    const bookmarkletLink = document.getElementById('bookmarkletLink');
    const bookmarklet = new _bookmarklet.default(url);
    bookmarkletLink.href = bookmarklet.destination();
    OptionPage.enableBtn(bookmarkletLink);
  }

  updateHostedBookmarklet() {
    const bookmarkletLink = document.getElementById('bookmarkletLink');
    const bookmarkletHostedURLInput = document.getElementById('bookmarkletHostedURL');
    OptionPage.hideInputError(bookmarkletHostedURLInput);

    if (bookmarkletHostedURLInput.checkValidity()) {
      this.updateBookmarklet(bookmarkletHostedURLInput.value);
    } else {
      if (bookmarkletHostedURLInput.value !== '') {
        OptionPage.showInputError(bookmarkletHostedURLInput, 'Please enter a valid URL.');
      }

      bookmarkletLink.href = '#0';
      OptionPage.disableBtn(bookmarkletLink);
    }
  }

  updateFilterOptions() {
    // Show/hide options as needed
    switch (this.cfg.filterMethod) {
      case _constants.default.FILTER_METHODS.CENSOR:
        OptionPage.show(document.getElementById('censorSettings'));
        OptionPage.hide(document.getElementById('substitutionSettings'));
        OptionPage.hide(document.getElementById('wordSubstitution'));
        break;

      case _constants.default.FILTER_METHODS.SUBSTITUTE:
        OptionPage.hide(document.getElementById('censorSettings'));
        OptionPage.show(document.getElementById('substitutionSettings'));
        OptionPage.show(document.getElementById('wordSubstitution'));
        break;

      case _constants.default.FILTER_METHODS.OFF:
      case _constants.default.FILTER_METHODS.REMOVE:
        OptionPage.hide(document.getElementById('censorSettings'));
        OptionPage.hide(document.getElementById('substitutionSettings'));
        OptionPage.hide(document.getElementById('wordSubstitution'));
        break;
    }
  }

  updateItemList(evt, input, attr, invalidMessage, original = '') {
    const item = input.value.trim().toLowerCase();

    if (item == '') {
      // No data
      OptionPage.showInputError(input, 'Please enter a value.');
      return false;
    } else {
      if (input.checkValidity()) {
        OptionPage.hideInputError(input);

        if (!this.cfg[attr].includes(item)) {
          if (original != '' && this.cfg[attr].includes(original)) {
            // Update existing record (remove it before adding the new record)
            this.cfg[attr].splice(this.cfg[attr].indexOf(original), 1);
          } // Save new record


          this.cfg[attr].push(item);
          this.cfg[attr] = this.cfg[attr].sort();
          return true;
        } else {
          OptionPage.showInputError(input, 'Already in list.');
          return false;
        }
      } else {
        OptionPage.showInputError(input, invalidMessage);
        return false;
      }
    }
  }

  async updateYouTubeAutoLimits(target) {
    OptionPage.hideInputError(target);

    if (target.checkValidity()) {
      const updateMin = target.id === 'audioYouTubeAutoSubsMin';
      const min = parseFloat(updateMin ? target.value : document.getElementById('audioYouTubeAutoSubsMin').value);
      const max = parseFloat(updateMin ? document.getElementById('audioYouTubeAutoSubsMax').value : target.value);

      if (min != 0 && max != 0 && min > max) {
        OptionPage.showInputError(target, 'Min must be less than max.');
      } else {
        const prop = updateMin ? 'youTubeAutoSubsMin' : 'youTubeAutoSubsMax';
        this.cfg[prop] = parseFloat(target.value);
        await this.saveProp(prop);
      }
    } else {
      OptionPage.showInputError(target, 'Please enter a valid number of seconds.');
    }
  }

}

exports.default = OptionPage;

_defineProperty(OptionPage, "activeClass", 'w3-flat-belize-hole');

_defineProperty(OptionPage, "themeButtonSelectors", ['div.themes > div.moon', 'div.themes > div.sun']);

_defineProperty(OptionPage, "themeElementSelectors", ['body', 'div#page', '#bulkWordEditorModal > div', '#confirmModal > div', '#passwordModal > div', '#statusModal > div', '#supportedAudioSitesModal > div']);

const filter = new _filter.default();
const option = new OptionPage(); ////
// Events
// Functions

function bulkEditorSave(e) {
  option.bulkEditorSave();
}

function importConfig(e) {
  option.importConfig(e);
}

function removeAllWords(e) {
  option.removeAllWords(e);
}

function restoreDefaults(e) {
  option.restoreDefaults(e);
}

function setPassword(e) {
  option.auth.setPassword(option);
}

function statsReset(e) {
  option.statsReset();
} // Add event listeners to DOM


window.addEventListener('load', e => {
  option.init();
});
document.querySelectorAll('#menu a').forEach(el => {
  el.addEventListener('click', e => {
    option.switchPage(e);
  });
}); // Modals

document.getElementById('submitPassword').addEventListener('click', e => {
  option.auth.authenticate(e);
});
document.getElementById('confirmModalBackup').addEventListener('click', e => {
  option.confirmModalBackup();
});
document.getElementById('confirmModalOK').addEventListener('click', e => {
  OptionPage.closeModal('confirmModal');
});
document.getElementById('confirmModalCancel').addEventListener('click', e => {
  OptionPage.closeModal('confirmModal');
});
document.getElementById('statusModalOK').addEventListener('click', e => {
  OptionPage.closeModal('statusModal');
});
document.querySelector('#supportedAudioSitesModal #siteSelect').addEventListener('change', e => {
  option.showSupportedAudioSiteConfig();
});
document.querySelector('#supportedAudioSitesModal button.modalOK').addEventListener('click', e => {
  OptionPage.closeModal('supportedAudioSitesModal');
});
document.querySelector('#bulkWordEditorModal button.modalAddWord').addEventListener('click', e => {
  option.bulkEditorAddRow();
});
document.querySelector('#bulkWordEditorModal button.modalBulkAddWords').addEventListener('click', e => {
  option.bulkEditorAddWords();
});
document.querySelector('#bulkWordEditorModal button.modalCancel').addEventListener('click', e => {
  OptionPage.closeModal('bulkWordEditorModal');
});
document.querySelector('#bulkWordEditorModal button.modalSave').addEventListener('click', e => {
  option.confirm(e, 'bulkEditorSave');
}); // Settings

document.querySelectorAll('#filterMethod input').forEach(el => {
  el.addEventListener('click', e => {
    option.selectFilterMethod(e);
  });
});
document.getElementById('censorCharacterSelect').addEventListener('change', e => {
  option.saveOptions(e);
});
document.getElementById('censorFixedLengthSelect').addEventListener('change', e => {
  option.saveOptions(e);
});
document.getElementById('defaultWordMatchMethodSelect').addEventListener('change', e => {
  option.saveOptions(e);
});
document.getElementById('defaultWordRepeat').addEventListener('click', e => {
  option.saveOptions(e);
});
document.getElementById('defaultWordSeparators').addEventListener('click', e => {
  option.saveOptions(e);
});
document.getElementById('preserveCase').addEventListener('click', e => {
  option.saveOptions(e);
});
document.getElementById('preserveFirst').addEventListener('click', e => {
  option.saveOptions(e);
});
document.getElementById('preserveLast').addEventListener('click', e => {
  option.saveOptions(e);
});
document.getElementById('showCounter').addEventListener('click', e => {
  option.saveOptions(e);
});
document.getElementById('showSummary').addEventListener('click', e => {
  option.saveOptions(e);
});
document.getElementById('showUpdateNotification').addEventListener('click', e => {
  option.saveOptions(e);
});
document.getElementById('filterWordList').addEventListener('click', e => {
  option.saveOptions(e);
});
document.getElementById('substitutionMark').addEventListener('click', e => {
  option.saveOptions(e);
});
document.getElementById('defaultWordSubstitutionText').addEventListener('change', e => {
  option.saveOptions(e);
}); // Words/Phrases

document.getElementById('wordList').addEventListener('change', e => {
  option.populateWord();
});
document.getElementById('wordText').addEventListener('input', e => {
  OptionPage.hideInputError(e.target);
});
document.getElementById('substitutionText').addEventListener('input', e => {
  OptionPage.hideInputError(e.target);
});
document.getElementById('wordSave').addEventListener('click', e => {
  option.saveWord(e);
});
document.getElementById('wordRemove').addEventListener('click', e => {
  option.removeWord(e);
});
document.getElementById('wordRemoveAll').addEventListener('click', e => {
  option.confirm(e, 'removeAllWords');
});
document.getElementById('bulkWordEditorButton').addEventListener('click', e => {
  option.showBulkWordEditor();
}); // Lists

document.getElementById('whitelist').addEventListener('change', e => {
  option.populateWhitelistWord();
});
document.getElementById('whitelistText').addEventListener('input', e => {
  OptionPage.hideInputError(e.target);
});
document.getElementById('whitelistSave').addEventListener('click', e => {
  option.saveWhitelist(e);
});
document.getElementById('whitelistRemove').addEventListener('click', e => {
  option.removeWhitelist(e);
});
document.getElementById('wordlistsEnabled').addEventListener('click', e => {
  option.saveOptions(e);
});
document.getElementById('wordlistRename').addEventListener('click', e => {
  option.renameWordlist();
});
document.getElementById('wordlistSelect').addEventListener('change', e => {
  option.populateWordlist();
});
document.getElementById('wordlistText').addEventListener('input', e => {
  OptionPage.hideInputError(e.target);
});
document.getElementById('textWordlistSelect').addEventListener('change', e => {
  option.setDefaultWordlist(e.target);
});
document.getElementById('audioWordlistSelect').addEventListener('change', e => {
  option.setDefaultWordlist(e.target);
}); // Domains

document.querySelectorAll('#domainMode input').forEach(el => {
  el.addEventListener('click', e => {
    option.saveOptions(e);
  });
});
document.getElementById('domainSelect').addEventListener('change', e => {
  option.populateDomain();
});
document.getElementById('domainText').addEventListener('input', e => {
  OptionPage.hideInputError(e.target);
});
document.getElementById('domainSave').addEventListener('click', e => {
  option.saveDomain(e);
});
document.getElementById('domainRemove').addEventListener('click', e => {
  option.removeDomain(e);
}); // Audio

document.getElementById('muteAudio').addEventListener('click', e => {
  option.saveOptions(e);
});
document.getElementById('supportedAudioSites').addEventListener('click', e => {
  option.showSupportedAudioSites();
});
document.getElementById('fillerAudioSelect').addEventListener('change', e => {
  option.saveOptions(e);
});
document.getElementById('muteAudioOnly').addEventListener('click', e => {
  option.saveOptions(e);
});
document.getElementById('muteCueRequireShowing').addEventListener('click', e => {
  option.saveOptions(e);
});
document.querySelectorAll('#audioMuteMethod input').forEach(el => {
  el.addEventListener('click', e => {
    option.saveOptions(e);
  });
});
document.querySelectorAll('#audioSubtitleSelection input').forEach(el => {
  el.addEventListener('click', e => {
    option.saveOptions(e);
  });
});
document.querySelectorAll('input.updateYouTubeAutoLimits').forEach(el => {
  el.addEventListener('input', e => {
    option.updateYouTubeAutoLimits(e.target);
  });
});
document.getElementById('customAudioSitesSave').addEventListener('click', e => {
  option.saveCustomAudioSites();
}); // Bookmarklet

document.querySelectorAll('#bookmarkletConfigInputs input').forEach(el => {
  el.addEventListener('click', e => {
    option.populateBookmarkletPage();
  });
});
document.getElementById('bookmarkletFile').addEventListener('click', e => {
  option.exportBookmarkletFile();
});
document.getElementById('bookmarkletHostedURL').addEventListener('input', e => {
  option.updateHostedBookmarklet();
});
document.getElementById('bookmarkletLink').addEventListener('click', e => {
  e.preventDefault();
}); // Config

document.getElementById('configInlineInput').addEventListener('click', e => {
  option.configInlineToggle();
});
document.getElementById('importFileInput').addEventListener('change', e => {
  option.importConfigFile(e);
});
document.getElementById('configReset').addEventListener('click', e => {
  option.confirm(e, 'restoreDefaults');
});
document.getElementById('configExport').addEventListener('click', e => {
  option.exportConfig();
});
document.getElementById('configImport').addEventListener('click', e => {
  option.confirm(e, 'importConfig');
});
document.getElementById('setPassword').addEventListener('input', e => {
  option.auth.setPasswordButton(option);
});
document.getElementById('setPasswordBtn').addEventListener('click', e => {
  option.confirm(e, 'setPassword');
}); // Test

document.getElementById('testText').addEventListener('input', e => {
  option.populateTest();
}); // Stats

document.getElementById('collectStats').addEventListener('click', e => {
  option.saveOptions(e);
});
document.getElementById('statsReset').addEventListener('click', e => {
  option.confirm(e, 'statsReset');
}); // Other

document.getElementsByClassName('themes')[0].addEventListener('click', e => {
  option.toggleTheme();
});

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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(205);
/******/ 	
/******/ })()
;