import Image from 'next/image'; // Import Image from next/image

export function TransformingSection() {
  return (
    <section id="about" className="py-16 bg-background">
      <div className="container mx-auto px-8 sm:px-8 lg:px-20">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full bg-orange-500 rounded-lg" />
              <Image
                src="/image/hands.jpg"
                alt="Community support"
                width={600}
                height={400}
                className="relative rounded-lg w-full h-[220px] sm:h-[300px] lg:h-[400px] object-cover"
              />
            </div>
          </div>

          <div className="flex-1 space-y-8">
            <h2 className="font-sans text-4xl md:text-5xl font-bold text-foreground">
              Transforming Good Intentions into Good Actions
            </h2>

            <p className="font-serif text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed">
              Urukundo Foundation is a life-changing initiative under Echosols
              Company that uses the power of technology to connect people who
              care with communities in need.
            </p>

            <p className="font-serif text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed">
              We believe that transparency, compassion, and action are the keys
              to creating lasting change. That&apos;s why we built a digital
              platform that allows you to donate securely, watch real-time
              impact stories, and track how your support makes a difference.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">1</span>
                </div>
                <span className="font-serif text-foreground">
                  Explore charitable needs
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">2</span>
                </div>
                <span className="font-serif text-foreground">
                  Donate safely
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">3</span>
                </div>
                <span className="font-serif text-foreground">
                  Watch live videos
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">4</span>
                </div>
                <span className="font-serif text-foreground">
                  View and register for events
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
