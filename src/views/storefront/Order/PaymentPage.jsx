import React, { useEffect } from "react";
import { Oval } from "react-loader-spinner";

export default function PaymentPage({ setStep }) {
  useEffect(() => {
    const t = setTimeout(() => {
      setStep(3);
    }, 5000);
    return () => clearTimeout(t);
  }, [setStep]);

  return (
    <>
      <div className="w-full h-full min-h-[calc(100vh-200px)] flex flex-col items-center justify-center gap-4">
        <Oval
          height={80}
          width={80}
          color="var(--color-primary)"
          secondaryColor="var(--color-panel-75)"
          strokeWidth={6}
        />
        <p>沒有真的串金流</p>
        <p>等五秒後自動跳轉到完成頁</p>
        <p>或可點擊以下按鈕跳轉到完成頁</p>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setStep(3)}
        >
          跳轉到完成頁
        </button>
      </div>
    </>
  );
}
