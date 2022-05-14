import React, { createContext, useContext, useReducer } from 'react';
import { Toast, ToastAction, ToastActionType } from './types';

export * from './types';

export const toastReducer:
(state: Toast[], action: ToastAction) => Toast[] = (state: Toast[], action: ToastAction) => {
  switch (action.type) {
    case ToastActionType.ADD:
      return [
        ...state,
        {
          id: +new Date(),
          type: action.payload?.type,
          message: action.payload?.message,
        },
      ];
    case ToastActionType.HIDE:
      return state.map((t) => (t.id !== action.payload?.id
        ? t
        : {
          id: t.id,
          type: t.type,
          message: t.message,
          removed: true,
        }));
    case ToastActionType.REMOVE:
      return state.filter((t) => (t.id !== action.payload?.id));
    default:
      return state;
  }
};

interface ToastContextType {
  toasts: Toast[],
  dispatch?: React.Dispatch<ToastAction>,
}

// eslint-disable-next-line object-curly-newline
export const ToastContext = createContext<ToastContextType>({ toasts: [] });

export const useToasts: () => ToastContextType = () => {
  const [toasts, dispatch] = useReducer(toastReducer, []);
  return {
    toasts,
    dispatch,
  };
};

export const useToastContext = () => useContext(ToastContext);
