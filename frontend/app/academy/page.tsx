import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PlaceholderPage() {
    return (
        <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center border border-jaipur-gold/20">
                <h1 className="text-3xl font-display font-bold text-jaipur-burgundy mb-4">Coming Soon</h1>
                <p className="text-text-secondary mb-8">We are working hard to bring you this page. Stay tuned!</p>
                <Link href="/" className="inline-flex items-center gap-2 text-jaipur-burgundy font-semibold hover:underline">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
