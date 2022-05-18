

function show(id){
    document.getElementById(id).classList.toggle('show');
}

var layerVisible = false;
function togglelayers(){
    if(layerVisible){
        document.getElementById("layersBox").style.width="0px";
        layerVisible = false;
    }
    else{
        layerVisible = true;
        document.getElementById("layersBox").style.width="200px";
    }
}

