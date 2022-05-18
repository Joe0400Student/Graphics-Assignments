
// TODO implement button features
// TODO implement callback builders for reshape
// TODO implement EventLoop
// TODO implement render queue
// TODO implement timer basead drawing and updating.




class Drawable{
    constructor(){}
    draw(canvas){
        throw new Error("Draw is not implemented");
    }
}


var instance = null;


function getInstance(){
    class EventHandler{
        constructor(){
            this.onclick = [];
            this.testOnClick = [];
            this.onmouseup = [];
            this.testOnMouseUp
        }
        onClick(){
            for(var i = 0; i < this.onclick.length; i++){
                if(this.testOnClick[i]()){
                    this.onclick();
                }
            }
        }
        onMouseUp(){
            for(var i = 0; i < this.onmouseup.length; i++){
                if(this.testOnMouseUp[i]()){
                    this.onmouseup[i]();
                }
            }
        }
        addOnClick(newevent, test){
            this.onclick.push(newevent);
            this.testOnClick.push(test);
        }
        addOnMouseUp(newevent, test){
            this.onmouseup.push(newevent);
            this.testOnMouseUp.push(test);
        }
        removeOnClick(test){
            for(var i = 0; i <this.onclick.length;i++){
                if(this.testOnClick[i] == test){
                    this.testOnClick[i] = this.testOnClick[this.onclick.length - 1];
                    this.testOnClick.pop();
                    this.onclick[i] = this.onclick[this.onclick.length - 1];
                    this.onclick.pop();
                    return;
                }
            }
        }
        removeMouseUp(test){
            for(var i = 0; i < this.onmouseup.length;i++){
                if(this.testOnMouseUp[i] == test){
                    this.testOnMouseUp[i] = this.testOnMouseUp[this.onmouseup.length - 1];
                    this.testOnMouseUp.pop();
                    this.onmouseup[i] = this.onmouseup[this.onmouseup.length - 1];
                    this.onmouseup.pop();
                    return;
                }
            }
        }
    }

    if(instance == null){
        instance = new EventHandler();
    }
    return instance;
}



class DrawableTransformable extends Drawable{
    constructor(){
        super();
        this.redraw = false;
    }
    Translate(coord){
        throw new Error("Translation is not implemented");
    }
    Scale(value){
        throw new Error("Scaling is not implemented");
    }
    Rotate(Theta){
        throw new Error("Rotation is not implemented");
    }
    NeedsRedraw(){
        return this.redraw;
    }
}

class Color{
    constructor(R,G,B,A){
        this.R = R;
        this.G = G;
        this.B = B;
        this.A = A;
    }
    getR(){
        return this.R;
    }
    getG(){
        return this.G;
    }
    getB(){
        return this.B;
    }
    getA(){
        return this.A;
    }
    getArrayColor(){
        return [this.R, this.G, this.B, this.A];
    }
}

class Coordinate{
    constructor(X,Y){
        this.X = X;
        this.Y = Y;
    }
    clone(){
        return new Coordinate(this.X, this.Y);
    }
    getX(){
        return this.X;
    }
    getY(){
        return this.Y;
    }
    setX(x){
        this.X = x;
    }
    setY(y){
        this.Y = y;
    }
    scale(ParentCoordinate,amount){
        this.X = (this.getX() - ParentCoordinate.getX()) * amount + ParentCoordinate.getX();
        this.Y = (this.getY() - ParentCoordinate.getY()) * amount + ParentCoordinate.getY();
    }
    rotate(ParentCoordinate,theta){
        var distance = Math.sqrt(
            Math.pow(this.X - ParentCoordinate.getX(),2) + 
            Math.pow(this.Y - ParentCoordinate.getY(),2));
        var newTheta = 0;
        if(this.X - ParentCoordinate.getX() != 0){
            newTheta = theta + Math.atan(
                (this.Y - ParentCoordinate.getY())/
                (this.X - ParentCoordinate.getX()));
        }
        else{
            newTheta = (this.Y - ParentCoordinate.getY()) < 0 ? 
                3 * Math.PI / 2 + theta :
                Math.PI / 2 + theta;
        }
        this.X = Math.cos(newTheta)*distance + ParentCoordinate.getX();
        this.Y = Math.sin(newTheta)*distance + ParentCoordinate.getY();
    }
    Translate(coord){
        this.X = this.X + coord.getX();
        this.Y = this.Y + coord.getY();
    }
    midpoint(coord){
        return new Coordinate(
            (this.X + coord.getX())/2,
            (this.Y + coord.getY())/2);
    }
    distance(x,y){
        return Math.sqrt(Math.pow(this.X - x,2) + Math.pow(this.Y - y, 2));
    }
}



function flush(canvas){
    var context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
}
var ctx = null;
var myImageData = null;
function updateData(){
    ctx = canvas.getContext('2d');
    myImageData = ctx.getImageData(0, 0, 800, 600);
}
function flip(){
    ctx.putImageData(myImageData,0,0);
}
function bitmapPixel(canvas, x,y, color){
    myImageData.data[y*800*4 + x*4] = color.getR();
    myImageData.data[y*800*4 + x*4 + 1] = color.getG();
    myImageData.data[y*800*4 + x*4 + 2] = color.getB();
    myImageData.data[y*800*4 + x*4 + 3] = color.getA();

}


var zeroCoord = new Coordinate(0,0);
var canvas = document.getElementById("myCanvas");

class Line extends DrawableTransformable{
    constructor(begin,end,color){
        super();
        this.begin = begin;
        this.end = end;
        this.color = color;
        this.parent = begin.midpoint(end);
    }
    getCoordinates(){
        return [this.begin,this.end,this.parent];
    }
    setCoordinates(begin,end,parent){
        this.begin = begin;
        this.end = end;
        this.parent = parent
    }
    Rotate(theta){
        this.begin.rotate(this.parent,theta);
        this.end.rotate(this.parent,theta);
        this.redraw = true;
    }
    Translate(coord){
        this.begin.Translate(coord);
        this.end.Translate(coord);
        this.parent.Translate(coord);
        this.redraw = true;
    }
    Scale(value){
        this.begin.scale(this.parent,value);
        this.end.scale(this.parent,value);
        this.redraw = true;
    }
    draw(canvas){
        var miny = Math.min(this.begin.getY(),this.end.getY());
        var maxy = Math.max(this.begin.getY(),this.end.getY());
        var minx = Math.min(this.begin.getX(),this.end.getX());
        var maxx = Math.max(this.begin.getX(),this.end.getX());
        this.redraw = false;

        if(this.begin.getX() == this.end.getX()){
            for(var i = miny; i < maxy; i++){
                bitmapPixel(canvas,this.begin.getX(),i,this.color);
            }
            return;
        }

        var slope = (this.begin.getY() - this.end.getY())/(this.begin.getX() - this.end.getX());
        if(Math.abs(slope) < 1){
            for(var i = minx; i < maxx; i++){
                bitmapPixel(canvas, i, Math.round(slope*(i-this.begin.getX()) + this.begin.getY()),this.color);
            }
            return;
        }
        else{
            for(var i = miny; i < maxy; i++){
                bitmapPixel(canvas, Math.round(1/slope * (i - this.begin.getY()) + this.begin.getX()),i, this.color);
            }
        }
    }
}


/*
*
* Reason for a seperate rectangle class compared to polygon is that
* Rectangles must be able to be different scales on axis
*
*/
class Rectangle extends DrawableTransformable{
    constructor(ACoord,BCoord,CCoord,DCoord,color){
        super();
        this.parent = (ACoord.midpoint(BCoord)).midpoint(CCoord.midpoint(DCoord));
        this.ACoord = ACoord;
        this.BCoord = BCoord;
        this.CCoord = CCoord;
        this.DCoord = DCoord;
        this.color = color
    }
    Rotate(theta){
        this.ACoord.rotate(parent,theta);
        this.BCoord.rotate(parent,theta);
        this.CCoord.rotate(parent,theta);
        this.DCoord.rotate(parent,theta);
        this.redraw = true;
    }
    Scale(value){
        this.ACoord.scale(parent,value);
        this.BCoord.scale(parent,value);
        this.CCoord.scale(parent,value);
        this.DCoord.scale(parent,value);
        this.redraw = true;
    }
    Translate(coord){
        this.ACoord.scale(coord);
        this.BCoord.scale(coord);
        this.CCoord.scale(coord);
        this.DCoord.scale(coord);
        this.parent.scale(coord);
        this.redraw = true;
    }
    draw(canvas){
        var points = [this.ACoord, this.BCoord, this.CCoord, this.DCoord];
        var bound_checks = [];
        for(var i = 0; i < 4; i++){
            var bx = points[i].getX();
            var by = points[i].getY();
            var ax = points[(i+1) % 4].getX();
            var ay = points[(i+1) % 4].getY();
            if(ax == bx){
                if(ax < this.parent.getX()){
                    bound_checks.push(function(x,y){
                        return x >= ax;
                    });
                }
                else{
                    bound_checks.push(function(x,y){
                        return x <= ax;
                    });
                }
            }
            else if(ay == by){
                if(ay < this.parent.getY()){
                    bound_checks.push(function(x,y){
                        return y >= ay;
                    });
                }
                else{
                    bound_checks.push(function(x,y){
                        return y <= ay;
                    });
                }
            }
            else{
                var slope = (ay-by)/(ax-by);
                var ps = function(x){
                    return slope*(x-ax) + ay;
                }
                if(ps(this.parent.getX()) <= this.parent.getY()){
                    bound_checks.push(
                        function(x,y){
                            y >= ps(x)
                        }
                    );
                }
                else{
                    bound_checks.push(
                        function(x,y){
                            y <= ps(x);
                        }
                    );
                }
            }
        }
        var minX = Math.min(
                    Math.min(this.ACoord.getX(),this.BCoord.getX()),
                    Math.min(this.CCoord.getX(),this.DCoord.getX())
                   );
        var minY = Math.min(
                    Math.min(this.ACoord.getY(),this.BCoord.getY()),
                    Math.min(this.CCoord.getY(),this.DCoord.getY())
                   );
        var maxX = Math.max(
                    Math.max(this.ACoord.getX(),this.BCoord.getX()),
                    Math.max(this.CCoord.getX(),this.DCoord.getX())
                   );
        var maxY = Math.max(
                    Math.max(this.ACoord.getY(),this.BCoord.getY()),
                    Math.max(this.CCoord.getY(),this.DCoord.getY())
                   );
        for(var y = minY; y <= maxY; y++){
            for(var x = minX; x <= maxX; x++){
                var check = true;
                for(var i = 0; i < 2; i++){
                    if(!bound_checks[i](x,y)){
                        check = false;
                    }
                }
                if(check){
                    bitmapPixel(canvas,x,y,this.color);
                }
            }
        }
    }
}

class Circle extends DrawableTransformable{
    constructor(center, radius, color){
        super();
        this.center = center;
        this.radius = radius;
        this.color = color;
    }
    Translate(coord){
        this.center.Translate(coord);
        this.redraw = true;
    }
    Scale(value){
        this.radius = this.radius * value;
        this.redraw = true;
    }
    Rotate(theta){
        console.log("lol rotating a circle is hilarious");
    }
    draw(canvas){
        this.redraw = false;
        for(var y = -this.radius; y <= this.radius; y++){
            for(var x = -this.radius; x <= this.radius; x++){
                if(this.radius >= Math.sqrt(Math.pow(Math.round(y),2) + Math.pow(Math.round(x),2))){
                    bitmapPixel(canvas,Math.round(x) + this.center.getX(), Math.round(y) + this.center.getY(), this.color);
                }
            }
        }
    }
}

class Polygon extends DrawableTransformable{
    constructor(center, npoints, radius, color){
        super();
        var angle_addition = npoints/(2*Math.PI);
        this.parent = center;
        this.color = color;
        var baseAngle = new Coordinate(0,radius)
        baseAngle.Translate(this.parent);
        this.points = [baseAngle];
        for(var i = 0; i < npoints - 1; i++){
            var newangle = this.points[i].clone();
            newangle.rotate(this.parent,angle_addition);
            this.points.push(newangle);
        }
        this.boundsCheck = [];
        this.redraw = true;
    }
    regenerateBoundsCheck(){
        this.redraw = false;
        for(var i = 0; i < this.points.length;i++){
            var Yi = this.points[i].getY();
            var Xi = this.points[i].getX();
            var Xa = this.points[(i + 1) % this.points.length].getX();
            var Ya = this.points[(i + 1) % this.points.length].getY();

            if( Xi-Xa == 0){
                if(Xi < this.parent.getX()){
                    this.boundsCheck.push(
                        function(x,y){
                            return x > Xi;
                        }
                    );
                }
                else{
                    this.boundsCheck.push(
                        function(x,y){
                            return x < Xi;
                        }
                    );
                }
            }
            else if(Yi - Ya == 0){
                if(Yi < this.parent.getY()){
                    this.boundsCheck.push(
                        function(x,y){
                            return y > Yi;
                        }
                    );
                }
                else{
                    this.boundsCheck.push(
                        function(x,y){
                            return y < Yi;
                        }
                    )
                }
            }
            else{
                if(Yi < this.parent.getY()){
                    this.boundsCheck.push(
                        function(x,y){
                            return y > Yi + (Yi-Ya)/(Xi-Xa)*(x-Xi);
                        }
                    );
                }
                else{
                    this.boundsCheck.push(
                        function(x,y){
                            return y < Yi + (Yi-Ya)/(Xi-Xa)*(x-Xi);
                        }
                    );
                }
            }
        }
    }
    Translate(coord){
        for(var i = 0; i < this.points.length;i++){
            this.points[i].Translate(coord);
        }
        this.parent.Translate(coord);
        this.redraw = true;
    }
    Scale(value){
        for(var i = 0;i < this.points.length;i++){
            this.points[i].scale(this.parent,value);
        }
        this.redraw = true;
    }
    Rotate(theta){
        for(var i = 0;i < this.points.length;i++){
            this.points[i].Rotate(this.parent,theta);
        }
        this.redraw = true;
    }
    draw(canvas){
        if(this.redraw){
            regenerateBoundsCheck();
        }

        this.redraw = false;

        var minX = this.points[0].getX();
        var minY = this.points[0].getY();
        var maxX = this.points[0].getX();
        var maxY = this.points[0].getY();

        for(var i = 0 ; i < this.points.length;i++){
            if(minX > this.points[i].getX()){
                minX = this.points[i].getX();
            }
            if(maxX < this.points[i].getX()){
                maxX = this.points[i].getX();
            }
            if(minY > this.points[i].getY()){
                minY = this.points[i].getY();
            }
            if(maxY < this.points[i].getY()){
                maxY = this.points[i].getY();
            }
        }
        for(var y = minY; y < maxY; y++){
            for(var x = minX; x < maxX; x++){
                var check = true;
                for(var i = 0; i < this.boundsCheck.length;i++){
                    if(!this.boundsCheck[i](x,y)){
                        check = false;
                        break;
                    }
                }
                if(check){
                    this.bitmapPixel(canvas,x,y,this.color);
                }
            }
        }

    }
}

var mouseX = 0;
var mouseY = 0;

canvas.addEventListener("mousemove",function(e){
    var r = canvas.getBoundingClientRect();
    mouseX = Math.round(e.clientX - r.left);
    mouseY = Math.round(e.clientY - r.top);
});


class Triangle extends Polygon{
    constructor(center,radius,color){
        super(center,3,radius,color);
    }
}


class Button extends Drawable{
    constructor(x,y,bx,by,color,text,callback){
        this.text = text;
        this.Rectangle = new Rectangle(
            new Coordinate(x,y),
            new Coordinate(bx,y),
            new Coordinate(bx,by),
            new Coordinate(x,by),
            color
        );
        var eh = getInstance();
        eh.addOnClick(
            callback,
            function(){
                return mouseX > x && mouseX < x + bx && mouseY > y && mouseY < y + by;
            }
        );
    }
    draw(canvas){
        this.Rectangle.draw(canvas);
    }
}


class Undo extends Button{
    static redo = null;
    static drawnStack = null;
    constructor(){
        this.stack = [];
    }
    length(){
        return this.stack.length;
    }
    pop(){
        var a = this.stack[this.length() - 1];
        this.stack.pop();
        return a;
    }
    push(object){
        this.stack.push(object);
    }
    onclick(){
        if(drawnStack.length() != 0){
            var a = drawnStack.pop();
            this.push(a);
        }
    }
}

class Redo extends Button{
    static undo = null;
    static drawnStack = null;
    constructor(){
    }
    onclick(){
        if(undo.length() != 0){
            var object = undo.pop();
            drawnStack.push(object);
        }
    }

}

class DrawnStack{
    static undo = null;
    static redo = null;
    constructor(){
        this.stack = [];
    }
    length(){
        return this.stack.length();
    }
    pop(){
        var a = this.stack[this.length() - 1];
        this.stack.pop();
        return a;
    }
    push(object){
        this.stack.push(object);
    }
    drawall(canvas){
        for(var i = 0; i < this.length(); i++){
            this.stack[i].draw(canvas);
        }
    }
    anyRedraws(canvas){
        for(var i = 0; i < this.length(); i++){
            if(this.stack[i].NeedsRedraw()){
                this.drawall(canvas);
                return;
            }
        }
        return;
    }
}




class Program{
    constructor(canvas){
        this.EventHandler = getInstance();/*
        this.UndoStack = new Undo();
        this.RedoStack = new Redo();
        this.DrawnStack = new DrawnStack();
        Undo.redo = this.RedoStack;
        Undo.drawnStack = this.DrawnStack;
        Redo.undo = this.UndoStack;
        Redo.drawnStack = this.DrawnStack;
        DrawnStack.redo = this.RedoStack;
        DrawnStack.undo = this.UndoStack;*/
        var a = new Line(new Coordinate(0,0), new Coordinate(800, 600), new Color(0,0,0,255));
        var b = new Rectangle(new Coordinate(0,0), new Coordinate(0,100),new Coordinate(100,100), new Coordinate(100,0), new Color(0,0,0,255));
        var c = new Circle(new Coordinate(200,200), 50, new Color(255,0,0,255));
        var draw_queue = [a, b,c ];
        setInterval(function(){
            flush(canvas);
            updateData();
            for(var i = 0;i < draw_queue.length; i++){
                draw_queue[i].draw(canvas);
            }
            flip()
        },1000/60);
        setInterval(function(){
            draw_queue[0].Translate(new Coordinate(1,1));
            draw_queue[2].Scale(.95);
        },1000/30);
    }
}

var a = new Program(canvas);