interface Props {
  children: string,
  xl?: number,
  mx?: number | 'auto';
}

const Header: React.FC<Props> = ({ xl, mx, children }: Props) => (
  <div className={`font-supreme font-bold italic whitespace-nowrap text-center text-white bg-red-600 w-min mx-${mx} p-4 mb-6`}>
    <h1 className={`text-${xl}xl`}>{children}</h1>
  </div>
);

Header.defaultProps = {
  xl: 5,
  mx: 'auto',
};

export default Header;
