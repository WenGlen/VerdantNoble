import PageTitle from '../../../components/storefront/elements/PageTitle';

export default function PrivacyPage() {     
    return (


        <div className="w-full max-w-screen-md mx-auto bg-panel-25 rounded-md p-8 my-24">
            <PageTitle title="隱私權政策"/>

            <p className="mb-6">
                非常歡迎您光臨本網站，為了讓您能夠安心的使用本網站的各項服務與資訊，特此向您說明本網站的隱私權保護政策，以保障您的權益，請您詳閱下列內容：
            </p>

            <div className="space-y-6 ">
                <section>
                    <h3>一、隱私權保護政策的適用範圍</h3>

                    <div className="space-y-2">
                        <p>隱私權保護政策內容，包括本網站如何處理在您使用網站服務時收集到的個人識別資料。</p>
                        <p>隱私權保護政策不適用於本網站以外的相關連結網站，也不適用於非本網站所委託或參與管理的人員。</p>
                    </div>
                </section>

                <section>
                    <h3 >二、個人資料的蒐集、處理及利用方式</h3>

                    <div className="space-y-2">
                        <p>當您蒞臨本網站或參與本網站活動時，我們將視活動性質請您提供必要的個人資料，並在該特定目的範圍內處理及利用您的個人資料。</p>
                        <p>本網站蒐集足以識別使用者身分的個人資料、消費與交易資料，或日後經您同意而提供之其他個人資料，都僅供本網站於其內部、依照蒐集之目的進行處理和利用、或為完成提供服務或履行合約義務之必要、或依照相關法令規定或有權政府機關之命令或要求，否則本網站不會將足以識別使用者身分的個人資料提供給第三人（包括境內及境外）、或移作蒐集目的以外之使用。</p>
                    </div>
                </section>

                <section>
                    <h3 >三、資料之保護</h3>

                    <div className="space-y-2">
                        <p>本網站主機均設有防火牆、防毒系統等相關的各項資訊安全設備及必要的安全防護措施，加以保護網站及您的個人資料採用嚴格的保護措施，只由經過授權的人員才能接觸您的個人資料，相關處理人員皆簽有保密合約，如有違反保密義務者，將會受到相關的法律處分。</p>
                        <p>如因業務需要有必要委託本網站相關單位提供服務時，本網站亦會嚴格要求其遵守保密義務，並且採取必要檢查程序以確定其將確實遵守。</p>
                    </div>
                </section>

                <section>
                    <h3 >四、網站對外的相關連結</h3>
                    <p>本網站的網頁提供其他網站的網路連結，您也可經由本網站所提供的連結，點選進入其他網站。但該連結網站不適用本網站的隱私權保護政策，您必須參考該連結網站中的隱私權保護政策。</p>
                </section>

                <section>
                    <h3 >五、與第三人共用個人資料之政策</h3>
                    <div className="space-y-3">
                        <p>本網站絕不會提供、交換、出租或出售任何您的個人資料給其他個人、團體、私人企業或公務機關，但有法律依據或合約義務者，不在此限。</p>
                        <p>前項但書之情形包括不限於：</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>經由您同意。</li>
                            <li>法律明文規定。</li>
                            <li>為維護國家安全或增進公共利益。</li>
                            <li>為免除您生命、身體、自由或財產上之危險。</li>
                            <li>當您在本網站的行為，違反本網站的服務條款或可能損害或妨礙本網站權益或導致任何人遭受損害時，經本網站揭露您的個人資料是為了辨識、聯絡或採取法律行動所必要者。</li>
                            <li>有利於您的權益。</li>
                        </ul>
                        <p>本網站委託廠商協助蒐集、處理或利用您的個人資料時，將對委外廠商或個人善盡監督管理之責。</p>
                    </div>
                </section>

                <section>
                    <h3 >六、Cookie 之使用</h3>
                    <div className="space-y-3">
                        <p>為了提供您最佳的服務，本網站會在您的電腦中放置並取用我們的Cookie，若您不願接受Cookie的寫入，您可在您使用的瀏覽器功能項中設定隱私權等級為高，即可拒絕Cookie的寫入，但可能會導至網站某些功能無法正常執行。</p>
                        <div>
                            <h3 className="text-lg font-medium mb-2">如何關閉 Cookie？</h3>
                            <p className="mb-2">瀏覽器允許您更改 Cookie 的設定。這些設定可以在您的瀏覽器選單上的「選項」或「設定」找到。如欲了解更多這些設定，可參考下列的連結，對您可能有幫助。</p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li>
                                    <a 
                                        href="https://support.google.com/chrome/answer/95647?hl=en" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        Chrome™ 的 Cookie 設定
                                    </a>
                                </li>
                                <li>
                                    <a 
                                        href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        Firefox® 的 Cookie 設定
                                    </a>
                                </li>
                                <li>
                                    <a 
                                        href="https://support.microsoft.com/en-us/windows/manage-cookies-in-microsoft-edge-view-allow-block-delete-and-use-168dab11-0753-043d-7c16-ede5947fc64d" 
                                        target="_blank" 
                                        rel="noopener noreferrer"

                                    >
                                        Microsoft Edge 的 Cookie 設定
                                    </a>
                                </li>
                                <li>
                                    <a 
                                        href="https://support.apple.com/zh-tw/105082" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        Safari® 的 Cookie 設定
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section>
                    <h3 >七、隱私權保護政策之修正</h3>
                    <p>本網站隱私權保護政策將因應需求隨時進行修正，修正後的條款將刊登於網站上。</p>
                </section>
            </div>
        </div>

    )
}