const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistById(playlistId) {
    console.log(playlistId);
    const playlistQuery = {
      text: 'SELECT id, name FROM playlists WHERE id = $1',
      values: [playlistId],
    };
    const playlistResult = await this._pool.query(playlistQuery);

    if (!playlistResult.rows.length) {
      throw new Error('id not found');
    }
    const playlist = playlistResult.rows[0];

    const songsQuery = {
      text: `SELECT songs.id, songs.title, songs.performer
            FROM songs
            LEFT JOIN playlist_songs
            ON playlist_songs.song_id = songs.id
            WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };
    const playlistSongsResult = await this._pool.query(songsQuery);
    const playlistSongs = playlistSongsResult.rows;

    const result = {
      id: playlist.id,
      name: playlist.name,
      songs: playlistSongs,
    };

    return result;
  }
}

module.exports = PlaylistsService;
