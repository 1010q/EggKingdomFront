import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';
import Header from './Header'; // Headerコンポーネントをインポート
import '../styles/global.css';

const Home = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const token = localStorage.getItem('access_token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://eggkingdam-back.onrender.com/', {
          headers: { Authorization: `Bearer ${token}` },
          params: { sort_by: sortBy },
        });
        setData(response.data);
      } catch (err) {
        if (err.response && err.response.status === 403) {
          navigate('/login');
        } else {
          setError('データを取得できませんでした');
        }
        console.error('データ取得エラー:', err);
      }
    }; 
 
    if (token) {
      fetchData();
    } else {
      setError('ログインが必要です');
      navigate('/login');
    }
  }, [token, sortBy]);

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  if (!data) {
    return <p>データを読み込み中...</p>;
  }

  const { user_id, username, user_image_url, posts, notifications, eachmodel_image, allmodel_image } = data;

  return (
    <div>
      {/* ヘッダーを追加 */}
      <Header/>

      <div className="container mt-5">
      <div className="row justify-content-center mb-5">
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <h5 className="card-title">{username}モデル画像</h5>
              <img
                src={eachmodel_image}
                alt="Each Model"
                className="img-fluid rounded mb-3"
                style={{ maxHeight: "200px", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <h5 className="card-title">全ユーザーモデル画像</h5>
              <img
                src={allmodel_image}
                alt="All Model"
                className="img-fluid rounded mb-3"
                style={{ maxHeight: "200px", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="d-grid gap-3 mb-5">
        <Link to="/add/eachmodel" className="btn btn-primary">
          {username}モデルにデータを追加
        </Link>
        <Link to="/material/input/allmodel" className="btn btn-primary">
          全ユーザーモデルで材料入力
        </Link>
        <Link to="/material/input/eachmodel" className="btn btn-primary">
          {username}モデルで材料入力
        </Link>
        <Link to="/post/create" className="btn btn-primary">
          卵かけご飯のレシピを投稿
        </Link>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="card-title">通知</h2>
              {notifications.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {notifications.map((notification, index) => (
                    <li key={index} className="list-group-item">
                      <p className="mb-1">{notification.message}</p>
                      <small className="text-muted">
                        {new Date(notification.created_at).toLocaleString()}
                      </small>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">現在通知はありません。</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="card-title">投稿一覧</h2>
              <div className="mb-3">
                <label className="form-label">ソート方法:</label>
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="form-select"
                >
                  <option value="created_at">作成日時順</option>
                  <option value="star_count">スター数順</option>
                </select>
              </div>
              <ul className="list-group list-group-flush">
                {posts.map((post) => (
                  <li key={post.post_id} className="list-group-item">
                    <h5>
                      <Link to={`/postdetail/${post.post_id}`} className="text-decoration-none">
                        {post.title}
                      </Link>
                    </h5>
                    <p className="mb-1">{post.content}</p>
                    <small className="text-muted">スター数: {post.star_count}</small>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {error && (
        <div className="alert alert-danger mt-4 text-center" role="alert">
          {error}
        </div>
      )}
    </div>
    </div>
  );
};

export default Home;

