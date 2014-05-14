var Config = {
  'fps': 60,
  'minions_per_second': 1,
  'width': function() { return document.getElementById("canvas").width; },
  'height': function() { return document.getElementById("canvas").height; },
  'text_field_height': function() { return (document.getElementById("canvas").height/8); },
  'playingfield_height': function() { return (Config.height() - Config.text_field_height()); }
}

var Wordlist = [
  "Mary",
  "had",
  "little",
  "lamb",
  "whose",
  "fleece",
  "was",
  "white",
  "as",
  "snow",
  "everywhere",
  "that",
  "went",
  "and",
  "the",
  "sure",
  "to",
  "go"
]

var Key = {
  'Backspace': 8,
  'Enter': 13
}



var Textfield = {
  
  'init': function(ctx) {
  
    self.ctx = ctx;
    self.text = '';
  
    document.onkeydown = Textfield.key_up;   
  
  }, //init()
  
  'draw': function() {

    ctx.fillStyle = "rgb(9,21,45)";
    ctx.fillRect (0, Config.playingfield_height(), Config.width(), Config.height());

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.font = "24px 'Arial'";
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(text+'_', Config.width()/2, Config.playingfield_height() + Config.text_field_height()/2 );
    
  }, //draw()

  'key_up': function(event) {
  
    switch(event.keyCode) {
    
      case Key.Enter:
        minionype.check_word(text);
        text = '';
        event.cancelBubble = true;
        event.returnValue = false;
        break;
        
      case Key.Backspace:
        text = text.slice(0,-1);
        event.cancelBubble = true;
        event.returnValue = false;
        break;
        
      default:
        text += String.fromCharCode(event.keyCode);
        
    }//switch
  
    return false;
  
  }//key_up()


}//Textfield



var PlayingField = {

  'init': function(ctx){
  
    self.ctx = ctx;
    self.minions = [];
    
    self.minion_image = new Image(); 
    self.minion_image.src="minion.png";
    
  },//init()
  
  
  'draw': function() {

    PlayingField.draw_background();
    
    
    if (self.minions.length >= 10) {
      minionype.running = false;
    }
    
    //draw the minions
    for(i=0; i < self.minions.length; i++)
      PlayingField.draw_minion( self.minions[i] );
    
    
  },//draw()
  
  'draw_background': function() {
  
    var objGradient = ctx.createRadialGradient(Config.width()/2, (Config.height()-Config.text_field_height()), 50, Config.width()/2, Config.playingfield_height(), Config.width()/2);
    objGradient.addColorStop(0, '#1C2F5C');
    objGradient.addColorStop(1, '#09152D');
    ctx.fillStyle = objGradient;
    ctx.fillRect(0, 0, Config.width(), (Config.height()-Config.text_field_height()));
    
  },//draw_background()
  
  'draw_minion': function(minion) {

      //draw the minion image      
      ctx.drawImage(minion_image,minion.x, minion.y); 

      //draw the minion's text
      ctx.font = "18px 'Arial'";
      ctx.textAlign = 'center';
      
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillText(minion.caption, 1 + minion.x + minion_image.width/2, 1 + minion.y + minion_image.height);
      
      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.fillText(minion.caption, minion.x + minion_image.width/2, minion.y + minion_image.height);
  
  },//draw_minion()


  'draw_fin': function() {
  
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.fillRect(0, 0, Config.width(), Config.height());


    if (Scores.score > 2)
      var fin_text = 'You got ' + Scores.score + ' minions.';
    else if (Scores.score == 1)
      var fin_text = 'You got 1 minion.';
    else
      var fin_text = 'You got no minions. Try again!';

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.font = "24px 'Arial'";
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    ctx.fillText(fin_text, Config.width()/2, Config.height()/2 );
  
  },//draw_fin()


  'add_minion': function(caption) {
    
    minions.push({
      'caption': caption.toUpperCase(),
      'x': Math.random()* (Config.width() - minion_image.width),
      'y': Math.random()* (Config.playingfield_height() - minion_image.height)
    });
    
  },//add_minion()
  
  'remove_minion': function(caption) {
  
    for(i=0; i < minions.length; i++)
      if (minions[i].caption == caption) {
        minions.splice(i,1);
        Scores.add();
      }
  
  }//remove_minion()

}//PlayingField


var Scores = {

  'init': function(ctx) {
    
    self.ctx = ctx;
    Scores.score = 0;    
  
  },//init()
   
  'draw': function() {
  
    if (Scores.score > 0) {

      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.font = "18px 'Arial'";
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'right';
      ctx.fillText(Scores.score + " minions", Config.width()-30, 25 );

    }//if
  
  },//draw()
  
  'add': function() {
    Scores.score++;
  }

}





var minionype = {

  'init': function() {
  
      self.canvas = document.getElementById("canvas");
      minionype.ctx = canvas.getContext("2d");
      
      minionype.running = true;
      
      //maximize in window
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      Textfield.init(minionype.ctx);
      PlayingField.init(minionype.ctx);
      Scores.init(minionype.ctx);
      
      setInterval( minionype.draw, 1000/Config.fps );
      setInterval( minionype.add_minion, 1000/Config.minions_per_second );
      
  },//init()
  
  
  'check_word': function(word) {

    PlayingField.remove_minion(word);
  
  },//check_word()
  
  
  'draw': function() {
      
      //clear canvas
      minionype.ctx.clearRect(0,0,canvas.width,canvas.height); 

      if (!minionype.running) {
      
        PlayingField.draw_fin();
      
      } else {

        Textfield.draw();
        PlayingField.draw();
        Scores.draw();
      }
      
    },//draw()
    
    'add_minion': function() {
    
      var index = Math.floor( Math.random() * Wordlist.length );
      PlayingField.add_minion( Wordlist[index] );
    
    }//add_minion()


}//minionype