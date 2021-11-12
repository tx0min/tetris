var TETRIS = {
    tetro_size : 40,
    tetro_radius : 4,
	cols : 10,
    rows : 18,
	fall_speed : 30, // frames (lesses is quicker)
	fall_countdown : 0, // milliseconds
	score : 0,
    score_timer:0,
	start_time : null,
	time : null,
    ready: false,
    sprite : null, 
    img_path: 'img/background.png',
    x: 0,
    y: 0,
    width:10,
    height:10,
    bg_color: 'rgb(192, 215, 219)',
    gamezone_color: 'rgb(235, 240, 241)',
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
    lines_animation_color:'rgb(24, 196, 226)',
    lines_animation_border_color:'rgb(192, 215, 219)',
    lines_pulse:10,
    lines_pulse_counter:0,

    texts_color: '#ffffff',
    texts_border_color: 'rgb(34, 96, 109)',
    dropPressed : false,
    dropReleased : true,


    drawLane : false,
    drawGhost : true,

    music : null,
    fx : [],
    fx_muted:false,

    gamestarted : false,

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
		
      
        
        
       this.loadAudios();   
        

		// Handle keyboard controls
		this.keysDown = {};
		

        this.resetContainer();

        // console.log(this.container);
		addEventListener("keydown", function (e) {
            // console.log(e.keyCode);
            // that.music.play();
            if(!that.gamestarted){
                that.gamestarted=true;
                that.music.play();
            }else{
                let keycode=(e.keyCode || e.which);
        
                that.keysDown[keycode] = true;
                
                
                if(38 == keycode){
                    // console.log('dropPressed',that.dropPressed,'dropReleased', that.dropReleased);
                    if(that.dropReleased){
                        that.dropPressed=true;
                    }else{
                        that.dropPressed=false;

                    }
                    that.dropReleased = false; 
                }
            }
            
		}, false);

		addEventListener("keyup", function (e) {
            let keycode=(e.keyCode || e.which);
            
            // console.log(keycode);            


			delete that.keysDown[keycode];
            
             
            if(38 == keycode){
                that.dropReleased = true; 
                that.dropPressed = false; 
            }
            if(27 == keycode){
                if(that.gamestarted && !that.game_over) that.togglePause();

            }
            if(71 == keycode){ //g
                if(that.gamestarted && !that.game_over)  that.toggleGhostMode();

            }
            if(77 == keycode){ //m
                if(that.gamestarted && !that.game_over)  that.toggleMusic();

            }
            if(78 == keycode){ //n
                if(that.gamestarted && !that.game_over)  that.toggleFx();

            }
		}, false);


	
        
        this.ready = true;

        this.spawnTetro();
        // al(this.game.ctx);


       

    },

    loadAudios: function(){
        var that=this;
        
        this.music= new Howl({
            src: ['audio/tetris-theme.mp3'],
            autoplay: true,
            loop: true,
            volume: 0.5,
        });


        this.fx={
            rotate : new Howl({
                src: ['audio/rotate.mp3']
            }),
            land : new Howl({
                src: ['audio/land.mp3']
            }),
            line : new Howl({
                src: ['audio/line.mp3']
            }),
            move : new Howl({
                src: ['audio/move.mp3']
            }),
            pause : new Howl({
                src: ['audio/pause.mp3']
            }),
            gameover : new Howl({
                src: ['audio/gameover.mp3']
            }),
            tetris : new Howl({
                src: ['audio/tetris.mp3']
            }),
        }

        
    },
    toggleMusic: function(){
        console.log(this.music,this.music.playing());
        this.music.playing() ? this.music.pause() : this.music.play();
    },
    toggleFx: function(){
        this.fx_muted = !this.fx_muted;

    },
    toggleGhostMode: function(){
        if(this.drawGhost){
            this.drawLane =true;
            this.drawGhost =false;
        }else if(this.drawLane){
            this.drawLane =false;
            this.drawGhost =false;
        }else{
            this.drawLane =false;
            this.drawGhost =true;
        }
    },
    playFx: function(name){
        if(!this.fx_muted && this.fx[name]) this.fx[name].play();
    },
    togglePause: function(){
        this.pause = !this.pause; //a
        if(this.pause){
            this.playFx('pause');
            this.music.pause();
        }else{
            this.music.play();
        }
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

        if(this.gamestarted && !this.game_over && !this.pause){

            this.fall_countdown++;
            this.rotateDelayCounter++;
            this.moveDelayCounter++;
            this.fallDelayCounter++;
            
            
            
            // console.log(seconds);
            if(!this.pause ){
                this.score_timer++;
                if(this.dropPressed) this.dropTetro();
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
        // alert('gameOver');
        this.game_over=true;
        this.playFx('gameover');
        this.music.pause();
        clearInterval(this.falltimer);
        // console.log(getStartingEmptyRows(this.container), this.current_tetro.height() , this.current_tetro.padding().bottom);
        // this.current_tetro.position.top = getStartingEmptyRows(this.container) - this.current_tetro.height() - this.current_tetro.padding().bottom;
        // alert('GAMEOVER');
        
    },

    renderWelcome : function(){
        this.ctx.font = "80px Helvetica";
        this.ctx.textAlign="center";
        this.ctx.textBaseline = "middle";
        
        this.ctx.fillStyle = this.texts_border_color;
        // this.ctx.strokeStyle  = this.texts_border_color;
        
        this.ctx.fillText("TETRIS.js" , this.width/2 , this.height /2 - 80);
        
        this.ctx.fillStyle = this.texts_color;
        this.ctx.font = "20px Helvetica";
        this.ctx.fillText("Press any key to start" , this.width/2 , this.height /2 + -20);


        this.ctx.font = "15px Helvetica";
        this.ctx.fillStyle = this.texts_border_color;
        var margin=0;

        this.ctx.fillText("ARROW left/right: Move left/right" , this.width/2 , this.height /2 + 30 + margin);
        this.ctx.fillText("ARROW down: Move down" , this.width/2 , this.height /2 + 50 + margin);
        this.ctx.fillText("ARROW up: Drop" , this.width/2 , this.height /2 + 70 + margin);
        this.ctx.fillText("A/S: Rotate left/right" , this.width/2 , this.height /2 + 90 + margin);
        this.ctx.fillText("G: toggle help mode" , this.width/2 , this.height /2 + 110 + margin);
        this.ctx.fillText("M: toggle music" , this.width/2 , this.height /2 + 130 + margin);
        this.ctx.fillText("N: toggle fx" , this.width/2 , this.height /2 + 150 + margin);
        this.ctx.fillText("ESC: pause" , this.width/2 , this.height /2 + 170 + margin);
        this.ctx.fillText("F5: restart" , this.width/2 , this.height /2 + 190 + margin);

        
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

        // roundRect = function (x, y, width, height, radius, fill, stroke) 
        this.ctx.fillRect(start_x, start_y, this.getGameZoneW(), this.getGameZoneH());
        // this.ctx.roundRect(start_x, start_y, this.getGameZoneW(), this.getGameZoneH(), 10, true, false);
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
                        this.tetro_size,
                        this.tetro_radius
                    );                
                }
            }
        }
        this.ctx.globalAlpha=1;
    },

    renderScoreZone : function(){
        // Score
        let padding=20;

        this.ctx.fillStyle = this.texts_border_color;
        this.ctx.strokeStyle  = this.texts_color;
        this.ctx.lineWidth = 2;
        this.ctx.font = "24px Helvetica";
        this.ctx.textBaseline = "top";
        this.ctx.textAlign="start";

        this.ctx.fillStrokeText("Score" , padding, padding);
        this.ctx.fillStrokeText("Time", padding, 110);
        this.ctx.fillStrokeText("Next" , padding, 200);
        
        this.ctx.fillStyle = this.texts_color;
        this.ctx.strokeStyle  = this.texts_border_color;

        this.ctx.fillStrokeText(this.score, padding, 50);

        
        const seconds = lpad( Math.floor( ((this.score_timer)/60)  ), 5); ///60fps
        this.ctx.fillStrokeText(seconds, padding, 140);

        //pinto el siguiente tetro

        // this.ctx.scale(0.5,0.5);

        this.ctx.fillStyle = this.gamezone_color;
        // this.ctx.globalAlpha=1;
        let tetro_start_x=padding;
        let tetro_start_y=235;
        let tetro_square_width=this.width - this.getGameZoneW() - (tetro_start_x*2);
        let tetro_square_height=100
        this.ctx.lineWidth = 3;
        this.ctx.roundRect(tetro_start_x, tetro_start_y,  tetro_square_width , tetro_square_height, 20, true, true );

        let tmptetro=new Tetro(this.ctx, this.next_tetro_index);
        // tmptetro.pixelWidth(this.tetro_size/2);
        tmptetro.render(
            tetro_start_x + (tetro_square_width - tmptetro.pixelWidth(this.tetro_size/2))/2 , 
            tetro_start_y + (tetro_square_height - tmptetro.pixelHeight(this.tetro_size/2))/2 , 
            this.tetro_size/2,
            this.tetro_radius/2
        );
        // this.ctx.scale(1,1);

    },

    renderTetro : function(){
        if(this.pause) this.ctx.globalAlpha=0.5;
        
        
        if(this.drawLane){
           this.ctx.globalAlpha=0.2;
           let peak=this.current_tetro.getPeak();
           let left=parseInt(this.current_tetro.position.left) + parseInt(peak[0]);
           let right=parseInt(this.current_tetro.position.left) + parseInt(peak[peak.length-1]);
        //    console.log(left, right);
           let x=this.getGameZoneX() + (left*this.tetro_size);
           let w=(right-left+1)*this.tetro_size;
           this.ctx.fillStyle = this.lines_animation_color;
           this.ctx.fillRect(x, this.getGameZoneY(), w, this.getGameZoneH());
           this.ctx.globalAlpha=1;
           
           
        }
        
        if(this.drawGhost){
            let ghost=this.current_tetro.clone();
            while(!this.willCollideV(ghost) && !this.inGround(ghost)){
                ghost.position.top++;
            }
            this.ctx.globalAlpha=0.1;
           
            ghost.render(this.getGameZoneX(), this.getGameZoneY(), this.tetro_size, this.tetro_radius);
            this.ctx.globalAlpha=1;
           
        }


        if(this.current_tetro){
            this.current_tetro.render(this.getGameZoneX(), this.getGameZoneY(), this.tetro_size, this.tetro_radius);
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
            // var wallR=this.collidesH(1);
            // var wallL=this.collidesH(-1);
            let original_position=JSON.parse(JSON.stringify(this.current_tetro.position));

            this.current_tetro.rotate(direction);
            
            this.playFx('rotate');
            var corrected=false;
            // console.log('padding', this.current_tetro.padding());
            if(!this.inBounds()){
                corrected=true;
                if(this.current_tetro.position.left<0){
                    //se sale por la izquierda
                    this.current_tetro.position.left=0; 
                }else{
                    //se sale por la derecha
                    this.current_tetro.position.left = this.cols - this.current_tetro.width() - this.current_tetro.padding().right; 
                }
            }else if(this.inGround()){
                corrected=true;
                this.current_tetro.position.top = this.rows - this.current_tetro.height() - this.current_tetro.padding().bottom; 
            }

            // controlar que se puda rotar en espacios pequeños o tocando una pared
            //y corregir la posicion si se puede
            if(this.collides()){
                var offsetL=this.collidesLeft();
                var offsetR=this.collidesRight();
                if(corrected){
                    //recupero posicion y rotacion original
                    this.current_tetro.rotate(-direction);
                    this.current_tetro.position = original_position;
                }else if(offsetL){
                    this.current_tetro.position.left+=offsetL;
                    if(this.collides() || !this.inBounds() || this.inGround()){
                        //recupero posicion y rotacion original
                        this.current_tetro.rotate(-direction);
                        this.current_tetro.position = original_position;
                    }
                }else if(offsetR){
                    this.current_tetro.position.left-=offsetR;
                    if(this.collides()|| !this.inBounds() || this.inGround()){
                        //recupero posicion y rotacion original
                        this.current_tetro.rotate(-direction);
                        this.current_tetro.position = original_position;
                    }
                    
                }
                
            }

            this.rotateDelayCounter=0;
        }

    },

    inGround : function(tetro){
        if(arguments.length==0) tetro=this.current_tetro;

        return (tetro.position.top + tetro.height()  - tetro.padding().bottom   >= this.rows );
    },

    canFallDown : function(tetro){
        if(arguments.length==0) tetro=this.current_tetro;

        return !this.inGround(tetro) && !this.collides('down',tetro);
    },


    /* dice si colisionará en caso de moverse horizontalmente */
    willCollideH : function(direction,tetro){
        return this.collides((direction==1?'right':'left'),tetro);
    },
    
    /* dice si colisionará en caso de moverse hacia abajo */
    willCollideV : function(tetro){
        return this.collides('down',tetro);
    },

    /** dice si colisiona por la parte izquierda del tetrimino  */
    collisionColumns : function(){
        var collisions=[];
        for(var row in this.current_tetro.tetro.shape){
            for(var col in this.current_tetro.tetro.shape[row]){
                if(this.current_tetro.tetro.shape[row][col]==1){
                    let top= parseInt(this.current_tetro.position.top) + parseInt(row) ;
                    let left = parseInt(this.current_tetro.position.left) + parseInt(col) ;
                    if(top>=0 && top< this.container.length ){
                        if(this.container[top][left] ) collisions.push(parseInt(col));
                    }
                }
            }
        }
        return collisions;
        // console.log('collidesLeft',collisions);
    },
   

     /** dice si colisiona por la parte derecha del tetrimino  */
    collidesRight : function(){
        let points = this.collisionColumns();
        let tmp= Math.max(...points);
        // console.log("right", points, tmp);
        // console.log(points, max);
        if(tmp > this.current_tetro.width()/2){
            return this.current_tetro.width()-tmp;
        }else{
            return false;
        }
    },

    /**
     * devuelve si colisiona por la izquierda. 
     * En caso afirmativo, devuelve el offset necesario para corregir la colision 
     * */
    collidesLeft : function(){
        let points = this.collisionColumns();
        let tmp=Math.max(...points);
        // console.log("left", points, tmp);
        if(tmp <= this.current_tetro.width()/2){
            return tmp+1;
        }else{
            return false;
        }
        // return points.indexOf()
    },

    collides : function(direction, tetro){
        // console.log(arguments.length);
        // console.log(tetro);
        if(arguments.length==1 || !tetro ) tetro=this.current_tetro;

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

        // console.log('collides', tetro.position , this.container);

        for(var row in tetro.tetro.shape){
            for(var col in tetro.tetro.shape[row]){
                if(tetro.tetro.shape[row][col]==1){
                    let top= parseInt(tetro.position.top) + parseInt(row) + offsetv;
                    let left = parseInt(tetro.position.left) + parseInt(col) + offseth;
                    if(top>=0 && top< this.container.length ){
                        if(this.container[top][left] ) return true;
                    }
                }
            }
        }
        return false;
    },

    dropTetro : function(){
        // console.log('dropTetro', tetro);
        var that=this;
        while(!this.willCollideV() && !this.inGround()){
            this.current_tetro.position.top++;
        }
        this.dropPressed=false;
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
                    
                    //play sound
                    this.playFx('land');

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
        if(this.lines.length==4){
            this.playFx('tetris');
        }else{
            this.playFx('line');
        }
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
        if(!this.inBounds(direction) || this.willCollideH(direction)){
            this.moveDelayCounter=0;
            return;
        }
        

        if(this.moveDelayCounter >= this.moveDelay){
            this.current_tetro.position.left += direction ;
            this.moveDelayCounter=0;

            this.playFx('move');
            
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

            if(!this.gamestarted){
                this.renderWelcome();
            }else{

                
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

       

    }




};