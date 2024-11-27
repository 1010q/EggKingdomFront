import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css'; // CSSファイルをインポート

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isMan, setIsMan] = useState(null); // 初期値をnull
  const [age, setAge] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const signup = {
      username,
      email,
      password,
      is_man: isMan,
      age: age ? parseInt(age, 10) : null, // 空欄の場合はnull
    };

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
          <div className="mb-3">
            <label className="form-label">性別</label>
            <div>
              <label className="form-check-label me-3">
                <input
                  type="radio"
                  className="form-check-input"
                  value="true"
                  checked={isMan === true}
                  onChange={() => setIsMan(true)}
                />
                男性
              </label>
              <label className="form-check-label me-3">
                <input
                  type="radio"
                  className="form-check-input"
                  value="false"
                  checked={isMan === false}
                  onChange={() => setIsMan(false)}
                />
                女性
              </label>
              <label className="form-check-label">
                <input
                  type="radio"
                  className="form-check-input"
                  value="null"
                  checked={isMan === null}
                  onChange={() => setIsMan(null)}
                />
                無回答
              </label>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">年齢</label>
            <input
              type="number"
              className="form-control"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="任意入力"
            />
          </div>
          {error && <p className="text-danger text-center">{error}</p>}
          {successMessage && <p className="text-success text-center">{successMessage}</p>}
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">アカウント登録</button>
          </div>
        </form>
        <p className="text-center mt-3">
          アカウントをお持の方は <Link to='/login'>こちら</Link> からログインできます。
        </p>
      </div>
    </div>
  );
};

export default Register;