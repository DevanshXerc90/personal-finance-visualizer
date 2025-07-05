import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Transaction from '@/models/Transaction';

export async function GET() {
    await connectDB();
    const transactions = await Transaction.find().sort({ date: -1 });
    return NextResponse.json(transactions);
}

export async function POST(req: Request) {
    const body = await req.json();
    const { amount, date, description } = body;

    if (!amount || !date || !description) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await connectDB();
    const newTx = await Transaction.create({ amount, date, description });
    return NextResponse.json(newTx, { status: 201 });
}
