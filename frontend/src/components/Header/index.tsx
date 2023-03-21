interface Props {
  children: string,
  fs?: string,
  mx?: number | 'auto',
  wrap?: boolean,
  className?: string
}

const Header: React.FC<Props> = ({ className, fs, mx, children, wrap=false }: Props) => (
  <div className={`${className} font-pop text-neutral-500 font-bold ${wrap ? '' : 'whitespace-nowrap'} text-left w-min mx-${mx}`}>
    <p style={{
      fontSize: fs
    }}>{children}</p>
  </div>
);

Header.defaultProps = {
  fs: '18px',
  mx: 'auto',
};

export default Header;
