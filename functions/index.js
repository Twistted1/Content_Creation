const functions = require('firebase-functions');
const admin = require('firebase-admin');

console.log("Loading function...");

if (!admin.apps.length) {
    admin.initializeApp();
}

console.log("Initialized app...");

// NOTE: We removed the "const stripe = ..." line from here.
// This prevents the deploy tool from crashing on your computer.

exports.createPaymentIntent = functions.https.onCall(async (data, context) => {
    // 1. Initialize Stripe INSIDE the function.
    // Support both functions.config() (Gen 1 legacy) and process.env (Gen 2 / dotenv)
    const stripeSecret = functions.config().stripe?.secret || process.env.STRIPE_SECRET;
    
    if (!stripeSecret) {
        console.error("Missing Stripe Secret Key. Set it via 'firebase functions:config:set stripe.secret=...'");
        throw new functions.https.HttpsError('internal', 'Payment configuration error.');
    }

    const stripe = require('stripe')(stripeSecret);

    // 2. Security Check
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'User must be logged in to initiate payment.'
        );
    }

    // 3. Product Mapping
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

    // 4. Create Intent
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