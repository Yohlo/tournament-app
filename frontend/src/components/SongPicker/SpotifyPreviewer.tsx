import React from 'react';
import SpotifyTrack from './SpotifyTrack';

interface Props {
  song: SpotifyTrack | undefined
}

const SpotifyPreviewer: React.FC<Props> = ({ song }: Props) => (
  <div>
    {song
      ? (
        <iframe
          title="spotify-player"
          src={`https://open.spotify.com/embed/track/${song.id}`}
          height="80"
          frameBorder="0"
          allow="encrypted-media"
          className="min-w-full max-w-full mb-4"
        />
      ) : (
        <>
        </>
      )}
  </div>
);

export default SpotifyPreviewer;
