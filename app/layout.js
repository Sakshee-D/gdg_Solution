export const metadata = {
    title: 'Carbon Tracker',
    description: 'Track and reduce your carbon footprint.',
  };
  
  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }
  