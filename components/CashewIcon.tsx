interface CashewIconProps {
  className?: string
  size?: number
}

export default function CashewIcon({ className = '', size = 24 }: CashewIconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Main cashew body - light beige/cream color */}
      <path 
        d="M30 25C30 25 25 30 22 40C20 48 20 58 25 68C28 75 35 82 45 85C55 88 65 87 72 82C78 77 82 70 83 62C84 54 82 45 78 38C74 31 68 26 60 24C52 22 42 23 35 26C32 27 30 25 30 25Z" 
        fill="#E8D7A8"
        stroke="#8B6F47"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Darker shading for depth */}
      <path 
        d="M35 30C35 30 32 35 30 42C28 50 28 58 32 66C34 70 38 75 44 78C50 81 58 82 65 79C70 77 74 73 76 68C78 63 78 57 76 51C74 45 70 40 65 37C60 34 53 33 47 34C43 35 38 36 35 30Z" 
        fill="#D4C49A"
        opacity="0.6"
      />
      
      {/* Highlight - white shine */}
      <ellipse 
        cx="42" 
        cy="38" 
        rx="12" 
        ry="18" 
        transform="rotate(-25 42 38)"
        fill="white"
        opacity="0.4"
      />
      
      {/* Small highlight spot */}
      <ellipse 
        cx="48" 
        cy="45" 
        rx="6" 
        ry="8" 
        transform="rotate(-20 48 45)"
        fill="white"
        opacity="0.5"
      />
      
      {/* Cashew curve detail */}
      <path 
        d="M28 45C28 45 30 55 35 63C40 70 48 75 56 77" 
        stroke="#B8A080"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  )
}
