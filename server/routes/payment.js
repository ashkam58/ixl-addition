const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
});
const User = require('../models/User');

// POST /api/create-checkout-session
router.post('/create-checkout-session', async (req, res) => {
    const { priceId, userId } = req.body;

    try {
        const user = await User.findById(userId);
        const customerEmail = user ? user.email : undefined;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${req.headers.origin}?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}?canceled=true`,
            customer_email: customerEmail,
            metadata: {
                userId: userId,
            },
        });

        console.log('Stripe Session Created');
        console.log('Session ID:', session.id);
        console.log('Session URL:', session.url);
        console.log('Session keys:', Object.keys(session));

        res.json({ sessionId: session.id, url: session.url });
    } catch (err) {
        console.error('--------------------------------------------------');
        console.error('PAYMENT ERROR:', err.message);
        console.error('Full Error:', err);
        console.error('--------------------------------------------------');
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
