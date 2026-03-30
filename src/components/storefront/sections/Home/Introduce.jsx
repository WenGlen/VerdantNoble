export default function Introduce() {
  return (
    <section className="w-full py-20">
      <div className="flex flex-col items-center md:flex-row gap-12 px-12">
        {/* Content */}
        <div className="max-w-[440px]">
          <h2 className="font-normal mb-6 font-serif">
            用心栽培於我們的
            <span className="text-primary italic">蕨</span>
          </h2>
          <p className="text-[15px] leading-[1.8] text-gray-600 mb-8">
            我們的旅程始於一株平凡的銀鹿。
            <br />
            如今，我們管理著一個致力於提供各式高品質鹿角蕨的綠植園。
            <br />
            每一株植物不僅僅是商品——它是經過多年培育的活雕塑，才來到您的家中。
          </p>
          <button className="btn-secondary">我們的永續流程 →</button>
        </div>

        {/* Images */}
        <div
          className="relative w-full aspect-[4/3]
                             min-h-[320px]
                          sm:min-h-[320px]"
        >
          <div
            className="absolute left-0 top-0 
                            w-[70%]  aspect-[4/3] overflow-hidden flex-col-center-center
                            rounded-xl  bg-placeholder 
                               min-w-[200px] 
                            sm:min-w-[320px]"
          >
            <img src="https://i.meee.com.tw/mJoQTVW.png" alt="溫室圖片" />
          </div>
          <div
            className="absolute right-0 bottom-0
                            w-[40%]  aspect-[3/4] overflow-hidden flex-col-center-center
                            rounded-xl  bg-panel 
                               min-w-[160px]
                            sm:min-w-[200px]"
          >
            <img src="https://i.meee.com.tw/tOp7seu.png" alt="老闆圖片" />
          </div>
        </div>
      </div>
    </section>
  );
}
