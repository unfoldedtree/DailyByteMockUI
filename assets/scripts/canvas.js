    // canvas related variables
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    // variables used to get mouse position on the canvas
    var $canvas = $("#canvas");
    ctx.canvas.width  = $canvas.innerWidth();
    ctx.canvas.height  = $canvas.innerHeight();
    var canvasOffset = $canvas.offset();
    var offsetX = canvasOffset.left;
    var offsetY = canvasOffset.top;
    var scrollX = $canvas.scrollLeft();
    var scrollY = $canvas.scrollTop();

    var imageObj = new Image();
    imageObj.src = '/assets/images/image1.jpg';

    // variables to save last mouse position
    // used to see how far the user dragged the mouse
    // and then move the text by that distance
    var startX;
    var startY;

    // an array to hold text objects
    var texts = [];

    // this var will hold the index of the hit-selected text
    var selectedText = -1;

    // clear the canvas & redraw all texts
    function draw() {
        ctx.drawImage(imageObj, 0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    function move() {
        ctx.drawImage(imageObj, 0, 0, ctx.canvas.width, ctx.canvas.height);
        for (let i = 0; i < texts.length; i++) {
            const text = texts[i];
            pushNew(text)
            ctx.fillText(text.text, text.x, text.y);
        }
    }

    function pushNew(text) {
        ctx.font = `${text.fontSize}px ${text.fontStyle}`;
        ctx.fillStyle = `${text.fontColor}`;
        ctx.fillText(text.text, text.x, text.y);
    }

    // test if x,y is inside the bounding box of texts[textIndex]
    function textHittest(x, y, textIndex) {
        var text = texts[textIndex];
        return (x >= text.x && x <= text.x + text.width && y >= text.y - text.height && y <= text.y);
    }

    // handle mousedown events
    // iterate through texts[] and see if the user
    // mousedown'ed on one of them
    // If yes, set the selectedText to the index of that text
    function handleMouseDown(e) {
        e.preventDefault();
        startX = parseInt(e.pageX - offsetX);
        startY = parseInt(e.pageY - offsetY);
        // Put your mousedown stuff here
        for (var i = 0; i < texts.length; i++) {
            if (textHittest(startX, startY, i)) {
            selectedText = i;
            }
        }
    }

    // done dragging
    function handleMouseUp(e) {
        e.preventDefault();
        selectedText = -1;
    }

    // also done dragging
    function handleMouseOut(e) {
        e.preventDefault();
        selectedText = -1;
    }

    // handle mousemove events
    // calc how far the mouse has been dragged since
    // the last mousemove event and move the selected text
    // by that distance
    function handleMouseMove(e) {
        if (selectedText < 0) {
            return;
        }
        e.preventDefault();
        mouseX = parseInt(e.pageX - offsetX);
        mouseY = parseInt(e.pageY - offsetY);

        // Put your mousemove stuff here
        let dx = mouseX - startX;
        let dy = mouseY - startY;
        startX = mouseX;
        startY = mouseY;

        let text = texts[selectedText];
        text.x += dx;
        text.y += dy;
        move();
    }

    // listen for mouse events
    $("#canvas").mousedown(function(e) {
        handleMouseDown(e);
    });
    $("#canvas").mousemove(function(e) {
        handleMouseMove(e);
    });
    $("#canvas").mouseup(function(e) {
        handleMouseUp(e);
    });
    $("#canvas").mouseout(function(e) {
        handleMouseOut(e);
    });

    $("#submit").click(function() {
        const fontStyle = $("#font-selector").val();
        const fontSize = $("#font-size").val();
        const fontColor = $("#font-color").val();
        // calc the y coordinate for this text on the canvas
        // var y = texts.length * 20 + 20;
        var y = texts.length * 20 + Number($("#font-size").val());

        // get the text from the input element
        var text = {
            text: $("#theText").val(),
            x: 20,
            y: y,
            fontColor: fontColor,
            fontStyle: fontStyle,
            fontSize: fontSize
        };

        // calc the size of this text for hit-testing purposes
        // ctx.font = "80px consolas";
        text.width = ctx.measureText(text.text).width;

        if (text.width < 80) {
            text.width = 80;
        }

        // text.height = Number($("#font-size").val());
        text.height = 80;

        // put this new text in the texts array
        texts.push(text);

        // redraw everything
        //   draw();
        pushNew(text);

        // console.log(texts)
    });

$(document).ready(function() {
    draw();
});