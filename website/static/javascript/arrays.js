const squareWrapper = document.getElementById('squares-wrapper');
var delay = 0.3;
var decrement = 0.007;

function createArray(){
    for(let i=1;i<21;i++){
        // create square
        const newSquare = document.createElement('div');
        newSquare.className = 'square';
        newSquare.style.animation = 'fadeInLeft 2s ease '+ i * delay + 's forwards';

        // create container for sqaure and info square
        const squareContainer = document.createElement('div');
        squareContainer.className = 'square-container';
        squareContainer.appendChild(newSquare);

        // create info index
        const index = document.createElement('div');
        index.className = "index";
        index.innerHTML = '<div class="text-square">' + (i-1) + '</div><div class="text-index">Index</div>';
        squareContainer.appendChild(index);

        newSquare.addEventListener('mouseenter', function(event) {

            // Get the computed style of the element
            const computedStyle = window.getComputedStyle(newSquare);

            // Retrieve the opacity value
            const opacityValue = computedStyle.getPropertyValue('opacity');

            console.log(opacityValue); // Output the opacity value
            if(opacityValue >= '0.5'){
                index.style.opacity = '1';
            }
        });
        
        newSquare.addEventListener('mouseleave', function() {
            index.style.opacity = '0';
        });
        
        squareWrapper.appendChild(squareContainer);

        // create inner info square
        var randomNumber = Math.floor(Math.random() * 99) + 1;
        const innerSquare = document.createElement('div');
        innerSquare.className = 'innerSquare';
        innerSquare.innerHTML = randomNumber;

        newSquare.appendChild(innerSquare);


        delay -= decrement;
        decrement -= 0.0002; 
    }
}

createArray();