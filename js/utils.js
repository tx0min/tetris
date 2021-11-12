function esParell(num){ //parell
	return (num%2)==0
}

function al(msg){
	console.log(msg);
}

function  aleatoriEntre(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function  aleatoriArray(arr) {
	return arr[aleatoriEntre(0,arr.length-1)];
}

function lpad(str, length ,padchar) {
	str=str + "";
	if(!padchar) padchar="0";
	// console.log('lpad',str.length);
    while (str.length < length)
        str = padchar + str;
    return str;
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
  }
  

function flipMatrix(matrix){
	var tmp=matrix;
	return tmp[0].map((column, index) => (
		tmp.map(row => row[index])
	));
}

  
function rotateMatrix(matrix, direction){
	var tmp=matrix; 
	if(direction==-1) return rotateMatrixCounterClockwise(tmp);
	else return flipMatrix(tmp.reverse());
}

  
function rotateMatrixCounterClockwise(matrix){
	var tmp=matrix;
	return flipMatrix(tmp).reverse()
}

function getStartingEmptyRows(matrix){
	var padding=0;
	
	for(var row in matrix){
		var colempty=true;
		// console.log(matrix[row]);
		for(var col in matrix[row]){
			// al(matrix[row][col]);
			if(matrix[row][col] != false && matrix[row][col] != 0 && matrix[row][col] != null  ){
				colempty = false;
				break;
			}
		}
		
		if(colempty){
				padding++;
		}else{
			break;
		}
	}
	// console.log(padding);
	return padding;
}

CanvasRenderingContext2D.prototype.fillStrokeText = function(text,x,y) { 
	this.miterLimit=2;
	this.lineJoin="miter";
	this.strokeText(text, x, y);
    this.fillText(text, x, y);
	return this;
}



/** 
 * Draws a rounded rectangle using the current state of the canvas.  
 * If you omit the last three params, it will draw a rectangle  
 * outline with a 5 pixel border radius  
 * @param {Number} x The top left x coordinate 
 * @param {Number} y The top left y coordinate  
 * @param {Number} width The width of the rectangle  
 * @param {Number} height The height of the rectangle 
 * @param {Object} radius All corner radii. Defaults to 0,0,0,0; 
 * @param {Boolean} fill Whether to fill the rectangle. Defaults to false. 
 * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true. 
 */
 CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius, fill, stroke) {
    var cornerRadius = { upperLeft: 0, upperRight: 0, lowerLeft: 0, lowerRight: 0 };
    if (typeof stroke == "undefined") {
        stroke = true;
    }
	if (typeof radius === "object") {
        for (var side in radius) {
            cornerRadius[side] = radius[side];
        }
    }else if (typeof radius !== "undefined"){
		cornerRadius = {
			upperLeft:radius,
			upperRight:radius,
			lowerRight:radius,
			lowerLeft:radius
		};
	}

    this.beginPath();
    this.moveTo(x + cornerRadius.upperLeft, y);
    this.lineTo(x + width - cornerRadius.upperRight, y);
    this.quadraticCurveTo(x + width, y, x + width, y + cornerRadius.upperRight);
    this.lineTo(x + width, y + height - cornerRadius.lowerRight);
    this.quadraticCurveTo(x + width, y + height, x + width - cornerRadius.lowerRight, y + height);
    this.lineTo(x + cornerRadius.lowerLeft, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - cornerRadius.lowerLeft);
    this.lineTo(x, y + cornerRadius.upperLeft);
    this.quadraticCurveTo(x, y, x + cornerRadius.upperLeft, y);
    this.closePath();
    if (stroke) {
        this.stroke();
    }
    if (fill) {
        this.fill();
    }
} 