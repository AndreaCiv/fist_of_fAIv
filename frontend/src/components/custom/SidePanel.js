export default function SidePanel({showedRoad}){

    return (
        <>
            <div class="max-w-sm rounded overflow-hidden shadow-lg justify-items-center">
            <div class="px-6 py-4">
                <div class="font-bold text-xl mb-2">{showedRoad === null? "Via": showedRoad.name}</div>
                <p class="text-gray-700 text-base">
                Qui informazioni sulla strada
                </p>
            </div>
            <div class = "grid justify-items-center">
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2"> Report</button>
            </div>
            </div>
        </>
        );
};