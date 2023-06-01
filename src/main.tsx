import React from 'react'
import ReactDOM from 'react-dom/client'
import Header from './components/header/Header.tsx'
import Download from './components/download/Download.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Header />
    <Download />
  </React.StrictMode>,
)
