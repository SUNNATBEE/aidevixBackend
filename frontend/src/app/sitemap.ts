import { MetadataRoute } from 'next'
import { API_BASE_URL } from '@/utils/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://aidevix.uz'

  // Fetch courses for sitemap
  let courses: { _id: string, updatedAt: string }[] = []
  try {
    const res = await fetch(`${API_BASE_URL}courses`, { next: { revalidate: 3600 } })
    const data = await res.json()
    courses = data.data?.courses || []
  } catch (e) {
    console.error('Sitemap fetch error:', e)
  }

  const courseUrls = courses.map((course) => ({
    url: `${baseUrl}/courses/${course._id}`,
    lastModified: new Date(course.updatedAt || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/videos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/leaderboard`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    ...courseUrls,
  ]
}
