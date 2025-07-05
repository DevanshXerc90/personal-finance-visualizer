'use client';

import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { categories } from '@/data/categories';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    Legend,
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

const PIE_COLORS = [
    '#4f46e5', '#10b981', '#f59e0b', '#ef4444',
    '#0ea5e9', '#a855f7', '#14b8a6', '#f43f5e', '#8b5cf6',
];

export default function Home() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [budgets, setBudgets] = useState<{ category: string; amount: number; month: string }[]>([]);

    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editAmount, setEditAmount] = useState<number>(0);
    const [editDescription, setEditDescription] = useState('');
    const [editCategory, setEditCategory] = useState('');
    const [editDate, setEditDate] = useState('');

    const currentMonth = useMemo(() => {
        return new Date().toLocaleString('default', { month: 'short', year: 'numeric' });
    }, []);

    const fetchTransactions = async () => {
        const res = await fetch('/api/transactions');
        const data = await res.json();

        const validData = data.filter((t: Transaction) =>
            typeof t.amount === 'number' &&
            typeof t.description === 'string' &&
            typeof t.category === 'string' &&
            typeof t.date === 'string' &&
            !isNaN(new Date(t.date).getTime())
        );

        setTransactions(validData);
    };

    const fetchBudgets = async () => {
        const res = await fetch(`/api/budgets?month=${currentMonth}`);
        const data = await res.json();
        setBudgets(data);
    };

    useEffect(() => {
        fetchTransactions();
        fetchBudgets();
    }, [currentMonth]);

    const monthlyData = useMemo(() => {
        return transactions.reduce((acc, t) => {
            if (!t.date) return acc;
            const parsedDate = new Date(t.date);
            if (isNaN(parsedDate.getTime())) return acc;

            const month = parsedDate.toLocaleString('default', {
                month: 'short',
                year: 'numeric',
            });

            const existing = acc.find((e) => e.month === month);
            existing ? (existing.total += t.amount) : acc.push({ month, total: t.amount });
            return acc;
        }, [] as { month: string; total: number }[]);
    }, [transactions]);

    const categoryData = useMemo(() => {
        return categories.map((cat) => ({
            name: cat,
            value: transactions
                .filter((t) => t.category === cat)
                .reduce((sum, t) => sum + t.amount, 0),
        })).filter((d) => d.value > 0);
    }, [transactions]);

    const budgetComparison = useMemo(() => {
        return categories.map((cat) => {
            const actual = transactions
                .filter((t) => t.category === cat)
                .reduce((sum, t) => sum + t.amount, 0);
            const budget = budgets.find((b) => b.category === cat)?.amount ?? 0;
            return { category: cat, actual, budget };
        }).filter(entry => entry.actual > 0 || entry.budget > 0);
    }, [transactions, budgets]);

    const handleAdd = async () => {
        if (!amount || !description || !date || !category)
            return alert('Please fill all fields');

        const res = await fetch('/api/transactions', {
            method: 'POST',
            body: JSON.stringify({
                amount: Number(amount),
                description,
                category,
                date,
            }),
        });

        if (res.ok) {
            setAmount('');
            setDescription('');
            setCategory('');
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
        setEditCategory(t.category);
        setEditDate(t.date.slice(0, 10));
    };

    const handleUpdate = async (id: string) => {
        await fetch('/api/transactions', {
            method: 'PUT',
            body: JSON.stringify({
                id,
                amount: editAmount,
                description: editDescription,
                category: editCategory,
                date: editDate,
            }),
        });
        setEditingId(null);
        fetchTransactions();
    };

    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
    const recent = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    const topCategory = categoryData.sort((a, b) => b.value - a.value)[0]?.name || '--';

    return (
        <div className="container">
            <h1 className="title">Personal Finance Visualizer</h1>

            {/* Summary Cards */}
            <section className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="card text-center">
                    <p className="text-gray-500">Total Spent</p>
                    <h2 className="text-2xl font-bold text-red-600">₹{totalSpent}</h2>
                </div>
                <div className="card text-center">
                    <p className="text-gray-500">Top Category</p>
                    <h2 className="text-lg font-semibold">{topCategory}</h2>
                </div>
                <div className="card text-center">
                    <p className="text-gray-500">Most Recent</p>
                    {recent ? (
                        <h2 className="text-sm">
                            ₹{recent.amount} • {recent.category}
                        </h2>
                    ) : (
                        <h2 className="text-sm">--</h2>
                    )}
                </div>
            </section>

            {/* Add Transaction */}
            <div className="card grid-3">
                <div className="field">
                    <label>Amount (₹)</label>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
                <div className="field">
                    <label>Description</label>
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="field">
                    <label>Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border p-2 rounded-md">
                        <option value="">Select Category</option>
                        {categories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
                <div className="field">
                    <label>Date</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                    <Button className="btn-primary" onClick={handleAdd}>➕ Add Transaction</Button>
                </div>
            </div>

            {/* Set Budgets */}
            <h2 className="section-title mt-10">Set Monthly Budgets</h2>
            <div className="card grid-3">
                {categories.map((cat) => {
                    const existing = budgets.find((b) => b.category === cat);
                    return (
                        <div key={cat} className="field">
                            <label>{cat}</label>
                            <input
                                type="number"
                                placeholder="₹0"
                                value={existing?.amount ?? ''}
                                onChange={async (e) => {
                                    const value = Number(e.target.value);
                                    await fetch('/api/budgets', {
                                        method: 'POST',
                                        body: JSON.stringify({ category: cat, amount: value, month: currentMonth }),
                                    });
                                    const res = await fetch(`/api/budgets?month=${currentMonth}`);
                                    const updated = await res.json();
                                    setBudgets(updated);
                                }}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Transactions List */}
            <h2 className="section-title mt-10">Transactions</h2>
            <div className="space-y-4">
                {transactions.map((t) =>
                    editingId === t._id ? (
                        <div key={t._id} className="card grid-3">
                            <input type="number" value={editAmount} onChange={(e) => setEditAmount(Number(e.target.value))} />
                            <input type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                            <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className="border p-2 rounded-md">
                                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
                            <div className="flex gap-2 col-span-full">
                                <Button className="btn-primary" onClick={() => handleUpdate(t._id!)}>✅ Update</Button>
                                <button className="btn-outline" onClick={() => setEditingId(null)}>❌ Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <div key={t._id} className="list-item">
                            <div>
                                <p>₹{t.amount} — {t.description}</p>
                                <p className="text-xs">{t.category} • {new Date(t.date).toLocaleDateString()}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="btn-outline" onClick={() => handleEdit(t)}>✏️</button>
                                <button className="btn-danger" onClick={() => handleDelete(t._id!)}>🗑️</button>
                            </div>
                        </div>
                    )
                )}
            </div>

            {/* Charts */}
            <h2 className="section-title mt-10">Monthly Expenses</h2>
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

            <h2 className="section-title mt-10">Category Breakdown</h2>
            <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={categoryData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                        >
                            {categoryData.map((_, i) => (
                                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                            ))}
                        </Pie>
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Budget vs Actual */}
            <h2 className="section-title mt-10">Budget vs Actual</h2>
            <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={budgetComparison}>
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="budget" fill="#10b981" name="Budget" />
                        <Bar dataKey="actual" fill="#ef4444" name="Actual" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Insights */}
            <h2 className="section-title mt-10">Spending Insights</h2>
            <div className="card">
                {budgetComparison.length === 0 ? (
                    <p>No insights yet.</p>
                ) : (
                    <ul className="list-disc pl-5 space-y-1">
                        {budgetComparison.map(({ category, budget, actual }) => {
                            if (budget === 0) return null;
                            if (actual > budget) {
                                return (
                                    <li key={category} className="text-red-600">
                                        You overspent on <strong>{category}</strong> by ₹{actual - budget}.
                                    </li>
                                );
                            } else if (actual < budget) {
                                return (
                                    <li key={category} className="text-green-600">
                                        You stayed under budget on <strong>{category}</strong> by ₹{budget - actual}.
                                    </li>
                                );
                            } else {
                                return (
                                    <li key={category}>
                                        You exactly met your <strong>{category}</strong> budget.
                                    </li>
                                );
                            }
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}
