import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; // axiosをインポート
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSSをインポート
import './Login.css'; // CSSファイルをインポート
import '../styles/global.css';

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

      const { access_token, user_id, username: responseUsername, image_url } = response.data;

      // ローカルストレージにトークンとユーザー情報を保存
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user_id', user_id);
      localStorage.setItem('username', responseUsername);
      localStorage.setItem('user_image', image_url);

      navigate('/');
    } catch (err) {
      console.error('ログイン失敗:', err);
      setError('ログインに失敗しました');
    }
  };
 
  return (
    <div className="login-container bg-light">
      <div className="card shadow-lg p-5" style={{ width: '400px', maxWidth: '90%' }}>
        <h2 className="text-center mb-4">ログイン</h2>
        <form onSubmit={handleLogin} className="needs-validation" noValidate>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">メールアドレス:</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            />
            <div className="invalid-feedback">
              有効なメールアドレスを入力してください。
            </div>
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
              minLength="8"
            />
            <div className="invalid-feedback">
              パスワードは8文字以上で入力してください。
            </div>
          </div>
          {error && <p className="text-danger text-center">{error}</p>}
          <div className="d-grid">
            <button type="submit" className="btn btn-primary btn-lg btn-block w-100">ログイン</button>
          </div>
        </form>
        <p className="text-center mt-3">
          アカウントをお持ちでない方は <Link to='/register'>こちら</Link> から作成できます。
        </p>
      </div>
    </div>
  );
};

export default Login;
<script>
{`
  (function () {
    'use strict'
    var forms = document.querySelectorAll('.needs-validation')
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
          form.classList.add('was-validated')
        }, false)
      })
  })()
`}
</script>

