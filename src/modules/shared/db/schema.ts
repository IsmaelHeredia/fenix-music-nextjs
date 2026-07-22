import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const playlists = sqliteTable('playlists', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique()
});

export const customPlaylists = sqliteTable('custom_playlists', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique()
});

export const customPlaylistItems = sqliteTable('custom_playlist_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  playlistId: integer('playlist_id').notNull().references(() => customPlaylists.id, { onDelete: 'cascade' }),
  songId: integer('song_id').notNull().references(() => songs.id, { onDelete: 'cascade' }),
  order: integer('order').notNull(),
});

export const songs = sqliteTable('songs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  artist: text('artist').default('Unknown Artist'),
  durationString: text('duration_string'),
  duration: integer('duration'),
  fileSize: integer('file_size'),
  filename: text('filename').notNull(),
  playlistId: integer('playlist_id').references(() => playlists.id),
  isFavorite: integer('is_favorite', { mode: 'boolean' }).default(false),
  waveform: text('waveform'),
});

export const stations = sqliteTable('stations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  link: text('link').notNull(),
  categories: text('categories')
});

export const liveStreams = sqliteTable('live_streams', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  link: text('link').notNull(),
  categories: text('categories')
});

export const videos = sqliteTable('videos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  filename: text('filename').notNull().unique()
});

export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});

export type Playlist = typeof playlists.$inferSelect;
export type NewPlaylist = typeof playlists.$inferInsert;

export type CustomPlaylist = typeof customPlaylists.$inferSelect;
export type NewCustomPlaylist = typeof customPlaylists.$inferInsert;

export type CustomPlaylistItem = typeof customPlaylistItems.$inferSelect;
export type NewCustomPlaylistItem = typeof customPlaylistItems.$inferInsert;

export type Song = typeof songs.$inferSelect;
export type NewSong = typeof songs.$inferInsert;

export type Station = typeof stations.$inferSelect;
export type NewStation = typeof stations.$inferInsert;

export type LiveStream = typeof liveStreams.$inferSelect;
export type NewLiveStream = typeof liveStreams.$inferInsert;

export type Video = typeof videos.$inferSelect;
export type NewVideo = typeof videos.$inferInsert;

export type Setting = typeof settings.$inferSelect;
export type NewSetting = typeof settings.$inferInsert;