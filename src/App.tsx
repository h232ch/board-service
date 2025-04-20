import React, { useState } from 'react';
import Header from './components/Header';
import './App.css';
import Login from './components/Login';

function App() {
  // 로그인 상태 관리
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (inputUsername: string, password: string) => {
    // 실제로는 여기서 API 호출을 해야 하지만, 지금은 간단히 구현
    if (inputUsername && password) {
      setIsLoggedIn(true);
      setUsername(inputUsername);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  return (
    <div className="App">
      <Header title="Board Service">
        {isLoggedIn ? (
          <div>
            Welcome, {username}!
            <button onClick={handleLogout} style={{ marginLeft: '1rem' }}>
              Logout
            </button>
          </div>
        ) : (
          'A place to share your thoughts and ideas'
        )}
      </Header>
      {!isLoggedIn && <Login onLogin={handleLogin} />}
      <main>
        {isLoggedIn ? (
          <div>
            <h2>Welcome to the Board!</h2>
            <p>You can now post and interact with others.</p>
          </div>
        ) : (
          <p>Please login to access the board.</p>
        )}
      </main>
    </div>
  );
}

export default App;
