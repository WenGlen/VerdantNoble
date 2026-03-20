import { useState } from 'react';
import { faqList } from '../../../data/faqData';
import PageTitle from '../../../components/storefront/elements/PageTitle';

export default function FAQPage() {
  const [expandedId, setExpandedId] = useState(null);

  const toggle = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="w-full p-4 max-w-screen-md space-y-8">
      <PageTitle title="常見問題"/>

      {/* 一條一條可展開的問答 */}
        <ul className="flex flex-col">
          {faqList.map((item) => (
            <li key={item.id} id={item.id}>
              <div className="w-full border-b border-border-50 overflow-hidden pb-8 text-sm leading-relaxed">
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  className="w-full text-left pt-8 px-4 flex-row-between-center "
                >
                  <span className="font-medium text-default">{item.question}</span>
                  <span className="text-sm text-muted shrink-0">
                    {expandedId === item.id ? '︿' : '﹀'}
                  </span>
                </button>
                {expandedId === item.id && (
                  <div className="p-4 pl-6 pr-12">
                    <div className="w-full pl-2 border-l-4 border-border-50">
                      <p>{item.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
    </section>
  );
}
