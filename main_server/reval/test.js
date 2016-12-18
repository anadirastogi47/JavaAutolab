// var gitlab = require('./gitlab.js')('localhost','root','qweasdzxc');
// gitlab.getPrivateToken(function(error,token)
// {
// 	console.log(token)
// 	gitlab.getProjectId(token,'2014A7PS774G','lab2',function(error,id)
// 	{
		
// 		gitlab.getCommits(token,id,function(err,commits)
// 		{
// 			console.log(err);
// 			console.log(commits)
			
// 		})
// 	})
// })



var async = require('async');

// require('./reval.js')('lab2',new Date('02/02/2012 00:00'), new Date('02/02/2017 00:00'),'q',function(scores)
// {
// 	console.log('lab2')
// 	console.log(scores);
	
// })

// require('./reval.js')('lab2',new Date('02/02/2012 00:00'), new Date('02/02/2017 00:00'),'q',function(scores)
// {
// 	console.log('lab2')
// 	console.log(scores);
	
// })

async.series(require('./reval.js')('lab2',new Date('02/02/2012 00:00'), new Date('02/02/2017 00:00'),'q',function(scores)
{
	console.log('lab2')
	console.log(scores);
	
}),require('./reval.js')('lab2',new Date('02/02/2012 00:00'), new Date('02/02/2017 00:00'),'q',function(scores)
{
	console.log('lab2')
	console.log(scores);
	
}))

