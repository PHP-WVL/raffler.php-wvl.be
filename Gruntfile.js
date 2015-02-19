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
		generate: {
			files: {
				// src: dest
				'js/vendor/bootstrap/dist/js/bootstrap.min.js': 'js/bootstrap.min.js',
				'js/vendor/handlebars/handlebars.min.js': 'js/handlebars.min.js',
				'js/vendor/jquery/dist/jquery.min.js': 'js/jquery.min.js',
				'js/vendor/modernizr/modernizr.js': 'js/modernizr.js',
                'js/vendor/requirejs/require.js': 'js/require.js',
                'js/vendor/openraffler/src/raffler.js': 'js/raffler.js'
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
	grunt.registerTask("deploy", ["gitcheckout:ghpages", "gitmerge:master", "generate", "gitadd:all", "gitcommit:ghpages", "gitpush:origin", "gitcheckout:master"]);

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

};
