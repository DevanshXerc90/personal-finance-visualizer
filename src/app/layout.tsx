// src/app/layout.tsx

import './globals.css'; // Optional: create empty or custom global styles

export const metadata = {
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
            <body>
                {children}
            </body>
        </html>
    );
}
