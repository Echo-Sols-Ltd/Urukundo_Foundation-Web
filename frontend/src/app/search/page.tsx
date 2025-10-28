'use client';

import { useState, useEffect } from 'react';
import SearchComponent from '@/components/SearchComponent';
import SearchResults from '@/components/SearchResults';
import { type SearchResults as SearchResultsType } from '@/lib/api';
import { Filter, Calendar, DollarSign, Users} from 'lucide-react';
import AdminHeader from '@/components/admin/dashboard/Header';
import AdminSidebar from '@/components/admin/dashboard/Sidebar';
import UserSidebar from '@/components/donation/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentUser } from '@/lib/auth';
import { withAnyAuth } from '@/components/auth/withAuth';

function SearchPage() {
  const [searchResults, setSearchResults] = useState<SearchResultsType>({});
  const [currentQuery, setCurrentQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check user role on mount
  useEffect(() => {
    const user = getCurrentUser();
    if (user && user.role === 'ADMIN') {
      setIsAdmin(true);
    }
  }, []);

  const handleSearchResults = (results: SearchResultsType, query?: string) => {
    setSearchResults(results);
    if (query !== undefined) {
      setCurrentQuery(query);
    }
  };

  const filterOptions = [
    { id: 'all', label: 'All Results', icon: Filter, count: (searchResults.events?.length || 0) + (searchResults.donations?.length || 0) + (searchResults.users?.length || 0) },
    { id: 'events', label: 'Events', icon: Calendar, count: searchResults.events?.length || 0 },
    { id: 'donations', label: 'Donations', icon: DollarSign, count: searchResults.donations?.length || 0 },
    { id: 'users', label: 'Users', icon: Users, count: searchResults.users?.length || 0 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      

      <div className="flex">
        {/* Sidebar */}
        {isAdmin ? (
          <AdminSidebar 
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          />
        ) : (
          <UserSidebar 
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-2">
          {isAdmin ? (
        <AdminHeader 
          title="Search" 
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
      ) : null}
          <div className="p-6 lg:p-8">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Search</h1>
              <p className="text-gray-600 mt-1">Search for events, donations, and users</p>
            </div>

            {/* Search Box */}
            <div className="mb-8">
              <SearchComponent
                onResults={handleSearchResults}
                placeholder="Search for events, donations, users..."
                showFilters={true}
                autoSearch={true}
                className="w-full"
              />
            </div>

            {/* Main Content with Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Filter Sidebar */}
              <aside className="lg:col-span-1 space-y-6">
                {/* Filter Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Filter className="w-5 h-5 text-orange-500" />
                      Filters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {filterOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSelectedFilter(option.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                          selectedFilter === option.id
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <option.icon className="w-4 h-4" />
                          <span className="font-medium">{option.label}</span>
                        </div>
                        <span className={`text-sm font-semibold ${
                          selectedFilter === option.id ? 'text-white' : 'text-gray-500'
                        }`}>
                          {option.count}
                        </span>
                      </button>
                    ))}
                  </CardContent>
                </Card>

            

              
              </aside>

              {/* Main Results Area */}
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">
                      {currentQuery ? (
                        <>Search Results for &quot;{currentQuery}&quot;</>
                      ) : (
                        'Search Results'
                      )}
                    </CardTitle>
                    {currentQuery && (
                      <p className="text-sm text-gray-500">
                        {selectedFilter !== 'all' && `Showing ${selectedFilter} only`}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <SearchResults 
                      results={searchResults} 
                      query={currentQuery}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default withAnyAuth(SearchPage);

