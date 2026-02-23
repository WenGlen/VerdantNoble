/**
 * 養護重點／核心照護要點
 * 格式：{ icon, title, description }
 * icon 為 Material Symbols 名稱（如 light_mode、water_drop）
 * 可供文章內文、商品頁、靜態頁等多區塊共用
 */
export const careTips = [
  {
    id: 'light',
    icon: 'light',
    title: '明亮散射光',
    description: '避免正午直射陽光灼傷葉片，北向或東向窗戶最理想。'
  },
  {
    id: 'water',
    icon: 'water',
    title: '浸透再晾乾法',
    description: '整塊掛板浸水 15～20 分鐘，完全乾透後再進行下一次澆水。'
  },
  {
    id: 'temp',
    icon: 'thermostat',
    title: '溫度與濕度',
    description: '維持 18～27°C，室內濕度低於 50% 時可多噴霧。'
  }
];

/** 預設區塊標題，可依使用情境覆寫 */
export const defaultCareTipsTitle = '核心照護要點';
