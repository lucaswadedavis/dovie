$(document).ready(function(){
    app.c.init();
});

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////

var app={};
app.m={};
app.v={};
app.c={};
app.t={};

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////

app.m.bounds=false;
app.m.paper=false;
app.m.dateOffset=0;
app.m.globalAnimationLock=false;
app.m.selectedDate=new Date();
app.m.appName="Dovie";

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////begin controllers

app.c.init=function(){
  app.v.init();  
  app.v.listeners();
};

///////////////////////////////////////////////////////end controllers
///////////////////////////////////////////////////////begin views

app.v.init=function(){
    //app.m.bounds=app.v.initBounds();
    zi.css();
    $("body").html(app.t.layout() );
    app.m.paper=app.v.initPaper();
    app.v.initialReveal();
};

app.v.initBounds=function(){
	var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
  var b={};
  b.right=x-20;
  b.left=0;
  b.top=0;
  b.bottom=y;
  b.centerX=b.right/2;
  b.centerY=b.bottom/2;
  b.width=b.right-b.left;
  b.height=b.bottom-b.top;

  return b;
};


app.v.initialReveal=function(){
};

app.v.drawDoveBadge=function(hwid){
  hwid = hwid || "0C03";
  var chnc = new Chance(hwid);
  //var chnc=new Chance();
  paper.project.clear();
  var strokeWidth=1;
  var strokeColor="#fff";
	var circle=function(x,y,r){
		var path = new paper.Path.Circle({
    	//center: paper.view.center,
    	center:[x,y],
    	radius: r,
    	strokeColor:strokeColor,
    	strokeWidth:strokeWidth
    });
		  
	};
	
	var diamond=function(x,y,l,w1,w2){
    var p=new paper.Path;
    p.strokeColor=strokeColor;
    p.strokeWidth=strokeWidth;
    p.add([x,y]);
    p.add([x+(l/2),y-(l/2)]);
    p.add([x+l,y]);
    p.add([x+(l/2),y+(l/2)]);
    p.add([x,y]);
    return p;
	};
	
	var petal=function(x,y,l,w1,w2){
    var p=new paper.Path;
    var w1=w1||2;
    p.add([x+l,y]);
    p.add(new paper.Segment(
      new paper.Point([x,y]),
      new paper.Point([0,-l/w1]),
      new paper.Point([0,l/w1])
      )
    );
    p.add([x+l,y]);
    p.strokeColor=strokeColor;
    p.strokeWidth=strokeWidth;
    return p;
	};

   ngon=function(x,y,r,n){
    if (!n){n=3};
    // var path="";
    // path+="M "+geo.getPoint(x,y,r,0).x2+" "+geo.getPoint(x,y,r,0).y2;
    var initialPoint = geo.getPoint(x,y,r,90);
    var p = new paper.Path;
    p.add([initialPoint.x2, initialPoint.y2]);
    var interval=360/n;
    for (var i=0;i<n;i++){
        var theta=(interval*i)+90;
        var innerX = geo.getPoint(x,y,r,theta).x2;
        var innerY = geo.getPoint(x,y,r,theta).y2;
        // path+=" L"+geo.getPoint(x,y,r,theta).x2+" "+geo.getPoint(x,y,r,theta).y2;
        p.add(new paper.Segment(
            new paper.Point([innerX, innerY])
        ));
    }   

    p.add(new paper.Segment(
        new paper.Point([initialPoint.x2, initialPoint.y2])
        ));
    // path+="Z";
    // var ngon=model.paper.path(path).attr({"stroke":"#fff"});
    //return ngon;
    p.strokeColor = strokeColor;
    p.strokeWidth = strokeWidth;
    };



  ngon(paper.view.bounds.centerX, paper.view.bounds.centerY,0.5* paper.view.bounds.centerX, 6);


  var orbits=24;
  var r=0;
  var planets=60;
  var theta_interval=360/planets;
  var interval=(Math.min(paper.view.bounds.width,paper.view.bounds.height)-60)/(2*24);
  for (var i=0;i<orbits;i++){
    r+=interval;
    //var planetRadius=chnc.integer({min:2,max:30});
    var planetRadius=chnc.integer({min:Math.max(1,interval/10),max:Math.max(1,interval*2)});
    var w1=chnc.integer({min:Math.max(1,interval/10),max:Math.max(1,interval/2)});
    var ringType=chnc.pick(["petal","petal","circle","diamond"]);
    for (var j=0;j<planets;j++){
      var theta=j*theta_interval;
      var position=geo.getPoint(paper.view.bounds.centerX,paper.view.bounds.centerY,r,theta);
      if (ringType=="circle"){
        circle(position.x2,position.y2,planetRadius);   
      }else if (ringType=="diamond"){
        diamond(
          paper.view.bounds.centerX+r,
          paper.view.bounds.centerY,
          planetRadius,
          w1
          ).rotate(theta,paper.view.center);
        
      }else{
        petal(
          paper.view.bounds.centerX+r,
          paper.view.bounds.centerY,
          planetRadius,
          w1
          ).rotate(theta,paper.view.center);
      }            
    }
  }


	paper.view.draw();
};

app.v.initPaper=function(){
  var canvas = document.getElementById('paper');
	paper.setup(canvas);
	app.v.drawDoveBadge();
	paper.view.onResize=function(event){
	  app.v.drawDoveBadge();
	  paper.view.draw();
	};
};

app.v.listeners=function(){
  document.getElementsByClassName("code-input")[0].addEventListener("keyup",function(){
        var code = document.getElementsByClassName("code-input")[0].value;
        app.v.drawDoveBadge(code);
  });
};

///////////////////////////////////////////////////////end views
///////////////////////////////////////////////////////begin templates

app.t.layout=function(){
  var d="";
  d+="<div class='central'><canvas id='paper' data-paper-resize='true' data-paper-keepalive='true'></canvas></div>";
  d+="<div class='central'><input class='code-input' placeholder='enter dove id' type='text'></input></div>";
  return d;
};

///////////////////////////////////////////////////////end templates
///////////////////////////////////////////////////////begin css

zi={};
zi.config=function(){
    var css={
      "body":{
        "font-family":"sans-serif",
        "padding":"0",
        "margin":"0",
        "border":"0",
        "background":"#555"
      },
      "canvas":{
        "margin":"0",
        "padding":"0",
        "border":"0",
        "width":"600px"
      },
      "div.central":{
        "width":"600px",
        "margin":"10px auto 0px auto",
        "z-index":"0"
      },
      "input[type=text]":{
        "font-size":"3em",
        "width":"100%"
      }
    };
    return css;
};
zi.transform=function(css){
    var c="";
    for (var selector in css){
        c+=selector+"{";
        for (var property in css[selector]){
            c+=property+" : "+css[selector][property]+";";
        }
        c+="}";
    }
    return c;
};
zi.css=function(){
    if ($("head#zi").length<1){
        $("head").append("<style type='text/css' id='zi'></style>");
    }
    $("head style#zi").html( this.transform( this.config() ) );
};
/////////////////////////////////////////////////////// end css section
///////////////////////////////////////////////////////
