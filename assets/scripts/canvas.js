    // canvas related variables
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    const reader = new FileReader();
    const jsonReader = new FileReader();
    const imageObj = new Image();
    // variables used to get mouse position on the canvas
    var $canvas = $("#canvas");
    ctx.canvas.width  = $canvas.innerWidth();
    ctx.canvas.height  = $canvas.innerHeight();
    var canvasOffset = $canvas.offset();
    var offsetX = canvasOffset.left;
    var offsetY = canvasOffset.top;
    var scrollX = $canvas.scrollLeft();
    var scrollY = $canvas.scrollTop();

    // var imageObj = new Image();
    // imageObj.src = '/assets/images/image1.jpg';

    // variables to save last mouse position
    // used to see how far the user dragged the mouse
    // and then move the text by that distance
    var startX;
    var startY;

    // an array to hold text objects
    var texts = [];
    var storedObjects = []

    // this var will hold the index of the hit-selected text
    var selectedText = -1;

    function drawTemplate(data, index) {
        const tempTexts = data.texts;
        const tempImg = new Image();
        tempImg.onload = function() {
            const tempCanvas = document.getElementById(`canvas-${index}`);
            const templateCtx = tempCanvas.getContext("2d");
            const $tempCanvas = $(`#canvas-${index}`);
            templateCtx.canvas.width  = $tempCanvas.innerWidth();
            templateCtx.canvas.height  = $tempCanvas.innerHeight();
            const tempRatio = Math.min( tempCanvas.width / this.width, tempCanvas.height / this.height);
            const newHeight = this.height * tempRatio;
            const newWidth = this.width * tempRatio;
            const sizeRatio = Math.min( tempCanvas.width / canvas.width, tempCanvas.height / canvas.height);

            templateCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
            templateCtx.drawImage(this, tempCanvas.width / 2 - newWidth / 2, tempCanvas.height / 2 - newHeight / 2, newWidth, newHeight );

            tempTexts.forEach(tempText => {
                pushNewTemplate(tempText, tempRatio, index)
                templateCtx.fillText(tempText.text, (tempText.x * sizeRatio), (tempText.y * sizeRatio));
            })
        }
        tempImg.src = data.img;
    }

    function pushNewTemplate(tempText, tempRatio, index) {
        const tempCanvas = document.getElementById(`canvas-${index}`);
        const templateCtx = tempCanvas.getContext("2d");
        const sizeRatio = Math.min( tempCanvas.width / canvas.width, tempCanvas.height / canvas.height);
        templateCtx.font = `${(tempText.fontSize * sizeRatio)}px ${tempText.fontStyle}`;
        templateCtx.fillStyle = `${tempText.fontColor}`;
        templateCtx.fillText(tempText.text, (tempText.x * sizeRatio), (tempText.y * sizeRatio));
    }

    // clear the canvas & redraw all texts
    function draw() {
        //Find Image Scale Ration Begin
        const ratio = Math.min( canvas.width / imageObj.width, canvas.height / imageObj.height);
        const newHeight = imageObj.height * ratio;
        const newWidth = imageObj.width * ratio;
        //Find Image Scale Ration End

        //Draw Image Start
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // ctx.drawImage(imageObj, 0, 0, canvas.width, canvas.height);
        // ctx.drawImage(imageObj, 0, 0, newWidth, newHeight);

        //Draw Image in Center
        ctx.drawImage(imageObj, canvas.width / 2 - newWidth / 2, canvas.height / 2 - newHeight / 2, newWidth, newHeight );

        //Draw Image End

        texts.forEach(text => {
            pushNew(text)
            ctx.fillText(text.text, text.x, text.y);
        })
    }

    function move() {
        draw()
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
        // startX = parseInt(e.pageX - offsetX);
        // startY = parseInt(e.pageY - offsetY);
        startX = parseInt(e.clientX - offsetX);
        startY = parseInt(e.clientY - offsetY);
        // Put your mousedown stuff here
        texts.forEach((text, index) => {
            if (textHittest(startX, startY, index)) {
                selectedText = index;
            }
        })
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
        // mouseX = parseInt(e.pageX - offsetX);
        // mouseY = parseInt(e.pageY - offsetY);
        mouseX = parseInt(e.clientX - offsetX);
        mouseY = parseInt(e.clientY - offsetY);

        // Put your mousemove stuff here
        let dx = mouseX - startX;
        let dy = mouseY - startY;
        startX = mouseX;
        startY = mouseY;

        let text = texts[selectedText];
        text.x += dx;
        text.y += dy;
        draw();
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
        if ($("#theText").val()) {
            const fontStyle = $("#font-selector").val();
            const fontSize = $("#font-size").val();
            const fontColor = $("#font-color").val();
            // calc the y coordinate for this text on the canvas
            var y = texts.length * 20 + Number($("#font-size").val());
            var text = {
                text: $("#theText").val(),
                x: 20,
                y: y,
                fontColor: fontColor,
                fontStyle: fontStyle,
                fontSize: fontSize
            };
            text.width = ctx.measureText(text.text).width;
            if (text.width < 80) {
                text.width = 80;
            }
            text.height = 80;
            texts.push(text);
            pushNew(text);
            addToLayerTool(text, (texts.length - 1));
            $("#theText").val("")
            $("#font-selector").val("Arial")
            $("#font-size").val(40)
            }
    });

function reloadLayerTool() {
    $(".layers").html("")
    texts.forEach((text, index) => addToLayerTool(text, index))
}

    function addToLayerTool(text, i) {
         $(`<div id="layer-${i}" class="layer">
            <i class="fas fa-cog layer-edit"></i>
            <div>Layer ${i}</div>
            <i class="fa fa-times layer-remove"></i>
        </div>`).appendTo('.layers');

        $(`#layer-${i}`).data("id", i)
        $(`#layer-${i}`).data("fontColor", text.fontColor)
        $(`#layer-${i}`).data("fontSize", text.fontSize)
        $(`#layer-${i}`).data("fontStyle", text.fontStyle)
        $(`#layer-${i}`).data("height", text.height)
        $(`#layer-${i}`).data("width", text.width)
        $(`#layer-${i}`).data("text", text.text)
        $(`#layer-${i}`).data("x", text.x)
        $(`#layer-${i}`).data("y", text.y)

        $(`#layer-${i} .layer-edit`).on('click', function() {
            layerData = $(`#layer-${i}`).data()
            $('#editor-id').val(layerData.id)
            $('#editor-text').val(layerData.text)
            $('#editor-font').val(layerData.fontStyle)
            $('#editor-size').val(layerData.fontSize)
            $('#editor-color').val(layerData.fontColor)

            $(".layer-editor").addClass("open");
        })

        $(`#layer-${i} .layer-remove`).on('click', function() {
            layerId = $(`#layer-${i}`).data("id")
            if ($('#editor-id').val() == layerId) {
                resetInputs()
                $(".layer-editor").removeClass("open");
            }
            texts.splice(layerId, 1)
            reloadLayerTool()
            draw()
        })
    }

function resetInputs() {
    $('#editor-id').val('')
    $('#editor-text').val('')
    $('#editor-font').val("Arial")
    $('#editor-size').val(40)
    $('#editor-color').val('#000000')
}

$(".editor-save").on('click', function() {
    const text = texts[$('#editor-id').val()]
    if (text) {
        text.text = $('#editor-text').val()
        text.fontStyle = $('#editor-font').val()
        text.fontSize = $('#editor-size').val()
        text.fontColor = $('#editor-color').val()
        resetInputs()
        $(".layer-editor").removeClass("open");
        reloadLayerTool()
        draw()
    }
})

$(".editor-arrow").on("click", function() {
    $(".layer-editor").toggleClass("open");
})

$("#uploader-div").on("click", function () {
    $("#uploader").click();
})

$("#import-div").on("click", function () {
    $("#importer").click();
})

$("#importer").change(function (e) {
    if (e.target.files[0]) {
        jsonReader.onload = () => {
            const importedData = JSON.parse(jsonReader.result)
            imageObj.onload = () => {
                draw();
            }
            texts = importedData.texts;
            imageObj.src = importedData.img;
            reloadLayerTool()
        }
        jsonReader.readAsText(e.target.files[0])
    }
})

function loadStoredDocument (storedDocument) {
    imageObj.onload = () => {
        draw();
    }
    texts = storedDocument.texts;
    imageObj.src = storedDocument.img;
    reloadLayerTool()
}

$("#uploader").change(function (e) {
    if (e.target.files[0]) {
        reader.onload = () => {
            imageObj.onload = () => {
                draw();
            }
            imageObj.src = reader.result;
        }
        reader.readAsDataURL(e.target.files[0])
    }
})

$("#download").on("click", function() {
    const image = document.getElementById("canvas").toDataURL();
    const link = document.createElement('a');
    link.href = image;
    link.download = 'image.png';
    document.body.appendChild(link); // required for firefox
    link.click();
    link.remove();
})

function downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.href = dataStr;
    downloadAnchorNode.download = (exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

$("#save").on("click", function() {
    const newObj = {
        img: imageObj.src,
        texts: texts
    }
    downloadObjectAsJson(newObj, "test-template")
})

$("#rotate").on("click", function() {
    if ($("#rotate").hasClass("landscape")) {
        $("#rotate").removeClass("landscape")
        $("#rotate").addClass("portrait")
        canvas.width = 324;
        canvas.height = 576;
    } else if ($("#rotate").hasClass("portrait")) {
        $("#rotate").removeClass("portrait")
        $("#rotate").addClass("landscape")
        canvas.width = 1024;
        canvas.height = 576;
    }
})

function asyncAjax(url){
    return new Promise(function(resolve, reject) {
            $.ajax({
                url: url,
                type: "GET",
                dataType: "json",
                beforeSend: function() {            
                },
                success: function(data) {
                    resolve(data) // Resolve promise and when success
                },
                error: function(err) {
                    reject(err) // Reject the promise and go to catch()
                }
            });
    });
}

async function getDocuments() {
    return new Promise(async (resolve, reject) => {
        const dataArray = [];
        for (let i = 0; i < 5; i++) {
            if (i == 0) {
                let data = await asyncAjax('/assets/json-templates/test-template.json')
                dataArray.push(data)
            } else {
                let data = await asyncAjax(`/assets/json-templates/test-template (${i}).json`)
                dataArray.push(data)
            }
        }
        resolve(dataArray) 
    })
}

async function processDocuments() {
    const documents = await getDocuments()
    documents.forEach((document, index) => {
        storedObjects.push(document)
        $(".template-select").append(
            $(`
            <div class="template">
                <canvas id="canvas-${index}"></canvas>
            </div>
        `)
        .click(function () {
            loadStoredDocument(storedObjects[index])
        })
        );
        drawTemplate(document, index)
    })
}

$("#template-open-div").on("click", function () {
    $("#template-modal").css("display","block")
    processDocuments();
})

$(".close-template").on("click", function () {
    $("#template-modal").css("display","none")
})

$(document).ready(function() {
    
});

