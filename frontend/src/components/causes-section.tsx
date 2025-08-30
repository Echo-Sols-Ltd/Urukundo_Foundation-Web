import { BookOpen, Droplets, Heart, Users } from 'lucide-react';

export function CausesSection() {
  const causes = [
    {
      icon: BookOpen,
      title: 'Education',
      description: 'Empowering communities through quality education and learning opportunities',
    },
    {
      icon: Droplets,
      title: 'Clean Water',
      description: 'Providing access to clean, safe drinking water for underserved communities',
    },
    {
      icon: Heart,
      title: 'Health Care',
      description: 'Delivering essential healthcare services and medical support to those in need',
    },
    {
      icon: Users,
      title: 'Local communities',
      description: 'Building stronger, more resilient communities through local development programs',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {causes.map((cause, index) => {
            const IconComponent = cause.icon;
            return (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <IconComponent className="w-12 h-12 text-orange-500 stroke-2" />
                </div>
                <div className="flex-1">
                  <h3 className="font-sans text-xl font-semibold text-gray-900 mb-2">
                    {cause.title}
                  </h3>
                  <p className="font-serif text-gray-600 text-sm">
                    {cause.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
