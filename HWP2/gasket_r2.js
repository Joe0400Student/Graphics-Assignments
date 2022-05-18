


/*
* Made by Joseph Scannell
* Supports fast single frame render so it runs fast.
* Made to be OO so its easier to understand.
*/


///////////////////////////////////////////
//░░░░░░░░░░░▄▀▄▀▀▀▀▄▀▄░░░░░░░░░░░░░░░░░░//
//░░░░░░░░░░░█░░░░░░░░▀▄░░░░░░▄░░░░░░░░░░//
//░░░░░░░░░░█░░▀░░▀░░░░░▀▄▄░░█░█░░░░░░░░░//
//░░░░░░░░░░█░▄░█▀░▄░░░░░░░▀▀░░█░░░░░░░░░//
//░░░░░░░░░░█░░▀▀▀▀░░░░░░░░░░░░█░░░░░░░░░//
//░░░░░░░░░░█░░░░░░░░░░░░░░░░░░█░░░░░░░░░//
//░░░░░░░░░░█░░░░░░░░░░░░░░░░░░█░░░░░░░░░//
//░░░░░░░░░░░█░░▄▄░░▄▄▄▄░░▄▄░░█░░░░░░░░░░//
//░░░░░░░░░░░█░▄▀█░▄▀░░█░▄▀█░▄▀░░░░░░░░░░//
//░░░░░░░░░░░░▀░░░▀░░░░░▀░░░▀░░░░░░░░░░░░//
///////////////////////////////////////////

var vertShader = `
attribute vec4 vPosition;
attribute vec4 color;
varying vec4 vColor;
void main(){
    gl_PointSize = 1.0;
    gl_Position = vPosition;
    vColor = color;
}
`;

var fragShader = `
precision mediump float;
varying vec4 vColor;

void main(){
    gl_FragColor = vColor;
}
`;


class Color{
    constructor(r,g,b,a=255){
        this.R = r;
        this.G = g;
        this.B = b;
        this.A = a;
    }
    normalize(){
        this.R = this.R/255.0;
            this.G = this.G/255.0;
            this.B = this.B/255.0;
            this.A = this.A/255.0;
    }
    updateColor(id){
        var colorPicker = document.getElementById(id);
        var string = colorPicker.value;
        var redS   = string.substring(1,3);
        var greenS = string.substring(3,5);
        var blueS = string.substring(5,7);
        if(0.0 <= this.A <= 1.0){
            this.R = parseInt(redS, 16)   / 255.0;
            this.G = parseInt(greenS, 16) / 255.0;
            this.B = parseInt(blueS, 16)  / 255.0;
            this.A = 1.0;
        } else {
            this.R = parseInt(redS, 16);
            this.G = parseInt(greenS, 16);
            this.B = parseInt(blueS, 16);
            this.A = 255;
        
        }
        return this;
    }
    getRed(){
        return this.R;
    }
    getGreen(){
        return this.G;
    }
    getBlue(){
        return this.B;
    }
    getAlpha(){
        return this.A;
    }
    toFloat32Vector(){
        return vec4(this.R, this.G, this.B, this.A);
    }
    hexify(){
        return "#" + ("00"+this.R.toString(16)).substr(-2) + ("00"+this.G.toString(16)).substr(-2) + ("00"+this.B.toString(16)).substr(-2);
    }
}

class Coordinate{
    constructor(x,y){
        this.X = x;
        this.Y = y;
    }
    getX(){
        return this.X;
    }
    getY(){
        return this.Y;
    }
    scaleX(scaling_factor){
        this.X *= scaling_factor;
    }
    scaleY(scaling_factor){
        this.Y *= scaling_factor;
    }
    scale(coordinate){
        var copy = this.makeCopy();
        copy.scaleX(coordinate.getX());
        copy.scaleY(coordinate.getY());
        return copy;
    }
    offsetX(offset){
        this.X += offset;
    }
    offsetY(offset){
        this.Y += offset;
    }
    offsetCoord(coordinate){
        this.offsetX(coordinate.getX());
        this.offsetY(coordinate.getY());
    }
    convertVec2(){
        return vec2( this.getX(), this.getY() );
    }
    makeCopy(){
        return new Coordinate(this.getX(), this.getY());
    }
}

var colors = [];
var points = [];

var program = null;
var gl = null;
var canvas = null;
var pBuffer = null;
var cBuffer = null;

var vPosLocation = null;
var colorLocation = null;

var iters = null;
var counts = null;
var scaleX = null;
var scaleY = null;
var scaling = new Coordinate(1.0, 1.0);

var pointsBuffer = [];
var colorBuffer = [];

var vertices = [
    new Coordinate( -1, -1 ),
    new Coordinate(  0,  1 ),
    new Coordinate(  1, -1 ) 
];

var generateColorPicker = function(i){
    return '<div class="col"><input type="color" class="form-control form-control-color" id="ColorPicker' + i.toString() + '" value="#000000" title="Choose your color" style="height: 40px; width: 40px;" onchange="updateColor()"></div>';
}


var WHITE = new Color(1.0,1.0,1.0,1.0)

var generateColors = function(){
    onUpdateLoad();
    var settings_list = document.getElementById("ColorPickers");
    settings_list.innerHTML = "";
    colors = []
    for(var i = 0; i <  iters.value; i++){
        if(i % 2 == 0){
            settings_list.innerHTML += '<div class="row no-gutters justify-content-md-center" id="' + i.toString() + '"></div>';
        }
        var id = i - (i % 2);
        document.getElementById(id.toString()).innerHTML += generateColorPicker(i);
        colors.push(new Color(0,0,0,1.0));
    }
}


var onUpdateLoad = function(){
    iters = document.getElementById("iters");
    counts = document.getElementById("counts");
    scaleX = document.getElementById("scaleX");
    scaleY = document.getElementById("scaleY");
}

window.onload = function init(){
    clearStatus();
    generateColors();
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl){
        addStatus("WEBGL UNABLE TO INIT!!!!");
        console.log("WEBGL UNABLE TO INIT!!!!");
        return;
    }
    addStatus("WEBGL SUCCESSFULLY BINDED TO CANVAS!");
    gl.viewport(0,0,canvas.width, canvas.height);
    gl.clearColor(WHITE.getRed(), WHITE.getGreen(), WHITE.getBlue(), WHITE.getAlpha());
    gl.clear(gl.COLOR_BUFFER_BIT);
    program = initShaderFromString(gl, vertShader, fragShader);
    addStatus("Compiled Shader Programs");
    gl.useProgram(program);
    pBuffer = gl.createBuffer();
    cBuffer = gl.createBuffer();
    vPosLocation = gl.getAttribLocation(program,"vPosition");
    colorLocation = gl.getAttribLocation(program,"color");
    onUpdateLoad();
    generate();
    render();
}

var updateColor = function(){
    addStatus("<br>updating all colors using updateColor();");
    for(var i = 0; i < iters.value; i++){
        console.log("reading ColorPicker" + i.toString());
        colors[i].updateColor("ColorPicker" + i.toString());
        console.log(colors[i].toFloat32Vector().toString());
    }
    render();
}

var updateScale = function(){
    addStatus("scaling the pre-rendered image by percentages");
    scaleX = document.getElementById("scaleX");
    scaleY = document.getElementById("scaleY");
    scaling = new Coordinate(scaleX.value / 100.0, scaleY.value / 100.0);
    render();
}

var render = function(){
    addStatus("Calling render();");
    addStatus("---------------");
    gl.clear(gl.COLOR_BUFFER_BIT);
  
   colorBuffer = [];
    for(var i = 0; i < colors.length; i++){
        for(var j = 0; j < counts.value; j++){
            //console.log("Writing " + colors[i].toFloat32Vector().toString() + " to " + j.toString());
            colorBuffer.push(colors[i].toFloat32Vector());
        }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,flatten(colorBuffer),gl.STATIC_DRAW);
    gl.vertexAttribPointer(colorLocation,4,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(colorLocation);

    pointsBuffer = new Array(points.length);
    for(var i = 0; i < points.length; i++){
        pointsBuffer[i] = points[i].scale(scaling).convertVec2();
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, pBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsBuffer),gl.STATIC_DRAW);
    addStatus("copied over data to buffers for shaders");
    gl.vertexAttribPointer(vPosLocation,2,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(vPosLocation);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS,0,points.length);
    addStatus("drawArrays call performed");
    gl.flush();
    gl.finish();
    addStatus("flush and finish called");
}
var generate_single_iteration = function() {
    var u = new Coordinate(
        vertices[0].getX() + vertices[1].getX(),
        vertices[0].getY() + vertices[1].getY()
    );
    var v = new Coordinate(
        vertices[0].getX() + vertices[2].getX(),
        vertices[0].getY() + vertices[2].getY()
    );
    var p = new Coordinate(
        u.getX() + v.getX(),
        u.getY() + v.getY()
    ).scale( new Coordinate(
        0.25,
        0.25
    ));
    var tmp_points = [ p ];
    for(var j = 0; tmp_points.length < counts.value; ++j){
        var k = Math.floor(Math.random() * 3);
        p = new Coordinate(
            tmp_points[j].getX() + vertices[k].getX(),
            tmp_points[j].getY() + vertices[k].getY()
        ).scale( new Coordinate(
            0.5,
            0.5
        ));
        tmp_points.push(p);
    }
    return tmp_points;
}
var progressbar = document.getElementById("progressbar");
var generate = function(){
    addStatus("Calling generate();");
    addStatus("--------------");
    points = [];
    for(var i = 0; i < iters.value; i ++){

        points.push(generate_single_iteration());
        addStatus("Generated " + (i+1).toString() + " iterations so far");
    }
    points = [].concat(...points);
}

var initShaderFromString = function(gl, vertexShader, fragmentShader){
    var vertShdr;
    var fragShdr;
    vertShdr = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShdr, vertexShader);
    gl.compileShader(vertShdr);
    if(!gl.getShaderParameter(vertShdr, gl.COMPILE_STATUS)){
        var msg = "Vertex Shader failed to compile. Ther error log is:" + 
        "<pre>" + gl.getShaderInfoLog(vertShdr) + "</pre>";
        alert( msg );
        return -1;
    }
    fragShdr = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShdr, fragmentShader);
    gl.compileShader(fragShdr);
    if ( !gl.getShaderParameter(fragShdr, gl.COMPILE_STATUS) ) {
        var msg = "Fragment shader failed to compile.  The error log is:"
        + "<pre>" + gl.getShaderInfoLog( fragShdr ) + "</pre>";
        alert( msg );
        return -1;
    }
    var program = gl.createProgram();
    gl.attachShader( program, vertShdr );
    gl.attachShader( program, fragShdr );
    gl.linkProgram( program );
    
    if ( !gl.getProgramParameter(program, gl.LINK_STATUS) ) {
        var msg = "Shader program failed to link.  The error log is:"
            + "<pre>" + gl.getProgramInfoLog( program ) + "</pre>";
        alert( msg );
        return -1;
    }

    return program;
}

var generateRandomColor = function(){
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return {
        color: new Color(r/255.0, g/255.0, b/255.0, 1.0),
        RGBString: "#" + ("00"+r.toString(16)).substr(-2) + ("00"+g.toString(16)).substr(-2) + ("00"+b.toString(16)).substr(-2)
    };
}

var random_generate = function(){
    counts.value = Math.trunc(Math.random() * 19 + 1) * 500;
    iters.value = Math.trunc(Math.random()* 49 + 1);
    generateColors();
    for(var i = 0; i < iters.value; i++){
        var randomization = generateRandomColor();
        colors[i] = randomization.color;
        document.getElementById("ColorPicker" + i.toString()).value = randomization.RGBString;
    }
    scaleX.value = Math.trunc(Math.random() * 199 + 1);
    scaleY.value = Math.trunc(Math.random() * 199 + 1);
    scaling = new Coordinate(scaleX.value / 200.0, scaleY.value / 200.0);
    generate();
    render(); 
}

var setColor = function(c){
    colors[0] = c;
    document.getElementById("ColorPicker0").value = c.hexify();
    c.normalize();
    colors[0] = c;
};

var changeScale = function(scaleValue){
    scaleX.value = Math.trunc( scaleValue * 100 );
    scaleY.value = Math.trunc( scaleValue * 100 );
    scaling = new Coordinate(scaleValue, scaleValue);
    render();
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

var presetColors = [
    new Color( 0  , 0  , 0  , 255 ),
    new Color( 255, 0  , 0  , 255 ),
    new Color( 0  , 255, 0  , 255 ),
    new Color( 0  , 0  , 255, 255 ),
    new Color( 255, 127, 0  , 255 ),
    new Color( 128, 0  , 128, 255 ),
    new Color( 255, 129, 203, 255 ),
    new Color( 0  , 255, 255, 255 ),
    new Color( 255, 255, 0  , 255 ),
    new Color( 77 , 40 , 0  , 255 )
];

var position = 0;

function start(){
    if(!finished){
        iters.value = 1;
        counts.value = 10000;
        generateColors();
        renderMultipleIterations();
    }
    else{
        location.reload(true);
    }
}

var direction = 1;
var cen = 1.1;
var finished = false;

function rotateBackAndForth(){
    if(direction != 1 || cen != 1.0){
        clearStatus();
        changeScale(cen);
        cen += direction/10;
        if(cen >= 2.0 || cen <=  0.1){
            direction = -direction;
        }
        setTimeout(rotateBackAndForth,40);
    }
    else{
        direction = 1;
        cen = 1.1;
    }
}


function renderMultipleIterations(){
    if(position < presetColors.length){
        generate();
        setColor(presetColors[position]);
        addStatus("changed color of the implementation");
        rotateBackAndForth();
        progressbar.style = "width: " + ((position+1)/presetColors.length * 100).toString() + "%";
        position++;
        counts.value = parseInt(counts.value) - 500;
        setTimeout(renderMultipleIterations, 6000);
        
    }
    else{
        finished = true;
        position = 0;
    }
}



var test = function(){
    generate();
    for( var i = 0; i < 100 ; i++){
        
        render();
    }
}

var times = 0;
function generateTenRandom(){
    if(times < 10){
        random_generate();
        times++;
        setTimeout(generateTenRandom,100);
    }
    else{
        times = 0;
    }
}

function clearStatus(){
    var status = document.getElementById("text_output");
    status.innerHTML = "";
}

function addStatus(status){
    var Status = document.getElementById("text_output");
    Status.innerHTML += status.toString() + "<br>";
}