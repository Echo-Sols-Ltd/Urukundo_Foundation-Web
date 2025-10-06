'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { searchApi, type SearchResults, type SearchSuggestions } from '@/lib/api';
import { toast } from 'sonner';

export interface SearchFilters {
  events: boolean;
  donations: boolean;
  users: boolean;
}

interface SearchComponentProps {
  onResults?: (results: SearchResults) => void;
  placeholder?: string;
  showFilters?: boolean;
  autoSearch?: boolean;
  className?: string;
}

export default function SearchComponent({
  onResults,
  placeholder = "Search events, donations, users...",
  showFilters = true,
  autoSearch = true,
  className = "",
}: SearchComponentProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestions>({});
  const [filters, setFilters] = useState<SearchFilters>({
    events: true,
    donations: true,
    users: true,
  });
  const [results, setResults] = useState<SearchResults>({});
  
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handle search functionality
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults({});
      onResults?.({});
      return;
    }

    setLoading(true);
    try {
      let searchResults: SearchResults = {};

      if (filters.events && filters.donations && filters.users) {
        // Global search if all filters are enabled
        searchResults = await searchApi.globalSearch(searchQuery);
      } else {
        // Selective search based on filters
        if (filters.events) {
          const eventResults = await searchApi.searchEvents(searchQuery);
          searchResults.events = eventResults.events;
          searchResults.totalEvents = eventResults.totalEvents;
        }
        
        if (filters.donations) {
          const donationResults = await searchApi.searchDonations(searchQuery);
          searchResults.donations = donationResults.donations;
          searchResults.totalDonations = donationResults.totalDonations;
        }
        
        if (filters.users) {
          const userResults = await searchApi.searchUsers(searchQuery);
          searchResults.users = userResults.users;
          searchResults.totalUsers = userResults.totalUsers;
        }
      }

      setResults(searchResults);
      onResults?.(searchResults);

      if (searchResults.error) {
        toast.error(searchResults.message || 'Search failed');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters, onResults]);

  // Handle suggestions
  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions({});
      setShowSuggestions(false);
      return;
    }

    try {
      const suggestionResults = await searchApi.getSuggestions(searchQuery);
      setSuggestions(suggestionResults);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Suggestions error:', error);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (autoSearch && query) {
        performSearch(query);
      }
      if (query) {
        fetchSuggestions(query);
      } else {
        setShowSuggestions(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, autoSearch, performSearch, fetchSuggestions]);

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    performSearch(query);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    performSearch(suggestion);
  };

  const clearSearch = () => {
    setQuery('');
    setResults({});
    onResults?.({});
    setShowSuggestions(false);
  };

  const toggleFilter = (filterKey: keyof SearchFilters) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey]
    }));
  };

  const totalResults = (results.totalEvents || 0) + (results.totalDonations || 0) + (results.totalUsers || 0);

  return (
    <div ref={searchRef} className={`relative w-full max-w-2xl ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            } else if (e.key === 'Escape') {
              clearSearch();
            }
          }}
          className="pl-10 pr-24 h-12"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {loading && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          {!autoSearch && (
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="h-8 px-3"
            >
              Search
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex items-center gap-2 mt-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">Search in:</span>
          <div className="flex gap-1">
            {Object.entries(filters).map(([key, active]) => (
              <Badge
                key={key}
                variant={active ? "default" : "outline"}
                className="cursor-pointer capitalize"
                onClick={() => toggleFilter(key as keyof SearchFilters)}
              >
                {key}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Search Results Summary */}
      {query && !loading && totalResults > 0 && (
        <div className="mt-2 text-sm text-gray-600">
          Found {totalResults} result{totalResults !== 1 ? 's' : ''} for &quot;{query}&quot;
        </div>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && (suggestions.eventNames?.length || suggestions.locations?.length || suggestions.organizers?.length) && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-2">
            {suggestions.eventNames && suggestions.eventNames.length > 0 && (
              <div className="mb-2">
                <div className="text-xs font-medium text-gray-500 mb-1 px-2">Event Names</div>
                {suggestions.eventNames.map((name, index) => (
                  <button
                    key={`event-${index}`}
                    onClick={() => handleSuggestionClick(name)}
                    className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
            
            {suggestions.locations && suggestions.locations.length > 0 && (
              <div className="mb-2">
                <div className="text-xs font-medium text-gray-500 mb-1 px-2">Locations</div>
                {suggestions.locations.map((location, index) => (
                  <button
                    key={`location-${index}`}
                    onClick={() => handleSuggestionClick(location)}
                    className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                  >
                    {location}
                  </button>
                ))}
              </div>
            )}
            
            {suggestions.organizers && suggestions.organizers.length > 0 && (
              <div>
                <div className="text-xs font-medium text-gray-500 mb-1 px-2">Organizers</div>
                {suggestions.organizers.map((organizer, index) => (
                  <button
                    key={`organizer-${index}`}
                    onClick={() => handleSuggestionClick(organizer)}
                    className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                  >
                    {organizer}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}