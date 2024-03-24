import '../../css/input.css';

export default function Bottom({ai}) {
    let stats = [
        { id: 1, name: 'Meteo', value: ai == null? "": ai["condizioneClimaticaPiuComune"] },
        { id: 2, name: 'Illuminazione', value: ai == null? "": ai["condizioneIllPiuComune"] },
        { id: 3, name: 'Traffico', value: ai == null? "": ai["condizioneTraffPiuComune"] },
        { id: 4, name: 'Trend Incidenti', value: ai == null? "": ai["individua_trend"] },
    ];

    return (
      <div className="p-6">
        <div className = "p-2">
            <h2 className="text-3xl text-center tracking-tight font-bold text-gray-900">La maggior parte degli incidenti è caratterizzata da</h2>
        </div> 
        <div className="mx-auto p-6 grid justify-items-center">
          <dl className="flex flex-rows gap-x-8 gap-y-16 text-center">
            {stats.map((stat) => (
              <div key={stat.id} className="mx-4 flex flex-col gap-y-4 bg-white rounded-lg px-10 py-6">
                <dt className="text-base leading-7 text-gray-600">{stat.value}</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
                  {stat.name}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    )
  }