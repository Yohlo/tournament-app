import React from "react";

interface Props {
  id: string,
  type: string,
  label?: string,
  value: any,
  error?: string,
  innerRef?: any,
  className?: string,
  onChange: (value: any) => void,
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void,
  onClick?: (event: React.MouseEvent<HTMLInputElement>) => void,
  autoComplete?: 'off' | 'on',
  placeholder?: string,
  disabled?: boolean,
  min?: number,
  max?: number,
}

/* eslint-disable-next-line max-len */
const TextBox = ({ id, type, label, className, value, error, onChange, onFocus, onClick, innerRef, autoComplete, placeholder, disabled, min, max }
: Props) => (
  <div className="mb-4">
    <label className="block font-pop text-gray-500" htmlFor={id}>
      {label}
      <input
        id={id}
        ref={innerRef}
        type={type}
        value={value}
        style={{
          boxShadow: `1px 1px 1px 2px ${error ? '#EF4444' : '#9CA3AF'}`,
          WebkitBoxShadow: `1px 1px 1px 2px ${error ? '#EF4444' : '#9CA3AF'}`,
        }}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onClick={onClick}
        className={`w-full font-sans p-2 mt-1 rounded-lg ${error ? 'text-red-700' : 'text-gray-600'} outline-none focus:bg-gray-50 ${className || ''}`}
        autoComplete={autoComplete}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        max={max}
      />
    </label>
    <p className="text-xs text-red-700 pt-1">{error}</p>
  </div>
);

TextBox.defaultProps = {
  error: '',
  innerRef: null,
  autoComplete: 'on',
  placeholder: '',
  disabled: false,
  min: 0,
  max: 10,
};

export default TextBox;
