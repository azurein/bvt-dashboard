import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import dynamic from 'next/dynamic';
import { AuthProvider } from '@/context/AuthContext';

const LoginForm = dynamic(() => import('@/components/LoginForm'), {
  ssr: false
});

export const metadata = {
  title: 'Web Title',
  description: 'Description'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className="h-full">
        <AuthProvider>
          <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
              <div className="flex h-full min-h-screen flex-col gap-2">
                <div className="flex-1 overflow-auto p-6">
                  <LoginForm />
                </div>
              </div>
            </div>
            <div className="flex flex-col min-h-screen h-screen">{children}</div>
          </div>
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
