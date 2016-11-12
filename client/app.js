var CronJob = require('cron').CronJob;
var request = require('request');

var jobs = [];
new CronJob('30 * * * * *', function() {

    request('http://aromeo.herokuapp.com/tasks', function(error, response, body) {
        if(!error && response.statusCode == 200) {
            console.log(body);
            jobs = JSON.parse(body);

        }
        if(jobs.length > 0) {
            jobs.forEach(function(j) {
                console.log(j.title + "\t" + j.crontime);
            });
        }

    });
},
            function(){},
            true,
            'Asia/Hong_Kong'
           );


