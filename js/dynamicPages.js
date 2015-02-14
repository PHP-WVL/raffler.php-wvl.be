var dynamicPages = (function() {
    var defaultContent = '';
    init = function(){
        defaultContent = ($('#content').html());
        hash = window.location.hash.substring(1);
        if (hash != '') loadPage(hash);
        else history.pushState('home','null','');
        initOnclick();
        initPopstate();
    };
    var initPopstate = function() {
        $(window).on('popstate', function(e) {
            if (e.originalEvent.state && e.originalEvent.state) {
                loadPage(e.originalEvent.state,false)
            }
        });
    };
    var initOnclick = function() {
        $('#content').on('click', 'a.load', function(e) {
            e.preventDefault();
            loadPage($(this).attr('href'));
        });
    };
    var loadPage = function(page, push) {
        if(typeof(push)==='undefined') push = true;
        if (push == true) history.pushState(page ,'','#' + page);

        $('#content').empty();

        if (page == 'home')  $('#content').append(defaultContent).removeClass('page');
        else $('#content').load(page + ".html").addClass('page');
    };

    return {
        init:init,
        loadPage:loadPage
    };
})();

