import SpotifyTrack from '../SongPicker/SpotifyTrack';
import TextBox from '../TextBox';

interface Props {
  timestamp: string,
  onChange: (str: string) => void,
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void,
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void,
  song: SpotifyTrack | undefined
}

const TimestampPicker = ({ timestamp, onChange, onFocus, onBlur, song }: Props) => {
  const error = (): boolean => {
    const parts = timestamp.split(':');
    if (parts.length !== 2) return true;
    if (parts[0].length === 0 || parts[1].length !== 2) return true;

    const mm = parseInt(parts[0], 10);
    const ss = parseInt(parts[1], 10);

    if (ss < 0 || ss > 60 || mm < 0) return true;

    return song ? (mm * 60 + ss) * 1000 > song.lengthMillis : false;
  };

  const errorString = (): string => (error() ? `"${timestamp}" is not a valid timestamp` : '');

  return (
    <div className="flex flex-column">
      <TextBox
        id="start-time"
        type="text"
        value={timestamp}
        onChange={onChange}
        autoComplete="off"
        error={errorString()}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </div>
  );
};

export default TimestampPicker;
