function MidpointCircle(radius){
    var x = 0;
    var y = radius;
    var d = 5.0/4.0 - radius;

    while(y > x){
        if(d < 0){
            d = d + 2.0 * x + 3.0;
        }
        else{
            d = d + 2.0 * (x - y) + 5.0;
            y--;
        }
        x++;
    }
}