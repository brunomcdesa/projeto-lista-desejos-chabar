export default function CategoryFilter({ categories, selected, onSelect }) {
  return (
    <div className="cat-scroll">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`cat-pill${selected === cat ? ' active' : ''}`}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
