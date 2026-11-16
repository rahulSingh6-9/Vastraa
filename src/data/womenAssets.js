const womenImageUrls = import.meta.glob('../assets/women/*', {
  eager: true,
  query: '?url',
  import: 'default',
})

export const getWomenAsset = (fileName) => {
  const imageUrl = womenImageUrls[`../assets/women/${fileName}`]
  if (!imageUrl) {
    throw new Error(`Missing Women's collection image: ${fileName}`)
  }
  return imageUrl
}

const imageGroups = [
  { id: 'satin-cowl-blouse', name: 'Satin Cowl-Neck Blouse', category: 'Tops', files: ['XIAOCHA-Women-Silky-Satin-Cowl-Neck-Blouse-Sleeveless-Draped-Design-Elegant-Office-Daily-Top_2587cf3c-21c3-4fe7-a906-39ab7b0709ea.8b73e472726f3f4bb58acf949125ca8f.avif'] },
  { id: 'blue-wrap-dress', name: 'Blue Wrap Dress', category: 'Dresses', files: ['OIP.webp'] },
  { id: 'red-checked-shirt', name: 'Red Checked Shirt', category: 'Shirts', files: ['iIQAmUgc_7f3186b21e0a4446b80500ad9ee7d056.jpg'] },
  { id: 'pink-checked-shirt', name: 'Pink Checked Shirt', category: 'Shirts', files: ['woman-8228723_1280.jpg'] },
  { id: 'watermelon-halter-top', name: 'Watermelon Halter Top', category: 'Tops', files: ['Shiusina-Women-Sexy-Halter-Drape-Cowl-Neck-Tank-Blouse-Backless-Sleeveless-Vest-Tops-Watermelon-red-S_e0e28ded-41dd-4de9-b7f4-9a7dc6c86a41.578b2bb0d913b2f7c30ea45911472bbc.avif'] },
  { id: 'white-t-shirt', name: 'White T-Shirt', category: 'Tops', files: ['hanging-woman-t-shirt-mockup-2.jpg'] },
  { id: 'cropped-leather-jacket', name: 'Cropped Leather Jacket', category: 'Outerwear', files: ['il_800x800.7234737513_2xw8.webp'] },
  { id: 'black-puffer-jacket', name: 'Black Puffer Jacket', category: 'Outerwear', files: ['9f0809bc17aebe0c65d19e789fb3d914.jpg'] },
  { id: 'sleeveless-brown-top', name: 'Sleeveless Brown Top', category: 'Tops', files: ['99b5c64bd7911d7230960ffe4bc355ef.jpg'] },
  { id: 'white-tank-wide-leg-trousers', name: 'White Tank & Wide-Leg Trousers', category: 'Outfits', files: ['13782922-ac24-4de8-b06a-138e813e3c28.webp'] },
]

const groupedFiles = new Set(imageGroups.flatMap((group) => group.files))
const fallbackGroups = Object.keys(womenImageUrls)
  .map((path) => path.split('/').pop())
  .filter((fileName) => !groupedFiles.has(fileName))
  .map((fileName) => ({
    id: fileName,
    name: fileName.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' '),
    category: 'Women',
    files: [fileName],
  }))

export const womenAssetProducts = [...imageGroups, ...fallbackGroups].map((group) => ({
  ...group,
  images: group.files.map(getWomenAsset),
}))

export const getWomenAssetProductById = (id) =>
  womenAssetProducts.find((product) => product.id === id)
