(function main(win,doc)
{
	var self = this;
	var win = window;
	var doc = document;

	console.log("ready!");

	/*Approach:
	1. Load image:
		a. on input change, use file reader to capture file
		b. create new image, define image onload to display image in canvas and start step2
		c. image.source = file reader.file
	2. Extract Image Data:
		a. canvas.imagedata = transform this array to array of [r,g,b] colors
		b. pass this to K means
		c. once k means returns, draw swatches
	3. K Means:
		a. Pick K random centroids from array
		b. classify all points into clusters
		c. move centroids to the mean/average of their respective clusters
		d. did the centroids move much? if yes, goto b, else stop
		e. publish results*/




})(window, document);
