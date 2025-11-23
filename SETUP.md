# Store Admin Frontend

A modern e-commerce store admin panel built with React, Tailwind CSS v4, and React Router.

## ✨ Features

- **Multi-step Onboarding Flow** - Collect business, store, and bank details
- **Dashboard** - Overview of revenue, orders, and products
- **Products Management** - List, create, and manage products
- **Orders Management** - Track and manage customer orders
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Modern UI** - Built with Tailwind CSS v4

## 🏗️ Project Structure

```
src/
├── components/
│   ├── layout/
│   │   └── AppLayout.jsx          # Main app shell with sidebar & topbar
│   └── ui/
│       ├── Button.jsx              # Reusable button component
│       ├── Card.jsx                # Card wrapper component
│       ├── Badge.jsx               # Status badge component
│       └── Input.jsx               # Form input component
├── pages/
│   ├── Dashboard.jsx               # Main dashboard with stats
│   ├── Onboarding/
│   │   ├── OnboardingLayout.jsx    # Onboarding flow wrapper
│   │   ├── StepBusinessInfo.jsx    # Step 1: Business details
│   │   ├── StepStoreDetails.jsx    # Step 2: Store details
│   │   ├── StepBankDetails.jsx     # Step 3: Bank details
│   │   └── StepFinish.jsx          # Step 4: Review & submit
│   ├── Products/
│   │   └── ProductsList.jsx        # Products list & table
│   └── Orders/
│       └── OrdersList.jsx          # Orders list & table
├── lib/
│   └── api.js                      # API client for backend calls
├── hooks/                          # Custom React hooks (future)
├── App.jsx                         # Main app with routing
└── main.jsx                        # App entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js 22.12+ or 20.19+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The app will run at `http://localhost:5173`

## 🎨 Tailwind CSS v4

This project uses Tailwind CSS v4, which has a simplified setup:

- No `tailwind.config.js` needed
- Just import Tailwind in `src/index.css`: `@import "tailwindcss"`
- Configure with `@theme` directive if needed

## 🔄 Routing

The app uses React Router with the following structure:

- `/onboarding/*` - Multi-step onboarding flow
- `/` - Main dashboard (protected)
- `/products` - Products management (protected)
- `/orders` - Orders management (protected)

Protected routes redirect to `/onboarding` if `isOnboarded` is `false`.

## 🔌 API Integration

The app includes a basic API client (`src/lib/api.js`) ready for backend integration:

```js
import api from "../lib/api";

// GET request
const products = await api.get("/products");

// POST request
const newProduct = await api.post("/products", {
  name: "Product Name",
  price: 29.99,
});

// PUT request
await api.put("/products/123", { name: "Updated Name" });

// DELETE request
await api.delete("/products/123");
```

Configure the API base URL with the `VITE_API_URL` environment variable:

```bash
# .env
VITE_API_URL=https://your-backend-url/api
```

## 📝 Current Status

**✅ Completed:**
- Project setup with Vite + React
- Tailwind CSS v4 configuration
- React Router setup
- Full folder structure
- App layout with sidebar and topbar
- Reusable UI components (Button, Card, Badge, Input)
- Multi-step onboarding flow (4 steps)
- Dashboard page with stats
- Products list page
- Orders list page
- API client helper

**🔜 Next Steps:**
1. Connect to backend API endpoints
2. Add authentication/authorization
3. Create product form for add/edit
4. Add order details page
5. Implement search and filters
6. Add loading states and error handling
7. Add data persistence (localStorage or backend)

## 🛠️ Tech Stack

- **React 19** - UI library
- **Vite 7** - Build tool
- **React Router 7** - Routing
- **Tailwind CSS 4** - Styling
- **ESLint** - Code linting

## 📦 Build for Production

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## 💡 Tips for Development

1. **Update `isOnboarded` flag** in `App.jsx` to toggle between onboarding and main app
2. **Mock data** is currently used - replace with API calls when backend is ready
3. **Reusable components** in `src/components/ui/` can be customized as needed
4. **Tailwind classes** can be extended via the `@theme` directive in `index.css`

## 🎯 Key Patterns to Learn

- **Layout with `<Outlet />`** - Share navigation across pages
- **Multi-step forms** - Lift state to parent component
- **Conditional styling** - Use Tailwind utilities dynamically
- **API abstraction** - Centralized fetch logic
- **Component composition** - Build complex UIs from simple components

---

Built with ❤️ using React + Tailwind CSS
