import React, { useEffect } from 'react';


export default function PaymentPage({
  setStep,
}) {

  useEffect(() => {
    setTimeout(() => {
      setStep(3);
    }, 5000);
  }, []);


  return (

    <>
    <div className="w-full h-full min-h-[calc(100vh-200px)] flex flex-col items-center justify-center gap-4">
      
      <div /*讀取動畫*/ className="w-16 h-16 border-8 border-muted-25 border-t-primary rounded-full animate-spin"/>
      <p>沒有真的串金流</p>
      <p>等五秒後自動跳轉到完成頁</p>
      <p>或可點擊以下按鈕跳轉到完成頁</p>
      <button type='button' className="btn-primary" onClick={() => setStep(3)}>跳轉到完成頁</button>
    </div>
    </>
  );
}


