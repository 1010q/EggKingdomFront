import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // axiosをインポート
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSSをインポート
import './Login.css'; // CSSファイルをインポート

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://eggkingdam-back.onrender.com/login', {
        email,
        password,
      });

      console.log('APIレスポンス:', response);

      localStorage.setItem('access_token', response.data.access_token);

      navigate('/');
    } catch (err) {
      console.error('ログイン失敗:', err);
      setError('ログインに失敗しました');
    }
  };

  return (
    <div className="login-container">
      <div className="card shadow p-4" style={{ width: '400px', zIndex: 2 }}>
        <h2 className="text-center mb-4">ログイン</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">メールアドレス:</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">パスワード:</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-danger text-center">{error}</p>}
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">ログイン</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;