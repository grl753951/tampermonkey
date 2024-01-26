// ==UserScript==
// @name         Fmoviesz
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://fmoviesz.to/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fmovies.to
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    function doIfExists(query, func) {
        const elems = document.querySelector(query);
        if (elems) {
            func(elems);
        }
    }

    function sendToKodi(url) {
        if (navigator.share) {
            navigator.share({
                title: 'Stream URL',
                text: 'Watch a video!',
                url: url,
            })
                .then(() => console.log('Successful share'))
                .catch((error) => window.open(url));
        } else {
            window.open(url);
            console.log('Share not supported on this browser, do it the old way.');
        }
    }

    function doShare(){
        doIfExists('#player > iframe:nth-child(1)', el => sendToKodi(el.getAttribute('src')));
    }

    function documentLoaded() {
        doIfExists('div.item:nth-child(7)', el => el.addEventListener("click", doShare, false));
    }


    document.addEventListener("DOMContentLoaded", documentLoaded);

})();
