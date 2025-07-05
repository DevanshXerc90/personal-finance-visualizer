# 💸 Personal Finance Visualizer

A clean and simple web app to **track expenses** and **visualize your monthly spending** — powered by **Next.js 14**, **MongoDB**, **Tailwind CSS v4**, **ShadCN UI**, and **Recharts**.

> 🔗 Live Demo: [https://your-vercel-url.vercel.app](https://your-vercel-url.vercel.app)

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router, React 19, TypeScript)
- **Styling**: Tailwind CSS v4 + ShadCN UI components
- **Charts**: Recharts
- **Database**: MongoDB Atlas
- **Deployment**: Vercel

---

## ✨ Features

- ✅ Add, edit, and delete transactions
- 📈 Visualize monthly expenses in a bar chart
- 🧩 ShadCN UI components with Tailwind 4
- 💾 MongoDB cloud storage (Atlas)
- 🌐 Vercel deployment-ready

---

## 🖼️ Screenshots

- 🧾 Transaction Form
- 📃 Transaction List
- 📊 Monthly Expense Bar Chart

---

## 🚀 Getting Started (Local Development)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/personal-finance-visualizer.git
cd personal-finance-visualizer
2. Install dependencies
bash
Copy
Edit
npm install
3. Set up your .env file
Create a file named .env or .env.local in the root:

bash
Copy
Edit
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/finance-visualizer?retryWrites=true&w=majority
Warning: Keep your Mongo URI private and secure.

4. Start the dev server
bash
Copy
Edit
npm run dev
Visit http://localhost:3000 in your browser.

📦 Project Structure
bash
Copy
Edit
src/
├── app/
│   ├── page.tsx               # Main UI logic
│   └── api/
│       └── transactions/      # CRUD API Routes
├── lib/
│   └── db.ts                  # MongoDB connection logic
├── components/
│   └── ui/                    # ShadCN components
public/
.env
🧠 API Endpoints
Method	Endpoint	Description
GET	/api/transactions	Fetch all transactions
POST	/api/transactions	Add a transaction
PUT	/api/transactions	Update a transaction
DELETE	/api/transactions	Delete a transaction

📊 Charting Logic
Groups all transactions by month

Uses Recharts to render a bar chart of total ₹ spent per month

Ideal for tracking spending patterns

🌐 Deployment (Vercel)
1. Push your code to GitHub
bash
Copy
Edit
git init
git remote add origin https://github.com/yourusername/personal-finance-visualizer.git
git push -u origin main
2. Deploy on Vercel
Import your repo

Go to Settings → Environment Variables

Add the following:

vbnet
Copy
Edit
Name: MONGODB_URI
Value: your MongoDB connection string
3. Optional: Disable ESLint checks (temporary)
If you get build errors on Vercel due to ESLint, use this in package.json:

json
Copy
Edit
"scripts": {
  "build": "next build --no-lint"
}
❗ Recommended only for prototypes

✅ Future Improvements
🔐 Add authentication (Google login)

🧾 Category-wise breakdown (Food, Rent, Bills)

📅 Filter by custom date ranges

📈 Add pie/donut charts for categories

📄 License
This project is open source under the MIT License.

🙋‍♂️ Author
Built with ❤️ by Devansh Singh

GitHub: @DevanshXerc90

If you like this project, please ⭐ the repo!