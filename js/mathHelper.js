//assumes points have 3 coordinates
var squareOfDifference = function(a, b) {
	return ((b - a) * (b - a));
}
var squaredEuclideanDistance = function(pointA, pointB) {
		var i = 0;
		var distance = 0;
		for (i = 0; i < 4; i++) {
			distance += squareOfDifference(pointA[i], pointB[i]);
		}
		return distance;
	}
	//
var residualSumOfSquares = function(arr, centroid) {
	var rss = 0;
	var len = arr.length;
	var i = 0;
	for (i = 0; i < len; i++) {
		rss += squaredEuclideanDistance(arr[i], centroid);
	}
	return rss;
};
//
var arithmeticMeanCenter = function(arr) {
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
var geometricMeanCenter = function(arr) {
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