

class Transformable{
    constructor(){
    }
    Scale(scaling_factor){
        throw new Error("Scale has not been implemented in super class");
    }
    Translate(x, y){
        throw new Error("Translate has not been implemented in super class");
    }
    Rotate(theta){
        throw new Error("Rotate has not been implemented in super class");
    }
}