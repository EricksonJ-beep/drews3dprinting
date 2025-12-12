export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-600 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Drew's 3D Printing. All rights reserved.</p>
        <p className="text-gray-500">Crafted with ❤️ and PLA.</p>
      </div>
    </footer>
  );
}
