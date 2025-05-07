document.addEventListener('DOMContentLoaded', function () {
    let currentWidth = 100;  // Default to 100% width

    let svgObject = document.getElementById('svgObject');
    let svgContainer = document.querySelector('.Interactable_svg');
    let zoomInBtn = document.createElement('button');
    zoomInBtn.textContent = '+';
    zoomInBtn.classList.add('zoom-button');
    zoomInBtn.id = 'zoomInBtn';

    let zoomOutBtn = document.createElement('button');
    zoomOutBtn.textContent = '-';
    zoomOutBtn.classList.add('zoom-button');
    zoomOutBtn.id = 'zoomOutBtn';

    // Add the buttons to the container (Interactable_svg)
    svgContainer.appendChild(zoomInBtn);
    svgContainer.appendChild(zoomOutBtn);
  
    // Function to zoom in
    function zoomIn() {
        let currentWidth = svgObject.style.width;
    
        // Check if width is explicitly set in inline style
        if (!currentWidth) {
            // If there's no inline width, we assume it is '100%'
            currentWidth = '100%';
        }
    
        // If the width is in percentage
        if (currentWidth.includes('%')) {
            let currentWidthValue = parseFloat(currentWidth);
            currentWidthValue += 10; // Add 10% to the current width
            svgObject.style.width = currentWidthValue + '%';
        } 
        // If the width is in pixels
        else if (currentWidth.includes('px')) {
            let currentWidthValue = parseFloat(currentWidth);
            currentWidthValue += 50; // Add 50px to the current width (adjust as needed)
            svgObject.style.width = currentWidthValue + 'px';
        }
        else {
            // If the width is not set or recognized, default to 100%
            svgObject.style.width = '100%';
        }
    }
    
  
    // Function to zoom out
    function zoomOut() {
        let svgObject = document.getElementById('svgObject');
        let currentWidth = svgObject.style.width;
    
        // Check if width is explicitly set in inline style
        if (!currentWidth) {
            // If there's no inline width, we assume it is '100%'
            currentWidth = '100%';
        }
    
        // If the width is in percentage
        if (currentWidth.includes('%')) {
            let currentWidthValue = parseFloat(currentWidth);
            currentWidthValue -= 10; // Add 10% to the current width
            svgObject.style.width = currentWidthValue + '%';
        } 
        // If the width is in pixels
        else if (currentWidth.includes('px')) {
            let currentWidthValue = parseFloat(currentWidth);
            currentWidthValue -= 50; // Add 50px to the current width (adjust as needed)
            svgObject.style.width = currentWidthValue + 'px';
        }
        else {
            // If the width is not set or recognized, default to 100%
            svgObject.style.width = '100%';
        }
    }
  
    // Add event listeners to buttons
    zoomInBtn.addEventListener('click', zoomIn);
    zoomOutBtn.addEventListener('click', zoomOut);

    
  });
  
  /*
  window.addEventListener('message', (event) => {
    if (event.data?.type === 'svgScroll') {
      console.log(`Scrolled ${event.data.direction} inside SVG`);
      if(event.data.direction=="up"){zoomIn();}
      else if (event.data.direction=="down"){zoomOut();}
    }
  });
  const container = document.querySelector('.Interactable_svg');

container.addEventListener('mouseenter', () => {
  document.body.style.overflow = 'hidden';
});

container.addEventListener('mouseleave', () => {
  document.body.style.overflow = '';
});
*/