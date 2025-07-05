'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { categories } from '@/data/categories';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

import './globals.css';

interface Transaction {
    _id?: string;
    amount: number;
    description: string;
    category: string;
    date: string;
}

export default function Home() {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editAmount, setEditAmount] = useState<number>(0);
    const [editDescription, setEditDescription] = useState('');
    const [editDate, setEditDate] = useState('');

    const fetchTransactions = async () => {
        const res = await fetch('/api/transactions');
        const data = await res.json();
        setTransactions(data);
    };

    useEffect(() => {
        fetchTransactions();
    }, []);


    const handleAdd = async () => {
        if (!amount || !description || !date) {
            return alert('Please fill all fields');
        }
        const res = await fetch('/api/transactions', {
            method: 'POST',
            body: JSON.stringify({ amount: Number(amount), description, date }),
        });
        if (res.ok) {
            setAmount('');
            setDescription('');
            setDate('');
            fetchTransactions();
        }
    };

    const handleDelete = async (id: string) => {
        await fetch('/api/transactions', {
            method: 'DELETE',
            body: JSON.stringify({ id }),
        });
        fetchTransactions();
    };

    const handleEdit = (t: Transaction) => {
        setEditingId(t._id!);
        setEditAmount(t.amount);
        setEditDescription(t.description);
        setEditDate(t.date.slice(0, 10));
    };

    const handleUpdate = async (id: string) => {
        await fetch('/api/transactions', {
            method: 'PUT',
            body: JSON.stringify({
                id,
                amount: editAmount,
                description: editDescription,
                date: editDate,
            }),
        });
        setEditingId(null);
        fetchTransactions();
    };


    const monthlyData = transactions.reduce((acc, t) => {
        const month = new Date(t.date).toLocaleString('default', {
            month: 'short',
            year: 'numeric',
        });
        const existing = acc.find((e) => e.month === month);
        existing ? (existing.total += t.amount) : acc.push({ month, total: t.amount });
        return acc;
    }, [] as { month: string; total: number }[]);

    return (
        <div className="container">
            <h1 className="title">Personal Finance Visualizer</h1>

            {/* ---------- Add Transaction ---------- */}
            <div className="card grid-3">
                <div className="field">
                    <label>Amount (₹)</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>

                <div className="field">
                    <label>Description</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="field">
                    <label>Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                    <Button className="btn-primary" onClick={handleAdd}>
                        ➕ Add Transaction
                    </Button>
                </div>
            </div>

            {/* ---------- Transaction List ---------- */}
            <h2 className="section-title">Transactions</h2>
            {transactions.length === 0 && (
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                    No transactions yet.
                </p>
            )}
            <div className="space-y-4">
                {transactions.map((t) =>
                    editingId === t._id ? (
                        <div key={t._id} className="card grid-3">
                            <input
                                type="number"
                                value={editAmount}
                                onChange={(e) => setEditAmount(Number(e.target.value))}
                            />
                            <input
                                type="text"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                            />
                            <input
                                type="date"
                                value={editDate}
                                onChange={(e) => setEditDate(e.target.value)}
                            />
                            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.5rem' }}>
                                <Button className="btn-primary" onClick={() => handleUpdate(t._id!)}>
                                    ✅ Update
                                </Button>
                                <button className="btn-outline" onClick={() => setEditingId(null)}>
                                    ❌ Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div key={t._id} className="list-item">
                            <div>
                                <p>₹{t.amount} — {t.description}</p>
                                <p>{new Date(t.date).toLocaleDateString()}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="btn-outline" onClick={() => handleEdit(t)}>✏️</button>
                                <button className="btn-danger" onClick={() => handleDelete(t._id!)}>🗑️</button>
                            </div>
                        </div>
                    )
                )}
            </div>

            {/* ---------- Chart ---------- */}
            <h2 className="section-title" style={{ marginTop: '2.5rem' }}>
                Monthly Expenses
            </h2>
            <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="total" fill="#4f46e5" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
