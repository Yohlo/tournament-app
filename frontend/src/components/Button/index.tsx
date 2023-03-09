/* eslint-disable react/button-has-type */
interface Props {
  type: 'button' | 'submit',
  variant: 'blue' | 'green' | 'red',
  onClick?: (() => void) | undefined,
  children: React.ReactNode,
  disabled?: boolean,
}

const Button: React.FC<Props> = ({ type, variant, onClick, children, disabled }: Props) => {
  const colors = `bg-${variant} hover:bg-${variant}er`;
  return (
    <button
      className={`btn ${disabled ? 'cursor-not-allowed bg-gray-400' : colors} w-full font-pop font-bold py-2 px-4 mb-4 text-white `}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

Button.defaultProps = {
  disabled: false,
  onClick: undefined,
};

export default Button;
