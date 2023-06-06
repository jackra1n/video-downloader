import React from 'react'
import ReactDOM from 'react-dom/client'
import Header from './Header.tsx'
import MainContainer from './MainContainer.tsx'
import Download from './Download.tsx'
import Files from './Files.tsx'
import '../styles/globals.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Header />
    <MainContainer>
      <Download />
      <Files />
    </MainContainer>
  </React.StrictMode>,
)
