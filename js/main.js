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

    require(['jquery', 'bootstrap', 'modernizr', 'konami', 'unique']);

    require(
        ['joindin', 'raffler', 'dynamicPages'],
        function(JoindIN, Raffler, dynamicPages){
            $(function(){
                var joindIn = new JoindIN();
                var raffler = new Raffler(joindIn);
                dynamicPages.init();
            });
        }
    );
 })();
