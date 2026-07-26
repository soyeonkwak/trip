import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

// PWA 서비스 워커 자동 업데이트 등록
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('새로운 버전의 앱이 있습니다. 업데이트하시겠습니까?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('앱이 오프라인에서 사용할 준비가 되었습니다.');
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
