import React, { useEffect, useState } from 'react';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import Content from './components/Layout/Content';
import Nav from './components/Layout/Nav';
import Login from './pages/Login';
import AppContext from './contexts';
import { User } from './types';
import ToastProvider from './contexts/Toast/ToastProvider';
import Home from './pages/Home';
import styles from './App.module.css';
import Logout from './pages/Logout';
import { ME } from './services/queries';
import Admin from './pages/Admin';
import Register from './pages/Register';
import Header from './components/Header';
import Success from './components/OAuth';
import Authorization from './components/Authorization';

function App() {
  const [user, setUser] = useState<User | null>();
  const { loading, data } = useQuery(ME);

  useEffect(() => {
    if (data?.me) {
      setUser(data.me);
    }
  }, [data, setUser]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      <ToastProvider>
        <BrowserRouter>
          {
            !user
              ? (
                <Content styles={styles.loginContent}>
                  <Routes key="not-logged-in">
                    <Route index element={<Login />} />
                  </Routes>
                </Content>
              )
              : (
                <div className="flex flex-col md:flex-row min-h-screen w-full max-h-screen">
                  <Nav />

                  <Routes>
                    <Route path="Home" element={<Home />} />
                    <Route path="/" element={<Content />}>
                      <Route index element={<Navigate to="/Home" replace />} />
                      <Route path="Logout" element={<Logout />} />
                      {
                        user?.admin && (
                          <Route path="Admin" element={<Admin />} />
                        )
                      }
                      <Route path="*" element={<Header>404 - Not Found</Header>} />
                    </Route>
                  </Routes>
                </div>
              )
            }
        </BrowserRouter>
      </ToastProvider>
    </AppContext.Provider>
  );
}

export default App;
