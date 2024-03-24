import '../../css/input.css';
export default function Tacho({score}) {
    function pickHex(score) {
        let weight = score;
        let color1 = [255, 0, 0];
        let color2 = [0, 255, 0];
        var w1 = weight;
        var w2 = 1 - w1;
        var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
            Math.round(color1[1] * w1 + color2[1] * w2),
            Math.round(color1[2] * w1 + color2[2] * w2)];
        //convert rgb to hex
        rgb = rgb.map(function(x) {
            x = x.toString(16);
            return (x.length === 1) ? "0" + x : x;
        });
        rgb = "#" + rgb.join("");
        return rgb;
    }
    
    return(
        <>
        <div class="w-full h-6 bg-gray-500 rounded-full dark:bg-gray-700">
        <div class="h-6 bg-blue-600 rounded-full" style={{'background-color' : pickHex(score), width: String(Math.round(score*100))+"%"}}></div>
        </div>
        </>
    );
    
   return (
    <div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ..."></div>
   );
}