<div align="center">

# Shell Shockers — Smoke Logo

**Put your own picture on the smoke of grenade and rocket blasts in [Shell Shockers](https://shellshock.io). Pick an image, press Confirm, and the next blast leaves a cloud with your logo on it. Only you see it.**

<br>

[![Install Smoke Logo](https://img.shields.io/badge/Install_Smoke_Logo-one_click-2ea44f?style=for-the-badge&logo=tampermonkey&logoColor=white)](https://raw.githubusercontent.com/Virojet/Shell-Shockers-Smoke-Logo/main/Shell-Shockers-Smoke-Logo.user.js)

[![Version](https://img.shields.io/badge/version-1.0.1-0E7697?style=flat-square)](./Shell-Shockers-Smoke-Logo.user.js)
[![License: MIT](https://img.shields.io/badge/license-MIT-lightgrey?style=flat-square)](./LICENSE)

</div>

---

## Install

1. **Get Tampermonkey** for your browser: [Chrome](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) · [Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd) · [Firefox](https://addons.mozilla.org/firefox/addon/tampermonkey/) · [Opera GX & others](https://www.tampermonkey.net/) (or use [Violentmonkey](https://violentmonkey.github.io/))
2. **[Click here to install Smoke Logo](https://raw.githubusercontent.com/Virojet/Shell-Shockers-Smoke-Logo/main/Shell-Shockers-Smoke-Logo.user.js)**, then press **Install** on the page that opens
3. **Reload [shellshock.io](https://shellshock.io)**

> [!TIP]
> **No Smoke Logo in Settings?** Chrome, Edge, Brave and Opera need one extra switch: open your browser's **Extensions** page → **Tampermonkey** → **Details** → turn on **Allow User Scripts**. Then reload the game. [Step by step for each browser](https://github.com/Virojet/Shell-Shockers-Better-Hud-Mod#allow-user-scripts)

## Use it

Open **Settings** ▸ the **third tab** (the screen and speaker icons). **Smoke Logo** is in the grid there.

1. Press **Choose image** and pick a picture from your computer: a PNG, JPG, GIF, WebP or SVG under 8 MB. The small box shows what you picked.
2. Tick **Show on grenade smoke**.
3. Press **Confirm**: the green button that appears next to the picture as soon as you change something. The game's own **Confirm** at the bottom of Settings does the same, so use whichever you can reach (on a small window the bottom of Settings can be off screen).

Throw a grenade. The smoke of the blast carries your picture.

Like the game's settings around it, a change is kept when you press **Confirm**. **Cancel** or the **X** leaves things as they were. **Reset to Defaults** switches the logo off and keeps your picture, so you can switch it on again. **Remove** forgets the picture (press **Confirm** to keep that).

If you have the [Mod Menu](https://github.com/Virojet/Shell-Shockers-Mod-Menu), Smoke Logo is in its list with an on and off switch and a shortcut to these settings.

## What you see

- **The smoke is still the game's smoke.** The puffs keep their shape, size, opacity and fade, so a cloud hides and reveals exactly what it always did. Only the picture on the puffs changes, and it's checked pixel for pixel that the smoke's transparency is the game's own.
- **Your picture sits on each puff**, a little inside the puff's soft round edge, and moves, spins and fades with it. The smoke still shades it, so bright, high-contrast pictures read best, and a transparent PNG shows only its drawing.
- **Only you see it.** Other players keep seeing the game's smoke. Nothing is sent to them or to the game's servers.
- **Which smoke:** the smoke of grenade and rocket blasts (the game draws both with the same code). The fire of a blast, bullet puffs, rocket trails and the special smoke of item grenades that come with their own shape are left as they are.

## Limits

- Settings and the picture are kept **per site**: shellshock.io and each mirror site keep their own.
- The picture is shrunk to 128 pixels square when you pick it, so very fine detail is lost.
- It's a look for your own screen. It doesn't show anything the game doesn't, and it doesn't change how smoke blocks your view.
- Smoke Logo hooks into how the game sets up its smoke. If a game update changes that, the logo simply stops showing and the game's own smoke comes back. Nothing else breaks.
- It works alone. If a future Better HUD has its own Smoke Logo, this script stands down and lets that one run.

## Turning it off

Untick **Show on grenade smoke** and press **Confirm**, or switch the script off in Tampermonkey and reload the game. Either way the game's own smoke comes straight back.

## Privacy

- **Nothing is sent anywhere.** The script makes no network requests at all, not even an install count.
- **Your picture** is read in your browser when you pick it, shrunk there, and kept in this site's local storage under `ssSmokeLogo`, together with the on/off switch. Clearing the site's data, or **Remove**, deletes it.

## Changelog

#### v1.0.1 — current

- **Confirm now always reachable.** Smoke Logo has its own **Confirm** button next to the picture, so a change can be kept even when the bottom of the Settings window is cut off (this happened on small or zoomed windows when other mods add settings to the same tab, which made the game's **Confirm** impossible to click).
- The Smoke Logo block is smaller: it spans the tab's width, the heading and the tick box share a line, and the picture and buttons share another.
- A short line next to the buttons says what to press next (and what went wrong, in red, if a picture can't be used).

#### v1.0.0

- First release: your own picture on the smoke of grenade and rocket blasts, on your screen only.

## License

[MIT](./LICENSE)
