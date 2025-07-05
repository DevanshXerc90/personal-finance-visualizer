'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Transaction {
    _id?: string;
    amount: number;
    description: string;
    date: string;
}

export default function Home() {
    // 👉 form state
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');

    // 👉 transactions & edit state
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editAmount, setEditAmount] = useState<number>(0);
    const [editDescription, setEditDescription] = useState('');
    const [editDate, setEditDate] = useState('');

    /* -------- data fetch ---------- */
    const fetchTransactions = async () => {
        const res = await fetch('/api/transactions');
        const data = await res.json();
        setTransactions(data);
    };

    useEffect(() => { fetchTransactions(); }, []);

    /* -------- add / delete / edit ---------- */
    const handleAdd = async () => {
        if (!amount || !description || !date) return alert('Please fill all fields');

        const res = await fetch('/api/transactions', {
            method: 'POST',
            body: JSON.stringify({ amount: Number(amount), description, date }),
        });

        if (res.ok) {
            setAmount('');
            setDescription('');
            setDate('');
            fetchTransactions();
        } else alert('Something went wrong');
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
        setEditDate(t.date.slice(0, 10)); // YYYY‑MM‑DD for <input type="date">
    };

    const handleUpdate = async (id: string) => {
        await fetch('/api/transactions', {
            method: 'PUT',
            body: JSON.stringify({ id, amount: editAmount, description: editDescription, date: editDate }),
        });
        setEditingId(null);
        fetchTransactions();
    };

    /* -------- chart data ---------- */
    const monthlyData = transactions.reduce<{ month: string; total: number }[]>((acc, t) => {
        const month = new Date(t.date).toLocaleString('default', { month: 'short', year: 'numeric' });
        const entry = acc.find((e) => e.month === month);
        entry ? (entry.total += t.amount) : acc.push({ month, total: t.amount });
        return acc;
    }, []);

    /* -------- UI ---------- */
    return (
        <main className={styles.container}>
            <h1>Personal Finance Visualizer</h1>

            {/* --- add form --- */}
            <div className={styles.form}>
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                <button onClick={handleAdd}>Add Transaction</button>
            </div>

            {/* --- list --- */}
            <h2>Transactions</h2>
            <ul className={`${styles.list}`}>
                {transactions.map((t) =>
                    editingId === t._id ? (
                        <li key={t._id}>
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
                            <button onClick={() => handleUpdate(t._id!)}>Update</button>
                            <button onClick={() => setEditingId(null)}>Cancel</button>
                        </li>
                    ) : (
                        <li key={t._id}>
                            ₹{t.amount} — {t.description} on {new Date(t.date).toLocaleDateString()}
                            <button onClick={() => handleEdit(t)}>✏️</button>
                            <button onClick={() => handleDelete(t._id!)}>🗑️</button>
                        </li>
                    )
                )}
            </ul>

            {/* --- chart --- */}
            <h2>Monthly Expenses</h2>
            <div className={styles.chart}>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="total" fill="#4F46E5" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </main>
    );
}
