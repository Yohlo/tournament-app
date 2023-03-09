import { Outlet } from "react-router-dom";

interface Props {
  children?: React.ReactNode;
  styles?: any;
}

const Content: React.FC<Props> = ({ children, styles }: Props) => (
  <div className="flex overflow-y-scroll justify-center w-full p-6 pt-0 md:p-8">
    <div
      style={{
        minHeight: '100%',
        height: '100%',
        minWidth: '15rem',
      }}
      className={`${styles} content flex-grow-1 md:my-10 p-1 flex-initial w-full max-w-lg overflow-hidden`}
    >
      <main
        className="pt-0 p-8 md:p-1 min-h-full max-h-full overflow-y-scroll">
        {children}
        <Outlet />
      </main>
    </div>
  </div>
);

Content.defaultProps = {
  children: null,
  styles: null,
};

export default Content;
