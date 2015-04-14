var kMeansColorClusters = function()
    {
        var seedRandomPoints = function(arr, n)
        {
            arr.sort(function(a, b)
            {
                return (Math.random() < 0.5) ? -1 : 1
            });
            return arr.slice(0, n);
        }

        var squaredEuclideanDistance = function(a, b)
        {
            //assumes a and b are tuples of color values of the form [r,g,b]
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

        var calculateCentroid = function(arr)
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
            return [Math.round(rsum / len), Math.round(gsum / len), Math.round(bsum / len)];
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

        var classifyAllPoints = function (points, centroids)
        {
            var centroidReferenceArray = [];
            for (var i = 0; i < points.length; i++) {
                centroidReferenceArray.push(classifyPoint(points[i], centroids));
            };
            return centroidReferenceArray;
        }

        var moveCentroids = function()
        {
            return 0;
        }


        var iteration = 1;
        var kcentroids = [];
        var clusters = [];
        var kMeans = function(pixels, k)
        {
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