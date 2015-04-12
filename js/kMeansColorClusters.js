var kMeansColorClusters = function(pixels, k)
{
	var iteration = 1;
	var kcentroids = [];
	var clusters = [];

    var seedRandomPoints = function(arr, n)
    {
        arr.sort(function(a, b)
        {
            return (Math.random() < 0.5) ? -1 : 1
        });
        return arr.slice(0, n);
    }

    var squaredEuclideanDistance = function(a,b)
    {
    	return ((b[0]-a[0])*(b[0]-a[0])+
    		(b[1]-a[1])*(b[1]-a[1])+
    		(b[2]-a[2])*(b[2]-a[2]))
    }

    var residualSumOfSquares = function(arr, centroid)
    {
    	var rss = 0;
    	var len = arr.length;
    	var arr_iter = 0;
    	for (arr_iter = 0; arr_iter<len; arr_iter++)
    	{
    		rss += squaredEuclideanDistance(arr[arr_iter], centroid);
    	}
    	return rss;
    }

    var calculateCentroid = function(arr)
    {
    	var centroid = [0,0,0];
    	var len = arr.length;
    	var arr_iter = 0;
    	var rsum = 0;
    	var gsum = 0;
    	var bsum = 0;
    	for (arr_iter = 0; arr_iter<len; arr_iter++)
    	{
    		rsum += arr[arr_iter][0];
    		gsum += arr[arr_iter][1];
    		bsum += arr[arr_iter][2];
    	}
    	return [Math.round(rsum/len), Math.round(gsum/len), Math.round(bsum/len)];
    }

    if (iteration === 1)
    {
    	iteration++;
    	kcentroids = seedRandomPoints(pixels, k);
    }
    else if (iteration > 1)
    {
    	iteration++;
    	kcentroids = moveCentroids(pixels, k);
    }

    return kcentroids;

    // create centroids
    // cluster points by measuring distance to closest centroid
    // update centroids
    // cluster again
    // repeat till centroids do not move


}
    /*var theme = {
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
	return theme;*/
