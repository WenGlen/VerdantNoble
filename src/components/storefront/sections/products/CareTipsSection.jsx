import { careTips, defaultCareTipsTitle } from '../../../../data/careTips';

/**
 * 養護重點區塊，可供文章、商品頁、靜態頁等多處共用。
 * @param {Object} props
 * @param {string} [props.title] - 區塊標題，不傳則使用預設「核心照護要點」
 * @param {string} [props.className] - 外層額外 class
 */
export default function CareTipsSection({ title = defaultCareTipsTitle, className = '' }) {
  return (
    <div className={`px-12 py-6 bg-panel-50 md:rounded-xl ${className}`.trim()}>
      <h3 className="text-xl font-bold mb-8">{title}</h3>
      <ul className="space-y-6">
        {careTips.map((tip) => (
          <li key={tip.id} className="flex gap-4">
            <div className="w-16 h-16 bg-placeholder rounded-md flex-row-center-center">
              <span className="text-xs">{tip.icon}</span>
            </div>
            <div className="flex-1">
              <strong className="block">{tip.title}</strong>
              <span className="text-sm">{tip.description}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
