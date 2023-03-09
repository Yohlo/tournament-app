import { useEffect, useRef, useState } from 'react';
import { UserShort } from '../../types';
import TextBox from '../TextBox';

interface Props {
  label?: string,
  people: UserShort[],
  selected: UserShort | undefined,
  onChange: (person: UserShort) => void,
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void,
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void,
  disabled?: boolean,
  allowNew?: boolean,
  error?: string
}

interface ItemProps {
  onClick?: (p: UserShort) => void,
  value: UserShort
}
const Item: React.FC<ItemProps> = ({ value, onClick }: ItemProps) => (
  <div
    className={'w-full text-left p-2 max-w-10 border-b border-gray-500 hover:bg-gray-100 '
      + (value.id === -2 ? ' cursor-not-allowed text-gray-400' : 'cursor-pointer')}
    onClick={() => onClick ? onClick(value) : null}
  >
    { `${value.id === -1 ? 'Add ' : ''}${value.full_name}` }
  </div>
);

const capitalizeName = (name: string) => name.replace(/\b\w/g, (c) => c.toUpperCase());

const PeoplePicker: React.FC<Props> = ({ label, people, onChange, onFocus, onBlur, selected, disabled, allowNew, error }
: Props) => {
  const [name, setName] = useState<string>(selected?.full_name || '');
  const [suggested, setSuggested] = useState<UserShort[]>([]);
  const [show, setShow] = useState<boolean>(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const matches: any[] = [];
    people?.map((u: any) => {
      if (u?.full_name.toLowerCase().includes(name?.toLowerCase())) {
        matches.push(u);
      }
      return u;
    });
    setSuggested(matches);
  }, [name, people]);

  useEffect(() => {
    const handleMouseDown = (event: Event) => {
      if (event.target !== inputRef.current) {
        setShow(false);
      }
      if (event.target === inputRef.current) {
        if (suggested.length || (name && allowNew)) {
          setShow(true);
        }
      }
    };

    document.addEventListener('click', handleMouseDown);

    return () => document.removeEventListener('click', handleMouseDown);
  }, []);

  useEffect(() => {
    if (!show && selected) {
      setName(selected.full_name);
    } else if (!show) {
      setName('')
    }
  }, [show, selected]);

  const handleClick = (person: UserShort): void => {
    if (disabled) { return; }
    onChange(person);
    setShow(false);
  };

  const handleChange = (value: string) => {
    setName(value);
    if (!show) { setShow(true); }
  };

  return (
    <>
      <TextBox
        id={`person-${label}`}
        innerRef={inputRef}
        label={label}
        type="text"
        value={name}
        onChange={handleChange}
        autoComplete="off"
        placeholder={`Enter a ${label ? label.toLowerCase() : 'name'}...`}
        disabled={disabled}
        error={error}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      <div className="relative">
        {
          show && !disabled
            ? (
              <div className="block absolute shadow-outer -top-6 left-0 z-40 border-4 bg-white border-black w-full">
                {
                  suggested.map(p => <Item key={p.id} value={p} onClick={handleClick} />)
                }
                {
                  allowNew && !suggested.length ? (
                    <Item
                      key='new-person'
                      value={{
                        id: -1,
                        full_name: capitalizeName(name)
                      }}
                      onClick={handleClick}
                    />
                  ) : null
                }
                {
                  !allowNew && !suggested.length ?
                  (
                    <Item
                      key='no-people'
                      value={{
                        id: -2,
                        full_name: "No player found."
                      }}
                    />
                  ) : null
                }
              </div>
            )
            : null
        }
      </div>
    </>
  );
};

PeoplePicker.defaultProps = {
  disabled: false,
  allowNew: false
};

export default PeoplePicker;