import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="w-full overflow-hidden">
      <div className="relative w-full flex-row-center-center">
        <div className="opacity-40 md:w-[60%] md:opacity-100">
          <div
            className="flex-row-center-center overflow-visible
                                     drop-shadow-[0_0_20px_hsla(100,30%,70%,0.5)] 
                                         md:min-w-[480px]"
          >
            <div className=" min-w-[600px]">
              <img
                src="https://i.meee.com.tw/bmMxulS.png"
                alt="綠蕨飾首頁主視覺 — 優雅綠意植栽空間"
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div
          className="flex-col-center gap-8
                                md:w-[40%] md:min-w-[320px] md:h-full "
        >
          <div className="">
            <h1 className="leading-[1.2]">
              <span className="text-2xl      mobile:absolute mobile:top-[30%] mobile:left-4 ">
                探索屬於你的
              </span>
              <br className="hidden md:block" />
              <span className="md:text-primary  mobile:absolute mobile:top-[60%] mobile:right-4 ">
                優雅綠意
              </span>
            </h1>
            <div
              className="mobile:absolute mobile:bottom-4 mobile:left-1/2 mobile:-translate-x-1/2
                                        flex flex-col gap-12"
            >
              <p className="mobile:w-[50vw] ">
                <span className="hidden md:block">
                  讓牆面成為你的垂直花園，
                  <br />
                </span>
                嚴選每一株姿態，讓手工上板的鹿角蕨，
                <br className="hidden md:block" />
                展現不需張揚的高雅品味。
              </p>

              <Link to="/products">
                <button className="btn-primary max-mobile:hidden">
                  立即探索
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
