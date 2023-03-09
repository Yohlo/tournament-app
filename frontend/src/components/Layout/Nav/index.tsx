import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useContext, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTournament } from '../../../contexts/Tournament';
import { useClickOutside } from '../../../hooks';
import styles from './styles.module.css';

interface NavLinkProps {
  to: string,
  label: string,
  route: string,
  onClick: () => void,
}

const NavLink: React.FC<NavLinkProps> = ({ to, label, route, onClick }: NavLinkProps) => (
  <Link
    className={`${route.toLowerCase() === to.toLowerCase() ? styles.active : ''} block px-4 py-2 mt-2 text-sm font-semibold text-gray-900  focus:outline-none focus:shadow-outline`}
    to={to}
    onClick={onClick}
  >
    {label}
  </Link>
);

const Nav = () => {
  const [open, setOpen] = useState(false);
  const { user, tournament } = useTournament();
  const { pathname } = useLocation();
  const close = () => setOpen(false);
  const ref = useRef(null);
  const btnRef = useRef(null);
  useClickOutside(ref, btnRef, close);

  return (
    <div className="flex flex-col w-full md:w-64 text-gray-700 bg-white dark-mode:text-gray-200 dark-mode:bg-gray-800 flex-shrink-0">
      <div className="flex-shrink-0 px-8 py-4 flex flex-row items-center justify-between">
        <Link to="/" className="text-lg font-semibold tracking-widest text-gray-900 uppercase rounded-lg dark-mode:text-white focus:outline-none focus:shadow-outline">{ tournament?.name || 'Tournament' }</Link>
        <button ref={btnRef} onClick={() => setOpen(o => !o)} type="button" className="md:hidden focus:outline-none focus:shadow-outline btn m-2 ml-0 font-pop self-end text-lg bg-yellow hover:bg-yellower text-black font-bold p-2">
          <svg fill="black" viewBox="0 0 20 20" className="w-6 h-6">
            { !open
              ? <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z" clipRule="evenodd" />
              : <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /> }
          </svg>
        </button>
      </div>
      <nav
        ref={ref}
        style={{
          boxShadow: '5px -5px black',
        }}
        className={`${open ? 'block' : 'hidden'} left-1/2 md:left-2 -translate-x-1/2 md:translate-x-0 max-w-sm bg-white absolute top-20 w-11/12 md:w-1/2 flex-grow md:block px-4 pb-4 md:pb-0 md:translate-x-0 md:translate-y-0 md:overflow-y-auto z-50 border-2 border-black`}
      >
        <NavLink to="/Home" label="Home" route={pathname} onClick={close} />
        <NavLink to="/Teams" label="Teams" route={pathname} onClick={close} />
        <NavLink to="/Matches" label="Live Matches" route={pathname} onClick={close} />
        <NavLink to="/History" label="History" route={pathname} onClick={close} />
        <a
          className="bg-transparent dark-mode:bg-transparent block px-4 py-2 mt-2 text-sm font-semibold text-gray-900 rounded-lg dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
          href="https://challonge.com/6vtx2eds"
          target="_blank"
          rel="noreferrer"
        >
          Predictions
          <FontAwesomeIcon className="ml-2 text-xs" icon={faExternalLinkAlt} />
        </a>
        { user?.admin && <NavLink to="/Admin" label="Admin" route={pathname} onClick={close} /> }
        { user?.admin && <NavLink to="/Admin/Tournament" label="Run Tournament" route={pathname} onClick={close} /> }
        <NavLink to="/Logout" label="Logout" route={pathname} onClick={close} />
      </nav>
    </div>
  );
};

export default Nav;
