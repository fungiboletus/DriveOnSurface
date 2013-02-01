var box2d = require('./vendor/Box2dWeb-2.1.a.3');

module.exports = function(radius, position, dynamic) {
    var bplot = new box2d.b2BodyDef();
    bplot.position = new box2d.b2Vec2(position[0], position[1]);
   
    if (dynamic)
        bplot.type = box2d.b2Body.b2_dynamicBody;

    this.body = b2world.CreateBody(bplot);
    // var shape = new box2d.b2CircleShape(radius);
    // shape.density = 0.5;
    // shape.friction = 0.3;
    // shape.restitution = 0.5;
    // this.body.CreateShape(shape);
    // this.body.setMassFromShapes();

    var fixdef=new box2d.b2FixtureDef();
    // fixdef.shape=new box2d.b2PolygonShape();
    fixdef.shape = new box2d.b2CircleShape(radius);
    // fixdef.restitution=0.3; //positively bouncy!
    // fixdef.elasticity = 10;
    fixdef.density = 5.0;
    this.body.CreateFixture(fixdef);
    return this;
};
