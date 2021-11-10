var TETRIS = {
    tetro_size : 45,
	cols : 10,
    rows : 18,
	fall_speed : 60, // frames
	fall_countdown : 0, // milliseconds
	score : 0,
	start_time : null,
	time : null,
    ready: false,
    sprite : null, 
    img_path: 'img/background.png',
    x: 0,
    y: 0,
    width:10,
    height:10,
    bg_color: '#cccccc',
    gamezone_color: '#efefef',
    current_tetro: null,
    next_tetro_index: null,

    container : null, 
    falltimer : null,
    game_over:false,
    pause:false,

    rotateDelayCounter:60,
    rotateDelay:10,
    
    moveDelayCounter:60,
    moveDelay:5,

    fallDelayCounter:30,
    fallDelay:5,
    
    lines: [],
    lines_animation:false,
    lines_animation_counter:0,
    lines_animation_duration:40,
    lines_animation_color:'#F94144',
    lines_animation_border_color:'#c73537',
    lines_pulse:10,
    lines_pulse_counter:0,

    texts_color: '#ffffff',
    texts_border_color: '#666666',
    
    create: function(){
        var that=this;
        
 		// Create the canvas
		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext("2d");
		this.canvas.width = (this.cols *3/2 )  * this.tetro_size ;
		this.canvas.height = this.rows * this.tetro_size;
		this.start_time=Date.now();
		this.time=this.start_time;

        this.width = this.canvas.width;
        this.height = this.canvas.height;

		document.body.appendChild(this.canvas);

		

		// Handle keyboard controls
		this.keysDown = {};
		
        this.resetContainer();
        // console.log(this.container);
		addEventListener("keydown", function (e) {
            // console.log(e.keyCode);
			that.keysDown[e.keyCode || e.which] = true;
		}, false);

		addEventListener("keyup", function (e) {
			delete that.keysDown[e.keyCode || e.which];
            // console
            
            if(27 == (e.keyCode || e.which)) that.pause = !that.pause; //a
		}, false);


	
        
        this.ready = true;

        this.spawnTetro();
        // al(this.game.ctx);


       

    },

    resetContainer: function(){
        this.container = [];
        for(var i=0;i<this.rows;i++){
            this.container[i]=this.newcontainerRow();
        }
    },
    newcontainerRow: function(){
        var ret=[];
        for(var i=0;i<this.cols;i++){
            ret[i]=false;
        }
        return ret;
    },

    update: function(modifier){
        var that=this;
        this.time = Date.now();
        if(!this.game_over && !this.pause){
            

            this.fall_countdown++;
            this.rotateDelayCounter++;
            this.moveDelayCounter++;
            this.fallDelayCounter++;
            
           
            
            // console.log(seconds);
            if(!this.pause ){
                if(38 in this.keysDown) this.dropTetro();
                if(39 in this.keysDown) this.moveTetro(1);
                if(37 in this.keysDown) this.moveTetro(-1);
                if(40 in this.keysDown  ){
                    this.moveDownTetro();
                    this.fall_countdown = 0;
                }

                
                if(83 in this.keysDown) this.rotateTetro(1);
                if(65 in this.keysDown) this.rotateTetro(-1);
                if(this.lines_animation){
                    this.linesAnimation();
                }else{
                    this.clearLines();
                    this.fallDownTetro();
                }

            }
            
        }
    },

    spawnTetro : function(){
        if(this.next_tetro_index!==null){
            this.current_tetro = new Tetro(this.ctx,  this.next_tetro_index);
            // console.log()
        }else{
            this.current_tetro = new Tetro(this.ctx );
        }
        // al(this.game.cols / 2, this.current_tetro.width());
        this.current_tetro.position = { 
            left:  Math.floor( (this.cols / 2) -  this.current_tetro.width()/2 ) , 
            top: -(this.current_tetro.height() - this.current_tetro.padding().top )
        };

        // console.log('spawnTetro');
        this.next_tetro_index = getRandomInt(0,TETROS.length);
        

        
        

        
        //al(this.inBounds());
        // al(this.current_tetro);
    },

    gameOver : function(){
        this.game_over=true;
        clearInterval(this.falltimer);
        // console.log(getStartingEmptyRows(this.container), this.current_tetro.height() , this.current_tetro.padding().bottom);
        // this.current_tetro.position.top = getStartingEmptyRows(this.container) - this.current_tetro.height() - this.current_tetro.padding().bottom;
        // alert('GAMEOVER');
        
    },

    renderLinesAnimation : function(){
        // console.log('renderLinesAnimation');
        this.ctx.fillStyle =  this.lines_animation_color;
        this.ctx.strokeStyle =  this.lines_animation_border_color;

        this.ctx.globalAlpha = this.lines_pulse_counter / this.lines_pulse;
        this.ctx.lineWidth = this.ctx.globalAlpha*15;
        // console.log(this.ctx.lineWidth);

        let start_x=this.getGameZoneX();
        let start_y=this.getGameZoneY();

        for(var i in this.line_blocks){
            var start_row=this.line_blocks[i][0];
            var last_row=this.line_blocks[i][this.line_blocks[i].length-1];
            let options=[
                start_x,
                start_y + (start_row * this.tetro_size),
                this.tetro_size * this.cols,
                this.line_blocks[i].length * this.tetro_size
            ]
            this.ctx.fillRect( options[0], options[1], options[2],options[3] );
            this.ctx.strokeRect( options[0], options[1], options[2],options[3]);

        }
        this.ctx.globalAlpha = 1;
        this.ctx.lineWidth = 1;

        this.ctx.textAlign="center";
        this.ctx.textBaseline = "middle";
        
        this.ctx.fillStyle = this.texts_color;
        this.ctx.strokeStyle  = this.texts_border_color;
        
        // console.log(this.lines.length);
        let text=this.lines.length + " LINES";
        
        let fontsize=(15 + (this.lines_animation_counter / this.lines_animation_duration)*10) ;
        this.ctx.lineWidth = 3;
        
        if(this.lines.length==1){
            text="LINE";
        }else if(this.lines.length==4){
            fontsize=(40 + (this.lines_animation_counter / this.lines_animation_duration)*20) ;
            text="TETRIS";
            this.ctx.lineWidth = 5;
        
        }
        this.ctx.font = fontsize +"px Helvetica";
        
        this.ctx.fillStrokeText(text , start_x + ((this.width-start_x) /2) , this.height /2);
        


    },

    renderGamezone : function(){
        this.ctx.fillStyle = this.gamezone_color;
        // this.ctx.globalAlpha=1;
        let start_x=this.getGameZoneX();
        let start_y=this.getGameZoneY();
        this.ctx.fillRect(start_x, start_y, this.getGameZoneW(), this.getGameZoneH());
    },
    
    
    renderContainer : function(){
        let start_x=this.getGameZoneX();
        let start_y=this.getGameZoneY();
        if(this.pause) this.ctx.globalAlpha=0.5;
        // else this.ctx.globalAlpha=1;
        //primero hago la cuadricula
        for (var row  in this.container) {
            for (var col  in this.container[row]){
                let options=[
                    start_x + (col * this.tetro_size) , 
                    start_y +  (row * this.tetro_size) , 
                    this.tetro_size, 
                    this.tetro_size 
                ];

                
                if(!this.container[row][col]){
                    
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeStyle = '#e6e6e6';
                    this.ctx.strokeRect( options[0], options[1], options[2],options[3]);
                }
            }
        }


        for (var row  in this.container) {
            for (var col  in this.container[row]){
                let options=[
                    start_x + (col * this.tetro_size) , 
                    start_y +  (row * this.tetro_size) , 
                    this.tetro_size, 
                    this.tetro_size 
                ];

                
                if(this.container[row][col]){
                    Tetro.renderTetroSquare(
                        this.ctx, 
                        this.container[row][col],
                        start_x + (col * this.tetro_size),
                        start_y +  (row * this.tetro_size) , 
                        this.tetro_size
                    );                
                }
            }
        }
        this.ctx.globalAlpha=1;
    },

    renderScoreZone : function(){
        // Score
        this.ctx.fillStyle = this.texts_border_color;
        this.ctx.strokeStyle  = this.texts_color;
        this.ctx.lineWidth = 2;
        this.ctx.font = "24px Helvetica";
        this.ctx.textBaseline = "top";
        this.ctx.textAlign="start";

        this.ctx.fillStrokeText("Score" , 10, 10);
        this.ctx.fillStrokeText("Time", 10, 100);

        this.ctx.fillStyle = this.texts_color;
        this.ctx.strokeStyle  = this.texts_border_color;

        this.ctx.fillStrokeText(this.score, 10, 40);

        // console.log(this.timer);
        
        const seconds = lpad( Math.floor( ((this.time - this.start_time)/1000)  ), 5);
        this.ctx.fillStrokeText(seconds, 10, 130);

        //pinto la siguiente
        // this.ctx.scale(0.5,0.5);
        let tmptetro=new Tetro(this.ctx, this.next_tetro_index);
        if(tmptetro.tetro === this.current_tetro.tetro){
            console.log(tmptetro.tetro);
        }
        tmptetro.render(50, 200, this.tetro_size/2);
        // this.ctx.scale(1,1);

    },

    renderTetro : function(){
        if(this.pause) this.ctx.globalAlpha=0.5;
        if(this.current_tetro){
            this.current_tetro.render(this.getGameZoneX(), this.getGameZoneY(), this.tetro_size);
        }
        this.ctx.globalAlpha=1;
    },
    renderGameover : function(){
        this.ctx.fillStyle = this.texts_color;
        this.ctx.strokeStyle  = this.texts_border_color;
        this.ctx.lineWidth = 5;

        this.ctx.font = "28px Helvetica";
        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "middle";
        this.ctx.textAlign="center";
        let start_x=this.getGameZoneX();

        // fillStrokeText(this.ctx, )
        this.ctx.fillStrokeText("GAME OVER" , start_x + ((this.width-start_x) /2) , this.height /2 );
            
    },
    renderPause : function(){
        this.ctx.fillStyle = this.texts_color;
        this.ctx.strokeStyle  = this.texts_border_color;
        this.ctx.lineWidth = 5;
        this.ctx.font = "24px Helvetica";
        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "top";
        this.ctx.textBaseline = "middle";
        this.ctx.textAlign="center";
        let start_x=this.getGameZoneX();

        
        this.ctx.fillStrokeText("PAUSED" , start_x + ((this.width-start_x) /2) , this.height /2 );
    
    },

    
    
    rotateTetro : function(direction){
        var that=this;
        if(this.rotateDelayCounter >= this.rotateDelay){
            var wallR=this.collidesH(1);
            var wallL=this.collidesH(-1);


            this.current_tetro.rotate(direction);
            
            //TODO, controlar que se puda rotar en espacios pequeños o tocando una paren
            //y corregir la posicion si se puede


            // if(this.collides()){
            //     let original_x= this.current_tetro.position.left;
    
            //     if(wallR && wallL){
            //         //no permito rotar si colisiona por los dos lados
            //         this.current_tetro.rotate(-direction);
            //     }else if(wallR){
            //         //lo desplazo a la izquierda mientras colisione
            //         // this.current_tetro.position.left--;
            //         while(this.collides()){
            //             this.current_tetro.position.left--;
            //         }
            //         if(this.current_tetro.position.left<0){
            //             //recupero la posicion original, no puedo girar
            //             this.current_tetro.position.left=original_x;
            //             this.current_tetro.rotate(-direction);
            //         }
            //     }else if(wallL ){
            //         let original_x= this.current_tetro.position.left;
            //         //lo desplazo a la derecha mientras colisione
            //         // this.current_tetro.position.left++;
            //         while(this.collides()){
            //             this.current_tetro.position.left++;
            //         }
            //         if(this.current_tetro.position.left<0){
            //             //recupero la posicion original, no puedo girar
            //             this.current_tetro.position.left=original_x;
            //             this.current_tetro.rotate(-direction);
            //         }
            //     }else{
    
            //     }
            // }
            
            // console.log('padding', this.current_tetro.padding());
            if(!this.inBounds()){
                if(this.current_tetro.position.left<0){
                    //se sale por la izquierda
                    this.current_tetro.position.left=0; 
                }else{
                    //se sale por la derecha
                    this.current_tetro.position.left = this.cols - this.current_tetro.width() - this.current_tetro.padding().right; 
                }
            }else if(this.inGround()){
                this.current_tetro.position.top = this.rows - this.current_tetro.height() - this.current_tetro.padding().bottom; 

            }
            

            this.rotateDelayCounter=0;
        }

    },

    inGround : function(){
        return (this.current_tetro.position.top + this.current_tetro.height()  - this.current_tetro.padding().bottom   >= this.rows );
    },

    canFallDown : function(){
        return !this.inGround() && !this.collides('down');
    },


    collidesH : function(direction){
        return this.collides(direction==1?'right':'left');
    },
    
    collidesV : function(){
        return this.collides('down');
    },

    collides : function(direction){
        var offsetv=0;
        var offseth=0;
        if(direction){
            if(direction=='down'){
                offsetv=1;
            }else if(direction=='right'){
                offseth=1;
            }else if(direction=='left'){
                offseth=-1;
            }
        }

        // console.log('collides', this.current_tetro.position , this.container);

        for(var row in this.current_tetro.tetro.shape){
            for(var col in this.current_tetro.tetro.shape[row]){
                if(this.current_tetro.tetro.shape[row][col]==1){
                    let top= parseInt(this.current_tetro.position.top) + parseInt(row) + offsetv;
                    let left = parseInt(this.current_tetro.position.left) + parseInt(col) + offseth;
                    if(top>=0){
                        if(this.container[top][left] ) return true;
                    }
                }
            }
        }
        return false;
    },

    dropTetro : function(){
        var that=this;

    },

    moveDownTetro : function(){
        var that=this;
        
        if(this.fallDelayCounter >= this.fallDelay){
            
            if(!this.canFallDown() ){
                if(this.current_tetro.position.top < 0){
                    this.gameOver();
                }else{
                    //set in container
                    this.fixTetro();
                    
                    //check for lines

                    if( this.checkForLines()){
                        this.startLinesAnimation();
                        
                    }else{
                        //spawn another tetro
                        this.spawnTetro();
                    }
                }

            }else{
                this.current_tetro.position.top += 1 ;
            }
            this.fallDelayCounter = 0;          
        }

    },

    fallDownTetro : function(){
        if(this.fall_countdown >= this.fall_speed){
            this.moveDownTetro();
            this.fall_countdown = 0;
        }
    },
    fixTetro: function(){

        for(var row in this.current_tetro.tetro.shape){
            for(var col in this.current_tetro.tetro.shape[row]){
                if(this.current_tetro.tetro.shape[row][col]==1){
                    let top= parseInt(this.current_tetro.position.top) + parseInt(row);
                    let left = parseInt(this.current_tetro.position.left) + parseInt(col);
                    if(top>=0){
                        this.container[top][left] = {
                            bg: this.current_tetro.tetro.bg,
                            border: this.current_tetro.tetro.border
                        };
                    }
                }
            }
        }
        // console.log(this.container);
    },

    log : function(obj){
        console.log(JSON.parse(JSON.stringify(obj)));
    },

    startLinesAnimation : function(){
        this.lines_animation = true;
// console.log('startLinesAnimation');
        this.line_blocks=[];
        var prev=-1;
        blocksindex=0;
        for(var i in this.lines){
            let row=this.lines[i];
            if(i==0 || row==(parseInt(prev)+1)){
                if(!this.line_blocks[blocksindex]) this.line_blocks[blocksindex]=[];
                this.line_blocks[blocksindex].push(row);
            }else{
                blocksindex++;
                if(!this.line_blocks[blocksindex]) this.line_blocks[blocksindex]=[];
                this.line_blocks[blocksindex].push(row);
            }
            prev=row;

        }
        // console.log(this.line_blocks);

        
    },
    linesAnimation : function(){
        if( this.lines_animation && this.lines.length  ) {
            // console.log('linesAnimation', this.lines_animation_counter);
            this.lines_animation_counter++;
            this.lines_pulse_counter++;
            
            if(this.lines_pulse_counter >= this.lines_pulse){
                this.lines_pulse_counter=0;
            }
            if(this.lines_animation_counter >= this.lines_animation_duration){
                this.lines_animation=false;
                this.lines_animation_counter=0;
                this.spawnTetro();
            }
        }
    },

    clearLines : function(){
       
        if(this.lines.length > 0 && !this.lines_animation){
            // console.log("CLEARING" , this.lines);
            if(this.lines.length==4) this.score += (this.lines.length *2) ; // los tetris valen doble
            else this.score += this.lines.length;

            // this.log(this.container);

            for(var i in this.lines){
                this.container.splice(this.lines[i],1);
                this.container.unshift(this.newcontainerRow()); //añado linea vacia arriba del todo
            }
            this.lines=[];
        }
    },

    checkForLines : function(){
        
        this.lines=[];
        for(var row in this.container){
            var numcols=0;
            for(var col in this.container[row]){
                if(this.container[row][col]) numcols++
            }
            if(numcols==this.container[row].length) this.lines.push(parseInt(row));
        }

      
        return this.lines.length>0;

    },

    inBounds : function(direction){
        var padding=this.current_tetro.padding();
        var newpos=this.current_tetro.position.left;
        if(direction) newpos+= direction;

        if(newpos + padding.left < 0) return false;
        if(newpos - padding.right + this.current_tetro.width()   >  this.cols ) return false;
        return true;
        
    },



    moveTetro : function(direction){
        // al(this.current_tetro.width());
        var that=this;
        if(!this.inBounds(direction) || this.collidesH(direction)){
            this.moveDelayCounter=0;
            return;
        }
        

        if(this.moveDelayCounter >= this.moveDelay){
            this.current_tetro.position.left += direction ;
            this.moveDelayCounter=0;
            
        }
    
    },
    
    getGameZoneW : function(){ return this.cols * this.tetro_size; },
    getGameZoneH : function(){ return this.rows * this.tetro_size; },
    getGameZoneX : function(){ return this.width/3; },
    getGameZoneY : function(){ return 0; },
    getTetroXY : function(){
        return [
            this.getGameZoneX() + (this.current_tetro.position.left * this.tetro_size),
            this.getGameZoneY() + (this.current_tetro.position.top * this.tetro_size),
        ];
    },
    render : function(){
        if (this.ready) {

            //BG
            this.ctx.fillStyle = this.bg_color;
            this.ctx.fillRect(0, 0, this.width, this.height);

			
            this.renderGamezone();
            this.renderContainer();
            this.renderScoreZone();
            this.renderTetro();
            
            if(this.lines_animation){
                this.renderLinesAnimation();
            }
            if(this.game_over){
                this.renderGameover();
            }else if(this.pause){
                this.renderPause();
                
            }
		}

       

    }




};