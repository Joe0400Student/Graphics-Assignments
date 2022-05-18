Written By Joseph Scannell.

The assignment was not that bad. It was pretty easy. I looked over the code and 
noticed at the bottom in the renderloop the modelViewMatrix. This i noticed had
3 rotation commands. These were the DOF for the robot arm. Since I knew that, I
added 3 more for the DoF for the arm. Its pretty simple I added the Rotation of
the arm itself, and the other angle of rotation. This allowed me to make it to
6 DoF. There was a bug, with the fix being that i added a slider that does nothing.
For some reason that fixes it. I have no clue why, but it does....

For the fingers i simply drew the same finger multiple times and rotated it. 
Each finger has control so we added 6 + 3*3 DoF (15 DoF). this could be considerd
an additional feature.