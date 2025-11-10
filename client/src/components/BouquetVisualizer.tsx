interface Flower {
  name: string;
  color: string;
  quantity: number;
}

interface BouquetVisualizerProps {
  flowers: Flower[];
  size?: "small" | "medium" | "large";
}

const colorMap: Record<string, string> = {
  "Rouge": "#DC2626",
  "Rose": "#F472B6",
  "Blanc": "#F9FAFB",
  "Jaune": "#FBBF24",
  "Bleu": "#3B82F6",
  "Violet": "#A855F7",
  "Orange": "#FB923C",
};

export default function BouquetVisualizer({ flowers, size = "medium" }: BouquetVisualizerProps) {
  const dimensions = {
    small: { width: 200, height: 250 },
    medium: { width: 300, height: 375 },
    large: { width: 400, height: 500 },
  };

  const { width, height } = dimensions[size];
  const centerX = width / 2;
  const centerY = height * 0.7;

  // Générer les positions des fleurs en spirale
  const flowerPositions: Array<{ x: number; y: number; color: string; size: number; rotation: number }> = [];
  
  flowers.forEach((flower, flowerIndex) => {
    const baseColor = colorMap[flower.color] || "#10B981";
    
    for (let i = 0; i < flower.quantity; i++) {
      const angle = (flowerIndex * 60 + i * 30) * (Math.PI / 180);
      const radius = 40 + i * 15 + flowerIndex * 20;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY - Math.sin(angle) * radius - i * 10;
      const flowerSize = 20 + Math.random() * 15;
      const rotation = Math.random() * 360;
      
      flowerPositions.push({ x, y, color: baseColor, size: flowerSize, rotation });
    }
  });

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="mx-auto"
      style={{ filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))" }}
    >
      {/* Dégradé de fond */}
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f0fdf4" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#dcfce7" stopOpacity="0.6" />
        </linearGradient>
        
        <radialGradient id="petalGradient">
          <stop offset="0%" stopColor="white" stopOpacity="0.3" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Fond */}
      <rect width={width} height={height} fill="url(#bgGradient)" rx="8" />

      {/* Tiges */}
      {flowerPositions.map((pos, idx) => (
        <line
          key={`stem-${idx}`}
          x1={pos.x}
          y1={pos.y + pos.size / 2}
          x2={centerX + (pos.x - centerX) * 0.3}
          y2={centerY + 20}
          stroke="#16a34a"
          strokeWidth="2"
          opacity="0.6"
        />
      ))}

      {/* Bouquet holder (vase simplifié) */}
      <ellipse
        cx={centerX}
        cy={centerY + 30}
        rx={width * 0.15}
        ry={20}
        fill="#86efac"
        opacity="0.4"
      />

      {/* Fleurs */}
      {flowerPositions.map((pos, idx) => (
        <g key={`flower-${idx}`} transform={`translate(${pos.x}, ${pos.y}) rotate(${pos.rotation})`}>
          {/* Pétales */}
          {[0, 72, 144, 216, 288].map((angle) => (
            <ellipse
              key={angle}
              cx={0}
              cy={0}
              rx={pos.size * 0.4}
              ry={pos.size * 0.6}
              fill={pos.color}
              transform={`rotate(${angle}) translate(0, ${-pos.size * 0.3})`}
              opacity="0.9"
            />
          ))}
          
          {/* Centre de la fleur */}
          <circle
            cx={0}
            cy={0}
            r={pos.size * 0.25}
            fill="#fbbf24"
            opacity="0.95"
          />
          
          {/* Reflet sur le centre */}
          <circle
            cx={-pos.size * 0.08}
            cy={-pos.size * 0.08}
            r={pos.size * 0.12}
            fill="white"
            opacity="0.6"
          />
        </g>
      ))}

      {/* Feuilles décoratives */}
      <ellipse
        cx={centerX - 40}
        cy={centerY}
        rx="15"
        ry="25"
        fill="#22c55e"
        opacity="0.7"
        transform={`rotate(-30 ${centerX - 40} ${centerY})`}
      />
      <ellipse
        cx={centerX + 40}
        cy={centerY}
        rx="15"
        ry="25"
        fill="#22c55e"
        opacity="0.7"
        transform={`rotate(30 ${centerX + 40} ${centerY})`}
      />
    </svg>
  );
}
