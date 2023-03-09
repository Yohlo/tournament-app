import { useQuery } from '@apollo/client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import Loader from '../../components/Loader';
import { ME } from '../../services/queries';
import { User } from '../../types';


interface UserContextType {
    user: User | undefined
    setUser: React.Dispatch<React.SetStateAction<User | undefined>> | undefined
}

interface UserData {
    user: User | undefined,
    setUser: React.Dispatch<React.SetStateAction<User | undefined>> | undefined
}

// eslint-disable-next-line object-curly-newline
export const UserContext = createContext<UserContextType>({ user: undefined, setUser: undefined });

export const useUser: () => UserData = () => {
    const { user, setUser } = useContext(UserContext);
    return {
        user,
        setUser
    };
};


export const UserProvider: React.FC<{ children: any }> = ({ children }: any) => {
    const [user, setUser] = useState<User>();
    const { data, loading } = useQuery(ME);

    useEffect(() => {
        if (data) {
            setUser(prev => ({
                ...prev,
                ...data.me
            }))
        }
    }, [data]);

    if (loading) {
        return (
          <div
            style={{
              paddingTop: '30vh'
            }}
          >
            <Loader />
          </div>
        );
    }

    return (
        <UserContext.Provider value={{
            user,
            setUser
        }}>
            {children}
        </UserContext.Provider>
    );
  };
