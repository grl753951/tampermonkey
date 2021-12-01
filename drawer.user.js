// ==UserScript==
// @name         Drawer
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Drawer links
// @author       You
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

GM_addStyle(`
  .drawer {
    display: none;
  }

  .drawer__header {
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ddd;
  }
  
  .drawer__close {
    margin: 0;
    padding: 0;
    border: none;
    background-color: transparent;
    cursor: pointer;
    width: 15px;
    height: 15px;
  }
  
  .drawer__wrapper {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    max-width: 500px;
    z-index: 9999;
    overflow: auto;
    transition: transform 0.3s;
    will-change: transform;
    font-size: large;
    background-color: white;
    color: black;
    display: flex;
    flex-direction: column;
    -webkit-transform: translateX(103%);
    transform: translateX(103%); /* extra 3% because of box-shadow */
    -webkit-overflow-scrolling: touch; /* enables momentum scrolling in iOS overflow elements */
    box-shadow: 0 2px 6px #777;
  }
  
  .drawer__content {
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;
    height: 100%;
    flex-grow: 1;
    padding: 1.5rem;
  }
  
  .drawer.is-active {
    display: block;
  }
  
  .drawer.is-visible .drawer__wrapper {
    -webkit-transform: translateX(0);
    transform: translateX(0);
  }
  
  .drawer.is-visible .drawer__overlay {
    opacity: 0.5;
  }

  .drawer__overlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 200;
    opacity: 0;
    transition: opacity 0.3s;
    will-change: opacity;
    background-color: #000;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .drawer--left .drawer__wrapper {
    left: 0;
    right: auto;
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }

  #drawer__title {
      cursor: pointer;
  }

`);

const drawerHTML = `<section class="drawer drawer--left" id="drawer-name" data-drawer-target>
<div class="drawer__overlay" data-drawer-close tabindex="-1"></div>
<div class="drawer__wrapper">
  <div class="drawer__header">
    <div id="drawer__title">
      Save current site
    </div>
    <button class="drawer__close" data-drawer-close aria-label="Close Drawer"></button>
  </div>
  <div class="drawer__content" id="drawer__content">
  </div>
</div>
</section>`;

(function () {
  "use strict";  

  function drawer() {
    if (!Element.prototype.closest) {
      if (!Element.prototype.matches) {
        Element.prototype.matches =
          Element.prototype.msMatchesSelector ||
          Element.prototype.webkitMatchesSelector;
      }
      Element.prototype.closest = function (s) {
        var el = this;
        var ancestor = this;
        if (!document.documentElement.contains(el)) return null;
        do {
          if (ancestor.matches(s)) return ancestor;
          ancestor = ancestor.parentElement;
        } while (ancestor !== null);
        return null;
      };
    }

    function openDrawer() {
      var target = document.getElementById("drawer-name");
      target.classList.add("is-active");
      document.documentElement.style.overflow = "hidden";
      setTimeout(function () {
        target.classList.add("is-visible");
      }, 50);
    }

    function closeDrawer() {
      var target = document.getElementById("drawer-name");
      target.classList.remove("is-visible");
      document.documentElement.style.overflow = "";
      setTimeout(function () {
        target.classList.remove("is-active");
      }, 350);
    }

    function clickHandler(event) {
      if (event.target.closest("[data-drawer-close]")) {
        closeDrawer(close);
        event.preventDefault();
      } else {
        if (event.target.id === "drawer__title") {
          var oldItems = JSON.parse(localStorage.getItem("links")) || [];
          const arr = document.title.split(" - ");
          if (arr.length > 2) {
            arr.splice(arr.length - 2, 2);
          }
          var newItem = {
            url: window.location.href,
            name: arr.join(" - "),
          };
          oldItems.push(newItem);
          localStorage.setItem("links", JSON.stringify(oldItems));
          let x = document.createElement("p");
          x.innerHTML = `<a href="${newItem.url}">${newItem.name}</a>`;
          document.getElementById("drawer__content").appendChild(x);
        }
      }
    }

    let p = document.createElement("div");
    p.innerHTML = drawerHTML;
    document.body.appendChild(p);

    document.addEventListener("mousemove", (e) => {
      if (e.screenX < 5) {
        openDrawer();
      }
    });
    document.addEventListener("click", clickHandler, false);

    var oldItems = JSON.parse(localStorage.getItem("links")) || [];
    if (oldItems.length) {
      const con = document.getElementById("drawer__content");
      oldItems.forEach((item) => {
        let x = document.createElement("p");
        x.innerHTML = `<a href="${item.url}">${item.name}</a>`;
        con.appendChild(x);
      });
    }
  }

  document.addEventListener("DOMContentLoaded", drawer);
})();
