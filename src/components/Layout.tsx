import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { BeepBot } from './BeepBot';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col circuit-bg">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <BeepBot />
    </div>
  );
};
