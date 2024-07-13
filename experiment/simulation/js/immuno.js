let currentAnimation = 0;
const animations = Array.from({length: 13}, (_, i) => `./json/Step_${i+1}.json`);
let animationInstance = null;
let currentProcedure = null;

// Create an array of all procedures
var allProcedures = [ 
    '1. Carefully remove culture medium from confluent cells',
    '2. Wash the cells once with PBS',        
    '3. Add ice-cold IP Lysis/Wash Buffer (Table 1) to the cells. Incubate on ice for 5 minutes with periodic mixing',
    '4. Transfer the lysate to a microcentrifuge tube and centrifuge at ~13,000 × g for 10 minutes to pellet the cell debris',
    '5. Transfer supernatant to a new tube',
    '6. Centrifuge the cell suspension 5 minutes to pellet the cells',
    '7. Discard the supernatant.Wash cells once by suspending the cell pellet in PBS',
    '8. Centrifuge at 1000 × g for 5 minutes to pellet cells',
    '9. Add ice cold IP Lysis/Wash Buffer to the cell pellet',
    '10. Immunoprecipitation',
    '11. Immunoprecipitation',
    '12. Immunoprecipitation',
    '13. Immunoprecipitation'
];

import { tooltips } from './tooltip.js';
import { showTooltip } from './tooltip.js';
import { hideTooltip } from './tooltip.js';

// Get the play-all, start, prev, and next buttons
const playAllButton = document.getElementById('play-all');
const startButton = document.getElementById('start');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');

// Store the original color of the play-all and the next button
const originalPlayAllButtonColor = playAllButton.style.color;
const originalNextButtonColor = nextButton.style.color;

document.getElementById('prev').style.display = 'none';
document.getElementById('procedure_container').style.display = 'none';
document.getElementById('extra-button').style.display = 'none';
document.getElementById('procedure_title').style.display = 'none';


startButton.addEventListener('click', () => {  
    loadAnimation();
    document.getElementById('start').style.display = 'none';
    document.getElementById('play-all').style.display = 'inline-block';
    document.getElementById('next').style.display = 'inline-block';
    // Enable the play-all button and restore its color when the start button is clicked
    playAllButton.disabled = false;
    playAllButton.style.color = originalPlayAllButtonColor;

    // Hide the procedure block/title and the extra button
    document.getElementById('procedure_container').style.display = 'block';
    document.getElementById('extra-button').style.display = 'block';
    document.getElementById('procedure_title').style.display = 'block';
    // Do not display the Previous button yet
});

playAllButton.addEventListener('click', () => {
    // Hide the prev and next buttons
    prevButton.style.display = 'none';
    nextButton.style.display = 'none';

    // Show the start button
    startButton.style.display = 'inline-block';

    // Disable the play-all button and change its color
    playAllButton.disabled = true;
    playAllButton.style.color = 'lightgray'; // Change this to the color you want

    playAllAnimations();
});

document.getElementById('next').addEventListener('click', () => {
    currentAnimation = (currentAnimation + 1) % animations.length;    
    loadAnimation(); // Load and play the current animation

    // Display the 'Prev' button when the 'Next' button is clicked for the first time
    document.getElementById('prev').style.display = 'inline-block';
    
    // If currentAnimation has reached the end of the animations array, change the button text to 'End'
    if (currentAnimation === animations.length - 1) {
        document.getElementById('next').textContent = 'End';
        nextButton.disabled = true;
        nextButton.style.color = 'lightgray'; // Change this to the color you want
    } else {
        nextButton.textContent = 'Next';
        nextButton.disabled = false;
        nextButton.style.color = originalNextButtonColor;
    }
});


document.getElementById('prev').addEventListener('click', () => {
    currentAnimation = (currentAnimation - 1 + animations.length) % animations.length;    
    loadAnimation(); // Load and play the current animation
    if (currentAnimation !== animations.length - 1) {
        nextButton.textContent = 'Next';
        nextButton.disabled = false;
        nextButton.style.color = originalNextButtonColor;
    }
});

document.addEventListener('DOMContentLoaded', (event) => {
    const proceduresContainer = document.getElementById('procedure_container');

    allProcedures = allProcedures.map((procedure, index) => {
        const procedureElement = document.createElement('div');        
        procedureElement.id = `procedure-${index}`;
        procedureElement.className = 'procedure';

        const procedureText = document.createElement('span');
        procedureText.textContent = procedure;
        procedureElement.appendChild(procedureText);

        proceduresContainer.appendChild(procedureElement);
        return procedureElement;
    });
});

function loadAnimation() {
    // Hide the previous procedure
    if (currentProcedure) {
        currentProcedure.style.display = 'none';
    }

// Show the current procedure and the two procedures before and after it
allProcedures.forEach((procedure, index) => {
    if (index >= currentAnimation - 2 && index <= currentAnimation + 2) {
        procedure.style.display = 'block';
    } else {
        procedure.style.display = 'none';
    }

    if (index === currentAnimation) {
        procedure.classList.add('active');
    } else {
        procedure.classList.remove('active');
    }
}); 

    console.log(`Loading animation ${currentAnimation}`); // Log when an animation is loaded
    if(animationInstance) {
        animationInstance.destroy();
    }
    animationInstance = lottie.loadAnimation({
        container: document.getElementById('animation_container'),
        renderer: 'svg',
        loop: false,
        autoplay: true,
        path: animations[currentAnimation]
    });
    animationInstance.setSpeed(0.75); // Reduce the speed of the animation to 75% of the original speed    
}

function playAllAnimations() {
    currentAnimation = 0;
    playAnimation(currentAnimation);
}

function playAnimation(index) {
    return new Promise((resolve, reject) => {
        loadAnimation();
        animationInstance.addEventListener('complete', () => {
            //console.log(`Animation ${index} completed`); // Log when an animation completes
            resolve();
        });
    }).then(() => {
        if (currentAnimation < animations.length - 1) {
            currentAnimation++;            
            playAnimation(currentAnimation);
        }
    }).finally(() => {
        // Enable the play-all button and restore its color when all animations have completed
        if (currentAnimation === animations.length - 1) {
           playAllButton.disabled = false;
           playAllButton.style.color = originalPlayAllButtonColor;
           document.getElementById('prev').style.display = 'inline-block';
                       
           // Reset the 'Next' button
           nextButton.textContent = 'Next';
           nextButton.disabled = false;
           nextButton.style.color = originalNextButtonColor;
       }
    });
}

document.getElementById('extra-button').addEventListener('click', function() {
    this.style.display = 'none';
    document.getElementById('icon_container').style.display = 'block';
});

document.getElementById('close-icon-container').addEventListener('click', function() {
    document.getElementById('icon_container').style.display = 'none';
    document.getElementById('extra-button').style.display = 'block';
});

// Get the close button
var closeButton = document.getElementById('close-tooltip');

// Check if the close button exists
if (!closeButton) {
    console.error('close-tooltip not found');
} else {
    // Add an event listener to the close button
    closeButton.addEventListener('click', hideTooltip);
}