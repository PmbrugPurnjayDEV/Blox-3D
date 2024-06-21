const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');
let objects = [];
let selectedTool = 'wall';

canvas.addEventListener('click', handleCanvasClick);

function selectTool(tool) {
    selectedTool = tool;
    console.log(`Selected tool: ${tool}`);
}

function handleCanvasClick(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    console.log(`Mouse click at: (${x}, ${y})`);

    const newObj = createObject(selectedTool, x, y);
    if (newObj) {
        objects.push(newObj);
        drawObject(newObj);
        console.log(`Created object:`, newObj);
    }
}

function createObject(type, x, y) {
    let obj = null;
    switch(type) {
        case 'wall':
            obj = { type, x, y, width: 50, height: 50, color: 'brown' };
            break;
        case 'column':
            obj = { type, x, y, radius: 25, color: 'gray' };
            break;
        case 'block':
            obj = { type, x, y, width: 30, height: 30, color: 'blue' };
            break;
    }
    return obj;
}

function drawObject(obj) {
    ctx.fillStyle = obj.color;
    switch(obj.type) {
        case 'wall':
            ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
            break;
        case 'column':
            ctx.beginPath();
            ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 'block':
            ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
            break;
    }
}

function newMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    objects = [];
    console.log('New map created');
}

function saveMap() {
    const dataStr = JSON.stringify(objects);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'map.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    console.log('Map saved');
}

function openMap(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = JSON.parse(e.target.result);
            loadMap(data);
        };
        reader.readAsText(file);
    }
}

function loadMap(data) {
    newMap();
    data.forEach(obj => {
        objects.push(obj);
        drawObject(obj);
    });
    console.log('Map loaded');
}

function generateCode() {
    let code = '';
    objects.forEach(obj => {
        if (obj.type === 'wall') {
            code += `createWall(${obj.x}, ${obj.y}, ${obj.width}, ${obj.height});\n`;
        } else if (obj.type === 'column') {
            code += `createColumn(${obj.x}, ${obj.y}, ${obj.radius});\n`;
        } else if (obj.type === 'block') {
            code += `createBlock(${obj.x}, ${obj.y}, ${obj.width}, ${obj.height});\n`;
        }
    });

    const codeBlob = new Blob([code], { type: 'text/plain' });
    const codeUrl = URL.createObjectURL(codeBlob);
    const a = document.createElement('a');
    a.href = codeUrl;
    a.download = 'map.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    console.log('Code generated');
}
