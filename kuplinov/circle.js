
const circle = document.getElementById('circle');
const screenWidth = window.innerWidth;
const circleWidth = circle.offsetWidth;
const fullDuration = 30000; // 30 seconds in milliseconds
const startPosition = 0.44 * screenWidth;
const endPosition = screenWidth;
const loopStartPosition = -13;

function moveCircle(start, end, duration) {
    const distance = end - start;
    const startTime = performance.now();

    function step(currentTime) {
        const elapsedTime = currentTime - startTime;
        if (elapsedTime < duration) {
            const progress = elapsedTime / duration;
            circle.style.left = (start + distance * progress) + 'px';
            requestAnimationFrame(step);
        } else {
            circle.style.left = end + 'px';
            if (end === endPosition) {
                // When reaching the right edge, start from half off the left side
                moveCircle(loopStartPosition, endPosition, fullDuration);
            } else if (start === startPosition) {
                // Initial movement from 45% to right edge
                moveCircle(endPosition, endPosition, 0); // Instantly move to right edge
                moveCircle(loopStartPosition, endPosition, fullDuration);
            } else {
                // Movement from initial 45% position
                moveCircle(startPosition, endPosition, fullDuration * 0.55);
            }
        }
        checkCollision();
    }

    requestAnimationFrame(step);
}

// Initial movement
moveCircle(startPosition, endPosition, fullDuration * 0.55);


//circle mutations
function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

function animateCircleSize() {
    const circle = document.getElementById('circle');
    const currentHeight = parseFloat(getComputedStyle(circle).height);
    const currentWidth = parseFloat(getComputedStyle(circle).width);

    const newHeight = randomInRange(20, 25);
    const newWidth = randomInRange(15, 20);

    circle.animate([
        { height: currentHeight + 'px', width: currentWidth + 'px' },
        { height: newHeight + 'vh', width: newWidth + 'vh' }
    ], {
        duration: 1000,
        easing: 'ease-in-out',
        fill: 'forwards'
    });
    checkCollision();
}

// Run the height animation every 2-4 seconds
function scheduleHeightChange() {
    setTimeout(() => {
        animateCircleSize();
        scheduleHeightChange();
    }, randomInRange(500, 2000));
}

// Run the width animation every 2-4 seconds
function scheduleWidthChange() {
    setTimeout(() => {
        animateCircleSize();
        scheduleWidthChange();
    }, randomInRange(500, 2000));
}

// Start the independent animations
scheduleHeightChange();
scheduleWidthChange();

//arrow logic
const arrows = [document.getElementById('arrow1'), document.getElementById('arrow2')];
const arrowPositions = [{ angle: 0, distance: 0, desiredDistance: 0 }, { angle: 0, distance: 0, desiredDistance: 0 }];

function updateArrowPosition(index, animate = false) {
    const circle = document.getElementById('circle');
    const arrow = arrows[index];
    const circleRect = circle.getBoundingClientRect();

    const circleCenterX = circleRect.left + circleRect.width / 2;
    const circleCenterY = circleRect.top + circleRect.height / 2;

    if (!animate) {
        arrowPositions[index].angle = Math.random() * 2 * Math.PI;
    }

    const minDistance = Math.max(circleRect.width, circleRect.height) / 2 + 20;
    arrowPositions[index].desiredDistance = minDistance;

    if (!animate) {
        arrowPositions[index].distance = minDistance;
    } else {
        // Smoothly animate back to desired distance
        const distanceDiff = arrowPositions[index].desiredDistance - arrowPositions[index].distance;
        arrowPositions[index].distance += distanceDiff * 0.1; // Adjust 0.1 for faster/slower animation
    }

    const arrowX = circleCenterX + Math.cos(arrowPositions[index].angle) * arrowPositions[index].distance;
    const arrowY = circleCenterY + Math.sin(arrowPositions[index].angle) * arrowPositions[index].distance;

    arrow.style.left = `${arrowX - 20}px`;
    arrow.style.top = `${arrowY - 20}px`;
    arrow.style.transform = `rotate(${arrowPositions[index].angle + Math.PI / 2}rad)`;
}

function checkCollision() {
    const circle = document.getElementById('circle');
    const circleRect = circle.getBoundingClientRect();

    arrows.forEach((arrow, index) => {
        const arrowRect = arrow.getBoundingClientRect();

        const dx = (circleRect.left + circleRect.width / 2) - (arrowRect.left + arrowRect.width / 2);
        const dy = (circleRect.top + circleRect.height / 2) - (arrowRect.top + arrowRect.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < (circleRect.width / 2 + arrowRect.width / 2)) {
            // Collision detected, increase distance
            arrowPositions[index].distance += 5;
        }
    });
}

function animateArrows() {
    arrows.forEach((_, index) => {
        updateArrowPosition(index, true);
    });
    requestAnimationFrame(animateArrows);
}

// Update arrow positions every second
setInterval(() => {
    arrows.forEach((_, index) => {
        updateArrowPosition(index);
    });
}, 500);

// Check for collisions and animate arrows
animateArrows();

// Initial arrow positions
arrows.forEach((_, index) => {
    updateArrowPosition(index);
});
