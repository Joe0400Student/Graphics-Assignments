
/*
*
* Layer implements the api for layer moving. It also provides for translation
* 
*/


class Layer extends Transformable{
    
    constructor(rendered_image,x,y){
        super();
        this.rendered_image = rendered_image;
        this.x = x;
        this.y = y;
    }

    render(ctx){
        ctx.drawImage(this.rendered_image,0,0,800,600);
    }

    Scale(scaling_factor){

        var setImage = new Image(800, 600);
        var inverted_scale = 1 / scaling_factor;

        for(var i = 0; i < 800 * 600 * 4; i++){
            setImage.data[i] = 0;
        }

        for(var y = 0; y < 600; y++){
            for(var x = 0; x < 800; x++){
                var new_y = Math.round((y - this.y) * inverted_scale) + this.y;
                var new_x = Matha.round((x - this.x) * inverted_scale) + this.x;
                if(new_y >= 0 && new_y < 600 && new_x >= 0 && new_y < 800){
                    var offset = (y * 800 + x) * 4;
                    var new_offset = (new_y * 800 + new_x) * 4;
                    setImage.data[  offset  ] = this.rendered_image.data[  new_offset  ];
                    setImage.data[offset + 1] = this.rendered_image.data[new_offset + 1];
                    setImage.data[offset + 2] = this.rendered_image.data[new_offset + 2];
                    setImage.data[offset + 3] = this.rendered_image.data[new_offset + 3];
                }
            }
        }
        this.rendered_image = setImage;
    }
    Translate(x,y){

        this.x += x;
        this.y += y;

        var setImage = new Image(800, 600);

        for(var i = 0; i < 800 * 600 * 4; i++){
            setImage.data[i] = 0;
        }

        for(var TY = 0; TY < 600; TY++){
            for(var TX = 0; TX < 800; TX++){
                if(TY + y >= 0 && TY + y < 600 && TX + x >= 0 && TX + x < 800){
                    var offset = (TY * 800 + TX) * 4;
                    var new_offset = ((TY + y) * 800 + TX + x) * 4;
                    setImage[new_offset] = this.rendered_image.data[offset];
                    setImage[new_offset + 1] = this.rendered_image.data[offset + 1];
                    setImage[new_offset + 2] = this.rendered_image.data[offset + 2];
                    setImage[new_offset + 3] = this.rendered_image.data[offset + 3];
                }
            }
        }
        this.rendered_image = setImage;
    }

    Rotate(theta){

        var setImage = new Image(800, 600);

        for(var i = 0; i < 800 * 600 * 4; i++){
            setImage.data[i] = 0;
        }

        for(var y = 0; y < 600; y++){
            for(var x = 0; x < 800; x++){
                var new_x = (x - this.x) * Math.cos(-theta) - 
                            (y - this.y) * Math.sin(-theta);
                var new_y = (x - this.x) * Math.sin(-theta) +
                            (y - this.y) * Math.cos(-theta);
                new_x = Math.round(new_x + this.x);
                new_y = Math.round(new_y + this.y);

                if(new_x >= 0 && new_x < 800 && new_y >= 0 && new_y < 600){
                    var offset = (y * 800 + x) * 4;
                    var new_offset = (new_y * 800 + new_x) * 4;
                    setImage.data[offset] = this.rendered_image.data[new_offset];
                    setImage.data[offset + 1] = this.rendered_image.data[new_offset + 1];
                    setImage.data[offset + 2] = this.rendered_image.data[new_offset + 2];
                    setImage.data[offset + 3] = this.rendered_image.data[new_offset + 2];
                }
            }
        }

        this.rendered_image = setImage;

    }
}