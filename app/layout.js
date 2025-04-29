// kidzy-frontend/kidzy/app/layout.js
import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Kidzy LMS",
  description: "Your modern Learning Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
