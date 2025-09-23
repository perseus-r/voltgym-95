export class AudioService {
  private static currentPlaylist: string | null = null;
  private static isPlaying: boolean = false;

  static startPlaylist(playlistName: string): void {
    this.currentPlaylist = playlistName;
    this.isPlaying = true;
    
    // Placeholder implementation - would integrate with Spotify/Apple Music APIs
    console.log(`🎵 Iniciando playlist: ${playlistName}`);
    
    // Mock playlist selection based on workout type
    const playlists = {
      'Push Day': 'Energia Máxima - Rock/EDM',
      'Pull Day': 'Foco Intenso - Hip Hop',
      'Leg Day': 'Motivação Brutal - Metal',
      'Cardio': 'Ritmo Constante - Pop/Dance'
    };

    const selectedPlaylist = playlists[playlistName as keyof typeof playlists] || 'Treino Geral';
    
    // Simulate audio playing
    if ('Notification' in window) {
      new Notification(`🎵 ${selectedPlaylist}`, {
        body: 'Playlist iniciada para seu treino',
        icon: '/favicon.ico'
      });
    }

    // Store in localStorage for persistence
    localStorage.setItem('bora_current_playlist', JSON.stringify({
      name: playlistName,
      startTime: Date.now(),
      isPlaying: true
    }));
  }

  static stop(): void {
    this.isPlaying = false;
    this.currentPlaylist = null;
    
    console.log('🎵 Música pausada');
    localStorage.removeItem('bora_current_playlist');
  }

  static getCurrentPlaylist(): string | null {
    const stored = localStorage.getItem('bora_current_playlist');
    if (!stored) return null;

    const data = JSON.parse(stored);
    return data.isPlaying ? data.name : null;
  }

  static isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  static togglePlayPause(): void {
    this.isPlaying = !this.isPlaying;
    
    const stored = localStorage.getItem('bora_current_playlist');
    if (stored) {
      const data = JSON.parse(stored);
      data.isPlaying = this.isPlaying;
      localStorage.setItem('bora_current_playlist', JSON.stringify(data));
    }
  }
}