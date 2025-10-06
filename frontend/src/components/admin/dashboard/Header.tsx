import { SearchIcon, Menu } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

interface HeaderProps {
  title: string;
  userInitial?: string;
  onMobileMenuToggle?: () => void;
}

export default function Header({
  title,
  userInitial = 'A',
  onMobileMenuToggle,
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-5 py-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            title="Open menu"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          <h1 className="text-lg sm:text-2xl font-semibold text-gray-900">
            {title}
          </h1>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Search */}
          <button
            onClick={() => router.push('/search')}
            className={`hidden sm:block p-2 rounded-lg transition-colors duration-200 ${
              pathname === '/search' 
                ? 'bg-orange-100 text-orange-600' 
                : 'text-gray-400 hover:bg-gray-100'
            }`}
            title="Search"
            aria-label="Search"
          >
            <SearchIcon className="w-5 h-5" />
          </button>

          {/* User Avatar */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm sm:text-base">
              {userInitial}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
