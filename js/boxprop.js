var box2d = require('./vendor/Box2dWeb-2.1.a.3');

var BoxProp = function(size, position, angle, dynamic){
    /*
   static rectangle shaped prop
     
     pars:
     size - array [width, height]
     position - array [x, y], in world meters, of center
    */
    this.size=size;
    
    //initialize body
    var bdef=new box2d.b2BodyDef();

    if (dynamic)
        bdef.type = box2d.b2Body.b2_dynamicBody;

    bdef.position=new box2d.b2Vec2(position[0], position[1]);
    bdef.angle= angle ? angle : 0;
    bdef.fixedRotation=true;
    this.body=b2world.CreateBody(bdef);
    
    //initialize shape
    var fixdef=new box2d.b2FixtureDef();
    fixdef.shape=new box2d.b2PolygonShape();

    // var lapin = [{"x":0.260416716337204,"y":0.24666675925254822},{"x":0.23791667819023132,"y":0.2941667437553406},{"x":0.20208334922790527,"y":0.3175000846385956},{"x":0.15708333253860474,"y":0.31916674971580505},{"x":0.13458335399627686,"y":0.3250000774860382},{"x":0.11958333849906921,"y":0.3416667580604553},{"x":0.10958334803581238,"y":0.35833343863487244},{"x":0.11125001311302185,"y":0.37916678190231323},{"x":0.13041669130325317,"y":0.4041667580604553},{"x":0.16208335757255554,"y":0.4300001263618469},{"x":0.1962500512599945,"y":0.4450001120567322},{"x":0.2279166877269745,"y":0.4525001049041748},{"x":0.31541669368743896,"y":0.45583343505859375},{"x":0.460416704416275,"y":0.4483334422111511},{"x":0.5395833849906921,"y":0.4483334422111511},{"x":0.6862500905990601,"y":0.44916677474975586},{"x":0.7679166793823242,"y":0.4383334219455719},{"x":0.8112500905990601,"y":0.4241667687892914},{"x":0.8412500619888306,"y":0.40666675567626953},{"x":0.8712500333786011,"y":0.3716667890548706},{"x":0.8945834040641785,"y":0.31916674971580505},{"x":0.90541672706604,"y":0.2716667652130127},{"x":0.9020833969116211,"y":0.19000008702278137},{"x":0.8937500715255737,"y":0.14583341777324677},{"x":0.8654167652130127,"y":0.10416676104068756},{"x":0.8154167532920837,"y":0.0816667377948761},{"x":0.7487500905990601,"y":0.07083341479301453},{"x":0.6470834016799927,"y":0.07000009715557098},{"x":0.6187500357627869,"y":0.07166673243045807},{"x":0.5954167246818542,"y":0.08750008046627045},{"x":0.5937500596046448,"y":0.10833342373371124},{"x":0.5987500548362732,"y":0.12000009417533875},{"x":0.6137501001358032,"y":0.12000009417533875},{"x":0.6362500190734863,"y":0.1075000911951065},{"x":0.6737500429153442,"y":0.0866667628288269},{"x":0.7170833945274353,"y":0.07833340764045715},{"x":0.7679166793823242,"y":0.07833340764045715},{"x":0.8379167318344116,"y":0.095833420753479},{"x":0.8687500953674316,"y":0.11583341658115387},{"x":0.8870834112167358,"y":0.14333342015743256},{"x":0.8945834040641785,"y":0.18083341419696808},{"x":0.9004167318344116,"y":0.2550000846385956},{"x":0.8854167461395264,"y":0.32583341002464294},{"x":0.8237500786781311,"y":0.38666677474975586},{"x":0.7570834159851074,"y":0.415833443403244},{"x":0.6870834231376648,"y":0.4308334290981293},{"x":0.5479167103767395,"y":0.4366667866706848},{"x":0.4695833921432495,"y":0.41833341121673584},{"x":0.4087500274181366,"y":0.392500102519989},{"x":0.3654167056083679,"y":0.3416667580604553},{"x":0.3579167127609253,"y":0.3108334243297577},{"x":0.36375004053115845,"y":0.2900000810623169},{"x":0.37458336353302,"y":0.27750009298324585},{"x":0.3929167091846466,"y":0.260000079870224},{"x":0.42125004529953003,"y":0.25416675209999084},{"x":0.43708336353302,"y":0.244166761636734},{"x":0.4412500560283661,"y":0.22666674852371216},{"x":0.43291670083999634,"y":0.2116667628288269},{"x":0.40291672945022583,"y":0.19833341240882874},{"x":0.36625003814697266,"y":0.15166674554347992},{"x":0.31208336353302,"y":0.09833341836929321},{"x":0.26875001192092896,"y":0.06916676461696625},{"x":0.23458334803581238,"y":0.05833342671394348},{"x":0.1837500035762787,"y":0.05333341658115387},{"x":0.14791670441627502,"y":0.0633334219455719},{"x":0.13208335638046265,"y":0.07166673243045807},{"x":0.13041669130325317,"y":0.07666675746440887},{"x":0.1495833694934845,"y":0.0841667503118515},{"x":0.2004166841506958,"y":0.10333341360092163},{"x":0.2354167103767395,"y":0.12666675448417664},{"x":0.2587500512599945,"y":0.15916675329208374},{"x":0.2637500464916229,"y":0.19000008702278137},{"x":0.26208338141441345,"y":0.22666674852371216}];

    // var array = [];

    // var xx = 120;
    // for (var i = 0; i < lapin.length; ++i) {
    //     array.push(new box2d.b2Vec2(lapin[i].x*-xx+xx, Math.abs(lapin[i].y*-125)));
    // }
    // fixdef.shape.SetAsArray([new box2d.b2Vec2(144.59874/8,484.87312/8),
    //                    new box2d.b2Vec2(6.06092/8, 268.70058/8) ,
    //                    new box2d.b2Vec2(86.87312/8, 16.12344/8) ,
    //                    new box2d.b2Vec2( -56.56854/8, -96.97465/8)], 4);
    // fixdef.shape.SetAsVector(array, lapin.length);
    // fixdef.shape.m_centroid.SetZero();
    fixdef.shape.SetAsBox(this.size[0]/2, this.size[1]/2);
    fixdef.restitution=0.4; //positively bouncy!
    this.body.CreateFixture(fixdef);
    return this;
};

module.exports = BoxProp;