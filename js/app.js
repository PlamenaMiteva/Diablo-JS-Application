var app = app || {};

(function () {
    var router = Sammy(function () {
        var currentLocation = window.location.pathname;
        var selector = '#container';
        var requester = app.requester.load('kid_ZJU1WAE3GW', 'a317aeba877b4197a9c687155fd2a5c8', 'https://baas.kinvey.com/');

        var userViewBag = app.userViewBag.load();
        var homeViewBag = app.homeViewBag.load();
        var heroesViewBag = app.heroesViewBag.load();

        var userModel = app.userModel.load(requester);
        var heroesModel = app.heroesModel.load(requester);

        var userController = app.userController.load(userViewBag, userModel);
        var homeController = app.homeController.load(homeViewBag);
        var heroesController = app.heroesController.load(heroesViewBag, heroesModel);

        this.before({except:{path:'#\/(login\/|register\/)?'}}, function() {
            if(!sessionStorage['sessionId']) {
                this.redirect('#/');
                return false;
            }
        });


        this.before(function() {
            if(!sessionStorage['sessionId']) {
                $.get('templates/menu-login.html', function (templ) {
                    var menu = $('#menu');
                    $(menu).html(templ)
                });
            } else {
                $.get('templates/menu-home.html', function (templ) {
                    var menu = $('#menu');
                    $(menu).html(templ)
                });
            }
        });

        this.get('#/', function() {
            homeController.loadWelcomePage(selector);
        });

        this.get('#/home/', function() {
            homeController.loadHomePage(selector);
        });

        this.get('#/login/', function() {
            userController.loadLoginPage(selector);
        });

        this.get('#/register/', function() {
            userController.loadRegisterPage(selector);
        });

        this.get('#/logout/', function() {
            userController.logout();
        });

        this.get('#/heroes/list/', function() {
            heroesController.loadAllHeroes(selector);
        });

        this.get('#/heroes/add/', function() {
            heroesController.loadAddHero(selector);
        });

        this.get('#/heroes/:id/', function() {
            var heroId = this.params['id'];
            heroesController.loadHeroDetails(selector, heroId);
        });

        this.get('#/hero/:id/store', function() {
            var heroId = this.params['id'];
            heroesController.loadStoreItems(selector, heroId);
        });

        this.bind('redirectUrl', function(ev, data) {
            this.redirect(currentLocation + data.url);
        });

        this.bind('login', function(ev, data) {
            userController.login(data);
        });

        this.bind('register', function(ev, data) {
            userController.register(data);
        });        

        this.bind('addHero', function(ev, data) {
            heroesController.addHero(data);
        });

        this.bind('addItem', function(ev, data) {
            heroesController.addItem(data);
        });

    });

    router.run('#/');
}());

