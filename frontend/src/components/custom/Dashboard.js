import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import SearchBar from '../tailwind/SearchBar';
import Map from './Map';
import SidePanel from './SidePanel';
import { useState } from 'react';

export default function Dashboard() {

  const [showedRoad, setShowedRoad] = useState(null);
  
  function getRoads() {
    let data = [];
    for (let i = 0; i < 10; i++){
        let eps = 0.01
        data.push({
            name: `name${i}`,
            lat1: 41.9028 + Math.random() * eps,
            lat2: 41.9028 - Math.random() * eps,
            lng1: 12.4964 + Math.random() * eps,
            lng2: 12.4964 - Math.random() * eps
        });
    }
    return data;
  }

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
      <div className="min-h-full">

        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 text-center">Analizza una strada</h1>
            <h3 className="text-xl tracking-tight text-gray-900 text-center">Dataset con _ incidenti avvenuti nella città di Roma</h3>
          </div>
        </header>

        <SearchBar/>
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 flex flex-row">
            <div className = "basis-2/3 h-96">
                <Map roads = {getRoads()} showedRoad = {showedRoad} setShowedRoad = {setShowedRoad}/>
            </div>
            <div className = "basis-1/3 h-96">
                <SidePanel showedRoad = {showedRoad} />
                </div>    
            </div>
        </main>
      </div>
    </>
  )
}
