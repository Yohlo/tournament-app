import React from 'react';
import { Song } from '../../types';
import SpotifyTrack from '../SongPicker/SpotifyTrack';
import TextBox from '../TextBox';

export const error = (timestamp: string, duration: string, song: SpotifyTrack | undefined): boolean => {
  const timestampParts = timestamp.split(':');
  const durrParts = duration.split(':');
  if (durrParts.length !== 2) return true;
  if (durrParts[0].length !== 1 || durrParts[1].length !== 2) return true;

  const durmm = parseInt(durrParts[0], 10);
  const durss = parseInt(durrParts[1], 10);
  if (durmm !== 0 || durss < 8 || durss > 16) return true;

  const mm = parseInt(timestampParts[0], 10);
  const ss = parseInt(timestampParts[1], 10);
  return !!(song && (mm * 60 + ss + durss) * 1000 > song.lengthMillis && duration.includes(':'));
};

interface Props {
  song: SpotifyTrack | undefined,
  timestamp: string,
  duration: string,
  onChange: (dur: string) => void,
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void,
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void,
}
const DurationPicker = ({ song, timestamp, duration, onChange, onBlur, onFocus }: Props) => {
  const errorString = (): string => (error(timestamp, duration, song) ? 'Duration must be between 0:09-0:15 and match the format X:XX' : '');

  return (
    <TextBox
      id="duration"
      type="text"
      value={duration}
      onChange={onChange}
      autoComplete="off"
      error={errorString()}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
};

export default DurationPicker;
