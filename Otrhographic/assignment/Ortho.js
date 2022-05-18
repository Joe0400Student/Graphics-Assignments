var pointsArray = [];
var colorsArray = [];

var left = -1.0;
var right = 1.0;
var ytop = 1.0;
var bottom = -1.0;
var near = -1;
var far = 10;
function getVerticeCount(){
    return pointsArray.length;
}
var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 ),
    vec4(.5,0,1,1),
    vec4(-.5,0,1,1)
];
var vertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 ),   // cyan
];
const up = vec3(0.0, 1.0, 0.0);

function Triangle(a,b,c,d){
    pointsArray.push(vertices[a]);
    pointsArray.push(vertices[b]);
    pointsArray.push(vertices[c]);
    for(var i = 0; i < 3;i++)
        colorsArray.push(vertexColors[d]);
}
function KeyFrameSetup(){
    X = 1;
    Y = 1;
    Z = 1;
    Theta = Math.PI/4;
    Phi = Math.PI/4;
    ActiveKeyFrame = new KeyFrame(0,0,2,0,0,0,0,1000);
    ActiveKeyFrame.appendToQueue(new KeyFrame(0,2,0,0,Math.PI/4,-Math.PI/2,500,1000));
    ActiveKeyFrame.appendToQueue(new KeyFrame(2,0,0,0,Math.PI/4,-3*Math.PI/4,1000,1500));
    ActiveKeyFrame.appendToQueue(new KeyFrame(3,5,2,0,Math.PI/4,-Math.PI,1500,2000));
    ActiveKeyFrame.appendToQueue(new KeyFrame(-Math.sqrt(2)*2,-Math.sqrt(2)*2,1,0,Math.PI/4,-5*Math.PI/4,2000,2500));
    ActiveKeyFrame.appendToQueue(new KeyFrame(0,-2,1,0,Math.PI/4,-3*Math.PI/2,2500,3000));
    ActiveKeyFrame.appendToQueue(new KeyFrame(Math.sqrt(2)*2,-Math.sqrt(2)*2,1,0,0,-7*Math.PI/2,3000,3500));
    ActiveKeyFrame.appendToQueue(new KeyFrame(0,0,1,0,0,-2*Math.PI,3500,4000));
    triggerAnimate = true;
    start_time = performance.now();
}


function randomizeHouseColors(){
    for(var i = 0; i < 8;i++){
        var c = vertexColors[Math.floor(Math.random() * vertexColors.length)];
        for(var j = 0; j < 6;j++){
            colorsArray[6*i+j] = c;
        }
    }
    var l = colorsArray.length - 1;
    var c = vertexColors[Math.floor(Math.random() * vertexColors.length)];
    colorsArray[l] = c;
    colorsArray[l - 1] = c;
    colorsArray[l - 2] = c;
    c = vertexColors[Math.floor(Math.random() * vertexColors.length)];
    colorsArray[l - 3] = c;
    colorsArray[l - 4] = c;
    colorsArray[l - 5] = c;
}

function MakeHouse(){

    Triangle(1,0,3,1);
    Triangle(1,3,2,1);

    Triangle(2,3,7,2);
    Triangle(2,7,6,2);

    Triangle(3,0,4,3);
    Triangle(3,4,7,3);

    Triangle(6,5,1,6);
    Triangle(6,1,2,6);

    Triangle(4,5,6,4);
    Triangle(4,6,7,4);
    
    Triangle(5,4,0,5);
    Triangle(5,0,1,5);
    //console.log(vertices.length);
    

    Triangle(1,9,2,0);
    Triangle(9,8,2,0);
    Triangle(9,8,3,4);
    Triangle(0,9,3,4);

    Triangle(1,9,0,2);
    Triangle(3,2,8,1);
    numVertices = pointsArray.length;
    randomizeHouseColors();
}

function generateLineEquation(a_x,a_y,b_x,b_y){
    var m = (a_y - b_y)/(a_x - b_x);
    var tmp = function(x){
        return x < b_x ? m*(x - a_x) + a_y : b_y;
    };
    return tmp;
}
function generateLine(base_x,base_y,base_z,end_x,end_y,end_z){
    
    triggerAnimate = true;
    current_time = performance.now();
    var a = new KeyFrame(base_x,base_y,base_z,0,0,0,current_time,current_time+1000);
    a.appendToQueue(new KeyFrame(end_x,end_y,end_z,0,0,0,current_time+1000,current_time+4000));
    ActiveKeyFrame = a;
    start_time=0;
}

var KeyFrames = null;
var triggerAnimate = false;

class KeyFrame{
    constructor(X,Y,Z,Rho,Phi,Theta,time_start,time_end){
        this.next = null;
        this.x = X;
        this.y = Y;
        this.z = Z;
        this.Rho = Rho;
        this.Phi = Phi
        this.Theta = Theta;
        this.time_start = time_start;
        this.time_end = time_end;
        this.iterated = false;
        this.during = false;
    }
    getIterated(time){
        
        if(time > this.time_end){
            this.iterated = true;
            this.during = false;
        }
        return this.iterated;
    }
    getNext(){
        return this.next;
    }
    appendToQueue(KeyFrame){
        if(this.next == null){
            this.next = KeyFrame;
        }
        else{
            this.next.appendToQueue(KeyFrame);
        }
    }
    calculateNextFrame(
        original_x, original_y, original_z,
        original_rho, original_phi ,original_theta,
        last_time_step, current_time){
        if(current_time + last_time_step > this.time_end){
            //console.log("throwing out the current k_frame");
            if(this.next != null){
                return this.next.calculateNextFrame(original_x,original_y,original_z,original_rho,original_phi,original_theta,last_time_step,current_time);
            }
            else{
                return {
                    X:original_x,
                    Y:original_y,
                    Z:original_z,
                    Rho:original_rho,
                    Phi:original_phi,
                    Theta:original_theta,
                    KeyframeActive:null
                };
            }
        }
        else if(current_time + last_time_step >= this.time_start){
            var X = generateLineEquation(current_time,original_x,this.time_end,this.x)(current_time + last_time_step);
            var Y = generateLineEquation(current_time,original_y,this.time_end,this.y)(current_time + last_time_step);
            var Z = generateLineEquation(current_time,original_z,this.time_end,this.z)(current_time + last_time_step);
            var rho = generateLineEquation(current_time,original_rho,this.time_end,this.Rho)(current_time + last_time_step);
            var phi = generateLineEquation(current_time,original_phi,this.time_end,this.Phi)(current_time + last_time_step);
            var theta = generateLineEquation(current_time,original_theta,this.time_end,this.Theta)(current_time + last_time_step);
            return {
                X:X,
                Y:Y,
                Z:Z,
                Rho:rho,
                Phi:phi,
                Theta:theta,
                KeyFrameActive:this
            };
        }
        else{
            return {
                X:original_x,
                Y:original_y,
                Z:original_z,
                Rho:original_rho,
                Phi:original_phi,
                Theta:original_theta,
                KeyframeActive:this
            }; 
        }
    }
};

var c_t = 0;
var X = 2;
var Y = 0;
var Z = 0;

var Rho = 0;
var Theta = 0;
var Phi = 0;

var start_time = 0;
var ActiveKeyFrame = null;

function renderLoop(){
    var current_time = performance.now() - start_time;
    var last_time_step = current_time - c_t;
    c_t = current_time;
    if(triggerAnimate){
        if(ActiveKeyFrame != null){
            var tmp = ActiveKeyFrame.calculateNextFrame(X,Y,Z,Rho,Phi,Theta,last_time_step,c_t);
            Phi = tmp.Phi;
            Theta = tmp.Theta;
            Rho = tmp.Rho;
            ActiveKeyFrame = tmp.KeyFrameActive;
            X = tmp.X;
            Y = tmp.Y;
            Z = tmp.Z;
            //console.log("calculated K_FRAME");
        }
        else{
            triggerAnimate = false;
        }
    }
    eye = vec3(X,Y,Z);
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    /*
    * Had to completely review Cylindrical Coordinates for this and 
    * It took a while to figure out the third axis PHI = at's PHI
    * 
    * Knowing this i simply cross product to get the normal of it, which
    * will be up.
    */
   
    var at = vec3(
        0,0,0
    );
    var up = vec3(0,0,1);
    

    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = ortho(left, right, bottom, ytop, near, far);
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

    gl.drawArrays( gl.TRIANGLES, 0, getVerticeCount() );
    requestAnimFrame(renderLoop);
}


window.onload = function init() {
    
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);
    MakeHouse();

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    

    var cBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);

    var vBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    
    document.getElementById("depthSlider").onchange = function(event) {
        far = event.target.value/2;
        near = -event.target.value/2;
    };

    document.getElementById("XSlider").onchange = function(event){
        X = event.target.value;
    };
    document.getElementById("YSlider").onchange = function(event){
        Y = event.target.value;
    };
    document.getElementById("ZSlider").onchange = function(event){
        Z = event.target.value;
    };

    document.getElementById("heightSlider").onchange = function(event) {
        ytop = event.target.value/2;
        bottom = -event.target.value/2;
    };
    document.getElementById("widthSlider").onchange = function(event) {
        right = event.target.value/2;
        left = -event.target.value/2;
    };
    renderLoop();
}