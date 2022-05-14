import { useReducer } from 'react';
import { createPortal } from 'react-dom';
import { ToastContext, toastReducer } from '.';
import ToastContainer from './ToastContainer';

const ToastProvider: React.FC<{ children: any }> = ({ children }: any) => {
  const [toasts, dispatch] = useReducer(toastReducer, []);
  const toastData = {
    toasts,
    dispatch,
  };

  return (
    <ToastContext.Provider value={toastData}>
      {createPortal(<ToastContainer />, document.body)}

      {children}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
