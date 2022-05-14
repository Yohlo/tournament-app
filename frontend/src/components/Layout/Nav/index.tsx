import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AppContext from '../../../contexts';
// import Rules from './Rules.pdf';

interface NavLinkProps {
  to: string,
  label: string,
  route: string,
  onClick: () => void,
}

const NavLink: React.FC<NavLinkProps> = ({ to, label, route, onClick }: NavLinkProps) => (
  <Link
    className={`${route.toLowerCase() === to.toLowerCase() ? 'bg-gray-200 dark-mode:bg-gray-700' : 'bg-transparent dark-mode:bg-transparent'} block px-4 py-2 mt-2 text-sm font-semibold text-gray-900 rounded-lg dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline`}
    to={to}
    onClick={onClick}
  >
    {label}
  </Link>
);

const Nav = () => {
  const [open, setOpen] = useState(false);
  const { user } = useContext(AppContext);
  const { pathname } = useLocation();
  const close = () => setOpen(false);

  return (
    <div className="flex flex-col w-full md:w-64 text-gray-700 bg-white dark-mode:text-gray-200 dark-mode:bg-gray-800 flex-shrink-0">
      <div className="flex-shrink-0 px-8 py-4 flex flex-row items-center justify-between">
        <Link to="/" className="text-lg font-semibold tracking-widest text-gray-900 uppercase rounded-lg dark-mode:text-white focus:outline-none focus:shadow-outline">Tournament</Link>
        <button onClick={() => setOpen((o) => !o)} type="button" className="rounded-lg md:hidden rounded-lg focus:outline-none focus:shadow-outline">
          <svg fill="currentColor" viewBox="0 0 20 20" className="w-6 h-6">
            { !open
              ? <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z" clipRule="evenodd" />
              : <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /> }
          </svg>
        </button>
      </div>
      <nav className={`${open ? 'block' : 'hidden'} flex-grow md:block px-4 pb-4 md:pb-0 md:overflow-y-auto z-50`}>
        <NavLink to="/" label="Home" route={pathname} onClick={close} />
        <a
          className="bg-transparent dark-mode:bg-transparent block px-4 py-2 mt-2 text-sm font-semibold text-gray-900 rounded-lg dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
          href={"https://google.com"}
          target="_blank"
          rel="noreferrer"
        >
          House Rules
          <FontAwesomeIcon className="ml-2 text-xs" icon={faExternalLinkAlt} />
        </a>
        <a
          className="bg-transparent dark-mode:bg-transparent block px-4 py-2 mt-2 text-sm font-semibold text-gray-900 rounded-lg dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
          href="https://google.com"
          target="_blank"
          rel="noreferrer"
        >
          Predictions
          <FontAwesomeIcon className="ml-2 text-xs" icon={faExternalLinkAlt} />
        </a>
        { user?.admin && <NavLink to="/Admin" label="Admin" route={pathname} onClick={close} /> }
        <NavLink to="/Logout" label="Logout" route={pathname} onClick={close} />
      </nav>
    </div>
  );
};

export default Nav;
