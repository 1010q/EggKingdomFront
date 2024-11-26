// src/components/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css'; // CSSファイルをインポート

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const signup = { username, email, password };

    try {
      const response = await axios.post('https://eggkingdam-back.onrender.com/register', signup);
      console.log('API Response:', response);

      const { access_token, user_id, username: responseUsername, image_url } = response.data;

      // ローカルストレージにトークンとユーザー情報を保存
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user_id', user_id);
      localStorage.setItem('username', responseUsername);
      localStorage.setItem('user_image', image_url);

      setSuccessMessage('登録成功！');
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      <div className="card shadow p-4" style={{ width: '400px' }}>
        <h2 className="text-center mb-4">アカウント登録</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">ユーザーネーム</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">メール</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">パスワード</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">パスワードをもう一度入力してください</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-danger text-center">{error}</p>}
          {successMessage && <p className="text-success text-center">{successMessage}</p>}
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">アカウント登録</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;