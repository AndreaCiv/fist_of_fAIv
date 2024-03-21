import React, {useEffect, useState, useRef} from 'react';
import L from "leaflet";

import '../../css/input.css'
import "leaflet/dist/leaflet.css";

export default function Map ({roads, showedRoad, setShowedRoad}){
    const mapContainer = useRef(null);
    let map = useRef(null);
    // coordinate roma
    const center = { lng: 12.4964, lat: 41.9028 };
    const [zoom] = useState(11);

    const markerIcon = L.icon({
        iconUrl: "./marker.png",
        //shadowUrl: "marker.png",
        iconSize:     [38, 95], // size of the icon
        shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    
    function polylineEvent(){
        
    }

    const refresh = () =>{
        //if (map.current) return; // stops map from intializing more than once
        // leaflet set map container
        map = L.map(mapContainer.current).setView([center.lat, center.lng], zoom);

        L.tileLayer(`https://tile.openstreetmap.org/{z}/{x}/{y}.png`, {
            maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        
        // Add a marker
        //L.marker([center.lat, center.lng], {icon: markerIcon}).addTo(map);
        
        for(let d of roads){
            var pointA = new L.LatLng(d.lat1, d.lng1);
            var pointB = new L.LatLng(d.lat2, d.lng2);
            var pointList = [pointA, pointB];
            
            var firstpolyline = new L.Polyline(pointList, {
                color: 'red',
                weight: 3,
                opacity: 0.5,
                smoothFactor: 1
            });
            firstpolyline.addTo(map).on('click', () => {
                setShowedRoad(d);
                //console.log(firstpolyline.getBounds());
                map.fitBounds([[d.lat1, d.lng1], [d.lat2, d.lng2]]);
            });
        }
        
    }

    useEffect(() => refresh, [center.lng, center.lat, zoom]);

    return (
    <div className="h-full v-full">
    <div ref={mapContainer} className="map h-full v-full" />
    </div>
    );
}