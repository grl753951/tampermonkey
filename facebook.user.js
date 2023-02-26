// ==UserScript==
// @name         Facebook
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.facebook.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener("DOMContentLoaded", function() {
        document.getElementById('ssrb_top_of_home_start').parentNode.remove()
    });

})();
