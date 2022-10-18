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

- GET User Info [[works]]
  1. URL: `/api/users/:userId/info`
  2. ???
  3. Response: `{ user_id, user_name, email, address, phone_number, permission, orderId (as cartId) }` | error
- GET Cart For User [[works]]
  1. URL: `/api/users/:userId/cart/:cartId`
  2. ???
  3. Response: `[{ product_name, ...item.* }]` | error
- GET Purchase History For User [[works]]
  1. URL: `/api/users/:userId/purchase+history`
  2. ???
  3. Response: `` | error
- GET Payment Methods For User [[works]]
  1. URL: `/api/users/:userId/payment+methods`
  2. ???
  3. Response: `` | error

#### Product

- GET Products For Type [[works]]
  1. URL: `/api/types/:typeId/products`
  2. ???
  3. Response: `[Product {}, ...]` | error
- GET Items For Product [[works]]
  1. URL: `/api/products/:productId/items`
  2. ???
  3. Response: `[Item {}, ...]` | error
- GET Photos For Item [[works]]
  1. URL: `/api/items/itemId/photos`
  2. ???
  3. Response: `[photoPathname, ...]` | error
  <!-- /api/products/prodname
  <- [/images/photo1, /images/photo2] -->

### POST Requests

#### Login/Register [[works]]

- CHECK Login Info
  1. URL: `/usermanage/login`
  2. Body: `{ username, (encrypted) password }`
  3. Query: `SELECT user_id FROM user ` +
     `WHERE username = "${body.username}" AND password = "${body.password}";`
  4. Response: `user_id` | `false` (user doesn't exist) | error
- CHECK User Existence
  1. URL: `/usermanage/register/check`
  2. Body: `{ username, email }`
  3. Query: `SELECT * FROM user WHERE username = "${body.username}" OR email = "${body.email}";`
  4. Response: `true` (can be created) | `false` (can not be created) | error
- REGISTER New User
  1. URL: `/usermanage/register`
  2. Body: `{ username, (encrypted) password, email, phoneNumber, address, permission }`
  3. Query: `INSERT INTO user (username, password, email, phone_number, address, permission) ` +
     `VALUES("${body.username}", "${body.password}", "${body.email}", "${body.phoneNumber}", "${body.address}", "${body.permission}");`
  4. Response: `LAST_INSERT_ID()` | error
  - ! Client adds body to cache independently

#### User

- ADD Payment Info [[works]]
  1. URL: `/api/users/:userId/pay`
  2. Body: `{ creditNum, cvv, expDate }`
  3. Query: `UPDATE payment_info SET active = false;`
  4. Query: `INSERT INTO payment_info (credit_number, cvv, expiration_date, user_id, active) ` +
     `VALUES(${body.creditNum}, ${body.cvv}, "${body.expDate}", ${req.params.userId}, "active");`
  5. ! active = true
  6. ! server should change active payment to be inactive first
  7. Response: `LAST_INSERT_ID()` | error
  - ! Client adds body to cache independently
  - ! queries executed in the order above

#### Product [[works]]

- POST New Product [[works]]
  1. URL: `/api/products`
  2. Body: `{ productName, description, typeId, cost, brand }`
  3. Query: `INSERT INTO product (product_name, description, type_id, cost, brand) ` +
     `VALUES("${body.productName}", "${body.description}", ${body.typeId}, ${body.cost}, "${body.brand}")`
  4. Response: `{ LAST_INSERT_ID(), ...Body, photosPath }` | error
- POST New Item [[works]]
  1. `/api/products/:productId`
  2. Body: `{ color, amount }`
  3. Query: `INSERT INTO item (item_color, item_amount, product_id) ` +
     `VALUES("${body.color}", ${body.amount}, ${req.param.productId})`
  4. Response: `{ LAST_INSERT_ID(), ...Body, :productId }` | error

#### Orders

- POST New Order
  1. `/api/orders/neworder/:userId`
  2. Query: `INSERT INTO order (user_id,status) VALUES(${req.param.userId}, "cart")`
  3. Response: `LAST_INSERT_ID()` | error
- ADD Item To Order
  1. URL: `/api/orders/:orderId/items`
  2. Body: `{ itemId, amount }`
  3. Query: `INSERT INTO order_item (order_id, item_id, amount) ` +
     `VALUES(${req.param.orderId}, ${body.itemId}, ${body.amount});`
  4. Response: `LAST_INSERT_ID()` | error
  - ! Client adds body to cache independently
- ADD Photo To Product

### PUT Requests

#### User

- CHANGE Active Payment
  1. URL: `/api/users/:userId/activepay`
  2. Body: `paymentInfoId`
  3. Query: `UPDATE payment_info SET active = false;`
  4. Query: `UPDATE payment_info SET active = true ` +
     `WHERE payment_info_id = ${req.body}`
  5. Response: `true` (payment was changed) | error
  - ! Client changes active payment in cache independently

#### Product

- EDIT Item
- EDIT Product

#### Orders

- PUT Fulfill Order
  1. URL: `/api/orders/:orderId`
  2. Body: `{ totalCost, paymentInfoId}`
  3. Query: `UPDATE order SET status = "fulfilled" ` +
     `WHERE order_id = ${req.params.orderId}`
     Query: `INSERT INTO purchase_history (order_id, purchase_date, total_cost, payment_info_id) ` +
     `VALUES(${req.params.orderId}, CURDATE(), ${req.body.totalCost}, ${req.body.paymentInfoId};`
     Query: `UPDATE item SET item_amount = item_amount - (SELECT amount FROM order_item WHERE order_id = ${req.params.orderId} AND item_id = item.item_id)`
  4. ! server should create purchase history
  5. ! server should change stock of items
  6. Response: `PurchaseHistory Data {}` | `false` (someone stole it from you) | error
