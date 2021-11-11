var TETROS  = [
    {
        bg : '#F94144',
        border : '#c73537',
        shape: [
            [0,1,0],
            [0,1,0],
            [1,1,0]
        ],
    },
    {
        bg : '#F3722C',
        border : '#c56633',
        shape:[
            [0,1,0],
            [0,1,0],
            [0,1,1]
        ],
    },
    {
        bg : '#F9C74F',
        border : '#c9a043',
        shape:[
            [1,1],
            [1,1]
        ],
    },
    {
        bg : '#90BE6D',
        border : '#6d9c49',
        shape:[
            [0,1,0],
            [1,1,1],
            [0,0,0]
        ],
    },
    {
        bg : '#4D908E',
        border : '#367a78',
        shape:[
            [0,1,0],
            [0,1,0],
            [0,1,0],
            [0,1,0]
        ],
    },
    {
        bg : '#577590',
        border : '#3b5974',
        shape:[
            [1,0,0],
            [1,1,0],
            [0,1,0]
        ],
    },
    {
        bg : '#277DA1',
        border : '#215b74',
        shape:[
            [0,0,1],
            [0,1,1],
            [0,1,0]
        ]
    }
];

var COLORS  = [
    
]

var Tetro = class {
    
    constructor(ctx, index) {
        this.ctx=ctx;
        //   this.size=size;
        if(arguments.length>1){
            this.tetro=TETROS[index];
        }else{
            this.tetro=TETROS[getRandomInt(0,TETROS.length)];
        }
        this.tetro=JSON.parse(JSON.stringify(this.tetro));
        this.position = {
            left:0,
            top:0
        };
    }

    static renderTetroSquare(ctx, tetro, x, y, size){
        ctx.lineWidth = size/10;
        ctx.fillStyle = tetro.bg;
        ctx.strokeStyle = tetro.border;

        let options=[
            x , 
            y , 
            size, 
            size 
        ];
        // console.log(options, ctx.lineWidth);

        ctx.fillRect( options[0], options[1], options[2],options[3]);
        ctx.strokeRect( options[0] + ctx.lineWidth /2 , options[1] + ctx.lineWidth/2 , options[2] - (ctx.lineWidth),options[3] - (ctx.lineWidth));

    }
    static renderTetro(ctx, tetro, x, y, size){
      
        for(var i in tetro.shape){
            for(var j in tetro.shape[i]){
                if(tetro.shape[i][j]==1){
                    
                    Tetro.renderTetroSquare(
                        ctx, 
                        tetro, 
                        x + (parseInt(j) * size), 
                        y + (parseInt(i) * size), 
                        size
                    );

                }
            }

        }

    }


    render(start_x, start_y, size){
        Tetro.renderTetro(
            this.ctx, 
            this.tetro, 
            start_x + (parseInt(this.position.left) * size), 
            start_y + (parseInt(this.position.top) * size), 
            size
        );
        
        
        
    }

    clone(){
        var ret=new Tetro();
        ret.tetro={
            bg :  this.tetro.bg,
            border : this.tetro.border,
            shape: this.tetro.shape,
        };

        ret.ctx=this.ctx;

        ret.position={
            left: this.position.left,
            top: this.position.top,
        };
        return ret;
    }
    padding(){
        return {
            top: this.getShapePaddingTop(),
            right: this.getShapePaddingRight(),
            bottom: this.getShapePaddingBottom(),
            left: this.getShapePaddingLeft()
        };
    }

    getShapePaddingRight(){
        var padding=99;
        var matrix=this.tetro.shape;
        
        for(var row in matrix){
            var rowpadding=0;
            for(var col =  matrix[row].length-1 ; col>=0; col--){
                if(matrix[row][col] == 0 ) rowpadding++;
                if(matrix[row][col] == 1 ) break;
                    
            }
            if(rowpadding<padding) padding=rowpadding;
        }
        return padding;
    }

    getShapePaddingBottom(){
        var padding=0;
        var matrix=this.tetro.shape;
       
        for(var row =  matrix.length-1 ; row>=0; row--){
            var colempty=true;
            // console.log(matrix[row]);
            for(var col in matrix[row]){
                // al(matrix[row][col]);
                if(matrix[row][col] == 1 ){
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

    getShapePaddingTop(){
        var matrix=this.tetro.shape;
        return getStartingEmptyRows(matrix);
        
    }

    getShapePaddingLeft(){
        var padding=99;
        var matrix=this.tetro.shape;
        // al(this.tetro.shape);
        for(var row in matrix){
            var rowpadding=0;
            // al(matrix[row]);
            for(var col in matrix[row]){
                if(matrix[row][col] == 0 ) rowpadding++;
                if(matrix[row][col] == 1 ) break;
                    
            }
            if(rowpadding<padding) padding=rowpadding;
            // else if(rowpadding==0) padding=0;
        }
        // console.log(padding);
        return padding;
    }

    height(){
        return this.tetro.shape.length;
        // var ret=0;
        // for(var i in this.tetro.shape){
        //     if(this.tetro.shape[i] ==1 ) ret++;
        // }
        // return ret;
    }

    width(){
        return this.tetro.shape[0].length;

        // var ret=1;
        // for(var i in this.tetro.shape){
        //     var hl=0;
        //     for(var j in this.tetro.shape[i]){
        //         if(this.tetro.shape[i][j] ==1 ) hl++;
        //     }
        //     if(hl>ret) ret=hl;
        // }
        // // console.log(ret);
        // return ret;
    }

    innerWidth(){
        var paddings=this.padding();
        let ret= this.width() - paddings.left - paddings.right;
        // console.log(this.width() +"-"+ paddings.left +"-"+  paddings.right+ "="+ ret);
        return ret;
        // console.log(ret)
    }
    innerHeight(){
        var paddings=this.padding();
        return this.height() - paddings.top - paddings.bottom;
    }
    pixelWidth(size, inner){
        // console.log(this.innerWidth());
        let ret;
        if(arguments.length>1 && inner)
            ret= size * this.innerWidth();
        else
            ret= size * this.width();
       
        return ret;
    }
    pixelHeight(size, inner){
        let ret;
        if(arguments.length>1 && inner)
            ret= size * this.innerHeight();
        else
            ret= size * this.height();
       
        return ret;
    }

   
    rotate(direction){
        this.tetro.shape=rotateMatrix(this.tetro.shape, direction);
    }
    
    getPeak(){
        let peak=[];
        let lastRow=this.tetro.shape[this.height()- this.padding().bottom - 1];

        for(let col in lastRow){
            if(lastRow[col]) peak.push(col);
        }
        return peak;
    }
    

    
}

	
