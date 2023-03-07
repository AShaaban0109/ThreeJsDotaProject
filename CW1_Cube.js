"use strict";

 // https://stackoverflow.com/q/1335851/72470

// Global variables that are available in all functions.
// Note: You can add your own here, e.g. to store the rendering mode.
var camera, scene, renderer, mesh;

// Define a cube variable, and the rotation about its axis, as well as the speed of this rotation
var cube;
var numCubeMaterials;
var cubeRotX;
var cubeRotY;
var cubeRotZ;

var cubeRotXSpeed;
var cubeRotYSpeed;
var cubeRotZSpeed;

var cubeMovXSpeed;
var cubeMovYSpeed;
var cubeMovZSpeed;

// Stanford Bunny
var bunny;

var bunnyRotX;
var bunnyRotY;
var bunnyRotZ;

var bunnyRotXSpeed;
var bunnyRotYSpeed;
var bunnyRotZSpeed;

// render modes
var renderMode;
var faceRender;
var edgeRender;
var verticesRender;

// bunny render modes
var bunnyRenderMode;
var bunnyFaceRender;
var bunnyEdgeRender;
var bunnyVerticesRender;

// point to rotate about while using orbital controls
var pivotPoint;
var orbitalRotLat;
var orbitalRotLong;

// Initialise the scene, and draw it for the first time.
init();
animate();

// Listen for keyboard events, to react to them.
document.addEventListener('keydown', handleKeyDown);


// Scene initialisation. This function is only run once, at the very beginning.
function init() {
    scene = new THREE.Scene();

    // Set up pivot point around which the camera rotates about, using default values
    setOrbitalPoint()
    
    // Set up the camera, add it as a child to pivotPoint,
    // move it to (3, 4, 5) and look at the origin (0, 0, 0).
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    pivotPoint.add(camera);
    camera.position.set(3, 4, 5);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    
    // setup axis, cube and cube rendering modes
    createAxis()
    setupCube(true)
    setCubeRenderMode()

    setupBunny()
    loadMesh(bunny, 'bunny-5000.obj', "fitInCube")  // load bunny and apply transformation

    var light = new THREE.DirectionalLight()
    light.position.set(1,2,3)
    scene.add(light);
    
    // Set up the Web GL renderer.
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio); // HiDPI/retina rendering
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Handle resizing of the browser window.
    window.addEventListener('resize', handleResize, false);
}

// setup bunny 
function setupBunny(rotXSpeed = 0.01, rotYSpeed = 0.01, rotZSpeed = 0.01){
    bunny = new THREE.Object3D()

    bunnyRotX =0
    bunnyRotY =0
    bunnyRotZ =0

    bunnyRotXSpeed = rotXSpeed
    bunnyRotYSpeed = rotYSpeed
    bunnyRotZSpeed = rotZSpeed
}

// load a mesh file and apply a transformation on the object before rending.
// tansformations include:
// placeInScene : Adds the object to the scene without transformation
// fitInCube : Scale and translates the object to fit in the cube
function loadMesh(loadInto, url ='bunny-5000.obj', transformation = "fitInCube"){
    // instantiate a loader and load a resource
    var loader = new THREE.OBJLoader();
    loader.setPath('models/')
    loader.load( url,

        // called when resource is loaded. Transform object before rendering
        function ( loadedObject ) {
            bunny = transformObject(loadedObject, transformation)
            setBunnyRenderMode('f')
        },

        // called when loading is in progress,
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },

        // called when loading has errors
        function ( error ) {
            console.log( 'Error loading Obj files' );
        }
    );
}

// apply transfromation to object before adding to scene
function transformObject(object, transformation = "fitInCube"){
    var transformed;
    object.traverse( function( child ) {
        if ( child instanceof THREE.Mesh ) {
            switch (transformation) {
                // scale and translate object to fit inside cube, which becomes a parent
                case "fitInCube":
                    cube.add(child)
                    child.scale.set(0.4,0.4,0.4)
                    child.position.set(-0.5,0,0)
                    applyMaterial(child)
                    transformed = child
                    break
                
                case "placeInScene":
                    scene.add(chil)
                    applyMaterial(child)
                    transformed = child
                    break
            }
        }
    } );

    return transformed
}

// Set how the bunny will be rendered. 
// 'f': face render mode
// 'e': edge render mode
// 'v': vertices render mode
function setBunnyRenderMode(mode='f'){
    // initialse an edge render mode for bunny
    var edgeGeometry = new THREE.EdgesGeometry(bunny.geometry);
    var edgeMaterial = new THREE.LineBasicMaterial( { color: 0xffffff } );
    bunnyEdgeRender = new THREE.LineSegments( edgeGeometry, edgeMaterial );

    // initialse a vartex render mode for cube
    var geometry = new THREE.EdgesGeometry( bunny.geometry );
    var material = new THREE.PointsMaterial( { size:0.1, color: 0xffffff } );
    bunnyVerticesRender = new THREE.Points(geometry, material)

    // initialise starting render mode
    bunnyRenderMode = mode;  
}

// apply material to Object3D
// how do i pass in a hex value as a parameter
function applyMaterial(object){
    var material = new THREE.MeshStandardMaterial({ color: 0x0000ff })
    object.material = material;
}

function setOrbitalPoint(x=0, y=0, z=0, rotLatitude = 0, rotLongitude = 0){
    pivotPoint = new THREE.Object3D()
    scene.add(pivotPoint)
    pivotPoint.position.set(x,y,z)
    orbitalRotLat = rotLatitude
    orbitalRotLong = rotLongitude
}

// Create the axis for the global coordinate system
// xSize, ySize, zSize  : size of axis
// centreAtOrigin  : true if the axis should be centred at origin. (helps to visualize  the negative x, y and z axis)
function createAxis(xSize =5, ySize=5, zSize=5, centreAtOrigin=false){
    var xStart=0, yStart=0, zStart=0;
    var xEnd=xSize, yEnd= ySize, zEnd=zSize;
    
    if (centreAtOrigin == true){
        var xMid, yMid, zMid;
        xMid = xSize/2
        xStart -= xMid
        xEnd -= xMid 

        yMid = ySize/2
        yStart -= yMid
        yEnd -= yMid

        zMid = zSize/2
        zStart -= zMid
        zEnd -= zMid 
    }


    var x_colour = new THREE.LineBasicMaterial( { color: 0xff0000 } );
    var y_colour = new THREE.LineBasicMaterial( { color: 0x00ff00 } );
    var z_colour = new THREE.LineBasicMaterial( { color: 0x0000ff } );

    var x_axis_geometry =  new THREE.BufferGeometry().setFromPoints(
        [new THREE.Vector3(xStart,0,0), new THREE.Vector3(xEnd,0,0)] );
    var y_axis_geometry =  new THREE.BufferGeometry().setFromPoints(
        [new THREE.Vector3(0,yStart,0), new THREE.Vector3(0,yEnd,0)] );
    var z_axis_geometry =  new THREE.BufferGeometry().setFromPoints(
        [new THREE.Vector3(0,0,zStart), new THREE.Vector3(0,0,zEnd)] );
    
    var x_axis = new THREE.Line(x_axis_geometry,x_colour)
    var y_axis = new THREE.Line(y_axis_geometry,y_colour)
    var z_axis = new THREE.Line(z_axis_geometry,z_colour)

    scene.add(x_axis)
    scene.add(y_axis)
    scene.add(z_axis)
}

// Draw cube and setup settings/operations
function setupCube(texture = false){

    var cube_geometry = new THREE.BoxGeometry(2,2,2);

    if (texture == false){ // basic cube
        var cube_material = new THREE.MeshStandardMaterial( { color: 0x0000ff } );
        cube = new THREE.Mesh(cube_geometry, cube_material); 
        numCubeMaterials = 1;
    } else if (texture == true){

        var loader = new THREE.TextureLoader();
        loader.setPath('themes/')
        var cube_materials = [
            new THREE.MeshStandardMaterial( { map: loader.load("Dota_2_logo.jpg") } ),
            new THREE.MeshStandardMaterial( { map: loader.load("Rocket_League_logo.jpg") } ),
            new THREE.MeshStandardMaterial( { map: loader.load("Skyrim_logo.jpg") } ),
            new THREE.MeshStandardMaterial( { map: loader.load("CSGO_logo.jpg") } ),
            new THREE.MeshStandardMaterial( { map: loader.load("GTA_5_logo.jpg") } ),
            new THREE.MeshStandardMaterial( { map: loader.load("Valorant_logo.jpg") } ),
        ];
        cube = new THREE.Mesh(cube_geometry, cube_materials); 
        numCubeMaterials = cube.material.length
    }

    scene.add(cube);

    // specify initial rotation of cube about its axis
    cubeRotX =0;
    cubeRotY =0;
    cubeRotZ =0;

    // specify speed of rotation when rotation controls toggled
    cubeRotXSpeed = 0.01;
    cubeRotYSpeed = 0.01;
    cubeRotZSpeed = 0.01;

    // specify movement of camera when camera movement controls toggled
    cubeMovXSpeed = 0.1;
    cubeMovYSpeed = 0.1;
    cubeMovZSpeed = 0.1;
}

// Set the render mode of the cube. Default is face render mode.
function setCubeRenderMode(mode='f'){
    // initialse an edge render mode for cube
    var edgeGeometry = new THREE.EdgesGeometry(cube.geometry);
    var edgeMaterial = new THREE.LineBasicMaterial( { color: 0xffffff } );
    edgeRender = new THREE.LineSegments( edgeGeometry, edgeMaterial );

    // initialse a vartex render mode for cube
    var geometry = new THREE.EdgesGeometry( cube.geometry );
    var material = new THREE.PointsMaterial( { size:0.1, color: 0xffffff } );
    verticesRender = new THREE.Points(geometry, material)

    // initialise starting render mode
    renderMode = mode;  
}

// Handle resizing of the browser window.
function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop function. This function is called whenever an update is required.
function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += cubeRotX;
    cube.rotation.y += cubeRotY;
    cube.rotation.z += cubeRotZ; 

    bunny.rotation.x += bunnyRotX;
    bunny.rotation.y += bunnyRotY;
    bunny.rotation.z += bunnyRotZ;

    pivotPoint.rotation.y += orbitalRotLat;
    pivotPoint.rotation.x += orbitalRotLong;


    // Render the current scene to the screen.
    renderer.render(scene, camera);
}

// Handle keyboard presses.
function handleKeyDown(event) {
    switch (event.key) {
        // Render modes
        case 'f': // face render mode
            if (renderMode == 'e') {
                cube.remove(edgeRender)
            }
            else if (renderMode == 'v'){
                cube.remove(verticesRender)
            }
            else {
                break
            }

            if (numCubeMaterials == 1) {
                cube.material.visible = true
            } else {
                for (let i = 0; i <= numCubeMaterials -1; i++) {        
                    cube.material[i].visible = true
                }
            }

            faceRender = cube
            scene.add(faceRender)
            renderMode = 'f'
            break;

        case 'e': // edge render mode
            if (renderMode =='e'){
                break
            }
            else if (renderMode == 'f') {
                // remove the cube materials visibility, but keep the cube in the scene, 
                // to allow operations such as rotation to be performed
                if (numCubeMaterials == 1) {
                    cube.material.visible = false
                } else {
                    for (let i = 0; i <= numCubeMaterials -1; i++) {        
                        cube.material[i].visible = false
                    }
                }
            }
            else if (renderMode == 'v'){
                cube.remove(verticesRender)
            }

            // add the edge render as a child of the cube, that is currently
            // still in the scene, but has an invisible material
            cube.add(edgeRender);
            renderMode = 'e'
            break;

        case 'v': // vertex render mode
            if (renderMode =='v'){
                break
            }
            else if (renderMode == 'f') {
                if (numCubeMaterials == 1) {
                    cube.material.visible = false
                } else {
                    for (let i = 0; i <= numCubeMaterials -1; i++) {        
                        cube.material[i].visible = false
                    }
                }
            }
            else if ( renderMode == 'e'){
                cube.remove(edgeRender)
            }

            cube.add(verticesRender);
            renderMode = 'v'
            break;


        // Code for starting/stopping cube rotations.
        case 'x': // x axis rotation
            if (cubeRotX == 0) {
                cubeRotX = cubeRotXSpeed;
            } else {
                cubeRotX = 0;
            }
            break;

        case 'c': // y axis rotation
            if (cubeRotY == 0) {
                cubeRotY = cubeRotYSpeed;
            } else {
                cubeRotY = 0;
            }
            break;

        case 'z': // z axis rotation
            if (cubeRotZ == 0) {
                cubeRotZ = cubeRotZSpeed;
            } else {
                cubeRotZ = 0;
            }
            break;


        // Camera navigation controls
        case 'w':
            camera.position.add(new THREE.Vector3(0,0,-cubeMovZSpeed))
            break

        case 's':
            camera.position.add(new THREE.Vector3(0,0,cubeMovZSpeed))
            break


        case 'a':
            camera.position.add(new THREE.Vector3(-cubeMovXSpeed,0,0))
            break
    
        case 'd':
            camera.position.add(new THREE.Vector3(cubeMovZSpeed,0,0))
            break

        case 'q':
            camera.position.add(new THREE.Vector3(0,-cubeMovYSpeed,0))
            break

        case 'r':
            camera.position.add(new THREE.Vector3(0,cubeMovYSpeed,0))
            break


        // Camera orbital rotation controls
        //
        // To rotate an object about an arbitrary point, we shift the
        // coordiate system to the point, and then apply the rotation matrix
        // on the object, then shift the coordinate system back.
        //
        // This can be done using reference frames, and the three.js
        // object hierarchy as follows. 
        // The rotation speed is updated in the following way,
        // and the animation loops rotates the pivot point with the values 
        // for these two rotations. 
        // As camera is a child of pivotPoint, the camera rotates as well
        case 'n':
            // <= as rotation in the opposite direction corresponds 
            // to a negative orbitalRotLat
            if (orbitalRotLat <=0) {  
                orbitalRotLat = Math.PI/512
            }
            else{
                orbitalRotLat = 0
            }
            break
        
        case 'b':
            if (orbitalRotLat >=0) {
                orbitalRotLat = -Math.PI/512
            }
            else{
                orbitalRotLat = 0
            }
            break

        case 'h':
            if (orbitalRotLong <=0) {  
                orbitalRotLong = Math.PI/512
            }
            else{
                orbitalRotLong = 0
            }
            break
        
        case 'g':
            if (orbitalRotLong >=0) {
                orbitalRotLong = -Math.PI/512
            }
            else{
                orbitalRotLong = 0
            }
            break


        // bunny rotation controls
        case 'i': // x axis rotation
            if (bunnyRotX == 0) {
                bunnyRotX = bunnyRotXSpeed;
            } else {
                bunnyRotX = 0;
            }
            break;

        case 'o': // y axis rotation
            if (bunnyRotY == 0) {
                bunnyRotY = bunnyRotYSpeed;
            } else {
                bunnyRotY = 0;
            }
            break;

        case 'p': // z axis rotation
            if (bunnyRotZ == 0) {
                bunnyRotZ = bunnyRotZSpeed;
            } else {
                bunnyRotZ = 0;
            }
            break;

        // Bunny render modes
        case 'j': // face render mode
            if (bunnyRenderMode == 'e') {
                bunny.remove(bunnyEdgeRender)
            }
            else if (bunnyRenderMode == 'v'){
                bunny.remove(bunnyVerticesRender)
            }
            else {
                break
            }

            bunny.material.visible = true
            bunnyFaceRender = bunny
            scene.add(bunnyFaceRender)
            bunnyRenderMode = 'f'
            break;

        case 'k': // edge render mode
            if (bunnyRenderMode =='e'){
                break
            }
            else if (bunnyRenderMode == 'f') {
                // remove the bunny material visibility, but keep the bunny in the scene, 
                // to allow operations such as rotation to be performed
                bunny.material.visible = false;
            }
            else if (bunnyRenderMode == 'v'){
                bunny.remove(bunnyVerticesRender)
            }

            // add the edge render as a child of the cube, that is currently
            // still in the scene, but has an invisible material
            bunny.add(bunnyEdgeRender);
            bunnyRenderMode = 'e'
            break;

        case 'l': // vertex render mode
            if (bunnyRenderMode =='v'){
                break
            }
            else if (bunnyRenderMode == 'f') {
                bunny.material.visible = false;
            }
            else if ( bunnyRenderMode == 'e'){
                bunny.remove(bunnyEdgeRender)
            }

            bunny.add(bunnyVerticesRender);
            bunnyRenderMode = 'v'
            break;
    }
}