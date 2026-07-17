import './admin-globals.css';

export const metadata = {
  title: 'Admin Dashboard - JCA Edutech',
  description: 'Admin Portal for JCA Edutech',
};

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
