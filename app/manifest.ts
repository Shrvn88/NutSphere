import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NutSphere - Premium Nuts & Seeds',
    short_name: 'NutSphere',
    description: 'Shop premium quality dry fruits, nuts, and seeds online',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#22c55e',
    icons: [
      {
        src: '/leaf-icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}

