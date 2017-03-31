/**
 * http://usejsdoc.org/
 */

var fs = require('fs');

console.log(__dirname);


function change(path) {
	fs.readdirSync(path).forEach(function(file) {
		var stat = fs.statSync(path+'/'+file);
		if(stat.isDirectory() && file != 'blocks') {
			change(path+'/'+file);
		}
		if(stat.isFile()) {
			console.log(file);	
			var names = file.split("_");
			
			if(names.length == 2) {
				console.log(names);
				if(names[1] == "detail.html") {
					//fs.unlinkSync(path+'/'+file);
					
					console.log("$$$$$$$$$$$$");
					console.log(names[0]+".html");
					
					fs.createReadStream(__dirname+'/blocks/branch.html').pipe(fs.createWriteStream(path+'/'+names[0]+".html"));
					fs.createReadStream(__dirname+'/blocks/branch_detail.html').pipe(fs.createWriteStream(path+'/'+file));
				}
			} 
			
			
		}
	});

}

change(__dirname);

console.log('sdfsad');