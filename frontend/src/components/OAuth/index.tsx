import { get } from 'js-cookie';
import { Navigate } from 'react-router-dom';
import React, { useEffect } from 'react';

const Success: React.FC = () => {
  useEffect(() => {
    const token = get('access_token');
    if (token) {
      sessionStorage.setItem('access_token', token);
    }
  }, []);

  return <Navigate to="/Admin/Tournament" replace />;
};

export default Success;
