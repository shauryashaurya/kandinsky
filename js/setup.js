/* Drawing the image on screen, 
right now it just draws rectangles on screen, 
will be replaced by code to paint the selected photo on the canvas eventually*/
var setup = function(ctx, canvasX, canvasY, canvasW, canvasH)
{
    // from https://github.com/amussey/hex-to-rgb.js/blob/master/hex-to-rgb.js
    function rgbToHex(r, g, b)
    {
        if (g == undefined || b == undefined)
        {
            if (typeof rgb == "string")
            {
                var result = /^rgb[a]?\(([\d]+)[ \n]*,[ \n]*([\d]+)[ \n]*,[ \n]*([\d]+)[ \n]*,?[ \n]*([.\d]+)?[ \n]*\)$/i.exec(rgb);
                return rgbToHex(parseInt(result[1]), parseInt(result[2]), parseInt(result[3]));
            }
            if (rgb.r == undefined || rgb.g == undefined || rgb.b == undefined)
            {
                return null;
            }
            return rgbToHex(rgb.r, rgb.g, rgb.b);
        }
        var r = rgb;

        function componentToHex(c)
        {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    // from https://github.com/amussey/hex-to-rgb.js/blob/master/hex-to-rgb.js
    function hexToRgb(hex, alpha)
    {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        var toString = function()
        {
            if (this.alpha == undefined)
            {
                return "rgb(" + this.r + ", " + this.g + ", " + this.b + ")";
            }
            if (this.alpha > 1)
            {
                this.alpha = 1;
            }
            else if (this.alpha < 0)
            {
                this.alpha = 0;
            }
            return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.alpha + ")";
        }
        if (alpha == undefined)
        {
            return result ?
            {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16),
                toString: toString
            } : null;
        }
        if (alpha > 1)
        {
            alpha = 1;
        }
        else if (alpha < 0)
        {
            alpha = 0;
        }
        return result ?
        {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
            alpha: alpha,
            toString: toString
        } : null;
    }

    // draw rectangle shapes, this will be replaced by image load code later
    /*var colors = {
        "red": "#a74338",
        "blue": "#906cda",
        "orange": "#f26522",
        "yellow": "#edea5b",
        "deep-red": "#610803"
    };*/
    /*var colors = {
        "red": "#ff4338",
        "blue": "#906cff",
        "orange": "#ffff22",
        "yellow": "#ffff5b",
        "deep-red": "#610000"
    };*/
    var colors = [];
    for (var r = 0; r < 256; r++)
    {
        var g = Math.round(255 - r / 2) + Math.round(Math.random() + 50);
        var b = Math.round(255 - r / 3) + Math.round(Math.random() + 50);
        var rs = (r.toString(16).length < 2) ? "0" + r.toString(16) : r.toString(16);
        var gs = (g.toString(16).length < 2) ? "0" + g.toString(16) : g.toString(16);
        var bs = (b.toString(16).length < 2) ? "0" + b.toString(16) : b.toString(16);
        colors.push("#" + rs + gs + bs);
    }

    var rectCount = 0;
    // draw the horizontal bars...
    for (var cCounter = 0; cCounter<colors.length; cCounter++)
    {
    console.log("colors[cCounter] = ", colors[cCounter]);
        fillStyleString = colors[cCounter];
        ctx.fillStyle = fillStyleString;
        rectCount++;
        //move top to bottom, paint 50 rectangles, y is the top edge so rectCount-1
        ctx.fillRect(0, (rectCount - 1) * (canvasH / colors.length), canvasW, rectCount * (canvasH / colors.length));
    }
    // first try with 5 colours, then uncomment below to have 25 colours
    /*//reset rectCount before drawing...
    rectCount = 0;
    // the vertical bars.
    for (var color in colors)
    {
        fillStyleString = hexToRgb(colors[color], .5).toString();
        ctx.fillStyle = fillStyleString;
        rectCount++;
        //move left to right, paint 5 rectangles, x is the left edge so rectCount-1
        ctx.fillRect((rectCount-1)*(canvasW/5),0,rectCount*(canvasW/5),canvasH);
    }*/
    // we should now have 25 colours on the screen.
    return ctx;
}
