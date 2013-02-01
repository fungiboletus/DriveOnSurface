// var vectors = require('./vendor/gamejs/vectors'),
	// math = require('./vendor/gamejs/math'),
var	box2d = require('./vendor/Box2dWeb-2.1.a.3'),
	Car = require('./car'),
	BoxProp = require('./boxprop'),
    Plot = require('./plot');


var WIDTH_PX=960;   //screen width in pixels
var HEIGHT_PX=540; //screen height in pixels
var SCALE=8;      //how many pixels in a meter
var WIDTH_M=WIDTH_PX/SCALE; //world width in meters. for this example, world is as large as the screen
var HEIGHT_M=HEIGHT_PX/SCALE; //world height in meters
var b2world;

module.exports = function(canvas) {
    //SET UP B2WORLD
    b2world=new box2d.b2World(new box2d.b2Vec2(0, 0), true);
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

    //initialize some props to bounce against
    var props=[];
    
    //outer walls
    /*props.push(new BoxProp([WIDTH_M, 1],[WIDTH_M/2, 0.5]));
    props.push(new BoxProp([1, HEIGHT_M-2],[0.5, HEIGHT_M/2]));
    props.push(new BoxProp([WIDTH_M, 1],[WIDTH_M/2, HEIGHT_M-0.5]));
    props.push(new BoxProp([1, HEIGHT_M-2],[WIDTH_M-0.5, HEIGHT_M/2]));*/

    /*for (var i = 0; i < 150; ++i)
        new Plot(0.5 + Math.random() * 1.5, [Math.random() * 80, Math.random() *    60]);*/

    new BoxProp([0.8, 15], [12, 29]);
    new BoxProp([0.8, 8], [13.2, 18], 0.3);
    new BoxProp([0.8, 6], [16.5, 12.8], 0.9);
    new BoxProp([8, 0.8], [22.5, 10.2], -0.2 );

    new BoxProp([18, 0.8], [35, 9.5]);

    new Plot(1.8, [45, 10.6]);
    new Plot(2.8, [46, 12.5]);
    new Plot(1.5, [47.2, 14]);

    new BoxProp([0.8, 8.5], [41, 11.7], -1.05 );

    new BoxProp([0.8, 13], [15.3, 42], -0.5);
    new BoxProp([0.8, 13], [22, 48.5], -1);
    new BoxProp([10, 0.8], [31.5, 52.5], 0.2);
    new BoxProp([60, 2.5], [63, 54.5], 0.01);

    new BoxProp([11, 0.8], [28, 54], 0.2);
    new BoxProp([9, 0.8], [19.5, 50], 0.7);
    new BoxProp([12, 0.8], [14.1, 41.8], 1.2);

    new Plot(3.5, [32.2, 20]);
    new Plot(6.5, [24.8, 23]);
    // new BoxProp([18, 0.8], [0, 0]);

    var fs = require('fs'),
    xml2js = require('xml2js');


function matrixToAngle(matrix) {
    var arrMatrix = matrix.match(/[\-0-9.]+/g);
    if(
        (parseFloat(arrMatrix[1]) == (-1 * parseFloat(arrMatrix[2]))) ||
        (parseFloat(arrMatrix[3]) == parseFloat(arrMatrix[0])) ||
        ((parseFloat(arrMatrix[0]) * parseFloat(arrMatrix[3]) - parseFloat(arrMatrix[2]) * parseFloat(arrMatrix[1])) == 1)
    ) {
        return  Math.round(Math.acos(parseFloat(arrMatrix[0])) * 180 / Math.PI);
    } else {
        return 0;
    }
}

var parser = new xml2js.Parser();
fs.readFile(__dirname + '/../circuit.svg', function(err, data) {
    parser.parseString(data, function (err, result) {
        // console.dir(result);

        var coef = 1.0/18.0;

        for (var gs = result.svg.g, i = 0, len = gs.length; i < len; ++i) {
            var calque = gs[i];

            if (calque.rect)
                for (var gi = calque.rect, ii = 0, len2 = gi.length; ii < len2; ++ii)
                {
                    var rect = gi[ii].$,
                        angle = rect.transform ? matrixToAngle(rect.transform) : 0;
                    // console.log(rect);
                    //new BoxProp([0.8, 8.5], [41, 11.7], -1.05 );
                    // console.log("new BoxProp(["+rect.width * coef+', '+rect.height * coef+
                    //     '], [' + rect.x * coef + ', ' + rect.y * coef + '], '+
                    //     angle + ');');
                    // if (rect.angle)
                        // angle = parseFloat(rect.angle);
                        console.log(rect.transform);

                    angle *= (Math.PI / 180);

                    var transform = rect.transform;

                    if (rect.transform) {
                        var matrix = transform.match(/[\-0-9.]+/g);
                        angle = Math.atan2(parseFloat(matrix[1]), parseFloat(matrix[0]));
                    }

                    new BoxProp([rect.width * coef, rect.height * coef],
                        [(parseFloat(rect.x) + rect.width / 2)* coef,
                        (parseFloat(rect.y) + rect.height / 2) * coef], angle);

                }
        }
        console.log('Done');
    });
});


    var cars = [];

    var randInt = function(min, max) {
        return Math.floor(Math.random()*(max-min))+min;
    };

    //let box2d draw it's bodies
	return {
        newCar: function() {
            var car = new Car({'width':2,
                    'length':4,
                    'position':[randInt(10, 20), randInt(10, 20)],
                    'angle':190,
                    'power':60,
                    'max_steer_angle':42,
                    'max_speed':60,
                    'wheels':[{'x':-1, 'y':-1.2, 'width':0.4, 'length':0.8, 'revolving':true, 'powered':false}, //top left
                                {'x':1, 'y':-1.2, 'width':0.4, 'length':0.8, 'revolving':true, 'powered':false}, //top right
                                {'x':-1, 'y':1.2, 'width':0.4, 'length':0.8, 'revolving':false, 'powered':true}, //back left
                                {'x':1, 'y':1.2, 'width':0.4, 'length':0.8, 'revolving':false, 'powered':true}]}); //back right
            cars.push(car);
            return car;
        },
        tick: function(msDuration) {
            for (var i = 0, len = cars.length; i < len; ++i)
                cars[i].update(msDuration);

            b2world.Step(msDuration/1000, 10, 8);

            b2world.ClearForces();
        },
        debugDraw: function() {
            b2world.DrawDebugData();
        }
    };
};