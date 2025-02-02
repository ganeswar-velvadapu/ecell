import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import WelcomeSection from '../../components/Home/WelcomeSection'
import FeaturedProducts from '../../components/Home/FeaturedProducts'

const Home = () => {
  return (
    <div>
        <Navbar/>
        <WelcomeSection/>
        <FeaturedProducts/>
        <Footer/>
    </div>
  )
}

export default Home