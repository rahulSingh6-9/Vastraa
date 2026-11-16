function EditorialSection() {
  return (
    <section className="editorial-section" id="our-story">
      <div className="editorial-image" data-reveal>
        <img
          src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1400&q=85"
          alt="Portrait of a woman in warm afternoon light"
          loading="lazy"
        />
        <span className="editorial-image__caption">A study in being yourself · 2026</span>
      </div>
      <div className="editorial-copy" data-reveal>
        <p className="eyebrow">A note from VASTRAA</p>
        <h2>Style is not<br />standing out.<br /><em>It’s showing up.</em></h2>
        <p className="editorial-copy__body">
          The best clothes feel like they already belong to you. We make thoughtful,
          versatile pieces for the many versions of yourself — and all the life in between.
        </p>
        <a className="button button--dark" href="#journal">
          Get to know us <span aria-hidden="true">↗</span>
        </a>
        <span className="editorial-copy__mark" aria-hidden="true">V.</span>
      </div>
    </section>
  )
}

export default EditorialSection
