Written By Joseph Scannell


This program was an extension of a program built earlier

How it works is pretty simple, however If i had more time I would have brought it over to SVG tags in html.

Basically the program has two stacks, a redo and and undo stack
This is where the rendered layer frames go.
Each layer frame contains the pixel data for each frame
There is a layer box which provides a selection id for each layer
You select the layer and whatever you do applys to that layer. If you ctrl-c, it copys that selected layer
If you translate, it translates the layer.

the clipboard is inside the program and is a single variable which contains the copy of the frame data you selected

The json just save the pixel data. The JSON file will be pretty massive, couldnt figure out how to save JSON data as binary.

If I could I would have. The rendering to a png is done through a URL that canvas provides.

How the Selection code works for rubberbanding and all else is that I defined two methods that provide for the modifying code.
What it does is that it provides the methods mouseDown mouseUp, and mouseMove. These methods are used for the handling of all
the placement algorithms. They were called PointSelect and RadiusSelect. This is because all the programs features could be boiled
down to that seleciton method. On top of that it uses a rubberbanding method and a render method that is used to output the rendered
frames before it gets a promise to resolve.

THe hardest parts of the program were getting non JSONable objects to become JSONable. This required writing code for each method to
apply the json code to each method.


The design of the program features a prominent bar for all the controls
This ribbon is simmilar to ribbons used in word after XP, as the design makes sense

There is one bug that is out of my control, that one is with how Microsoft made their Iconography pack work. For some reason it works
on everything but chrome. If you use the program on firefox the iconography makes sense.



If I had more time I would have implemented a callback event queue so that i could define regions of the display where i Could easily
make grids where I could translate and move and all different methods at once from the program. However as I ran out of time, I did not
implement that. I have done that for 2D graphics in other SDL like API's for it.





