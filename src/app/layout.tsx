// src/app/layout.tsx

import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Personal Finance Visualizer',
    description: 'Track your expenses easily',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="bg-gray-100 text-gray-900 min-h-screen antialiased">
                <main className="container mx-auto px-4 py-6">
                    {children}
                </main>
            </body>
        </html>
    );
}
