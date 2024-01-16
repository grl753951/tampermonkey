// ==UserScript==
// @name         Filman.cc
// @namespace    http://tampermonkey.net/
// @version      0.15
// @description  Filman script
// @author       You
// @match        https://filman.cc/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    function doIfExists(query, func) {
        const elems = document.querySelector(query);
        if (elems) {
            func(elems);
        }
    }

    function removeElements() {
        const elementsToRemove = [
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

    function sendToKodi(streamUrl) {
        if (navigator.share) {
            navigator.share({
                title: 'Stream URL',
                text: 'Watch a video!',
                url: streamUrl,
            })
                .then(() => console.log('Successful share'))
                .catch((error) => console.log('Error sharing', error));
        } else {
            console.log('Share not supported on this browser, do it the old way.');
        }

        //         try {
        //             const body = {
        //                 jsonrpc: '2.0',
        //                 method: 'Player.Open',
        //                 id: 0,
        //                 params: {
        //                     item: {
        //                         file: 'plugin://plugin.video.sendtokodi/?' + streamUrl
        //                     }
        //                 }
        //             };

        //             const Http = new XMLHttpRequest();
        //             const url='http://192.168.1.111:8080/jsonrpc';
        //             Http.open("POST", url, true);
        //             Http.withCredentials = true;
        //             Http.setRequestHeader('Accept', 'application/json');
        //             Http.setRequestHeader('Content-Type', 'application/json');
        //             Http.setRequestHeader('Authorization', 'Basic ' + btoa('kodi:kodi'));
        //             Http.send(JSON.stringify(body));
        //         }
        //         catch (error) {
        //             console.log(error)
        //             alert(error.message);
        //         }
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
                window.open(url);
                sendToKodi(url);
            }, false);
        });
    }

    function documentLoaded() {
        removeElements();

        doIfExists('#item-info', el => el.classList = []);
        doIfExists('#link-list', el => el.setAttribute("style", ""));
        doIfExists('body', el => el.setAttribute("style", "padding: 2em"));

        addFiltering();
        extractLinkData();
    }

    document.addEventListener("DOMContentLoaded", documentLoaded);
})();
