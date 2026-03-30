export default function ContactSection() {
  return (
    <section className="relative py-20 md:py-32 bg-black/50 text-white/90">
      <div className="absolute inset-0 w-full h-full z-[-1]">
        <img
          src="https://i.meee.com.tw/Dfs6Hrs.jpg"
          alt="與空間、品牌合作相關的情境背景圖"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="max-w-[900px] mx-auto px-8 ">
        <h2 className="text-3xl md:text-6xl font-serif mb-12">
          合作，來自信任而非曝光
        </h2>
        <div className="text-white/75 text-base space-y-4">
          <p>
            八年來，
            <br />
            我們與許多餐廳、品牌空間、私人場域合作。
          </p>
          <p>
            大多數合作並不公開。
            <br />
            現場也未必留下我們的名字。
          </p>
          <p>
            因為我們知道，
            <br />
            真正的合作不是被看見，
            <br />
            而是被信任。
          </p>
          <p className="pt-6">
            如果你在意的是長時間成立的美感，
            <br />
            我們很樂意參與。
          </p>
        </div>
      </div>
    </section>
  );
}
