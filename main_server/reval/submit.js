 var main_server = 
{
	hostname: 'localhost' ,//require('../config/conf.json').host.hostname,
	port: '9000'     //require('../config/conf.json').host_port.port
}

//console.log(main_server)
var socket = require('./socket.io/node_modules/socket.io-client')('https://'+main_server.hostname+":"+main_server.port);
var fs = require('fs');
var user_commits = fs.readFileSync('./user_commits.txt').toString('utf-8').split('\n');
var i =0;

var lab = user_commits[i++];
var students = Number(user_commits[i++]);

number_of_requests=0; 

languages = ['C','cpp','cpp14','java','python2','python3'];
while(students--)
{
	var id = user_commits[i++];
	var number_commits = Number(user_commits[i++]);
	while(number_commits--)
	{
		var commit = user_commits[i++];
		for(var lang in languages)
		{
			socket.emit('submission',[id,lab,commit,languages[lang],process.env.ADMIN_KEY]);
			number_of_requests++;
			console.log(process.env.ADMIN_KEY)
		}
		
		
	}
}


var max_scores ={};

socket.on('scores',function(data)
{
	var total_score =0;
	for(var i =0; i < data.marks.length;i++) total_score+=Number(data.marks[i]);
	
	if(max_scores[data.id_no]) max_scores[data.id_no] = Math.max(max_scores[data.id_no],total_score);
	else max_scores[data.id_no]=total_score;
	
	console.log(data.id_no + ',' + total_score + '  ' + number_of_requests);

	number_of_requests--;
	if(!number_of_requests)
	{
		for(var id in max_scores)
		{
			fs.appendFile(lab + '_reval_score.csv',id + ',' + max_scores[id] + '\n',function()
			{
		 		// Do nothing
		 		process.exit();
		 	})

		}
		
		console.log(max_scores);
		
		// fs.writeSync(fd,data.id_no + "," + total_score + '\n');
		
		// fs.closeSync(fd);
	}
		 
});
	


