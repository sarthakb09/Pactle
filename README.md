# PACTLE - E-commerce Storefront

A modern e-commerce platform built with React frontend and Django backend, featuring Stripe payments, Slack notifications, and email confirmations.

## 🚀 Features

### Backend (Django + DRF + PostgreSQL)
- ✅ **JWT Authentication** with token refresh
- ✅ **Product Management** with search, filtering, and pagination
- ✅ **Shopping Cart** with quantity management
- ✅ **Order Processing** with Stripe payment integration
- ✅ **Email Notifications** via SendGrid for order confirmations
- ✅ **Slack Notifications** for new orders
- ✅ **Database Optimization** with proper indexes
- ✅ **Input Validation** and error handling
- ✅ **Admin Interface** for all models

### Frontend (React + TypeScript)
- ✅ **Modern UI Design** with Tailwind CSS
- ✅ **Responsive Layout** for all screen sizes
- ✅ **Product Browsing** with search and filtering
- ✅ **Shopping Cart** with real-time updates
- ✅ **User Authentication** with persistent login
- ✅ **Type Safety** with TypeScript
- ✅ **Error Handling** with toast notifications
- ✅ **Stripe Checkout** integration

## 📁 Project Structure

```
Pactle/
├── backend/                 # Django backend
│   ├── ecommerce/          # Django project settings
│   ├── store/             # Store app (products, cart)
│   ├── orders/            # Orders app (orders, payments)
│   ├── templates/         # Email templates
│   ├── requirements.txt   # Python dependencies
│   └── .env.example       # Environment variables
└── frontend/              # React frontend
    ├── src/
    │   ├── components/    # React components
    │   ├── contexts/      # State management
    │   ├── services/      # API service
    │   └── types/         # TypeScript interfaces
    ├── package.json       # Node dependencies
    └── public/            # Static files
```

## 🛠️ Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL
- Stripe account
- SendGrid account
- Slack app (optional)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

5. **Configure PostgreSQL database:**
   - Create a new database
   - Update database settings in `.env`

6. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

7. **Create superuser:**
   ```bash
   python manage.py createsuperuser
   ```

8. **Populate sample data:**
   ```bash
   python manage.py populate_products
   ```

9. **Start the server:**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create `.env` file in frontend directory:
   ```
   REACT_APP_API_URL=http://localhost:8000/api
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

## 🔧 Environment Variables

### Backend (.env)
```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True

# Database Settings
DB_NAME=pactle_ecommerce
DB_USER=postgres
DB_PASSWORD=your-db-password
DB_HOST=localhost
DB_PORT=5432

# Email Settings (SendGrid)
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=apikey
SENDGRID_API_KEY=your-sendgrid-api-key

# Stripe Settings
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-stripe-webhook-secret

# Slack Settings
SLACK_BOT_TOKEN=xoxb-your-slack-bot-token
SLACK_CHANNEL_ID=your-slack-channel-id
SLACK_CHANNEL_NAME=pactle-shopping
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

## 📡 API Endpoints

### Authentication
- `POST /api/token/` - Login
- `POST /api/token/refresh/` - Refresh token

### Products
- `GET /api/products/` - List products (with pagination, search, filtering)
- `GET /api/products/:id/` - Product details

### Cart
- `GET /api/cart/` - Get user's cart
- `POST /api/cart/` - Add item to cart
- `PUT /api/cart/:id/` - Update cart item quantity
- `DELETE /api/cart/:id/` - Remove item from cart
- `DELETE /api/cart/clear/` - Clear cart
- `GET /api/cart/total/` - Get cart total

### Orders
- `GET /api/orders/` - Get user's orders
- `GET /api/orders/:id/` - Get order details
- `POST /api/orders/` - Create new order
- `POST /api/orders/:id/confirm_payment/` - Confirm payment

## 🔌 Third-Party Integrations

### Stripe Setup
1. Create a Stripe account
2. Get your API keys from the dashboard
3. Add keys to environment variables
4. Test with Stripe's test card numbers

### SendGrid Setup
1. Create a SendGrid account
2. Generate an API key
3. Add API key to environment variables
4. Verify your sender email

### Slack Setup
**Option 1: Webhook (Easier - Recommended)**
1. Go to your Slack workspace
2. Navigate to the 'pactle-shopping' channel
3. Click the channel name → Integrations → Add apps
4. Search for 'Incoming Webhooks' and add it
5. Copy the webhook URL
6. Add to environment variables: `SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL`

**Option 2: Bot Token (More Features)**
1. Create a Slack app
2. Add `chat:write` scope
3. Install app to your workspace
4. Get bot token
5. Configure channel:
   - Option A: Use channel ID (e.g., `C1234567890`) - set `SLACK_CHANNEL_ID`
   - Option B: Use channel name (e.g., `pactle-shopping`) - set `SLACK_CHANNEL_NAME`
6. Add to environment variables

**Quick Setup:** Run the interactive setup script:
```bash
cd backend
python setup_slack.py
```

## 🚀 Deployment

### Backend Deployment
1. Set `DEBUG=False` in production
2. Use a production database (PostgreSQL)
3. Configure static files serving
4. Set up environment variables
5. Use a production WSGI server (Gunicorn)

### Frontend Deployment
1. Build the project: `npm run build`
2. Serve static files from a web server
3. Configure environment variables
4. Set up API URL for production

## 🧪 Testing

### Backend Testing
```bash
python manage.py test
```

### Frontend Testing
```bash
npm test
```

## 📝 API Documentation

### Authentication
All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-access-token>
```

### Product Filtering
- `?search=keyword` - Search products by name/description
- `?ordering=price` - Sort by price (low to high)
- `?ordering=-price` - Sort by price (high to low)
- `?page=2` - Pagination

### Error Responses
All endpoints return appropriate HTTP status codes and error messages in JSON format.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Note:** This is a demonstration project. For production use, ensure proper security measures, error handling, and testing are implemented. # Pactle
