module.exports = function(grunt) {
	// load dependencies
	grunt.loadNpmTasks("grunt-git");

	// Project configuration.
	grunt.initConfig({
		gitcheckout: {
			ghpages: {
				options: {
					branch: "gh-pages"
				}
			}
		},
		generate: {
			files: {
				// src: dest
				'js/vendor/bootstrap/dist/js/bootstrap.min.js': 'js/bootstrap.min.js',
				'js/vendor/handlebars/handlebars.min.js': 'js/handlebars.min.js',
				'js/vendor/jquery/dist/jquery.min.js': 'js/jquery.min.js',
				'js/vendor/modernizr/modernizr.js': 'js/modernizr.js'
			}
		}
	});


	// deploy
	grunt.registerTask("deploy", ["gitcheckout:ghpages", "generate"]);

	grunt.registerTask("generate", function(){
		grunt.log.writeln('Generating files...');

		var files = grunt.config.get(this.name + '.files');
		for (var src in files) {
			var dest = files[src];
			grunt.file.copy(src, dest);
			grunt.log.writeln("Copying [" + src + "] to [" + dest + "]").ok();
		}
	});

};
