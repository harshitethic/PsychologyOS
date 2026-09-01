import "./globals.css";
import { getSessionUser } from "@/lib/auth";
import { AppChrome } from "@/components/AppChrome";
import { ThemeToggle } from "@/components/ThemeToggle";
import ThemeBootstrap from "@/components/ThemeBootstrap";

export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export const metadata = {
  title: "Psychology OS",
  description: "Open-source study software for B.Sc. Psychology students.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body><ThemeBootstrap /><script dangerouslySetInnerHTML={{__html:`(function(){try{var t=localStorage.getItem("psy-theme");if(t==="dark")document.documentElement.dataset.theme="dark";}catch(e){}})()`}} />
        <AppChrome user={user}>{children}</AppChrome>
        <div className="global-theme-toggle"><ThemeToggle compact /></div>
        <a
          className="creator-credit"
          href="https://github.com/harshitethic"
          target="_blank"
          rel="noreferrer"
        >
          built by <strong>@harshitethic</strong>
        </a>
      </body>
    </html>
  );
}