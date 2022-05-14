import { Outlet } from "react-router-dom";

interface Props {
  children?: React.ReactNode;
  styles?: any;
}

const Content: React.FC<Props> = ({ children, styles }: Props) => (
  <div className="flex overflow-hidden w-full p-6 md:p-8">
    <div
      style={{
        boxShadow: '1px 2px 2px 8px #000',
        maxHeight: '100%',
        minWidth: '15rem',
        maxWidth: '45rem',
      }}
      className={`${styles} content bg-white flex-grow-1 mx-auto md:my-10 p-1 rounded-lg flex-initial w-full sm:max-w-lg max-w-xl overflow-hidden`}
    >
      <main className="p-8 md:p-12 min-h-full max-h-full overflow-y-scroll">
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
