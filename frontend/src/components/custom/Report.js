import '../../css/input.css';
import Tacho from './Tacho';
import Bottom from './Bottom';

export default function Report({ai, showReport}) {
    
    return (
        <>
    {showReport ?
            <>
            <div className = "text-sky-950 font-bold text-3xl m-4 text-center">Report generato tramite AI</div>
            <div class = "mx-auto flex flex-row bg">
            <div class = "basis-1/3 m-10">
                <div class = "flex flex-col">
                <div class = "text-xl font-bold p-2">Indice di pericolosità: {String(Math.round(ai["score"]*100))+ "%"}</div>
                <Tacho score = {ai["score"]}/>
                </div>
            </div>
            <div class = "basis-2/3 m-6 text-white bg-sky-950 rounded-md p-8">
                <span class ="font-bold text-xl ">Breve descrizione</span><br></br>
              {ai == null? "": ai["report"]}
            </div> 
            </div>
            <Bottom ai = {ai}/>
            </>

            : ""}
    </>
    );
}