(function()
{
    // capture references
    var win = window;
    var doc = window.document;
    var c01 = this; //win and c01 should refer to the same object - win === c01

    //the following comes from http://www.html5rocks.com/en/tutorials/file/dndfiles/
    if (window.File && window.FileReader && window.FileList && window.Blob)
    {
        // Great success! All the File APIs are supported.
    }
    else
    {
        alert('The File APIs are not fully supported in this browser.');
    }

    // capture essentials from canvas
    var c = doc.getElementById("colors");
    var ctx = c.getContext("2d");
    var canvasX = 0;
    var canvasY = 0;
    var canvasH = c.width;
    var canvasW = c.height;
    var colorBoxDiv = document.getElementById("resultantColors");
    var imageW = 0;
    var imageH = 0;
    var image = new Image();

    console.log("colorBoxDiv: ", colorBoxDiv);

    var k = 25;
    var colorModelComponents = ["r", "g", "b", "a"];
    //
    //
    // parse image Data

    var parseImageData = function(imgData)
    {
        var numColorModelComponents = colorModelComponents.length;
        var imgPixelArray = [];
        var totalNumberOfPixels = imgData.length / numColorModelComponents;
        var pixelCount = 0;

        // now iterate over imgData using two for loops, like a total moron 
        // because Uint8ClampedArray does not support .splice like Arrays do
        // had it been a regular .splice, 
        // all one had to do was, run a loop, totalNumberOfPixels times and
        // imgPixelArray.push(imgData.splice(0,numColorModelComponents));
        // but, they think you are a retard
        // and they just might be right
        // so...

        /* Also, notice the < sign in the for loop below, 
            avoid off by one error
            using the following thumb rule
            for < use pixelCount<totalNumberOfPixels
            for <= use pixelCount<totalNumberOfPixels-1 */
        for (pixelCount = 0; pixelCount < imgData.length; pixelCount += numColorModelComponents)
        {
            var imgPixel = [];
            var i = 0;
            if (i != 0)
            {
                i = 0;
            }
            /*Again, avoid the off-by-one trap as discussed above*/
            for (i = 0; i < numColorModelComponents; i++)
            {
                var imgDataArrayIndex = pixelCount + i;
                var selectedValue = imgData[imgDataArrayIndex];
                imgPixel.push(selectedValue);
            }
            // lets just keep the alpha value aside for a bit.
            imgPixelArray.push(imgPixel.slice(0, 3));
            //console.log(imgPixelArray.length, " ", imgPixel.slice(0,3));
        }
        return imgPixelArray;
    }

    var drawColorBoxes = function(box, colors, n)
    {

        for (var i = 0; i < colors["colors"].length; i++)
        {
            var colorString = "rgb(" + colors["colors"][i]["value"].join(",") + ")";
            console.log("drawColorBoxes: colorString: ", colorString);
            var newDiv = document.createElement("div");
            newDiv.setAttribute("id", "color" + i);
            newDiv.setAttribute("class", "colorBlock");
            newDiv.setAttribute("style", "width:100px height:100px");
            newDiv.style.width = 100;
            newDiv.style.height = 100;
            newDiv.style.backgroundColor = colorString;
            box.appendChild(newDiv);
        };

    }

    // handle file load from the FileAPI
    var handleFileSelectionEvent = function(event)
    {
        //
        var file = event.target.files[0];
        console.log("handleFileSelectionEvent: file: ", file);
        var reader = new FileReader();
        reader.onload = function(e)
        {
            paintImageIntoCanvas(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    // draw or paint the graphic on the canvas
    var paintImageIntoCanvas = function(img)
    {
        image = new Image();
        image.onload = function()
        {
            //
            ctx.clearRect(0, 0, canvasW, canvasH);
            imageW = image.width;
            imageH = image.height;
            c.width = image.width;
            c.height = image.height;
            ctx.drawImage(image, 0, 0, image.width, image.height);
            setup(ctx, image, canvasX, canvasY, canvasW, canvasH, imageW, imageH);
        };
        image.src = img;
    }

    var setup = function(ctx, image, canvasX, canvasY, canvasW, canvasH, imageW, imageH)
    {
        // capture the image data
        var imageData = ctx.getImageData(canvasX, canvasY, imageW, imageH);
        console.log("total data points in imageData uint8clampedarray: ", imageData.data.length);
        console.log("number of pixels: ", imageData.data.length / colorModelComponents.length);
        var pixels = [];
        pixels = parseImageData(imageData.data);
        //console.log("number of pixels: ", pixels.length);

        var themeColors = {};
        //var kMeans = kMeansColorClusters(this,window,document);
        themeColors = kMeansColorClusters(this, window, document).call(this, pixels, k, true); //using simple k-means
        console.log(themeColors);
        drawColorBoxes(colorBoxDiv, themeColors, k);
        return 0;
    }
    document.getElementById('file').addEventListener('change', handleFileSelectionEvent, false);

})();
//
/* expected output json structure should resemble:
themeColors = 
{
"number_of_colors": 7,
"colors": 
[
{
"value": "#aabbcc",
"proportion": 0.1
},
{
"value": "#aabbcc",
"proportion": 0.1
},
{
"value": "#aabbcc",
"proportion": 0.1
},
{
"value": "#aabbcc",
"proportion": 0.1
},
{
"value": "#aabbcc",
"proportion": 0.1
},
{
"value": "#aabbcc",
"proportion": 0.1
},
{
"value": "#aabbcc",
"proportion": 0.1
}
],
}

Test by checking that the proportions add up to 1.

*/
