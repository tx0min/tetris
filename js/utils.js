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
