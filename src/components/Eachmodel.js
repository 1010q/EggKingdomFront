import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header'; // ヘッダーコンポーネントをインポート

const Eachmodel = () => {
  const navigate = useNavigate();
  const [riceAmount, setRiceAmount] = useState('');
  const [eggAmount, setEggAmount] = useState('');
  const [predictedSoySauce, setPredictedSoySauce] = useState(null);
  const [error, setError] = useState('');
  const token = localStorage.getItem('access_token'); // トークンを取得

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPredictedSoySauce(null);

    try {
      const response = await axios.post(
        'https://eggkingdam-back.onrender.com/material/input/eachmodel', // バックエンドのエンドポイント
        {
          rice_amount: parseFloat(riceAmount),
          egg_amount: parseFloat(eggAmount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPredictedSoySauce(response.data.predicted_soy_sauce);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        navigate('/login');
      } else {
        setError('データを取得できませんでした');
      }
      console.error('データ取得エラー:', err);
    }
  };

  const handleNavigate = () => {
    if (predictedSoySauce !== null) {
      navigate('/user/TKG/rating', {
        state: {
          riceAmount: parseFloat(riceAmount),
          eggAmount: parseFloat(eggAmount),
          predictedSoySauce,
        },
      });
    } else {
      setError('予測結果がありません。もう一度試してください。');
    }
  };

  return (
    <div>
      {/* ヘッダー */}
      <Header/>

      {/* 予測フォーム */}
      <div className="container mt-5">
        <h1 className="mb-4">醤油の量を予測</h1>
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
          <button type="submit" className="btn btn-primary">予測する</button>
        </form>

        {/* 予測結果表示 */}
        {predictedSoySauce !== null && (
          <div className="alert alert-success mt-4">
            <h2>予測結果</h2>
            <p>
              醤油の量: <strong>{predictedSoySauce} ml</strong>
            </p>
            <button onClick={handleNavigate} className="btn btn-secondary">評価画面へ</button>
          </div>
        )}

        {/* エラーメッセージ */}
        {error && <p className="text-danger">{error}</p>}
      </div>
    </div>
  );
};

export default Eachmodel;