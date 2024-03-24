import '../../css/input.css';

export default function SidePanel({showedRoad, showedRoadInfo, roadCount}){

    return (
            <div class="h-full row-span-6 rounded overflow-hidden justify-items-center text-sky-950">
              <div class="px-6 py-4">
                  <div class="font-bold text-2xl mb-2">{showedRoad == null? 
                  <div class ="font-bold text-2xl"> Seleziona una strada tra le {roadCount} disponibili e analizza i dati </div> : showedRoad}</div>
                  <p class="text-gray-700 text-base">
                  {showedRoadInfo == null? "": 
                  <ul>
                    
                      <li><strong>Categoria:</strong> {showedRoadInfo["Localizzazione"]}</li>
                      <li><strong>Segnaletica:</strong> {showedRoadInfo["Segnaletica"]}</li>
                      <li><strong>Tipo di strada:</strong> {showedRoadInfo["TipoStrada"]}</li>
                      <li><strong> Pavimentazione:</strong> {showedRoadInfo["Pavimentazione"]}</li>
                    </ul>
                    }
                  </p>
              </div>
            </div>
    );
};