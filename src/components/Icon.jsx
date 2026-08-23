export default function Icon({ name }) {
  const icons = {
    gear: (
      <>
        <polygon points="50,10 78,25 78,60 50,80 22,60 22,25" />
        <circle cx="50" cy="45" r="12" />
        <line x1="50" y1="10" x2="50" y2="33" />
        <line x1="78" y1="25" x2="60" y2="40" />
        <line x1="78" y1="60" x2="60" y2="50" />
        <line x1="50" y1="80" x2="50" y2="57" />
        <line x1="22" y1="60" x2="40" y2="50" />
        <line x1="22" y1="25" x2="40" y2="40" />
      </>
    ),
    drone: (
      <>
        <line x1="20" y1="20" x2="80" y2="80" />
        <line x1="80" y1="20" x2="20" y2="80" />
        <circle cx="20" cy="20" r="9" />
        <circle cx="80" cy="20" r="9" />
        <circle cx="20" cy="80" r="9" />
        <circle cx="80" cy="80" r="9" />
        <rect x="42" y="42" width="16" height="16" />
      </>
    ),
    helmet: (
      <>
        <path d="M20,70 A30,30 0 0,1 80,70" />
        <line x1="20" y1="70" x2="80" y2="70" />
        <line x1="35" y1="70" x2="35" y2="52" />
        <line x1="50" y1="70" x2="50" y2="42" />
        <line x1="65" y1="70" x2="65" y2="52" />
        <line x1="30" y1="55" x2="70" y2="55" />
      </>
    ),
    building: (
      <>
        <rect x="20" y="55" width="14" height="25" />
        <rect x="38" y="40" width="14" height="40" />
        <rect x="56" y="48" width="14" height="32" />
        <polygon points="38,40 45,28 52,40" />
        <line x1="42" y1="48" x2="48" y2="48" />
        <line x1="42" y1="58" x2="48" y2="58" />
        <line x1="42" y1="68" x2="48" y2="68" />
      </>
    ),
    grip: (
      <>
        <path d="M35,20 L65,20 L60,45 L68,50 L55,80 L50,65 L45,80 L32,50 L40,45 Z" />
        <line x1="30" y1="30" x2="70" y2="30" />
        <line x1="28" y1="42" x2="72" y2="42" />
        <line x1="30" y1="56" x2="70" y2="56" />
      </>
    ),
    vase: (
      <>
        <path d="M40,20 C25,35 30,50 40,55 C25,60 25,75 40,80 L60,80 C75,75 75,60 60,55 C70,50 75,35 60,20 Z" />
        <line x1="30" y1="35" x2="70" y2="35" />
        <line x1="27" y1="50" x2="73" y2="50" />
        <line x1="26" y1="65" x2="74" y2="65" />
      </>
    ),
    bracket: (
      <>
        <rect x="25" y="25" width="50" height="14" />
        <rect x="25" y="61" width="50" height="14" />
        <rect x="25" y="25" width="14" height="50" />
        <circle cx="32" cy="32" r="3" />
        <circle cx="32" cy="68" r="3" />
      </>
    ),
    mini: (
      <>
        <circle cx="50" cy="28" r="10" />
        <path d="M38,45 L62,45 L58,72 L50,80 L42,72 Z" />
        <line x1="38" y1="55" x2="26" y2="65" />
        <line x1="62" y1="55" x2="74" y2="65" />
      </>
    ),
  }

  return (
    <svg viewBox="0 0 100 100">
      <g className="stroke">{icons[name] || icons.gear}</g>
    </svg>
  )
}
