import image1Dress from '../assets/models/1dress.jpg'
import image1Model from '../assets/models/1model.jpg'
import image2Dress from '../assets/models/2dress.jpg'
import image2Model from '../assets/models/2model.jpg'
import image3Dress from '../assets/models/3dress.jpg'
import image3Model from '../assets/models/3model.jpg'
import image4Dress from '../assets/models/4dress.jpg'
import image4Model from '../assets/models/4model.jpg'
import image6Dress from '../assets/models/6dress.jpg'
import image6Model from '../assets/models/6model.jpg'
import image7Dress from '../assets/models/7dress.jpg'
import image7Model from '../assets/models/7model.jpg'
import image8Dress from '../assets/models/8dress.jpg'
import image8Model from '../assets/models/8model.jpg'
import { getMenAsset } from './menAssets.js'

const menOvershirtOlive = getMenAsset('vjiotm1776418403191.jpg')
const menOvershirtStone = getMenAsset('5dbdec14ad936db33ef0fcfe765dc42a.jpg')
const menTrouserBlack = getMenAsset('eed84bd309ec773f95a32bb9c1076b5a.jpg')
const menTrouserKhaki = getMenAsset('a85eba2a944105dd59fa793b3131f436.jpg')
const menJacketTobacco = getMenAsset('id-9-Men-Leather-Puffer-Bomber-Jacket-front.webp')
const menJacketInk = getMenAsset('MA-1-black-military-bomber-flight-jacket-0-1.webp')

const unsplash = (id, width = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`

export const products = [
  {
    id: 'vs-001',
    name: 'The Sunday Shirt',
    slug: 'the-sunday-shirt',
    category: 'Shirts',
    gender: 'women',
    description: 'An easy, airy cotton shirt with a relaxed shape and considered details.',
    price: 2490,
    originalPrice: 2990,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [{ name: 'Ecru', value: '#e8e1d4' }, { name: 'Ink', value: '#262827' }],
    cardImages: [image1Dress, image1Model],
    images: [
      unsplash('photo-1598554747436-c9293d6a588f'),
      unsplash('photo-1529139574466-a303027c1d8b'),
    ],
    rating: 4.8,
    reviewCount: 34,
    reviews: [{ name: 'Aanya', rating: 5, text: 'Soft, easy to style, and lovely quality.' }],
    stock: 18,
    featured: true,
    newArrival: true,
    sale: false,
  },
  {
    id: 'vs-002',
    name: 'After Hours Dress',
    slug: 'after-hours-dress',
    category: 'Dresses',
    gender: 'women',
    description: 'A fluid satin midi dress made for late dinners and long evenings.',
    price: 4890,
    originalPrice: 4890,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Midnight', value: '#252632' }, { name: 'Wine', value: '#713d45' }],
    cardImages: [image2Dress, image2Model],
    images: [
      unsplash('photo-1566174053879-31528523f8ae'),
      unsplash('photo-1539109136881-3be0616acf4b'),
    ],
    rating: 4.9,
    reviewCount: 21,
    reviews: [{ name: 'Meera', rating: 5, text: 'Beautiful movement and a very flattering fit.' }],
    stock: 9,
    featured: true,
    newArrival: true,
    sale: false,
  },
  {
    id: 'vs-003',
    name: 'The Longline Layer',
    slug: 'the-longline-layer',
    category: 'Outerwear',
    gender: 'women',
    description: 'Softly structured outerwear in a versatile sand tone.',
    price: 4290,
    originalPrice: 5290,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Sand', value: '#b5a48b' }, { name: 'Moss', value: '#646956' }],
    cardImages: [image3Dress, image3Model],
    images: [
      unsplash('photo-1591047139829-d91aecb6caea'),
      unsplash('photo-1490481651871-ab68de25d43d'),
    ],
    rating: 4.7,
    reviewCount: 17,
    reviews: [{ name: 'Riya', rating: 5, text: 'A great throw-on layer that still looks polished.' }],
    stock: 12,
    featured: true,
    newArrival: false,
    sale: true,
  },
  {
    id: 'vs-004',
    name: 'Sunday State of Mind',
    slug: 'sunday-state-of-mind-knit',
    category: 'Knitwear',
    gender: 'women',
    description: 'A soft-touch knit made for slow starts and everyday layering.',
    price: 3290,
    originalPrice: 3290,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [{ name: 'Oat', value: '#d8d0c0' }, { name: 'Charcoal', value: '#474743' }],
    cardImages: [image4Dress, image4Model],
    images: [
      unsplash('photo-1618932260643-eee4a2f652a6'),
      unsplash('photo-1483985988355-763728e1935b'),
    ],
    rating: 4.6,
    reviewCount: 12,
    reviews: [{ name: 'Tara', rating: 5, text: 'The knit is soft and the shape is just right.' }],
    stock: 15,
    featured: true,
    newArrival: true,
    sale: false,
  },
  {
    id: 'vs-005',
    name: 'The Modern Overshirt',
    slug: 'modern-overshirt',
    category: 'Shirts',
    gender: 'men',
    description: 'A versatile, structured overshirt that works as a light layer.',
    price: 3490,
    originalPrice: 3990,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Olive', value: '#6f725c', images: [menOvershirtOlive] },
      { name: 'Stone', value: '#bdb8ad', images: [menOvershirtStone] },
    ],
    cardImages: [menOvershirtOlive, menOvershirtStone],
    rating: 4.7,
    reviewCount: 19,
    reviews: [{ name: 'Kabir', rating: 5, text: 'Great weight and a relaxed fit.' }],
    stock: 14,
    featured: true,
    newArrival: true,
    sale: false,
  },
  {
    id: 'vs-006',
    name: 'Everyday Straight Trouser',
    slug: 'everyday-straight-trouser',
    category: 'Trousers',
    gender: 'men',
    description: 'Clean, straight-leg trousers with an easy all-day feel.',
    price: 2990,
    originalPrice: 2990,
    sizes: ['30', '32', '34', '36', '38'],
    colors: [
      { name: 'Black', value: '#292927', images: [menTrouserBlack] },
      { name: 'Khaki', value: '#a99d83', images: [menTrouserKhaki] },
    ],
    cardImages: [menTrouserBlack, menTrouserKhaki],
    rating: 4.5,
    reviewCount: 11,
    reviews: [{ name: 'Arjun', rating: 4, text: 'Comfortable and easy to dress up.' }],
    stock: 20,
    featured: false,
    newArrival: false,
    sale: false,
  },
  {
    id: 'vs-007',
    name: 'The Everyday Tee',
    slug: 'the-everyday-tee',
    category: 'Tops',
    gender: 'unisex',
    description: 'A substantial cotton tee with a clean neckline and relaxed fit.',
    price: 1490,
    originalPrice: 1790,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'White', value: '#f0eee7' }, { name: 'Black', value: '#222220' }],
    cardImages: [image6Dress, image6Model],
    images: [
      unsplash('photo-1521572163474-6864f9cf17ab'),
      unsplash('photo-1503342217505-b0a15ec3261c'),
    ],
    rating: 4.8,
    reviewCount: 42,
    reviews: [{ name: 'Nikhil', rating: 5, text: 'The perfect everyday tee, especially for layering.' }],
    stock: 31,
    featured: true,
    newArrival: false,
    sale: true,
  },
  {
    id: 'vs-008',
    name: 'The Weekend Jacket',
    slug: 'the-weekend-jacket',
    category: 'Outerwear',
    gender: 'men',
    description: 'A relaxed jacket with a refined profile and practical pockets.',
    price: 5490,
    originalPrice: 6490,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Tobacco', value: '#806750', images: [menJacketTobacco] },
      { name: 'Ink', value: '#30343a', images: [menJacketInk] },
    ],
    cardImages: [menJacketTobacco, menJacketInk],
    rating: 4.6,
    reviewCount: 9,
    reviews: [{ name: 'Dev', rating: 5, text: 'Easy to layer and feels thoughtfully made.' }],
    stock: 7,
    featured: false,
    newArrival: true,
    sale: true,
  },
  {
    id: 'vs-009',
    name: 'The Pleat Front Skirt',
    slug: 'pleat-front-skirt',
    category: 'Skirts',
    gender: 'women',
    description: 'A softly structured midi skirt with movement and an easy waist.',
    price: 2890,
    originalPrice: 2890,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Black', value: '#272725' }, { name: 'Clay', value: '#a76f5a' }],
    cardImages: [image7Dress, image7Model],
    images: [
      unsplash('photo-1583496661160-fb5886a0aaaa'),
      unsplash('photo-1490481651871-ab68de25d43d'),
    ],
    rating: 4.7,
    reviewCount: 14,
    reviews: [{ name: 'Ira', rating: 5, text: 'The fabric falls beautifully and is easy to style.' }],
    stock: 10,
    featured: true,
    newArrival: true,
    sale: false,
  },
  {
    id: 'vs-010',
    name: 'Soft Tailored Blazer',
    slug: 'soft-tailored-blazer',
    category: 'Outerwear',
    gender: 'unisex',
    description: 'Relaxed tailoring in a light fabric that works across seasons.',
    price: 5990,
    originalPrice: 6990,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Stone', value: '#c4bbac' }, { name: 'Navy', value: '#343a47' }],
    cardImages: [image8Dress, image8Model],
    images: [
      unsplash('photo-1591369822096-ffd140ec948f'),
      unsplash('photo-1591047139829-d91aecb6caea'),
    ],
    rating: 4.8,
    reviewCount: 26,
    reviews: [{ name: 'Ananya', rating: 5, text: 'Polished without feeling stiff.' }],
    stock: 8,
    featured: true,
    newArrival: false,
    sale: true,
  },
]

export const getProductBySlug = (slug) =>
  products.find((product) => product.slug === slug)

export const getProductImages = (product, colorName = product?.colors?.[0]?.name) => {
  const colorImages = product?.colors?.find((color) => color.name === colorName)?.images
  return colorImages?.length ? colorImages : product?.images || []
}
