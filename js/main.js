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
