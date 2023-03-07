"use strict";

 // https://stackoverflow.com/q/1335851/72470

// Global variables that are available in all functions.
var camera, scene, renderer, mesh, listener;

// The hero the player controls and the villian
var hero;
var heroRotY;
var villian;


// power orbs
var orbs;
var orb1;
var orb2;
var orb3;
var currentOrbsCount;
var currentOrbIndex;

// different colour orbs
var quasMaterial;
var wexMaterial;
var exortMaterial; 

// spells
var currentAbility;
var emp;
var iceWall;
var tornado;
var sunStrike;

// point to rotate about while using orbital controls
var pivotPoint;
var orbitalRotLat;
var orbitalRotLong;

// Initialise the scene, and draw it for the first time.
init();
animate();

// Listen for keyboard events, to react to them.
// Note: there are also other event listeners, e.g. for mouse events.
document.addEventListener('keydown', handleKeyDown);

// Scene initialisation. This function is only run once, at the very beginning.
function init() {
    
    scene = new THREE.Scene();

    setupHero();
    setupVillian();   
    var spaceTexture = new THREE.TextureLoader().load('themes/space.jpg');
    scene.background = spaceTexture;

    // Set up pivot point around which the camera rotates about, using default values
    setOrbitalPoint(0,0,0, Math.PI/256, Math.PI/256)
    
    // Set up the camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(15,15, 15);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // create an AudioListener and add it to the camera
    listener = new THREE.AudioListener();
    camera.add( listener );

    // Draw a helper grid in the x-z plane (note: y is up).
    // scene.add(new THREE.GridHelper(10, 20, 0xffffff));

    // power orbs that when combined can create different abilities
    setupOrbs();

    // these are all the different abilities that can be created
    setupAbilities();

    // Basic ambient lighting.
    // scene.add(new THREE.AmbientLight())
    
    // TASK: add more complex lighting for 'face' rendering mode (requirement 4).
    // ??????? is this not just the same as the cube?
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

function setupHero(){
    hero = new THREE.Object3D()
    var heroColours = ['0xE400FF', '0xD20013', '0xE400FF', '0xE7B600', '0xFFE8A9', '0xE400FF']
    heroRotY = 0;
    
    // instantiate a loader
    var loader = new THREE.OBJLoader();
    loader.setPath('models/')
    // load a resource
    loader.load(
        // resource URL
        'silencer.obj',
        // called when resource is loaded
        function ( object ) {
            var i = 0;
            object.traverse( function( child ) {
                if ( child instanceof THREE.Mesh ) {
                    // apply material to each mesh
                    var material = new THREE.MeshStandardMaterial()
                    material.color.setHex(heroColours[i]);
                    child.material = material;
                    i++
                }
            } );
            hero = object;
            hero.scale.set(5,5,5)
            hero.rotation.y +=2;
            hero.position.set(-5,0,12)
            scene.add(hero)

        },
        // called when loading is in progresses
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

            console.log( 'An error happened' );

        }
    );
}

function setupVillian(){
    villian = new THREE.Object3D()
    var material = new THREE.MeshStandardMaterial({ color: 0x0615A6 })
    // villianRotY = 0;
    
    // instantiate a loader
    var loader = new THREE.OBJLoader();
    loader.setPath('models/')
    // load a resource
    loader.load(
        // resource URL
        'sven_model.obj',
        // called when resource is loaded
        function ( object ) {
            object.traverse( function( child ) {
                if ( child instanceof THREE.Mesh ) {
                    // apply material to each mesh
                    child.material = material;
                }
            } );
            villian = object;
            villian.scale.set(0.02,0.02,0.02)
            // villian.rotation.y +=2.2;
            villian.position.set(5,0,-20)
            scene.add(villian)
            console.log(villian);

        },
        // called when loading is in progresses
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

            console.log( 'An error happened' );

        }
    );
}

// initialise all abilities
function setupAbilities(){
    currentAbility = new THREE.Object3D()
    scene.add(currentAbility)

    setupColdSnap()
    setupGhostWalk()
    setupIceWall()
    setupTornado()
    setupEMP()
    setupAlacrity()
    setupForgeSpirits()
    setupChaosMeteor()
    setupSunStrike()
    setupDeafeningBlast()
}

// active the ability that is a result of combining the current orbs
// orbsCount: a 3 element array describing the number of 
//            quas, wex and exort orbs currently present
//            [qCount, wCount, eCount]
function activateAbility(orbsCount){
    var quasCount = orbsCount[0]
    var wexCount = orbsCount[1]
    var exortCount = orbsCount[2]

    if (quasCount ==3 && wexCount == 0 && exortCount ==0) {
        activateColdSnap()
    } else if (quasCount ==2 && wexCount == 1 && exortCount ==0) {
        activateGhostWalk()
    } else if (quasCount ==2 && wexCount == 0 && exortCount ==1) {
        activateIceWall()
    } else if (quasCount ==0 && wexCount == 3 && exortCount == 0) {
        activateEMP()
    } else if (quasCount == 1 && wexCount == 2 && exortCount ==0) {
        activateTornado()
    } else if (quasCount ==0 && wexCount == 2 && exortCount ==1) {
        activateAlacrity()
    } else if (quasCount ==0 && wexCount == 0 && exortCount ==3) {
        activateSunStrike()
    } else if (quasCount ==1 && wexCount == 0 && exortCount ==2) {
        activateForgeSpirits()
    } else if (quasCount ==0 && wexCount == 1 && exortCount ==3) {
        activateChaosMeteor()
    } else if (quasCount ==1 && wexCount == 1 && exortCount ==1) {
        activateDeafeningBlast()
    } else {
        return;
    }

    if (heroRotY < 0.5) {
        heroRotY += 0.01;
    } else {
        heroRotY =0;
    }

    playAbilitySound();
}

function playAbilitySound(){
    var soundURL;

    switch (currentAbility) {
        case tornado:
            soundURL = "audio/Tornado.mp3"
            break;
    
        case sunStrike:
            soundURL = "audio/Sun_Strike.mp3"
            break;
        
        case iceWall:
            soundURL = "audio/Ice_Wall.mp3"
            break;

        case emp:
            soundURL = "audio/EMP.mp3"
            break;

    }

    // create a global audio source
    const sound = new THREE.Audio( listener );

    // load a sound and set it as the Audio object's buffer
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( soundURL, function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop( false );
        sound.setVolume( 0.5 );
        sound.play();
    });
}

function setupColdSnap(){  
    // TODO
}

function setupGhostWalk(){    
    // TODO
}

function setupIceWall(){  
    var geometry = new THREE.BoxGeometry( 20,8, 2);
    var material = new THREE.MeshStandardMaterial( {color: 0x009EC0} );
    iceWall = new THREE.Mesh( geometry, material );  
}

function setupTornado(){    
    const geometry = new THREE.ConeGeometry( 5, 20, 32 );
    const material = new THREE.MeshStandardMaterial( {color: 0x7A0B75} );
    tornado = new THREE.Mesh( geometry, material );
    tornado.scale.set(0.75,0.75,0.75)
    tornado.rotation.x = Math.PI
}

function setupEMP(){
    const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
    const material = new THREE.MeshStandardMaterial( { color: 0x7A0B75 } );
    emp = new THREE.Mesh( geometry, material );
    emp.scale.set(0.5,0.5,0.5)
}

function setupAlacrity(){
    // TODO
}

function setupForgeSpirits(){   
    // TODO 
}

function setupChaosMeteor(){    
    // TODO
}

function setupSunStrike(){
    var geometry = new THREE.CylinderGeometry( 2,1, 10, 32 );
    var material = new THREE.MeshStandardMaterial( {color: 0xE28F01} );
    sunStrike = new THREE.Mesh( geometry, material );
    sunStrike.scale.set(0.75,0.75,0.75)
}

function setupDeafeningBlast(){ 
    // TODO   
}



// Activate abilities

function activateColdSnap(){    
    // TODO
}

function activateGhostWalk(){  
    // TODO  
}

function activateIceWall(){    
    scene.remove(currentAbility)
    scene.add(iceWall)
    iceWall.position.set(0,0,-15)
    currentAbility = iceWall
}

function activateTornado(){    
    scene.remove(currentAbility)
    scene.add(tornado)
    tornado.position.set(2,-2,-15)
    currentAbility = tornado
}

function activateEMP(){
    scene.remove(currentAbility)
    scene.add(emp)
    emp.position.set(0,0,-15)
    currentAbility = emp
}

function activateAlacrity(){   
    // TODO 
}

function activateForgeSpirits(){   
    // TODO 
}

function activateChaosMeteor(){    
    // TODO
}

function activateSunStrike(){
    scene.remove(currentAbility)
    scene.add(sunStrike)
    sunStrike.position.set(0,0,-15)
    currentAbility = sunStrike
}

function activateDeafeningBlast(){    
    // TODO
}



function setupOrbs(){
    var geometry = new THREE.SphereGeometry()

    quasMaterial = new THREE.MeshStandardMaterial({color: 0x009EC0 })
    wexMaterial = new THREE.MeshStandardMaterial({color: 0x7A0B75 })
    exortMaterial = new THREE.MeshStandardMaterial({ color: 0xE28F01 })
    
    orb1 = new THREE.Mesh(geometry, quasMaterial)
    orb2 = new THREE.Mesh(geometry, wexMaterial)
    orb3 = new THREE.Mesh(geometry, exortMaterial)

    orbs = [orb1, orb2, orb3]
    currentOrbsCount = [1, 1, 1]  // count of number of a certain power orb active
    currentOrbIndex = 0
    
    pivotPoint.add(orb1)
    pivotPoint.add(orb2)
    pivotPoint.add(orb3)

    orb1.position.set(5,0,0,)
    orb1.scale.set(1,1,1)
    
    orb2.position.set(-3,0,-4,)
    orb2.scale.set(1,1,1)
    
    orb3.position.set(-3,0,4)
    orb3.scale.set(1,1,1)
}


function setOrbitalPoint(x=0, y=0, z=0, rotLatitude = 0, rotLongitude = 0){
    pivotPoint = new THREE.Object3D()
    scene.add(pivotPoint)
    pivotPoint.position.set(x,y,z)
    orbitalRotLat = rotLatitude
    orbitalRotLong = rotLongitude
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

    pivotPoint.rotation.y += orbitalRotLat;
    pivotPoint.rotation.x += orbitalRotLong;
    
    hero.rotation.y += heroRotY;

    transfromAbility()

    // Render the current scene to the screen.
    renderer.render(scene, camera);
}

function transfromAbility(){
    switch (currentAbility) {
        case tornado:
            tornado.rotation.y += 0.2
            break;
    
        case sunStrike:
            sunStrike.rotation.x += 0.1
            // sunStrike.rotation.y += 0.1
            // sunStrike.rotation.z += 0.1
            break;
        
        case iceWall:
            // iceWall.rotation.y += 0.1
            break;

        case emp:
            emp.rotation.x += 0.15
            emp.rotation.y += 0.15
            emp.rotation.z += 0.15
            break;

        
    }
}

// Handle keyboard presses.
function handleKeyDown(event) {
    switch (event.key) {

        // secect different orbs
        case 'q':
            var currentOrb = orbs[currentOrbIndex].material

            // if max orbs has not been reached or material
            // of current index is already quasMaterial, break
            if (orbs[currentOrbIndex].material == quasMaterial) {
                currentOrbIndex = (currentOrbIndex +1) %3
                break
            }

            // decrease count of previous orb
            if (currentOrb == wexMaterial) {
                currentOrbsCount[1]--
            } else if (currentOrb == exortMaterial){
                currentOrbsCount[2]--
            }

            // update to new orb, and increase orb count
            orbs[currentOrbIndex].material = quasMaterial
            currentOrbsCount[0]++
            currentOrbIndex = (currentOrbIndex +1) %3
            break
        
            
        case 'w':
            var currentOrb = orbs[currentOrbIndex].material

            if (orbs[currentOrbIndex].material == wexMaterial) {
                currentOrbIndex = (currentOrbIndex +1) %3
                break
            }

            // decrease count of previous orb
            if (currentOrb == quasMaterial) {
                currentOrbsCount[0] --
            } else if (currentOrb == exortMaterial){
                currentOrbsCount[2]--
            }

            // update to new orb, and increase orb count
            orbs[currentOrbIndex].material = wexMaterial
            currentOrbsCount[1]++
            currentOrbIndex = (currentOrbIndex +1) %3
            break
        
        case 'e':
            var currentOrb = orbs[currentOrbIndex].material

            if (orbs[currentOrbIndex].material == exortMaterial) {
                currentOrbIndex = (currentOrbIndex +1) %3
                break
            }

            // decrease count of previous orb
            if (currentOrb == quasMaterial) {
                currentOrbsCount[0] --
            } else if (currentOrb == wexMaterial){
                currentOrbsCount[1]--
            }

            // update to new orb, and increase orb count
            orbs[currentOrbIndex].material = exortMaterial
            currentOrbsCount[2]++
            currentOrbIndex = (currentOrbIndex +1) %3
            break

        
        // activate ability by combining the current active orbs
        case 'r':
            activateAbility(currentOrbsCount)
            break
    }
}