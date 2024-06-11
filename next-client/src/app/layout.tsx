import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {  ApolloProvider } from '@apollo/client';
import ApolloWrapper  from '../lib/apolloClient.js'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}
