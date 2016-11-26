var firebase = require('firebase');
var CronJob = require('cron').CronJob;
var config = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: "aromeo-cc778.firebaseapp.com",
        databaseURL: "https://aromeo-cc778.firebaseio.com",
        storageBucket: "aromeo-cc778.appspot.com",
};
firebase.initializeApp(config);

function createTask(title, crontime, description, aroma, duration) {
    firebase.database().ref('tasks/').push().set({
        title: title,
        crontime: crontime,
        description : description,
        aroma: aroma,
        duration: duration
    });
}

var tasksRef = firebase.database().ref('tasks/');
var jobs = [];


function addJobForTask(tRef) {
    var matching = jobs.filter(function(job) {
        if (job.key == tRef.key) {
            console.log("Pausing task while updating its new data");
            job.stop();
            return true;
        }
        return false;
    }); 
    var cronGen = function(ctime) {
	carr = ctime.split(' ');
	carr[carr.length - 4] = "*/2";
	return carr.join(' ');
    };

    var task = tRef.val();
    console.log("Created cron task");
    var job = new CronJob(cronGen(task.crontime), function() {
        console.log("Running task: ", task.title, "...");
        console.log("Activating aromas ", task.aroma, " for ", task.duration, " minutes");
        setTimeout(function(){
	    console.log("Ended task");
            job.stop();
        }, task.duration*1000);
     }, function(){}, true, 'Asia/Hong_Kong'
    );

    job.key = tRef.key;
    if(matching.length > 0) {
        matching = matching[0];
        matching = job;
    } else {
        jobs.push(job);
    }
};

tasksRef.on('child_added', function(task) {
    addJobForTask(task);
});


tasksRef.on('child_changed', function(task) {
    addJobForTask(task);
});


