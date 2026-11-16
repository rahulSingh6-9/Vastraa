import { Link } from 'react-router-dom'
import womensMotoJacket from '../assets/New folder/Womens-Motorcycle-Leather-Jacket-500x600.webp'
import topGunJacket from '../assets/New folder/top-gun-vegan-leather-motorcycle-jacket-1.png'
import graphicTee from '../assets/New folder/s-l400.jpg'
import denimJacket from '../assets/New folder/R.jpe?url'
import denimJeans from '../assets/New folder/prod.jpe?url'
import pinkCap from '../assets/New folder/OIP.webp'
import sherpaHoodie from '../assets/New folder/OIP (4).webp'
import plaidScarf from '../assets/New folder/OIP (3).webp'
import whiteGraphicTee from '../assets/New folder/OIP (2).webp'
import knitHat from '../assets/New folder/OIP (1).webp'
import brownJeans from '../assets/New folder/c7e0210c7c5c3ede6de5c0b907d0cafc.jpg'
import bootcutJeans from '../assets/New folder/Buffalo-Jeans-Relaxed-Boot-Game-Jeans-696x1221.webp'
import peruvianHat from '../assets/New folder/Brenda-Peruvian-Hat.46573a.jpg'
import lightWashJeans from '../assets/New folder/9bcedc2f368d0f3f48c7316a6b5b3d19.jpg'
import denimLayer from '../assets/New folder/7df08ea3fc5e266b61c3128164f922e6.jpg'

const newDropItems = [
  { name: 'Moto Leather Jacket', category: 'Outerwear', image: womensMotoJacket },
  { name: 'Vegan Leather Jacket', category: 'Outerwear', image: topGunJacket },
  { name: 'Graphic Tee', category: 'Everyday essentials', image: graphicTee },
  { name: 'Denim Jacket', category: 'Denim', image: denimJacket },
  { name: 'Relaxed Jeans', category: 'Denim', image: denimJeans },
  { name: 'Classic Cap', category: 'Accessories', image: pinkCap },
  { name: 'Sherpa Zip Hoodie', category: 'Layers', image: sherpaHoodie },
  { name: 'Plaid Scarf', category: 'Accessories', image: plaidScarf },
  { name: 'Printed Tee', category: 'Everyday essentials', image: whiteGraphicTee },
  { name: 'Knit Beanie', category: 'Accessories', image: knitHat },
  { name: 'Brown Straight Jeans', category: 'Denim', image: brownJeans },
  { name: 'Bootcut Jeans', category: 'Denim', image: bootcutJeans },
  { name: 'Peruvian Knit Hat', category: 'Accessories', image: peruvianHat },
  { name: 'Light-Wash Jeans', category: 'Denim', image: lightWashJeans },
  { name: 'Denim Layer', category: 'Outerwear', image: denimLayer },
]

function NewDropSection() {
  return (
    <section className="new-drop-section section-pad" aria-labelledby="new-drop-title">
      <div className="section-heading new-drop__heading" data-reveal>
        <div>
          <p className="eyebrow">Just landed</p>
          <h2 id="new-drop-title">New Drop</h2>
        </div>
        <Link className="text-link" to="/new-arrivals">
          Shop all new arrivals <span aria-hidden="true">↗</span>
        </Link>
      </div>

      <div
        className="new-drop__row"
        role="region"
        aria-label="New Drop pieces"
        tabIndex={0}
      >
        {newDropItems.map((item) => (
          <article className="new-drop__card" key={item.name}>
            <Link className="new-drop__image" to="/new-arrivals" aria-label={`Shop ${item.name}`}>
              <img src={item.image} alt={item.name} loading="lazy" />
            </Link>
            <div className="new-drop__details">
              <h3>{item.name}</h3>
              <p>{item.category}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default NewDropSection
