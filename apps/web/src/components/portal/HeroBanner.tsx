interface HeroBannerProps {
  title?: string;
  subtitle?: string;
}

export function HeroBanner({
  title = 'How can we help you?',
  subtitle = 'Browse our help categories or search for a specific topic',
}: HeroBannerProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-light to-indigo-600 px-4 py-16 text-center sm:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
      <div className="relative mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">{title}</h1>
        <p className="mt-3 text-base text-white/80">{subtitle}</p>
      </div>
    </div>
  );
}
