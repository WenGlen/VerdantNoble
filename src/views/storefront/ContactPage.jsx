import { useState } from 'react';
import FormInput from '../../components/storefront/elements/FormInput';
import TextCard from '../../components/storefront/elements/TextCard';
import PageTitle from '../../components/storefront/elements/PageTitle';

// Google Maps Embed（iframe 模式，免 API key），可替換成自己的「分享 > 嵌入地圖」網址
const MAP_EMBED_SRC =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3614.703553909969!2d121.5205563!3d25.0403173!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442a90c777d8e7d%3A0x3c0e2d4e2d4e2d4e!2z5Y-w5Y2X5biC5Lit5q2j5Z-O!5e0!3m2!1szh-TW!2stw!4v1234567890';



export default function ContactPage() {

    const contactInfo = [
        {
            label: '地址',
            value: '台北市大安區',
            value2: '忠孝東路四段100號',
        },
        {
            label: '營業時間',
            value: '週一至週三、週五至週日',
            value2: '11:00-21:00',
            value3: '（週四公休）',
        },
        {
            label: '電話',
            value: '02-2345-6789',
        },
        {
            label: '信箱',
            value: 'info@example.com',
        },
    ]



  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  function handleSubmit(e) {
    e.preventDefault();
    // 實際可接後端或 mailto
    console.log('Contact form:', form);
  }

  return (
    <section className="p-4 md:p-8 w-[300px] md:w-full md:max-w-screen-md">
      <PageTitle title="聯絡我們"/>
      <p className="pt-4 text-default">
        如果您有任何問題或建議，請隨時聯絡我們。
      </p>

      {/* 左半地圖、右半營業時間與地址 */}
      <div className="w-full border-b border-border-50 py-12 space-y-6">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <div className="w-full md:flex-1 min-h-[240px] rounded-md overflow-hidden bg-panel-50">
                <iframe
                title="店鋪位置"
                src={MAP_EMBED_SRC}
                width="100%"
                height="240"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full min-h-[240px]"
                />
            </div>

            <div className="w-full md:w-[280px] space-y-4">

                <TextCard context={contactInfo[0]}/>
                <TextCard context={contactInfo[1]}/>
                <TextCard context={contactInfo[2]} context2={contactInfo[3]}/>
            </div>
        </div>
      </div>

      {/* 左半信箱與電話、右半洽詢表單 */}
      <div className="w-full py-12 space-y-6">
        <h3 className="text-lg font-bold">來信洽詢</h3>

          <form
            className="flex-1 min-w-0 flex flex-col gap-4"
            onSubmit={handleSubmit}
          >
            <FormInput
              label="姓名"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="請輸入您的姓名"
            />
            <FormInput
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              placeholder="請輸入您的 Email"
            />
            <FormInput
              label="主旨"
              value={form.subject}
              onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
              placeholder="請輸入主旨"
            />
            <label className="w-full flex flex-col gap-1 md:flex-row md:items-start md:gap-2">
              <span className="form-label md:pt-2">留言</span>
              <textarea
                className="flex-1 min-w-0 min-h-[120px] resize-y"
                value={form.message}
                onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                placeholder="請輸入您的問題或建議"
                rows={5}
              />
            </label>
            <div className="flex justify-end">
              <button type="submit" className="btn-primary">
                送出(沒有正式串接啦)
              </button>
            </div>
          </form>
      </div>
    </section>
  );
}
