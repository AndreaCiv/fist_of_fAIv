import React, {useEffect, useState, useRef, useImperativeHandle} from 'react';
import L from "leaflet";

import '../../css/input.css'
import "leaflet/dist/leaflet.css";

const Map = React.forwardRef (({roads, showedRoad, setShowedRoad}, ref) => { 
    const mapContainer = "mapContainer";
    let map = null;
    
    // coordinate roma
    const center = { lng: 12.4964, lat: 41.9028 };
    const [zoom] = useState(11);

    const refresh = () =>{
        //if (map.current) return; // stops map from intializing more than once
        // leaflet set map container

        if (map === null){
            map = L.map(mapContainer).setView([center.lat, center.lng], zoom);
        }

        alert("refresh");
        

        L.tileLayer(`https://tile.openstreetmap.org/{z}/{x}/{y}.png`, {
            maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        
        let allpoints = [];
        
        if (typeof roads  == 'object' && roads !== null){
            for (const [key, d] of Object.entries(roads)) {
                var pointA = new L.LatLng(d["Min_Latitudine"], d["Min_Longitudine"]);
                var pointB = new L.LatLng(d["Max_Latitudine"], d["Max_Latitudine"]);
                var pointList = [pointA, pointB];
                allpoints.push(pointList);
    
                var firstpolyline = new L.Polyline(pointList, {
                    color: 'red',
                    weight: 3,
                    opacity: 0.5,
                    smoothFactor: 1
                });
                firstpolyline.addTo(map).on('click', () => {
                    setShowedRoad(d.Strada);
                    //console.log(firstpolyline.getBounds());
                    map.fitBounds([[d["Min_Latitudine"], d["Min_Longitudine"]], [d["Max_Latitudine"], d["Max_Longitudine"]]]);
                });
            }
            if (allpoints.length > 0){
                map.fitBounds(allpoints);
            }
        }
        else{
            alert("no roads");
        }
        
    }

    useImperativeHandle(ref, () => ({
        refresh
    }));

    return (
    <div className="h-full v-full">
    <div id ="mapContainer" className="map h-full v-full" />
    </div>
    );
});

export default Map;