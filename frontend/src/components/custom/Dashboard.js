import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import SearchBar from '../tailwind/SearchBar';
//import Map from './Map';
import Report from './Report';
import SidePanel from './SidePanel';
import React, { useState, useRef, useEffect} from 'react';
import L from "leaflet";

import '../../css/input.css'
import "leaflet/dist/leaflet.css";

export default function Dashboard() {

  const [showedRoad, setShowedRoad] = useState(null);
  //const [roads, setRoads] = useState(null);
  const [searchString, setSearchString] = useState(null);
  const [showedRoadInfo, setShowedRoadInfo] = useState(null);
  const [ai, setAi] = useState(null);
  const [show, setShow] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [roadCount, setRoadCount] = useState(0);

  function updateRoads(name){
    //if (searchString != null && searchString.length > 2){
    // ajax call to add piece to column
    fetch('/search', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        // You can add other headers if needed
        },
        body: JSON.stringify({"name" : name})
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Assuming the server responds with JSON data
    })
    .then(ret => {
        refresh(ret);
    })
    .catch(error => {
        console.error('Error:', error);
    });
  //}
  }

  function update(name){
    //if (searchString != null && searchString.length > 2){
    // ajax call to add piece to column
    fetch('/road', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        // You can add other headers if needed
        },
        body: JSON.stringify({"name" : name})
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Assuming the server responds with JSON data
    })
    .then(ret => {
        setShowedRoadInfo(ret);
    })
    .catch(error => {
        console.error('Error:', error);
    });
  //}
  }

  //useEffect(updateRoads, [searchString]);
  const mapContainer = "mapContainer";

  let map = useRef(null);
  
  // coordinate roma
  const center = { lng: 12.4964, lat: 41.9028 };
  const [zoom] = useState(11);


  const refresh = (roads) =>{
      if (map.current) return; // stops map from intializing more than once
      // leaflet set map container
      
      map = L.map(mapContainer).setView([center.lat, center.lng], zoom);
      

      L.tileLayer(`https://tile.openstreetmap.org/{z}/{x}/{y}.png`, {
          maxZoom: 19,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          opacity: 0.5
      }).addTo(map);
      
      let allpoints = [];
      
      if (typeof roads  == 'object' && roads !== null){
          let max_cont = 10000;
          let cont = 0;
          for (const [key, d] of Object.entries(roads)) {
              /*
              if (jumpCont > 0){
                  jumpCont ++;
                  continue;
              }
              else if (jumpCont == jump){
                  jumpCont = 1;
              }*/

              if (cont > max_cont){
                  break;
              }
              let eps = 0.1
              if(center.lat - eps > d["Min_Latitudine"] || d["Max_Latitudine"] > center.lat + eps || center.lng - eps > d["Min_Longitudine"] || d["Max_Longitudine"] > center.lng + eps){
                  continue;
              }
              
              //calculate road length
              let lat1 = d["Min_Latitudine"];
              let lon1 = d["Min_Longitudine"];
              let lat2 = d["Max_Latitudine"];
              let lon2 = d["Max_Longitudine"];

              let dist = Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2));

              if (dist > 0.01){
                  continue;
              }
              
              if (dist < 0.005){
                continue;
              }

              cont ++;
              var pointA = new L.LatLng(d["Min_Latitudine"], d["Min_Longitudine"]);
              var pointB = new L.LatLng(d["Max_Latitudine"], d["Max_Longitudine"]);
              var pointList = [pointA, pointB];
              allpoints.push(pointList);
  
              var firstpolyline = new L.Polyline(pointList, {
                  color: 'darkblue',
                  weight: 2,
                  opacity: 0.75,
                  smoothFactor: 1
              });
              console.log(d["Strada"]);
              firstpolyline.addTo(map).on('click', () => {
                  setShowedRoad(d["Strada"]);
                  //console.log(firstpolyline.getBounds());
                  update(d["Strada"]);
                  setShow(true);
                  map.fitBounds([[d["Min_Latitudine"], d["Min_Longitudine"]], [d["Max_Latitudine"], d["Max_Longitudine"]]]);
              });
          }
          setRoadCount(cont);
          if (allpoints.length > 0){
              map.fitBounds(allpoints);
          }
      }
      else{
          //alert("no roads");
      }
      
  }
  useEffect(() => { updateRoads("via") }, []);

  function report(){
    fetch('/inference', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      // You can add other headers if needed
      },
      body: JSON.stringify(showedRoadInfo)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Assuming the server responds with JSON data
    })
    .then(ret => {
        setAi(ret);
        setShowReport(true);
    })
    .catch(error => {
        console.error('Error:', error);
    });
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
      <div className="min-h-full bg-indigo-100">

        <header className="bg-indigo-100">
          <div className="mx-auto w-[24em] px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold p-2 text-center text-sky-950">I dati che ci guidano verso strade più sicure</h1>
          </div>
        </header>
        <SearchBar setSearchString={setSearchString}/>
        <main>
          <div className="mx-auto py-6 sm:px-6 lg:px-8 flex flex-row bg-white m-4">
            <div className = "basis-2/3 h-[32em]">
            <div className="h-full v-full bg-white">
              <div id ="mapContainer" className="map h-full v-full" />
              </div>
            </div>
            <div className = "basis-1/3 w-full h-full bg-white">
            <div class="rounded overflow-hidden flex flex-col h-full">
              <SidePanel showedRoad = {showedRoad} showedRoadInfo = {showedRoadInfo} roadCount={roadCount}/>
              <div class="grid justify-items-center">
                { show? 
              <button class=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-32 m-4" onClick = {report}> AI Report</button> :
              ""
                }
              </div>
              </div>
                </div>    
            </div>
            <Report ai = {ai} showReport = {showReport}/>
        </main>
      </div>
    </>
  )
}
