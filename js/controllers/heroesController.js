var app = app || {};

app.heroesController = (function () {
    function HeroesController(viewBag, model) {
        this.model = model;
        this.viewBag = viewBag;
    }

    HeroesController.prototype.loadAllHeroes = function (selector) {
        var _this = this;
        this.model.getHeroes()
            .then(function (data) {
                var result = {
                    heroes: []
                };

                data.forEach(function (hero) {
                    var imageUrl;
                    if (hero.class.name == 'Amazon') {
                        imageUrl = 'imgs/amazon.png';
                    } else {
                        imageUrl = 'imgs/barbarian.png';
                    }
                    result.heroes.push({
                        name: hero.name,
                        imageUrl: imageUrl,
                        id: hero._id
                    })
                });

                _this.viewBag.showHeroes(selector, result);
            })
    };

    HeroesController.prototype.loadHeroDetails = function (selector, heroId) {
        var _this = this;
        this.model.getHeroDetails(heroId)
            .then(function (data) {
                var imageUrl;
                if (data.class.name == 'Amazon') {
                    imageUrl = 'imgs/amazon.png';
                } else {
                    imageUrl = 'imgs/barbarian.png';
                }

                var result = {
                    imageUrl: imageUrl,
                    name: data.name,
                    attackPoints: data.class['attack-points'],
                    defensePoints: data.class['defense-points'],
                    lifePoints: data.class['life-points'],
                    items: [],
                    _id: data._id
                };
               
                if(data.items !=undefined) {
                    data.items.forEach(function (item) {
                        result.attackPoints += item['attack-points'];
                        result.defensePoints += item['defense-points'];
                        result.lifePoints += item['life-points'];
                        result.items.push({
                            name: item.name,
                            type: item.type.name,
                            attackPoints: item['attack-points'],
                            defensePoints: item['defense-points'],
                            lifePoints: item['life-points']
                        })
                    });
                }
                _this.viewBag.showHeroDetails(selector, result);
            })
    };


    HeroesController.prototype.loadAddHero = function (selector) {
        var _this = this;
        this.model.listClasses()
            .then(function (data) {
                var result = {
                    classes: []
                };

                data.forEach(function (gameClass) {
                    result.classes.push({
                        name: gameClass.name,
                        attackPoints: gameClass['attack-points'],
                        defensePoints: gameClass['defense-points'],
                        lifePoints: gameClass['life-points'],
                        _id: gameClass._id
                    })
                })

                _this.viewBag.showAddHero(selector, result);
            });
    };

    HeroesController.prototype.addHero = function (data) {
        var result = {
            name: data.name,
            class: {
                _type: "KinveyRef",
                _id: data.classId,
                _collection: "hero-classes"
            }
        };

        this.model.addHero(result)
            .then(function (success) {
                var message = "You have successfully added a new hero";
                var type = 'success';
                Notify(message, type);
                Sammy(function () {
                    this.trigger('redirectUrl', {url: '#/heroes/list/'});
                });
            }, function (error) {
                var response = jQuery.parseJSON(error.responseText);
                var message = response.description;
                var type = 'error';
                Notify(message, type);
            }).done();
    };


    HeroesController.prototype.loadStoreItems = function (selector, heroId) {
        var _this = this;
        this.model.listStoreItems()
            .then(function (data) {
                var result = {
                    items: []
                };

                data.forEach(function (item) {
                    result.items.push({
                        name : item.name,
                        type : item.type,
                        attackPoints: item['attack-points'],
                        lifePoints: item['life-points'],
                        defensePoints: item['defense-points'],
                        _id: item._id,
                        heroId: heroId
                    })
                });

                _this.viewBag.showStoreItems(selector, result);
            })
    };

    HeroesController.prototype.addItem = function (data) {
        var _this = this;
        var heroId = data.heroId;

        this.model.getHeroDetails(heroId)
            .then(function (heroData) {
                var result = {
                    name: heroData.name,
                    class: {
                        _type: "KinveyRef",
                        _id: heroData.class._id,
                        _collection: "hero-classes"
                    },
                    items: []
                };

               if(heroData.items == undefined){
                   result.items.push({
                       _type: "KinveyRef",
                       _id:  data.itemId,
                       _collection: "items"
                   })
               }else {
                   var itemTypeExists = false;
                   heroData.items.forEach(function (item) {
                       if (item.type.name == data.itemType) {
                           var message = "You already have an item of this type, which will be thrown away in case you proceed with the purchase.";
                           var type = 'warning';
                           Notify(message, type);
                           result.items.push({
                               _type: "KinveyRef",
                               _id: data.itemId,
                               _collection: "items"
                           });
                           itemTypeExists = true;
                       } else {
                           result.items.push({
                               _type: "KinveyRef",
                               _id: item._id,
                               _collection: "items"
                           })
                       }
                   });
                   if(!itemTypeExists){
                       result.items.push({
                           _type: "KinveyRef",
                           _id: data.itemId,
                           _collection: "items"
                       });
                   }
               }
                var updatedItem ={
                    heroId : heroData._id,
                    result : result
                };
                console.log(updatedItem)
                return updatedItem;
            })
            .then(function (updatedItem) {
            _this.model.editHero(updatedItem.heroId, updatedItem.result)
                .then(function (success) {
                    var message = "You have bought a new item";
                    var type = 'success';
                    Notify(message, type);
                }, function (error) {
                    var response = jQuery.parseJSON(error.responseText);
                    var message = response.description;
                    var type = 'error';
                    Notify(message, type);
                }).done();
             });
    };


    function Notify(message, type) {
        noty({
            text: message,
            layout: 'topRight',
            closeWith: ['click', 'hover'],
            type: type
        });
    };

    return {
        load: function (viewBag, model) {
            return new HeroesController(viewBag, model);
        }
    };
}());