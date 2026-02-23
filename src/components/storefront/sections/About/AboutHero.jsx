export default function AboutHero() {
  return (
    <section className="relative w-full min-h-[100vh] flex-row-center-center overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <div className="w-full h-full bg-black flex-row-center-center">
          {/* 佔位*/}
          <div className="w-full h-full opacity-30 ">
            <img src="https://i.meee.com.tw/NPb1c2l.png" alt="about hero" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* 文字内容 */}
      <div className="z-10 text-center flex-col-center-center gap-4">
        <h1 className="text-6xl font-serif text-white">
          綠蕨飾 <br /><span className="text-secondary text-2xl md:text-6xl ">Verdant Noble</span>
        </h1>
        <p className="text-xl md:text-lg text-secondary-50 font-serif">
          低調，卻始終被高雅
        </p>
        <div className="text-base italic text-invert opacity-75">
          <p>有些品味，不需要被解釋</p>
          <p>它只是在那裡，剛剛好</p>
        </div>
      </div>
    </section>
  );
}

