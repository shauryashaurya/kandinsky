(function main(win, doc)
{
    var self = this;
    var win = window;
    var doc = document;

    console.log("win: ", win);
    console.log("doc: ", doc);
    console.log("self: ", self);
    kandinsky(win, doc);
    console.log("ready!");

    /*Approach:
	1. Load image:
		a. on input change, use file reader to capture file
		b. create new image, define image onload to display image in canvas and start step2
		c. image.source = file reader.file
	2. Extract Image Data:
		a. canvas.imagedata = transform this array to array of [r,g,b] colors
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
	colours: [r,g,b],[r,g,b],[r,g,b]... linear array of colour values
	centroids: [r,g,b],[r,g,b],[r,g,b]...k linear array of K colour values
	clusters: [[r,g,b],[r,g,b],...],[[r,g,b],[r,g,b],...]...k array of length k, 
		each element is an array of all the colours
		 that belong to the centorid at the respective index 
		 in the centroids array
	selected_colours: [r,g,b],[r,g,b],[r,g,b]...k linear array of K colour values
	proportions: [p1, p2, p3, ..., pk] linear array of K values
	*/

	/* To use:
	//step 1: prepare data
	//capture image data from canvas and prepare array of colours from it
	imgData = kandinsky.dataHelpers.prepareColorDataArray(imageData(canvas.context, canvasW, canvasH)); 
	// step 2: invoke algorithm
	quantizedColorSet = kandinsky.getQuantizedColorSet(imgData, Algorithm[, {algorighthm parameters}]);
	for e.g. when using K-Means
	quantizedColorSet = kandinsky.getQuantizedColorSet(imgData, "KMeans", {k:7, maxIter:500});
	*/




})(window, document);
