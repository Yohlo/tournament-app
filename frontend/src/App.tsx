import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import Content from './components/Layout/Content';
import Nav from './components/Layout/Nav';
import Login from './pages/Login';
import { User } from './types';
import ToastProvider from './contexts/Toast/ToastProvider';
import Home from './pages/Home';
import styles from './App.module.css';
import Logout from './pages/Logout';
import Admin from './pages/Admin';
import Header from './components/Header';
import EditTeam from './pages/EditTeam';
import Teams from './pages/Teams';
import History from './pages/History';
import { TournamentProvider } from './contexts/Tournament';
import { useUser } from './contexts/User';
import Success from './components/OAuth';
import Authorization from './components/Authorization';
import Tournament from './pages/Tournament';
import Results from './pages/Results';
import Matches from './pages/Matches';

function App() {
  const { user }= useUser();

  return (
    <ToastProvider>
      <BrowserRouter>
        {
          !user || !user.player
            ? (
              <>
                <div style={{
                  marginTop: '2rem'
                }}>
                  <img alt="logo"
                    style={{
                      height: '15rem',
                      margin: '0 auto'
                    }}
                    src={require('./images/logo.png')}
                  />
                  <hr />
                </div>
                <Content styles={styles.loginContent}>
                  <Routes key="not-logged-in">
                    <Route path="*" element={<Login />} />
                  </Routes>
                </Content>
              </>
            )
            : (
              <TournamentProvider>
                <div className="flex flex-col md:flex-row min-h-screen w-full max-h-screen">
                  <Nav />
                  <Routes>
                    <Route path="Home" element={<Home />} />
                    {
                        user?.admin && (
                          <Route path="/Admin/Tournament" element={(
                            <Content styles={styles.desktopContent}>
                              <Authorization>
                                <Tournament />
                              </Authorization>
                            </Content>
                          )} />
                        )
                      }
                    <Route path="/Matches" element={(
                      <>
                        <Content styles={styles.responsiveContent}>
                          <Matches />
                        </Content>
                        {
                          user?.admin && (
                            <div className="relative">
                              <div
                                style={{
                                  zIndex: -1,
                                  width: '30rem'
                                }}
                                className="absolute bottom-0 -right-52"
                              >
                                <img alt="logo"
                                  style={{
                                    width: '20rem',
                                  }}
                                  src={require('./images/logo.png')}
                                />
                              </div>
                            </div>
                          )
                        }
                      </>
                    )}/>
                    <Route path="/" element={<Content />}>
                      <Route index element={<Navigate to="/Home" replace />} />
                      <Route path="Results" element={<Results />} />
                      <Route path="History" element={<History />} />
                      <Route path="Teams" element={<Teams />} />
                      <Route path="Team/Edit" element={<EditTeam />} />
                      <Route path="Logout" element={<Logout />} />
                      {
                        user?.admin && (
                          <Route path="Admin" element={<Admin />} />
                        )
                      }
                      {
                        user?.admin && (
                          <Route path="/music/auth/success" element={<Success />} />
                        )
                      }
                      <Route path="*" element={<Header fs={'3rem'} wrap={true}>404 - Not Found</Header>} />
                    </Route>
                  </Routes>
                </div>
              </TournamentProvider>
            )
          }
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
