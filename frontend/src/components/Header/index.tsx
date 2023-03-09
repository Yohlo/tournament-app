interface Props {
  children: string,
  fs?: string,
  mx?: number | 'auto',
  wrap?: boolean,
  className?: string
}

const Header: React.FC<Props> = ({ className, fs, mx, children, wrap=false }: Props) => (
  <div className={`${className} font-pd font-bold ${wrap ? '' : 'whitespace-nowrap'} text-white mx-${mx}`}>
    <p style={{
      fontSize: fs
    }}>{children}</p>
  </div>
);

Header.defaultProps = {
  fs: '16px',
  mx: 'auto',
};

export default Header;
