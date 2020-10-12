#!/usr/bin/env node

var pdfjsLib = require("pdfjs-dist/es5/build/pdf.js"),
    fetch = require("node-fetch"),
    url = 'http://localhost:8080/dataset/MachineLearningForDummies/extract.pdf',
    jsonfile = 'http://localhost:8080/dataset/MachineLearningForDummies/extract.json',
    shapes = 'http://localhost:8080/dataset/MachineLearningForDummies/annotation.json',
    canvas = {},
    color = 'black',
    scale = 1;

pdfjsLib.getDocument(url).promise.then(function (pdfDoc_) {
    pdfDoc = pdfDoc_;
    loadJson(jsonfile);
}).catch(function (error) {
    console.log(error)
});

function loadJson(jsonfile) {
    // get shapes from Google Vision generated json
    fetch(jsonfile)
        .then(response => response.json())
        .then(response => {
            for (var i = 0; i < response.responses.length; i++) {
                shapes[i] = [];
                
                var blocks = response.responses[i].fullTextAnnotation.pages[0].blocks,
                    marge = 5;

                pdfDoc.getPage(i+1).then(function (page) {
                    canvas = page.getViewport({
                        scale: scale
                    });
                });
                
                for (var j = 0; j < blocks.length; j++) {
                    var coords = blocks[j].boundingBox.normalizedVertices;
                    
                    // convert normalizedVertices to regular coords
                    coords = coords.map(function (element) {
                        return [element.x * canvas.width,
                                element.y * canvas.height]
                    });
                    x = coords[0][0] - marge;
                    y = coords[0][1] - marge;
                    dx = coords[2][0] + marge * 2 - x;
                    dy = coords[2][1] + marge * 2 - y;
                    shapes[i].push({
                        x,
                        y,
                        dx,
                        dy,
                        color
                    });
                }
            }
        }).catch(function (error) {
            console.log(error)
        });
}

function extractFeaturesFromPdf(pdf, shapes) {
    // extract features from pdf file using 
    // Regions of Interest defined in shapes
    for (var i = 0; i < shapes.length; i++) {
        shape = shapes[i];
    }
};

function convertToCanvasCoords(x, y, width, height, scale = 1) {
    return (
        x * scale,
        canvas.height - ((y + height) * scale),
        width * scale,
        height * scale);
};