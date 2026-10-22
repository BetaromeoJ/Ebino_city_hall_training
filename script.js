/* ==========================================================================
   えびの市役所 広報スキルアップ「Canva」ワークショップセミナー
   研修ポータル script.js（第1回・第2回 統合版）
   外部ライブラリは使用していません。
   ========================================================================== */

/* ==========================================================================
   ★★★ ここだけ書き換えてください（外部リンク設定） ★★★

   ・URLを "" （空欄）のままにすると、そのボタンは自動で「準備中」表示になり、
     押せない状態になります（誤クリック防止）。
   ・URLを入れると自動でボタンが有効になり、別タブで開くようになります。
   ・ここに入れたURLは、各回の「困ったとき」内のリンク一覧にも
     自動で文字として表示されます（手入力・印刷用の保険）。
   ========================================================================== */
var CONFIG = {
  /* ---- 共通 ---------------------------------------------------------- */
  canvaHome  : "https://www.canva.com/",    // ① Canvaを開く
  work1      : "https://canva.link/hd944oyen6jc2ie",  // ② 演習用デザイン「Ebino Walking」（第1回・第2回 共通）
  book       : "https://gihyo.jp/book/2026/978-4-297-15660-2",  // ③ 講師の著作（技術評論社）

  /* ---- 第1回（2026.09.18） ------------------------------------------- */
  canvaClass : "https://www.canva.com/brand/join?token=M0FB040stfUoReg4tEy1cw&brandingVariant=edu&invitationDestinationType=group",  // ④ 研修用Canvaクラス 招待リンク
  shareForm  : "https://docs.google.com/forms/d/e/1FAIpQLSc-Sp5wO40t4THAf9vhv06zhjLhDFco_iURTMFVOwygsyqP-Q/viewform",  // ⑤ 第1回 成果共有フォーム
  survey     : "https://docs.google.com/forms/d/e/1FAIpQLSchfKUDeaERQi0vHxrsC7Pmlmemo-pCD_i-w52P7vCPs7us4A/viewform",  // ⑥ 第1回 研修アンケート

  /* ---- 第2回（2026.10.23） ------------------------------------------- */
  gemini     : "https://gemini.google.com/",  // ⑦ Geminiを開く

  /* ⑧ 第2回 演習用デザイン（Canvaテンプレート）
     ★現在は第1回の「Ebino Walking」と同じデザインを指しています。
       第2回用（観光PR）のテンプレートができたら、この1行を差し替えてください。
       空欄 "" にすると、ボタンは自動で「準備中」になります。 */
  canvaTemplate2 : "https://canva.link/hd944oyen6jc2ie",

  shareForm2 : "",   // ⑨ 第2回 成果共有フォーム（★未設定：URLが決まったらここへ貼り付け）

  /* ⑩ 第2回 研修アンケート（★未設定）
     第1回と同じ質問を使います。第1回のフォームをそのまま使う場合は、
     上の survey と同じURLを貼り付けてください。複製して使う場合は複製側のURLを。 */
  survey2    : ""
};

/* リンク一覧に表示する名称（CONFIGのキーと対応） */
var LINK_LABELS = {
  canvaClass : "研修用Canvaクラス（招待リンク）",
  canvaHome  : "Canva",
  work1      : "演習用デザイン（Ebino Walking）",
  shareForm  : "成果共有フォーム",
  survey     : "研修アンケート",
  book       : "講師の著作（出版社サイト）",
  gemini     : "Gemini",
  canvaTemplate2 : "演習用デザイン（第2回）",
  shareForm2 : "成果共有フォーム（第2回）",
  survey2    : "研修アンケート（第2回）"
};

/* 各回の「困ったとき」リンク一覧に並べる順番 */
var LINK_ORDER_1 = ["canvaClass", "canvaHome", "work1", "survey", "shareForm", "book"];
var LINK_ORDER_2 = ["gemini", "canvaHome", "canvaTemplate2", "shareForm2", "survey2"];

/* ==========================================================================
   これより下は、通常は編集不要です。
   ========================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     1. 外部リンクの適用（CONFIG → ボタン）
     ------------------------------------------------------------------ */
  function hasUrl(url) {
    return !!url && String(url).replace(/\s/g, "") !== "";
  }

  function applyLinks() {
    var nodes = document.querySelectorAll("[data-link]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var url = CONFIG[el.getAttribute("data-link")];

      if (hasUrl(url)) {
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
  function renderLinkTable(id, order) {
    var tbody = document.getElementById(id);
    if (!tbody) { return; }

    var html = "";
    for (var i = 0; i < order.length; i++) {
      var key = order[i];
      var url = CONFIG[key];
      var label = LINK_LABELS[key] || key;
      var cell;

      if (hasUrl(url)) {
        cell = '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + url + "</a>";
      } else {
        cell = '<span class="unset">未設定（当日、講師がご案内します）</span>';
      }
      html += '<tr><th scope="row">' + label + "</th><td>" + cell + "</td></tr>";
    }
    tbody.innerHTML = html;
  }

  function buildLinkTables() {
    renderLinkTable("linkTableBody", LINK_ORDER_1);
    renderLinkTable("linkTableBody2", LINK_ORDER_2);
  }

  /* ------------------------------------------------------------------
     3. 研修回の切り替え（第1回／第2回）
        ・トップページのヒーローにあるボタンだけで切り替えます。
        ・URLは変わりません。選んだ回はこのPCのブラウザに記憶されます。
     ------------------------------------------------------------------ */
  function initCourseSwitch() {
    var buttons = document.querySelectorAll("[data-course-btn]");
    if (!buttons.length) { return; }
    var root = document.documentElement;

    function current() {
      return root.getAttribute("data-course") === "1" ? "1" : "2";
    }

    function render() {
      var now = current();
      for (var i = 0; i < buttons.length; i++) {
        var on = buttons[i].getAttribute("data-course-btn") === now;
        buttons[i].setAttribute("aria-pressed", on ? "true" : "false");
        var state = buttons[i].querySelector(".courseSwitch__state");
        if (state) { state.textContent = on ? "表示中" : "切り替える"; }
      }
    }

    function select(course) {
      if (course !== "1" && course !== "2") { return; }
      if (course === current()) { return; }
      root.setAttribute("data-course", course);
      try { localStorage.setItem("ebino-course", course); } catch (e) {}
      render();
      /* 下の方を見ていた場合は、切り替え先の先頭から読めるように戻します */
      if (window.pageYOffset > 240) { window.scrollTo(0, 0); }
    }

    for (var j = 0; j < buttons.length; j++) {
      (function (btn) {
        btn.addEventListener("click", function () {
          select(btn.getAttribute("data-course-btn"));
        });
      })(buttons[j]);
    }
    render();
  }

  /* ------------------------------------------------------------------
     4. プロンプトのコピー
        ・Clipboard API が使えない環境では、古い方式で代替します。
        ・テーマカードは【テーマ】を選んだテーマ名に差し替えてコピーします。
     ------------------------------------------------------------------ */
  function legacyCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "readonly");
    ta.style.position = "fixed";
    ta.style.top = "-1000px";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, ta.value.length);
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  function showMsg(btn, text, isError) {
    var box = btn.parentNode;
    var msg = null;
    while (box && !msg) {
      msg = box.querySelector ? box.querySelector(".prompt__msg") : null;
      if (!msg) { box = box.parentNode; }
      if (box === document.body) { break; }
    }
    if (!msg) { return; }
    msg.textContent = text;
    msg.className = "prompt__msg" + (isError ? " is-error" : " is-ok");
    if (msg._timer) { clearTimeout(msg._timer); }
    msg._timer = setTimeout(function () {
      msg.textContent = "";
      msg.className = "prompt__msg";
    }, 4000);
  }

  function initCopy() {
    var buttons = document.querySelectorAll(".prompt__copy");

    for (var i = 0; i < buttons.length; i++) {
      (function (btn) {
        btn.addEventListener("click", function () {
          var src = document.getElementById(btn.getAttribute("data-copy"));
          if (!src) { return; }

          /* コピーするのは本文だけ。見出しや説明は含めません。 */
          var text = src.textContent;

          var theme = btn.getAttribute("data-theme");
          var inputId = btn.getAttribute("data-theme-input");
          if (inputId) {
            var input = document.getElementById(inputId);
            theme = input && input.value.replace(/\s/g, "") !== "" ? input.value.trim() : "";
            if (!theme) {
              showMsg(btn, "テーマを入力してからコピーしてください。", true);
              if (input) { input.focus(); }
              return;
            }
          }
          if (theme) { text = text.split("【テーマ】").join(theme); }

          function ok() { showMsg(btn, "コピーしました", false); }
          function ng() { showMsg(btn, "コピーできませんでした。文章を選択してコピーしてください。", true); }

          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(ok, function () {
              if (legacyCopy(text)) { ok(); } else { ng(); }
            });
          } else if (legacyCopy(text)) {
            ok();
          } else {
            ng();
          }
        });
      })(buttons[i]);
    }
  }

  /* ------------------------------------------------------------------
     5. 画像プレースホルダー
        images/ に同名ファイルを置くと、自動で写真に差し替わります。
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
     6. サイドナビの現在地表示（スクロール連動）
        section に data-nav="xxx" があれば、その項目を現在地とみなします。
     ------------------------------------------------------------------ */
  function initScrollSpy() {
    var links = document.querySelectorAll(".sidebar__list a");
    if (!links.length || !("IntersectionObserver" in window)) { return; }

    var map = {};
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute("href");
      if (href.charAt(0) !== "#") { continue; }   /* 他ページへのリンクは対象外 */
      map[href.slice(1)] = links[i];
    }

    var targets = [];
    var sections = document.querySelectorAll("section[id]");
    for (var j = 0; j < sections.length; j++) {
      var key = sections[j].getAttribute("data-nav") || sections[j].id;
      if (map[key]) {
        sections[j]._navKey = key;
        targets.push(sections[j]);
      }
    }
    if (!targets.length) { return; }

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
        var link = map[best.target._navKey];
        if (link) { link.setAttribute("aria-current", "true"); }
      }
    }, { rootMargin: "-80px 0px -60% 0px", threshold: 0 });

    for (var t = 0; t < targets.length; t++) { observer.observe(targets[t]); }
  }

  /* ------------------------------------------------------------------
     7. 文字サイズの切替（「文字を大きく」ボタン）
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
     8. スマホ用 目次シート
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
     9. 起動
     ------------------------------------------------------------------ */
  function init() {
    applyLinks();
    buildLinkTables();
    initCourseSwitch();
    initCopy();
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
