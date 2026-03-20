const functions = require('firebase-functions');
const admin = require('firebase-admin');

// 1. Initialize App (ONLY ONCE)
if (!admin.apps.length) {
    admin.initializeApp();
}

// 2. Export Functions
// Note: We do NOT initialize Stripe here to avoid "missing key" errors during deployment
exports.createPaymentIntent = functions.https.onCall(async (data, context) => {
    // 3. Initialize Stripe INSIDE the function handler
    // This ensures it only runs when the function is actually CALLED, not when it's DEPLOYED
    const stripeSecret = functions.config().stripe?.secret || process.env.STRIPE_SECRET;
    
    if (!stripeSecret) {
        console.error("Missing Stripe Secret Key. Set it via 'firebase functions:config:set stripe.secret=...'");
        throw new functions.https.HttpsError('internal', 'Payment configuration error.');
    }

    const stripe = require('stripe')(stripeSecret);

    // 4. Security Check
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'User must be logged in to initiate payment.'
        );
    }

    // 5. Product Mapping
    // Try to get price from Firestore first, fallback to hardcoded values
    let amount;
    try {
        const productDoc = await admin.firestore().collection('products').doc(data.productId).get();
        if (productDoc.exists) {
            amount = productDoc.data().price;
        }
    } catch (e) {
        console.warn("Failed to fetch price from Firestore, falling back to defaults", e);
    }

    if (!amount) {
        const products = {
            'basic': 1000,
            'pro': 2900
        };
        amount = products[data.productId];
    }

    if (!amount) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'The requested product does not exist.'
        );
    }

    // 6. Create Intent
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            metadata: {
                userId: context.auth.uid,
                email: context.auth.token.email
            },
            automatic_payment_methods: { enabled: true },
        });

        return {
            clientSecret: paymentIntent.client_secret
        };
    } catch (error) {
        console.error("Stripe Backend Error:", error);
        throw new functions.https.HttpsError('internal', 'Payment initialization failed.');
    }
});