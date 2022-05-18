function MidpointEllipse(rx,ry,xc,yc){
    var dx,dy,d1,d2,x,y;
    x = 0;
    y = ry;

    d1 = (ry * ry) - (rx * rx * ry) + (rx * rx *.25);

    dx = 2 * ry * ry * x;
    dy = 2 * rx * rx * y;

    while(dx < dy){
        draw_pixel("red",x + xc, y + yc);
        draw_pixel("red",-x + xc, y + yc);
        draw_pixel("red",x + xc, -y + yc);
        draw_pixel("red",-x + xc,-y + yc);

        if(d1 < 0){
            x++;
            dx = dx + (2 * ry * ry);
            d1 = d1 + dx + (ry * ry);
        }

        else{
            x++;
            y--;
            dx = dx + (2 * ry * ry);
            dy = dy - (2 * rx * rx);
            d1 = d1 + dx - dy + (ry * ry);
        }
    }
    d2 = ((ry * ry) * ((x + 0.5) * (x + 0.5))) + 
         ((rx * rx) * ((y - 1) * (y - 1))) -
          (rx * rx * ry * ry);

    while (y >= 0){
        draw_pixel("red",x + xc, y + yc);
        draw_pixel("red",-x + xc, y + yc);
        draw_pixel("red",x + xc, -y + yc);
        draw_pixel("red",-x + xc,-y + yc);

        if(d2 > 0){
            y--;
            dy = dy - (2* rx * rx);
            d2 = d2 + (rx * rx) - dy;
        }
        else{
            y--;
            x++;
            dx = dx + (2 * ry * ry);
            dy = dy - (2 * rx * rx);
            d2 = d2 + dx - dy + (rx * rx);
        }
    }
}

function draw_midpoint_ellipse(){
    var rx = parseInt(document.getElementById("p2x").value);
    var ry = parseInt(document.getElementById("p2y").value);
    var bx = parseInt(document.getElementById("p1x").value);
    var by = parseInt(document.getElementById("p1y").value);

    MidpointEllipse(rx,ry,bx,by);
}