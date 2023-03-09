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
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void,
  onClick?: (event: React.MouseEvent<HTMLInputElement>) => void,
  autoComplete?: 'off' | 'on' | 'one-time-code',
  placeholder?: string,
  disabled?: boolean,
  min?: number,
  max?: number,
  pattern?: string,
  inputMode?: "none" | "numeric",
}

/* eslint-disable-next-line max-len */
const TextBox = ({ id, type, label, className, value, error, onChange, onFocus, onBlur, onClick, innerRef, autoComplete, placeholder, disabled, min, max, inputMode, ...rest }
: Props) => (
  <div className="mb-4">
    <label className={`block font-pop border-4 border-black`} htmlFor={id}>
      {label}
      <input
        id={id}
        ref={innerRef}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onClick={onClick}
        style={{
          borderTop: '.5rem solid #ECC500',
          letterSpacing: '4px'
        }}
        onBlur={onBlur}
        className={`disabled:cursor-not-allowed disabled:bg-yellower disabled:text-neutral-800 bg-yellow w-full font-pop text-sm p-2 text-black outline-none rounded-none placeholder-black placeholder-opacity-40 ${className || ''}`}
        autoComplete={autoComplete}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        max={max}
        inputMode={inputMode}
        { ...rest }
      />
    </label>
    <p
      style={{
        fontSize: '11px'
      }}
      className="text-reder pt-1"
    >
      {error}
    </p>
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
