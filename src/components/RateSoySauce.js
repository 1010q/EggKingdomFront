import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header'; // ヘッダーコンポーネントをインポート

const RateSoySauce = () => {
  const [riceAmount, setRiceAmount] = useState('');
  const [eggAmount, setEggAmount] = useState('');
  const [soysauceAmount, setSoySauceAmount] = useState('');
  const [rating, setRating] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // リダイレクト用
  const token = localStorage.getItem('access_token'); // トークンを取得

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // エンドポイントに評価データを送信
      const response = await axios.post(
        'https://eggkingdam-back.onrender.com/add/eachmodel',
        {
          rice_amount: parseFloat(riceAmount),
          egg_amount: parseFloat(eggAmount),
          soysauce_amount: parseFloat(soysauceAmount),
          rating: parseInt(rating, 10), // 評価を整数に変換
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message === '評価を保存しました') {
        // 成功したらホームにリダイレクト
        navigate('/');
      }
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

      {/* 評価フォーム */}
      <div className="container mt-5">
        <h1 className="mb-4">評価を入力</h1>
        <form onSubmit={handleSubmit} className="shadow-lg p-4 mb-5 bg-light rounded">
          <div className="mb-3">
            <label htmlFor="rice" className="form-label">ご飯の量 (g):</label>
            <input
              type="number"
              id="rice"
              value={riceAmount}
              onChange={(e) => setRiceAmount(e.target.value)}
              className="form-control"
              required
              min="0"
              step="0.1"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="egg" className="form-label">卵の量 (個):</label>
            <input
              type="number"
              id="egg"
              value={eggAmount}
              onChange={(e) => setEggAmount(e.target.value)}
              className="form-control"
              required
              min="0"
              step="0.1"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="soysauce" className="form-label">醤油の量 (ml):</label>
            <input
              type="number"
              id="soysauce"
              value={soysauceAmount}
              onChange={(e) => setSoySauceAmount(e.target.value)}
              className="form-control"
              required
              min="0"
              step="0.1"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="rating" className="form-label">評価 (1〜9):</label>
            <input
              type="number"
              id="rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="form-control"
              required
              min="1"
              max="9"
            />
          </div>
          <button type="submit" className="btn btn-primary">評価を保存</button>
        </form>

        {/* エラーメッセージ */}
        {error && <p className="text-danger">{error}</p>}
      </div>
    </div>
  );
};

export default RateSoySauce;