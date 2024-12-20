import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/dashStyles.css";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
    fetchActivities();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://192.168.1.2/bayaniapi/get_posts.php");
      setPosts(response.data.posts);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Error fetching posts");
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await axios.get("http://192.168.1.2/bayaniapi/get_activities.php");
      setRecentActivities(response.data.activities);
    } catch (err) {
      console.error("Error fetching activities:", err);
      setError("Error fetching activities");
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (newPost.trim() === "") return;

    try {
      const response = await axios.post("http://192.168.1.2/bayaniapi/create_post.php", {
        post_text: newPost,
        post_type: "text",
      });

      if (response.data.success) {
        fetchPosts(); // Reload posts after successful post creation
        setNewPost(""); // Clear the input field
      } else {
        setError("Error creating post");
      }
    } catch (err) {
      console.error("Error creating post:", err);
      setError("Error creating post");
    }
  };

  const handlePostDelete = async (postId) => {
    try {
      const response = await axios.post("http://192.168.1.2/bayaniapi/delete_post.php", {
        post_id: postId,
      });

      if (response.data.success) {
        fetchPosts(); // Reload posts after successful deletion
      } else {
        setError("Error deleting post");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      setError("Error deleting post");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      // Perform logout operation, such as clearing session or token
      navigate("/login"); // Redirect to login page
    }
  };

  return (
    <div className="container">
      <nav>
        <div className="nav-left">
          <h1>Welcome, {sessionStorage.getItem("user_name")}</h1>
        </div>
        <button className="nav-toggle" onClick={() => document.querySelector('.nav-center').classList.toggle('active')}>
          ☰
        </button>
        <div className="nav-center">
          <a href="/dashboard">
            <i className="fa-solid fa-house"></i>
          </a>
          <a href="/help_requests">
            <i className="fa-solid fa-tv"></i>
          </a>
          <a href="/resource_sharing">
            <i className="fa-solid fa-share"></i>
          </a>
          <a href="/events">
            <i className="fa-solid fa-calendar"></i>
          </a>
        </div>
        <div className="nav-right">
          <a href="/profile">
            <i className="fa-solid fa-user"></i>
          </a>
          <a href="#" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i>
          </a>
        </div>
      </nav>

      <div className="main-content">
        <div className="main-left">
          <div className="create-post">
            <form onSubmit={handlePostSubmit}>
              <textarea
                name="post_text"
                placeholder="What's your request?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                required
              ></textarea>
              <button type="submit" className="post-button">
                Post
              </button>
            </form>
          </div>
          {error && <div className="error-message">{error}</div>}

          <div className="posts">
            <h2>Posts</h2>
            <ul>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <li key={post.id}>
                    <h3>{post.post_text}</h3>
                    <p>Posted by: {post.user_name}</p>
                    <p>Posted on: {post.created_at}</p>
                    <button
                      className="delete-button"
                      onClick={() => handlePostDelete(post.id)}
                    >
                      Delete
                    </button>
                  </li>
                ))
              ) : (
                <p>No posts available.</p>
              )}
            </ul>
          </div>
        </div>

        <div className="main-right">
          <div className="recent-activities">
            <h2>Recent Activities</h2>
            <ul>
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <li key={activity.id}>
                    <p>
                      <strong>{activity.activity_type}</strong> <br />
                      {activity.activity_text} - <br />
                      <small>{activity.created_at}</small>
                    </p>
                  </li>
                ))
              ) : (
                <p>No recent activities.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
