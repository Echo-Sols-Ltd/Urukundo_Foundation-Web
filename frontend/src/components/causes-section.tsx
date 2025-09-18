import { BookOpen, Droplets, Heart, Users } from 'lucide-react';

export function CausesSection() {
  const causes = [
    {
      icon: BookOpen,
      title: 'Education',
      description:
        'Empowering communities through quality education and learning opportunities',
    },
    {
      icon: Droplets,
      title: 'Clean Water',
      description:
        'Providing access to clean, safe drinking water for underserved communities',
    },
    {
      icon: Heart,
      title: 'Health Care',
      description:
        'Delivering essential healthcare services and medical support to those in need',
    },
    {
      icon: Users,
      title: 'Local communities',
      description:
        'Building stronger, more resilient communities through local development programs',
    },
  ];

  return (
    <section className="section-padding-lg bg-white">
      <div className="container mx-auto px-6 sm:px-8 lg:px-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Increased from gap-8 */}
          {causes.map((cause, index) => {
            const IconComponent = cause.icon;
            return (
              <div key={index} className="flex items-start gap-6">
                {/* Increased from gap-4 */}
                <div className="flex-shrink-0">
                  <IconComponent className="w-14 h-14 text-orange-500 stroke-2" />
                  {/* Increased from w-12 h-12 */}
                </div>
                <div className="flex-1">
                  <h3 className="font-sans text-xl font-semibold text-gray-900 mb-3">
                    {/* Increased from mb-2 */}
                    {cause.title}
                  </h3>
                  <p className="font-serif text-gray-600 text-sm leading-relaxed">
                    {/* Added leading-relaxed */}
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
