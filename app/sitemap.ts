import { MetadataRoute } from 'next'
import connectDB from '@/lib/mongodb'
import Room from '@/models/Room'

export default async function sitemap(): 
  Promise<MetadataRoute.Sitemap> {
  
  const baseUrl = 'https://www.meraroom.in'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.2,
    },
    {
      url: `${baseUrl}/terms-conditions`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.2,
    },
  ]

  // Dynamic room pages
  let roomPages: MetadataRoute.Sitemap = []
  
  try {
    await connectDB()
    const rooms = await Room.find({ 
      status: 'approved' 
    }).select('_id updatedAt').lean()
    
    roomPages = rooms.map((room: any) => ({
      url: `${baseUrl}/rooms/${room._id}`,
      lastModified: room.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Sitemap room fetch error:', error)
  }

  return [...staticPages, ...roomPages]
}
