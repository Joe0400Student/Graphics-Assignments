



class Drawable{
    constructor(){}
    draw(canvas){
        throw new Error("draw not implemented");
    }
}

class DrawableTransformable extends Drawable{
    constructor(){ super(); }
    Translate(x,y){
        throw new Error("Translate not implemented");
    }
    Scale(value){
        throw new Error("Scale not implemented ");
    }
    Rotate(theta){
        throw new Error("Rotate not implemented");
    }

}

class Layer extends DrawableTransformable{
    constructor(drawable){
        this.drawable = drawable;
    }

    Translate(x,y){
        this.offset
    }

    draw(canvas){
        this.drawable.draw(canvas);
    }
}