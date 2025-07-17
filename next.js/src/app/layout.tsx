import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Abgeschottet KI",
  description: "Ringfenced Artificial Intelligence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
