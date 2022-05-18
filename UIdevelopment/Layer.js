
/*
*
* Layer implements the api for layer moving. It also provides for translation
* 
*/

var temp_canvas = document.getElementById("computeCanvas");

class Layer extends Transformable{
    
    constructor(rendered_image,x,y){
        super();
        this.rendered_image = rendered_image;
        this.x = x;
        this.y = y;
    }

    render(ctx){
        console.log(this.rendered_image.constructor.name);
        ctx.drawImage(this.rendered_image,0,0,800,600);
    }

    Scale(scaling_factor){
        var org = this.rendered_image;
        temp_canvas.getContext('2d').clearRect(0,0,800,600);
        temp_canvas.getContext('2d').drawImage(this.rendered_image,0,0,800,600);
        this.rendered_image = temp_canvas.getContext('2d').getImageData(0,0,800,600);
        var setImage = new ImageData(800, 600);
        var inverted_scale = 1 / scaling_factor;

        for(var i = 0; i < 800 * 600 * 4; i++){
            setImage.data[i] = 0;
        }

        for(var ty = 0; ty < 600; ty++){
            for(var tx = 0; tx < 800; tx++){
                var nx = Math.round((tx - this.x) * inverted_scale + this.x);
                var ny = Math.round((ty - this.y) * inverted_scale + this.y);
                if(nx >= 0 && nx < 800 && ny >= 0 && ny < 600){
                    var o_pos = (800 * ny + nx) * 4;
                    var n_pos = (800 * ty + tx) * 4;
                    for(var i = 0; i < 4; i++){
                        setImage.data[n_pos + i] = this.rendered_image.data[o_pos + i];
                    }
                }
            }
        }
        
        var self = this;
        this.rendered_image = org;
        this.promise = createImageBitmap(setImage).then(function(a){
            self.rendered_image = a;
        })
    }
    Translate(x,y){

        var org = this.rendered_image;
        this.x += x;
        this.y += y;
        temp_canvas.getContext('2d').clearRect(0,0,800,600);
        temp_canvas.getContext('2d').drawImage(this.rendered_image,0,0,800,600);
        this.rendered_image = temp_canvas.getContext('2d').getImageData(0,0,800,600);
        var setImage = new ImageData(800, 600);


        for(var i = 0; i < 800 * 600 * 4; i++){
            setImage.data[i] = 0;
        }

        for(var ty = 0; ty < 600; ty++){
            for(var tx = 0; tx < 800; tx++){
                if(tx - x < 800 && tx - x >= 0 && ty - y < 600 && ty - y >= 0){
                    var nx = tx - x;
                    var ny = ty - y;
                    var o_pos = ( ny * 800 + nx ) * 4;
                    var n_pos = ( ty * 800 + tx ) * 4;
                    for(var i = 0; i < 4; i++){
                        setImage.data[i + n_pos] = this.rendered_image.data[i + o_pos];
                    }
                }
            }
        }
        
        var self = this;
        this.rendered_image = org;
        this.promise = createImageBitmap(setImage).then(function(a){
            self.rendered_image = a;
        });
    }

    Rotate(theta){
        var org = this.rendered_image;
        temp_canvas.getContext('2d').clearRect(0,0,800,600);
        temp_canvas.getContext('2d').drawImage(this.rendered_image,0,0,800,600);
        this.rendered_image = temp_canvas.getContext('2d').getImageData(0,0,800,600);
        var setImage = new ImageData(800,600);

        for(var i = 0; i < 800 * 600 * 4; i++){
            setImage.data[i] = 0;
        }

        for(var y = 0; y < 600*4; y++){
            for(var x = 0; x < 800*4; x++){
                var new_x = (x/4 - this.x) * Math.cos(theta) - 
                            (y/4 - this.y) * Math.sin(theta);
                var new_y = (x/4 - this.x) * Math.sin(theta) +
                            (y/4 - this.y) * Math.cos(theta);
                new_x = Math.round(new_x + this.x);
                new_y = Math.round(new_y + this.y);
                var offset = (new_y * 800 + new_x) * 4;
                var new_offset = (Math.round(y/4) * 800 + Math.round(x/4)) * 4;

                if(new_y >= 0 && new_y < 600 && new_x >= 0 && new_x < 800){
                    for(var i = 0;i < 4;i++){
                        setImage.data[new_offset + i] = this.rendered_image.data[offset + i];
                    }
                }
            }
        }
        
        var self = this;
        this.rendered_image = org;
        this.promise = createImageBitmap(setImage).then(function(a){
            self.rendered_image = a;
        })

    }

    
    toJSON(){
        var a = temp_canvas.getContext('2d');
        a.clearRect(0,0,800,600);
        a.drawImage(this.rendered_image,0,0,800,600);

        return {
            rendered_image:a.getImageData(0,0,800,600).data.toString('base64'),
            x:this.x,
            y:this.y
        }
    }
    getImageURL(){
        temp_canvas.getContext('2d').clearRect(0,0,800,600);
        temp_canvas.getContext('2d').drawImage(this.rendered_image,0,0,800,600);
        return temp_canvas.toDataURL("image/png");
    }
}

function fromJSON(data){
    var a = new ImageData(800,600);
    for(var i = 0; i < data.length; i++){
        a.data[i] = parseInt(data[i]);
    }
    
    var x = data.x;
    var y = data.y;
    return new Layer(createImageBitmap(a),x,y);
}