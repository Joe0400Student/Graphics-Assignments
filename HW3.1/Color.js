


class Color{
    constructor(id){
        this.element = document.getElementById(id);
    }
    getCSS(){
        return this.element.value;
    }
}