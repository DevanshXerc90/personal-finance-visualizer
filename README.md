📊 Personal Finance Visualizer
Track your daily expenses and visualize monthly spending — built using Next.js, React 19, Tailwind CSS v4, ShadCN/UI, MongoDB, and Recharts.

🚀 Features
✅ Add, edit, and delete daily transactions

📅 Filter transactions by date

📈 Visualize monthly spending via a clean bar chart

🎨 Styled with CSS + ShadCN buttons (for UI consistency)

🧠 Built with latest React 19 + Tailwind v4

🖥️ Tech Stack
Next.js App Router

React 19 Server & Client Components

Tailwind CSS v4 (with fallback to global CSS)

ShadCN/UI for accessible components

MongoDB (via local or Atlas cloud)

Recharts for visualizations

📦 Setup
1. Clone the repo
bash
Copy
Edit
git clone https://github.com/your-username/personal-finance-visualizer.git
cd personal-finance-visualizer
2. Install dependencies
bash
Copy
Edit
npm install
# or
pnpm install
3. Set up environment variables
Create a .env.local file:

env
Copy
Edit
MONGO_URI=mongodb+srv://<your-username>:<password>@cluster.mongodb.net/finance-db
Make sure your MongoDB cluster is whitelisted to allow your IP or 0.0.0.0/0 (for dev).

4. Run the app locally
bash
Copy
Edit
npm run dev