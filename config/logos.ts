// Real logos cropped from Libni's speaking deck (public/logos). Heights are
// tuned per mark so they read as one line; TEDx sits largest by request.
export const LOGOS: [string, string, number][] = [
  ["tedx", "TEDx", 44], ["vogue", "Vogue", 30], ["preview", "Preview", 28], ["manila-bulletin", "Manila Bulletin", 22],
  ["bilyonaryo", "Bilyonaryo News Channel", 32], ["dove", "Dove", 44], ["sun-life", "Sun Life", 28], ["net25", "NET25", 34],
  ["manulife", "Manulife", 24], ["sunstar", "SunStar", 24], ["abante", "Abante", 24], ["jci", "JCI Philippines", 38],
  ["kmc", "KMC", 32], ["gsm-blue", "GSM Blue", 36], ["grwm", "GRWM Cosmetics", 30], ["rise-and-shine", "Rise & Shine Pilipinas", 40],
  ["when-in-manila", "When in Manila", 46], ["awr-asia", "AWR Asia", 26], ["rptv", "RPTV", 38], ["bare-it-all", "The Bare It All Podcast", 36],
  ["life-over-whiskey", "Life Over Whiskey", 44], ["iwts", "IWTS Foundation", 42], ["batangas-state", "Batangas State University", 46],
  ["filipina-summit", "Filipina in Business Summit", 40], ["sun-life-grepa", "Sun Life GREPA", 30], ["new-lounge", "New Lounge", 44],
];

/** The press/media subset, for “as seen on” rows. */
export const PRESS_LOGOS = LOGOS.filter(([f]) => ["tedx", "vogue", "preview", "manila-bulletin", "bilyonaryo", "dove", "net25", "sunstar", "abante", "when-in-manila", "rptv"].includes(f));
