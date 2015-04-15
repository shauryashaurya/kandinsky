(function()
{
    // capture references
    var win = window;
    var doc = window.document;
    var c01 = this; //win and c01 should refer to the same object - win === c01

    // capture essentials from canvas
    var c = doc.getElementById("colors");
    var ctx = c.getContext("2d");
    var canvasX = 0;
    var canvasY = 0;
    var canvasH = c.width;
    var canvasW = c.height;

    var k = 5;
    var colorModelComponents = ["r", "g", "b", "a"];

    // draw or paint the graphic on the canvas
    setup(ctx, canvasX, canvasY, canvasW, canvasH);

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
for <= use pixelCount<totalNumberOfPixels-1			*/
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
            imgPixelArray.push(imgPixel);
            console.log(imgPixelArray.length, " ", imgPixel);
        }
        return imgPixelArray;
    }

    // capture the image data
    var imageData = ctx.getImageData(canvasX, canvasY, canvasW, canvasH);
    console.log(imageData.data.length);
    console.log("number of pixels: ", imageData.data.length / colorModelComponents.length);
    var pixels = [];
    pixels = parseImageData(imageData.data);
    console.log("number of pixels: ", pixels.length);

    var themeColors = {};
    themeColors = kMeansColorClusters(pixels, k); //using simple k-means
    console.log(themeColors);

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
