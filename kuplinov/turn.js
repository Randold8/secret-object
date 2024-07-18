let guy = document.getElementById('kuplahead');
let initialRotation = 15;

document.addEventListener('mousemove', (event) => {
  let rect = guy.getBoundingClientRect();
  let centerX = rect.left + rect.width/2;
  let centerY = rect.top + rect.height/2;

  let mouseX = event.clientX;
  let mouseY = event.clientY;

  let radians = Math.atan2(mouseX - centerX, mouseY - centerY);
  let degree = radians * (180 / Math.PI) * -1 + 90 + initialRotation;

  guy.style.transform = `rotate(${degree}deg)`;
});

