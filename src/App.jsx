import './App.scss'
import { Footer } from './components/Footer.jsx'
import { Header } from './components/Header.jsx'
import { Outlet } from 'react-router-dom'
import { ToastConfig } from './components/ToastConfig.jsx'
export const  App = () =>{

  return (
    <>
   
    <Header/>
    <main>
      <Outlet />
    </main>
   <Footer/>  
   </>
  )
}

