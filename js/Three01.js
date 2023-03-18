import * as THREE from 'https://unpkg.com/three/build/three.module.js';

function addRandomBox(event, scene) {                
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );                
    const material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
    const box = new THREE.Mesh( geometry, material );  
    const edges = new THREE.EdgesGeometry( geometry );
    const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x808080 } ) );
    box.add( line ); 
    box.position.y = Math.random() * 10 * binary[Math.floor(Math.random() * 2)];     
    box.position.x = Math.random() * 25 * binary[Math.floor(Math.random() * 2)];           
    scene.add( box );                
    
    return scene, box
}

function boxAnimation(animatedBox, index, array){   
    var box = animatedBox.box;                                
    animatedBox.rotateBox();
    animatedBox.moveBox();                                      

    if (box.position.x >  29 || box.position.x < -29 ){                        
        animatedBox.direction.directX *= -1;                                                                     
        animatedBox.randomChangeVelocity();                                                              
    } 

    if (box.position.y >  14 || box.position.y < -14 ){    
        animatedBox.direction.directY *= -1;     
        animatedBox.randomChangeVelocity();                                                                                                                                                      
    } 

}

class animatedBox{
    constructor(box){
        this.box = box;
        this.direction = {
            directX : binary[Math.floor(Math.random() * 2)],
            directY : binary[Math.floor(Math.random() * 2)]
        }
        this.velocity = {
            velocX : 0.01,
            velocY : 0.01
        }        
        this.boundingBox = new THREE.Box3().setFromObject(box);
    }


    randomChangeVelocity(){        
        this.velocity.velocY +=  binary[Math.floor(Math.random() * 2)] * 0.005;
        this.velocity.velocX +=  binary[Math.floor(Math.random() * 2)] * 0.005;               
    }

    rotateBox(){
        this.box.rotation.x += 0.02;
        this.box.rotation.y += 0.02;
        this.box.rotation.z += 0.02; 
    }

    moveBox(){
        this.box.position.x += this.velocity.velocX * this.direction.directX;    
        this.box.position.y += this.velocity.velocY * this.direction.directY;  
    }

    setNewDirection(directX, directY){
        this.direction.directX = directX;
        this.direction.directY = directY;
    }

    increaseVelocity(factor){
        this.velocity.velocX *= factor;
        this.velocity.velocY *= factor; 
    }

    randomChangeDirection(){
        let oldDirectX = this.direction.directX;
        let oldDirectY = this.direction.directY;
        let newDirectX, newDirectY;                
        do {
            newDirectX = binary[Math.floor(Math.random() * 2)];
            newDirectY = binary[Math.floor(Math.random() * 2)];            
        } while(newDirectX == oldDirectX && newDirectY == oldDirectY)

        this.setNewDirection(newDirectX, newDirectY);     
          
    }
}

function BoxOnMouseClick(event) {

    // Calculate mouse position
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Test if the ray intersects with any objects in the scene
    var intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        let uuid = intersects[0].object.geometry.parameters.geometry.uuid
        let clickedBox = boxList[boxIdList.indexOf(uuid)];   
               
        clickedBox.randomChangeDirection();
        clickedBox.increaseVelocity(1.5);            
    }

}

function animate() {
    requestAnimationFrame( animate );	    			                                
    boxList.forEach(boxAnimation);                                                   
                         
    renderer.render( scene, camera );
}     

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xE8D5C4);
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.z = 20;

const boxList = [];    
const boxIdList = [];        
const binary = [1, -1];                                      

document.addEventListener("keydown", (e) =>{      
    let box;                                      
    scene, box = addRandomBox(e, scene);       
    boxList.push(new animatedBox(box)); 
    boxIdList.push(box.geometry.uuid)                                 
});   


// Set up a raycaster
var raycaster = new THREE.Raycaster();

// Set up a mouse vector
var mouse = new THREE.Vector2();

// Add a click event listener to the canvas
document.addEventListener('click', BoxOnMouseClick, false);



animate();