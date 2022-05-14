import { useState, useEffect, useContext } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import TextBox from '../../components/TextBox';
import AppContext from '../../contexts';
import { useToasts } from '../../hooks';
import Header from '../../components/Header';

const regex = {
  email: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/, //eslint-disable-line
  name: /^([a-zA-Z]+\s{0,1}[a-zA-Z]+\s{0,1}[a-zA-Z]+)$/, //eslint-disable-line
};

const Register: React.FC = () => {
  const { hash } = useParams();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [emailError, setEmailError] = useState<Boolean>(false);
  const [nameError, setNameError] = useState<Boolean>(false);
  const [disabled, setDisabled] = useState<Boolean>(false);
  // const [createUser] = useMutation(CREATE_USER);
  const { setUser } = useContext(AppContext);
  const { successToast, errorToast } = useToasts();
  const navigate = useNavigate();

  useEffect(() => {
    setDisabled(!name || !email || !password || nameError || emailError);
  }, [name, email, password, nameError, emailError]);

  const handleSubmit = async () => {
    /*const response = await createUser({
      variables: {
        user: {
          full_name: name,
          email,
          password,
          invite: hash,
        },
      },
    });

    if (!response.data) {
      errorToast('Unknown error creating account.');
    }

    const { success, user, errors }:
    { success: boolean, user: any, errors: string[] } = response.data.createUser;

    if (success && user && setUser) {
      setUser(user);
      navigate('/');
      successToast('Account created successfully.');
    } else {
      errorToast(errors.length ? errors[0] : 'Unknown error creating account.');
    }*/
  };

  return (
    <>
      <Header>Register</Header>
      <p className="text-sm font-pop pb-4 text-center text-gray-700 max-w-xs mx-auto">You&#39;ll be able to set up your team once registered.</p>
      <p className="text-xs italic font-bold font-pop pb-8 text-center text-gray-700 max-w-sm mx-auto">Do not share this link with anyone, as it only works once.</p>
      <TextBox
        id="name"
        label="Full Name"
        type="name"
        value={name}
        error={nameError ? 'Please enter a valid name.' : ''}
        onChange={(value) => {
          if (!regex.name.test(value)) {
            setNameError(true);
          } else {
            setNameError(false);
          }
          setName(value);
        }}
      />
      <TextBox
        id="email"
        label="Email"
        type="email"
        value={email}
        error={emailError ? 'Please enter a valid email address.' : ''}
        onChange={(value) => {
          if (!regex.email.test(value)) {
            setEmailError(true);
          } else {
            setEmailError(false);
          }
          setEmail(value);
        }}
      />
      <TextBox
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
      />
      <div>
        <button
          className={`btn w-full text-white font-pop font-bold py-2 px-4 mb-6 rounded ${disabled ? 'cursor-not-allowed bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'}`}
          type="submit"
          onClick={handleSubmit}
          disabled={Boolean(disabled)}
        >
          Let&#39;s go!
        </button>
      </div>
    </>
  );
};

export default Register;
