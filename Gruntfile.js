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
			},
			master: {
				options: {
					branch: "master"
				}
			}
		},
        gitmerge: {
            master: {
                options: {
                    branch: "master",
                    noff: true,
                    noEdit: true
                }
            }
        },
        gitadd: {
            all: {
                options: {
                    force: false,
                    all: true
                }
            }
        },
        gitcommit: {
            ghpages: {
                options: {
                    message: 'Deploying...',
                    noVerify: true,
                    noStatus: false,
                    allowEmpty: true
                }
            }
        },
        gitpush: {
            origin: {
                options: {
                    remote: "origin",
                    branch: "gh-pages"
                }
            }
        }
	});


	// deploy
	grunt.registerTask("deploy", ["gitcheckout:ghpages", "gitmerge:master", "gitadd:all", "gitcommit:ghpages", "gitpush:origin", "gitcheckout:master"]);

    /*
	grunt.registerTask("generate", function(){
		grunt.log.writeln('Generating files...');

		var files = grunt.config.get(this.name + '.files');
		for (var src in files) {
			var dest = files[src];
            if (!grunt.file.exists(dest)) {
                grunt.file.copy(src, dest);
                grunt.log.writeln("Copying [" + src + "] to [" + dest + "]").ok();
            }
		}
	});
    */

};
