# Remix SaaS Template with Supabase and Stripe

This template provides a starting point for building a SaaS (Software as a Service) application using Remix and TypeScript, featuring:

- **User Authentication**: Signup, login, and logout functionality using Supabase.
- **Subscription Management**: Integrate Stripe for handling subscriptions.
- **Role-Based Authorization**: Protect routes based on user subscription status.
- **Caching of Product Prices**: Improve performance by caching pricing data.
- **Tailwind CSS Styling**: Pre-configured UI components for a modern look.
- **Top Navigation Bar**: A responsive navbar that adapts to authentication and subscription state.
- **Dockerized Deployment**: Simplified deployment using Docker and Docker Compose.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Supabase Setup](#3-supabase-setup)
  - [4. Stripe Setup](#4-stripe-setup)
  - [5. Configure Environment Variables](#5-configure-environment-variables)
  - [6. Run the Application](#6-run-the-application)
- [Docker Deployment](#docker-deployment)
  - [1. Build the Docker Image](#1-build-the-docker-image)
  - [2. Run the Docker Container](#2-run-the-docker-container)
  - [3. Using Docker Compose](#3-using-docker-compose)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Usage](#usage)
  - [Authentication Pages](#authentication-pages)
  - [Subscription Flow](#subscription-flow)
  - [Protected Routes](#protected-routes)
- [Styling](#styling)
- [Security Considerations](#security-considerations)
- [Contributing](#contributing)
- [License](#license)

---

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Install Node.js (version 14 or higher)
- **npm**: Comes with Node.js
- **Supabase Account**: Sign up at [Supabase](https://supabase.com/)
- **Stripe Account**: Sign up at [Stripe](https://stripe.com/)
- **Docker**: Install Docker and Docker Compose if you plan to deploy using containers

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/sammyl720/remix-saas.git
cd remix-saas
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Supabase Setup

#### Create a Supabase Project

- Log in to your Supabase account.
- Create a new project.

#### Obtain Supabase Keys

- Go to your project's settings.
- Navigate to **API** under the **Settings** tab.
- Copy the following keys:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

#### Set Up Database Schema

In the Supabase SQL editor, run the following SQL commands to create the `profiles` table and add subscription fields:

```sql
create table profiles (
  id uuid references auth.users not null primary key,
  email text not null,
  role text default 'user',
  stripe_customer_id text,
  subscription_id text,
  subscription_status text,
  current_period_end timestamp with time zone
);
```

### 4. Stripe Setup

#### Create a Stripe Account

- Sign up at [Stripe](https://dashboard.stripe.com/register) if you haven't already.
- Access your [Stripe Dashboard](https://dashboard.stripe.com/).

#### Create Products and Pricing Plans

- Navigate to **Products**.
- Create two products: **Basic** and **Pro**.
- For each product, create a recurring pricing plan:
  - **Basic Plan**: e.g., $10/month.
  - **Pro Plan**: e.g., $20/month.
- Note the **Price IDs** for each plan (e.g., `price_1KXYZ...`).

#### Configure Webhooks

- Go to **Developers > Webhooks**.
- Add a new webhook endpoint:
  - **URL**: `https://<hostname>/webhooks/stripe` (use your production URL when deploying).
  - **Development**: Follow [Stripe Documentation](https://docs.stripe.com/webhooks#local-listener) for how to forward events to your local endpoint at `http://localhost:5173/webhooks/stripe`
  - **Events to Listen For**:
    - `checkout.session.completed`
    - `invoice.paid`
    - `invoice.payment_failed`
    - `customer.subscription.updated`
    - `customer.subscription.deleted`
- After creating the webhook endpoint, Stripe will provide a **Signing Secret** (e.g., `whsec_...`). Keep this secret; you'll need it later.

### 5. Configure Environment Variables

Create a `.env` file in the root directory and add the following:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SESSION_SECRET=your_session_secret
PORT=5173

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
APP_URL=http://localhost:5173
```

- **Replace** placeholders with actual values from your Supabase and Stripe accounts.
- **Generate** a strong, random string for `SESSION_SECRET`.

### 6. Run the Application

Start the development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

---

## Docker Deployment

To simplify deployment, you can run the application inside a Docker container.

### 1. Build the Docker Image

Build the Docker image using the provided `Dockerfile`:

```bash
docker build -t my-remix-app .
```

- **`docker build`**: Command to build a Docker image.
- **`-t my-remix-app`**: Tags the image with the name `my-remix-app`.
- **`.`**: Specifies the current directory as the build context.

### 2. Run the Docker Container

Run the Docker container while passing in the environment variables:

```bash
docker run -p 3000:3000 --env-file .env my-remix-app
```

- **`-p 3000:3000`**: Maps port `3000` inside the container to port `3000` on your host machine.
- **`--env-file .env`**: Passes the `.env` file to the container to set environment variables.
- **`my-remix-app`**: The name of the image to run.

If you wish to run the application on a different port, modify the `PORT` environment variable:

```bash
docker run -p 8080:8080 -e PORT=8080 --env-file .env my-remix-app
```

### 3. Using Docker Compose

Alternatively, you can use Docker Compose to manage the container.

#### Create a `docker-compose.yml` File

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '${PORT}:${PORT}'
    env_file:
      - .env
    environment:
      - PORT=${PORT}
```

#### Run the Application with Docker Compose

Start the application using Docker Compose:

```bash
docker-compose up --build
```

- **`docker-compose up`**: Builds, (re)creates, starts, and attaches to containers for a service.
- **`--build`**: Forces rebuild of the Docker image.

#### Access the Application

- Open your browser and navigate to `http://localhost:3000` (or the port specified in your `.env` file).

---

## Project Structure

```bash
├── app
│   ├── root.tsx              # Root route
│   ├── components
│   │   └── Navbar.tsx        # Top navigation bar component
│   ├── routes
│   │   ├── _index.tsx        # Home page (protected)
│   │   ├── admin.tsx         # Admin page (protected)
│   │   ├── login.tsx         # Login page
│   │   ├── logout.ts         # Logout action
│   │   ├── signup.tsx        # Signup page
│   │   ├── pricing.tsx         # Pricing page with subscription plans
│   │   ├── checkout.ts         # Stripe checkout session creation
│   │   ├── success.tsx         # Subscription success page
│   │   ├── pro-page.tsx        # Protected page for Pro users
│   │   └── webhooks
│   │       └── stripe.ts       # Stripe webhook handler
│   ├── styles
│   │   └── tailwind.css      # Tailwind CSS styles
│   └── utils
│       ├── cache.server.ts     # Cache utility for pricing data
│       ├── session.server.ts # Session management
│       ├── supabaseClient.ts # Client-side Supabase client
│       └── supabaseServer.ts # Server-side Supabase client
├── public
│   └── build                 # Built assets
├── .env                      # Environment variables
├── .eslintrc.cjs               # ESLint configuration
├── .prettierrc                 # Prettier configuration
├── Dockerfile                # Docker configuration
├── docker-compose.yml        # Docker Compose configuration
├── .dockerignore             # Files to ignore in Docker context
├── package.json
├── vite.config.js            # Vite configuration
├── tailwind.config.ts        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

---

## Available Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the app for production.
- `npm start`: Run the built app in production mode.
- `npm run format`: Format code using Prettier.
- `npm run lint`: Check for linting errors.
- `docker build -t my-remix-app .`: Build the Docker image.
- `docker run -p 3000:3000 --env-file .env my-remix-app`: Run the Docker container.
- `docker-compose up --build`: Build and run the application using Docker Compose

---

## Usage

### Authentication Pages

- **Signup**: Visit `/signup` to create a new account.
- **Login**: Visit `/login` to sign in.
- **Logout**: Click the **Logout** button in the navigation bar to sign out.

### Subscription Flow

1. **Pricing Page**: Visit `/pricing` to view subscription plans.
2. **Select Plan**: Choose between **Basic** and **Pro** plans.
3. **Checkout**: Complete the payment process via Stripe's secure checkout.
4. **Success Page**: After successful payment, you'll be redirected to `/success`.
5. **Access Protected Content**: Based on your subscription, access content available to your plan.

### Protected Routes

- **Home Page** (`/`): Accessible only to authenticated users.
- **Pro Page** (`/pro-page`): Accessible only to users with an active **Pro** subscription.
- **Unauthorized Access**: Attempting to access restricted pages without proper authorization redirects to `/unauthorized`.

---

## Styling

- **Tailwind CSS**: Used for styling components.
- **Forms**: Enhanced with focus states, hover effects, and responsive design.
- **Navigation Bar**: Adapts based on authentication and subscription state (shows Login/Signup, Upgrade, or Logout).

---

## Security Considerations

- **Environment Variables**: Do not commit the `.env` file to version control.
- **Supabase Keys**: Keep your `SUPABASE_SERVICE_ROLE_KEY` and other keys secure.
- **Stripe Secret Key**: Ensure your `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` are kept secure and not exposed to the client.
- **Session Secret**: Use a strong, unique secret for `SESSION_SECRET`.
- **HTTPS**: Ensure the app is served over HTTPS in production.
- **Webhook Verification**: Always verify webhook signatures from Stripe.
- **Access Control**: Thoroughly test your access control logic to prevent unauthorized access to protected resources.
- **CSRF Protection**: Remix forms include CSRF protection by default.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository.
2. **Create** a new branch: `git checkout -b feature/YourFeature`.
3. **Commit** your changes: `git commit -m 'Add some feature'`.
4. **Push** to the branch: `git push origin feature/YourFeature`.
5. **Open** a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Additional Notes

- **Extensibility**: Feel free to extend this template with additional features like password reset, email verification, or more complex role management.
- **Customization**: Modify the styling and components to match your project's branding and design needs.
- **Feedback**: If you encounter any issues or have suggestions, please open an issue in the repository.

---

Happy coding! 🚀
