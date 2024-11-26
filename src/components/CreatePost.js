import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // useNavigateをインポート
import Header from './Header'; // Headerコンポーネントをインポート

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const token = localStorage.getItem('access_token'); // トークンを取得
  const navigate = useNavigate(); // useNavigateを初期化

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
 
    // FormDataを作成
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', image);

    try {
      // 投稿作成API呼び出し
      const response = await axios.post(
        'https://eggkingdam-back.onrender.com/post/create',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // 成功時の処理
      setSuccessMessage(`投稿が作成されました。投稿ID: ${response.data.post_id}`);
      setTitle('');
      setDescription('');
      setImage(null);

      // 投稿作成後に投稿詳細ページにリダイレクト
      navigate(`/postdetail/${response.data.post_id}`);

    } catch (err) {
      if (err.response && err.response.status === 403) {
        navigate('/login');
      } else {
        setError('データを取得できませんでした');
      }
      console.error('データ取得エラー:', err);
    }
  };

  return (
    <div>
      {/* ヘッダー */}
      <Header/>

      {/* 投稿作成フォーム */}
      <div className="container mt-4">
        <form onSubmit={handleSubmit} className="shadow-lg p-4 mb-5 bg-white rounded">
          <div className="mb-3">
            <label htmlFor="title" className="form-label">タイトル:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control"
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="description" className="form-label">説明:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control"
              required
            ></textarea>
          </div>

          <div className="mb-3">
            <label htmlFor="image" className="form-label">画像を選択:</label>
            <input
              type="file"
              id="image"
              onChange={(e) => setImage(e.target.files[0])}
              className="form-control"
              required
              accept="image/*"
            />
          </div>

          <button type="submit" className="btn btn-primary">投稿を作成</button>
        </form>

        {/* 成功メッセージ */}
        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}

        {/* エラーメッセージ */}
        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}
      </div>
    </div>
  );
};

export default CreatePost;