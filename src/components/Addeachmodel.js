import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header'; // ヘッダーコンポーネントをインポート

const Addeachmodel = () => {
  const [riceAmount, setRiceAmount] = useState('');
  const [eggSize, setEggSize] = useState('M'); // 卵のサイズ
  const [eggCount, setEggCount] = useState(''); // 卵の個数
  const [soysauceAmount, setSoySauceAmount] = useState('');
  const [rating, setRating] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // リダイレクト用
  const token = localStorage.getItem('access_token'); // トークンを取得

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 卵のサイズに応じた重さを計算
    const eggWeightMap = { M: 60, L: 66, LL: 72 };
    const eggWeight = eggWeightMap[eggSize] * parseFloat(eggCount);

    try {
      // エンドポイントに評価データを送信
      const response = await axios.post(
        'https://eggkingdam-back.onrender.com/add/eachmodel',
        {
          rice_amount: parseFloat(riceAmount),
          egg_amount: eggWeight, // 計算した卵の重さを送信
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
      <Header />

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
              step="1"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="eggSize" className="form-label">卵のサイズ:</label>
            <select
              id="eggSize"
              value={eggSize}
              onChange={(e) => setEggSize(e.target.value)}
              className="form-select"
            >
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="LL">LL</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="eggCount" className="form-label">卵の個数:</label>
            <input
              type="number"
              id="eggCount"
              value={eggCount}
              onChange={(e) => setEggCount(e.target.value)}
              className="form-control"
              required
              min="1"
              step="1"
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
              placeholder='1:味が薄い〜9:味が濃い'
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

export default Addeachmodel;