import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    metadataBase: new URL('http://localhost:3000'),
    title: 'Jewelry Reseller Platform - Start Your Jewelry Business Today',
    description: 'Create your own branded jewelry store in minutes. Curate products, set your prices, and earn commissions. No inventory, no hassle.',
    keywords: 'jewelry, reseller, ecommerce, dropshipping, online store, jewelry business',
    authors: [{ name: 'Jewelry Platform' }],
    openGraph: {
        title: 'Jewelry Reseller Platform',
        description: 'Launch your jewelry business with zero inventory',
        type: 'website',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}
