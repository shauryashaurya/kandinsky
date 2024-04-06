# Kandinsky  
**Clustering and Quantization**  
**Using photographs as visual input**  

<html> 
	<img src="./images/shaurya-photo-colors.png" width="95%" align="center" alt="Extracting the most significant colors from the photograph using K-Means, Photo © Shaurya Agarwal" />  
</html>    
    
Significant colors in a photograph.  

---
  
# Scope    

This started as a very simple exploration of the simplest clustering algorithm in use, but I can see that doing a more comprehensive coverage of algorithms may be very valuable. Kandinsky aims to cover:  

I. Basic building blocks  
  
1. Similarity/Distance Measures:  
   * Euclidean Distance (Cartesian)  
   * Manhattan Distance  
   * Cosine Distance  
   * Mahalanobis Distance  
   * Domain-specific Distances  
   
2. Data Preprocessing:  
   * Feature Scaling and Normalization  
   * Dimensionality Reduction (e.g., PCA, t-SNE)  
   
3. Cluster Evaluation:  
   * Internal Measures (Cohesion, Separation)  
      * Silhouette Coefficient  
      * Davies-Bouldin Index  
   * External Measures (vs. Ground Truth)  
      * Purity, Rand Index, Adjusted Rand Index  
  
II. Clustering Algorithms  
  
1. Partitioning-Based  
   * K-Means (hard assignments)  
   * K-Medoids (more robust to outliers)  
   * Fuzzy C-Means (soft assignments)  
  
2. Hierarchical  
   * Agglomerative (Bottom-up)  
      * Various linkage methods (single, complete, average)  
   * Divisive (Top-down)  
  
3. Density-Based  
   * DBSCAN (Density-Based Spatial Clustering of Applications with Noise, discovers clusters of varying shapes)  
   * OPTICS (Ordering Points To Identify the Clustering Structure, extension of DBSCAN, provides reachability plot)  
   * HDBSCAN (Improved density clustering, handles varying densities)  
  
4. Distribution-Based  
   * Gaussian Mixture Models (GMM) (assumes data follows mixtures of Gaussian distributions)  
  
5. Grid-Based  
   * STING  
   * CLIQUE  
  
6. Neural Network-Based  
   * Autoencoders (Variational, Denoising, etc.)   
      * Learn latent representations for clustering  
   * Self-Organizing Maps (SOMs)  
      *  Preserve neighborhood relationships in a grid-like space  
   * Deep Embedded Clustering (DEC)  
  
III. Additional Stuff to tackle when I get time and braincycles to spare...  
  
* Spectral Clustering (Flexible approach, particularly effective on non-convex cluster shapes)  
* Graph-Based Clustering  
* Hybrid Approaches (Combining traditional algorithms with neural networks)  
* Clustering High-Dimensional Data  
* Clustering Large-Scale Data (sampling, incremental approaches)  
* Affinity Propagation (Finds clusters based on message-passing between data points)  

---  
  
# Notebooks [*WIP*]
  
* 00 Prep the Pictures
* 01 K-Means
* 015 Color Models
  
  
---  
  
# Eight Down Toofaan Mail  
Kandinsky helped in the cinematography for our feature film **Eight Down Toofaan Mail**.  
  
<html>   
	<img src="./images/Eight-Down-Toofaan-Mail-2022.jpg" width="65%" align="center" alt="our feature film **Eight Down Toofaan Mail**" />  
	<br/>  
</html>    
    
- Trailer for [**Eight Down Toofaan Mail** on YouTube](https://www.youtube.com/watch?v=KthvCCE2Vrk)   
- After a successful awards run and theatrical distribution in India, the film is now on [YouTube (with English Subtitles)](https://www.youtube.com/watch?v=VnHPtozfhRU)      
- Opening day audience reactions [YouTube Shorts](https://www.youtube.com/shorts/X8JeKFUFbU0)    
- Press release from Ministry of Information and Broadcasting, Govt. of India at [IFFI 2021](https://pib.gov.in/PressReleaseIframePage.aspx?PRID=1774084)  
- Full press conference at [IFFI 2021 (YouTube)](https://www.youtube.com/watch?v=emp7znBA_DI)  
  
    
# References  
- [Useful Color Equations](http://www.brucelindbloom.com/index.html?SpectCalcSpreadsheets.html)  
- [Colour-Science](https://www.colour-science.org/) and [GitHub](https://github.com/colour-science/colour)  
- [Awesome Color from Colour-Science](https://github.com/colour-science/awesome-colour)  
  
## Font
- Some presentations use [The Inter typeface family](https://rsms.me/inter/)
  