

class point_s{
    constructor(t_x,t_y){
        this.x = t_x;
        this.y = t_y;
    }
}

function hermite(n, p1, p4, r1, r4){
    var i;
    var x,y,z;
    var d = 1.0/n;
    x = p1.x;
    y = p1.y;
    t = 0.0;
    for(i = 0; i < n; i++){
        t += d;
        var t2 = t * t;
        var t3 = t2 * t;
        x = ((2*t3)-(3*t2)+1)*p1.x + ((-2*t3)+(3*t2))*p4.x + (t3-(2*t2)+t)*r1.x + (t3-t2)*r4.x;
        y = ((2*t3)-(3*t2)+1)*p1.y + ((-2*t3)+(3*t2))*p4.y + (t3-(2*t2)+t)*r1.y + (t3-t2)*r4.y;
        draw_pixel("red",x,y);
    }
}

function bezier(n, p1, p2, p3, p4){
    var x = p1.x;
    var y = p1.y;
    for(var u = 0; u <= 1.0; u += 0.0001){
        x = Math.pow(1-u,3)*p1.x+3*u*Math.pow(1-u,2)*p2.x+3*Math.pow(u,2)*(1-u)*p3.x+Math.pow(u,3)*p4.x;
        y = Math.pow(1-u,3)*p1.y+3*u*Math.pow(1-u,2)*p2.y+3*Math.pow(u,2)*(1-u)*p3.y+Math.pow(u,3)*p4.y;
        draw_pixel("blue",x,y);
    }
}
function spline(n, p1, p2, p3, p4){
    var i;
    var x, y, z;
    var d = 1.0/n;
    var t;
    x = p1.x;
    y = p1.y;
    t = 0.0;
    for(i = 0; i < n; i++){
        t += d;
        var t2 = t*t;
        var t3=t2*t;
        x = (((1-t3)/6)*p1.x)+(((3*t3-6*t2+4)/6)*p2.x)+(((-3*t3+3*t2+3*t+1)/6)*p3.x)+((t3/6)*p4.x);
        y = (((1-t3)/6)*p1.y)+(((3*t3-6*t2+4)/6)*p3.y)+(((-3*t3+3*t2+3*t+1)/6)*p3.y)+((t3/6)*p4.y);
        draw_pixel("green",x,y);
    }
}

function draw_hermite(){
    var p1x = document.getElementById("p1x").value;
    var p2x = document.getElementById("p2x").value;
    var p3x = document.getElementById("p3x").value;
    var p4x = document.getElementById("p4x").value;
    var p1y = document.getElementById("p1y").value;
    var p2y = document.getElementById("p2y").value;
    var p3y = document.getElementById("p3y").value;
    var p4y = document.getElementById("p4y").value;

    hermite(10000, new point_s(p1x,p1y), new point_s(p2x,p2y), new point_s(p3x,p3y), new point_s(p4x,p4y));
    
}
function draw_bezier(){
    var p1x = document.getElementById("p1x").value;
    var p2x = document.getElementById("p2x").value;
    var p3x = document.getElementById("p3x").value;
    var p4x = document.getElementById("p4x").value;
    var p1y = document.getElementById("p1y").value;
    var p2y = document.getElementById("p2y").value;
    var p3y = document.getElementById("p3y").value;
    var p4y = document.getElementById("p4y").value;

    bezier(10000, new point_s(p1x,p1y), new point_s(p3x,p3y), new point_s(p2x,p2y), new point_s(p4x,p4y));
    
}
function draw_spline(){
    var p1x = document.getElementById("p1x").value;
    var p2x = document.getElementById("p2x").value;
    var p3x = document.getElementById("p3x").value;
    var p4x = document.getElementById("p4x").value;
    var p1y = document.getElementById("p1y").value;
    var p2y = document.getElementById("p2y").value;
    var p3y = document.getElementById("p3y").value;
    var p4y = document.getElementById("p4y").value;

    spline(10000, new point_s(p1x,p1y), new point_s(p2x,p2y), new point_s(p3x,p3y), new point_s(p4x,p4y));
    
}