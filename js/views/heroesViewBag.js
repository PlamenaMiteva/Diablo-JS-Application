var app = app || {};

app.heroesViewBag = function () {
    function showHeroes(selector, data) {
        if (data.heroes.length > 0) {
            $.get('templates/heroes.html', function (templ) {
                var rendered = Mustache.render(templ, data);
                $(selector).html(rendered);
            });
        } else {
            $.get('templates/no-heroes.html', function (templ) {
                var rendered = Mustache.render(templ, data);
                $(selector).html(rendered);
            });
        }
    }


    function showHeroDetails(selector, data) {
        $.get('templates/hero.html', function (templ) {
            var rendered = Mustache.render(templ, data);
            $(selector).html(rendered);
        });
    }

    function showAddHero(selector, data) {
        $.get('templates/add-hero.html', function (templ) {
            var rendered = Mustache.render(templ, data);
            $(selector).html(rendered);
            $('#addHero').on('click', function () {
                var name = $('#name').val(),
                    classId = $('input[type=\'radio\']:checked').val();

                Sammy(function () {
                    this.trigger('addHero', {name: name, classId: classId});
                })
            })

            $('#cancel-btn').on('click', function () {
                $('#add-hero-form').find('input').not(':button, :submit, :reset, :hidden').val('');
                $("#add-hero-form").find('input:radio').attr('selected', '-1');
                console.log($("#add-hero-form").find('input:radio'))
                console.log($("#add-hero-form").find('input:radio').attr('selected'))
            })
        })
    }

    function showStoreItems(selector, data) {
        $.get('templates/store.html', function (templ) {
            var rendered = Mustache.render(templ, data);
            $(selector).html(rendered);
            var heroId = data.items[0].heroId;

            $('.buy').on('click', function () {
                var itemId =  $(this).attr('data-id');
                var itemType = $(this).attr('data-type');
               
                Sammy(function () {
                    this.trigger('addItem', {itemId: itemId, itemType: itemType, heroId: heroId});
                })

            })
        });
    }

    return {
        load: function () {
            return {
                showHeroes: showHeroes,
                showHeroDetails: showHeroDetails,
                showAddHero: showAddHero,
                showStoreItems: showStoreItems
            }
        }
    }
}();