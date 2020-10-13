#!/usr/bin/env node

var pdfjsLib = require("pdfjs-dist/es5/build/pdf.js"),
    fetch = require("node-fetch"),
    url = 'http://localhost:8080/dataset/MachineLearningForDummies/extract.pdf',
    jsonfile = 'http://localhost:8080/dataset/MachineLearningForDummies/extract.json',
    shapes = 'http://localhost:8080/dataset/MachineLearningForDummies/annotation.json',
    color = 'black',
    scale = 1.0;

function convertToCanvasCoords(x, y, width, height, scale = 1) {
    return (
        x * scale,
        canvas.height - ((y + height) * scale),
        width * scale,
        height * scale);
};

pdfjsLib.getDocument(url).promise.then(function (pdfDoc_) {
    pdfDoc = pdfDoc_;
    fetch(shapes)
    .then(response => response.json())
    .then(response => {
        for (var num = 0; num < response.length; num++) {
            
            shape = response[num];
            console.log(shape);
            pdfDoc.getPage(num+1).then(function (page) {
                var viewport = page.getViewport(scale);
                console.log(viewport);
                page.getTextContent().then(function (text) {
                    var xs = [], ys = [];
                    text.items.forEach(function (item) {
                        //.log(item);
                        var tx = pdfjsLib.Util.transform(viewport.transform, item.transform);
                        //console.log(tx);
                        // avoiding tx * [0,0,1] taking x, y directly from the transform
                        xs.push(tx[4]); ys.push(tx[5]);
                      });
                });
            });
        }
    })  
}).catch(function (error) {
    console.log(error)
});
