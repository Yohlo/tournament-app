import { useContext, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { Navigate } from 'react-router-dom';
import { LOGOUT } from '../../services/mutations';
import { useToasts } from '../../hooks';
import { useUser } from '../../contexts/User';

const Logout = () => {
  const { setUser } = useUser();
  const [logout] = useMutation(LOGOUT);
  const { successToast } = useToasts();

  useEffect(() => {
    if (setUser) {
      setUser(undefined);
    }

    successToast('Successfully logged out!');
    logout();
  }, []);

  return <Navigate to="/" replace />;
};

export default Logout;
