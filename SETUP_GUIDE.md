# Firebase & Stripe Setup Guide

This guide walks you through setting up Firebase (Firestore + Auth) and Stripe for your 3D printing shop.

## Part 1: Firebase Setup

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `drews-3dprinting` (or your choice)
4. Disable Google Analytics (optional for MVP)
5. Click "Create project"

### Step 2: Register Your Web App

1. In Firebase Console, click the **Web icon** (`</>`) to add a web app
2. Register app nickname: `Drew's 3D Printing Web`
3. Skip Firebase Hosting setup for now
4. Copy the Firebase configuration object - you'll need these values:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

### Step 3: Enable Firestore Database

1. In Firebase Console sidebar, click **Firestore Database**
2. Click "Create database"
3. Start in **test mode** (we'll add security rules later)
4. Choose a location close to your users (e.g., `us-central1`)
5. Click "Enable"

### Step 4: Add Security Rules

1. Go to Firestore → **Rules** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products are publicly readable
    match /products/{slug} {
      allow read: if true;
      allow write: if request.auth != null && 
                     request.auth.token.admin == true;
    }
    
    // User profiles and orders are private
    match /users/{userId} {
      allow read, write: if request.auth != null && 
                           request.auth.uid == userId;
      
      match /orders/{orderId} {
        allow read, write: if request.auth != null && 
                             request.auth.uid == userId;
      }
    }
  }
}
```

3. Click **Publish**

### Step 5: Create Firestore Indexes

For better query performance:

1. Go to Firestore → **Indexes** tab
2. Click "Add Index" and create:

**Index 1 - Products by category and price:**
- Collection: `products`
- Fields: `category` (Ascending), `price` (Ascending)
- Query scope: Collection

**Index 2 - Featured products:**
- Collection: `products`
- Fields: `isFeatured` (Descending), `updatedAt` (Descending)
- Query scope: Collection

**Index 3 - User orders:**
- Collection group: Yes
- Collection ID: `orders`
- Fields: `status` (Ascending), `orderDate` (Descending)
- Query scope: Collection group

### Step 6: Enable Authentication

1. In Firebase Console sidebar, click **Authentication**
2. Click "Get started"
3. Go to **Sign-in method** tab
4. Click **Email/Password**
5. Enable the first toggle (Email/Password)
6. Click "Save"

### Step 7: Add Sample Products to Firestore

1. In Firestore Console, click **+ Start collection**
2. Collection ID: `products`
3. Add your first product document:
   - Document ID: `modular-desk-organizer` (use slug as ID)
   - Fields:
     ```
     name: "Modular Desk Organizer" (string)
     slug: "modular-desk-organizer" (string)
     description: "Stackable organizer with customizable trays." (string)
     price: 14.99 (number)
     category: "Office Supplies" (string)
     tags: ["desk", "organizer", "modular"] (array)
     imageUrl: "/images/placeholder.svg" (string)
     stock: 32 (number)
     isFeatured: true (boolean)
     createdAt: (click "timestamp" and use server timestamp)
     updatedAt: (click "timestamp" and use server timestamp)
     ```

4. Repeat for other products from `src/data/sampleProducts.json`

---

## Part 2: Stripe Setup

### Step 1: Create a Stripe Account

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/register)
2. Sign up for a free account
3. Complete business details (can use "Individual" for testing)

### Step 2: Get API Keys

1. In Stripe Dashboard, click **Developers** (top right)
2. Go to **API keys** tab
3. You'll see two keys in **Test mode**:
   - **Publishable key**: Starts with `pk_test_...`
   - **Secret key**: Click "Reveal test key" - starts with `sk_test_...`

⚠️ **Important**: Keep your secret key private! Never commit it to git.

### Step 3: Test Cards

Use these test cards for development:

| Card Number         | Brand      | Result  |
|---------------------|------------|---------|
| 4242 4242 4242 4242 | Visa       | Success |
| 4000 0000 0000 0002 | Visa       | Declined|
| 4000 0025 0000 3155 | Visa       | 3D Secure|

- Use any future expiration date
- Use any 3-digit CVC
- Use any ZIP code

---

## Part 3: Configure Your App

### Local Development

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Firebase config:
   ```env
   VITE_FIREBASE_API_KEY=AIza...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123

   VITE_STRIPE_PUBLIC_KEY=pk_test_...
   ```

3. For local function testing (optional):
   ```bash
   export STRIPE_SECRET_KEY=sk_test_...
   vercel dev
   # or
   netlify dev
   ```

### Deployment (Vercel)

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/new)
3. Import your repository
4. In **Environment Variables**, add:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   VITE_FIREBASE_API_KEY=AIza...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   VITE_STRIPE_PUBLIC_KEY=pk_test_...
   ```
5. Deploy!

### Deployment (Netlify)

1. Push your code to GitHub
2. Go to [Netlify Dashboard](https://app.netlify.com/start)
3. Import your repository
4. In **Site settings** → **Environment variables**, add the same variables as Vercel above
5. Deploy!

---

## Part 4: Testing the Integration

### Test Firebase Auth

1. Start your dev server: `npm run dev`
2. Navigate to `/auth`
3. Create a new account with email/password
4. Check Firebase Console → Authentication to see your new user

### Test Firestore Products

1. After adding products to Firestore (Step 7 above)
2. Refresh your homepage - products should load from Firestore
3. Navigate through categories - filtering should work

### Test Stripe Checkout

1. Sign in to your account
2. Add items to cart
3. Go to Checkout (`/checkout`)
4. Fill in shipping information
5. Click "Continue to Payment"
6. Use test card: `4242 4242 4242 4242`
7. Complete payment
8. Check Firestore → `users/{userId}/orders` for your order
9. Check Stripe Dashboard → Payments for the PaymentIntent

### Test Shipping Defaults

1. After completing an order with "Save as my default address" checked
2. Start a new checkout - address should be pre-filled
3. Toggle "Use saved address" on/off to test

---

## Troubleshooting

### "Firebase not configured" Error

- Ensure all `VITE_FIREBASE_*` environment variables are set
- Restart dev server after adding `.env` file
- Check for typos in variable names

### "Stripe not configured" Error

- Ensure `VITE_STRIPE_PUBLIC_KEY` is set in `.env`
- For backend: ensure `STRIPE_SECRET_KEY` is set (for Vercel/Netlify functions)
- Restart dev server

### Firestore Permission Denied

- Check Security Rules are published
- Ensure user is authenticated for private collections
- Verify `userId` matches `request.auth.uid`

### Stripe PaymentIntent Fails

- Check `STRIPE_SECRET_KEY` is set in function environment
- Verify you're using test keys in test mode
- Check Stripe Dashboard → Logs for error details

### Products Not Loading

- Verify products exist in Firestore `products` collection
- Check document IDs match the slug format
- Open browser console for error messages
- Ensure Firestore indexes are created

---

## Next Steps

### Production Checklist

- [ ] Switch Firestore to production mode with stricter security rules
- [ ] Update Firebase Auth to production domain
- [ ] Switch Stripe from test to live keys
- [ ] Set up Stripe webhooks for payment confirmation
- [ ] Add proper error logging (e.g., Sentry)
- [ ] Set up Firebase Storage for product images
- [ ] Configure custom domain for deployed site
- [ ] Add admin panel for managing products/orders
- [ ] Set up email notifications for orders

### Recommended Enhancements

- Add Stripe Elements styling to match your brand
- Implement order status updates (Printing, Shipped, Completed)
- Add email verification for new accounts
- Create admin role in Firebase for product management
- Add image upload for custom orders
- Implement search functionality across products
- Add reviews/ratings for products
