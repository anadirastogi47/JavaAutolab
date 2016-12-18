var gitlab = require('./gitlab.js')('localhost','root','qweasdzxc');
 var main_server = 
{
	hostname: 'localhost' ,//require('../config/conf.json').host.hostname,
	port: '9000'     //require('../config/conf.json').host_port.port
}

var fs = require('fs');
var userList = fs.readFileSync('../userList').toString('utf-8').split('\n');
userList.pop()
console.log(userList)
languages = ['cpp']//,'cpp','cpp14','java','python2','python3'];

//start_time and end_time are JavaScript Date objects
module.exports = function(lab,start_time,end_time,admin_key,callback)
{
	max_scores = {};
	number_of_requests=0;
	var socket = require('socket.io-client')('https://'+main_server.hostname+":"+main_server.port);

	//Get all the commits from the userList for the specified lab 
	gitlab.getPrivateToken(function(err,token) 			//Get the private token required to get all the commits
	{
		console.log(token)
		for(var i=0;i<userList.length;i++)
		{
			user = userList[i];					
			gitlab.getProjectId(token,user,lab,function(error,id)
			{
				
				gitlab.getCommits(token,id,function(err,commits) 
				{
					commits.filter(function(commit)  			//Check if the commit is within the lab timings
					{
						var commit_date = new Date(commit["created_at"]);
						if(commit_date >= start_time && commit_date <= end_time) return true;
						else return false;

					})


					for(var commit in commits) 
						for(var lang in languages) 
						{
							socket.emit('submission',[user,lab,commits[commit].id,languages[lang],admin_key]);
							number_of_requests++;
						}


					socket.on('scores',function(data)
					{
						var total_score =0;
						for(var i =0; i < data.marks.length;i++) total_score+=Number(data.marks[i]);
						
						if(max_scores[data.id_no]) max_scores[data.id_no] = Math.max(max_scores[data.id_no],total_score);
						else max_scores[data.id_no]=total_score;

						number_of_requests--;
						if(!number_of_requests)
						{
							return callback(max_scores);
						}
					})

					socket.on('disconnect',function()
					{
						console.log("DISCONNECRED")
					})
				})
			})
		}
	})
	

}