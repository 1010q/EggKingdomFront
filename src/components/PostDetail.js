import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "./Header"; // ヘッダーコンポーネントをインポート

const PostDetail = () => {
  const { post_id } = useParams(); // URLのパラメータからpost_idを取得
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");
  const [starCount, setStarCount] = useState(0);

  const token = localStorage.getItem("access_token"); // トークンを取得
  const username = "ユーザー名"; // 動的に取得する場合はAPIからフェッチしてください
  const userImageUrl = "https://via.placeholder.com/40"; // 動的に取得する場合はAPIからフェッチ
  const user_id = 1; // 動的に取得する場合はAPIからフェッチ

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
      setError("投稿情報を取得できませんでした。");
      console.error("エラー:", err);
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
      setComments([...comments, response.data.new_comment]); // 新しいコメントを即時追加
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

  return (
    <div>
      {/* ヘッダー */}
      <Header
        username={username}
        userImageUrl={userImageUrl}
        user_id={user_id}
      />

      {/* 投稿詳細 */}
      <div className="container my-4">
        <div className="card mb-4">
          <div className="card-body">
            <h1 className="card-title">{post.title}</h1>
            <p className="card-text">{post.content}</p>

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