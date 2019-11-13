function Cell(cell) {
    this.x = cell.x;
    this.y = cell.y;
    this.size = cell.cellSize;
    this.color = cell.color;

    this.draw = (ctx, x, y, w) => {
        let limit = window.innerWidth * 0.9 * 0.75;
        let backgroundAlpha = this.x > limit ? 0.1 : (this.x / (limit * 10));
        let textAlpha = this.x > limit ? 1 : 0.1 + this.x / limit;
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.font = this.size + "px Monospaced";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.save();
        ctx.globalAlpha = backgroundAlpha;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.restore();
        ctx.save();
        ctx.globalAlpha = textAlpha;
        ctx.fillText(Math.floor(Math.random() * 2), this.x + this.size / 2, this.y + this.size / 1.75);
        ctx.restore();
    }
}


function doTheMagic(cells, image) {
    let canvas = document.getElementById("theCanvas");
    let ctx = canvas.getContext('2d');
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < cells.length; i++) {
        let cell = new Cell(cells[i]);
        let startX = 0;
        let startY = 0;
        let sizeX = window.innerWidth / 2;
        cell.draw(ctx, startX, startY, sizeX);
    }

    console.log('done');
}


function init() {
    document.body.style.height = window.innerHeight + 'px';
    let canvas = document.getElementById("theCanvas");
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.9;

    $.getJSON("./cells.json", (cells) => {
        let image = new Image();
        image.onload = () => {
            doTheMagic(cells, image);
        };
        image.src = './images/m5.png';
    });
}

window.onload = init;
