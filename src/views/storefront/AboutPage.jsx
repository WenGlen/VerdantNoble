import AboutHero from '../../components/storefront/sections/About/AboutHero';
import BrandNameSection from '../../components/storefront/sections/About/BrandNameSection';
import ContactSection from '../../components/storefront/sections/About/ContactSection';

export default function AboutPage() {
  return (
    <div className="">
      {/* Hero Section */}
      <AboutHero />

      <div className="flex flex-col gap-20">

        <section>
          <div className="w-full max-w-[640px] mx-auto p-8">
            <h2 className="text-secondary ">我們在做的，<br className="block md:hidden" />不只是植物</h2>
            <div className="space-y-4 mt-8">
              <p>
                綠蕨飾成立於八年前。<br />
                一開始，我們並沒有打算經營一個「植物品牌」。
              </p>
              <p>
                我們只是反覆注意到一件事：
              </p>
              <p>
                真正耐看的空間裡，<br />
                植物從來不是主角，<br />
                卻也從未缺席。
              </p>
              <p>
                它們安靜地存在，<br />
                不炫耀、不搶戲，<br />
                卻讓整個空間站得住。
              </p>
              <p>
                這樣的存在方式，<br />
                正是我們想留下的東西。
              </p>

            </div>
          </div>
          
        </section>

        <section>
          <div className="w-full max-w-[640px] mx-auto p-8">
            <h2 className="text-secondary md:text-right">低調奢華，<br className="block md:hidden" />從來不是風格</h2>
            <div className="w-full mt-8 flex flex-col md:flex-row md:justify-between gap-4 ">

              <div className="">
                <div className="w-full aspect-[4/3] md:w-[280px] md:aspect-[3/4] bg-placeholder rounded-[4px] overflow-hidden">
                  <img src="https://i.meee.com.tw/ahK7yt3.png" alt="about image" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="space-y-4">
              <p>
                對我們而言，<br />
                低調奢華不是視覺選擇，<br />
                而是一種判斷方式。
              </p>
              <p>
                我們不追求最大、最稀有、最引人注目。<br />
                我們在意的是：
              </p>
              <div className="space-y-2 text-secondary font-serif">
                <p>• 是否適合這個空間</p>
                <p>• 是否能長時間被觀看</p>
                <p>• 是否在多年後依然成立</p>
              </div>
              <p>
                真正好的存在，<br />
                不需要被反覆說明。
              </p>
              <p>
                它會在時間裡被理解。
              </p>

              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Verdant Noble 的名字 */}
      <BrandNameSection />



      <section>
          <div className="w-full max-w-[640px] mx-auto p-8">
            <h2 className="text-secondary ">我們如何工作</h2>
            <div className="space-y-4">
              <p>
                我們很少談「系列」或「爆款」。<br />
                更多時候，我們在做的是選擇與刪除。
              </p>
              <p>
                每一株植物，<br />
                都經過體態、比例與成熟度的判斷。
              </p>
              <p>
                每一次安置，<br />
                都考量觀看角度、空間高度與留白。
              </p>
              <p>
                我們相信，<br />
                被理解過的植物，<br />
                會自然地融入生活。
              </p>

            </div>
          </div>
          
        </section>


      <ContactSection />


    </div>
  );
}
