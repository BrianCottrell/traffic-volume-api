/* Traffic Volume API */
/* by Brian Cottrell  */
/* 02-02-2015         */

//Add neccessary packages
var express		= require('express');
var app			= express();
var bodyParser	= require('body-parser');
var mongoose	= require('mongoose');
var TrafficPoint= require('./app/models/traffic_point');

//Connect to the database
mongoose.connect('mongodb://brian:mongo@ds039441.mongolab.com:39441/briansdatabase');

//Configure body body-parser
app.use(bodyParser.urlencoded({extend:true}));
app.use(bodyParser.json());

//Set port to 8080
var port = process.env.PORT || 8080;

//Routes for the api
var router = express.Router();

//Middleware used by all requests
router.use(function(req, res, next){
    console.log('A requests has been made.');
    next();
});

//Route for root page
router.get('/', function(req, res) {
    res.json({message: 'welcome to the traffic volume api.'});
});

//Add data to collection
// router.post('/', function(req, res){
//     var data = [12,33,200,12,34,200,13,35,400,13,32,70]
//     for(var i = 0; i < data.length; i+=3){
//         var trafficPoint = new TrafficPoint();
//         trafficPoint.latitude = data[i];
//         trafficPoint.longitude = data[i+1];
//         trafficPoint.count = data[i+2];
//         //Save the new traffic point
//         trafficPoint.save(function(err){
//             if(err)
//                 res.send(err);
//         });	
//     }
//     res.json({message: 'Traffic points added.'});
// })

//Routes for traffic point page
router.route('/traffic_points')
    //Create a new traffic point
    .post(function(req, res){
        var trafficPoint = new TrafficPoint();
        trafficPoint.latitude = req.body.latitude;
        trafficPoint.longitude = req.body.longitude;
        trafficPoint.count = req.body.count;
        //Save the new traffic point
        trafficPoint.save(function(err){
            if(err)
                res.send(err);
            res.json({message: 'Traffic point created.'});
        });
    })
    //List all traffic points
    .get(function(req, res){
//        TrafficPoint.find({count: {$lt: 500}}).exec(function(err, trafficPoints){
        TrafficPoint.find(function(err, trafficPoints){
            if(err)
                res.send(err);
            res.json(trafficPoints);
        });
    });

//Routes for traffic point pages that include an id
router.route('/traffic_points/:traffic_point_id')
    //Return a single traffic point
    .get(function(req, res){
        TrafficPoint.findById(req.params.traffic_point_id, function(err, trafficPoint){
            if(err)
                res.send(err);
            res.json(trafficPoint);
        });
    })
    //Update a single traffic point
    .put(function(req, res){
		TrafficPoint.findById(req.params.traffic_point_id, function(err, trafficPoint){
            if(err)
                res.send(err);
            trafficPoint.latitude = req.body.latitude;
            trafficPoint.longitude = req.body.longitude;
            trafficPoint.count = req.body.count;
            //Save the traffic point
            trafficPoint.save(function(err){
                if(err)
                    res.send(err);
                res.json({message: 'Traffic point updated'});
            });
        });
    })
    //Delete a traffic point
    .delete(function(req, res){
        TrafficPoint.remove({
            _id: req.params.traffic_point_id
        }, function(err, trafficPoint){
            if(err)
                res.send(err);
            res.json({message:'Traffic point removed'});
        });
    });

//Register routes to have the /api prefix
app.use('/api', router);

//Start the server
app.listen(port);
console.log('Now listening on port '+port);