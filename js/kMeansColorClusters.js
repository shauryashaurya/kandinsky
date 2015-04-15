var kMeansColorClusters = function()
    {
        // pick up n random colors from all the ones provided
        var seedRandomPoints = function(arr, n)
        {
            arr.sort(function(a, b)
            {
                return (Math.random() < 0.5) ? -1 : 1
            });
            return arr.slice(0, n);
        }

        // distances can be euclidean, pearson, manhattan etc.
        // for now we stick with euclidean
        var squaredEuclideanDistance = function(a, b)
        {
            // assumes a and b are tuples of color values of the form [r,g,b]
            // remember the distance between two points formular from coordinate geometry?
            return ((b[0] - a[0]) * (b[0] - a[0]) +
                (b[1] - a[1]) * (b[1] - a[1]) +
                (b[2] - a[2]) * (b[2] - a[2]))
        }

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
        }

        var arithmeticMeanCenter = function(arr)
        {
            var centroid = [0, 0, 0];
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
            return [Math.round(rsum / len),
                Math.round(gsum / len),
                Math.round(bsum / len)
            ];
        }

        var geometricMeanCenter = function(arr)
        {
            var centroid = [0, 0, 0];
            var len = arr.length;
            var arr_iter = 0;
            var rlogsum = 0;
            var glogsum = 0;
            var blogsum = 0;
            for (arr_iter = 0; arr_iter < len; arr_iter++)
            {
                rlogsum += (arr[arr_iter][0] === 0) ?
                    0 : Math.log(arr[arr_iter][0]);
                glogsum += (arr[arr_iter][1] === 0) ?
                    0 : Math.log(arr[arr_iter][1]);
                blogsum += (arr[arr_iter][2] === 0) ?
                    0 : Math.log(arr[arr_iter][2]);
            }

            return [Math.round(Math.exp(rlogsum / len)),
                Math.round(Math.exp(glogsum / len)),
                Math.round(Math.exp(blogsum / len))
            ];
        }

        var classifyPoint = function(point, centroids)
        {
            var centroidReference = -1;
            var len = centroids.length;
            var i = 0;
            var distance = Infinity;
            var sqED = Infinity;
            for (i = 0; i < len; i++)
            {
                sqED = squaredEuclideanDistance(point, centroids[i]);

                if sqED < distance
                {
                    distance = sqED;
                    centroidReference = i;
                }
            };

            return centroidReference;
        }

        var classifyAllPoints = function(points, centroids)
        {
            var centroidReferenceArray = [];
            for (var i = 0; i < points.length; i++)
            {
                centroidReferenceArray.push(classifyPoint(points[i], centroids));
            };
            return centroidReferenceArray;
        }

        var recalculateCentroidPosition = function(clusterArr, centroid)
        {
            var newCentroid = geometricMeanCenter(clusterArr);
            var isMoving = false;
            var oldRSS = residualSumOfSquares(clusterArr, centroid);
            var newRSS = residualSumOfSquares(clusterArr, newCentroid);
            var distanceBetweenCentroids = squaredEuclideanDistance(centroid, newCentroid);
            // if the centroids match or 
            if ((newCentroid === centroid) || 
                (1-(newRSS/oldRSS)<= .01) ||
                (distanceBetweenCentroids <= 0.1)
                {
                    return {"match":true, "centroid":centroid};
                }
                else
                {
                    return {"match":false, "centroid":newCentroid};
                }
            return 0;
        }


        var iteration = 1;
        var kcentroids = [];
        var old_kcentroids = [];
        var clusters = [];
        var rss = Infinity;
        var isInitialState = false;

        var resetState = function()
        {
            iteration = 1;
            kcentroids = [];
            old_kcentroids = [];
            clusters = [];
            rss = Infinity;
            isInitialState = true;

        }
        var calculateKMeansClusters = function(colors, k)
        {
            if (iteration === 1)
            {
                if (!isInitialState)
                {
                    resetState();
                }
                iteration++;
                kcentroids = seedRandomPoints(pixels, k);
            }
            else if (iteration > 1)
            {
                iteration++;
                old_kcentroids = kcentroids.slice(); //make a copy
                if (true)
                {};
                kcentroids = moveCentroids(pixels, k);
            }
            return kcentroids;
        }


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
