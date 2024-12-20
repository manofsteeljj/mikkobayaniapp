import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../css/styles.css';

const Login = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleTogglePanel = () => {
    setIsRightPanelActive(!isRightPanelActive);
  };

  const handleInputChange = (e, form) => {
    const { name, value } = e.target;
    form === "login"
      ? setLoginData((prev) => ({ ...prev, [name]: value }))
      : setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://192.168.1.2/bayaniapi/validate_login.php", loginData);
      const data = response.data;

      if (data.message === "Login successful.") {
        // Store user info in local storage or state (e.g., user token or user id)
        localStorage.setItem("user_id", data.user_id); // Example for storing user ID
        localStorage.setItem("email", loginData.email); // Example for storing email

        // Redirect to dashboard or home page after successful login
        navigate("/dashboard"); // Or any route you want to redirect to
      } else {
        setError(data.message); // Display the error message from the response
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during login.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://192.168.1.2/bayaniapi/validate_register.php", registerData);
      console.log(response.data);
      // Handle successful registration
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during registration.");
    }
  };

  return (
    <div className={`container ${isRightPanelActive ? "right-panel-active" : ""}`} id="container">
      {/* Sign In Form */}
      <div className="form-container sign-in-container">
        <form onSubmit={handleLogin}>
          <h1>Sign in</h1>
          <div className="social-container">
            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <span>or use your account</span>
          <div className="infield">
            <input 
              type="text" 
              placeholder="Email" 
              name="email" 
              value={loginData.email} 
              onChange={(e) => handleInputChange(e, "login")} 
            />
          </div>
          <div className="infield">
            <input 
              type="password" 
              placeholder="Password" 
              name="password" 
              value={loginData.password} 
              onChange={(e) => handleInputChange(e, "login")} 
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit">Sign In</button>
        </form>
      </div>

      {/* Sign Up Form */}
      <div className="form-container sign-up-container">
        <form onSubmit={handleRegister}>
          <h1>Sign Up</h1>
          <div className="social-container">
            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <span>or use your email to register</span>
          <div className="infield">
            <input 
              type="text" 
              placeholder="Name" 
              name="name" 
              value={registerData.name} 
              onChange={(e) => handleInputChange(e, "register")} 
            />
          </div>
          <div className="infield">
            <input 
              type="email" 
              placeholder="Email" 
              name="email" 
              value={registerData.email} 
              onChange={(e) => handleInputChange(e, "register")} 
            />
          </div>
          <div className="infield">
            <input 
              type="password" 
              placeholder="Password" 
              name="password" 
              value={registerData.password} 
              onChange={(e) => handleInputChange(e, "register")} 
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit">Sign Up</button>
        </form>
      </div>

      <div className="overlay-container" id="overlayCon">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Hello, Friend!</h1>
            <p>Register to Help others</p>
            <button onClick={handleTogglePanel}>Sign In</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Welcome Back!</h1>
            <p>Continue Helping Others</p>
            <button onClick={handleTogglePanel}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
