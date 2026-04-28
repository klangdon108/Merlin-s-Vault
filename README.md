# Merlin's Vault Prototype

Front-end e-commerce prototype built with HTML5, CSS, and vanilla JavaScript.

## Included pages
- Home
- Shop
- Category
- Product Detail
- Cart
- Checkout
- Order Confirmation
- Order Status
- Events
- Event Detail / Registration
- About
- Contact
- FAQ

## Features
- Responsive multi-page storefront
- 90 sample products across 6 categories
- Cart stored in localStorage
- Simulated checkout with validation and generated order numbers
- Order status lookup by order number
- Event registration stored in localStorage
- Shared header / footer navigation across pages
- Real-photo product, event, and category image references in `js/data.js`

## How to run
Open `index.html` in a browser, or serve the folder locally with any static server.

## Asset replacement
Visual references are centralized in `js/data.js`. The included `assets/placeholders/` folder remains available for future local branded assets if the remote prototype images are replaced.
You can replace the SVG files with your own images while keeping the same filenames,
or update the image paths inside `js/data.js`.
