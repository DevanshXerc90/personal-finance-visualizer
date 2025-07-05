import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';          // ✅ named import (matches your db.ts)
import Budget from '@/models/budget';      // ✅ adjust path if your model lives here

// GET /api/budgets?month=Jul%202025
export async function GET(req: Request) {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month');     // optional filter

    const query = month ? { month } : {};
    const budgets = await Budget.find(query);

    return NextResponse.json(budgets);
}

// POST /api/budgets   (body: { month, category, amount })
export async function POST(req: Request) {
    await connectDB();

    const body = await req.json();               // { month, category, amount }

    // up‑sert: update if exists, otherwise create
    const updated = await Budget.findOneAndUpdate(
        { month: body.month, category: body.category },
        { $set: { amount: body.amount } },
        { upsert: true, new: true }
    );

    return NextResponse.json(updated);
}
