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
var tempInterval = 0;
var maxJobCycles = 10;
var maxTotalIterations = 300;
var maxIterationsBeforeReducingK = 50;
var kIteration = 0;

function compute_kmeans(vectors, k) {
	self.vectors = vectors.slice();
	self.k = k;
	if (!k) {
		k = 3;
	}
	self.vectorLength = self.vectors[0].length;
	for (jobCycle = 0; jobCycle < maxJobCycles; jobCycle++) {
		colorResults.push(compute_kmeans_jobcycle(vectors, k));
	}
	return colorResults;
}

function compute_kmeans_jobcycle(vectors, k) {
	self.centroids = [];
	self.clusters = [];
	initCentroids();
	self.oldCentroids = [];
	while (!compareCentroids() && totaliter < maxTotalIterations) {
		totaliter++;
		intertia[jobCycle] = totaliter;
		//if there's a bunch of empty clusters then try a better set of initial clusters
		if (computeClusters()) {
			pickCentroids();
		} else {
			self.kIteration++;
			if (kIteration >= maxIterationsBeforeReducingK && k > 1) {
				k--;
				kIteration = 0;
			}
			if (k == 1) {
				break;
			};
			initCentroids();
		};
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
	var i = 0;
	backupAndRefreshCentroids();
	for (i = 0; i < k; i++) {
		centroids.push(geometricMedian(centclusters[i]));
	}
}

function computeClusters() {
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
	return !(true && tempArr.reduce((isZero, x, i, a) => ((x.length == 0) ? false : true), true));
}

function compareCentroids() {
	//take two sets of centroids and see if they moved much or not
	//how? their residual sum of squares is minimum or has not changed much
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