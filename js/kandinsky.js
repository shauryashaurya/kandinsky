var Kandinsky = function(ctx)
{

	var self = this;
	
	var vectors = [];
	var vectorLength = 3;
	var k = 7;
	var centroids = [];
	var oldCentroids = [];
	var proportions = [];

	var initialized = false;

	console.log("kandinsky here");
	console.log("kandinsky: ctx: ", ctx);
	console.log("kandinsky: self: ", self);
	
	var kmeans = function(vectors,k)
	{
		self.vectors = vectors.slice();
		self.k = k;
		self.vectorLength = self.vectors[0].length;
		centroids = new Array(self.k);
		oldCentroids = new Array(self.k);




		console.log("kmeans: vectors: ",vectors);
		console.log("kmeans: k: ", k);
		return {'colors':[[1,1,1],[50,50,50],[255,255,255]], 'ratio':[0.1,0.5,0.4]};

		/*
		initCentroids();
		while ((compareCentroids() === false)||(iterations<maxIterations))
		{
			pickCentroids(computeClusters());
		}
		return [centroids, clustercount];

	}

	var initCentroids = function ()
	{
		//take RGB data from the table and pick random centroids
		//initialize another set of centroids array to zero

	}

	var pickCentroids = function ()
	{
		//take RGB data clustered around old centroids and find new centroids for the clusters


	}

	var computeClusters = function(dentroidsNow, points)
	{
		//take a set of centroids and classify each point around one of the centroids
		//note the count for each cluster - this gives you the number of points associated to each centroid
		return [newCentroids, clustercount];
	}

	var compareCentroids = function ()
	{
		//take two sets of centroids and see if they moved much or not
		//how? their residual sum of squares is minimum or has not changed much

		return centroidsHaveConverged;

	}






	var algorithmNameStrings = ["kMeans"];

	
	//return self;
};

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

