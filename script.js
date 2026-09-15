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
  work1      : "",                          // ③ ワーク1 演習用デザイン
  materials  : "",                          // ④ 演習用素材（写真・ロゴなど）
  slides     : "",                          // ⑤ 今日の資料
  shareForm  : "",                          // ⑥ 成果共有フォーム（今回は未使用。使う場合のみURLを入れる）
  survey     : "",                          // ⑦ 研修アンケート
  book       : "https://gihyo.jp/book/2026/978-4-297-15660-2"  // ⑧ 講師の著作（技術評論社）
};

/* リンク一覧に表示する名称（CONFIGのキーと対応） */
var LINK_LABELS = {
  canvaClass : "研修用Canvaクラス（招待リンク）",
  canvaHome  : "Canva",
  work1      : "ワーク1 演習用デザイン",
  materials  : "演習用素材",
  slides     : "今日の資料",
  shareForm  : "成果共有フォーム",
  survey     : "研修アンケート",
  book       : "講師の著作（出版社サイト）"
};

/* 研修日（この日だけ、アジェンダの「いまここ」が自動表示されます） */
var TRAINING_DATE = "2026-09-18";

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

    var order = ["canvaClass", "canvaHome", "work1", "materials", "slides", "survey", "shareForm", "book"];
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
     5. アジェンダの「いまここ」表示
        - 研修日は時刻から自動判定（1分ごとに更新）
        - 研修が前後したときは「前へ／次へ」で手動切替
     ------------------------------------------------------------------ */
  var agendaItems = [];
  var manualIndex = null;   // 手動で選んだ位置（nullなら自動）
  var statusEl = null;

  function initAgenda() {
    agendaItems = [].slice.call(document.querySelectorAll(".agenda li"));
    statusEl = document.getElementById("agendaStatus");
    if (!agendaItems.length) { return; }

    var prev = document.getElementById("agendaPrev");
    var next = document.getElementById("agendaNext");
    var auto = document.getElementById("agendaAuto");

    if (prev) {
      prev.addEventListener("click", function () {
        var cur = currentIndex();
        manualIndex = Math.max(0, (cur < 0 ? 0 : cur) - 1);
        renderAgenda();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        var cur = currentIndex();
        manualIndex = Math.min(agendaItems.length - 1, (cur < 0 ? -1 : cur) + 1);
        renderAgenda();
      });
    }
    if (auto) {
      auto.addEventListener("click", function () {
        manualIndex = null;
        renderAgenda();
      });
    }

    renderAgenda();
    window.setInterval(function () {
      if (manualIndex === null) { renderAgenda(); }
    }, 60000);
  }

  function todayKey() {
    var d = new Date();
    var m = d.getMonth() + 1;
    var day = d.getDate();
    return d.getFullYear() + "-" + (m < 10 ? "0" + m : m) + "-" + (day < 10 ? "0" + day : day);
  }

  function autoIndex() {
    if (todayKey() !== TRAINING_DATE) { return -1; }
    var now = new Date();
    var minutes = now.getHours() * 60 + now.getMinutes();
    for (var i = 0; i < agendaItems.length; i++) {
      var s = parseInt(agendaItems[i].getAttribute("data-start"), 10);
      var e = parseInt(agendaItems[i].getAttribute("data-end"), 10);
      if (minutes >= s && minutes < e) { return i; }
    }
    return -1;
  }

  function currentIndex() {
    return manualIndex !== null ? manualIndex : autoIndex();
  }

  function renderAgenda() {
    var cur = currentIndex();

    for (var i = 0; i < agendaItems.length; i++) {
      var li = agendaItems[i];
      li.classList.remove("is-now", "is-done");
      var mark = li.querySelector(".now");
      if (mark) { mark.parentNode.removeChild(mark); }

      if (cur >= 0 && i < cur) { li.classList.add("is-done"); }
      if (cur >= 0 && i === cur) {
        li.classList.add("is-now");
        var ttl = li.querySelector(".agenda__ttl");
        if (ttl) {
          var span = document.createElement("span");
          span.className = "now";
          span.textContent = "▶ いまここ";
          ttl.appendChild(span);
        }
      }
    }

    if (statusEl) {
      if (cur < 0) {
        statusEl.textContent = "研修当日（2026年9月18日 13:30〜）は、現在地が自動で表示されます。";
      } else if (manualIndex !== null) {
        statusEl.textContent = "手動で表示中です。";
      } else {
        statusEl.textContent = "現在時刻から自動表示中です。";
      }
    }
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
    initAgenda();
    initFontToggle();
    initSheet();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
