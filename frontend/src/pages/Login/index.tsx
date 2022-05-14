import React, { useEffect, useContext, useState, useRef, MutableRefObject } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../../services/mutations';
import TextBox from '../../components/TextBox';
import { useToasts } from '../../hooks';
import AppContext from '../../contexts';
import Header from '../../components/Header';

const Login = () => {
  const [number, setNumber] = useState('');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(AppContext);
  const { successToast, errorToast } = useToasts();
  const [login] = useMutation(LOGIN);
  const ref: MutableRefObject<HTMLInputElement | undefined> = useRef();

  useEffect(() => {
    setValue(formatNumber(number));
  }, [setValue, number]);

  useEffect(() => {
    setCursorPos();
  }, [value, ref]);

  const setCursorPos = () => {
    if (ref.current && value) {
      ref.current.selectionStart = value.search('_');
      ref.current.selectionEnd = value.search('_');
    }
  }

  const formatNumber = (number: string) => {
    let digits = '(___) ___-____';
    for (let i = 0; i < number.length; i++) {
      digits = digits.replace('_', number.charAt(i));
    }
    return digits;
  }

  const handleSubmit = async () => {
    if (number.length < 10) {
      setError('Must enter a full ten-digit phone number.');
      return;
    } else if(error.length) {
      setError('');
    }

    setLoading(true);
    const response = await login({
      variables: {
        number,
      },
    });

    if (!response.data) {
      errorToast('Unknown error signing in.');
    }

    const { user }: { user: any } = response.data.login;
    const errors: string[] = response.data.errors;
    setLoading(false);

    if (user && setUser) {
      setUser(user);
      successToast('Successfully logged in!');
    } else {
      errorToast(errors?.length ? errors[0] : 'Unknown error signing in.');
    }
  };

  const handleChange = (value: string) => {
    ['(', ')', '_', ' ', '-'].map((digit: string) => value = value.replaceAll(digit, ''));
    const reg: RegExp = /^[0-9]*$/;
    if (reg.test(value)) {
      setNumber(value);
    }
  }

  const handleFocusOrClick = (event: any) => {
    setCursorPos();
  }

  return (
    !loading
      ? (
        <div className="flex flex-col text-center items-center">
          <Header xl={3}>Enter Your Phone Number</Header>
          <TextBox
            id="number"
            className='w-36 text-center'
            innerRef={ref}
            type="string"
            value={value}
            onChange={handleChange}
            onFocus={handleFocusOrClick}
            onClick={handleFocusOrClick}
            error={error}
          />
          <button onClick={handleSubmit} className="btn w-1/2 m-2 ml-0 font-pop text-lg bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-6 rounded" type="submit">
            Play
          </button>
        </div>
      )
      : (<p>Loading...</p>)
  );
};

export default Login;
