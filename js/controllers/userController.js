var app = app || {};

app.userController = (function () {
    function UserController(viewBag, model) {
        this.model = model;
        this.viewBag = viewBag;
    }

    UserController.prototype.loadLoginPage = function (selector, data) {
        this.viewBag.showLoginPage(selector, data);
    };

    UserController.prototype.login = function (data) {
        return this.model.login(data)
            .then(function (success) {
                sessionStorage['sessionId'] = success._kmd.authtoken;
                sessionStorage['username'] = success.username;
                sessionStorage['userId'] = success._id;

                var message = "You have been successfully logged in the system";
                var type = 'success';
                Notify(message, type);

                Sammy(function () {
                    this.trigger('redirectUrl', {url: '#/home/'});
                });                

            }, function (error) {
                var response = jQuery.parseJSON(error.responseText);
                var message = response.description;
                var type = 'error';
                Notify(message, type);
            }).done();
    };

    UserController.prototype.loadRegisterPage = function (selector) {
        this.viewBag.showRegisterPage(selector);
    };

    UserController.prototype.register = function (data) {
        if (data.password != data.confirmPassword) {
            var message = "Sorry, the passwords you entered do not match. Please try again.";
            var type = 'error';
            Notify(message, type);
        }else {
            return this.model.register(data)
                .then(function (success) {
                    sessionStorage['sessionId'] = success._kmd.authtoken;
                    sessionStorage['username'] = success.username;
                    sessionStorage['userId'] = success._id;

                    var message = "You have been successfully registered in the system";
                    var type = 'success';
                    Notify(message, type);


                    Sammy(function () {
                        this.trigger('redirectUrl', {url: '#/home/'});
                    });
                }, function (error) {
                    var response = jQuery.parseJSON(error.responseText);
                    var message = response.description;
                    var type = 'error';
                    Notify(message, type);
                }).done();
        }
    };

    UserController.prototype.logout = function () {
        this.model.logout()
            .then(function () {
                sessionStorage.clear();

                var message = "You have been successfully logged out from the system";
                var type = 'success';
                Notify(message, type);

                Sammy(function () {
                    this.trigger('redirectUrl', {url: '#/'});
                });
            }, function (error) {
                var response = jQuery.parseJSON(error.responseText);
                var message = response.description;
                var type = 'error';
                Notify(message, type);
            }).done();
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
            return new UserController(viewBag, model);
        }
    }
}());