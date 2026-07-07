import { SessionProvider } from "@/components/SessionProvider";
import "./globals.css";
import { TRPCProvider } from "@/components/TRPCProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
         <SessionProvider>
          <TRPCProvider>{children}</TRPCProvider>
        </SessionProvider>
      </body>
    </html>
  );
}