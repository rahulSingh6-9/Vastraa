const menImageUrls = import.meta.glob('../assets/men/*', {
  eager: true,
  query: '?url',
  import: 'default',
})

export const getMenAsset = (fileName) => {
  const imageUrl = menImageUrls[`../assets/men/${fileName}`]
  if (!imageUrl) {
    throw new Error(`Missing Men's collection image: ${fileName}`)
  }
  return imageUrl
}

const catalogImageFiles = new Set([
  'vjiotm1776418403191.jpg',
  '5dbdec14ad936db33ef0fcfe765dc42a.jpg',
  'eed84bd309ec773f95a32bb9c1076b5a.jpg',
  'a85eba2a944105dd59fa793b3131f436.jpg',
  'id-9-Men-Leather-Puffer-Bomber-Jacket-front.webp',
  'MA-1-black-military-bomber-flight-jacket-0-1.webp',
])

const imageGroups = [
  { id: 'dark-button-down', name: 'Dark Button-Down Shirt', category: 'Shirts', files: ['1.webp'] },
  { id: 'printed-navy-shirt', name: 'Printed Navy Shirt', category: 'Shirts', files: ['5ba4d5b909efcfd542e085272109dbf9.jpg'] },
  { id: 'shearling-collar-jacket', name: 'Shearling-Collar Jacket', category: 'Outerwear', files: ['81O9VmH2xvL._AC_UL1500_.jpg'] },
  { id: 'textured-green-polo', name: 'Textured Green Polo', category: 'Shirts', files: ['0402bb00-8da9-4ff0-a60d-6532b2f55527.jpg'] },
  { id: 'graphic-tee', name: 'Graphic T-Shirt', category: 'Tops', files: ['9899d8d3407763a7073b07f366a743f1.jpg'] },
  { id: 'navy-button-down', name: 'Navy Button-Down Shirt', category: 'Shirts', files: ['97041ec7-2dd7-4d8c-a0a2-7449823ec45c1721726726145-Roadster-Men-Shirts-7751721726725657-1.jpg'] },
  { id: 'olive-cargo-trousers', name: 'Olive Cargo Trousers', category: 'Trousers', files: ['1069358ff7be7220b6688dec2bcb1883.jpg'] },
  { id: 'blue-casual-shirt', name: 'Blue Casual Shirt', category: 'Shirts', files: ['Artboard60.webp'] },
  { id: 'green-pocket-shirt', name: 'Green Pocket Shirt', category: 'Shirts', files: ['Coorders-George-Men-s-Button-Down-Shirt-with-pocket-Casual-Mens-Hidden-Nit-Shirt-Green-S_816c4d98-2bfd-4b83-a468-e2ecd92f3b74.2d1319d00a650db3c4b82faf34221a1b.avif'] },
  {
    id: 'oversized-cargo-pants',
    name: 'Oversized Cargo Pants',
    category: 'Trousers',
    files: [
      "Essentials-Extreme-Men's-Oversized-Cargo-Pants.avif",
      "Essentials-Extreme-Men's-Oversized-Cargo-Pants (1).avif",
      "Essentials-Extreme-Men's-Oversized-Cargo-Pants (2).avif",
    ],
  },
  {
    id: 'relaxed-trousers',
    name: 'Relaxed Trousers',
    category: 'Trousers',
    files: ['IMG-8781_1400x.webp', 'IMG-8788_1400x.webp'],
  },
  {
    id: 'sleeveless-training-vest',
    name: 'Sleeveless Training Vest',
    category: 'Tops',
    files: ['Men-Casual-Vest-High-Elastic-Sleeveless-Sport-Tank-Top-with-Back-Printed-Muscle-Men-Gym-Vest.avif'],
  },
  { id: 'black-trousers', name: 'Black Trousers', category: 'Trousers', files: ['OIP (1).webp'] },
  { id: 'blue-short-sleeve-shirt', name: 'Blue Short-Sleeve Shirt', category: 'Shirts', files: ['OIP (2).webp'] },
  { id: 'white-tee', name: 'White T-Shirt', category: 'Tops', files: ['OIP.webp'] },
  { id: 'geometric-print-shirt', name: 'Geometric Print Shirt', category: 'Shirts', files: ['b9673a11a7b9c4f91d038dc306b3e0eb.jpg'] },
  { id: 'sage-button-down', name: 'Sage Button-Down Shirt', category: 'Shirts', files: ['bqgqsg1776243281946.jpg'] },
  { id: 'khaki-chinos', name: 'Khaki Trousers', category: 'Trousers', files: ['c8e4eb50c39b7bed205b8c6ca844f6dc.jpg'] },
  { id: 'baggie-cargo-pants', name: 'Baggie Cargo Pants', category: 'Trousers', files: ['cargo-baggie-pants-2026-01-24-6974b4e89ad09.webp'] },
  { id: 'gray-cargo-pants', name: 'Gray Cargo Pants', category: 'Trousers', files: ['cf12c704aeb55a13a9e2397cfe0d8849.png'] },
  { id: 'green-cargo-pants', name: 'Green Cargo Pants', category: 'Trousers', files: ['dcbc4059c8dcfa35716e05c62e42a2c2.jpg'] },
  { id: 'floral-print-shirt', name: 'Floral Print Shirt', category: 'Shirts', files: ['men-designer-shirt-1000x1000.webp'] },
]

const groupedFiles = new Set(imageGroups.flatMap((group) => group.files))
const allKnownFiles = new Set([...catalogImageFiles, ...groupedFiles])
const fallbackGroups = Object.keys(menImageUrls)
  .map((path) => path.split('/').pop())
  .filter((fileName) => !allKnownFiles.has(fileName))
  .map((fileName) => ({
    id: fileName,
    name: fileName.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' '),
    category: 'Men',
    files: [fileName],
  }))

export const menAssetProducts = [...imageGroups, ...fallbackGroups].map((group) => ({
  ...group,
  images: group.files.map(getMenAsset),
}))

export const getMenAssetProductById = (id) =>
  menAssetProducts.find((product) => product.id === id)
