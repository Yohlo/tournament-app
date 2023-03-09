import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';
import React, { useEffect } from 'react';

const Success: React.FC = () => {
  useEffect(() => {
    const token = Cookies.get('access_token');
    const expires_in = Cookies.get('expires_in');

    if (token) {
      sessionStorage.setItem('access_token', token);
    }
    if (expires_in) {
      var t = new Date();
      t.setSeconds(t.getSeconds() + (parseInt(expires_in) - 60));
      sessionStorage.setItem('expires', `${Math.floor(t.getTime() / 1000)}`);
    }
  }, []);

  return <Navigate to="/Admin/Tournament" replace />;
};

export default Success;
