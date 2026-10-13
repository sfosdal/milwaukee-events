// The city — every fact that makes this calendar Milwaukee's rather than
// another town's, in one place (2026-10-11: a sister of lqa-events, built
// from the Chicago copy). The browser (filter.js, app.js) and the build
// (scripts/*.mjs) both read it; nothing else names a venue or a team. The
// shared files (app.js, filter.js, styles.css bar its --v-* hues,
// scripts/*.mjs bar fetch-events.mjs and sources.mjs) are lqa-events' own,
// byte for byte — see README "Sister sites".
//
// Loaded before filter.js (a plain script, so the tests can share it): it
// sets globalThis.LQACity (the name is the shared code's, not the city's).
(function (global) {
  'use strict';

  // The home teams, matched on the event title whatever the venue. Order =
  // the Teams strip, left to right. Per team:
  //   re        the title match
  //   venue     the home building; schedule = the club's own schedule page
  //   sport     keys the strip icon (app.js SPORT_ICONS), the game clock,
  //             the leader categories
  //   colors    [primary, accent] — the season calendar's home cells and
  //             card frames
  //   espn      ESPN's sport/league/team id — the season, the form block,
  //             news and transactions come from there (schedules.mjs); the
  //             Brewers' season from MLB's stats API (first-pitch times, the
  //             standings), the Admirals' from the AHL's HockeyTech feed
  //   division  (baseball) the division rivals by the abbreviations the
  //             schedule carries, for the standings line
  //   strip     false = a filter row but no tab in the Teams view: the
  //             college seasons are empty on ESPN until November, and an
  //             empty season breaks the view (flip to true in November)
  //   club      the club's name on Ticketmaster; news the outlets' feeds;
  //             wiki the article; opens when the season usually starts
  // The Packers play 120 miles north at Lambeau Field, so no game of theirs
  // is a Milwaukee listing (no venue here, no `inject`) — they are in the
  // Teams view alone, as Everett's Seattle clubs.
  var MLB = function (slug) { return ['https://www.mlb.com/' + slug + '/feeds/news/rss.xml', 'MLB.com']; };
  var AHL = { league: 'ahl', key: 'ccb91f29d6744675' }; // the AHL's HockeyTech modulekit (schedules.mjs `hockeytech`)
  var TEAMS = [
    { slug: 'bucks', label: 'Bucks', re: /\bbucks\b/i, sport: 'basketball', venue: 'Fiserv Forum', colors: ['#00471b', '#eee1c6'],
      espn: { sport: 'basketball', league: 'nba', id: '15' }, season: { kind: 'espn' }, form: { kind: 'espn' },
      logo: 'https://a.espncdn.com/i/teamlogos/nba/500/mil.png', schedule: 'https://www.nba.com/bucks/schedule',
      club: 'Milwaukee Bucks', opens: 'late October', wiki: { title: 'Milwaukee Bucks' } },
    { slug: 'brewers', label: 'Brewers', re: /\bbrewers\b/i, sport: 'baseball', venue: 'American Family Field', colors: ['#13294b', '#ffc72c'],
      espn: { sport: 'baseball', league: 'mlb', id: '8' }, season: { kind: 'mlb', id: 158 }, form: { kind: 'espn' },
      logo: 'https://a.espncdn.com/i/teamlogos/mlb/500/mil.png', schedule: 'https://www.mlb.com/brewers/schedule',
      club: 'Milwaukee Brewers', opens: 'late March', wiki: { title: 'Milwaukee Brewers' },
      division: ['CHC', 'STL', 'CIN', 'PIT'], // NL Central
      news: [MLB('brewers')] },
    // AHL (the Predators' farm club); the season from the league's HockeyTech feed, as Everett's Silvertips
    { slug: 'admirals', label: 'Admirals', name: 'Milwaukee Admirals', abbr: 'MIL', re: /\badmirals\b/i, sport: 'hockey', venue: 'UW–Milwaukee Panther Arena', colors: ['#041e42', '#6cace4'],
      season: { kind: 'hockeytech', league: AHL.league, key: AHL.key, id: 327, leagueName: 'AHL' }, form: { kind: 'hockeytech', league: AHL.league, key: AHL.key, id: 327 },
      logo: 'https://assets.leaguestat.com/ahl/logos/327.png', schedule: 'https://www.milwaukeeadmirals.com/schedule',
      club: 'Milwaukee Admirals', opens: 'mid October', wiki: { title: 'Milwaukee Admirals' } },
    { slug: 'packers', label: 'Packers', re: /\bpackers\b/i, sport: 'football', venue: 'Lambeau Field', colors: ['#203731', '#ffb612'],
      espn: { sport: 'football', league: 'nfl', id: '9' }, season: { kind: 'espn' }, form: { kind: 'espn' },
      logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/gb.png', schedule: 'https://www.packers.com/schedule/',
      club: 'Green Bay Packers', opens: 'September', wiki: { title: 'Green Bay Packers', startYear: true },
      news: [['https://www.packers.com/rss/news', 'Packers.com']] },
    // College basketball: Marquette at Fiserv Forum, UWM at the Panther Arena —
    // the games come from the rooms' Ticketmaster listings; their seasons are
    // empty on ESPN until November, so no Teams tab yet (strip: false was set 2026-10-11 (lifted the same night: schedules.mjs now merges the regular season for college basketball))
    { slug: 'marquette', label: 'Marquette', name: 'Marquette Golden Eagles', abbr: 'MARQ', re: /marquette/i, sport: 'basketball', venue: 'Fiserv Forum', colors: ['#003366', '#ffcc00'],
      espn: { sport: 'basketball', league: 'mens-college-basketball', id: '269' }, season: { kind: 'espn' }, form: { kind: 'espn' },
      logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/269.png', schedule: 'https://gomarquette.com/sports/mens-basketball/schedule',
      club: 'Marquette Golden Eagles', opens: 'November', wiki: { title: "Marquette Golden Eagles men's basketball", teamPage: true } },
    { slug: 'panthers', label: 'Panthers', name: 'Milwaukee Panthers', abbr: 'MILW', re: /milwaukee panthers|uwm panthers|\bpanthers\b/i, sport: 'basketball', venue: 'UW–Milwaukee Panther Arena', colors: ['#000000', '#ffc20e'],
      espn: { sport: 'basketball', league: 'mens-college-basketball', id: '270' }, season: { kind: 'espn' }, form: { kind: 'espn' },
      logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/270.png', schedule: 'https://mkepanthers.com/sports/mens-basketball/schedule',
      club: 'Milwaukee Panthers', opens: 'November', wiki: { title: "Milwaukee Panthers men's basketball", teamPage: true } },
  ];

  // The venues, one record each — downtown and the stadiums first by size,
  // then the music rooms and the rest of town. Per venue:
  //   capacity how many people the place holds
  //   area     'town' for the music rooms across the city and West Allis
  //            (the panel's second group); absent = downtown and the
  //            stadiums
  //   type     the event type when the title decides nothing
  //   cssVar   the hue styles.css sets for it (dark block --v-*); color
  //            the same hue as a value, for the series graph
  //   url      the venue's own events listing — not a ticket vendor
  //   icon     a mark for listings without a team crest
  //   tm       its Ticketmaster Discovery listing (fetch-events.mjs reads
  //            the venue by id — every page). There is NO city sweep here:
  //            a Milwaukee sweep would pull in Madison and the Dells, and
  //            the Fiserv Forum garages are listed as venues of their own
  //   alias    the other spellings the feeds use for it, folded to this name
  // No festivals yet, so the panel's Festivals group folds away (app.js).
  var VENUES = {
    // --- Downtown and the stadiums: the Deer District, the ballpark, the Marcus Center, the lakefront stages ---
    'Fiserv Forum': {
      capacity: 17341,
      type: 'sports',
      cssVar: '--v-fiserv',
      color: '#ea8686',
      url: 'https://www.fiservforum.com/events',
      icon: 'https://www.google.com/s2/favicons?domain=www.fiservforum.com&sz=128',
      tm: { id: 'KovZ917A_fV', match: 'fiserv forum', fallbackUrl: 'https://www.fiservforum.com/events', exclude: /parking|tour/i },
      alias: /fiserv forum/i,
    },
    'American Family Field': {
      capacity: 41900,
      type: 'sports',
      cssVar: '--v-amfam',
      color: '#86eaa3',
      url: 'https://www.mlb.com/brewers/schedule',
      icon: 'https://www.google.com/s2/favicons?domain=www.mlb.com&sz=128',
      tm: { id: 'KovZpZA1FlkA', match: 'american family field', fallbackUrl: 'https://www.mlb.com/brewers/schedule', exclude: /parking|tour/i },
      alias: /american family field|miller park/i,
    },
    'UW–Milwaukee Panther Arena': {
      capacity: 12700,
      type: 'sports',
      cssVar: '--v-panther',
      color: '#c086ea',
      url: 'https://www.uwmpantherarena.com/events',
      icon: 'https://www.google.com/s2/favicons?domain=www.uwmpantherarena.com&sz=128',
      tm: { id: 'KovZpZAJ61EA', match: 'panther arena', fallbackUrl: 'https://www.uwmpantherarena.com/events', exclude: /parking/i },
      alias: /panther arena/i,
    },
    'Miller High Life Theatre': {
      capacity: 4086,
      type: 'concert',
      cssVar: '--v-mhl',
      color: '#eadd86',
      url: 'https://www.millerhighlifetheatre.com/events',
      icon: 'https://www.google.com/s2/favicons?domain=www.millerhighlifetheatre.com&sz=128',
      tm: { id: 'KovZpZAdJEnA', match: 'miller high life theatre', fallbackUrl: 'https://www.millerhighlifetheatre.com/events' },
      alias: /miller high life theat|milwaukee theatre/i,
    },
    'Riverside Theater': {
      capacity: 2450,
      type: 'concert',
      cssVar: '--v-riverside',
      color: '#86d9ea',
      url: 'https://www.pabsttheatergroup.com/',
      icon: 'https://www.google.com/s2/favicons?domain=www.pabsttheatergroup.com&sz=128',
      tm: { id: 'KovZpZA1IdeA', match: 'riverside', fallbackUrl: 'https://www.pabsttheatergroup.com/' },
      alias: /riverside theat/i,
    },
    'Pabst Theater': {
      capacity: 1345,
      type: 'concert',
      cssVar: '--v-pabst',
      color: '#ea86bc',
      url: 'https://www.pabsttheatergroup.com/',
      icon: 'https://www.google.com/s2/favicons?domain=www.pabsttheatergroup.com&sz=128',
      tm: { id: 'KovZpZAal6EA', match: 'pabst', fallbackUrl: 'https://www.pabsttheatergroup.com/' },
      alias: /pabst theat/i,
    },
    'Uihlein Hall': {
      capacity: 2305,
      type: 'arts',
      cssVar: '--v-uihlein',
      color: '#9fea86',
      url: 'https://www.marcuscenter.org/events',
      icon: 'https://www.google.com/s2/favicons?domain=www.marcuscenter.org&sz=128',
      tm: { id: 'KovZpZAEAkaA', match: 'uihlein hall', fallbackUrl: 'https://www.marcuscenter.org/events' },
      alias: /uihlein hall/i,
    },
    'Todd Wehr Theater': {
      capacity: 500,
      type: 'arts',
      cssVar: '--v-wehr',
      color: '#8a86ea',
      url: 'https://www.marcuscenter.org/events',
      icon: 'https://www.google.com/s2/favicons?domain=www.marcuscenter.org&sz=128',
      tm: { id: 'Z7r9jZaAvC', match: 'todd wehr', fallbackUrl: 'https://www.marcuscenter.org/events' },
      alias: /todd wehr/i,
    },
    'Wilson Theater at Vogel Hall': {
      capacity: 500,
      type: 'arts',
      cssVar: '--v-vogel',
      color: '#eaa786',
      url: 'https://www.marcuscenter.org/events',
      icon: 'https://www.google.com/s2/favicons?domain=www.marcuscenter.org&sz=128',
      tm: { id: 'KovZpZAEAk1A', match: 'vogel hall', fallbackUrl: 'https://www.marcuscenter.org/events' },
      alias: /vogel hall|wilson theat/i,
    },
    'Bradley Symphony Center': {
      capacity: 1750,
      type: 'arts',
      cssVar: '--v-bradley',
      color: '#86eac4',
      url: 'https://www.mso.org/events/',
      icon: 'https://www.google.com/s2/favicons?domain=www.mso.org&sz=128',
      tm: { id: 'KovZ917AIWB', match: 'bradley symphony center', fallbackUrl: 'https://www.mso.org/events/' },
      alias: /bradley symphony/i,
    },
    'American Family Insurance Amphitheater': {
      capacity: 23000,
      type: 'concert',
      cssVar: '--v-amphitheater',
      color: '#e186ea',
      url: 'https://www.summerfest.com/amphitheater/',
      icon: 'https://www.google.com/s2/favicons?domain=www.summerfest.com&sz=128',
      tm: { id: 'KovZpZAJeenA', match: 'american family insurance amphitheater', fallbackUrl: 'https://www.summerfest.com/amphitheater/', exclude: /parking/i },
      alias: /american family insurance amphitheat|marcus amphitheat/i,
    },
    'BMO Pavilion': {
      capacity: 10000,
      type: 'concert',
      cssVar: '--v-bmo',
      color: '#d5ea86',
      url: 'https://www.summerfest.com/',
      icon: 'https://www.google.com/s2/favicons?domain=www.summerfest.com&sz=128',
      tm: { id: 'KovZpZAFAEeA', match: 'bmo pavilion', fallbackUrl: 'https://www.summerfest.com/' },
      alias: /bmo pavilion|bmo harris pavilion/i,
    },
    // --- Music rooms and the rest of town (`area: 'town'`): the Rave, the Pabst group's smaller rooms, the clubs, Cudahy and West Allis ---
    'The Rave': {
      area: 'town',
      capacity: 3500,
      type: 'concert',
      cssVar: '--v-rave',
      color: '#86b7ea',
      url: 'https://www.therave.com/',
      icon: 'https://www.google.com/s2/favicons?domain=www.therave.com&sz=128',
      tm: { id: 'KovZpZAFAJdA', match: 'rave', fallbackUrl: 'https://www.therave.com/' },
      alias: /the rave|eagles club|eagles ballroom/i,
    },
    'Turner Hall Ballroom': {
      area: 'town',
      capacity: 1000,
      type: 'concert',
      cssVar: '--v-turner',
      color: '#ea869a',
      url: 'https://www.pabsttheatergroup.com/',
      icon: 'https://www.google.com/s2/favicons?domain=www.pabsttheatergroup.com&sz=128',
      tm: { id: 'KovZpZA1I6lA', match: 'turner hall', fallbackUrl: 'https://www.pabsttheatergroup.com/' },
      alias: /turner hall/i,
    },
    'Shank Hall': {
      area: 'town',
      capacity: 300,
      type: 'concert',
      cssVar: '--v-shank',
      color: '#86ea8e',
      url: 'https://www.shankhall.com/',
      icon: 'https://www.google.com/s2/favicons?domain=www.shankhall.com&sz=128',
      tm: { id: 'KovZpZAFAJeA', match: 'shank hall', fallbackUrl: 'https://www.shankhall.com/' },
      alias: /shank hall/i,
    },
    'Cactus Club': {
      area: 'town',
      capacity: 200,
      type: 'concert',
      cssVar: '--v-cactus',
      color: '#ab86ea',
      url: 'https://cactusclubmilwaukee.com/',
      icon: 'https://www.google.com/s2/favicons?domain=cactusclubmilwaukee.com&sz=128',
      tm: { id: 'KovZpZAE66IA', match: 'cactus club', fallbackUrl: 'https://cactusclubmilwaukee.com/' },
      alias: /cactus club/i,
    },
    'X-Ray Arcade': {
      area: 'town',
      capacity: 300,
      type: 'concert',
      cssVar: '--v-xray',
      color: '#eac886',
      url: 'https://www.x-rayarcade.com/',
      icon: 'https://www.google.com/s2/favicons?domain=www.x-rayarcade.com&sz=128',
      tm: { id: 'KovZpa8KXe', match: 'x-ray arcade', fallbackUrl: 'https://www.x-rayarcade.com/' },
      alias: /x-?ray arcade/i,
    },
    'Vivarium': {
      area: 'town',
      capacity: 500,
      type: 'concert',
      cssVar: '--v-vivarium',
      color: '#86eae6',
      url: 'https://www.pabsttheatergroup.com/',
      icon: 'https://www.google.com/s2/favicons?domain=www.pabsttheatergroup.com&sz=128',
      tm: { id: 'KovZ917ASYq', match: 'vivarium', fallbackUrl: 'https://www.pabsttheatergroup.com/' },
      alias: /vivarium/i,
    },
    'Miramar Theatre': {
      area: 'town',
      capacity: 400,
      type: 'concert',
      cssVar: '--v-miramar',
      color: '#ea86d0',
      url: 'https://www.themiramartheatre.com/',
      icon: 'https://www.google.com/s2/favicons?domain=www.themiramartheatre.com&sz=128',
      tm: { id: 'KovZpZAalInA', match: 'miramar', fallbackUrl: 'https://www.themiramartheatre.com/' },
      alias: /miramar theat/i,
    },
    'Wisconsin State Fair Park': {
      area: 'town',
      capacity: 10000,
      type: 'community',
      cssVar: '--v-statefair',
      color: '#b3ea86',
      url: 'https://wistatefair.com/fair/events/',
      icon: 'https://www.google.com/s2/favicons?domain=wistatefair.com&sz=128',
      tm: { id: 'KovZpZAIAnFA', match: 'state fair', fallbackUrl: 'https://wistatefair.com/fair/events/', exclude: /parking/i },
      alias: /state fair/i,
    },
  };

  // The usual view: every room on — nothing here lists nightly bar programs
  var DEFAULT_ON = ['Fiserv Forum', 'American Family Field', 'UW–Milwaukee Panther Arena', 'Miller High Life Theatre', 'Riverside Theater', 'Pabst Theater', 'Uihlein Hall', 'Todd Wehr Theater', 'Wilson Theater at Vogel Hall', 'Bradley Symphony Center', 'American Family Insurance Amphitheater', 'BMO Pavilion', 'The Rave', 'Turner Hall Ballroom', 'Shank Hall', 'Cactus Club', 'X-Ray Arcade', 'Vivarium', 'Miramar Theatre', 'Wisconsin State Fair Park'];
  var DEFAULT_OFF = [];
  var PREFS_KNOWN_FROM = null; // no default-off venue yet, so nothing for saved prefs to be told about

  // Event types: every event lands in exactly one, from its flags, title,
  // then venue. The rows the panel shows, in order.
  var TYPES = [
    { key: 'concert', label: 'Concerts', title: 'Live music — the Amphitheater to Shank Hall' },
    { key: 'sports', label: 'Sports', title: 'Bucks, Brewers, Admirals, Marquette and Panthers home games' },
    { key: 'arts', label: 'Arts & Theater', title: 'The Marcus Center, the MSO, comedy, dance' },
    { key: 'community', label: 'Community', title: 'State Fair Park, festivals, family days' },
  ];
  var MOVIE_VENUE = null; // no cinema here

  // Share codes (?f=CODE): REGISTRY is every filterable key in a fixed
  // order and a code is a bitmask over it, so the list is APPEND-ONLY —
  // adding an entry adds a bit and every existing code keeps meaning what
  // it meant; removing or reordering one changes every link out there.
  // 34 slots from the first build: seven base-36 digits.
  var CODE_LENGTH = 7;
  var REGISTRY = [
    ['venue', 'Fiserv Forum'], ['venue', 'American Family Field'], ['venue', 'UW–Milwaukee Panther Arena'], ['venue', 'Miller High Life Theatre'], ['venue', 'Riverside Theater'], ['venue', 'Pabst Theater'], ['venue', 'Uihlein Hall'], ['venue', 'Todd Wehr Theater'], ['venue', 'Wilson Theater at Vogel Hall'], ['venue', 'Bradley Symphony Center'], ['venue', 'American Family Insurance Amphitheater'], ['venue', 'BMO Pavilion'], ['venue', 'The Rave'], ['venue', 'Turner Hall Ballroom'], ['venue', 'Shank Hall'], ['venue', 'Cactus Club'], ['venue', 'X-Ray Arcade'], ['venue', 'Vivarium'], ['venue', 'Miramar Theatre'], ['venue', 'Wisconsin State Fair Park'],
    ['badge', 'concert'], ['badge', 'sports'], ['badge', 'arts'], ['badge', 'community'],
    ['team', 'bucks'], ['team', 'brewers'], ['team', 'admirals'], ['team', 'packers'], ['team', 'marquette'], ['team', 'panthers'],
    ['cap', 'stadium'], ['cap', 'arena'], ['cap', 'hall'], ['cap', 'room'],
  ];

  // The words the page uses for the place
  var WORDS = {
    teamCity: 'Milwaukee', // the board drops it from the clubs' names ("Milwaukee Bucks" → Bucks)
    presetDefault: 'Every room — the arena, the ballpark, the Marcus Center, the lakefront stages and the music rooms — every team and type',
    presetNeighborhood: 'Downtown and the stadiums only',
    presetBig: 'Only the places that hold 2,000 or more — the arenas, the ballpark, the Amphitheater and the big theatres',
    phrases: { all: 'Showing everything.', none: 'Showing nothing yet — open Filter and pick some venues.', neighborhood: 'Showing downtown and the stadiums only.', big: 'Showing the big rooms only — the arenas, the ballpark, the Amphitheater and the big theatres.' },
  };

  global.LQACity = {
    key: 'milwaukee',
    name: 'Milwaukee',
    site: 'https://milwaukee.here.events/',
    userAgent: 'Mozilla/5.0 (compatible; milwaukee-events/1.0; +https://milwaukee.here.events/)',
    tz: 'America/Chicago', tzName: 'Central', // the city's time zone: the ICS feed's TZID, the game clocks, the poster's footer
    state: "Wisconsin", stateOutline: 'M8.9 21.9L8.8 21.5L8.0 21.1L7.5 20.4L7.4 19.5L7.5 18.7L7.3 18.4L7.2 18.1L7.0 16.6L6.7 15.8L5.8 15.2L5.2 14.5L4.5 13.9L4.0 13.7L3.6 13.3L3.0 13.1L2.7 12.7L2.6 12.3L2.7 11.7L2.7 11.1L2.7 10.4L2.9 9.8L2.7 9.3L2.3 8.9L2.6 8.3L2.9 7.8L3.8 7.3L4.1 7.1L4.1 5.9L4.1 4.7L4.4 4.5L4.6 4.3L5.4 4.2L6.1 3.8L7.1 3.2L8.3 2.4L9.4 2.0L10.4 2.1L10.7 2.5L10.4 3.2L10.1 3.9L9.7 4.6L9.6 5.2L9.8 5.2L10.1 5.3L10.3 5.7L10.4 6.0L11.2 6.2L11.9 6.4L12.6 6.6L13.3 6.8L13.8 7.1L14.2 7.3L14.8 7.4L15.6 7.5L16.3 7.8L16.3 8.2L17.1 8.6L17.2 8.9L17.2 9.2L17.0 9.7L17.0 10.0L17.1 10.1L17.5 10.0L17.6 10.1L17.4 10.6L17.5 10.9L18.2 11.3L18.8 10.4L19.7 9.7L21.1 10.2L21.3 11.0L20.4 12.2L19.8 14.2L19.3 16.2L19.1 17.5L19.2 19.8L19.4 22.0L16.8 22.0L14.2 22.0L11.5 21.9L8.9 21.9Z', // the masthead's small state, linking to here.events (scripts/state-outline.mjs, Natural Earth 1:50m)
    // the calendar feed's header; the UID domain never changes (changing it
    // re-creates every event in subscribers' calendars)
    ics: { name: 'Milwaukee Events', short: 'Milwaukee Events', teams: 'Milwaukee home teams — every season', prodid: '-//here.events//milwaukee-events//EN', uidDomain: 'fosdal.net', // the UID domain the whole family issues (the shared ics test pins it)
      desc: 'Upcoming events around Milwaukee\\, WI — Fiserv Forum\\, American Family Field\\, the Panther Arena\\, the Marcus Center and the music rooms' },
    teams: TEAMS,
    venues: VENUES,
    defaultOn: DEFAULT_ON,
    defaultOff: DEFAULT_OFF,
    prefsKnownFrom: PREFS_KNOWN_FROM,
    types: TYPES,
    movieVenue: MOVIE_VENUE,
    groundsVenue: null, // every listing is read by room, so nothing arrives under a name city.js lacks
    codeLength: CODE_LENGTH,
    registry: REGISTRY,
    words: WORDS,
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
