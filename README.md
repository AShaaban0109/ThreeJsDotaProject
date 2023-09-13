# ThreeJsDotaProject

Dota 2 Video Game Inspired Three Js Project. Models of Dota Characters were imported and placed in a scene, and flying orbs exist which perform different spells based on the combination the user specifies. A scene set in space is created, where two 3D characters face each other, with 3 spherical power orbs between them, as seen in Figure 1. The character on the left is the hero, and controlled by the user, and the character on the right is the villain. The 3 spherical orbs can change colour at the user’s will and each colour represents a different orb. The user can combine the spherical orbs in different ways, to execute a particular spell. For example, 2 blue orbs, and one orange orb creates a wall of ice, as seen in Figure 2. A single blue orb and 2 purple orbs creates a tornado as seen in Figure 3. When each particular spell is executed, an audio effect for the spell is played, and some spells remain in place, while others have an ongoing animation. 

This project was coded in JavaScript, and can be enhanced further by incorporating additional spells.

## Example Images of Possible Simulations

- Figure 1: A face-off between a hero (left) and an enemy (right) in space. The central spherical orbs are in constant rotation.

![image](https://github.com/AShaaban0109/ThreeJsDotaProject/assets/56279675/c746abf8-19cb-4450-89b8-2765a3d1ee57)

- Ice Wall spell used, blocking the enemy’s path.
 
![image](https://github.com/AShaaban0109/ThreeJsDotaProject/assets/56279675/eca50b1f-f697-4fc1-8b5c-4a5fb1c80dbe)

- Tornado spell used.
 
![image](https://github.com/AShaaban0109/ThreeJsDotaProject/assets/56279675/74fab3c4-68f8-46f8-acf7-98b2baae6ed1)

## Different Meshes in the 3D Models

In the .obj files used here, more than one mesh was defined. For example, one mesh contained the geometry of the main body itself (Figure 4), another contained other parts of the 3D model such as a hat (Figure 5). This enables us to set different materials to different meshes, and is useful for other applications such as animation (for example maybe we want just the robes to be animated moving in some wind, and not the rest of the model with it). Notice how the different parts of the hero in Figure 1 are coloured differently.

- Figure 4: Main Body Geometry.
  
![image](https://github.com/AShaaban0109/ThreeJsDotaProject/assets/56279675/904eca90-b355-4819-8d45-b6c56dcd0f66)

- Figure 5: Hat Geometry.
  
![image](https://github.com/AShaaban0109/ThreeJsDotaProject/assets/56279675/0042b00a-979e-49e8-9685-91878719586d)

- Figure 6: Full 3D model.
  
![image](https://github.com/AShaaban0109/ThreeJsDotaProject/assets/56279675/1ceed9c5-3236-4da4-bdad-ad102e4fdef8)


## Conclusion and Final Thoughts

In my experience the hardest concepts to grasp whilst learning three.js, were the coordinate systems and rotations. Initially, I was unable to tell the difference between an object’s local coordinate system, and the world coordinate system, and became particularly problematic when trying to rotate an object about one of its axis, or to rotate it about an arbitrary point in space. It later transpired that each object maintains a record of its own local coordinates, and rotating an object about one of its axis was as simple as modifying the rotation property along that particular axis. To rotate about an arbitrary point, I added objects as children of a parent Object3D instance that was translated to some position in world space. Then the children were translated a certain distance away from this point, and in the animation loop when the pivot point itself was rotated, causing all children to also rotate about this point.

Another issue I encountered was the inability to use certain Loaders such as TGALoader and MTLLoader, due to only having access to a limited three.js library. TGALoader is a class used for loading .tga files, which are similar to .obj files, in the way that they specify the shapes of models (I therefore could not load a model I had liked and downloaded). In addition to this, the enemy .obj model I used was supplemented with additional .mtl files, which are used to define materials for objects, and this was also inaccessible to me. Another issue, and limitation of the approach I took was the inability to animate objects for only a certain period of time. For example, I wanted to create an animation where after the hero casts a spell, he performs 3 spins, around his y axis then stop at his original position. However, I was unsure how this can be done with three.js as the animation loop is called every frame.

If I had more time, I would like to work on understanding how to implement something like this, if possible, in three.js, as well as add more functionality to my scene. Some thoughts I had include adding more spells to the arsenal of the hero. 10 permutations are possible using 3 orbs, and currently only 4 exists, with the functions for the other spells defined, but not yet implemented. Furthermore, I would like to create more enemies, some that are resistant to certain types of spells, that gradually move towards the hero, and upon reaching him, if they are not eliminated cause the game to end. If the user performs the correct spells in time, they eliminate the certain enemies present that are resistant to these spells. This can be extended with a point system, where the user can keep track of enemies killed, and work towards beating high scores the had achieved previously. 

Overall, this project was thoroughly enjoyable to work on, and I look forward to continuing my work on it in the future. Three.js, although I found difficult at times, due to lack of detail in the documentation provided and my own struggles with the mathematical background of generating computer graphics, was a joy to work with as I built up my skillset. I look forward to gaining more experience with it, and creating more and more complex scenes as I go along.
