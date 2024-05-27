import "@/styles/globals.css";
import { surpressSupabaseWarn } from "@/utils/surpressWarn";

export const metadata = {
  title: "TeamShift (DEV)",
  description: "TeamShift is the best.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  surpressSupabaseWarn();
  return (
    <html lang='en'>
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
