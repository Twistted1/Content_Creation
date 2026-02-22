const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const products = [
  {
    id: 'basic',
    name: 'Basic Plan',
    description: 'Perfect for getting started',
    price: 1000, // $10.00
    features: ['5 AI Ideas/month', 'Basic Script Generation', 'SD Video (720p)']
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    description: 'For serious content creators',
    price: 2900, // $29.00
    features: ['Unlimited AI Ideas', 'Advanced Scripts (GPT-4)', 'HD Video (1080p)', 'Priority Support']
  }
];

async function seedProducts() {
  console.log('🌱 Seeding products collection...');
  
  for (const product of products) {
    await db.collection('products').doc(product.id).set(product);
    console.log(`✅ Created product: ${product.id}`);
  }
  
  console.log('✨ Seeding complete!');
  process.exit(0);
}

seedProducts().catch(console.error);
