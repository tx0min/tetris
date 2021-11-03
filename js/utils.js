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
