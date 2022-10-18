# Data Server

---

## Store Database

### Tables:

- user
- order
- order_item
- type
- product
- item
- payment_info

## Server Requests

### GET Requests

#### User

- GET User Info
- GET Cart For User
- GET Purchase History For User
- GET Payment Methods For User

#### Product

- GET Products For Type
- GET Items For Product
- GET Product Info
- GET Photos For Item
  <!-- /api/products/prodname
  <- [/images/photo1, /images/photo2] -->

### POST Requests

#### Login/Register

- CHECK Login Info
  1. URL: `/usermanage/login`
  2. Body: `{ username, (encrypted) password }`
  3. Query: `SELECT `
  4. Response: `user_id` | `false` (user doesn't exist) | error
- CHECK User Existence
  1. URL: `/usermanage/register/check`
  2. Body: `{ username, email }`
  3. ???
  4. Response: `true` (user exists) | `false` (user doesn't exist) | error
- REGISTER New User
  1. URL: `/usermanage/register`
  2. Body: `{ username, (encrypted) password, email, phoneNumber, address, permission }`
  3. ???
  4. Response: `LAST_INSERT_ID()` | error
  - ! Client adds body to cache independently

#### User

- ADD Payment Info

#### Product

- POST New Product
  1. URL: `/api/products`
  2. Body: `{ productName, description, typeId, cost, brand }`
  3. ???
  4. Response: `{ LAST_INSERT_ID(), ...Body, photosPath }` | error
- POST New Item
  1. `/api/products/:productId`
  2. Body: `{ color, amount }`
  3. ???
  4. Response: `{ LAST_INSERT_ID(), ...Body, :productId }` | error

#### Orders

- POST New Order
  1. `/api/orders/neworder/:userId`
  2. ???
  3. Response: `LAST_INSERT_ID()` | error
- ADD Item To Order
  1. URL: `/api/orders/:orderId/items`
  2. Body: `{ itemId, amount }`
  3. ???
  4. Response: `LAST_INSERT_ID()` | error
  - ! Client adds body to cache independently
- ADD Photo To Product

### PUT Requests

#### User

- CHANGE Active Payment
  1. URL: `/api/users/:userId/activepay`
  2. Body: `paymentInfoId`
  3. ???
  4. Response: ``

#### Product

- EDIT Cart
- EDIT Item
- EDIT Product

#### Orders

- PUT Fulfill Order
  1. URL: `/api/orders/:orderId`
  2. Body: `{ totalCost, paymentInfoId }`
  3. ???
  4. Response: `PurchaseHistory Data {}`
