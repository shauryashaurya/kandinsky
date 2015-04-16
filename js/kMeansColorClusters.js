var kMeansColorClusters = function(window, document)
    {
        var self = this;
        //
        var iteration = 1;
        var kcentroids = [];
        var old_kcentroids = [];
        var colors = []; //array of colors 

        // clusters is an array of same length as colors 
        // where each cell carries the index of the centroid 
        // from the kcentroids array
        // to which the corresponding color in the colors array
        // is associated
        var clusters = [];

        // colorProportions is an object of same length as kcentroids
        // each cell carries the proportion that the corresponding color 
        // in kcentroids exists for
        var colorProportions = {};
        var rss = Infinity;
        var isInitialState = false;
        //

        // pick up n random colors from all the ones provided
        var seedRandomPoints = function(arr, n)
        {
            //console.log("seedRandomPoints: n: ", n);
            //console.log("seedRandomPoints: arr: ", arr);
            arr.sort(function(a, b)
            {
                return (Math.random() < 0.5) ? -1 : 1
            });
            //console.log("seedRandomPoints: arr: ", arr.slice(0, n));
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
            //console.log("residualSumOfSquares: ", rss);
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

                if (sqED < distance)
                {
                    distance = sqED;
                    centroidReference = i;
                }
            };
            //console.log("classifyPoint: centroidReference: ", centroidReference)
            return centroidReference;
        }

        var classifyAllPoints = function(points, centroids)
        {
            var centroidReferenceArray = [];
            for (var i = 0; i < points.length; i++)
            {
                centroidReferenceArray.push(classifyPoint(points[i], centroids));
            };
            //console.log("classifyAllPoints: centroidReferenceArray: ", centroidReferenceArray);
            return centroidReferenceArray;
        }

        var recalculateCentroidPosition = function(clusterArr, centroid)
        {
            var newCentroid = geometricMeanCenter(clusterArr);
            var isMoving = false;
            var oldRSS = residualSumOfSquares(clusterArr, centroid);
            var newRSS = residualSumOfSquares(clusterArr, newCentroid);
            var distanceBetweenCentroids = squaredEuclideanDistance(centroid, newCentroid);
            // if the centroids match or are within a 5% error margin
            if ((newCentroid === centroid) ||
                (1 - (newRSS / oldRSS) <= .05) ||
                (distanceBetweenCentroids <= 0.05)) //they either match or are within a 5% error margin
            {
                console.log("recalculateCentroidPosition: match! - centroid", centroid);
                return {
                    "match": true,
                    "centroid": centroid
                };
            }
            else
            {
                console.log("recalculateCentroidPosition: no match - new centroid", newCentroid);
                return {
                    "match": false,
                    "centroid": newCentroid
                };
            }

            return 0;
        }

        var moveCentroids = function(colorPoints, centroids)
        {

            //
            old_kcentroids = centroids.slice(); //make a copy
            var match = true;
            var centroidObj = {};
            for (var i = 0; i < centroids.length; i++)
            {
                centroidObj = recalculateCentroidPosition(colorPoints, centroids[i]);
                match = match && centroidObj["match"];
                kcentroids[i] = centroidObj["centroid"];
            };
            console.log("moveCentroids: match situation: ", match);
            return match;
        }

        var calculateProportions = function(centroids, clusters)
        {
            // check out SheetJS' fantastic answer on stackoverflow:
            // http://stackoverflow.com/questions/19395257/how-to-count-duplicate-value-in-an-array-in-javascript
            /*var counts = {};
            your_array.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });*/
            var proportions = {};
            var len = centroids.length;
            clusters.forEach(
                function(c)
                {
                    proportions[c.join("")] =
                        ((proportions[c.join("")] * len || 0) + 1) / len;
                });
            console.log("calculateProportions: proportionsObject: ", proportions);
            return proportions;
        }



        var resetState = function()
        {
            iteration = 1;
            kcentroids = [];
            colors = [];
            old_kcentroids = [];
            clusters = [];
            colorProportions = [];
            rss = Infinity;
            isInitialState = true;
            console.log("resetState: State has been re initialized");
        }

        // create centroids
        // cluster points by measuring distance to closest centroid
        // update centroids
        // cluster again
        // repeat till centroids do not move
        var calculateKMeansClusters = function(input_colors, k, pretty_print)
        {
            console.log("---calculateKMeansClusters---");
            //console.log("input_colors: ", input_colors);
            //console.log("k: ", k);
            //console.log("pretty_print: ", pretty_print);
            var weDoneHere = false;
            do {
                if (iteration === 1)
                {
                    if (!isInitialState)
                    {
                        resetState();
                    }
                    colors = input_colors.slice(); //make a copy
                    kcentroids = seedRandomPoints(colors, k);
                    classifyAllPoints(colors, kcentroids);
                    isInitialState = false;
                    console.log("calculateKMeansClusters: first iteration over");
                    iteration++;
                    console.log("calculateKMeansClusters: next iteration: ", iteration);
                }
                // TODO: how will you run the next iteration??? you idiot???
                else if (iteration > 1)
                {

                    weDoneHere = moveCentroids(colors, kcentroids) //["match"]
                    console.log("calculateKMeansClusters: ", iteration, " iteration over, weDoneHere:", weDoneHere);
                    if (weDoneHere)
                    {
                        break;
                    }
                    iteration++;
                    console.log("calculateKMeansClusters: next iteration: ", iteration);
                    /*if (iteration === 5)
                    {
                        weDoneHere = true;
                    }*/

                }
            }
            while (!weDoneHere)
            //
            if (weDoneHere)
            {
                console.log("calculateKMeansClusters: ", iteration, " iteration over, I think we done here! weDoneHere:", weDoneHere);

                var final_data = {
                    "centroids": kcentroids,
                    "proportions": calculateProportions(kcentroids, clusters),
                    "data": colors,
                    "clusters": clusters
                }
                if (!pretty_print)
                {
                    return final_data;
                }
                else
                {
                    // you don't get all the colours of the image in the pretty print
                    return prettyPrintData(final_data);
                }
            }

        }


        var prettyPrintData = function(dataObj)
        {
            var result = {
                "number_of_colors": 0,
                "colors": []
            };
            // find out the number of colours
            // number of colours = length of centroids array
            result["number_of_colors"] = dataObj["centroids"].length;
            console.log("prettyPrintData: number_of_colors: ", dataObj["centroids"].length);
            console.log("prettyPrintData: dataObj: ", dataObj);
            // find out the colours
            // colours = centroids
            // find out the proportion for each color
            // # of times index of a centroid is found in clusters array
            // loop over clusters array and 

            for (var i = 0; i < dataObj["centroids"].length; i++)
            {
                // TODO - this is not going to get to the right proportion, fix it.
                var colorValue = dataObj["centroids"][i];
                var colorProportion = dataObj["proportions"][colorValue.join("")]
                console.log("prettyPrintData: colorValue: ", colorValue);
                console.log("prettyPrintData: colorProportion: ", colorProportion);
                result["colors"].push(
                {
                    "value": colorValue,
                    "proportion": colorProportion
                });

            };
            console.log("prettyPrintData: result: ", result);
            return result;

        }

        return calculateKMeansClusters;


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


/*TODO
*move centroids
*calculate color proportions
*pretty print
implement final loop
*/
