import Image from 'next/image'; // Import Image from next/image

export function TestimonialSection() {
  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="text-accent text-6xl font-bold mb-6">&quot;</div>
            <h2 className="font-sans text-3xl lg:text-4xl font-bold text-card-foreground mb-6">
              Together, we can change lives for the better
            </h2>
            <p className="font-serif text-lg text-card-foreground mb-8 leading-relaxed">
              &quot;I always wanted to help, but I didn&apos;t know where to start.
              Urukundo Foundation made it so easy to give and actually see the
              change. Watching the live stories made it real.&quot;
            </p>
            <div>
              <div className="font-sans font-semibold text-card-foreground">
                George Henry
              </div>
              <div className="font-serif text-muted-foreground">Donor</div>
            </div>

            {/* Pagination dots */}
            <div className="flex gap-2 mt-8">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
              <div className="w-3 h-3 bg-border rounded-full"></div>
              <div className="w-3 h-3 bg-border rounded-full"></div>
            </div>
          </div>

          <div className="flex-1 max-w-md">
            <Image
              src="/image/george.png"
              alt="George Henry - Donor testimonial"
              width={400} // Adjusted width for max-w-md (approx. 400px)
              height={400} // Adjusted height (square aspect ratio as a starting point)
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}