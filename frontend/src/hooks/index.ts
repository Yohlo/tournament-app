import React, { useRef, useEffect, useState } from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { useAsync } from 'react-async-hook';
import { ToastActionType, ToastType, useToastContext } from '../contexts/Toast';

type ResultBox<T> = { v: T }

function useConstant<T>(fn: () => T): T {
  const ref = React.useRef<ResultBox<T>>()

  if (!ref.current) {
    ref.current = {
      v: fn()
    }
  }

  return ref.current.v
}

export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) {
      return () => null;
    }

    const id = setInterval(() => savedCallback.current(), delay);

    return () => clearInterval(id);
  }, [delay]);
};

export const useToasts = () => {
  const { dispatch } = useToastContext();

  const successToast = (message: string) => {
    if (dispatch) {
      dispatch({
        type: ToastActionType.ADD,
        payload: {
          type: ToastType.SUCCESS,
          message,
        },
      });
    }
  };

  const errorToast = (message: string) => {
    if (dispatch) {
      dispatch({
        type: ToastActionType.ADD,
        payload: {
          type: ToastType.ERROR,
          message,
        },
      });
    }
  };

  return {
    successToast,
    errorToast,
  };
};

// Generic reusable hook
export const useDebouncedSearch = (searchFunction: (text: string) => any) => {
  // Handle the input text state
  const [inputText, setInputText] = useState<string>('');

  // Debounce the original search async function
  const debouncedSearchFunction = useConstant(() => AwesomeDebouncePromise(searchFunction, 200));

  // The async callback is run each time the text changes,
  // but as the search function is debounced, it does not
  // fire a new request on each keystroke
  const searchResults = useAsync(async () => {
    if (inputText.length === 0) {
      return [];
    }
    return debouncedSearchFunction(inputText);
  }, [debouncedSearchFunction, inputText]);

  // Return everything needed for the hook consumer
  return {
    inputText,
    setInputText,
    searchResults,
  };
};

// eslint-disable-next-line max-len
export const useSessionStorage = (key: string, initialValue: string): [string, React.Dispatch<React.SetStateAction<string>>] => {
  const [value, setValue] = useState(sessionStorage.getItem(key) || initialValue);

  useEffect(() => {
    sessionStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue];
};

export const useClickOutside = (ref: any, ref2: any, callback: any) => {

  const handleClick = (event: any) => {
    const inFirst = ref.current && ref.current.contains(event.target);
    const inSecond = ref2.current && ref2.current.contains(event.target);

    if (!(inFirst || inSecond)) {
      callback();
    }
  }

  useEffect(() => {
    // Bind the event listener
    document.addEventListener("mousedown", handleClick);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClick);
    };
  }, [ref]);
}
