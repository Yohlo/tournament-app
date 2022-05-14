import { useContext, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { Navigate } from 'react-router-dom';
import { LOGOUT } from '../../services/mutations';
import AppContext from '../../contexts';
import { useToasts } from '../../hooks';

const Logout = () => {
  const { setUser } = useContext(AppContext);
  const [logout] = useMutation(LOGOUT);
  const { successToast } = useToasts();

  useEffect(() => {
    if (setUser) {
      setUser(null);
    }

    successToast('Successfully logged out!');
    logout();
  }, []);

  return <Navigate to="/" replace />;
};

export default Logout;
