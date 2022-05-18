/*
* Drawable provides the base structure for a drawable item
*
*/

class Renderable{
    constructor(){}
    render(){
        throw new Error("Render has not been implemented in the inheritable class");
    }
}