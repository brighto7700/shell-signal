export default async function sitemap() {
  const baseUrl = 'https://shellsignal.vercel.app';

  // In a full production setup, you could fetch all brief dates from your DB/API
  // For now, we'll include the core routes and today's entry.
  const today = new Date().toISOString().split('T')[0];

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    },
    {
      url: `${baseUrl}/daily-brief`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/daily-brief/${today}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
  ];
}
