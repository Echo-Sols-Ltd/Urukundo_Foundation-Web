'use client';
import { useState, useEffect } from 'react';

export function TestimonialSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  const testimonials = [
    {
      quote:
        "I always wanted to help, but I didn't know where to start. Urukundo Foundation made it so easy to give and actually see the change. Watching the live stories made it real.",
      name: 'SHEMA Leandre',
      role: 'Donor',
      alt: 'IZERE SHEMA Leandre - Donor testimonial',
    },
    {
      quote:
        "The transparency of this platform is amazing. I can see exactly where my donations go and the real impact they make. It's changed how I think about giving.",
      name: 'RUKUNDO Bahati',
      role: 'Donor',
      alt: 'RUKUNDO Bahati - Supporter testimonial',
    },
    {
      quote:
        "Being able to watch live videos of the communities we're helping makes the connection so much stronger. This isn't just charity, it's partnership.",
      name: 'BYUKUSENGE Andrew',
      role: 'Donor',
      alt: 'BYUKUSENGE Andrew - Volunteer testimonial',
    },
  ];

  const currentTestimonialData = testimonials[currentTestimonial];

  // Auto-scroll functionality with memory optimization
  useEffect(() => {
    if (!isAutoScrolling) return;

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => {
        const next = prev === testimonials.length - 1 ? 0 : prev + 1;
        return next;
      });
    }, 5000); // Change testimonial every 5 seconds

    return () => {
      clearInterval(interval);
    };
  }, [isAutoScrolling, testimonials.length]);

  // Function to handle manual testimonial change
  const handleTestimonialChange = (index: number) => {
    setCurrentTestimonial(index);
    setIsAutoScrolling(false); // Pause auto-scroll when user interacts
    
    // Resume auto-scroll after 10 seconds of no interaction
    setTimeout(() => {
      setIsAutoScrolling(true);
    }, 10000);
  };

  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-6 sm:px-8 lg:px-20">
        <div 
          className="flex flex-col lg:flex-row items-center gap-12"
          onMouseEnter={() => setIsAutoScrolling(false)}
          onMouseLeave={() => setIsAutoScrolling(true)}
        >
          <div className="flex-1">
            <div className="text-accent text-6xl font-bold mb-6">&quot;</div>
            <h2 className="font-sans text-3xl lg:text-4xl font-bold text-card-foreground mb-6">
              Together, we can change lives for the better
            </h2>
            <p className="font-serif text-lg text-card-foreground mb-8 leading-relaxed">
              &quot;{currentTestimonialData.quote}&quot;
            </p>
            <div>
              <div className="font-sans font-semibold text-card-foreground">
                {currentTestimonialData.name}
              </div>
              <div className="font-serif text-muted-foreground">
                {currentTestimonialData.role}
              </div>
            </div>

            {/* Pagination dots */}
            <div className="flex items-center gap-4 mt-8">
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleTestimonialChange(index)}
                    className={`w-3 h-3 rounded-full transition-colors hover:scale-110 transform ${
                      index === currentTestimonial
                        ? 'bg-orange-500'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
              
              {/* Auto-scroll indicator */}
             
            </div>
          </div>

         
        </div>
      </div>
    </section>
  );
}
