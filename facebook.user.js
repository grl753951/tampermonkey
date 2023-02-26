// ==UserScript==
// @name         Facebook
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://m.facebook.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener("DOMContentLoaded", function() {
    console.log('x')
          document.getElementById('root').style.display = 'none'
    });

})();
