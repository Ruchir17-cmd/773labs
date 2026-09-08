// Seed catalog. Add more objects to this array to grow the shop —
// nothing else in the app needs to change. `image` uses an asset from
// public when available; otherwise `icon` renders the line-art fallback.

export const CATEGORIES = [
  'Mechanical Parts & Brackets',
  'Miniatures & Collectibles',
  'Cosplay & Props',
  'Drone & RC Parts',
  'Home & Decor',
  'Architecture Models',
  'Assistive Aids',
  'Custom Enclosures & Mounts',
  'Characters',
  'Weapons',
]

export const PRODUCTS = [
  // Mechanical Parts & Brackets
  { id: 'mp-01', name: 'Gearbox Housing v2', category: 'Mechanical Parts & Brackets', material: 'PETG', layerHeight: '0.16mm', printTime: '6h', price: 'From ₹799', icon: 'gear', image: '/Gearbox Housing v2.jpg' },
  { id: 'mp-02', name: 'M8 Cable Clip Set', category: 'Mechanical Parts & Brackets', material: 'PLA', layerHeight: '0.2mm', printTime: '1h', price: 'From ₹149', icon: 'bracket', image: '/M8 Cable Clip Set.jpg' },
  { id: 'mp-03', name: 'Adjustable Phone Mount', category: 'Mechanical Parts & Brackets', material: 'PETG', layerHeight: '0.2mm', printTime: '3h', price: 'From ₹349', icon: 'bracket', image: '/Adjustable Phone Mount.jpg' },
  { id: 'mp-04', name: 'Bearing Puller Tool', category: 'Mechanical Parts & Brackets', material: 'Nylon', layerHeight: '0.16mm', printTime: '4h', price: 'From ₹599', icon: 'gear', image: '/Bearing Puller Tool.jpg' },
  { id: 'mp-05', name: 'Camera Tripod Adapter', category: 'Mechanical Parts & Brackets', material: 'PETG', layerHeight: '0.16mm', printTime: '2h', price: 'From ₹299', icon: 'bracket', image: '/Camera Tripod Adapter.jpg' },
  { id: 'mp-06', name: 'Modular Tool Rack Bracket', category: 'Mechanical Parts & Brackets', material: 'PLA', layerHeight: '0.2mm', printTime: '3h', price: 'From ₹399', icon: 'bracket', image: '/Modular Tool Rack Bracket.jpg' },

  // Miniatures & Collectibles
  { id: 'mc-01', name: 'Articulated Dragon Figure', category: 'Miniatures & Collectibles', material: 'Resin', layerHeight: '0.05mm', printTime: '9h', price: 'From ₹899', icon: 'mini', image: '/dragon.jpg' },
  { id: 'mc-02', name: 'Fantasy Wizard Miniature (32mm)', category: 'Miniatures & Collectibles', material: 'Resin', layerHeight: '0.03mm', printTime: '2h', price: 'From ₹249', icon: 'mini', image: '/Fantasy Wizard Miniature (32mm).jpg' },
  { id: 'mc-03', name: 'Chess Set — Modern Geometric', category: 'Miniatures & Collectibles', material: 'PLA', layerHeight: '0.12mm', printTime: '10h', price: 'From ₹1,499', icon: 'mini', image: '/Chess Set — Modern Geometric.jpg' },
  { id: 'mc-04', name: 'Sci-Fi Mech Miniature', category: 'Miniatures & Collectibles', material: 'Resin', layerHeight: '0.05mm', printTime: '3h', price: 'From ₹399', icon: 'mini', image: '/Sci-Fi Mech Miniature.jpg' },
  { id: 'mc-05', name: 'Tabletop Terrain Ruins Set', category: 'Miniatures & Collectibles', material: 'PLA', layerHeight: '0.16mm', printTime: '8h', price: 'From ₹999', icon: 'building', image: '/Tabletop Terrain Ruins Set.jpg' },
  { id: 'mc-06', name: 'Collectible Bust — Warrior', category: 'Miniatures & Collectibles', material: 'Resin', layerHeight: '0.05mm', printTime: '6h', price: 'From ₹799', icon: 'mini', image: '/Collectible Bust — Warrior.jpg' },

  // Cosplay & Props
  { id: 'cp-01', name: 'Full-Face Helmet Shell', category: 'Cosplay & Props', material: 'ABS', layerHeight: '0.2mm', printTime: '14h', price: 'From ₹2,999', icon: 'helmet', image: '/helmet.jpg' },
  { id: 'cp-02', name: 'Foam-Core Shoulder Armor', category: 'Cosplay & Props', material: 'PETG', layerHeight: '0.2mm', printTime: '7h', price: 'From ₹1,299', icon: 'helmet', image: '/Foam-Core Shoulder Armor.jpg' },
  { id: 'cp-03', name: 'Prop Sword Hilt', category: 'Cosplay & Props', material: 'PLA', layerHeight: '0.16mm', printTime: '5h', price: 'From ₹899', icon: 'vase', image: '/Prop Sword Hilt.jpg' },
  { id: 'cp-04', name: 'Sci-Fi Blaster Frame', category: 'Cosplay & Props', material: 'ABS', layerHeight: '0.2mm', printTime: '11h', price: 'From ₹2,199', icon: 'gear', image: '/Sci-Fi Blaster Frame.jpg' },
  { id: 'cp-05', name: 'Character Mask Base', category: 'Cosplay & Props', material: 'PETG', layerHeight: '0.16mm', printTime: '6h', price: 'From ₹1,099', icon: 'helmet', image: '/Character Mask Base.jpg' },
  { id: 'cp-06', name: 'Gauntlet Armor Set', category: 'Cosplay & Props', material: 'PLA', layerHeight: '0.2mm', printTime: '9h', price: 'From ₹1,799', icon: 'helmet', image: '/Gauntlet Armor Set.jpg' },

  // Drone & RC Parts
  { id: 'dr-01', name: 'FPV Drone Frame X220', category: 'Drone & RC Parts', material: 'Carbon-fill Nylon', layerHeight: '0.2mm', printTime: '4h', price: 'From ₹1,199', icon: 'drone', image: '/FPV Drone Frame X220.jpg' },
  { id: 'dr-02', name: 'Propeller Guard Set', category: 'Drone & RC Parts', material: 'TPU', layerHeight: '0.2mm', printTime: '2h', price: 'From ₹399', icon: 'drone', image: '/Propeller Guard Set.jpg' },
  { id: 'dr-03', name: 'RC Car Chassis Mount', category: 'Drone & RC Parts', material: 'PETG', layerHeight: '0.16mm', printTime: '3h', price: 'From ₹499', icon: 'bracket', image: '/RC Car Chassis Mount.jpg' },
  { id: 'dr-04', name: 'Camera Gimbal Bracket', category: 'Drone & RC Parts', material: 'PETG', layerHeight: '0.12mm', printTime: '3h', price: 'From ₹549', icon: 'bracket', image: '/Camera Gimbal Bracket.jpg' },
  { id: 'dr-05', name: 'Battery Strap Clip', category: 'Drone & RC Parts', material: 'TPU', layerHeight: '0.2mm', printTime: '1h', price: 'From ₹149', icon: 'drone' },
  { id: 'dr-06', name: 'Landing Gear Skids', category: 'Drone & RC Parts', material: 'Nylon', layerHeight: '0.2mm', printTime: '2h', price: 'From ₹349', icon: 'drone', image: '/Landing Gear Skids.jpg' },

  // Home & Decor
  { id: 'hd-01', name: 'Sculptural Single-Wall Vase', category: 'Home & Decor', material: 'Silk PLA', layerHeight: '0.28mm', printTime: '5h', price: 'From ₹599', icon: 'vase', image: '/Sculptural Single-Wall Vase.jpg' },
  { id: 'hd-02', name: 'Geometric Wall Planter', category: 'Home & Decor', material: 'PLA', layerHeight: '0.2mm', printTime: '4h', price: 'From ₹449', icon: 'vase', image: '/Geometric Wall Planter.jpg' },
  { id: 'hd-03', name: 'Modular Desk Organizer', category: 'Home & Decor', material: 'PETG', layerHeight: '0.2mm', printTime: '6h', price: 'From ₹699', icon: 'bracket', image: '/Modular Desk Organizer.jpg' },
  { id: 'hd-04', name: 'Articulated Lamp Shade', category: 'Home & Decor', material: 'PLA', layerHeight: '0.16mm', printTime: '7h', price: 'From ₹899', icon: 'vase', image: '/Articulated Lamp Shade.jpg' },
  { id: 'hd-05', name: 'Coaster Set — Wave Pattern', category: 'Home & Decor', material: 'Silk PLA', layerHeight: '0.2mm', printTime: '2h', price: 'From ₹299', icon: 'vase', image: '/Coaster Set — Wave Pattern.jpg' },
  { id: 'hd-06', name: 'Minimalist Candle Holder', category: 'Home & Decor', material: 'PLA', layerHeight: '0.16mm', printTime: '3h', price: 'From ₹349', icon: 'vase', image: '/Minimalist Candle Holder.jpg' },

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

  // Characters (Movies & TV)
  { id: 'ch-01', name: 'Superman', category: 'Characters', material: 'Resin', layerHeight: '0.05mm', printTime: '8h', price: 'From ₹1,299', icon: 'mini' },
  { id: 'ch-02', name: 'Iron Man', category: 'Characters', material: 'Resin', layerHeight: '0.05mm', printTime: '6h', price: 'From ₹999', icon: 'helmet' },
  { id: 'ch-03', name: 'Batman', category: 'Characters', material: 'Resin', layerHeight: '0.03mm', printTime: '9h', price: 'From ₹1,199', icon: 'mini' },
  { id: 'ch-04', name: 'Spider-Man', category: 'Characters', material: 'Resin', layerHeight: '0.05mm', printTime: '10h', price: 'From ₹1,499', icon: 'mini' },
  { id: 'ch-05', name: 'Gandalf', category: 'Characters', material: 'PLA', layerHeight: '0.12mm', printTime: '4h', price: 'From ₹599', icon: 'mini' },

  // Featured product
  { id: 'sp-01', name: 'Black Spider-Man Headphone Holder', category: 'Home & Decor', material: 'PLA', layerHeight: '0.16mm', printTime: '10h', price: '₹3,000', icon: 'helmet', image: '/spiderman head black new.jpg', gallery: ['/spiderman head black new.jpg', '/fr.jpeg', '/fs.jpeg'], offer: { label: 'OpenCode Go included', description: 'Premium AI coding models included with your purchase.', models: ['GPT-5.6 Luna', 'DeepSeek V4 Pro', 'Grok', 'Qwen', 'Kimi'] } },

  // Weapons (Movies & TV)
  { id: 'wp-01', name: 'Mjolnir — Thor\u2019s Hammer', category: 'Weapons', material: 'PLA', layerHeight: '0.16mm', printTime: '12h', price: 'From ₹1,799', icon: 'gear' },
  { id: 'wp-02', name: 'Captain America\u2019s Shield', category: 'Weapons', material: 'PLA', layerHeight: '0.2mm', printTime: '14h', price: 'From ₹2,499', icon: 'helmet' },
  { id: 'wp-03', name: 'Lightsaber Hilt — Skywalker', category: 'Weapons', material: 'Resin', layerHeight: '0.1mm', printTime: '8h', price: 'From ₹1,499', icon: 'vase' },
  { id: 'wp-04', name: 'Stormbreaker Axe', category: 'Weapons', material: 'PETG', layerHeight: '0.16mm', printTime: '16h', price: 'From ₹2,999', icon: 'bracket' },
  { id: 'wp-05', name: 'Wolverine Claws (Pair)', category: 'Weapons', material: 'ABS', layerHeight: '0.16mm', printTime: '6h', price: 'From ₹999', icon: 'grip' },

  // From Maker's World
  { id: 'mw-01', name: 'Articulated Crystal Dragon', category: 'Miniatures & Collectibles', material: 'PLA', layerHeight: '0.2mm', printTime: '5h', price: 'From ₹699', icon: 'mini', image: '/Articulated Crystal Dragon.jpg' },
  { id: 'mw-02', name: 'Flexi Articulated Axolotl', category: 'Miniatures & Collectibles', material: 'PLA', layerHeight: '0.16mm', printTime: '3h', price: 'From ₹449', icon: 'mini', image: '/Flexi Articulated Axolotl.jpg' },
  { id: 'mw-03', name: 'Infinite Fidget Cube', category: 'Miniatures & Collectibles', material: 'PETG', layerHeight: '0.16mm', printTime: '2h', price: 'From ₹249', icon: 'grip', image: '/Infinite Fidget Cube.jpg' },
  { id: 'mw-04', name: 'Hexagon Wall Planter Set', category: 'Home & Decor', material: 'PLA', layerHeight: '0.2mm', printTime: '6h', price: 'From ₹599', icon: 'vase', image: '/Hexagon Wall Planter Set.jpg' },
  { id: 'mw-05', name: 'Moon Lamp Lithophane', category: 'Home & Decor', material: 'PLA', layerHeight: '0.12mm', printTime: '9h', price: 'From ₹1,099', icon: 'vase', image: '/Moon Lamp Lithophane.jpg' },
  { id: 'mw-06', name: 'Headphone Stand — Curve', category: 'Custom Enclosures & Mounts', material: 'PETG', layerHeight: '0.2mm', printTime: '5h', price: 'From ₹499', icon: 'bracket' },
  { id: 'mw-07', name: 'Foldable Phone Stand', category: 'Mechanical Parts & Brackets', material: 'PLA', layerHeight: '0.2mm', printTime: '1h', price: 'From ₹199', icon: 'bracket', image: '/foldable phone mount.jpg' },
  { id: 'mw-08', name: 'Dragon Dice Tower', category: 'Miniatures & Collectibles', material: 'PLA', layerHeight: '0.16mm', printTime: '8h', price: 'From ₹899', icon: 'building', image: '/Dragon Dice Tower.jpg' },
]

// The two designs shown on the homepage — pick any two ids from PRODUCTS.
export const FEATURED_IDS = ['sp-01', 'cp-01']
