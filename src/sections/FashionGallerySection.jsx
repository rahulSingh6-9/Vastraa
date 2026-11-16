import whiteShirtEditorial from '../assets/design-img/woman-with-white-shirt-black-pants-is-kneeling-floor-1_1134599-1745.jpg'
import leatherJacketEditorial from '../assets/design-img/stylish-fashion-model-in-leather-jacket-and-jeans-with-dark-green-background-lifestyle-portrait-classic-leather-look-trendy-males-fashion-free-photo.jpg'
import tailoredLookEditorial from '../assets/design-img/Chicago-Fashion-Photographer-for-Male-Models-Kenneth-0666-720x900.jpg'
import monochromeLeatherEditorial from '../assets/design-img/c67ad8a0e57d9d87e4503a0205c2ac5e.jpg'
import neutralStyleEditorial from '../assets/design-img/b5ac7f0cc87194b29633d409150fc40a.jpg'
import whiteSuitEditorial from '../assets/design-img/3a5693cdcf61825f3d43e429d9461597.jpg'

const galleryImages = [
  { src: whiteShirtEditorial, alt: 'Model in a white shirt and black trousers', aspectRatio: 626 / 626 },
  { src: leatherJacketEditorial, alt: 'Model wearing a leather jacket against a deep green backdrop', aspectRatio: 2940 / 1960 },
  { src: tailoredLookEditorial, alt: 'Model in a tailored jacket and denim', aspectRatio: 720 / 645 },
  { src: monochromeLeatherEditorial, alt: 'Monochrome portrait in a leather jacket', aspectRatio: 1920 / 1951 },
  { src: neutralStyleEditorial, alt: 'Model in a relaxed neutral-toned outfit', aspectRatio: 711 / 835 },
  { src: whiteSuitEditorial, alt: 'Model in a crisp white suit', aspectRatio: 590 / 414 },
]

function FashionGallerySection() {
  return (
    <section className="fashion-gallery section-pad" aria-label="VASTRAA fashion editorial images">
      <div className="fashion-gallery__track" data-reveal-stagger>
        {galleryImages.map((image) => (
          <figure
            className="fashion-gallery__image"
            key={image.src}
            data-reveal-item
            style={{ flexGrow: image.aspectRatio }}
          >
            <img src={image.src} alt={image.alt} draggable="false" loading="lazy" />
          </figure>
        ))}
      </div>
    </section>
  )
}

export default FashionGallerySection
