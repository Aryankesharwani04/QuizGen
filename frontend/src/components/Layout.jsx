import PageHeader from './PageHeader';
import Footer from './Footer';

export default function Layout({ children, hideHeaderFooter = false }) {
  if (hideHeaderFooter) {
    return children;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
