//assumes points have 3 coordinates
var squaredEuclideanDistance = function(pointA, pointB)
{
    return Math.sqrt((pointB[0] - pointA[0]) * (pointB[0] - pointA[0]) +
        (pointB[1] - pointA[1]) * (pointB[1] - pointA[1]) +
        (pointB[2] - pointA[2]) * (pointB[2] - pointA[2]));
}

//
var residualSumOfSquares = function(arr, centroid)
{
    var rss = 0;
    var len = arr.length;
    var arr_iter = 0;
    for (arr_iter = 0; arr_iter < len; arr_iter++)
    {
        rss += squaredEuclideanDistance(arr[arr_iter], centroid);
    }
    return rss;
};

//
var arithmeticMeanCenter = function(arr)
{
    var len = arr.length;
    var arr_iter = 0;
    var rsum = 0;
    var gsum = 0;
    var bsum = 0;
    for (arr_iter = 0; arr_iter < len; arr_iter++)
    {
        rsum += arr[arr_iter][0];
        gsum += arr[arr_iter][1];
        bsum += arr[arr_iter][2];
    }
    return [Math.round(rsum / len), Math.round(gsum / len), Math.round(bsum / len)];
};

//
var geometricMeanCenter = function(arr)
{

    var len = arr.length;
    var arr_iter = 0;
    var rlogsum = 0;
    var glogsum = 0;
    var blogsum = 0;
    for (arr_iter = 0; arr_iter < len; arr_iter++)
    {
        rlogsum += (arr[arr_iter][0] === 0) ? 0 : Math.log(arr[arr_iter][0]);
        glogsum += (arr[arr_iter][1] === 0) ? 0 : Math.log(arr[arr_iter][1]);
        blogsum += (arr[arr_iter][2] === 0) ? 0 : Math.log(arr[arr_iter][2]);
    }

    return [Math.round(Math.exp(rlogsum / len)), Math.round(Math.exp(glogsum / len)), Math.round(Math.exp(blogsum / len))];
};
