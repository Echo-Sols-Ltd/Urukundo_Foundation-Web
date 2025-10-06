'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, User, DollarSign, Clock, ExternalLink } from 'lucide-react';
import { type SearchResults, type Event, type Donation } from '@/lib/api';
import { useRouter } from 'next/navigation';
// import { formatDistanceToNow } from 'date-fns';

interface SearchResultsProps {
  results: SearchResults;
  query?: string;
  className?: string;
}

export default function SearchResults({ results, query, className = "" }: SearchResultsProps) {
  const router = useRouter();

  if (!results || (!results.events?.length && !results.donations?.length && !results.users?.length)) {
    return (
      <div className={`text-center py-8 ${className}`}>
        {query ? (
          <div className="text-gray-500">
            <div className="text-lg font-medium">No results found</div>
            <div className="text-sm mt-1">Try adjusting your search terms or filters</div>
          </div>
        ) : (
          <div className="text-gray-500 text-sm">Start typing to search...</div>
        )}
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Events Results */}
      {results.events && results.events.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Events ({results.events.length})
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.events.map((event: Event) => (
              <Card key={event.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base line-clamp-2">{event.eventName}</CardTitle>
                    <Badge variant={event.status === 'UPCOMING' ? 'default' : 'secondary'} className="ml-2 shrink-0">
                      {event.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {event.description}
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-500">
                      <User className="h-4 w-4" />
                      <span className="truncate">{event.organizer}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(event.startDate)}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => router.push(`/events/${event.id}`)}
                    >
                      View Details
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => router.push(`/donation/event?eventId=${event.id}`)}
                    >
                      Donate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Donations Results */}
      {results.donations && results.donations.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Donations ({results.donations.length})
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.donations.map((donation: Donation) => (
              <Card key={donation.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold text-green-600">
                      {formatAmount(donation.amount)}
                    </span>
                    <Badge variant={donation.status === 'COMPLETED' ? 'default' : 'secondary'}>
                      {donation.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">
                        {donation.donor.firstName} {donation.donor.lastName}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(donation.donationTime)}</span>
                    </div>
                    
                    {donation.donationCause && (
                      <div>
                        <Badge variant="outline" className="text-xs">
                          {donation.donationCause}
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  {donation.donationText && (
                    <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                      &quot;{donation.donationText}&quot;
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Users Results (Admin Only) */}
      {results.users && results.users.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Users ({results.users.length})
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.users.map((user: { id: number; firstName: string; lastName: string; email: string; role: string; }) => (
              <Card key={user.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">
                      {user.firstName} {user.lastName}
                    </h4>
                    <Badge variant="outline">
                      {user.role}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{user.email}</p>
                  
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => router.push(`/admin/users/${user.id}`)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Error Message */}
      {results.error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4">
            <div className="text-red-600">
              <div className="font-medium">Search Error</div>
              <div className="text-sm mt-1">{results.message}</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}