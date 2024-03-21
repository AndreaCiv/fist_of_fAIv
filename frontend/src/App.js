import React, { useEffect, useState } from 'react';
import Header from './components/tailwind/Header';
import Footer from './components/tailwind/Footer';
import Dashboard from './components/custom/Dashboard';
//import './css/input.css';

function App() {

  const [message, setMessage] = useState("-");

  function test(){

    // ajax call to add piece to column
    fetch('/test', {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        // You can add other headers if needed
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Assuming the server responds with JSON data
    })
    .then(ret => {
        setMessage(ret.message);
    })
    .catch(error => {
        console.error('Error:', error);
    });
  }

  useEffect(() => test);

  return (
    <>
    <Header />
    <Dashboard />
    <Footer/>
    </>
  );
}

export default App;
