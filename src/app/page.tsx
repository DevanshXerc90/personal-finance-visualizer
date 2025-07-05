'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

interface Transaction {
    _id?: string;
    amount: number;
    description: string;
    date: string;
}

export default function Home() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');

    useEffect(() => {
        fetch('/api/transactions')
            .then(res => res.json())
            .then(data => setTransactions(data));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount || !description || !date) {
            alert('Please fill in all fields');
            return;
        }

        const res = await fetch('/api/transactions', {
            method: 'POST',
            body: JSON.stringify({ amount: Number(amount), description, date }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (res.ok) {
            const newTx = await res.json();
            setTransactions([newTx, ...transactions]);
            setAmount('');
            setDescription('');
            setDate('');
        } else {
            alert('Something went wrong');
        }
    };

    return (
        <main className={styles.container}>
            <h1>Personal Finance Visualizer</h1>

            <form onSubmit={handleSubmit} className={styles.form}>
                <label>
                    Amount:
                    <input
                        type="number"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                    />
                </label>

                <label>
                    Description:
                    <input
                        type="text"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </label>

                <label>
                    Date:
                    <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                    />
                </label>

                <button type="submit">Add Transaction</button>
            </form>

            <ul className={styles.list}>
                {transactions.map(tx => (
                    <li key={tx._id}>
                        <strong>₹{tx.amount}</strong> - {tx.description} on{' '}
                        {new Date(tx.date).toLocaleDateString()}
                    </li>
                ))}
            </ul>
        </main>
    );
}
