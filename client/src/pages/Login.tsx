import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) return setError("Please fill in all fields.");
    const res = await api.login(email, password);
    if (res.token) {
      localStorage.setItem("token", res.token);
      const payload = JSON.parse(atob(res.token.split(".")[1]));
      localStorage.setItem("role", payload.role);
      localStorage.setItem("userId", payload.id);
      navigate("/");
    } else {
      setError(res.message || "Login failed.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h2>Welcome back</h2>
        <p className="subtitle">Sign in to your Gradebook account</p>
        <div className="form">
          <label>Email address</label>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@school.edu" />
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" />
          {error && <p className="error">{error}</p>}
          <button className="btn btn-primary" style={{ width: "100%" }} onClick={handleLogin}>Sign in</button>
        </div>
        <p className="link-text">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}