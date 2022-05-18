function dda(x0, y0, x1, y1){
    var x;
    var dy = y1 - y0;
    var dx = x1 - x0;
    if(dx != 0){
        var m = dy/dx;
        var y = y0;

        for(x = x0; x < x1; x++){
            y = y + m;
            draw_pixel("orange",x,y);
        }
    }
    else{
        for(var i = Math.floor(Math.min(y0,y1)); i < Math.floor(Math.max(y0,y1));i++){
            draw_pixel("orange",x0,i);
        }
    }
}

function draw_dda(){
    var x0 = parseInt(document.getElementById("p1x").value);
    var x1 = parseInt(document.getElementById("p2x").value);
    var y0 = parseInt(document.getElementById("p1y").value);
    var y1 = parseInt(document.getElementById("p2y").value);

    if(x0 < x1){
        dda(x0,y0,x1,y1);
    }
    else{
        dda(x1,y1,x0,y0);
    }
}