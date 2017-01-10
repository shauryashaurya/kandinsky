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
var intertia = [];
var jobCycle = 0;
var colorResults = [];

function compute_kmeans(vectors, k) {
	self.vectors = vectors.slice();
	self.k = k;
	self.vectorLength = self.vectors[0].length;
	for (jobCycle = 0; jobCycle < 10; jobCycle++) {
		//console.log("jobCycle: ", jobCycle);
		//console.log("jobCycle: ", jobCycle);
		colorResults.push(compute_kmeans_jobcycle(vectors, k));
	}
	return colorResults;
}

function compute_kmeans_jobcycle(vectors, k) {
	self.centroids = [];
	self.clusters = [];
	initCentroids();
	self.oldCentroids = [];
	while (!compareCentroids() && totaliter < 500) {
		totaliter++;
		intertia[jobCycle] = totaliter;
		//console.log("jobCycle: ", jobCycle,": iteration: ", totaliter);
		computeClusters();
		pickCentroids();
	}
	return {
		'colors': centroids,
		'ratio': getRatioArr(),
		'iterations': totaliter,
		'intertia': JSON.stringify(intertia)
	};
}

function getRatioArr() {
	var centlen = centroids.length;
	var veclen = vectors.length;
	var i = 0;
	var ratioArr = [];
	//console.log("getRatioArr: centroids.length = ",centlen);
	//console.log("getRatioArr: vectors.length = ",veclen);
	for (i = 0; i < centlen; i++) {
		//console.log("getRatioArr: centclusters[",i,"] = ",centclusters[i].length);
		ratioArr.push((centclusters[i].length / veclen) * 100);
	}
	//console.log("getRatioArr: centroids.length = ",centlen);
	return ratioArr;
}

function createVectorProbabilities(cArr) {
	var caLen = cArr.length;
	var vecLen = vectors.length;
	var caWeights = [];
	/*//console.log("createVectorProbabilities: cArr = ", JSON.stringify(cArr));
	//console.log("createVectorProbabilities: caLen = ", caLen);
	//console.log("createVectorProbabilities: vecLen = ", vecLen);*/
	//each will be a sum of SED for all existing centroids
	var i = 0;
	var j = 0;
	var vecWeightTemp = 0;
	for (i = 0; i < vecLen; i++) {
		vecWeightTemp = 0;
		for (j = 0; j < caLen; j++) {
			if ((typeof vectors[i] == "undefined" || !vectors[i]) || (typeof cArr[j] == "undefined" || !cArr[j])) {
				//console.log("createVectorProbabilities: vectors[", i, "] = ", JSON.stringify(vectors[i]));
				//console.log("createVectorProbabilities: cArr[", j, "] = ", JSON.stringify(cArr[j]));
			}
			vecWeightTemp = vecWeightTemp + squaredEuclideanDistance(vectors[i], cArr[j]);
		}
		caWeights.push(vecWeightTemp);
	}
	return caWeights;
}

function normalize(a) {
	var totalWeight = a.reduce(function(a, b) {
		return a + b;
	}, 0);
	var len = a.length;
	var i = 0;
	for (i = 0; i < len; i++) {
		a[i] = a[i] / totalWeight;
	}
	return a;
}

function initCentroids() {
	//take RGB data from the table and pick random centroids
	//initialize another set of centroids array to zero
	// if vector already exists then
	// pick another random vector
	// else add vector to centroid array
	// initialize iterations for this jobCycle
	totaliter = 0;
	var i = 0;
	var i2 = 0;
	var ii = 0;
	var randPointIndex = 0;
	var pointrepeats = false;
	var pointrepeatsIterationCount = 0;
	var veclen = vectors.length;
	var seedSimilarityToleranceInOneDimension = 32;
	var seedSimilarityTolerance = 3 * seedSimilarityToleranceInOneDimension * seedSimilarityToleranceInOneDimension;
	var centroidProbabilityDistribution = [];
	var randomNum = 0;
	var weight_sum = 0;
	//console.log("initCentroids: seedSimilarityTolerance =", seedSimilarityTolerance);
	self.centroids = [];
	for (i = 0; i < k; i++) {
		// reset the probablity distribution
		centroidProbabilityDistribution = [];
		//console.log("initCentroids: i =", i);
		//for the first time, just pick any random point
		if (i == 0) {
			randPointIndex = Math.round(veclen * Math.random());
		} else if (i > 0) {
			// create the probability distribution so that 
			// points that are further away from the selected centroids have a greater probability of selection
			centroidProbabilityDistribution = normalize(createVectorProbabilities(self.centroids));
			randomNum = Math.random();
			//console.log(random_num)
			for (ii = 0; ii < veclen; ii++) {
				weight_sum += centroidProbabilityDistribution[ii];
				if (randomNum <= weight_sum) {
					randPointIndex = ii;
					//return list[ii];
					break;
				}
			}
		}
		self.centroids[i] = [];
		for (i2 = 0; i2 < self.vectors[randPointIndex].length; i2++) {
			self.centroids[i].push(self.vectors[randPointIndex][i2]);
		}
	}
	//console.log("initCentroids: centroids = ", JSON.stringify(centroids));
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
	// the clusters array stores the indices of centroids each point in the vectors array is associated with
	var lenclust = self.clusters.length; // since clusters is an array of the same size as vectors, this should be equal to self.vectors.length
	var i = 0;
	var i2 = 0;
	oldCentroids = [];
	var tempVector = [];
	var tempIndex = 0;
	// first copy centorids to oldCentroids so that these can be compared later and also initialize centclusters
	for (i = 0; i < k; i++) {
		oldCentroids.push(centroids.pop());
		centclusters.push([]);
	}
	// now cycle through the clusters array to pick vectors for each centroid
	/*for (i = 0; i < lenclust; i++) {
		centclusters[clusters[i]].push(JSON.parse(JSON.stringify(self.vectors[i])));
	}*/
	for (i = 0; i < lenclust; i++) {
		tempIndex = clusters[i];
		self.centclusters[tempIndex].push(self.vectors[i]);
	}
	for (i = 0; i < k; i++) {
		centroids.push(findPointWithLeastRSS(centclusters[i]));
	}
	//console.log("pickCentroids: centroids: ", JSON.stringify(centroids));
}

function findPointWithLeastRSS(arr) {
	//console.log("findPointWithLeastRSS: arr: ", JSON.stringify(arr));
	var point = arr[0];
	var rss_arr = [];
	var min_rss = 0;
	var pointIndex = 0;
	console.log("findPointWithLeastRSS: 1 : arr[", pointIndex, "]: ", JSON.stringify(arr[pointIndex]));
	if (typeof arr[pointIndex] == "undefined") {
		console.log("findPointWithLeastRSS: 1 : arr: ", JSON.stringify(arr));
	}
	var arr_len = arr.length;
	var i = 0;
	// find rss for all points in the array
	for (i = 0; i < arr_len; i++) {
		rss_arr.push(residualSumOfSquares(arr, arr[i]))
	}
	//console.log("findPointWithLeastRSS: rss_arr: ", JSON.stringify(rss_arr));
	min_rss = rss_arr[0];
	for (i = 0; i < arr_len; i++) {
		if (min_rss < rss_arr[i]) {
			min_rss = rss_arr[i];
			pointIndex = i;
		};
	}
	console.log("findPointWithLeastRSS: arr[", pointIndex, "]: ", JSON.stringify(arr[pointIndex]));
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
	//console.log("computeClusters: self.centroids = ", JSON.stringify(self.centroids));
	for (i = 0; i < numPoints; i++) {
		sedArr = [];
		for (j = 0; j < k; j++) {
			tempsed = squaredEuclideanDistance(self.vectors[i], self.centroids[j]);
			sedArr.push(tempsed);
		}
		minsed = sedArr[0];
		minsedindex = 0;
		for (j = 0; j < k; j++) {
			if (sedArr[j] < minsed) {
				minsed = sedArr[j];
				minsedindex = j;
			}
		}
		clusters.push(minsedindex);
	}
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
		for (i = 0; i < cl; i++) {
			totalsumofcentroiddistance += centDist[i];
		}
		centroidsHaveConverged = (totalsumofcentroiddistance == 0);
		//console.log("compareCentroids: centDist: ", JSON.stringify(oldCentRss));
		//console.log("compareCentroids: centDist: ", JSON.stringify(centRss));
		//console.log("compareCentroids: centDist: ", JSON.stringify(centDist));
		//console.log("compareCentroids: totalsumofcentroiddistance: ", totalsumofcentroiddistance);
		//console.log("compareCentroids: centroidsHaveConverged: ", JSON.stringify(centroidsHaveConverged));
	}
	/*if (centroidsHaveConverged) {
		jobCycle++;
	}*/
	return centroidsHaveConverged;
}
var algorithmNameStrings = ["kMeans"];

function quantizeColors(algorithmNameStr, colorArray, numberOfColors) {
	if (numberOfColors === 0 || numberOfColors < 0) {
		numberOfColors = 2;
	}
	return compute_kmeans(colorArray, numberOfColors);
}
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