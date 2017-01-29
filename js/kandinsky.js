// improve:
// the approach for computing centroid clusters is still flawed.
// each time there's atleast one centroid with zero vectors associated with it
// what to do when you discover a centroid with zero vectors associated?
// how to determine if the image has fewer colors than k?
// implement pickcentroids so that it can handle zero length clusters
// the code is hardly readable and not very easy to maintain, fix that
// performance needs to increase by 10x atleast
// bug - the colors displayed are not the same as the colors rendered, the rendered ones seem correct.
var self = this;
var vectors = [];
var clusters_bak = [];
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
var tempInterval = 0;
var maxJobCycles = 11;
var maxTotalIterations = 14;
var maxIterationsBeforeReducingK = 5;
var kIteration = 0;
var tolerance = 24;
var unique = [];
var uniqueProportions = [];
//
// for performance measurement, will be removed later
var timearray_pickCentroids = [];
var timearray_computeClusters = [];
var timearray_compareCentroids = [];
var numberOfTimes_pickCentroids_IsCalledForAJobCycle = 0;
var numberOfTimes_computeClusters_IsCalledForAJobCycle = 0;
var numberOfTimes_compareCentroids_IsCalledForAJobCycle = 0;

function compute_kmeans(vectors, k) {
	var finalResult = JSON.parse("{}");
	self.vectors = vectors.slice();
	self.k = k;
	if (!k) {
		k = 7;
	};
	colorResults = [];
	self.vectorLength = self.vectors[0].length;
	for (jobCycle = 0; jobCycle < maxJobCycles; jobCycle++) {
		setTimeout(colorResults.push(compute_kmeans_jobcycle(vectors, k)), 15000);
	}
	finalResult = filterColors(colorResults);
	return finalResult;
}

function filterColors(c) {
	//console.log("filterColors: c: ", JSON.stringify(c));
	unique = [];
	uniqueProportions = [];
	var toleranceSphere = 3 * tolerance * tolerance;
	console.log("filterColors: toleranceSphere: ", toleranceSphere);
	var row = 0;
	var col = 0;
	var j = 0;
	var maxLoopCycles = k * maxJobCycles;
	var m = 0;
	var n = 0;
	var isUnique = true;
	var tempSed = 0;
	unique.push(c[0]["colors"][0]);
	for (row = 0; row < maxJobCycles; row++) {
		for (col = 0; col < k; col++) {
			isUnique = true;
			for (j = 0; j < unique.length; j++) {
				tempSed = squaredEuclideanDistance(unique[j], c[row]["colors"][col]);
				isUnique = isUnique && (tempSed > toleranceSphere);
			}
			if (isUnique) {
				unique.push(c[row]["colors"][col]);
			}
		}
	}
	uniqueProportions = getProportionsForSpecificCentroids(unique);
	return {
		'allColors': c,
		'unique': unique,
		'proportions': uniqueProportions,
	};
}

function getProportionsForSpecificCentroids(c) {
	var p = [];
	var numCentroids = c.length;
	var veclen = vectors.length;
	// for each pixel in image data, find the centroid it belongs to, update centroid count
	var i = 0;
	var j = 0;
	var minsed = 0;
	var minsedindex = 0;
	var tempsed = 0;
	p = new Array(numCentroids);
	for (i = 0; i < numCentroids; i++) {
		p[i] = 0;
	}
	for (i = 0; i < veclen; i++) {
		minsed = squaredEuclideanDistance(vectors[i], c[0]);
		minsedindex = 0;
		for (j = 1; j < numCentroids; j++) {
			tempsed = squaredEuclideanDistance(vectors[i], c[j]);
			if (tempsed < minsed) {
				minsed = tempsed;
				minsedindex = j;
			}
		}
		//p[minsedindex] = p[minsedindex]+1;
		p[minsedindex]++;
	}
	p = normalizeArray(p);
	//console.log("getProportionsForSpecificCentroids: p: ", JSON.stringify(p));
	return p;
}

function compute_kmeans_jobcycle(vectors, k) {
	//for performance measurement
	numberOfTimes_pickCentroids_IsCalledForAJobCycle = 0;
	numberOfTimes_pomputeClusters_IsCalledForAJobCycle = 0;
	numberOfTimes_compareCentroids_IsCalledForAJobCycle = 0;
	timearray_pickCentroids = [];
	timearray_computeClusters = [];
	timearray_compareCentroids = [];
	var t0 = performance.now();
	//
	self.centroids = [];
	self.clusters = [];
	initCentroids();
	self.oldCentroids = [];
	console.log("compute_kmeans_jobcycle : jobCycle = ", jobCycle);
	while (!compareCentroids() && totaliter < maxTotalIterations) {
		totaliter++;
		intertia[jobCycle] = totaliter;
		//if there's a bunch of empty clusters then try a better set of initial clusters
		if (computeClusters()) {
			pickCentroids();
		} else {
			self.kIteration++;
			if (kIteration >= maxIterationsBeforeReducingK) {
				k = (k > 1) ? (k - 1) : k;
				kIteration = 0;
			}
			if (k == 1) {
				break;
			};
			initCentroids();
		};
	};
	var t1 = performance.now();
	console.log("compute_kmeans_jobcycle: jobcycle ", jobCycle, " took " + (t1 - t0) / 1000 + " seconds.");
	//
	/*
	var timearray_pickCentroids = [];
	var timearray_computeClusters = [];
	var timearray_compareCentroids = [];
	var numberOfTimes_PickCentroids_IsCalledForAJobCycle = 0;
	var numberOfTimes_ComputeClusters_IsCalledForAJobCycle = 0;
	var numberOfTimes_compareCentroids_IsCalledForAJobCycle = 0;

	*/
	//
	console.log("compute_kmeans_jobcycle: jobcycle ", jobCycle, ", avg time taken by pickCentroids " + (timearray_pickCentroids.reduce(function(a, b) {
		return (a + b) / 1000
	}, 0)) / timearray_pickCentroids.length + " seconds.");
	console.log("compute_kmeans_jobcycle: jobcycle ", jobCycle, ", avg time taken by computeClusters " + (timearray_computeClusters.reduce(function(a, b) {
		return (a + b) / 1000
	}, 0)) / timearray_computeClusters.length + " seconds.");
	console.log("compute_kmeans_jobcycle: jobcycle ", jobCycle, ", avg time taken by compareCentroids " + (timearray_compareCentroids.reduce(function(a, b) {
		return (a + b) / 1000
	}, 0)) / timearray_compareCentroids.length + " seconds.");
	console.log("compute_kmeans_jobcycle: jobcycle ", jobCycle, ", numberOfTimes_pickCentroids_IsCalledForAJobCycle " + numberOfTimes_pickCentroids_IsCalledForAJobCycle);
	console.log("compute_kmeans_jobcycle: jobcycle ", jobCycle, ", numberOfTimes_computeClusters_IsCalledForAJobCycle " + numberOfTimes_computeClusters_IsCalledForAJobCycle);
	console.log("compute_kmeans_jobcycle: jobcycle ", jobCycle, ", numberOfTimes_compareCentroids_IsCalledForAJobCycle " + numberOfTimes_compareCentroids_IsCalledForAJobCycle);
	//
	// back to real work, return the results for this job cycle
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
	for (i = 0; i < centlen; i++) {
		ratioArr.push((centclusters[i].length / veclen) * 100);
	}
	return ratioArr;
}

function createVectorProbabilities(cArr) {
	var caLen = cArr.length;
	var vecLen = vectors.length;
	var caWeights = [];
	//each will be a sum of SED for all existing centroids
	var i = 0;
	var j = 0;
	var vecWeightTemp = 0;
	for (i = 0; i < vecLen; i++) {
		vecWeightTemp = 0;
		for (j = 0; j < caLen; j++) {
			if ((typeof vectors[i] == "undefined" || !vectors[i]) || (typeof cArr[j] == "undefined" || !cArr[j])) {}
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
	var centroidProbabilityDistribution = [];
	var randomNum = 0;
	var weight_sum = 0;
	self.centroids = [];
	for (i = 0; i < k; i++) {
		// reset the probablity distribution
		centroidProbabilityDistribution = [];
		//for the first time, just pick any random point
		if (i == 0) {
			randPointIndex = Math.round(veclen * Math.random());
		} else if (i > 0) {
			// create the probability distribution so that
			// points that are further away from the selected centroids have a greater probability of selection
			centroidProbabilityDistribution = normalize(createVectorProbabilities(self.centroids));
			randomNum = Math.random();
			for (ii = 0; ii < veclen; ii++) {
				weight_sum += centroidProbabilityDistribution[ii];
				if (randomNum <= weight_sum) {
					randPointIndex = ii;
					break;
				}
			}
		}
		self.centroids[i] = self.vectors[randPointIndex];
	}
}

function backupAndRefreshCentroids() {
	oldCentroids = [];
	var i = 0;
	for (i = 0; i < k; i++) {
		oldCentroids.push(centroids.pop());
	}
	centroids = [];
}

function backupAndRefreshCentroidRss() {
	oldCentRss = [];
	var i = 0;
	for (i = 0; i < k; i++) {
		oldCentRss.push(centRss[i]);
	}
	centRss = [];
}

function pickCentroids() {
	var t0 = performance.now();
	var i = 0;
	backupAndRefreshCentroids();
	for (i = 0; i < k; i++) {
		//if (centclusters[i].length > 0) {
			centroids.push(geometricMedian(centclusters[i]));
		//} else {
		//	centroids.push(0);
		//}
	}
	var t1 = performance.now();
	timearray_pickCentroids.push(t1 - t0);
	numberOfTimes_pickCentroids_IsCalledForAJobCycle++;
	//console.log("pickCentroids: processing for jobcycle ", jobCycle, " took " + (t1 - t0) / 1000 + " seconds.");
}

function computeClusters() {
	var t0 = performance.now();
	var numPoints = vectors.length;
	var tempArr = [];
	var i = 0;
	var j = 0;
	var minsed = 0;
	var minsedindex = 0;
	var tumbdumb = 0;
	//
	clusters = [];
	centclusters = [];
	for (i = 0; i < k; i++) {
		centclusters.push([]);
	}
	for (i = 0; i < numPoints; i++) {
		minsedindex = centroids.map((e) => (squaredEuclideanDistance(self.vectors[i], e))).reduce((iMin, x, i, a) => ((x == Math.min(x, a[iMin])) ? iMin : i), 0);
		clusters.push(minsedindex);
		centclusters[minsedindex].push(i);
	}
	tempArr = centclusters.map((e) => e.length);
	for (i = 0; i < k; i++) {
		if (tempArr[i] == 0) {
			tumbdumb = Math.round(Math.random() * numPoints);
			centroids[i] = (self.vectors[tumbdumb]);
		}
	}
	var t1 = performance.now();
	timearray_computeClusters.push(t1 - t0);
	numberOfTimes_computeClusters_IsCalledForAJobCycle++;
	//console.log("computeClusters: processing for jobcycle ", jobCycle, " took " + (t1 - t0) / 1000 + " seconds.");
	var shouldPickCentroids = true && tempArr.reduce((isZero, x, i, a) => (isZero && ((x.length > 0) ? false : true)), true);
	//console.log("computeClusters: tempArr: ", JSON.stringify(tempArr));
	//console.log("computeClusters: tempArr.reduce((isZero, x, i, a) => ", tempArr.reduce((isZero, x, i, a) => (isZero&&((x.length == 0) ? false : true)), true));
	//console.log("computeClusters: shouldPickCentroids = ", shouldPickCentroids);
	return (!shouldPickCentroids);
}

function compareCentroids() {
	//take two sets of centroids and see if they moved much or not
	//how? their residual sum of squares is minimum or has not changed much
	var t0 = performance.now();
	var centroidsHaveConverged = false;
	var i = 0;
	var centDist = [];
	var totalsumofcentroiddistance = 0;
	//
	// 'old' DS don't exist for the first iteration, so cannot compare, hence do this from iteration 2 onwards.
	if (totaliter > 1) {
		backupAndRefreshCentroidRss();
		for (i = 0; i < k; i++) {
			centRss.push(residualSumOfSquares(centclusters[i], centroids[i]));
		}
		// now eval the diff for each centroid
		/*for (i = 0; i < k; i++) {
			centDist.push(Math.abs(Math.abs(oldCentRss[i]) - Math.abs(centRss[i])));
		}
		for (i = 0; i < k; i++) {
			totalsumofcentroiddistance += centDist[i];
		}*/
		//centroidsHaveConverged = (totalsumofcentroiddistance == 0);
		centroidsHaveConverged = (JSON.stringify(oldCentRss) == JSON.stringify(centRss));
	}
	var t1 = performance.now();
	timearray_compareCentroids.push(t1 - t0);
	numberOfTimes_compareCentroids_IsCalledForAJobCycle++;
	//console.log("compareCentroids: processing for jobcycle ", jobCycle, " took " + (t1 - t0) / 1000 + " seconds.");
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