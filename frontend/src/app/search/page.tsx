'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SearchComponent from '@/components/SearchComponent';
import SearchResults from '@/components/SearchResults';
import { withAuth } from '@/components/auth/withAuth';
import { type SearchResults as SearchResultsType } from '@/lib/api';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

function SearchPage() {
  const [searchResults, setSearchResults] = useState<SearchResultsType>({});
  const [currentQuery, setCurrentQuery] = useState('');
  const router = useRouter();

  const handleSearchResults = (results: SearchResultsType) => {
    setSearchResults(results);
  };

  const handleSearchStart = (query: string) => {
    setCurrentQuery(query);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Search</h1>
          </div>
          
          {/* Search Component */}
          <SearchComponent
            onResults={handleSearchResults}
            placeholder="Search for events, donations, users..."
            showFilters={true}
            autoSearch={true}
            className="w-full"
          />
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Search Results</span>
              {currentQuery && (
                <span className="text-sm font-normal text-gray-500">
                  for &quot;{currentQuery}&quot;
                </span>
              )}
            </CardTitle>
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
  );
}

export default withAuth(SearchPage);