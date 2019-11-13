function doTheMagic(image, canvas) {
    let imageWidth = image.width;
    let imageHeight = image.height;
    let ratio = imageWidth / imageHeight;
    let ctx = canvas.getContext('2d');
    // canvas.width = ratio * canvas.height;
    // canvas.style.width = ratio * canvas.height + 'px';

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, canvas.width - image.width, 0, image.width, image.height);

    let cellSize = 5;
    let numRows = parseInt((canvas.height / cellSize).toString());
    let numCols = parseInt((canvas.width / cellSize).toString());

    let cells = [];

    let occupied = [];

    for (let i = 0; i < numCols; i++) {
        occupied.push([]);
        for (let j = 0; j < numRows; j++) {
            cells.push({
                x: i,
                y: j
            });
            occupied[i].push(false);
        }
    }

    let data = ctx.getImageData(0, 0, canvas.width, canvas.height);

    let finalCells = [];
    while (cells.length > 0) {
        let randomCell = Math.floor(Math.random() * (cells.length));
        let position = cells.splice(randomCell, 1)[0];

        let targetSize = [1, 2, 3, 3, 3, 4, 4, 4][Math.floor(Math.random() * 4)];

        let currSize = 1;
        let x, y, r, g, b;
        let index, i = 1;
        index = 4 * canvas.width * position.y * cellSize + 4 * position.x * cellSize;
        r = data.data[index];
        g = data.data[index + 1];
        b = data.data[index + 2];

        if (!occupied[position.x][position.y]) {
            while (true) {
                currSize++;
                if (currSize > targetSize || position.x + currSize >= numCols || position.y + currSize >= numRows) {
                    break;
                }
                let flag = false;
                for (let p = 0; p < currSize; p++) {
                    if (occupied[position.x + currSize - 1][position.y + p] || occupied[position.x + p][position.y + currSize - 1]) {
                        flag = true;
                        break;
                    }
                }

                if (flag) break;

                x = (position.x + currSize + 0.5) * cellSize;
                y = (position.y + currSize + 0.5) * cellSize;
                index = 4 * canvas.width * (position.y + currSize) * cellSize + 4 * (position.x + currSize) * cellSize;
                if (data.data[index] !== r && data.data[index + 1] !== g && data.data[index + 2] !== b)
                    break;
            }
            currSize--;
            for (let p = 0; p < currSize; p++) {
                for (let q = 0; q < currSize; q++) {
                    occupied[position.x + p][position.y + q] = true;
                }
            }
            ctx.strokeRect(position.x * cellSize, position.y * cellSize, currSize * cellSize, currSize * cellSize);
            finalCells.push({
                x: position.x * cellSize,
                y: position.y * cellSize,
                cellSize: currSize * cellSize,
                color: `rgb(${r}, ${g}, ${b})`
            });
        }
    }

    for (let i = 0; i < numCols; i++) {
        for (let j = 0; j < numRows; j++) {
            if (!occupied[i][j]) {
                ctx.fillStyle = 'green';
                ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
            }
        }
    }

    $.ajax({
        type: "POST",
        url: "toJSON.php",
        data: {cells: JSON.stringify(finalCells)},
        cache: false,
        success: function (response) {
            alert(response);
        }
    });
}

function saveImage() {
    let c = document.getElementById("theCanvas");
    let d = c.toDataURL("image/png");
    let w = window.open('about:blank', 'image from canvas');
    w.document.write("<img src='" + d + "' alt='from canvas'/>");
}


let R, G, B;
let pixelSelected = false;

function pickColor(event, canvas) {
    let x;
    let y;
    if (event.pageX || event.pageY) {
        x = event.pageX;
        y = event.pageY;
    } else {
        x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;

    let ctx = canvas.getContext('2d');
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixelIndex = 4 * canvas.width * y + 4 * x;
    R = imageData.data[pixelIndex];
    G = imageData.data[pixelIndex + 1];
    B = imageData.data[pixelIndex + 2];
    pixelSelected = true;

    let colorDiv = document.getElementsByClassName('colors')[0];
    colorDiv.style.opacity = '1';

    ctx.putImageData(imageData, 0, 0);
}

/*

Skin       146 143 128
Beard      84 85 80
Glares     41 57 69
Background 142 148 147

 */

function applyColor(r, g, b) {
    if (pixelSelected) {
        let canvas = document.getElementById("theCanvas");
        let ctx = canvas.getContext('2d');
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < imageData.data.length; i += 4) {
            let d = imageData.data;
            if (d[i] > R - 5 && d[i + 1] > G - 5 && d[i + 2] > B - 5) {
                if (d[i] < R + 5 && d[i + 1] < G + 5 && d[i + 2] < B + 5) {
                    d[i] = r;
                    d[i + 1] = g;
                    d[i + 2] = b;
                }
            }
        }

        ctx.putImageData(imageData, 0, 0);
        let colorDiv = document.getElementsByClassName('colors')[0];
        colorDiv.style.opacity = '0.5';
    }
}


function init() {
    document.body.style.height = window.innerHeight + 'px';
    let canvas = document.getElementById("theCanvas");
    canvas.style.width = window.innerWidth * 0.9 + 'px';
    canvas.style.height = window.innerHeight * 0.9 + 'px';
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.9;
    // canvas.style.transitionDuration = '0.5s';

    canvas.onclick = (ev => pickColor(ev, canvas));

    let image = new Image();
    image.onload = () => {
        doTheMagic(image, canvas);
    };

    image.src = '../images/m5.png';

    window.onkeyup = (ev) => {
        if (ev.key === 'w') {
            applyColor(255, 255, 255);
        }
        if (ev.key === 'b') {
            applyColor(0, 0, 0);
        }
        if (ev.key === 's') {
            applyColor(154, 134, 114);
        }
    };
}

window.onload = init;
