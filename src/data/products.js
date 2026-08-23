// Seed catalog. Add more objects to this array to grow the shop —
// nothing else in the app needs to change. `icon` controls which
// line-art illustration renders on the card (see src/components/Icon.jsx).

export const CATEGORIES = [
  'Mechanical Parts & Brackets',
  'Miniatures & Collectibles',
  'Cosplay & Props',
  'Drone & RC Parts',
  'Home & Decor',
  'Architecture Models',
  'Assistive Aids',
  'Custom Enclosures & Mounts',
]

export const PRODUCTS = [
  // Mechanical Parts & Brackets
  { id: 'mp-01', name: 'Gearbox Housing v2', category: 'Mechanical Parts & Brackets', material: 'PETG', layerHeight: '0.16mm', printTime: '6h', price: 'From ₹799', icon: 'gear' },
  { id: 'mp-02', name: 'M8 Cable Clip Set', category: 'Mechanical Parts & Brackets', material: 'PLA', layerHeight: '0.2mm', printTime: '1h', price: 'From ₹149', icon: 'bracket' },
  { id: 'mp-03', name: 'Adjustable Phone Mount', category: 'Mechanical Parts & Brackets', material: 'PETG', layerHeight: '0.2mm', printTime: '3h', price: 'From ₹349', icon: 'bracket' },
  { id: 'mp-04', name: 'Bearing Puller Tool', category: 'Mechanical Parts & Brackets', material: 'Nylon', layerHeight: '0.16mm', printTime: '4h', price: 'From ₹599', icon: 'gear' },
  { id: 'mp-05', name: 'Camera Tripod Adapter', category: 'Mechanical Parts & Brackets', material: 'PETG', layerHeight: '0.16mm', printTime: '2h', price: 'From ₹299', icon: 'bracket' },
  { id: 'mp-06', name: 'Modular Tool Rack Bracket', category: 'Mechanical Parts & Brackets', material: 'PLA', layerHeight: '0.2mm', printTime: '3h', price: 'From ₹399', icon: 'bracket' },

  // Miniatures & Collectibles
  { id: 'mc-01', name: 'Articulated Dragon Figure', category: 'Miniatures & Collectibles', material: 'Resin', layerHeight: '0.05mm', printTime: '9h', price: 'From ₹899', icon: 'mini', image: '/dragon.jpg' },
  { id: 'mc-02', name: 'Fantasy Wizard Miniature (32mm)', category: 'Miniatures & Collectibles', material: 'Resin', layerHeight: '0.03mm', printTime: '2h', price: 'From ₹249', icon: 'mini' },
  { id: 'mc-03', name: 'Chess Set — Modern Geometric', category: 'Miniatures & Collectibles', material: 'PLA', layerHeight: '0.12mm', printTime: '10h', price: 'From ₹1,499', icon: 'mini' },
  { id: 'mc-04', name: 'Sci-Fi Mech Miniature', category: 'Miniatures & Collectibles', material: 'Resin', layerHeight: '0.05mm', printTime: '3h', price: 'From ₹399', icon: 'mini' },
  { id: 'mc-05', name: 'Tabletop Terrain Ruins Set', category: 'Miniatures & Collectibles', material: 'PLA', layerHeight: '0.16mm', printTime: '8h', price: 'From ₹999', icon: 'building' },
  { id: 'mc-06', name: 'Collectible Bust — Warrior', category: 'Miniatures & Collectibles', material: 'Resin', layerHeight: '0.05mm', printTime: '6h', price: 'From ₹799', icon: 'mini' },

  // Cosplay & Props
  { id: 'cp-01', name: 'Full-Face Helmet Shell', category: 'Cosplay & Props', material: 'ABS', layerHeight: '0.2mm', printTime: '14h', price: 'From ₹2,999', icon: 'helmet', image: '/helmet.jpg' },
  { id: 'cp-02', name: 'Foam-Core Shoulder Armor', category: 'Cosplay & Props', material: 'PETG', layerHeight: '0.2mm', printTime: '7h', price: 'From ₹1,299', icon: 'helmet' },
  { id: 'cp-03', name: 'Prop Sword Hilt', category: 'Cosplay & Props', material: 'PLA', layerHeight: '0.16mm', printTime: '5h', price: 'From ₹899', icon: 'vase' },
  { id: 'cp-04', name: 'Sci-Fi Blaster Frame', category: 'Cosplay & Props', material: 'ABS', layerHeight: '0.2mm', printTime: '11h', price: 'From ₹2,199', icon: 'gear' },
  { id: 'cp-05', name: 'Character Mask Base', category: 'Cosplay & Props', material: 'PETG', layerHeight: '0.16mm', printTime: '6h', price: 'From ₹1,099', icon: 'helmet' },
  { id: 'cp-06', name: 'Gauntlet Armor Set', category: 'Cosplay & Props', material: 'PLA', layerHeight: '0.2mm', printTime: '9h', price: 'From ₹1,799', icon: 'helmet' },

  // Drone & RC Parts
  { id: 'dr-01', name: 'FPV Drone Frame X220', category: 'Drone & RC Parts', material: 'Carbon-fill Nylon', layerHeight: '0.2mm', printTime: '4h', price: 'From ₹1,199', icon: 'drone' },
  { id: 'dr-02', name: 'Propeller Guard Set', category: 'Drone & RC Parts', material: 'TPU', layerHeight: '0.2mm', printTime: '2h', price: 'From ₹399', icon: 'drone' },
  { id: 'dr-03', name: 'RC Car Chassis Mount', category: 'Drone & RC Parts', material: 'PETG', layerHeight: '0.16mm', printTime: '3h', price: 'From ₹499', icon: 'bracket' },
  { id: 'dr-04', name: 'Camera Gimbal Bracket', category: 'Drone & RC Parts', material: 'PETG', layerHeight: '0.12mm', printTime: '3h', price: 'From ₹549', icon: 'bracket' },
  { id: 'dr-05', name: 'Battery Strap Clip', category: 'Drone & RC Parts', material: 'TPU', layerHeight: '0.2mm', printTime: '1h', price: 'From ₹149', icon: 'drone' },
  { id: 'dr-06', name: 'Landing Gear Skids', category: 'Drone & RC Parts', material: 'Nylon', layerHeight: '0.2mm', printTime: '2h', price: 'From ₹349', icon: 'drone' },

  // Home & Decor
  { id: 'hd-01', name: 'Sculptural Single-Wall Vase', category: 'Home & Decor', material: 'Silk PLA', layerHeight: '0.28mm', printTime: '5h', price: 'From ₹599', icon: 'vase' },
  { id: 'hd-02', name: 'Geometric Wall Planter', category: 'Home & Decor', material: 'PLA', layerHeight: '0.2mm', printTime: '4h', price: 'From ₹449', icon: 'vase' },
  { id: 'hd-03', name: 'Modular Desk Organizer', category: 'Home & Decor', material: 'PETG', layerHeight: '0.2mm', printTime: '6h', price: 'From ₹699', icon: 'bracket' },
  { id: 'hd-04', name: 'Articulated Lamp Shade', category: 'Home & Decor', material: 'PLA', layerHeight: '0.16mm', printTime: '7h', price: 'From ₹899', icon: 'vase' },
  { id: 'hd-05', name: 'Coaster Set — Wave Pattern', category: 'Home & Decor', material: 'Silk PLA', layerHeight: '0.2mm', printTime: '2h', price: 'From ₹299', icon: 'vase' },
  { id: 'hd-06', name: 'Minimalist Candle Holder', category: 'Home & Decor', material: 'PLA', layerHeight: '0.16mm', printTime: '3h', price: 'From ₹349', icon: 'vase' },

  // Architecture Models
  { id: 'am-01', name: 'Massing Study Model', category: 'Architecture Models', material: 'PLA', layerHeight: '0.12mm', printTime: '9h', price: 'From ₹1,499', icon: 'building' },
  { id: 'am-02', name: 'Site Plan Base Plate', category: 'Architecture Models', material: 'PLA', layerHeight: '0.16mm', printTime: '5h', price: 'From ₹999', icon: 'building' },
  { id: 'am-03', name: 'Facade Detail Sample', category: 'Architecture Models', material: 'PETG', layerHeight: '0.1mm', printTime: '4h', price: 'From ₹799', icon: 'building' },
  { id: 'am-04', name: 'Staircase Study Model', category: 'Architecture Models', material: 'PLA', layerHeight: '0.12mm', printTime: '6h', price: 'From ₹1,199', icon: 'building' },
  { id: 'am-05', name: 'Modular Housing Block Set', category: 'Architecture Models', material: 'PLA', layerHeight: '0.16mm', printTime: '12h', price: 'From ₹2,499', icon: 'building' },
  { id: 'am-06', name: 'Landscape Contour Model', category: 'Architecture Models', material: 'PLA', layerHeight: '0.2mm', printTime: '8h', price: 'From ₹1,799', icon: 'building' },

  // Assistive Aids
  { id: 'aa-01', name: 'Articulated Grip Test Piece', category: 'Assistive Aids', material: 'TPU', layerHeight: '0.2mm', printTime: '7h', price: 'From ₹699', icon: 'grip' },
  { id: 'aa-02', name: 'Jar Opener Aid', category: 'Assistive Aids', material: 'PETG', layerHeight: '0.2mm', printTime: '2h', price: 'From ₹249', icon: 'grip' },
  { id: 'aa-03', name: 'Adjustable Wrist Splint Shell', category: 'Assistive Aids', material: 'PETG', layerHeight: '0.16mm', printTime: '4h', price: 'From ₹599', icon: 'grip' },
  { id: 'aa-04', name: 'Adaptive Utensil Handle', category: 'Assistive Aids', material: 'TPU', layerHeight: '0.2mm', printTime: '2h', price: 'From ₹299', icon: 'grip' },
  { id: 'aa-05', name: 'Door Lever Extender', category: 'Assistive Aids', material: 'PETG', layerHeight: '0.2mm', printTime: '1h', price: 'From ₹199', icon: 'bracket' },
  { id: 'aa-06', name: 'Button Hook Aid', category: 'Assistive Aids', material: 'PLA', layerHeight: '0.2mm', printTime: '1h', price: 'From ₹179', icon: 'grip' },

  // Custom Enclosures & Mounts
  { id: 'ce-01', name: 'Raspberry Pi Enclosure', category: 'Custom Enclosures & Mounts', material: 'PETG', layerHeight: '0.16mm', printTime: '3h', price: 'From ₹399', icon: 'bracket' },
  { id: 'ce-02', name: 'Wall-Mount Phone Dock', category: 'Custom Enclosures & Mounts', material: 'PLA', layerHeight: '0.2mm', printTime: '2h', price: 'From ₹299', icon: 'bracket' },
  { id: 'ce-03', name: 'Cable Management Tray', category: 'Custom Enclosures & Mounts', material: 'PETG', layerHeight: '0.2mm', printTime: '3h', price: 'From ₹349', icon: 'bracket' },
  { id: 'ce-04', name: 'Under-Desk Headphone Hook', category: 'Custom Enclosures & Mounts', material: 'PLA', layerHeight: '0.2mm', printTime: '1h', price: 'From ₹199', icon: 'bracket' },
  { id: 'ce-05', name: 'Router Wall Mount', category: 'Custom Enclosures & Mounts', material: 'PETG', layerHeight: '0.2mm', printTime: '2h', price: 'From ₹349', icon: 'bracket' },
  { id: 'ce-06', name: 'Custom PCB Enclosure', category: 'Custom Enclosures & Mounts', material: 'PETG', layerHeight: '0.16mm', printTime: '4h', price: 'From ₹549', icon: 'gear' },
]

// The two designs shown on the homepage — pick any two ids from PRODUCTS.
export const FEATURED_IDS = ['cp-01', 'mc-01']
