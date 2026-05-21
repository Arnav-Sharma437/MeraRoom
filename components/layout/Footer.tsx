export default function Footer() {
  return (
    <footer className="bg-brand-dark text-brand-white mt-auto">
      <div className="container mx-auto px-4 py-8 text-center text-sm text-brand-gray">
        <p>
          &copy; {new Date().getFullYear()} MeraRoom. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
