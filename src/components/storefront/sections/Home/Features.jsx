export default function Features() {
    const features = [
        {
            icon: '🌱',
            title: '有機方法',
            description: '不使用刺激性化學物質。我們使用有益昆蟲和有機肥料，確保最健康的葉片。'
        },
        {
            icon: '🔧',
            title: '客製化固定',
            description: '每個固定板都是由回收的柚木或雪松手工製作，確保天然且防腐的基底。'
        },
        {
            icon: '🚚',
            title: '無壓力運送',
            description: '我們專業的懸掛包裝保護脆弱的葉片，保證您的蕨類植物以完美狀態送達。'
        }
    ]



  return (
    <section className="py-20 ">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            {features.map((feature, index) => (
                <div key={ index } className=" bg-panel-50 p-6 rounded-lg gap-4
                                                 flex-row flex justify-between items-center
                                              md:flex-col " >
                    <div className="flex-col-center-center gap-4">
                    <div className="w-16 h-16 bg-placeholder rounded-lg "/>
                    <h3 className="mb-0">{feature.title}</h3>
                    </div>
                    <p className="w-[50%] md:w-full">{feature.description}</p>
                </div>
            ))}
        </div>
        </div>
    </section>
  )
}