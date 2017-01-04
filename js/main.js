(function main(win, doc)
{
    var self = this,
        win = window,
        doc = document,
        fileSelctorInput = doc.getElementById("fileSelctor"),
        imagePreviewCanvas = doc.getElementById("imagePreview"),
        imagePreviewCanvas2dContext = imagePreviewCanvas.getContext("2d"),
        colorSwatchContainerDiv = doc.getElementById("colorSwatchContainer"),
        k=2;

    //console.log("win: ", win);
    //console.log("doc: ", doc);
    //console.log("self: ", self);
    //kandinsky(win, doc);
    console.log("ready!");

    // check if filereader and other apis are supported
    if (window.File && window.FileReader && window.FileList && window.Blob && window.Worker)
    {
        // Great success! All the File APIs are supported.
    }
    else
    {
        alert('This program requires File, FileReader, FileList, Blob and Worker APIs, some of which are not fully supported in your browser. Please upgrade your browser or switch to a new one and try again.');
        return;
    };

    // xform data to cluster analysis friendly format
    // from linear array to array of [r,g,b] chunks
    var getPixelChunks = function(imgData)
    {
        var i = -1,
            len = imgData.length;
        if (!imgData || imgData.length < 3) return [];
        copy = [];
        pixArr = [];
        // dumbcopy imageData Uint8ClampedArray to regular array so splice can be used
        while (++i < len)
        {
            copy[i] = imgData[i];
        }
        //reset and loop again
        i = -1;
        len = copy.length;
        while (++i < copy.length)
        {
            pixArr[i] = copy.splice(0, 4); //rgba
        }
        return pixArr;
    }

    var analyzeImage = function()
    {
        var imageData = imagePreviewCanvas2dContext.getImageData(0, 0, imagePreviewCanvas.width, imagePreviewCanvas.height),
        pixelChunks = getPixelChunks(imageData.data), 
        imageColors;
        //wassily = new Kandinsky(self),

        //console.log("analyzeImage: wassily: ", wassily);
        //
        //imageColors = wassily.quantizeColors(wassily.K_MEANS,pixelChunks,k);
        //Kandinsky(self.quantizeColors("kmeans",pixelChunks,k));
        imageColors = quantizeColors("kmeans",pixelChunks,k);//Kandinsky.quantizeColors("kmeans",pixelChunks,k);

        //console.log(Kandinsky(self));
        console.log("analyzeImage: imageData: ", imageData.data);
        console.log("analyzeImage: imageColors: ", imageColors);
        //imageColors = 
    }

    // load a file
    // TODO:
    // 1. Provide a drag and drop interface
    // 2. Provide a progress bar for load / read / draw etc.
    // 3. Promises based implementation
    var handleFileSelection = function(evt)
    {
        var files = [],
            output = [],
            selectedFile,
            reader = new FileReader(),
            image = new Image();
        evt.stopPropagation();
        evt.preventDefault();
        files = evt.target.files;
        selectedFile = files[0];
        image.onload = function()
        {
            imagePreviewCanvas.width = image.width;
            imagePreviewCanvas.height = image.height;
            imagePreviewCanvas2dContext.clearRect(0, 0, image.width, image.height);
            imagePreviewCanvas2dContext.drawImage(image, 0, 0, image.width, image.height);
            // with the image painted on scree, move on to clustering and painting the swatches on screen...
            analyzeImage();
        };
        reader.onload = function(e)
        {
            image.src = e.target.result;
        };
        reader.readAsDataURL(selectedFile);
        //
    }
        //
        // now wait for the user to select a file
    fileSelctorInput.addEventListener('change', handleFileSelection, false);

})(window, document);

/*Approach:
    1. Load image:
        a. on input change, use file reader to capture file - done
        b. render image on canvas - done
        c. capture image data - done
    2. Extract Image Data:
        a. image data converted to array of vectors [r,g,b,a] - done
        b. pass this to K means (or selected algorithm)
        c. once k means returns, draw swatches
    3. K Means:
        a. Pick K random centroids from array
        b. classify all points into clusters
        c. move centroids to the mean/average of their respective clusters
        d. did the centroids move much? if yes, goto b, else stop
        e. publish results*/

/*principles:
    1. no function should recieve things that it does not need
    2. minimal modification of global state
    3. try and not expose internal functionality
    4. there's other algorithms coming your way, so engineer a plug-n-play approach*/

/* data structures:
    colors: [r,g,b],[r,g,b],[r,g,b]... linear array of color values
    centroids: [r,g,b],[r,g,b],[r,g,b]...k linear array of K color values
    clusters: [[r,g,b],[r,g,b],...],[[r,g,b],[r,g,b],...]...k array of length k, 
        each element is an array of all the colors
         that belong to the centorid at the respective index 
         in the centroids array
    selected_colors: [r,g,b],[r,g,b],[r,g,b]...k linear array of K color values
    proportions: [p1, p2, p3, ..., pk] linear array of K values
    */

/* To use:
    //step 1: prepare data
    //capture image data from canvas and prepare array of colors from it
    imgData = kandinsky.dataHelpers.prepareColorDataArray(imageData(canvas.context, canvasW, canvasH)); 
    // step 2: invoke algorithm
    quantizedColorSet = kandinsky.getQuantizedColorSet(imgData, Algorithm[, {algorighthm parameters}]);
    for e.g. when using K-Means
    quantizedColorSet = kandinsky.getQuantizedColorSet(imgData, "KMeans", {k:7, maxIter:500});
    */
//package like lodash - package for CommonJS, AMD/Require and ES6
