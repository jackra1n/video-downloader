import React from 'react'
import ReactDOM from 'react-dom/client'
import Header from './Header.tsx'
import Download from './Download.tsx'
import MainContainer from './MainContainer.tsx'
import '../styles/globals.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Header />
    <MainContainer>
      <Download />
    </MainContainer>
  </React.StrictMode>,
)
