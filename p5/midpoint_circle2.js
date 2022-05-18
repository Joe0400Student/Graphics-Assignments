function MidpointCircle(radius,center_x,center_y){
    var x = radius;
    var y = 0;
    var P = 1 - radius;

    while(x > y){
        y++;
        if( P <= 0){
            P = P + 2*y + 1;
        }
        else{
            x--;
            P = P + 2*y - 2*x + 1;
        }
        draw_pixel("green",x + center_x, y + center_y);
        draw_pixel("green",-x + center_x, y + center_y);
        draw_pixel("green",x + center_x, -y + center_y);
        draw_pixel("green",-x + center_x, -y +center_y);
        if(x != y){
            draw_pixel("green", y + center_x, x + center_y);
            draw_pixel("green", -y + center_x, x + center_y);
            draw_pixel("green", y + center_x, -x + center_y);
            draw_pixel("green", -y + center_x, -x + center_y);
        }
    }
}


function DrawMidpointCircle(){
    var r = document.getElementById("p2x").value;
    var x = document.getElementById("p1x").value;
    var y = document.getElementById("p1y").value;
    console.log((r));
    MidpointCircle(parseInt(r),parseInt(x),parseInt(y));
}