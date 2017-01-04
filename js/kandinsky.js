/*var Kandinsky = function(ctx)
{*/
var self = this;
var vectors = [];
var clusters = [];
var vectorLength = 3;
var k = 7;
var centroids = [];
var oldCentroids = [];
var centclusters = [];
var centRss = [];
var oldCentRss = [];
var proportions = [];
var totaliter = 0;
var initialized = false;
console.log("kandinsky here");
//console.log("kandinsky: self: ", self);
function compute_kmeans(vectors, k) {
	self.vectors = vectors.slice();
	self.k = k;
	self.vectorLength = self.vectors[0].length;
	//
	//console.log("kmeans: vectors: ",vectors);
	//console.log("kmeans: k: ", k);
	//
	self.centroids = [];
	self.clusters = [];
	initCentroids();
	//console.log("kmeans: compute_kmeans: centroids = ",JSON.stringify(self.centroids));
	self.oldCentroids = [];
	totaliter = 0;
	while (compareCentroids() && totaliter < 5) {
		totaliter++;
		console.log("******* iteration # ", totaliter, "********");
		computeClusters();
		pickCentroids();
	}
	return {
		'colors': centroids,
		'ratio': [0.1, 0.5, 0.4]
	};
	/*
	initCentroids();
	while ((compareCentroids() === false)||(iterations<maxIterations))
	{
		pickCentroids(computeClusters());
	}
	return [centroids, clustercount];*/
}

function initCentroids() {
	//take RGB data from the table and pick random centroids
	//initialize another set of centroids array to zero
	// if vector already exists then
	// pick another random vector
	// else add vector to centroid array
	var i = 0;
	var i2 = 0;
	var randPointIndex = 0;
	var pointrepeats = false;
	var pointrepeatsIterationCount = 0;
	var veclen = vectors.length;
	self.centroids = [];
	console.log("kmeans: initCentroids: k: ", k);
	for (i = 0; i < k; i++) {
		randPointIndex = Math.round(veclen * Math.random());
		// check the centroid array for existing point
		if (i > 0) {
			pointrepeats = true;
			pointrepeatsIterationCount = 0;
			/*TODO: Fix this loop so that it doesn't run infinitely when there are fewer colors than K - 
			for example, if there are only black pixels and white pixels in the picture but k is set to 7*/
			while (pointrepeats && (pointrepeatsIterationCount < veclen)) {
				randPointIndex = Math.round(veclen * Math.random());
				pointrepeatsIterationCount++;
				for (var j = 0; j < centroids.length; j++) {
					pointrepeats = pointrepeats && (squaredEuclideanDistance(centroids[j], vectors[randPointIndex]) === 0);
				}
			}
		}
		self.centroids[i] = [];
		for (i2 = 0; i2 < self.vectors[randPointIndex].length; i2++) {
			self.centroids[i].push(self.vectors[randPointIndex][i2]);
		}
	}
	console.log("kmeans: initCentroids: ", JSON.stringify(self.centroids));
}

function pickCentroids() {
	//take RGB data clustered around old centroids and find new centroids for the clusters
	//this one's going to be a bit complicated - we need to compute the median and not the average.
	//the median is the point with the least RSS in a cluster
	// loop on clusters array
	// pick id of centroid and create an array of arrays, each carrying the point data
	// loop through this new array
	// findPointwithleastrss for each
	centclusters = [];
	var lenclust = self.clusters.length;
	var i = 0;
	oldCentroids = []
		// first copy centorids to oldCentroids so that these can be compared later and also initialize centclusters
	for (i = 0; i < k; i++) {
		oldCentroids.push(centroids.pop());
		centclusters.push([]);
	}
	//console.log("pickCentroids - before - centclusters:" + JSON.stringify(centclusters));
	// now cycle through the clusters array to pick vectors for each centroid
	for (i = 0; i < lenclust; i++) {
		centclusters[clusters[i]].push(JSON.parse(JSON.stringify(self.vectors[i])));
	}
	//console.log("pickCentroids - after - centclusters:" + JSON.stringify(centclusters));
	for (i = 0; i < k; i++) {
		centroids.push(findPointWithLeastRSS(centclusters[i]));
	}
	//console.log("pickCentroids - pass 2 - oldCentroids:"+JSON.stringify(oldCentroids));
	//console.log("pickCentroids - pass 2 - centroids:"+JSON.stringify(centroids));
}

function findPointWithLeastRSS(arr) {
	var point = arr[0];
	var rss_arr = [];
	var min_rss = 0;
	var pointIndex = 0;
	var arr_len = arr.length;
	var i = 0;
	// find rss for all points in the array
	for (i = 0; i < arr_len; i++) {
		rss_arr.push(residualSumOfSquares(arr, arr[i]))
	}
	min_rss = rss_arr[0];
	for (i = 0; i < arr_len; i++) {
		//console.log("kandinsky.findPointWithLeastRSS: min_rss = "+min_rss);
		//console.log("kandinsky.findPointWithLeastRSS: rss_arr["+i+"] = "+rss_arr[i]);
		if (min_rss < rss_arr[i]) {
			min_rss = rss_arr[i];
			pointIndex = i;
			//console.log("kandinsky.findPointWithLeastRSS: lower rss found: rss_arr["+i+"] = "+rss_arr[i]);
		};
	}
	//console.log("kandinsky.findPointWithLeastRSS: arr["+pointIndex+"] = "+arr[pointIndex]);
	return arr[pointIndex];
}

function computeClusters() {
	//take a set of centroids and classify each point around one of the centroids
	//note the count for each cluster - this gives you the number of points associated to each centroid
	//return [newCentroids, clustercount];
	// for each pixel in the image - compute squaredEuclideanDistance and associate with the centroid that has least sed
	// loop on each pixel
	// loop on each centroid
	// compute sed
	// loop on each centroid
	// find minimum sed
	// push centroid id into clusters array
	var numPoints = vectors.length;
	var sedArr = [];
	var i = 0;
	var j = 0;
	var minsed = 0;
	var minsedindex = 0;
	clusters = [];
	var tempsed = 0;
	//console.log("computeClusters: vectors = ", JSON.stringify(vectors));
	//console.log("computeClusters: centroids = ", JSON.stringify(centroids));
	for (i = 0; i < numPoints; i++) {
		//console.log("computeClusters: clustering vector[", i, "]")
		sedArr = [];
		for (j = 0; j < k; j++) {
			//console.log("computeClusters: computing sed for centroid[", j, "] = ", JSON.stringify(centroids[j]));
			tempsed = squaredEuclideanDistance(vectors[i], centroids[j]);
			//console.log("computeClusters: sed for centroid[", j, "] = ", tempsed);
			sedArr.push(tempsed);
		}
		//console.log("computeClusters: sedArr = ", JSON.stringify(sedArr));
		minsed = sedArr[0];
		minsedindex = 0;
		for (j = 0; j < k; j++) {
			// there is a bug here!!!!!
			if (sedArr[j] < minsed) {
				minsed = sedArr[j];
				minsedindex = j;
			}
		}
		//console.log("computeClusters: vector ", i, ": minsed = ", JSON.stringify(minsed));
		//console.log("computeClusters: vector ", i, ": minsedindex = ", minsedindex);
		clusters.push(minsedindex);
	}
	//console.log("computeClusters: clusters = " + JSON.stringify(clusters));
}

function compareCentroids() {
	//take two sets of centroids and see if they moved much or not
	//how? their residual sum of squares is minimum or has not changed much
	var centroidsHaveConverged = false;
	var i = 0;
	var cl = centroids.length;
	var centDist = [];
	var totalsumofcentroiddistance = 0;
	//
	oldCentRss = [];
	// 'old' DS don't exist for the first iteration, so cannot compare, hence do this from iteration 2 onwards.
	if (totaliter > 1) {
		// first move current RSS to old
		for (i = 0; i < cl; i++) {
			oldCentRss.push(centRss[i]);
		}
		centRss = [];
		//  calculate the new RSS
		for (i = 0; i < cl; i++) {
			centRss.push(residualSumOfSquares(centclusters[i], centroids[i]));
			//oldCentRss.push(residualSumOfSquares(centclusters[i], oldCentroids[i]));
		}
		// now eval the diff for each centroid
		for (i = 0; i < cl; i++) {
			centDist.push(Math.abs(Math.abs(oldCentRss[i]) - Math.abs(centRss[i])));
		}
		//console.log("compareCentroids - oldCentRss:" + JSON.stringify(oldCentRss));
		//console.log("compareCentroids - centRss:" + JSON.stringify(centRss));
		//console.log("compareCentroids - centDist:" + JSON.stringify(centDist));
		//
		for (i = 0; i < cl; i++) {
			totalsumofcentroiddistance += centDist[i];
		}
		//console.log("compareCentroids - totalsumofcentroiddistance:" + totalsumofcentroiddistance);
		centroidsHaveConverged = (totalsumofcentroiddistance == 0);
		//console.log("compareCentroids: centroidsHaveConverged = " + centroidsHaveConverged);
	}
	return !centroidsHaveConverged;
}
var algorithmNameStrings = ["kMeans"];

function quantizeColors(algorithmNameStr, colorArray, numberOfColors) {
	if (numberOfColors === 0 || numberOfColors < 0) {
		numberOfColors = 2;
	}
	return compute_kmeans(colorArray, numberOfColors);
}
/*return this;
}();*/
/*K Means:
        a. Pick K random centroids from array
        b. classify all points into clusters
        c. move centroids to the mean/average of their respective clusters
        d. did the centroids move much? if yes, goto b, else stop
        e. publish results*/
// web workers
// rgb to hsv
// select random points
// use k means 
// implement others such as neural nets
// provide harmonic colors to selected ones
// provide shades/values of selected colours
// provide sliders to select n colours in a given direction - 
// so I can say give me 5 increments and 5 decrements
// that vary by 2 on hue, 5 on saturation and 17 on value
// or I can say give me 7 increments and 4 decrements that
// vary by 8 on red, 12 on green and 23 on blue
// see if you can implement YUV and LAB colour models as well
// export as:
// CSS, SVG, Swatches for adobe, MS Office and Google Docs