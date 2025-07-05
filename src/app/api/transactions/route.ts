import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Transaction from '@/models/Transaction';

export async function GET() {
    await connectDB();
    const transactions = await Transaction.find().sort({ date: -1 });
    return NextResponse.json(transactions);
}

export async function POST(req: Request) {
    await connectDB();
    const { amount, description, category, date } = await req.json(); // ✅ added category

    if (!amount || !description || !category || !date) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const newTransaction = new Transaction({
        amount,
        description,
        category,
        date,
    });

    await newTransaction.save();
    return NextResponse.json(newTransaction);
}

export async function DELETE(req: Request) {
    await connectDB();
    const { id } = await req.json();
    await Transaction.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted' });
}

export async function PUT(req: Request) {
    await connectDB();
    const { id, amount, description, category, date } = await req.json(); // ✅ added category

    const updated = await Transaction.findByIdAndUpdate(
        id,
        { amount, description, category, date },
        { new: true }
    );

    return NextResponse.json(updated);
}
