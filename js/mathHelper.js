//assumes points have 3 coordinates
function squareOfDifference(a, b) {
	return ((b - a) * (b - a));
}

function squaredEuclideanDistance(pointA, pointB) {
	var i = 0;
	var distance = 0;
	var dimensions = pointA.length;
	pointA = (pointA) ? pointA : [0, 0, 0, 0];
	pointB = (pointB) ? pointB : [255, 255, 255, 255];
	for (i = 0; i < dimensions; i++) {
		distance += squareOfDifference(pointA[i], pointB[i]);
	}
	return distance;
}
//
function residualSumOfSquares(arr, centroid) {
	var rss = 0;
	var len = arr.length;
	var i = 0;
	for (i = 0; i < len; i++) {
		rss += squaredEuclideanDistance(arr[i], centroid);
	}
	return rss;
};
//
function normalizeArray(arr) {
	//console.log("normalizeArray: incoming: ", JSON.stringify(arr));
	var l = arr.length;
	var i = 0;
	var sum = 0;
	for (i = 0; i < l; i++) {
		sum = sum + arr[i];
	}
	for (i = 0; i < l; i++) {
		//return results at are accurate to atleast six decimal places
		arr[i] = ((arr[i] * 1000000) / sum) / 1000000;
	}
	//console.log("normalizeArray: normalized: ", JSON.stringify(arr));
	//console.log("normalizeArray: normalized sum= ", JSON.stringify(arr.reduce(function(a, b) {		return a + b;	}, 0)));
	return arr;
}
//
function geometricMedian(arr) {
	//TODO: build this function using array.map and array.reduce
	var len = arr.length;
	var i = 0;
	var j = 0;
	var rssArr = [];
	var minrss = 0;
	var minIndex = 0;
	//first calculate the rss for each point in arr
	for (i = 0; i < len; i++) {
		rssArr[i] = residualSumOfSquares(arr, arr[i]);
	}
	//then find the index of the point with minimum rss
	minrss = rssArr[0];
	for (i = 0; i < len; i++) {
		if (minrss > rssArr[i]) {
			minrss = rssArr[i];
			minIndex = i;
		}
	}
    console.log("geometricMedian: arr[",minIndex,"] = ", JSON.stringify(arr[minIndex]));
	return arr[minIndex];
};
//
function arithmeticMeanCenter(arr) {
	var len = arr.length;
	var i = 0;
	var rsum = 0;
	var gsum = 0;
	var bsum = 0;
	for (i = 0; i < len; i++) {
		rsum += arr[i][0];
		gsum += arr[i][1];
		bsum += arr[i][2];
	}
	return [Math.round(rsum / len), Math.round(gsum / len), Math.round(bsum / len)];
};
//
function geometricMeanCenter(arr) {
	var len = arr.length;
	var i = 0;
	var rlogsum = 0;
	var glogsum = 0;
	var blogsum = 0;
	for (i = 0; i < len; i++) {
		rlogsum += (arr[i][0] === 0) ? 0 : Math.log(arr[i][0]);
		glogsum += (arr[i][1] === 0) ? 0 : Math.log(arr[i][1]);
		blogsum += (arr[i][2] === 0) ? 0 : Math.log(arr[i][2]);
	}
	return [Math.round(Math.exp(rlogsum / len)), Math.round(Math.exp(glogsum / len)), Math.round(Math.exp(blogsum / len))];
};