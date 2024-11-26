import React from 'react';
import { Link } from 'react-router-dom';
import appIcon from '../assets/app-icon.png'; // アプリアイコンの画像

const Header = () => {
  // ローカルストレージから情報を取得
  const user_id = localStorage.getItem('user_id');
  const username = localStorage.getItem('username');
  const userImageUrl = localStorage.getItem('user_image');
  const token = localStorage.getItem('access_token');
  return (
    <header className="bg-warning py-3">
      <div className="container d-flex justify-content-between align-items-center">
        {/* 左側: アプリアイコンと名前 */}
        <div className="d-flex align-items-center">
          <Link to="/" className="text-decoration-none d-flex align-items-center">
            <img
              src={appIcon}
              alt="App Icon"
              width="40"
              height="40"
              className="me-2"
            />
            <h1 className="h3 text-dark mb-0">えっぐきんぐだむ</h1>
          </Link>
        </div>

        {/* 右側: ユーザー名とアイコン */}
        <div className="d-flex align-items-center">
          <span className="me-2 text-dark fw-bold">{username}</span>
          <Link to={`/profile/${user_id}`} className="text-decoration-none">
            <img
              src={userImageUrl}
              alt={`${username}'s Profile`}
              width="40"
              height="40"
              className="rounded-circle"
            />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;