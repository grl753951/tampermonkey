// ==UserScript==
// @name         Filman.cc
// @namespace    http://tampermonkey.net/
// @version      0.18
// @description  Filman script
// @author       You
// @match        https://filman.cc/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    function doIfExists(query, func) {
        const elems = document.querySelectorAll(query);
        if (elems) {
            elems.forEach(elem => func(elem));
        }
    }

    function removeElements() {
        const elementsToRemove = [
            ".alert-info",
            "#color-switch",
            "#cookies",
            "#fb-root",
            "#belt",
            "header",
            ".filman",
            "center",
            ".description",
            "#single-poster",
            "div.clearfix  > div.text-right",
            "thead > tr.version",
            "#wrapper > .container",
            ".fa-sort"
        ];
        document.querySelectorAll(elementsToRemove.join(",")).forEach(function (item) {
            item.remove();
        });
    }

    function addFiltering() {
        document.querySelectorAll("a.select-version").forEach(function (item) {
            item.removeAttribute("href");
            item.setAttribute("style", "cursor: pointer");

            item.addEventListener('click', function () {
                const selectedVersion = item.textContent;
                document.querySelectorAll("tr.version").forEach(function (item) {
                    item.setAttribute("style", "");
                });
                if (selectedVersion !== 'Wszystkie') {
                    document.querySelectorAll("tr.version").forEach(function (item) {
                        if (!item.textContent.includes(selectedVersion) ||
                            (selectedVersion === 'Lektor' && item.textContent.includes('Lektor_IVO')) ||
                            (selectedVersion === 'Napisy' && item.textContent.includes('Napisy_Tansl'))
                           ) {
                            item.setAttribute("style", "display: none");
                        }
                    });
                }
            });
        });
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

    function extractLinkData() {
        document.querySelectorAll(".link-to-video > a").forEach(function (item) {
            item.removeAttribute("href");
            item.removeAttribute("target");
            item.setAttribute("style", "cursor: pointer");

            item.addEventListener('click', function () {
                let url;
                if(item.getAttribute('data-mp4') == null) {
                    url = JSON.parse(atob(item.getAttribute('data-iframe'))).src;
                } else {
                    url = atob(item.getAttribute('href'));
                }
                sendToKodi(url);
            }, false);
        });
    }

    function documentLoaded() {
        removeElements();

        doIfExists('#item-info', el => (el.classList = []));
        doIfExists('#link-list', el => el.setAttribute("style", ""));
        doIfExists('body', el => el.setAttribute("style", "padding: 2em"));
        doIfExists('input', el => el.setAttribute("style", "width: 100%"));
        doIfExists('.col-sm-9', el => (el.classList = ['col-sm-12']));
        doIfExists('.tab-content', el => {
            const ii = document.getElementById('item-info');
            ii.replaceChild(document.querySelector('.tab-content'), ii.firstElementChild);
        });
        //doIfExists('#item-list', el => el.parentElement.remove());

        addFiltering();
        extractLinkData();
    }

    document.addEventListener("DOMContentLoaded", documentLoaded);
})();
