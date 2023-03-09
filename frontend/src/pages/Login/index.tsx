import React, { useEffect, useContext, useState, useRef, MutableRefObject, FormEventHandler } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { START_LOGIN, VERIFY_LOGIN } from '../../services/mutations';
import TextBox from '../../components/TextBox';
import { useToasts } from '../../hooks';
import Loader from '../../components/Loader';
import { User } from '../../types';
import PickPlayerPage from './PickPlayerPage';
import { useUser } from '../../contexts/User';


const Login = () => {
  const [number, setNumber] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [showVerify, setShowVerify] = useState(false);
  const [partialUser, setPartialUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const { successToast, errorToast } = useToasts();
  const [start_login] = useMutation(START_LOGIN);
  const [verify_login] = useMutation(VERIFY_LOGIN);
  const { setUser } = useUser();
  const numRef: MutableRefObject<HTMLInputElement | undefined> = useRef();
  const verRef: MutableRefObject<HTMLInputElement | undefined> = useRef();


  useEffect(() => {
    if (numRef.current) {
      setCursorPos(numRef, formatNumber(number));
    }
  }, [number, numRef]);


  useEffect(() => {
    if (verRef.current) {
      setCursorPos(verRef, formatNumber(code, '______'));
    }
  }, [code, verRef]);


  const setCursorPos = (ref: MutableRefObject<HTMLInputElement | undefined>, value: string) => {
    const pos = value.search('_');
    if (ref.current && pos >= 0) {
      ref.current.selectionStart = pos;
      ref.current.selectionEnd = pos;
    } else if (ref.current) {
      ref.current.selectionStart = value.length;
      ref.current.selectionEnd = value.length;
    }
  }

  const formatNumber = (number: string, digits = '(___) ___-____') => {
    for (let i = 0; i < number.length; i++) {
      digits = digits.replace('_', number.charAt(i));
    }
    return digits;
  }

  const handleNumberSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (number.length < 10) {
      setError('Must enter a full ten-digit phone number.');
      return;
    } else if (error.length) {
      setError('');
    }

    setLoading(true);
    const response = await start_login({
      variables: {
        number,
      },
    });

    setLoading(false);
    if (!response.data) {
      errorToast('Unknown error submitting number. Please try again.');
    } else {
      // check if verification code was sent
      if (response.data.startVerify) {
        // change to number screen
        setShowVerify(true);
      } else {
        errorToast('Unknown error starting SMS verification.');
      }
    }
  }

  const handleVerifySubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setLoading(true);
    const response = await verify_login({
      variables: {
        number,
        code
      },
    });

    setLoading(false);
    if (!response.data) {
      errorToast('Unknown error signing in.');
    } else if (response.data.checkVerify.message) {
      errorToast(response.data.checkVerify.message);
    }

    const { user }: { user: any } = response.data.checkVerify;
    setLoading(false);

    if (setUser && user.player) {
      // player already tied to account, can just log in
      if (user) {
        setUser(user);
        successToast('Successfully logged in!');
      } else {
        errorToast('Unknown error signing in.');
      }
    } else {
      // no player, need to ask
      setPartialUser(user);
    }
  };

  const handleNumberChange = (value: string) => {
    let removeLastNumber = false;
    if (['-', ' '].find(char => !value.includes(char))) {
      removeLastNumber = true;
    }
    ['(', ')', '_', ' ', '-'].map((digit: string) => value = value.replaceAll(digit, ''));
    const reg: RegExp = /^[0-9]*$/;
    if (removeLastNumber) {
      value = value.substring(0, value.length - 1);
    }
    if (reg.test(value)) {
      setNumber(value);
    }
  }

  const handleCodeChange = (value: string) => {
    value = value.replaceAll('_', '');
    setCode(value);
  }

  const generateFocusOrClickHandler = (ref: React.MutableRefObject<HTMLInputElement | undefined>, value: string) => (
    (event: any) => {
      setCursorPos(ref, value);
    }
  );

  if (loading) {
    return <Loader />;
  }

  // if a partial user is shown, prompt for player
  if (partialUser) {
    return <PickPlayerPage user={partialUser} />
  }

  if (showVerify) {
    return (
      <form className="flex flex-col" onSubmit={handleVerifySubmit}>
        <p className="font-pd text-white leading-10 mb-2">enter verification code</p>
        <p className="font-pop mb-2 text-xs">Code was sent to +1{formatNumber(number)}</p>
        <TextBox
          id="code"
          className='w-full text-sm'
          innerRef={verRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete='one-time-code'
          value={formatNumber(code, '______')}
          onChange={handleCodeChange}
          onFocus={generateFocusOrClickHandler(verRef, formatNumber(code, '______'))}
          onClick={generateFocusOrClickHandler(verRef, formatNumber(code, '______'))}
          error={error}
        />
        <button className="btn w-1/2 m-2 ml-0 font-pop self-end text-lg bg-yellow hover:bg-yellower text-black font-bold py-2 px-4 mb-6" type="submit">
          Play
        </button>
      </form>
    );
  } else {
    return (
      <form className="flex flex-col" onSubmit={handleNumberSubmit}>
        <p className="font-pd text-white leading-10 mb-8">enter your phone number</p>
        <TextBox
          id="number"
          className='w-full text-sm'
          innerRef={numRef}
          type="tel"
          value={formatNumber(number)}
          onChange={handleNumberChange}
          onFocus={generateFocusOrClickHandler(numRef, formatNumber(number))}
          onClick={generateFocusOrClickHandler(numRef, formatNumber(number))}
          error={error}
        />
        <button className="btn w-1/2 m-2 ml-0 font-pop self-end text-lg bg-yellow hover:bg-yellower text-black font-bold py-2 px-4 mb-6" type="submit">
          Play
        </button>
      </form>
    );
  }
};

export default Login;
