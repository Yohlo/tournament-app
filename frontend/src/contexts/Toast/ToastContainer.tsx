import { useEffect, useState } from 'react';
import { useToastContext, ToastActionType, ToastType } from '.';
import { Toast } from './types';

const SuccessSvg = () => (
  <svg width="1.8em" height="1.8em" viewBox="0 0 16 16" className="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z" />
  </svg>
);

const ErrorSvg = () => (
  <svg width="1.8em" height="1.8em" viewBox="0 0 16 16" className="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z" />
    <path fillRule="evenodd" d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z" />
  </svg>
);

const ToastComponent: React.FC<Toast> = ({ id, removed, type, message }: Toast) => {
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  const { dispatch } = useToastContext();

  useEffect(() => {
    if (dispatch && !timer) {
      setTimer(setTimeout(() => dispatch({
        type: ToastActionType.HIDE,
        payload: {
          id,
        },
      }), 3000));
    }
  }, []);

  useEffect(() => {
    if (removed && timer) {
      clearTimeout(timer);
      setTimer(undefined);
      if (dispatch) {
        dispatch({
          type: ToastActionType.REMOVE,
          payload: {
            id,
          },
        });
      }
    }
  }, [removed, timer]);

  return (
    <div className={`transition ease-in-out w-max max-w-sm flex rounded items-center shadow-md mx-auto ${type === ToastType.SUCCESS ? 'bg-green-500 border-green-700' : 'bg-red-500 border-red-700'} ${removed ? 'opacity-0 px-0 py-0 -translate-y-96 h-0' : 'py-2 px-3 mb-2 border-l-4'}`}>
      { !removed
        && (
          <>
            <div className={`${type === ToastType.SUCCESS ? 'text-green-500' : 'text-red-500'} rounded-full bg-white mr-3`}>
              {
              type === ToastType.SUCCESS
                ? <SuccessSvg />
                : <ErrorSvg />
              }
            </div>
            <div className="text-white max-w-xs no-wrap">
              {message}
            </div>
          </>
        )}
    </div>
  );
};

const ToastContainer = () => {
  const { toasts } = useToastContext();
  return (
    <div className="absolute top-5 w-screen">
      {toasts.map((toast) => (
        <ToastComponent key={toast.id} {...toast} />
      ))}
    </div>
  );
};

export default ToastContainer;
