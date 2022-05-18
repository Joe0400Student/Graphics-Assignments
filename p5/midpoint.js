function MidpointLine(x1, y1, x2, y2){
    var dx = x2 - x1;
    var dy = y2 - y1;
    
    if( dy <= dx ){
        var d = dy - (dx/2);
        var x = x1;
        var y = y1;

        draw_pixel("blue",x,y);

        while( x < x2 ){
            x++;
            if( d < 0 ){
                d = d + dy;
            }
            else{
                d = d + ( dy - dx );
                y++;
            }
            draw_pixel("blue",x,y);
        }
    }
    else if( dx < dy ){
        var d = dx - (dy/2);
        var x = x1;
        var y = y1;

        draw_pixel("blue",x,y);
        while( y < y2 ){
            y++;
            if( d < 0 ){
                d = d + dx;
            }
            else{
                d = d + ( dx - dy );
                x++;
            }
            draw_pixel("blue",x,y);
        }
    }
}

function draw_midpoint_line(){
    var x1 = parseInt(document.getElementById("p1x").value);
    var x2 = parseInt(document.getElementById("p2x").value);
    var y1 = parseInt(document.getElementById("p1y").value);
    var y2 = parseInt(document.getElementById("p2y").value);
    if(x1 < x2){
        MidpointLine(x1,y1,x2,y2);
    }
    else{
        MidpointLine(x2,y2,x1,y1);
    }
}