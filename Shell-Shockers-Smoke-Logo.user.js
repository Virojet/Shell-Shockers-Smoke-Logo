// ==UserScript==
// @name         Shell Shockers Smoke Logo
// @namespace    https://github.com/Virojet
// @version      1.0.0
// @description  Put your own picture on the smoke of grenade and rocket blasts. The puffs keep the game's shape, size and fade, and only you see it.
// @author       Virojet
// @license      MIT
// @homepageURL  https://github.com/Virojet/Shell-Shockers-Smoke-Logo
// @supportURL   https://github.com/Virojet/Shell-Shockers-Smoke-Logo/issues
// @downloadURL  https://raw.githubusercontent.com/Virojet/Shell-Shockers-Smoke-Logo/main/Shell-Shockers-Smoke-Logo.user.js
// @updateURL    https://raw.githubusercontent.com/Virojet/Shell-Shockers-Smoke-Logo/main/Shell-Shockers-Smoke-Logo.user.js
// @match        *://*.shellshock.io/*
// @match        *://*.algebra.best/*
// @match        *://*.algebra.monster/*
// @match        *://*.algebra.vip/*
// @match        *://*.biologyclass.club/*
// @match        *://*.combateggs.com/*
// @match        *://*.deadlyegg.com/*
// @match        *://*.deathegg.life/*
// @match        *://*.deathegg.world/*
// @match        *://*.egg.dance/*
// @match        *://*.eggbattle.com/*
// @match        *://*.eggboy.club/*
// @match        *://*.eggboy.me/*
// @match        *://*.eggboy.xyz/*
// @match        *://*.eggcombat.com/*
// @match        *://*.eggfacts.fun/*
// @match        *://*.egggames.best/*
// @match        *://*.egghead.institute/*
// @match        *://*.eggisthenewblack.com/*
// @match        *://*.eggsarecool.com/*
// @match        *://*.eggshock.com/*
// @match        *://*.eggshock.me/*
// @match        *://*.eggshock.net/*
// @match        *://*.eggshooter.best/*
// @match        *://*.eggshooter.com/*
// @match        *://*.eggwarfare.com/*
// @match        *://*.eggwars.io/*
// @match        *://*.geometry.best/*
// @match        *://*.geometry.monster/*
// @match        *://*.geometry.pw/*
// @match        *://*.geometry.report/*
// @match        *://*.hardboiled.life/*
// @match        *://*.hardshell.life/*
// @match        *://*.humanorganising.org/*
// @match        *://*.math.international/*
// @match        *://*.mathactivity.club/*
// @match        *://*.mathactivity.xyz/*
// @match        *://*.mathdrills.info/*
// @match        *://*.mathdrills.life/*
// @match        *://*.mathfun.rocks/*
// @match        *://*.mathgames.world/*
// @match        *://*.mathlete.fun/*
// @match        *://*.mathlete.pro/*
// @match        *://*.overeasy.club/*
// @match        *://*.risenegg.com/*
// @match        *://*.scrambled.best/*
// @match        *://*.scrambled.tech/*
// @match        *://*.scrambled.today/*
// @match        *://*.scrambled.us/*
// @match        *://*.scrambled.world/*
// @match        *://*.shellgame.me/*
// @match        *://*.shellplay.live/*
// @match        *://*.shellshock.guru/*
// @match        *://*.shellshockers.best/*
// @match        *://*.shellshockers.ca/*
// @match        *://*.shellshockers.club/*
// @match        *://*.shellshockers.life/*
// @match        *://*.shellshockers.site/*
// @match        *://*.shellshockers.today/*
// @match        *://*.shellshockers.us/*
// @match        *://*.shellshockers.website/*
// @match        *://*.shellshockers.wiki/*
// @match        *://*.shellshockers.world/*
// @match        *://*.shellshockers.xyz/*
// @match        *://*.shellsocks.com/*
// @match        *://*.softboiled.club/*
// @match        *://*.urbanegger.com/*
// @match        *://*.violentegg.club/*
// @match        *://*.violentegg.fun/*
// @match        *://*.yolk.best/*
// @match        *://*.yolk.life/*
// @match        *://*.yolk.monster/*
// @match        *://*.yolk.quest/*
// @match        *://*.yolk.rocks/*
// @match        *://*.yolk.tech/*
// @match        *://*.yolk.today/*
// @match        *://*.zygote.cafe/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/* Smoke Logo: your own picture on the smoke of grenade and rocket blasts.

   What you see: Settings > the speaker tab > Smoke Logo. Choose an image, tick the box, press Confirm. From then on the
   smoke of every grenade and rocket blast on your screen carries your picture. The puffs are exactly the game's: same
   shape, same size, same opacity, same fade, so the smoke hides and reveals exactly what it always did. Only the
   picture painted on the puffs changes, and only on your screen. Other players, the match and the server never know.

   How it works (level L3, a narrow property trap, no code patch): the game draws all its smoke from one shared atlas
   of 128 px cells, and a blast's smoke sprites use cell 144, a grey puff. This script copies that puff into a cell
   nothing uses (240), paints your picture onto the copy with the "source-atop" blend, which never changes the puff's
   alpha (so the silhouette and the opacity stay identical, pixel for pixel), and points the blast's default smoke
   sprites at the copy. To see each blast sprite as the game sets it up, it puts an accessor on the sprite class's
   "animColors" property (found through window.P.scene.spriteManagers). It only looks at smoke, never at fire, and only
   at sprites the game's blast code made (at least 0.5 big, startSize -1, in a 300-sprite pool, not additive, still on
   the default puff cell). Item grenades with their own smoke shape, rocket trails and bullet puffs are left alone.
   While the logo is off, or you have no picture, nothing is hooked.

   Facts it relies on, read from the game's code in October 2026 (not in the guide's VERIFIED list): window.P.scene,
   the smoke and fire sprite managers (300 sprites, cells 128 px, one 2048 px canvas atlas), the sprite properties
   cellIndex, size, startSize, animColors and _manager, the puff on cell 144. If an update changes any of it, nothing
   breaks: the logo just stops showing (status() says why), and the game's smoke stays as it was. It refuses to paint
   a cell that is already in use.

   Your picture: shrunk to 128 px in your browser, kept in this site's localStorage under "ssSmokeLogo", never sent
   anywhere. The script makes no network requests at all. Settings are per site (shellshock.io and a mirror keep
   separate pictures).

   Next to Better HUD: it hooks no Better HUD code. If a Better HUD build ever has its own Smoke Logo row, this script
   stands down and lets that one run.

   window.ssSmokeLogo: version, settings(), set({ enabled, image }), status(). */
(() => {
  "use strict";
  if (window.ssSmokeLogo) return;   // already running: Tampermonkey and the Mod Menu both started it

  const VERSION = "1.0.0";
  const STORE = "ssSmokeLogo";
  // The game's particle atlas, as read from its code: one 2048 px canvas of 16 x 16 cells, 128 px each.
  const ATLAS = 2048, CELL = 128;
  const PUFF = 144;   // the grey puff every blast's default smoke sprite uses (cellMin 16 + 128)
  const LOGO = 240;   // the last row of the atlas, which nothing draws in (checked before the first paint)
  const SHOW = 0.78;  // how much of the cell the picture fills, so it stays inside the puff's soft edge
  const MIN_SIZE = 0.45;   // blast smoke is 0.5 to 1.5 big; rocket trails and puffs are 0.4
  const POOL = 300;   // sprites in the game's smoke and fire pools
  const ADDITIVE = 1; // Babylon's ALPHA_ADD: the fire pool
  const DEFAULTS = Object.freeze({ enabled: false, image: "" });
  // Bound now, at document-start: the game may wrap console later.
  const warn = console.warn.bind(console, "[Smoke Logo]");
  const warned = new Set();
  const once = (tag, ...a) => { if (!warned.has(tag)) { warned.add(tag); warn(...a); } };

  /* ---- Saved settings ---- */
  // Everything from storage, from the controls, or from set() goes through clean(), so a damaged or old save can't
  // break the mod. A picture is a PNG data URL under 200 KB; "on" only counts with a picture.
  const IMAGE = /^data:image\/png;base64,[A-Za-z0-9+/]+={0,2}$/;
  function clean(s) {
    const ok = !!s && typeof s === "object";
    const image = ok && typeof s.image === "string" && s.image.length <= 200000 && IMAGE.test(s.image) ? s.image : DEFAULTS.image;
    return { enabled: ok && s.enabled === true && !!image, image };
  }
  let saved;
  try { saved = clean(JSON.parse(localStorage.getItem(STORE))); } catch { saved = clean(null); }
  function save(s) {
    const before = saved.image;
    saved = clean(s);
    try { localStorage.setItem(STORE, JSON.stringify(saved)); } catch { once("storage", "Browser storage is blocked or full: the logo is kept for this visit only."); }
    if (saved.image !== before) loadImage(); else tick();
  }

  /* ---- The picture ---- */
  let logoImg = null, logoVer = 0;
  const wanted = () => saved.enabled && !!logoImg;
  function loadImage() {
    const data = saved.image;
    logoImg = null; logoVer++;
    if (!data) { tick(); return; }
    const im = new Image();
    im.onload = () => { if (saved.image === data) { logoImg = im; logoVer++; tick(); repaint(); } };
    im.onerror = () => once("image", "The saved picture could not be read.");
    im.src = data;
  }

  /* ---- The logo cell ---- */
  const painted = new WeakMap();   // atlas texture -> the picture version drawn into its logo cell
  const refused = new WeakSet();   // atlas textures this script will not touch (changed game)
  const cellAt = c => [(c % 16) * CELL, (15 - Math.floor(c / 16)) * CELL];   // the canvas is stored upside down: cell c sits in row 15 - floor(c / 16) from the top
  let blocked = "";
  const refuse = (tex, why) => { refused.add(tex); blocked = why; once("atlas", "Not painting the smoke logo: " + why + " (the game may have changed)."); return false; };

  // m: a smoke sprite manager. The game's puff with the picture on it goes into the logo cell; source-atop keeps the
  // puff's alpha exactly, so the silhouette and opacity are the game's.
  function paintCell(m) {
    const tex = m && m.texture;
    if (!tex || refused.has(tex)) return false;
    if (painted.get(tex) === logoVer) return true;
    try {
      const ctx = tex.getContext && tex.getContext();
      if (!ctx || !logoImg) return false;
      if (!ctx.canvas || ctx.canvas.width !== ATLAS || ctx.canvas.height !== ATLAS || m.cellWidth !== CELL || m.cellHeight !== CELL) return refuse(tex, "the particle atlas is not the size it expects");
      const [px, py] = cellAt(PUFF), [lx, ly] = cellAt(LOGO);
      if (!painted.has(tex)) {   // first time on this atlas: the cell has to be empty
        const d = ctx.getImageData(lx, ly, CELL, CELL).data;
        for (let i = 3; i < d.length; i += 4) if (d[i]) return refuse(tex, "its logo cell is in use");
      }
      const t = document.createElement("canvas");
      t.width = t.height = CELL;
      const c = t.getContext("2d");
      c.putImageData(ctx.getImageData(px, py, CELL, CELL), 0, 0);
      c.globalCompositeOperation = "source-atop";
      const k = CELL * SHOW, o = (CELL - k) / 2;
      c.translate(0, CELL); c.scale(1, -1);   // upside down, like the atlas canvas
      c.drawImage(logoImg, o, o, k, k);
      ctx.clearRect(lx, ly, CELL, CELL);
      ctx.drawImage(t, lx, ly);
      tex.update();
      painted.set(tex, logoVer);
      return true;
    } catch (err) { refused.add(tex); blocked = "painting failed"; once("paint", err); return false; }
  }
  const pools = () => {
    const sc = window.P && window.P.scene, ms = sc && sc.spriteManagers;
    return ms ? ms.filter(m => m && m.sprites && m.sprites.length === POOL) : [];
  };
  const smokePools = () => pools().filter(m => m.blendMode !== ADDITIVE);
  function repaint() { if (hooked) for (const m of smokePools()) paintCell(m); }   // a new picture shows on live smoke at once
  function unlogo() { for (const m of pools()) for (const s of m.sprites) if (s.cellIndex === LOGO) s.cellIndex = PUFF; }
  function clearCells() {
    for (const m of smokePools()) {
      const tex = m.texture;
      if (!painted.has(tex)) continue;
      try { const [lx, ly] = cellAt(LOGO); tex.getContext().clearRect(lx, ly, CELL, CELL); tex.update(); } catch { /* the atlas is gone */ }
      painted.delete(tex);
    }
  }

  /* ---- The sprite hook ---- */
  const STORE_SYM = Symbol.for("ssSmokeLogo.value");   // where the accessor keeps a sprite's gradient
  let chain = null;     // the accessor this script put on the sprite class: { proto, get, set, state, prev }
  let hooked = false;   // the accessor is installed and switched on

  // Called after the game gave a sprite its gradient. It sets size and startSize before animColors, so they are final here.
  function redirect(sprite, v) {
    if (!Array.isArray(v) || !v.length || !(sprite.size > MIN_SIZE) || !(sprite.startSize < 0) || sprite.cellIndex !== PUFF) return;
    const m = sprite._manager;
    if (!m || !m.sprites || m.sprites.length !== POOL || m.blendMode === ADDITIVE) return;
    if (paintCell(m)) sprite.cellIndex = LOGO;
  }
  const accessorOf = proto => Object.getOwnPropertyDescriptor(proto, "animColors");
  // Is our setter still reached when the game assigns a gradient? Another mod may have wrapped it (still reached), or
  // replaced the accessor (not reached). A throwaway object with the sprite class as its prototype finds out.
  function inChain(c) {
    c.state.seen = false;
    try { Object.create(c.proto).animColors = null; } catch { return false; }
    return c.state.seen;
  }
  // The sprite class of the current scene, or null while there is no scene (or no sprites) yet.
  function spriteProto() {
    const sc = window.P && window.P.scene, ms = sc && sc.spriteManagers;
    const mg = ms && ms.find(m => m && m.sprites && m.sprites.length);
    const proto = mg && Object.getPrototypeOf(mg.sprites[0]);
    return proto && proto !== Object.prototype ? proto : null;
  }
  function hook() {
    const proto = spriteProto();
    if (!proto) return false;
    const ms = window.P.scene.spriteManagers;
    if (chain && chain.proto !== proto) { dropChain(chain); chain = null; hooked = false; }
    // Taken out earlier but wrapped by another mod since, so it is still in the chain: switch it back on, don't stack another.
    if (chain && chain.proto === proto && inChain(chain)) { chain.state.live = true; hooked = true; return true; }
    // Another mod may already have an accessor here (Better HUD's Explosion Color): call it, so both keep working.
    const cur = accessorOf(proto);
    const prev = cur && (cur.get || cur.set) ? cur : null;
    const state = { live: true, seen: false };
    const get = function () { return prev && prev.get ? prev.get.call(this) : this[STORE_SYM]; };
    const set = function (v) {
      state.seen = true;
      if (prev && prev.set) prev.set.call(this, v); else this[STORE_SYM] = v;
      if (state.live && running) { try { redirect(this, v); } catch (err) { once("redirect", err); } }
    };
    try { Object.defineProperty(proto, "animColors", { configurable: true, enumerable: true, get, set }); } catch (err) { once("hook", err); return false; }
    chain = { proto, get, set, state, prev };
    hooked = true;
    // Sprites that already hold the value as their own property would hide the accessor: move it behind it. Values kept
    // by an earlier accessor of ours that another mod then replaced are handed to the new one the same way.
    for (const m of ms) for (const s of (m.sprites || [])) {
      if (Object.prototype.hasOwnProperty.call(s, "animColors")) { const v = s.animColors; delete s.animColors; s.animColors = v; }
      if (Object.prototype.hasOwnProperty.call(s, STORE_SYM)) { const v = s[STORE_SYM]; delete s[STORE_SYM]; s.animColors = v; }
    }
    return true;
  }
  // Switches our accessor off and, when it is still the top one, puts back what was there before. Returns true when it is gone.
  function dropChain(c) {
    c.state.live = false;   // if another mod wrapped ours since, ours stays in the chain and does nothing
    const cur = accessorOf(c.proto);
    if (!cur || cur.set !== c.set) return false;
    if (c.prev) { try { Object.defineProperty(c.proto, "animColors", c.prev); } catch { return false; } return true; }
    try { delete c.proto.animColors; } catch { return false; }
    const sc = window.P && window.P.scene;
    for (const m of (sc && sc.spriteManagers) || []) for (const s of (m.sprites || [])) {
      if (Object.prototype.hasOwnProperty.call(s, STORE_SYM)) { const v = s[STORE_SYM]; delete s[STORE_SYM]; s.animColors = v; }
    }
    return true;
  }
  function unhook() {
    if (!hooked) return;
    hooked = false;
    unlogo();
    clearCells();
    if (dropChain(chain)) chain = null;
  }

  /* ---- Settings > the speaker tab > Smoke Logo ---- */
  const CELL_ID = "ss-smoke-logo-cell";
  const CSS = `
#${CELL_ID} { min-width: 0; }
#${CELL_ID} .sssl-row { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5em; }
#${CELL_ID} .sssl-buttons { display: flex; flex-wrap: wrap; gap: 0.5em; min-width: 0; }
#${CELL_ID} .ss_button, #${CELL_ID} label { flex: none; }
#${CELL_ID} .sssl-preview { flex: none; box-sizing: border-box; width: 4.4em; height: 4.4em; border-radius: 0.4em; overflow: hidden; display: flex; align-items: center; justify-content: center;
  border: 0.12em solid var(--ss-blue3, #04a2d1); background: #8d99a3 conic-gradient(#aab4bc 25%, #8d99a3 0 50%, #aab4bc 0 75%, #8d99a3 0) 0 0 / 1.1em 1.1em; }
#${CELL_ID} .sssl-preview img { display: block; width: 100%; height: 100%; object-fit: contain; }
#${CELL_ID} .sssl-preview img[hidden], #${CELL_ID} .sssl-empty[hidden] { display: none; }
#${CELL_ID} .sssl-empty { text-align: center; padding: 0.2em; color: var(--ss-blue5, #0a4a63); }
#${CELL_ID} .sssl-note { margin: 0; min-height: 1.2em; }
#${CELL_ID} .sssl-note.sssl-bad { color: var(--ss-red, #d15354); }`;
  let ui = null, pending = null;

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  const NOTE = "Only you see it. The smoke keeps its shape and fade.";
  const sound = name => { try { window.BAWK?.play?.(name); } catch { /* sounds aren't ready */ } };
  function say(text) {
    if (!ui) return;
    ui.note.textContent = text || NOTE;
    ui.note.classList.toggle("sssl-bad", !!text);
    clearTimeout(say.t);
    if (text) say.t = setTimeout(() => say(""), 5000);
  }
  function injectUI() {
    const grid = document.querySelector("#settings_misc > .display-grid");
    if (!grid) return;
    if (ui) removeUI();
    const cell = el("div", "f_col");
    cell.id = CELL_ID;
    const on = el("input");
    on.type = "checkbox";
    const onLabel = el("label", "ss_checkbox label", "Show on grenade smoke ");
    onLabel.title = "Puts your picture on the smoke of grenade and rocket blasts, on your screen only. The puffs keep the game's shape, size, opacity and fade.";
    onLabel.append(on, el("span", "checkmark"));
    const onRow = el("div", "nowrap");
    onRow.append(onLabel);
    const img = el("img");
    img.alt = "Your smoke logo";
    const empty = el("span", "sssl-empty text_blue4", "No image");
    const preview = el("div", "sssl-preview");
    preview.append(img, empty);
    const pick = el("button", "ss_button btn_blue bevel_blue btn_sm", "Choose image");
    pick.type = "button";
    pick.title = "Pick a picture from this computer. It is shrunk to 128 px and kept in this browser only.";
    const remove = el("button", "ss_button btn_red bevel_red btn_sm", "Remove");
    remove.type = "button";
    remove.title = "Forget the picture.";
    const file = el("input");
    Object.assign(file, { type: "file", accept: "image/*", hidden: true });
    const note = el("p", "text_blue4 sssl-note", NOTE);
    note.setAttribute("role", "status");
    const buttons = el("div", "sssl-buttons");
    buttons.append(pick, remove);
    const row = el("div", "sssl-row");
    row.append(preview, buttons);
    cell.append(el("h3", "margin-bottom-none h-short", "Smoke Logo"), onRow, row, note, file);
    grid.append(cell);

    if (!document.getElementById(CELL_ID + "-style")) {
      const style = el("style", null, CSS);
      style.id = CELL_ID + "-style";
      (document.head || document.documentElement).append(style);
    }

    on.addEventListener("change", () => { sound("ui_onchange"); pending.enabled = on.checked && !!pending.image; refresh(); });
    pick.addEventListener("click", () => { sound("ui_click"); file.click(); });
    remove.addEventListener("click", () => { sound("ui_click"); pending.image = ""; pending.enabled = false; say(""); refresh(); });
    file.addEventListener("change", () => { take(file.files && file.files[0]); file.value = ""; });

    // The popup opening or closing puts the saved settings back in the controls, so a change only stays if Confirm
    // saved it (Cancel, the X and Esc all leave things as they were).
    const me = { cell, on, img, empty, pick, remove, note, io: null, shown: null };
    me.io = new IntersectionObserver(entries => {
      const shown = entries[entries.length - 1].isIntersecting;
      if (ui !== me || shown === me.shown) return;
      me.shown = shown;
      revert({ ...saved });
    });
    me.io.observe(cell.closest("#settings") || grid);
    ui = me;
    revert({ ...saved });
  }
  function removeUI() {
    if (!ui) return;
    ui.io.disconnect();
    ui.cell.remove();
    document.getElementById(CELL_ID + "-style")?.remove();
    clearTimeout(say.t);
    ui = null;
  }
  function revert(to) {
    pending = clean(to);
    say("");
    refresh();
  }
  function refresh() {
    if (!ui) return;
    const p = pending || saved;
    ui.on.checked = p.enabled;
    ui.on.disabled = !p.image;
    ui.remove.disabled = !p.image;
    ui.img.hidden = !p.image;
    ui.empty.hidden = !!p.image;
    if (p.image) ui.img.src = p.image; else ui.img.removeAttribute("src");
  }

  // A picked file becomes a 128 px square PNG: the whole picture, with transparent margins, kept in pending until Confirm.
  function take(f) {
    if (!f) return;
    if (!/^image\//.test(f.type) || f.size > 8e6) return say("Pick an image file under 8 MB.");
    const use = src => {
      const w = src.naturalWidth || src.width, h = src.naturalHeight || src.height;
      if (!w || !h) throw new Error("empty image");
      const c = document.createElement("canvas");
      c.width = c.height = CELL;
      const k = Math.min(CELL / w, CELL / h);
      c.getContext("2d").drawImage(src, (CELL - w * k) / 2, (CELL - h * k) / 2, w * k, h * k);
      const data = c.toDataURL("image/png");
      if (!pending || !clean({ image: data }).image) throw new Error("image too big");
      pending.image = data;
      pending.enabled = true;
      say("");
      refresh();
    };
    const bad = e => say(e && e.message === "image too big" ? "That image is too detailed. Try a simpler one." : "Could not use that image.");
    const viaReader = () => {
      const r = new FileReader();
      r.onload = () => { const im = new Image(); im.onload = () => { try { use(im); } catch (e) { bad(e); } }; im.onerror = () => bad(); im.src = r.result; };
      r.onerror = () => bad();
      r.readAsDataURL(f);
    };
    if (typeof createImageBitmap === "function") createImageBitmap(f).then(b => { try { use(b); } catch (e) { bad(e); } finally { b.close && b.close(); } }, viaReader);
    else viaReader();
  }

  // The game's Confirm, Reset to Defaults and Cancel buttons, under the tabs.
  function onClick(e) {
    if (!ui || !pending) return;
    const b = e.target instanceof Element && e.target.closest("#settings .grid-column-3-eq > button");
    if (!b || b.classList.contains("ss_bigtab")) return;
    if (b.classList.contains("btn_green")) save(pending);
    else if (b.classList.contains("btn_yolk")) revert({ image: saved.image, enabled: false });
    else if (b.classList.contains("btn_red")) revert({ ...saved });
  }

  // For the Mod Menu's shortcut: opens Settings on the speaker tab, where the Smoke Logo cell is.
  function openSettings() {
    const app = window.vueApp;
    if (!running || standDown || !app || typeof app.showSettingsPopup !== "function") return false;
    try {
      app.showSettingsPopup();
      const tab = document.getElementById("misc_button");
      if (tab) tab.click();
      else if (typeof app.onSettingsPopupSwitchTabMisc === "function") app.onSettingsPopupSwitchTabMisc();
    } catch (err) { warn(err); return false; }
    tick();
    return true;
  }

  /* ---- On and off ---- */
  let running = false, timer = 0, standDown = false;
  // A Better HUD build with its own Smoke Logo row (it would use the same atlas cell): let that one run.
  const betterHudHasLogo = () => typeof window.__ssbSmokeLogoRow === "function";
  // Every second: hook the sprite class while a logo is wanted (again, if it was replaced or removed), take the hook out
  // while it is not, and put the settings cell back if Vue removed it.
  function tick() {
    if (!running) return;
    if (!standDown && betterHudHasLogo()) {
      standDown = true;
      unhook(); removeUI();
      try { window.ssModMenu?.unregister?.("smoke-logo"); } catch { /* no Mod Menu */ }
      once("standdown", "Better HUD has its own Smoke Logo: standing down.");
    }
    if (standDown) return;
    if (wanted()) { if (!hooked || !inChain(chain) || (spriteProto() || chain.proto) !== chain.proto) { hooked = false; hook(); } } else if (hooked) unhook();
    if (!ui || !ui.cell.isConnected) injectUI();
  }
  function start() {
    if (running) return;
    running = true;
    document.addEventListener("click", onClick, true);
    if (saved.image && !logoImg) loadImage();
    tick();
    timer = setInterval(tick, 1000);
  }
  function stop() {
    if (!running) return;
    running = false;
    clearInterval(timer);
    document.removeEventListener("click", onClick, true);
    unhook();
    removeUI();
    logoImg = null;
  }

  window.ssSmokeLogo = {
    version: VERSION,
    settings: () => ({ ...saved }),
    set(s) {
      const next = { ...saved, ...s };
      if (s && s.image && !clean({ image: s.image }).image) next.image = saved.image;   // a bad picture is ignored, the old one stays
      save(next);
      if (ui) revert({ ...saved });
      return { ...saved };
    },
    status: () => ({ running, standDown, enabled: saved.enabled, hasImage: !!saved.image, logoReady: !!logoImg, hooked: hooked && inChain(chain), blocked, settingsShown: !!ui && ui.cell.isConnected }),
  };

  start();
  // The Mod Menu (if it's installed) lists it with an on/off switch and a shortcut to these settings.
  (window.ssModMenuQueue = window.ssModMenuQueue || []).push({
    id: "smoke-logo", name: "Smoke Logo", version: VERSION, group: "mod",
    description: "Your own picture on the smoke of grenade and rocket blasts, on your screen only.",
    enable: start, disable: stop, openSettings,
  });
})();
