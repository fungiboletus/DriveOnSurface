// var vectors = require('./vendor/gamejs/vectors'),
	// math = require('./vendor/gamejs/math'),
var	box2d = require('./vendor/Box2dWeb-2.1.a.3'),
	Car = require('./car'),
	BoxProp = require('./boxprop');


var WIDTH_PX=1024;   //screen width in pixels
var HEIGHT_PX=768; //screen height in pixels
var SCALE=20;      //how many pixels in a meter
var WIDTH_M=WIDTH_PX/SCALE; //world width in meters. for this example, world is as large as the screen
var HEIGHT_M=HEIGHT_PX/SCALE; //world height in meters
var KEYS_DOWN={}; //keep track of what keys are held down by the player
var b2world;

module.exports = function(canvas) {
    //SET UP B2WORLD
    b2world=new box2d.b2World(new box2d.b2Vec2(0, 0), false);
    global.b2world = b2world;

    //set up box2d debug draw to draw the bodies for us.
    //in a real game, car will propably be drawn as a sprite rotated by the car's angle
    var debugDraw = new box2d.b2DebugDraw();
    debugDraw.SetSprite(canvas.getContext("2d"));
    debugDraw.SetDrawScale(SCALE);
    debugDraw.SetFillAlpha(0.5);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(box2d.b2DebugDraw.e_shapeBit);
    b2world.SetDebugDraw(debugDraw);

    console.log(Car);

    //initialize car
    var car=new Car({'width':2,
                    'length':4,
                    'position':[10, 10],
                    'angle':180, 
                    'power':60,
                    'max_steer_angle':42,
                    'max_speed':60,
                    'wheels':[{'x':-1, 'y':-1.2, 'width':0.4, 'length':0.8, 'revolving':true, 'powered':false}, //top left
                                {'x':1, 'y':-1.2, 'width':0.4, 'length':0.8, 'revolving':true, 'powered':false}, //top right
                                {'x':-1, 'y':1.2, 'width':0.4, 'length':0.8, 'revolving':false, 'powered':true}, //back left
                                {'x':1, 'y':1.2, 'width':0.4, 'length':0.8, 'revolving':false, 'powered':true}]}); //back right
    //initialize car
    var car=new Car({'width':2,
                    'length':4,
                    'position':[20, 10],
                    'angle':180, 
                    'power':60,
                    'max_steer_angle':42,
                    'max_speed':60,
                    'wheels':[{'x':-1, 'y':-1.2, 'width':0.4, 'length':0.8, 'revolving':true, 'powered':false}, //top left
                                {'x':1, 'y':-1.2, 'width':0.4, 'length':0.8, 'revolving':true, 'powered':false}, //top right
                                {'x':-1, 'y':1.2, 'width':0.4, 'length':0.8, 'revolving':false, 'powered':true}, //back left
                                {'x':1, 'y':1.2, 'width':0.4, 'length':0.8, 'revolving':false, 'powered':true}]}); //back right

    //initialize car
    var car=new Car({'width':2,
                    'length':4,
                    'position':[10, 20],
                    'angle':180, 
                    'power':60,
                    'max_steer_angle':42,
                    'max_speed':60,
                    'wheels':[{'x':-1, 'y':-1.2, 'width':0.4, 'length':0.8, 'revolving':true, 'powered':false}, //top left
                                {'x':1, 'y':-1.2, 'width':0.4, 'length':0.8, 'revolving':true, 'powered':false}, //top right
                                {'x':-1, 'y':1.2, 'width':0.4, 'length':0.8, 'revolving':false, 'powered':true}, //back left
                                {'x':1, 'y':1.2, 'width':0.4, 'length':0.8, 'revolving':false, 'powered':true}]}); //back right

    //initialize car
    var car=new Car({'width':2,
                    'length':4,
                    'position':[20, 20],
                    'angle':180, 
                    'power':60,
                    'max_steer_angle':42,
                    'max_speed':60,
                    'wheels':[{'x':-1, 'y':-1.2, 'width':0.4, 'length':0.8, 'revolving':true, 'powered':false}, //top left
                                {'x':1, 'y':-1.2, 'width':0.4, 'length':0.8, 'revolving':true, 'powered':false}, //top right
                                {'x':-1, 'y':1.2, 'width':0.4, 'length':0.8, 'revolving':false, 'powered':true}, //back left
                                {'x':1, 'y':1.2, 'width':0.4, 'length':0.8, 'revolving':false, 'powered':true}]}); //back right
    //initialize some props to bounce against
    var props=[];
    
    //outer walls
    props.push(new BoxProp({'size':[WIDTH_M, 1],    'position':[WIDTH_M/2, 0.5]}));
    props.push(new BoxProp({'size':[1, HEIGHT_M-2], 'position':[0.5, HEIGHT_M/2]}));
    props.push(new BoxProp({'size':[WIDTH_M, 1],    'position':[WIDTH_M/2, HEIGHT_M-0.5]}));
    props.push(new BoxProp({'size':[1, HEIGHT_M-2], 'position':[WIDTH_M-0.5, HEIGHT_M/2]}));
    
    //pen in the center
    var center=[WIDTH_M/2, HEIGHT_M/2];
    props.push(new BoxProp({'size':[1, 6], 'position':[center[0]-3, center[1]]}));
    props.push(new BoxProp({'size':[1, 6], 'position':[center[0]+3, center[1]]}));
    props.push(new BoxProp({'size':[5, 1], 'position':[center[0], center[1]+2.5]}));

    //let box2d draw it's bodies
    b2world.DrawDebugData();
	return "coucou";
};