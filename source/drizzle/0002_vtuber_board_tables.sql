DROP TABLE entries;
--> statement-breakpoint
CREATE TABLE vtubers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  name_alt TEXT NOT NULL DEFAULT '',
  region TEXT NOT NULL,
  agency TEXT NOT NULL DEFAULT '',
  reason TEXT NOT NULL DEFAULT '',
  tags TEXT NOT NULL DEFAULT '',
  sort_rank INTEGER NOT NULL DEFAULT 100
);
--> statement-breakpoint
CREATE TABLE channels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vtuber_id INTEGER NOT NULL,
  platform TEXT NOT NULL,
  account_id TEXT NOT NULL,
  room_id TEXT NOT NULL DEFAULT '',
  handle TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL,
  app_url TEXT NOT NULL DEFAULT '',
  followers_label TEXT NOT NULL DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE live_status (
  channel_id INTEGER PRIMARY KEY,
  state TEXT NOT NULL DEFAULT 'unknown',
  title TEXT NOT NULL DEFAULT '',
  game TEXT NOT NULL DEFAULT '',
  viewers INTEGER,
  thumb_key TEXT NOT NULL DEFAULT '',
  live_url TEXT NOT NULL DEFAULT '',
  app_live_url TEXT NOT NULL DEFAULT '',
  started_at INTEGER,
  updated_at INTEGER NOT NULL DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''
);
