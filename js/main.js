(function(){
    requirejs.config({
        baseUrl: 'js',
        paths: {
            'jquery': 'jquery.min',
            'bootstrap': 'bootstrap.min',
            'handlebars': 'handlebars.min',
            'modernizr': 'modernizr'
        },
        shim: {
            'bootstrap': ['jquery'],
            'konami': {
                deps: ['jquery'],
                exports: 'Konami'
            },
            'dynamicPages': {
                deps: ['jquery'],
                exports: 'dynamicPages'
            }
        }
    });

    require(['jquery', 'bootstrap', 'modernizr', 'konami']);

    require(
        ['joindin', 'raffler', 'dynamicPages'],
        function(JoindIN, Raffler, dynamicPages){
            $(function(){
                var joindIn = new JoindIN({
					filters: {
						comment: {
							maxTimeWindow: "3weeks"
						}
					}
				});
                var raffler = new Raffler(joindIn);
                dynamicPages.init();
            });
        }
    );
 })();
