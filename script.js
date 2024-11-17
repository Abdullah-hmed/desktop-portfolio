function updateTime() {
    const now = new Date();
    document.getElementById('time').textContent = now.toLocaleTimeString();
}

// Update time immediately and every second
updateTime();
setInterval(updateTime, 1000);

// Draggable functionality
function dragElement(elmnts) {
    elmnts.forEach(elmnt => {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        elmnt.onmousedown = function(e) {
            
            e.preventDefault();
            
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            document.onmouseup = function(e) {                
                document.onmouseup = null;
                document.onmousemove = null;
            };
            
            document.onmousemove = function(e) {
                e.preventDefault();
                
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                
                elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
            };
        }; 
    });
}

function assignListeners(desktopIcons) {
    desktopIcons.forEach((desktopIcon) => {
        desktopIcon.addEventListener('dblclick', () => {
            alert('Hi Huzz');
        })
    })
}

function toggleStartButton() {
    const startMenu = document.getElementById('start-menu');
    startMenu.classList.toggle('show');
}

function toggleRightClickMenu(rightClickMenu, posX, posY) {
    rightClickMenu.classList.toggle('show');
    rightClickMenu.style.left = `${posX}px`;
    rightClickMenu.style.top = `${posY}px`;
}



const startButton = document.getElementById('start-button');
const shutdownButton = document.getElementById('shutdown');
const desktopIcons = document.querySelectorAll('.draggable-button');
const startMenu = document.getElementById("start-menu");
const rightClickMenu = document.getElementById('right-click-menu');
const refreshButton = document.getElementById('refresh');

document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    toggleRightClickMenu(rightClickMenu, event.clientX, event.clientY);
});

refreshButton.addEventListener('click', () => {
    location.reload();
});

startButton.addEventListener('click', () => {
    toggleStartButton();
    console.log("Hi");
});

shutdownButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to shutdown?')) {
        window.close();
    }
});

document.addEventListener('click', (event) => {
    if (!rightClickMenu.contains(event.target)) {
      rightClickMenu.classList.remove('show');
    }
    if (!startMenu.contains(event.target) && !startButton.contains(event.target)) {
      startMenu.classList.remove('show');
    }
});

dragElement(desktopIcons);

assignListeners(desktopIcons);

