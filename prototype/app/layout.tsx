import type { Metadata } from "next";
import "./globals.css";
import LayoutShell from "@/components/LayoutShell";

export const metadata: Metadata = {
  title: "Biskit 정책 관리 프로토타입",
  description: "사업소득 관리 프로토타입",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
