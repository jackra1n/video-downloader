import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource-variable/montserrat';
import Header from './Header.tsx'
import Download from './Download.tsx'
import '../styles/globals.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Header />
    <Download />
  </React.StrictMode>,
)
