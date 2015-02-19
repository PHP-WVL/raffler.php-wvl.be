(function(){
    requirejs.config({
        baseUrl: 'js',
        paths: {
            'jquery': 'vendor/jquery/dist/jquery.min',
            'bootstrap': 'vendor/bootstrap/dist/js/bootstrap.min',
            'handlebars': 'vendor/handlebars/handlebars.min',
            'modernizr': 'vendor/modernizr/modernizr'
        },
        shim: {
            'bootstrap': ['jquery'],
            'joindin': {
                deps: ['jquery'],
                exports: 'JoindIN'
            },
            'meetup': {
                deps: ['jquery'],
                exports: 'Meetup'
            },
            'raffler': {
                deps: ['jquery', 'handlebars', 'joindin', 'meetup'],
                exports: 'Raffler'
            },
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

    require(
        ['jquery', 'bootstrap', 'handlebars', 'modernizr', 'joindin', 'meetup', 'raffler', 'dynamicPages', 'konami'],
        function($, Bootstrap, Handlebars, Modernizr, JoindIN, Meetup, Raffler, dynamicPages, Konami){
            $(function(){
                var joindIn = new JoindIN();
                var raffler = new Raffler(joindIn, Handlebars);
                dynamicPages.init();
            });
        }
    );
 })();
