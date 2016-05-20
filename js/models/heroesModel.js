var app = app || {};

app.heroesModel = (function () {
    function HeroesModel(requester) {
        this.requester = requester;
        this.serviceUrl = requester.baseUrl + 'appdata/' + requester.appId + '/heroes/';
        this.classesServiceUrl = requester.baseUrl + 'appdata/' + requester.appId + '/hero-classes/';
        this.itemsServiceUrl = requester.baseUrl + 'appdata/' + requester.appId + '/items/';
    }

    HeroesModel.prototype.getHeroes = function() {
        var requestUrl = this.serviceUrl + "?query={\"_acl\":{\"creator\":\""+sessionStorage['userId']+"\"}}&resolve=class&retainReferences=false";
        return this.requester.get(requestUrl, true);
    };

    HeroesModel.prototype.getHeroDetails = function(heroId) {
        var requestUrl = this.serviceUrl + heroId + '?resolve=class,items,items.type&retainReferences=false';
        return this.requester.get(requestUrl, true);
    };

    HeroesModel.prototype.addHero = function(data) {
        return this.requester.post(this.serviceUrl, data, true);
    };

    HeroesModel.prototype.editHero = function(heroId, data) {
        var requestUrl = this.serviceUrl + heroId;
        return this.requester.put(requestUrl, data, true);
    };

    HeroesModel.prototype.listClasses = function() {
        return this.requester.get(this.classesServiceUrl, true);
    };

    HeroesModel.prototype.listStoreItems = function() {
        var requestUrl = this.itemsServiceUrl + '?resolve=type&retainReferences=false';
        return this.requester.get(requestUrl, true);
    };

    return {
        load: function (requester) {
            return new HeroesModel(requester);
        }
    }
}());