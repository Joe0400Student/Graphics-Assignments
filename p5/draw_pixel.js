function draw_pixel(color,x,y){
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(x,y,1,1);
}

function clear_image(){
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,800,600);
}

function bezier_curve_clicker(){
    var x0 = parseInt(document.getElementById("p1x").value);
    var x1 = parseInt(document.getElementById("p2x").value);
    var x2 = parseInt(document.getElementById("p3x").value);
    var x3 = parseInt(document.getElementById("p4x").value);
    var y0 = parseInt(document.getElementById("p1y").value);
    var y1 = parseInt(document.getElementById("p2y").value);
    var y2 = parseInt(document.getElementById("p3y").value);
    var y3 = parseInt(document.getElementById("p4y").value);

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x0,y0);
    ctx.bezierCurveTo(x1,y1,x2,y2,x3,y3);
    ctx.stroke();

}

function drawLine(){
    var x0 = parseInt(document.getElementById("p1x").value);
    var x1 = parseInt(document.getElementById("p2x").value);
    var y0 = parseInt(document.getElementById("p1y").value);
    var y1 = parseInt(document.getElementById("p2y").value);
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x0,y0);
    ctx.lineTo(x1,y1);
    ctx.stroke();
}

function drawEllipse(){
    var x0 = parseInt(document.getElementById("p1x").value);
    var x1 = parseInt(document.getElementById("p2x").value);
    var y0 = parseInt(document.getElementById("p1y").value);
    var y1 = parseInt(document.getElementById("p2y").value);
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.ellipse(x0,y0,x1,y1,0,0,Math.PI*2);
    ctx.stroke();

}

function DrawCircle(){
    var x0 = parseInt(document.getElementById("p1x").value);
    var x1 = parseInt(document.getElementById("p2x").value);
    var y0 = parseInt(document.getElementById("p1y").value);
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(x0,y0,x1,0,Math.PI*2);
    ctx.stroke();
}