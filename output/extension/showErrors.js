/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};


// Show errors (including syntax) on the page
// Requires: <body>...<div id="uncaughtErrors"></div></body>
window.onerror = function (message, source, lineno, colno, error) {
  const errorContainer = document.querySelector('BODY > #uncaughtErrors');

  if (errorContainer) {
    if (!errorContainer.childElementCount) {
      const errorHeader = document.createElement('P');
      errorHeader.textContent = 'Errors:';
      errorContainer.appendChild(errorHeader);
    }

    const errorMessage = document.createElement('P');
    errorMessage.textContent = message.toString();
    errorContainer.appendChild(errorMessage);
  } else {
    window.alert(message);
  }
};
/******/ })()
;