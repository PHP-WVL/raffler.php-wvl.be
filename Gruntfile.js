module.exports = function(grunt) {
	// load dependencies
	grunt.loadNpmTasks('grunt-git');

	// Project configuration.
	grunt.initConfig({
		gitcheckout: {
			ghpages: {
				options: {
					branch: "gh-pages"
				}
			}
		}
	});


	// deploy
	grunt.registerTask('deploy', ['gitcheckout:ghpages']);

};
