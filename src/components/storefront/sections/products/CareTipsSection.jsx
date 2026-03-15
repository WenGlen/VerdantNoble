import greenhouseIcon from '../../../../img/greenhouse.png';
import humidityIcon from '../../../../img/humidity.png';
import wateringIcon from '../../../../img/watering.png';

const icons = [
  greenhouseIcon,
  wateringIcon,
  humidityIcon
]

export default function CareTipsSection({ title = '養護重點', care, className = '' }) {
  if (!Array.isArray(care) || care.length === 0) return null;

  return (
    <div className={`px-12 py-6 bg-panel-50 md:rounded-xl ${className}`.trim()}>
      <h3 className="text-xl font-bold mb-8">{title}</h3>
      <ul className="space-y-6">
        {care.map((tip, index) => (
          <li key={tip.id ?? index} className="flex gap-4">
            <div className="w-16 h-16 flex-row-center-center shrink-0">
              <img src={icons[index]} alt={tip.title} />
            </div>
            <div className="flex-1 flex-col-center-start">
              <strong className="block">{tip.title}</strong>
              <span className="text-sm">{tip.description}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
