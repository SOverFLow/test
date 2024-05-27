import ReduxProvider from "@/store/Provider";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { NextIntlClientProvider, useMessages } from "next-intl";
import theme from "@/styles/theme";

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = useMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ReduxProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ReduxProvider>
    </NextIntlClientProvider>
  );
}
