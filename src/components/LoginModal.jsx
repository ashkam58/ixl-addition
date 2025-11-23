import React, { useState } from 'react';

export default function LoginModal({ onClose, onLogin, onSignup }) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) return;
    if (isSignup && !name.trim()) return;

    setLoading(true);
    try {
      if (isSignup) {
        await onSignup(name, email, password);
      } else {
        await onLogin(email, password);
      }
      onClose();
    } catch (err) {
      console.error("Auth failed", err);
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal-content" onClick={e => e.stopPropagation()}>
        <button className="login-close-btn" onClick={onClose}>×</button>

        <div className="login-header">
          <h2>{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
          <p>{isSignup ? 'Start your learning journey today!' : 'Login to access your dashboard.'}</p>
        </div>

        <div className="auth-tabs">
          <button
            className={`tab-btn ${!isSignup ? 'active' : ''}`}
            onClick={() => setIsSignup(false)}
          >
            Login
          </button>
          <button
            className={`tab-btn ${isSignup ? 'active' : ''}`}
            onClick={() => setIsSignup(true)}
          >
            Sign Up
          </button>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="parent@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? 'Processing...' : (isSignup ? 'Sign Up' : 'Login')}
          </button>
        </form>
      </div>

      <style>{`
        .login-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3500;
          animation: fadeIn 0.2s ease-out;
        }

        .login-modal-content {
          background: white;
          padding: 32px;
          border-radius: 24px;
          width: 90%;
          max-width: 400px;
          position: relative;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          animation: slideUp 0.3s ease-out;
        }

        .login-close-btn {
          position: absolute;
          top: 16px;
          right: 20px;
          background: none;
          border: none;
          font-size: 28px;
          color: #94a3b8;
          cursor: pointer;
        }

        .login-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .login-header h2 {
          margin: 0 0 8px 0;
          color: #1e293b;
          font-size: 24px;
        }

        .login-header p {
          margin: 0;
          color: #64748b;
        }

        .auth-tabs {
          display: flex;
          background: #f1f5f9;
          padding: 4px;
          border-radius: 12px;
          margin-bottom: 24px;
        }

        .tab-btn {
          flex: 1;
          padding: 10px;
          border: none;
          background: none;
          border-radius: 8px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab-btn.active {
          background: white;
          color: #3b82f6;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .error-msg {
          background: #fee2e2;
          color: #ef4444;
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 16px;
          font-size: 14px;
          text-align: center;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #475569;
          font-size: 14px;
        }

        .form-group input {
          width: 100%;
          padding: 12px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 16px;
          transition: border-color 0.2s;
        }

        .form-group input:focus {
          border-color: #3b82f6;
          outline: none;
        }

        .login-submit-btn {
          width: 100%;
          padding: 14px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }

        .login-submit-btn:hover {
          background: #2563eb;
        }

        .login-submit-btn:disabled {
          background: #94a3b8;
          cursor: not-allowed;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
