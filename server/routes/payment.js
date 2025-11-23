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

// POST /api/webhook
router.post('/webhook', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook Signature Error:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.metadata.userId;

        console.log('Payment successful for user:', userId);

        try {
            const user = await User.findById(userId);
            if (user) {
                user.subscribed = true;
                user.plan = 'pro'; // Or derive from priceId if multiple plans
                await user.save();
                console.log('User subscription updated:', user.email);
            } else {
                console.error('User not found for webhook:', userId);
            }
        } catch (err) {
            console.error('Error updating user subscription:', err);
            return res.status(500).json({ error: 'Failed to update user' });
        }
    }

    res.json({ received: true });
});

module.exports = router;
