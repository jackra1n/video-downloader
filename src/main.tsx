import React from 'react'
import ReactDOM from 'react-dom/client'
import Header from './Header.tsx'
import Download from './Download.tsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Header />
    <Download />
  </React.StrictMode>,
)
