/*var Kandinsky = function(ctx)
{*/

	var self = this;
	
	var vectors = [];
	var clusters = [];
	var vectorLength = 3;
	var k = 7;
	var centroids = [];
	var oldCentroids = [];
	var proportions = [];
	var totaliter = 0;
	var initialized = false;

	console.log("kandinsky here");
	console.log("kandinsky: self: ", self);
	
	function compute_kmeans (vectors,k)
	{
		self.vectors = vectors.slice();
		self.k = k;
		self.vectorLength = self.vectors[0].length;
		//
		//console.log("kmeans: vectors: ",vectors);
		console.log("kmeans: k: ", k);
		//
		centroids = [];
		clusters = [];
		initCentroids();
		console.log("kmeans: compute_kmeans: centroids = ",centroids);
		oldCentroids = [];
		totaliter = 0;
		while(compareCentroids () || totaliter>500){
			totaliter++;
			computeClusters ();
			pickCentroids();
		}
		
		return {'colors':[[1,1,1],[50,50,50],[255,255,255]], 'ratio':[0.1,0.5,0.4]};

		/*
		initCentroids();
		while ((compareCentroids() === false)||(iterations<maxIterations))
		{
			pickCentroids(computeClusters());
		}
		return [centroids, clustercount];*/

	}

	function initCentroids()
	{
		//take RGB data from the table and pick random centroids
		//initialize another set of centroids array to zero
		var i=0;
		centroids = [];
		console.log("kmeans: initCentroids: k: ",k);
		for (i=0;i<k;i++){
			var randPointIndex = Math.round(vectors.length*Math.random());
			console.log("kmeans: initCentroids: randPointIndex",randPointIndex);
			console.log("kmeans: initCentroids: vectors[",randPointIndex,"] = ",self.vectors[randPointIndex]);
			//centroids.push(self.vectors[randPointIndex]);
			centroids.push(JSON.parse(JSON.stringify(vectors[randPointIndex])));
			console.log("kmeans: loop ",i,"initCentroids: ",centroids);
		}
		console.log("kmeans: initCentroids: ",centroids);

	}

	function pickCentroids()
	{
		//take RGB data clustered around old centroids and find new centroids for the clusters
		//this one's going to be a bit complicated - we need to compute the median and not the average.
		//the median is the point with the least RSS

		//loop on clusters array
		// pick id of centroid and create an array of arrays, each carrying the point data
		// loop through this new array
		// findPointwithleastrss for each
		var centclusters = [];
		var lenclust = clusters.length;
		var i=0;
		oldCentroids = []

		for (i=0;i<k;i++){
			centclusters.push([]);
			//
			oldCentroids.push(centroids.pop());
		}
		console.log("pickCentroids - oldCentroids:"+oldCentroids);
		console.log("pickCentroids - centroids:"+centroids);

		for (i=0;i<k;i++){
			for (j=0;j<lenclust;j++){
				centclusters[i].push(centroids[j]);
			}
		}
		for (i=0;i<k;i++){
			centroids.push(findPointWithLeastRSS (centclusters[i]));
		}
		console.log("pickCentroids - pass 2 - oldCentroids:"+oldCentroids);
		console.log("pickCentroids - pass 2 - centroids:"+centroids);
	}

	function findPointWithLeastRSS (arr)
	{
		var point = arr[0];
		var rss_arr = [];
		var min_rss=0;
		var pointIndex = 0;
		var arr_len = arr.length;
		var i = 0;
		// find rss for all points in the array
		for (i=0;i<arr_len;i++){
			rss_arr.push(residualSumOfSquares(arr,arr[i]))
		}
		min_rss = rss_arr[0];
		for (i=0;i<arr_len;i++){
			//console.log("kandinsky.findPointWithLeastRSS: min_rss = "+min_rss);
			//console.log("kandinsky.findPointWithLeastRSS: rss_arr["+i+"] = "+rss_arr[i]);
			if(min_rss<rss_arr[i]){
				min_rss=rss_arr[i];
				pointIndex = i;
			//console.log("kandinsky.findPointWithLeastRSS: lower rss found: rss_arr["+i+"] = "+rss_arr[i]);

			};
		}
		console.log("kandinsky.findPointWithLeastRSS: arr["+pointIndex+"] = "+arr[pointIndex]);
		return arr[pointIndex];
	}

	function computeClusters ()
	{
		//take a set of centroids and classify each point around one of the centroids
		//note the count for each cluster - this gives you the number of points associated to each centroid
		//return [newCentroids, clustercount];


		//for each pixel in the image - compute squaredEuclideanDistance and associate with the cluster that has lease sed
		// loop on each pixel
		// loop on each centroid
		// compute sed
		// loop on each centroid
		// find minimum sed
		// push centroid id into clusters array

		var numPoints = vectors.length;
		var sedArr = [];
		var i=0;
		var j=0;
		var minsed = 0;
		var minsedindex = 0;
		clusters = [];
		//console.log("computeClusters: self.centroids = ",self.centroids);
		//console.log("computeClusters: centroids = ",centroids);
		for(i=0;i<numPoints;i++){
			sedArr = [];
			for(j=0;j<k;j++){
				//console.log("computeClusters: vectors[",i,"] = ",vectors[i]);
				//console.log("computeClusters: centroids[",j,"] = ",centroids[j]);
				sedArr.push(squaredEuclideanDistance(vectors[i],centroids[j]));
			}
			for(j=0;j<k;j++){
				if(minsed<sedArr[j]){
					minsed = sedArr[j];
					minsedindex = j;
				}
			}
			clusters.push[minsedindex];
		}
		console.log("computeClusters: clusters = "+clusters);
	}

	function compareCentroids ()
	{
		//take two sets of centroids and see if they moved much or not
		//how? their residual sum of squares is minimum or has not changed much
		var centroidsHaveConverged = true;
		var i=0;
		var cl = centroids.length;
		var centroiddistance = [];
		var totalsumofcentroiddistance = -1;
		console.log("compareCentroids - oldCentroids:"+oldCentroids);
		console.log("compareCentroids - centroids:"+centroids);
		if(totaliter>1){
			for (i=0;i<cl;i++){
				centroiddistance.push(squaredEuclideanDistance(centroids[i], oldCentroids[i]));
			}
			for (i=0;i<cl;i++){
				totalsumofcentroiddistance = totalsumofcentroiddistance + centroiddistance[i];
			}
			console.log("kandinsky: compareCentroids: centroiddistance = "+ centroiddistance);
			console.log("kandinsky: compareCentroids: totalsumofcentroiddistance = "+ totalsumofcentroiddistance);

			centroidsHaveConverged = (totalsumofcentroiddistance == 0);
			console.log("kandinsky: compareCentroids: centroidsHaveConverged = "+ centroidsHaveConverged);
		}

		return centroidsHaveConverged;
	}






	var algorithmNameStrings = ["kMeans"];

	function quantizeColors (algorithmNameStr, colorArray, numberOfColors){
		if (numberOfColors === 0 || numberOfColors<0){
			numberOfColors = 2;
		}
		return compute_kmeans(colorArray, numberOfColors);
	}

	
	/*return this;
}();*/

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

