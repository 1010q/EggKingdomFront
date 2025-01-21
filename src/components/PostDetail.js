import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header"; // ヘッダーコンポーネントをインポート

const PostDetail = () => {
  const { post_id } = useParams(); // URLのパラメータからpost_idを取得
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");
  const [starCount, setStarCount] = useState(0);
  const navigate = useNavigate();

  const token = localStorage.getItem("access_token"); // トークンを取得

  // 投稿詳細とコメントを取得
  const fetchPostDetails = async () => {
    try {
      const response = await axios.post(
        `https://eggkingdam-back.onrender.com/postdetail/${post_id}`,
        { action: "get_post" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPost(response.data.post);
      setComments(response.data.comments);
      setStarCount(response.data.post.star_count);
    } catch (err) {
        if (err.response && err.response.status === 403) {
          navigate('/login');
        } else {
          setError('データを取得できませんでした');
        }
        console.error('データ取得エラー:', err);
      }
    };

  // コメントを追加
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setError("コメント内容を入力してください。");
      return;
    }
  
    try {
      const response = await axios.post(
        `https://eggkingdam-back.onrender.com/postdetail/${post_id}`,
        { action: "add_comment", content: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments([...comments, response.data.comment]); // 新しいコメントを即時追加
      setNewComment("");
    } catch (err) {
      setError("コメントの追加に失敗しました。");
      console.error("エラー:", err);
    }
  };

  // スターのトグル
  const handleToggleStar = async () => {
    try {
      const response = await axios.post(
        `https://eggkingdam-back.onrender.com/postdetail/${post_id}`,
        { action: "toggle_star" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStarCount(response.data.star_count);
    } catch (err) {
      setError("スターの更新に失敗しました。");
      console.error("エラー:", err);
    }
  };

  useEffect(() => {
    fetchPostDetails();
  }, [post_id]);

  if (!post) {
    return <p>投稿情報を読み込み中...</p>;
  }

  const handleDeletePost = async () => {
    if (!window.confirm("この投稿を削除しますか？")) return;

    try {
      await axios.post(
        `https://eggkingdam-back.onrender.com/postdetail/${post_id}`,
        { action: "post_delete" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/"); // 投稿削除後にトップページへリダイレクト
    } catch (err) {
      setError("投稿の削除に失敗しました。");
      console.error("削除エラー:", err);
    }
  };

  return (
    <div>
      {/* ヘッダー */}
      <Header/>

      {/* 投稿詳細 */}
      <div className="container my-4">
        <div className="card mb-4">
          <div className="card-body">
            <h1 className="card-title">{post.title}</h1>
            <p className="card-text">{post.description}</p>
 
            {/* 投稿の画像を表示 */}
            {post.image_url && (
              <div className="mb-3">
                <img
                  src={post.image_url}
                  alt="Post visual"
                  className="img-fluid"
                />
              </div>
            )}

            <p>スター数: {starCount}</p>
            <button
              className="btn btn-warning"
              onClick={handleToggleStar}
            >
              {starCount > 0 ? "スターを外す" : "スターをつける"}
            </button>
            {/* 削除ボタン */}
            {post.user_id === localStorage.getItem("user_id") && (
              <button
                className="btn btn-danger ms-3"
                onClick={handleDeletePost}
              >
                投稿を削除
              </button>
            )}
          </div>
        </div>

        {/* コメントセクション */}
        <h2>コメント</h2>
        <ul className="list-group mb-4">
          {comments.map((comment) => (
            <li key={comment.id} className="list-group-item">
              <p>{comment.content}</p>
              <small>ユーザーID: {comment.user_id}</small>
            </li>
          ))}
        </ul>

        {/* コメント追加フォーム */}
        <form onSubmit={handleAddComment}>
          <div className="mb-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="コメントを入力"
              className="form-control"
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-success">
            コメントを追加
          </button>
        </form>

        {/* エラーメッセージ */}
        {error && <p className="text-danger mt-3">{error}</p>}
      </div>
    </div>
  );
};

export default PostDetail;