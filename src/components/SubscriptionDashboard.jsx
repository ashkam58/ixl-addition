import React from 'react';

export default function SubscriptionDashboard({ isSubscribed, userName, planName, onClose }) {
  return (
    <div className="dashboard-overlay">
      <div className="dashboard-content">
        <button className="dashboard-close" onClick={onClose}>×</button>

        <div className="dashboard-header">
          <div className="avatar">
            {userName ? userName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-info">
            <h3>{userName || 'Learner'}</h3>
            <span className={`status-badge ${isSubscribed ? 'pro' : 'free'}`}>
              {isSubscribed ? (planName || 'PRO MEMBER 💎') : 'FREE PLAN'}
            </span>
          </div>
        </div>

        <div className="dashboard-body">
          <h4>Your Eligibility</h4>
          <div className="eligibility-grid">
            <div className={`eligibility-item ${isSubscribed ? 'active' : ''}`}>
              <span className="icon">🔓</span>
              <div className="text">
                <strong>Unlimited Practice</strong>
                <p>Access all math skills without limits.</p>
              </div>
              {isSubscribed && <span className="check">✓</span>}
            </div>

            <div className={`eligibility-item ${isSubscribed ? 'active' : ''}`}>
              <span className="icon">🚀</span>
              <div className="text">
                <strong>Advanced Labs</strong>
                <p>Algebra, Geometry, and Physics labs.</p>
              </div>
              {isSubscribed && <span className="check">✓</span>}
            </div>

            <div className={`eligibility-item ${isSubscribed ? 'active' : ''}`}>
              <span className="icon">👩‍🏫</span>
              <div className="text">
                <strong>1:1 Live Classes</strong>
                <p>Eligible for discount on live sessions.</p>
              </div>
              {isSubscribed && <span className="check">✓</span>}
            </div>
          </div>

          {!isSubscribed && (
            <div className="upsell-box">
              <p>Upgrade to Pro to unlock everything!</p>
              {/* This button can trigger the AdModal/Payment flow */}
              <button className="upgrade-btn" onClick={() => window.location.reload()}>
                Upgrade Now
              </button>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .dashboard-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 4000;
          backdrop-filter: blur(5px);
        }
        .dashboard-content {
          background: white;
          width: 90%;
          max-width: 600px;
          border-radius: 24px;
          padding: 32px;
          position: relative;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        }
        .dashboard-close {
          position: absolute;
          top: 16px;
          right: 20px;
          font-size: 32px;
          background: none;
          border: none;
          cursor: pointer;
          color: #64748b;
        }
        .dashboard-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 2px solid #f1f5f9;
        }
        .avatar {
          width: 64px;
          height: 64px;
          background: #3b82f6;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: 800;
        }
        .user-info h3 {
          margin: 0 0 8px 0;
          font-size: 24px;
          color: #1e293b;
        }
        .status-badge {
          padding: 6px 12px;
          border-radius: 99px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1px;
        }
        .status-badge.free {
          background: #e2e8f0;
          color: #64748b;
        }
        .status-badge.pro {
          background: linear-gradient(135deg, #fcd34d, #f59e0b);
          color: #78350f;
        }
        .dashboard-body h4 {
          margin: 0 0 20px 0;
          color: #64748b;
          text-transform: uppercase;
          font-size: 14px;
          letter-spacing: 1px;
        }
        .eligibility-grid {
          display: grid;
          gap: 16px;
        }
        .eligibility-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border: 2px solid #f1f5f9;
          border-radius: 16px;
          transition: all 0.2s;
        }
        .eligibility-item.active {
          border-color: #3b82f6;
          background: #eff6ff;
        }
        .icon {
          font-size: 24px;
        }
        .text strong {
          display: block;
          color: #1e293b;
          margin-bottom: 4px;
        }
        .text p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }
        .check {
          margin-left: auto;
          color: #3b82f6;
          font-weight: 900;
          font-size: 20px;
        }
        .upsell-box {
          margin-top: 32px;
          text-align: center;
          background: #f8fafc;
          padding: 24px;
          border-radius: 16px;
        }
        .upgrade-btn {
          margin-top: 12px;
          background: #3b82f6;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 99px;
          font-weight: 700;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
