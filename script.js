let openWindows = [];
const isTouchDevice = 'ontouchstart' in window || navigator.msMaxTouchPoints > 0;

function updateTime() {
    const now = new Date();
    document.getElementById('time').textContent = now.toLocaleTimeString();
}

function removeWindowFromList(windowTitle) {
    const index = openWindows.indexOf(windowTitle);
    if (index !== -1) {
        openWindows.splice(index, 1);
    }
}

// Update time immediately and every second
updateTime();
setInterval(updateTime, 1000);

// Draggable functionality
function dragElement(elmnts) {
    if (!(elmnts instanceof NodeList) && !(elmnts instanceof Array)) {
        elmnts = [elmnts];
    }
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

function dragWindow(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const topBar = elmnt.querySelector('.top-bar');
    topBar.onmousedown = function(e) {
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
}

function assignListeners(desktopIcons) {
    desktopIcons.forEach((desktopIcon) => {
        if(isTouchDevice) {
            desktopIcon.addEventListener('touchend', () => {
                openIcon(desktopIcon);   
            });    
        } else {
            desktopIcon.addEventListener('dblclick', () => {
                openIcon(desktopIcon);   
            });
        }
        
        desktopIcon.addEventListener('contextmenu', (event)=> {
            event.preventDefault();
            toggleRightClickMenu(rightClickIcon, event.clientX, event.clientY);
            
        })
    })
}

function openIcon(desktopIcon) {
    const iconName = desktopIcon.querySelector('.desktop-icon-text').textContent;
    if(openWindows.includes(iconName)) {
        console.log(iconName + ' is already open');
        return;
    }
    const newWindow = createWindowElement(iconName);
    document.body.appendChild(newWindow);
    openWindows.push(iconName);
    console.log(openWindows);
}

function resetIcons(desktopIcons) {
    let top = 20;
    desktopIcons.forEach((desktopIcon, index) => {
        desktopIcon.style.top = (top + (index * 100)) + 'px';
        desktopIcon.style.left = '20px';
        index = index + 100;
    });
}

function logOffOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.style.transition = 'opacity 0.5s ease-in-out';
    document.body.appendChild(overlay);
    

    overlay.addEventListener('click', () => {
        overlay.style.animation = 'fade-out 0.5s ease-in-out';
        overlay.style.opacity = 0;
        overlay.addEventListener('animationend', () => {
            overlay.remove();
        });
    });
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

function createWindowElement(title) {
    // Create main window div
    const windowDiv = document.createElement('div');
    windowDiv.className = 'window';
    windowDiv.setAttribute('tabindex', '0');
    windowDiv.style.zIndex = 100;
    if(isTouchDevice) {
        windowDiv.style.width = '50%';
        windowDiv.style.height = '50%';
    } else {
        // Redefine this when you want custom sized windows
        windowDiv.style.width = '300px';
        windowDiv.style.height = '300px';
    }

    // Create top bar
    const topBar = document.createElement('div');
    topBar.className = 'top-bar';

    // Create top bar left
    const topBarLeft = document.createElement('div');
    topBarLeft.className = 'top-bar-left';

    const titleParagraph = document.createElement('p');
    titleParagraph.textContent = title || 'Window Title';
    titleParagraph.style.paddingLeft = '3px';
    titleParagraph.style.fontFamily = 'WindowsFont, sans-serif';
    titleParagraph.style.fontSize = 'larger';
    titleParagraph.style.userSelect = 'none';
    topBarLeft.appendChild(titleParagraph);

    // Create top bar right
    const topBarRight = document.createElement('div');
    topBarRight.className = 'top-bar-right';

    const minimizeButton = document.createElement('button');
    minimizeButton.textContent = '-';
    // minimizeButton.innerHTML = '<b>_</b>';
    minimizeButton.innerHTML = '<i class="fa fa-lg side fa-minus" style="margin-top: 7px"></i>';
    minimizeButton.style.fontFamily = 'WindowsFont, sans-serif';
    minimizeButton.id  = 'minimize-button';

    const maximizeButton = document.createElement('button');
    // maximizeButton.textContent = '🗖';
    maximizeButton.innerHTML = '<i class="fa fa-window-maximize"></i>';
    maximizeButton.style.fontFamily = 'WindowsFont, sans-serif';
    maximizeButton.id  = 'maximize-button';

    const closeButton = document.createElement('button');
    // closeButton.textContent = 'X';
    closeButton.innerHTML = '<i class="fa fa-lg fa-times"></i>';
    closeButton.style.fontFamily = 'WindowsFont, sans-serif';
    closeButton.id = 'close-button';

    // Add window icon
    const taskbarButton = document.createElement('button');
    taskbarButton.textContent = title;
    taskbarButton.classList.add('taskbar-buttons', 'active');

    const windowButtons = document.getElementById('window-buttons');

    // Add buttons to top bar right
    topBarRight.appendChild(minimizeButton);
    topBarRight.appendChild(maximizeButton);
    topBarRight.appendChild(closeButton);
    windowButtons.appendChild(taskbarButton);

    // Assemble top bar
    topBar.appendChild(topBarLeft);
    topBar.appendChild(topBarRight);

    // Create content area
    const windowContent = document.createElement('div');
    windowContent.id = 'window-content';

    // Assemble the window
    windowDiv.appendChild(topBar);
    windowDiv.appendChild(windowContent);
    
    onFocusWindow(windowDiv, taskbarButton);

    taskbarButton.addEventListener('click', (e) => {   
        e.stopPropagation();
        windowDiv.classList.toggle('minimized');
        taskbarButton.classList.add('active');
        windowDiv.focus();
    });

    minimizeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        windowDiv.classList.add('minimized');
        taskbarButton.classList.remove('active');
    });

    closeButton.addEventListener('click', ()=> {
        windowDiv.remove();
        taskbarButton.remove();
        removeWindowFromList(title);
        console.log(openWindows);
    })

    dragWindow(windowDiv);
    loadContent(windowDiv, `files/${title}.html`);
    return windowDiv;
}

function onFocusWindow(windowDiv, taskbarButton) {
    windowDiv.addEventListener('focusin', () => {
        taskbarButton.classList.add('active');
    });
    windowDiv.addEventListener('click', () => {
        taskbarButton.classList.add('active');
    });
    windowDiv.addEventListener('blur', () => {
        taskbarButton.classList.remove('active');
    });
    
    document.addEventListener('click', (event) => {
        if(!windowDiv.contains(event.target)) {
            taskbarButton.classList.remove('active');
        }
    });
}

async function loadContent(windowDiv, fileName) {
    try {
        const response = await fetch(fileName);
        
        if(!response.ok){
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const content = await response.text();
        windowDiv.querySelector('#window-content').innerHTML = content;

    } catch (error) {
        throw new Error(error);
        windowDiv.querySelector('#window-content').innerHTML = `<p>Error: ${error.message}</p>`;
    }
}


const startButton = document.getElementById('start-button');
const shutdownButton = document.getElementById('shutdown');
const desktopIcons = document.querySelectorAll('.draggable-button');
const startMenu = document.getElementById("start-menu");
const rightClickMenu = document.getElementById('right-click-menu');
const rightClickIcon = document.getElementById('right-click-icon-menu');

const refreshButton = document.getElementById('refresh');
const sortBy = document.getElementById('sort-by');

const logOff = document.getElementById('logoff');

const windowContainer = document.querySelectorAll('.window');
const taskBar = document.getElementById('taskbar');

refreshButton.addEventListener('click', () => {
    location.reload();
    rightClickMenu.classList.remove('show');
});

sortBy.addEventListener('click', () => {
    windowContainer.forEach((window) => {
        window.remove();
    })
    resetIcons(desktopIcons);
    rightClickMenu.classList.remove('show');
});

startButton.addEventListener('click', () => {
    toggleStartButton();
    startButton.classList.toggle('active');
});

logOff.addEventListener('click', () => {
    logOffOverlay();
})

shutdownButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to shutdown?')) {
        window.close();
    }
});

document.addEventListener('click', (event) => {
    
    if (!rightClickMenu.contains(event.target)) {
      rightClickMenu.classList.remove('show');
    }
    if (!rightClickIcon.contains(event.target)) {
        rightClickIcon.classList.remove('show');
    }
    if (!startMenu.contains(event.target) && !startButton.contains(event.target)) {
      startMenu.classList.remove('show');
      startButton.classList.remove('active');
    }
});

document.addEventListener('contextmenu', (event) => {
    // Check if clicked element is a desktop icon or within one
    const isDesktopIcon = event.target.closest('.draggable-button');
    
    if(isDesktopIcon) {
        return; // Don't do anything if it's a desktop icon
    }
    
    event.preventDefault();
    
    if(rightClickMenu.classList.contains('show')){
        rightClickMenu.classList.remove('show');
    }
    
    toggleRightClickMenu(rightClickMenu, event.clientX, event.clientY);
});


dragElement(desktopIcons);

assignListeners(desktopIcons);

