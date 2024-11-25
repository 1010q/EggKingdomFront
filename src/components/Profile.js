import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null); // データ全体を格納
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://eggkingdam-back.onrender.com/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data);
        setUsername(response.data.username);
      } catch (err) {
        setError('プロフィールを取得できませんでした');
        console.error('プロフィール取得エラー:', err);
      }
    };

    if (token) {
      fetchData();
    } else {
      setError('ログインが必要です');
    }
  }, [token, userId]);

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    if (image) {
      formData.append('user_image', image);
    }

    try {
      const response = await axios.patch(`https://eggkingdam-back.onrender.com/profile/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage(response.data.message);
      setData({ ...data, username, image_url: response.data.updated_data.image_url || data.image_url });
    } catch (err) {
      setError('プロフィール更新に失敗しました');
      console.error('プロフィール更新エラー:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        'http://127.0.0.1:8000/logout',
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      localStorage.removeItem('access_token');
      setMessage('ログアウトしました');
      navigate('/login');
    } catch (err) {
      setError('ログアウトに失敗しました');
      console.error('ログアウトエラー:', err);
    }
  };

  // データが未ロードまたはエラー時の処理
  if (!data) {
    return (
      <div className="container mt-4">
        <h1 className="text-center mb-4">プロフィール</h1>
        {error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <p className="text-center">データを読み込み中...</p>
        )}
      </div>
    );
  }

  return (
    <div>
      <Header 
        username={data.username || 'ゲスト'} 
        userImageUrl={data.user_image_url || '/path/to/default-image.jpg'}
        user_id={userId}
      />
      <div className="container mt-4">
        <h1 className="text-center mb-4">プロフィール</h1>

        {message && <div className="alert alert-success">{message}</div>}

        <div className="card shadow p-4">
          <div className="text-center mb-4">
            <h2>{data.username}</h2>
            <img
              src={data.user_image_url}
              alt="Profile"
              className="rounded-circle"
              width="150"
              height="150"
            />
            <p className="mt-3">スターの合計数: <strong>{data.star_count}</strong></p>
          </div>

          <div className="mb-4">
            <h3>投稿一覧</h3>
            <ul className="list-group">
              {data.posts.map((post) => (
                <li className="list-group-item" key={post.id}>
                  <h5>{post.title}</h5>
                  <p>{post.content}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <h3>スターした投稿</h3>
            <ul className="list-group">
              {data.starred_posts.length > 0 ? (
                data.starred_posts.map((post) => (
                  <li className="list-group-item" key={post.post_id}>
                    <p>{post.post_id}</p>
                  </li>
                ))
              ) : (
                <p>スターした投稿はありません</p>
              )}
            </ul>
          </div>

          <div className="mb-4">
            <h3>プロフィール更新</h3>
            <form onSubmit={handleUpdateProfile}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">ユーザー名:</label>
                <input
                  type="text"
                  id="username"
                  className="form-control"
                  value={username}
                  onChange={handleUsernameChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="image" className="form-label">プロフィール画像:</label>
                <input
                  type="file"
                  id="image"
                  className="form-control"
                  onChange={handleImageChange}
                />
              </div>
              <button type="submit" className="btn btn-primary">更新</button>
            </form>
          </div>

          <div className="text-center">
            <button onClick={handleLogout} className="btn btn-danger mt-4">
              ログアウト
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;