# Firestore Data Model (MVP)

This document defines the MVP Firestore structure for Products, Orders, and Users, including document schemas, example documents, recommended indexes, and security considerations. It also notes artifact paths for seed/export data in this repo.

## Collections & Paths

- Products
  - Firestore: `products` (top-level collection)
  - Artifacts (seed/export): `/artifacts/{appId}/public/data/products/*.json`
- Users
  - Firestore: `users/{userId}` (top-level collection + user docs)
  - Artifacts (seed/export): `/artifacts/{appId}/users/{userId}/profile.json`
- Orders
  - Firestore: `users/{userId}/orders` (subcollection per user)
  - Artifacts (seed/export): `/artifacts/{appId}/users/{userId}/orders/*.json`

Notes:
- `{appId}` is your deployment/app identifier (e.g., `drews3dprinting-dev`).
- `{userId}` is the Firebase Auth UID.

## Schemas

### products (public)
- name: string — Product name
- slug: string — URL-safe identifier, unique
- description: string — Full product description
- price: number — USD price (e.g., 14.99)
- category: string — One of: `Toys/Fidgets`, `Office Supplies`, `Hobbies`, `Birthday Ideas`, `Holidays`
- tags: string[] — Keywords for search (e.g., ["fidget", "toy"]) 
- imageUrl: string — HTTPS URL to product image/render
- stock: number — Current quantity available
- isFeatured: boolean — Show on homepage if true
- createdAt: timestamp — Server timestamp when created
- updatedAt: timestamp — Server timestamp when updated

Document ID:
- Recommend using the slug as the document ID for stable URLs: `products/{slug}`.

### users (private)
- userId: string — Auth UID (redundant but convenient for queries)
- email: string — Primary email
- firstName: string
- lastName: string
- shippingDefaults: object — { street, city, state, zip, country? }
- createdAt: timestamp — Account creation date
- updatedAt: timestamp — Last profile update

Document ID:
- `users/{userId}` where `{userId}` is the Firebase Auth UID.

### orders (private per user)
Subcollection under each user: `users/{userId}/orders/{orderId}`

- userId: string — Owner UID
- orderDate: timestamp — Placement date
- status: string — One of: `Pending`, `Printing`, `Shipped`, `Completed`
- totalAmount: number — Final total including tax/shipping
- shippingAddress: object — { street, city, state, zip, country? }
- items: array<object> — Each item:
  - productId: string — Product doc ID (prefer slug)
  - name: string — Snapshot of product name
  - price: number — Snapshot unit price
  - quantity: number — Units ordered
  - imageUrl: string — Snapshot image for history
- paymentId: string — Processor reference (e.g., Stripe PaymentIntent ID)
- createdAt: timestamp — Server timestamp when created
- updatedAt: timestamp — Server timestamp when updated

## Example Documents

### Example product (products/{slug})
```json
{
  "name": "Modular Desk Organizer",
  "slug": "modular-desk-organizer",
  "description": "Stackable desk organizer with customizable trays.",
  "price": 14.99,
  "category": "Office Supplies",
  "tags": ["desk", "organizer", "modular"],
  "imageUrl": "https://example.com/images/organizer.jpg",
  "stock": 32,
  "isFeatured": true,
  "createdAt": {"_serverTimestamp": true},
  "updatedAt": {"_serverTimestamp": true}
}
```

### Example user (users/{userId})
```json
{
  "userId": "Yg3...abc",
  "email": "alex@example.com",
  "firstName": "Alex",
  "lastName": "Rivera",
  "shippingDefaults": {
    "street": "123 Market St",
    "city": "San Diego",
    "state": "CA",
    "zip": "92101",
    "country": "US"
  },
  "createdAt": {"_serverTimestamp": true},
  "updatedAt": {"_serverTimestamp": true}
}
```

### Example order (users/{userId}/orders/{orderId})
```json
{
  "userId": "Yg3...abc",
  "orderDate": "2025-11-19T18:05:00Z",
  "status": "Pending",
  "totalAmount": 42.97,
  "shippingAddress": {
    "street": "123 Market St",
    "city": "San Diego",
    "state": "CA",
    "zip": "92101",
    "country": "US"
  },
  "items": [
    {
      "productId": "modular-desk-organizer",
      "name": "Modular Desk Organizer",
      "price": 14.99,
      "quantity": 2,
      "imageUrl": "https://example.com/images/organizer.jpg"
    },
    {
      "productId": "flexi-fidget-dragon",
      "name": "Flexi Fidget Dragon",
      "price": 12.99,
      "quantity": 1,
      "imageUrl": "https://example.com/images/dragon.jpg"
    }
  ],
  "paymentId": "pi_3NV...XYZ",
  "createdAt": {"_serverTimestamp": true},
  "updatedAt": {"_serverTimestamp": true}
}
```

## Indexes (Recommended)

Create the following Firestore indexes to support common queries:

- products
  - Composite: `category ASC`, `price ASC` — For category listings with sort by price
  - Composite: `isFeatured DESC`, `createdAt DESC` — For homepage featured/new arrivals
  - Single-field: `slug` marked as Indexed (default) — For direct lookups
- users/{userId}/orders
  - Composite: `status ASC`, `orderDate DESC` — For status filtering and recent-first
  - Single-field: `orderDate DESC` — For order history timeline

Note: Firestore single-field indexing is automatic; disable on large text fields (e.g., `description`) if index limits are a concern.

## Security Rules (Outline)

- products (public read)
  - Read: allow for all users (including unauthenticated)
  - Write: restricted to admins only
- users (private)
  - `users/{userId}` read/write allowed only if `request.auth.uid == userId`
- orders (private per user)
  - `users/{userId}/orders/{orderId}` read/write allowed only if `request.auth.uid == userId`
  - Optionally allow server-side functions or admin roles to update `status`

Example rules sketch:
```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{slug} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      match /orders/{orderId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

## Conventions

- Use slugs as stable IDs for products to simplify routing (e.g., `/products/{slug}`).
- Store denormalized snapshots (name, price, imageUrl) in order items for historical accuracy.
- Prefer server timestamps for `createdAt`/`updatedAt` and set from the client via `serverTimestamp()`.
- Validate numeric fields (`price >= 0`, `stock >= 0`, `quantity >= 1`) in client code and via backend where applicable.

## Seed/Artifacts

- Place seed JSON under the artifacts paths above to hydrate Firestore in dev or CI scripts.
- Keep images in a CDN or Firebase Storage; reference with `imageUrl`.
- Do not commit PII in sample user documents.
