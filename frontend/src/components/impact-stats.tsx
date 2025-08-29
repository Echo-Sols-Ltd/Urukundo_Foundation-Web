import { Rocket, Package, Globe, Gift } from 'lucide-react';

export function ImpactStats() {
  const stats = [
    { number: '1.2k+', label: 'Projects Completed', icon: Rocket },
    { number: '100', label: 'Monthly Donate', icon: Package },
    { number: '480', label: 'Partners Worldwide', icon: Globe },
    { number: '1.4m', label: 'Donations Received', icon: Gift },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent
                    className="w-8 h-8 text-orange-500"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="font-sans text-3xl lg:text-4xl font-bold text-foreground mb-2">
                  {stat.number}
                </div>
                <div className="font-serif text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
