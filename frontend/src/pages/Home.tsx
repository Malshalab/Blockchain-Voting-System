import React from 'react'
import Navbar from '../components/Navbar'

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-4xl font-bold">Seamless Blockchain Voting</h1>
        <p className="text-lg text-gray-600 mt-2">
          Participate in secure and transparent elections with blockchain technology.
        </p>
        <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg">
          Get Started
        </button>
      </div>
    </div>
  )
}

export default Home