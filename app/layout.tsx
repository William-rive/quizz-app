import type { Metadata } from 'next';
import { QuizProvider } from './context/QuizContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
          <QuizProvider> {children}</QuizProvider>
      </body>
    </html>
  );
}
