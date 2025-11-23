import React, { useState } from "react";
import Confetti from "./Confetti.jsx";


export default function AdModal({ onClose }) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);

    try {
      // Call backend to create checkout session
      const response = await fetch("http://localhost:4000/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: "price_1SWZvLSJaRWRBFCPuIL3UpUZ", // Real Price ID
          userId: localStorage.getItem("additionLabUserId"),
        }),
      });

      const session = await response.json();

      if (session.error) {
        alert(session.error);
        setLoading(false);
        return;
      }

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.sessionId,
      });

      if (result.error) {
        alert(result.error.message);
        setLoading(false);
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed to start.");
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    window.open("https://wa.me/918002416363", "_blank");
  };

  return (
    <div className="ad-modal-overlay">
      <Confetti />
      <div className="ad-modal-content">
        <button className="ad-close-btn" onClick={onClose}>
          ×
        </button>

        <div className="ad-header">
          <span className="ad-emoji">🚀</span>
          <h2>Ashkam Intelligent Studios</h2>
        </div>

        <div className="ad-body">
          <p className="ad-highlight">
            Master <strong>Coding</strong>, <strong>Rubik's Cube</strong>, <strong>Math</strong>, and more!
          </p>
          <p className="ad-subtext">
            Join our 1:1 Live Classes for Speed Cubing, Python, Web Dev, and Scratch.
          </p>

          <div className="ad-features">
            <span>⚡ Speed Cubing</span>
            <span>🐍 Python</span>
            <span>🌐 Web Dev</span>
            <span>🐱 Scratch</span>
          </div>
        </div>

        <div className="ad-actions">
          <button
            className="ad-btn subscribe-btn"
            onClick={handleSubscribe}
            disabled={loading}
          >
            {loading ? "Processing..." : "Subscribe Now"}
          </button>

          <button className="ad-btn whatsapp-btn" onClick={handleWhatsApp}>
            Chat on WhatsApp 💬
          </button>
        </div>
      </div>
      <style>{`
        .ad-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3000;
          animation: fadeIn 0.3s ease-out;
        }

        .ad-modal-content {
          background: linear-gradient(135deg, #ffffff, #f0f9ff);
          padding: 40px;
          border-radius: 32px;
          max-width: 500px;
          width: 90%;
          text-align: center;
          position: relative;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          border: 4px solid #fff;
          animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .ad-close-btn {
          position: absolute;
          top: 16px;
          right: 20px;
          background: none;
          border: none;
          font-size: 32px;
          color: #94a3b8;
          cursor: pointer;
          line-height: 1;
          transition: color 0.2s;
        }

        .ad-close-btn:hover {
          color: #ef4444;
        }

        .ad-header {
          margin-bottom: 20px;
        }

        .ad-emoji {
          font-size: 64px;
          display: block;
          margin-bottom: 10px;
          animation: bounce 2s infinite;
        }

        .ad-header h2 {
          font-size: 28px;
          font-weight: 900;
          background: linear-gradient(to right, #2563eb, #db2777);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
        }

        .ad-body {
          margin-bottom: 30px;
        }

        .ad-highlight {
          font-size: 18px;
          color: #334155;
          margin-bottom: 12px;
        }

        .ad-subtext {
          font-size: 16px;
          color: #64748b;
          margin-bottom: 20px;
        }

        .ad-features {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
        }

        .ad-features span {
          background: #e0f2fe;
          color: #0369a1;
          padding: 6px 12px;
          border-radius: 99px;
          font-weight: 700;
          font-size: 14px;
        }

        .ad-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .ad-btn {
          width: 100%;
          padding: 16px;
          border-radius: 16px;
          font-size: 18px;
          font-weight: 800;
          border: none;
          cursor: pointer;
          transition: transform 0.1s, box-shadow 0.1s;
        }

        .ad-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.1);
        }

        .ad-btn:active {
          transform: translateY(0);
        }

        .subscribe-btn {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          box-shadow: 0 4px 0 #4f46e5;
        }

        .whatsapp-btn {
          background: #25D366;
          color: white;
          box-shadow: 0 4px 0 #128C7E;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
