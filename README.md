# Milwaukee Events

Event feed and calendar for Milwaukee: Fiserv Forum, American Family Field,
the UW–Milwaukee Panther Arena, the Miller High Life Theatre, the Pabst
Theater Group's rooms (Riverside, Pabst, Turner Hall, Vivarium), the Marcus
Center (Uihlein Hall, Todd Wehr, Vogel Hall), the Bradley Symphony Center, the
Summerfest grounds' stages, the Rave and the clubs, and State Fair Park — with
the home teams' seasons (Bucks, Brewers, Admirals, Packers; Marquette and the
Panthers from November) in a Teams view.

Live at **https://milwaukee.here.events/** once the domain is wired (GitHub
Pages, built by the Actions workflow once a day at noon Central).

A sister city on the lqa-events codebase, built from the Chicago copy:
everything that makes this Milwaukee's is `site/city.js` (every team, venue,
type, default, share-code registry and string), `site/index.html`,
`scripts/fetch-events.mjs` (the sources), `scripts/sources.mjs`,
`site/embed.js`, `outlook.json`, `channels.json`, `scripts/data/postseason.json`,
the manifest and icons (the People's Flag sunrise, rendered from
`favicon.svg`). Everything else is lqa-events' own, byte for byte — copy from
there, never edit here.

## Embed

```html
<div id="milwaukee-events"></div>
<script src="https://milwaukee.here.events/embed.js" data-max="8" defer></script>
```

## Sources

- **Ticketmaster Discovery API** — every room by its venue id (every page):
  20 rooms, from the arena to the 200-seat clubs. There is no city sweep (it
  would pull in Madison and the Dells; the Fiserv Forum garages are venues of
  their own, excluded by title). Calls are paced a second apart with a 429
  back-off, because seven sister builds share the key. Church events are left
  out (`isChurch`).
- **Seasons** — ESPN for the Bucks, the Packers, Marquette and the Panthers;
  MLB's stats API for the Brewers; the AHL's HockeyTech feed for the Admirals
  (`scripts/schedules.mjs`, shared with lqa).

Next to add: the rooms whose shows Ticketmaster never lists (the Back Room at
Colectivo, Anodyne, the Cooperage, the Milwaukee Rep, the Ballet), the
Summerfest grounds' festival season, and the Wave at the Panther Arena.

## Local run

```sh
cp .env.example .env   # TICKETMASTER_API_KEY=…
ALLOW_NO_ARCHIVE=1 node scripts/fetch-events.mjs   # ALLOW_NO_ARCHIVE only until the site has published once
node --test scripts/*.test.mjs
```
