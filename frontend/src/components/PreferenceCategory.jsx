export default function PreferenceCategory({ category, icon, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-lg transition transform hover:scale-105 ${
        isSelected
          ? 'bg-primary text-text-on-dark shadow-lg'
          : 'bg-bg-light text-text-primary hover:bg-accent-light border-2 border-accent'
      }`}
    >
      <div className="text-4xl mb-2">{icon}</div>
      <p className="font-semibold text-sm">{category}</p>
    </button>
  );
}
