"use strict";

var canvas;
var gl;

var numVertices  = 42;

var pointsArray = [];
var colorsArray = [];

var current_time = 0;
var time_step = 0;
var time_offset = 0;

var current_anim_frame = null;
var out_of_time = null;
var iterating = false;

var vertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5, -0.5, -0.5, 1.0 ),
        vec4(0,1,.5,1),
        vec4(0,1,-.5,1)
    ];
/*
Triangle(8,9,6,2)

*/ 

var vertexColors = [
        vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
        vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
        vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
        vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
        vec4( 0.0, 1.0, 1.0, 1.0 ),   // cyan
        vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
    ];
/*
    Triangle(6,5,1,6);
    Triangle(6,1,2,6);*/
var near = -1;
var far = 10;
var radius = 1;
var theta  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

var left = -1.0;
var right = 1.0;
var ytop = 1.0;
var bottom = -1.0;
function generateLineEquation(a_x,a_y,b_x,b_y){
    var m = (a_y - b_y)/(a_x - b_x);
    if(m == NaN){
        console.log("m is nan");
    }
    var tmp = function(x){
        return x < b_x ? m*(x - a_x) + a_y : b_y;
    };
    return tmp;
}

function createLinearEquation(base_time,end_time,a_x,a_y,a_z,b_x,b_y,b_z){
    var a = new KeyFrame(b_x,b_y,b_z,0,0,0,base_time,end_time);
    var x = a_x;
    var y = a_y;
    var z = a_z;
    radius= Math.sqrt(x*x+y*y+z*z);
            theta = Math.asin(y/radius);
            phi = Math.asin(z/radius);
    iterating = true;
    time_offset = performance.now();
    return {
        in_time:function(time){
            return base_time <= current_time-time_offset && current_time-time_offset < end_time;
        },
        finished:function(time){
            return null == a;
        },
        next_function:function(time){
            var tmp = a.calculateNextFrame(x,y,z,0,0,0,time_step,current_time-time_offset);
            a = tmp.KeyFrameActive;
            x = tmp.X;
            y = tmp.Y;
            z = tmp.Z;
            console.log(`${x},${y},${z}`);
            radius= Math.sqrt(x*x+y*y+z*z);
            theta = Math.asin(y/radius);
            phi = Math.asin(z/radius);
        }
    };
}

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
            console.log("-----------");
        console.log(current_time + last_time_step);
        console.log(this.time_end);
        if(current_time + last_time_step > this.time_end){
            console.log("throwing out the current k_frame");
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

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

function quad(a, b, c, d) {
     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[b]);
     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[d]);
     colorsArray.push(vertexColors[a]);
}

function Triangle(a,b,c,d){
    pointsArray.push(vertices[a]);
    pointsArray.push(vertices[b]);
    pointsArray.push(vertices[c]);
    for(var i = 0; i < 3;i++)
        colorsArray.push(vertexColors[d]);
}

function colorCube()
{
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
    console.log(vertices.length);
    Triangle(5,9,6,2);
    Triangle(1,2,8,1);

    Triangle(8,9,1,3);
    Triangle(1,9,5,3);
    Triangle(8,9,2,4);
    Triangle(9,6,2,4);
    numVertices = pointsArray.length;
    

}


window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);


    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    colorCube();

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

// sliders for viewing parameters

    document.getElementById("depthSlider").onchange = function(event) {
        far = event.target.value/2;
        near = -event.target.value/2;
    };

    document.getElementById("radiusSlider").onchange = function(event) {
       radius = event.target.value;
    };
    document.getElementById("thetaSlider").onchange = function(event) {
        theta = event.target.value* Math.PI/180.0;
    };
    document.getElementById("phiSlider").onchange = function(event) {
        phi = event.target.value* Math.PI/180.0;
    };
    document.getElementById("heightSlider").onchange = function(event) {
        ytop = event.target.value/2;
        bottom = -event.target.value/2;
    };
    document.getElementById("widthSlider").onchange = function(event) {
        right = event.target.value/2;
        left = -event.target.value/2;
    };

    render();
}


var render = function() {
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        var ct = performance.now();
        time_step = ct - current_time;
        current_time = ct;
        if(iterating){
            if(current_anim_frame != null){
                if(current_anim_frame.in_time(ct-time_offset+time_step)){
                    current_anim_frame.next_function(ct-time_offset+time_step);
                }
                else if(current_anim_frame.finished(ct-time_offset+time_step)){
                    iterating = false;
                }
                else{
                    console.log("waiting");
                }
            }
            else{
                iterating = false;
            }
        
        }
        eye = vec3(radius*Math.sin(phi), radius*Math.sin(theta),
                radius*Math.cos(phi));
        modelViewMatrix = lookAt(eye, at , up);
        projectionMatrix = ortho(left, right, bottom, ytop, near, far);

        gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
        gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

        gl.drawArrays( gl.TRIANGLES, 0, numVertices );
        requestAnimFrame(render);
    }
