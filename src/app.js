// Get required modules
const express = require('express');
const http = require("http");
const app = express();
const handlebars = require('express-handlebars').create({defaultLayout:'main'});


// set up the public folder location, session and basic security module
app.use(express.static('public'));


// redirect all routes to the game
app.use('*', function(req, res){
    res.render('resource', {'name' : 'LightSwitch'});
});

        
// set the port location and the file extension 
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 8000);



// 404 error
app.use(function(req,res){
  res.status(404);
  res.render('404');
});


// 500 error
app.use(function(err, req, res, next){
  res.type('plain/text');
  res.status(500);
  res.render('500');
});



// Start our app
app.listen(app.get('port') || 3000, function(){
  console.log('Express started on port ' + app.get('port') + ' or 3000' + '; press Ctrl-C to terminate.');
});
