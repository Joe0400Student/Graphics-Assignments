
class Field{
    constructor(fieldID){
        this.field = document.getElementById(fieldID);
    }
    value(){
        return parseInt(this.field.value);
    }
}
