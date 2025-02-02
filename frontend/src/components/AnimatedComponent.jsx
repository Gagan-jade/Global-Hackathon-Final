export default function AnimatedBackground() {
    return (
      <div className="absolute inset-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="gold" stopOpacity="1">
                <animate attributeName="offset" values="0;1;0" dur="5s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="gold" stopOpacity="0">
                <animate attributeName="offset" values="0;1;0" dur="5s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
          </defs>
          <path
            d="M 100 200 C 200 100 300 100 400 200 C 500 300 600 300 700 200 C 800 100 900 100 1000 200 C 1100 300 1200 300 1300 200"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="4"
            className="animate-draw"
          />
        </svg>
      </div>
    )
  }
  
  