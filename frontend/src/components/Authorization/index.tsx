import React, { useEffect } from 'react';

const SERVER_URL = `${process.env.REACT_APP_SERVER_URL}`;

interface RedirectProps {
  target: string,
}

// Redirects away from the react app (in this case, to our server)
const RedirectOffServer = ({ target }: RedirectProps) => {
  useEffect(() => {
    window.location.replace(target);
  }, [target]);

  return (
    <div>
      <span>
        Redirecting to
        {' '}
        {target}
      </span>
    </div>
  );
};

const Authorization: React.FC<{ children: any }> = ({ children }) => {
  const accessToken = sessionStorage.getItem('access_token');

  // redirect to the login service
  if (!accessToken) {
    return (
      <RedirectOffServer
        target={`${SERVER_URL}/api/music/auth/login`}
      />
    );
  }

  return (
    <>
      {children}
    </>
  );
};

export default Authorization;
