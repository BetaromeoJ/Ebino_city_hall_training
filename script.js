/* ==========================================================================
   えびの市役所 広報スキルアップ「Canva」ワークショップセミナー 第1回 基礎編
   研修ポータル script.js
   外部ライブラリは使用していません。
   ========================================================================== */

/* ==========================================================================
   ★★★ ここだけ書き換えてください（外部リンク設定） ★★★

   ・URLを "" （空欄）のままにすると、そのボタンは自動で「準備中」表示になり、
     押せない状態になります（誤クリック防止）。
   ・URLを入れると自動でボタンが有効になり、別タブで開くようになります。
   ・ここに入れたURLは、ページ下部「困ったとき」内のリンク一覧にも
     自動で文字として表示されます（手入力・印刷用の保険）。
   ========================================================================== */
var CONFIG = {
  canvaClass : "https://www.canva.com/brand/join?token=M0FB040stfUoReg4tEy1cw&brandingVariant=edu&invitationDestinationType=group",  // ① 研修用Canvaクラス 招待リンク
  canvaHome  : "https://www.canva.com/",    // ② Canvaを開く
  work1      : "https://canva.link/hd944oyen6jc2ie",  // ③ ワーク1 演習用デザイン「Ebino Walking」
  shareForm  : "https://docs.google.com/forms/d/e/1FAIpQLSc-Sp5wO40t4THAf9vhv06zhjLhDFco_iURTMFVOwygsyqP-Q/viewform",  // ④ 成果共有フォーム（PNG作品の提出先）
  survey     : "https://docs.google.com/forms/d/e/1FAIpQLSchfKUDeaERQi0vHxrsC7Pmlmemo-pCD_i-w52P7vCPs7us4A/viewform",  // ⑤ 研修アンケート
  book       : "https://gihyo.jp/book/2026/978-4-297-15660-2"  // ⑥ 講師の著作（技術評論社）
};

/* リンク一覧に表示する名称（CONFIGのキーと対応） */
var LINK_LABELS = {
  canvaClass : "研修用Canvaクラス（招待リンク）",
  canvaHome  : "Canva",
  work1      : "ワーク1 演習用デザイン",
  shareForm  : "成果共有フォーム",
  survey     : "研修アンケート",
  book       : "講師の著作（出版社サイト）"
};

/* ==========================================================================
   これより下は、通常は編集不要です。
   ========================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     1. 外部リンクの適用（CONFIG → ボタン）
     ------------------------------------------------------------------ */
  function applyLinks() {
    var nodes = document.querySelectorAll("[data-link]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var key = el.getAttribute("data-link");
      var url = CONFIG[key];

      if (url && String(url).replace(/\s/g, "") !== "") {
        el.setAttribute("href", url);
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener noreferrer");
        el.removeAttribute("aria-disabled");
        el.classList.remove("is-pending");
      } else {
        /* URL未設定：押せない「準備中」状態を維持 */
        el.removeAttribute("href");
        el.setAttribute("aria-disabled", "true");
        el.classList.add("is-pending");
      }
    }
  }

  /* ------------------------------------------------------------------
     2. リンク一覧テーブルの生成（困ったとき用）
     ------------------------------------------------------------------ */
  function buildLinkTable() {
    var tbody = document.getElementById("linkTableBody");
    if (!tbody) { return; }

    var order = ["canvaClass", "canvaHome", "work1", "survey", "shareForm", "book"];
    var html = "";

    for (var i = 0; i < order.length; i++) {
      var key = order[i];
      var url = CONFIG[key];
      var label = LINK_LABELS[key] || key;
      var cell;

      if (url && String(url).replace(/\s/g, "") !== "") {
        cell = '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + url + "</a>";
      } else {
        cell = '<span class="unset">未設定（当日、講師がご案内します）</span>';
      }
      html += "<tr><th scope=\"row\">" + label + "</th><td>" + cell + "</td></tr>";
    }
    tbody.innerHTML = html;
  }

  /* ------------------------------------------------------------------
     3. 画像プレースホルダー
        images/ に同名ファイルを置くと、自動で写真に差し替わります。
        （画像が無い間は「画像準備中」の枠が表示されます）
     ------------------------------------------------------------------ */
  function loadImages() {
    var boxes = document.querySelectorAll(".media[data-img]");
    for (var i = 0; i < boxes.length; i++) {
      (function (box) {
        var src = box.getAttribute("data-img");
        var alt = box.getAttribute("data-alt") || "";
        var probe = new Image();
        probe.onload = function () {
          box.innerHTML = "";
          var img = document.createElement("img");
          img.src = src;
          img.alt = alt;
          img.loading = "lazy";
          box.appendChild(img);
          box.classList.add("is-loaded");
        };
        probe.src = src;
      })(boxes[i]);
    }
  }

  /* ------------------------------------------------------------------
     4. サイドナビの現在地表示（スクロール連動）
     ------------------------------------------------------------------ */
  function initScrollSpy() {
    var links = document.querySelectorAll(".sidebar__list a");
    if (!links.length || !("IntersectionObserver" in window)) { return; }

    var map = {};
    var targets = [];
    for (var i = 0; i < links.length; i++) {
      var id = links[i].getAttribute("href").replace("#", "");
      var sec = document.getElementById(id);
      if (sec) { map[id] = links[i]; targets.push(sec); }
    }

    function clearAll() {
      for (var k in map) {
        if (Object.prototype.hasOwnProperty.call(map, k)) {
          map[k].removeAttribute("aria-current");
        }
      }
    }

    var observer = new IntersectionObserver(function (entries) {
      var best = null;
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          if (!best || entries[i].boundingClientRect.top < best.boundingClientRect.top) {
            best = entries[i];
          }
        }
      }
      if (best) {
        clearAll();
        var link = map[best.target.id];
        if (link) { link.setAttribute("aria-current", "true"); }
      }
    }, { rootMargin: "-80px 0px -60% 0px", threshold: 0 });

    for (var j = 0; j < targets.length; j++) { observer.observe(targets[j]); }
  }

  /* ------------------------------------------------------------------
     5.5 文字サイズの切替（「文字を大きく」ボタン）
         html に data-font="lg" を付け外しするだけで、ページ全体の文字が
         約1.15倍になります。選んだ状態はこのPCのブラウザに記憶されます。
     ------------------------------------------------------------------ */
  function initFontToggle() {
    var buttons = [
      document.getElementById("fontToggle"),
      document.getElementById("fontToggleSheet")
    ];
    var root = document.documentElement;

    function isLarge() { return root.getAttribute("data-font") === "lg"; }

    function render() {
      var large = isLarge();
      for (var i = 0; i < buttons.length; i++) {
        if (!buttons[i]) { continue; }
        buttons[i].setAttribute("aria-pressed", large ? "true" : "false");
        var label = buttons[i].querySelector(".fontToggle__label");
        if (label) { label.textContent = large ? "文字を標準に" : "文字を大きく"; }
      }
    }

    function toggle() {
      var large = !isLarge();
      if (large) { root.setAttribute("data-font", "lg"); }
      else { root.removeAttribute("data-font"); }
      try { localStorage.setItem("ebino-font", large ? "lg" : "std"); } catch (e) {}
      render();
    }

    for (var i = 0; i < buttons.length; i++) {
      if (buttons[i]) { buttons[i].addEventListener("click", toggle); }
    }
    render();
  }

  /* ------------------------------------------------------------------
     6. スマホ用 目次シート
     ------------------------------------------------------------------ */
  function initSheet() {
    var sheet = document.getElementById("navSheet");
    var openers = document.querySelectorAll("[data-sheet-open]");
    var closer = document.getElementById("sheetClose");
    if (!sheet) { return; }

    function open() { sheet.hidden = false; document.body.style.overflow = "hidden"; }
    function close() { sheet.hidden = true; document.body.style.overflow = ""; }

    for (var i = 0; i < openers.length; i++) {
      openers[i].addEventListener("click", open);
    }
    if (closer) { closer.addEventListener("click", close); }

    sheet.addEventListener("click", function (e) {
      if (e.target === sheet) { close(); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !sheet.hidden) { close(); }
    });

    var links = sheet.querySelectorAll("a");
    for (var j = 0; j < links.length; j++) {
      links[j].addEventListener("click", close);
    }
  }

  /* ------------------------------------------------------------------
     7. 起動
     ------------------------------------------------------------------ */
  function init() {
    applyLinks();
    buildLinkTable();
    loadImages();
    initScrollSpy();
    initFontToggle();
    initSheet();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
