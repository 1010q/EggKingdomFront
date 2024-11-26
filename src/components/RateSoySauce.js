import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RateSoySauce = () => {
  const location = useLocation();
  const navigate = useNavigate(); // useNavigate を初期化
  const initialData = location.state || {}; // 遷移時のデータを取得
  const [riceAmount, setRiceAmount] = useState(initialData.riceAmount || '');
  const [eggSize, setEggSize] = useState(initialData.eggSize || 'M');
  const [eggAmount, setEggAmount] = useState(initialData.eggAmount || '');
  const [soysauceAmount, setSoySauceAmount] = useState(initialData.predictedSoySauce || '');
  const [rating, setRating] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('access_token'); // トークンを取得

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post(
        'https://eggkingdam-back.onrender.com/user/TKG/rating', // バックエンドのエンドポイント
        {
          rice_amount: parseFloat(riceAmount),
          egg_amount: parseFloat(eggAmount),
          soysauce_amount: parseFloat(soysauceAmount),
          rating: parseInt(rating, 10),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message === '評価を保存しました') {
        setMessage('評価が正常に保存されました');
        setTimeout(() => {
          navigate('/'); // ホーム画面に遷移
        }, 2000); // 2秒後に遷移
      }
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError('認証エラー: 再ログインしてください');
      } else {
        setError('データを送信できませんでした');
      }
      console.error('エラー:', err);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">卵かけご飯評価フォーム</h1>
      <form onSubmit={handleSubmit} className="shadow-lg p-4 bg-light rounded">
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
          <label htmlFor="eggAmount" className="form-label">卵の量 (個):</label>
          <input
            type="number"
            id="eggAmount"
            value={eggAmount}
            onChange={(e) => setEggAmount(e.target.value)}
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
          />
        </div>
        <button type="submit" className="btn btn-primary">評価を保存</button>
      </form>

      {message && <p className="text-success mt-3">{message}</p>}
      {error && <p className="text-danger mt-3">{error}</p>}
    </div>
  );
};

export default RateSoySauce;