

class Program{
    shape = {
        RECTANGLE: 0,
        CIRCLE: 1,
        LINE: 2,
        POLYGON: 3,
        SQUARE: 4,
        ELLIPSE: 5,
        ARC: 6
    };
    
    constructor(ColorPickerID, canvasID, fieldID){
        this.color = new Color(ColorPickerID);
        this.field = new Field(fieldID);
        this.layers = new Array();
        this.undo = new Array();
        this.canvas = document.getElementById(canvasID);
        this.begin_angle = new Field("BeginAngle");
        this.end_angle = new Field("EndAngle");
        
        this.renderer = function(){
            var context = this.canvas.getContext("2d")
            context.clearRect(0,0,800,600);
            for(var i = 0; i < this.layers.length; i++){
                //console.log(this.layers[i].rendered_image.data[3]);
                this.layers[i].render(context);
            }
        }
        this.callback = function(){
            var context = this.canvas.getContext("2d")
            context.clearRect(0,0,800,600);
            for(var i = 0; i < this.layers.length; i++){
                
                this.layers[i].render(context);
            }
        }
        this.constructedShape = new Rectangle(this.callback,this.canvas,this.color);
        this.currentShape = this.shape.RECTANGLE;

    }
    mouseDown(evt){
        this.constructedShape.mouseDown(evt);

    }
    mouseMove(evt){
        this.constructedShape.mouseMove(evt);
    }
    mouseUp(evt){
        this.constructedShape.mouseUp(evt);
        var img = this.constructedShape.render();
        var center = this.constructedShape.getCenter();
        console.log(img.data[4]);
        var bmp;
        var tmp = function(obj) {
            obj.layers.push(new Layer(bmp, center[0], center[1]));
            console.log("made new object, adding it to the renderer set);")
            obj.constructedShape = null;
            switch(obj.currentShape){
                case obj.shape.RECTANGLE:
                    obj.constructedShape = new Rectangle(obj.callback, obj.canvas, obj.color);
                    break;
                case obj.shape.CIRCLE:
                    obj.constructedShape = new Circle(obj.callback, obj.canvas, obj.color);
                    break;
                case obj.shape.LINE:
                    obj.constructedShape = new Line(obj.callback, obj.canvas, obj.color);
                    break;
                case obj.shape.POLYGON:
                    obj.constructedShape = new Polygon(obj.callback, obj.canvas, obj.color, obj.field);
                    break;
                case obj.shape.SQUARE:
                    obj.constructedShape = new Square(obj.callback, obj.canvas, obj.color);
                    break;
                case obj.shape.ELLIPSE:
                    obj.constructedShape = new Ellipse(obj.callback,obj.canvas, obj.color);
                    break;
                case obj.shape.ARC:
                    obj.constructedShape = new Arc(obj.callback, obj.canvas, obj.color, obj.begin_angle, obj.end_angle);
                    break;
            }
            
            var context = obj.canvas.getContext('2d');
            context.clearRect(0,0,800,600);
            obj.renderer();
            renderEachLayer();
        }
        var tobj = this;
        createImageBitmap(img).then(
            function(a){
                bmp = a;
                tmp(tobj);
            }
        );/*
        this.layers.push(new Layer(bmp, center[0], center[1]));
        switch(this.currentShape){
            case this.shape.RECTANGLE:
                this.constructedShape = new Rectangle(this.callback, this.canvas, this.color);
                break;
            case this.shape.CIRCLE:
                this.constructedShape = new Circle(this.callback, this.canvas, this.color);
                break;
            case this.shape.LINE:
                this.constructedShape = new Line(this.callback, this.canvas, this.color);
                break;
            case this.shape.POLYGON:
                this.constructedShape = new Polygon(this.callback, this.canvas, this.color, this.field);
                break;
        }
        var context = this.canvas.getContext('2d');
        context.clearRect(0,0,800,600);
        this.renderer();*/
    }
    setShape(type){
        this.currentShape = type;
        switch(type){
            case this.shape.RECTANGLE:
                this.constructedShape = new Rectangle(this.callback, this.canvas, this.color);
                break;
            case this.shape.CIRCLE:
                this.constructedShape = new Circle(this.callback, this.canvas, this.color);
                break;
            case this.shape.LINE:
                this.constructedShape = new Line(this.callback, this.canvas, this.color);
                break;
            case this.shape.POLYGON:
                this.constructedShape = new Polygon(this.callback, this.canvas, this.color, this.field);
                break;
            case this.shape.SQUARE:
                this.constructedShape = new Square(this.callback, this.canvas, this.color);
                break;
            case this.shape.ELLIPSE:
                this.constructedShape = new Ellipse(this.callback, this.canvas, this.color);
                break;
            case this.shape.ARC:
                this.constructedShape = new Arc(this.callback, this.canvas, this.color, this.begin_angle,this.end_angle);
                break;
        }
    }

}


function scale(amount){
    var a = [];
    for(var i = 0; i < readableProgram.layers.length;i++){
        readableProgram.layers[i].Scale(amount);
    }
    for(var i = 0; i < readableProgram.layers.length;i++){
        a.push(readableProgram.layers[i].promise);
    }
    return Promise.allSettled(a).then(function(v){
        readableProgram.renderer();
    });
    
}

function rotate(amount){
    var a = [];
    for(var i = 0; i < readableProgram.layers.length;i++){
        readableProgram.layers[i].Rotate(amount);
    }
    for(var i = 0; i < readableProgram.layers.length;i++){
        a.push(readableProgram.layers[i].promise);
    }
    return Promise.allSettled(a).then(function(v){
        readableProgram.renderer();
    });

}

function testthing(){
    translate(10,10);   // For SOME reason, the HTML in chrome cant find translate, but the CONSOLE CAN! dont remove this function, its holding the test function up for some reason 
}                       // Its also ONLY in chrome this bug appears. Why? Maybe that it renders the HTML along side JS, and due to that, a race condition occurs trying to find the variable.

function translate(x,y){
    var a = [];
    for(var i = 0; i < readableProgram.layers.length;i++){
        readableProgram.layers[i].Translate(x,y);
    }
    for(var i = 0; i < readableProgram.layers.length;i++){
        a.push(readableProgram.layers[i].promise);
    }
    return Promise.allSettled(a).then(function(v){
        readableProgram.renderer();
    });
}

function undo(){
    if(readableProgram.layers.length != 0){
        readableProgram.undo.push(readableProgram.layers.pop());
        readableProgram.renderer();
    }
    renderEachLayer();
}
function redo(){
    if(readableProgram.undo.length != 0){
        readableProgram.layers.push(readableProgram.undo.pop());
        readableProgram.renderer();
    }
    renderEachLayer();
}
var ids = [];
var readableProgram = null;

window.onload = function(){
    var program = new Program("inside","canvas","number");
    readableProgram = program;
    readableProgram.field.field.value = 5;
    ids.push(program.canvas.addEventListener("mousedown", 
        function(e){
            //console.log("mousedown");
            readableProgram.mouseDown(e); }));
    ids.push(program.canvas.addEventListener("mousemove", 
        function(e){ 
            //console.log("mousemove");
            readableProgram.mouseMove(e); }));
    ids.push(program.canvas.addEventListener("mouseup", 
        function(e){ 
            //console.log("mouseup");
            readableProgram.mouseUp(e); }));
    program.callback = function(){ program.renderer(); };
    program.constructedShape = new Rectangle(program.callback, program.canvas, program.color);
    document.addEventListener("keydown",function(evt){
        if(evt.ctrlKey && evt.key === 'z'){
            undo();
            renderEachLayer();
        }
        if(evt.ctrlKey && evt.key === 'y'){
            redo();
            renderEachLayer();
        }
        if(evt.ctrlKey && evt.key === 'c'){
            copy();
        }
        if(evt.ctrlKey && evt.key === 'v'){
            paste();
            renderEachLayer();
        }
    })

    document.getElementById("file_input").onchange = function(evt){
        console.log("opened file");
        var r = new FileReader(); 
        r.onload = function(){
            var fileContent = JSON.parse(r.result);
            var undoRequirements = [];
            var renderedRequirements = [];
            for(var i = 0; i < fileContent.layers.length; i++){
                var img = getDataFromImageData(fileContent.layers[i].rendered_image);
                var x = Promise.resolve(fileContent.layers[i].x);
                var y = Promise.resolve(fileContent.layers[i].y);
                renderedRequirements.push(img);
                renderedRequirements.push(x);
                renderedRequirements.push(y);
            }
            for(var i = 0; i < fileContent.undo.length; i++){
                var img = getDataFromImageData(fileContent.undo[i].rendered_image);
                var x = Promise.resolve(fileContent.undo[i].x);
                var y = Promise.resolve(fileContent.undo[i].y);
                undoRequirements.push(img);
                undoRequirements.push(x);
                undoRequirements.push(y);
            }
            var new_layers = [];
            var new_undo = [];

            Promise.allSettled(renderedRequirements).then(function(reqs){
                for(var i = 0; i < reqs.length; i += 3){
                    new_layers.push(new Layer(reqs[i].value, reqs[i + 1].value, reqs[i + 2]));
                }
                Promise.allSettled(undoRequirements).then(function(n_reqs){
                    for(var i = 0; i < n_reqs.length; i += 3){
                        new_undo.push(new Layer(n_reqs[i].value, n_reqs[i + 1].value, n_reqs[i + 2]));
                    }
                    readableProgram.layers = new_layers;
                    readableProgram.undo = new_undo;
                    readableProgram.renderer();
                });
            });
        }
        r.readAsText(document.getElementById("file_input").files[0]);
    }
}

function getDataFromImageData(val){
    var tmp = val.split(',');
    for(var i = 0; i < tmp.length;i++){
        tmp[i] = parseInt(tmp[i]);
    }
    return createImageBitmap(new ImageData(new Uint8ClampedArray(tmp),800,600));
}

function exportJson(){
    var json = JSON.stringify(readableProgram);
    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
      
        element.style.display = 'none';
        document.body.appendChild(element);
      
        element.click();
      
        document.body.removeChild(element);
    }
    download("Document.json",json);

}


function autoTesting(){
    var rect = new Rectangle(readableProgram.callback,readableProgram.canvas,readableProgram.color);
    rect.x = 350;
    rect.y = 250;
    rect.h = 350;
    rect.w = 450;
    readableProgram.color.element.value="#FF0000";
    var a = rect.getCenter();
    readableProgram.layers.push( new Layer(rect.render(),a[0],a[1]));
    readableProgram.color.element.value="#00FF00";
    var circle = new Circle(readableProgram.callback,readableProgram.canvas,readableProgram.color);
    circle.x = 400;
    circle.y = 400;
    circle.r = 20;
    a = circle.getCenter();
    readableProgram.layers.push( new Layer(circle.render(),a[0],a[1]));
    var line = new Line(readableProgram.callback,readableProgram.canvas,readableProgram.color);
    readableProgram.color.element.value="#0000FF";
    line.x = 220;
    line.y = 420;
    line.h = -200;
    line.w = -400;
    a = line.getCenter();
    readableProgram.layers.push( new Layer(line.render(),a[0],a[1]));
    var triangle = new Polygon(readableProgram.callback,readableProgram.canvas,readableProgram.color,readableProgram.field);
    readableProgram.field.field.value = 3;
    readableProgram.color.element.value = "#7F007F";
    triangle.x = 100;
    triangle.y = 100;
    triangle.r = 50;
    a = triangle.getCenter();
    readableProgram.layers.push(new Layer(triangle.render(),a[0],a[1]));
    var polygon = new Polygon(readableProgram.callback,readableProgram.canvas,readableProgram.color,readableProgram.field);
    readableProgram.field.field.value = 5;
    readableProgram.color.element.value = "#7F7F00";
    polygon.x = 150;
    polygon.y = 150;
    polygon.r = 50;
    a = polygon.getCenter();
    readableProgram.layers.push(new Layer(polygon.render(), a[0],a[1]));
    var tmp = readableProgram.layers;
    var n_temp = [];
    for(var i = 0; i < tmp.length; i++){
        n_temp.push(createImageBitmap(tmp[i].rendered_image));
        n_temp.push(Promise.resolve(tmp[i].x));
        n_temp.push(Promise.resolve(tmp[i].y));
    } 
    readableProgram.layers = [];
    Promise.allSettled(n_temp).then(function(segments){
        for(var i = 0; i < segments.length; i+=3){
            readableProgram.layers.push(new Layer(segments[i].value, segments[i+1].value, segments[i+2].value));
        }
        readableProgram.renderer();
    });
    
}

function allClear(){
    var a = [];
    for(var i = 0; i < readableProgram.layers.length; i++){
        a.push(readableProgram.layers[i].promise);
    }
    return Promise.allSettled(a)
}

var copy_val = null;

var selected_id = 0;


function set_id(id){
    selected_id = id;
}
function copy(){
    copy_val = readableProgram.layers[selected_id];
}

function paste(){
    if(copy_val != null){
        readableProgram.layers.push(copy_val);
        readableProgram.renderer();
    }
}


function collapseToBitmap(){
    readableProgram.renderer();
    var png = readableProgram.canvas.toDataURL("image/png");
    var newTab = window.open("about:blank","image from canvas");
    newTab.document.write("<img src='" + png + "'/>");
}


function renderEachLayer(){
    var LayersURLS = [];
    document.getElementById("layersBox").innerHTML = "";
    for(var i = 0; i < readableProgram.layers.length;i++){
        LayersURLS.push(readableProgram.layers[i].getImageURL());
        document.getElementById("layersBox").innerHTML += "<button id='button'" + i + "' onclick='set_id(" + i + ");'> <img width=150 height=120 src='" +LayersURLS[i] +"'/></button><br>";
    }
    //document.getElementById("layersBox").innerHTML = "<br><br><br><br><br>";
    return LayersURLS;
}



function scale_id(){
    var scaling_factor = new Field("ScalingFactor");
    var rotation_angle = new Field("RotationAngle");
    var X_Chg = new Field("XChg");
    var Y_Chg = new Field("YChg");
    readableProgram.layers[selected_id].Scale(scaling_factor.value()/100);
    readableProgram.layers[selected_id].promise.then(function(v){
        readableProgram.renderer();
        renderEachLayer();
    });
}

function rotate_id(){
    var scaling_factor = new Field("ScalingFactor");
    var rotation_angle = new Field("RotationAngle");
    var X_Chg = new Field("XChg");
    var Y_Chg = new Field("YChg");
    readableProgram.layers[selected_id].Rotate(rotation_angle.value()/180*Math.PI);
    readableProgram.layers[selected_id].promise.then(function(v){
        readableProgram.renderer();
        renderEachLayer();
    });
}
function translate_id(){
    var scaling_factor = new Field("ScalingFactor");
    var rotation_angle = new Field("RotationAngle");
    var X_Chg = new Field("XChg");
    var Y_Chg = new Field("YChg");
    readableProgram.layers[selected_id].Translate(X_Chg.value(),Y_Chg.value());
    readableProgram.layers[selected_id].promise.then(function(v){
        readableProgram.renderer();
        renderEachLayer();
    });
}
function tarnslate_id(){
    translate_id();
}
function download_image(){
    var a = document.getElementById("image_save_box");
    readableProgram.renderer();
    a.innerHTML = "<a id='download_here' href='" + document.getElementById("canvas").toDataURL("image/png") + "' download>";
    document.getElementById("download_here").click();
    
}

function clear(){
    readableProgram.layers = [];
    readableProgram.undo = [];
    readableProgram.redo = [];
    readableProgram.renderer();
    renderEachLayer();
}