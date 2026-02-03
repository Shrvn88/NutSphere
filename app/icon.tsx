import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export const size = {
  width: 32,
  height: 32,
}
 
export const contentType = 'image/png'
 
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'white',
          borderRadius: '8px',
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Green leaf */}
          <path
            d="M 50 15 Q 70 15, 75 35 Q 78 50, 70 65 Q 60 75, 50 85 Q 40 75, 30 65 Q 22 50, 25 35 Q 30 15, 50 15 Z"
            fill="#22c55e"
            stroke="#16a34a"
            strokeWidth="2"
          />
          {/* Leaf vein */}
          <line
            x1="50"
            y1="15"
            x2="50"
            y2="85"
            stroke="#16a34a"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
