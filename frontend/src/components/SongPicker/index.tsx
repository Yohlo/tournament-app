import React, { useEffect, useRef, useState } from 'react';
import { useDebouncedSearch } from '../../hooks';
import TextBox from '../TextBox';
import { SpotifyTrack } from '../../types';
import { searchSpotifyAsync } from '../../services/api';
import SpotifyPreviewer from './SpotifyPreviewer';

interface Props {
  selected: SpotifyTrack | undefined,
  onChange: (song: SpotifyTrack) => void
}

interface Props {
  selected: SpotifyTrack | undefined,
  onChange: (track: SpotifyTrack) => void,
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void,
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void,
}

interface ItemProps {
  onClick: (track: SpotifyTrack) => void,
  song: SpotifyTrack
}
const Item: React.FC<ItemProps> = ({ song, onClick }: ItemProps) => (
  <div
    key={song.id}
    className={'w-full text-left p-4 max-w-10 border-b border-gray-100 hover:bg-gray-100 '
      + 'cursor-pointer'}
    onClick={() => onClick(song)}
  >
    {`${song.track} by ${song.artist}`}
  </div>
);

const SongPicker: React.FC<Props> = ({ selected, onChange, onFocus, onBlur }: Props) => {
  const [show, setShow] = useState<boolean>(false);
  const inputRef = useRef(null);
  const useSpotifySearch = useDebouncedSearch((text) => searchSpotifyAsync(text));
  const { inputText, setInputText, searchResults } = useSpotifySearch;

  useEffect(() => {
    const handleMouseDown = (event: Event) => {
      if (event.target !== inputRef.current) {
        setShow(false);
      }
      if (event.target === inputRef.current) {
        setShow(true);
      }
    };

    document.addEventListener('click', handleMouseDown);

    return () => document.removeEventListener('click', handleMouseDown);
  }, []);

  useEffect(() => {
    if (!show && selected) {
      setInputText(`${selected.track} by ${selected.artist}`);
    }
  }, [show, selected]);

  const handleClick = (track: SpotifyTrack): void => {
    onChange(track);
    setShow(false);
  };

  return (
    <div>
      <TextBox
        id="song-picker"
        innerRef={inputRef}
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e)}
        autoComplete="off"
        placeholder="XXXTENTACION"
        onFocus={onFocus}
        onBlur={onBlur}
      />
      <div className="relative">
        {
          show && searchResults?.result?.length
            ? (
              <div className="block absolute shadow-outer -top-5 left-0 z-40 border rounded-b-md bg-white border-gray-300 w-full">
                {
                  searchResults.result.map((song: SpotifyTrack) => (
                    <Item
                      key={song.id}
                      song={song}
                      onClick={handleClick}
                    />
                  ))
                }
              </div>
            )
            : null
        }
      </div>
      <SpotifyPreviewer
        song={selected}
      />
    </div>
  );
};

export default SongPicker;
