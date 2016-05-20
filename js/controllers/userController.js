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
                Notify(message);

                Sammy(function () {
                    this.trigger('redirectUrl', {url: '#/home/'});
                })
            }, function (error) {
                var response = jQuery.parseJSON(error.responseText);
                var message = response.description;
                Notify(message);
            }).done();
    };

    UserController.prototype.loadRegisterPage = function (selector) {
        this.viewBag.showRegisterPage(selector);
    };

    UserController.prototype.register = function (data) {
        if (data.password != data.confirmPassword) {
            var message = "Sorry, the passwords you entered do not match. Please try again.";
            Notify(message);
        }else {
            return this.model.register(data)
                .then(function (success) {
                    sessionStorage['sessionId'] = success._kmd.authtoken;
                    sessionStorage['username'] = success.username;
                    sessionStorage['userId'] = success._id;

                    var message = "You have been successfully registered in the system";
                    Notify(message);


                    Sammy(function () {
                        this.trigger('redirectUrl', {url: '#/home/'});
                    });
                }, function (error) {
                    var response = jQuery.parseJSON(error.responseText);
                    var message = response.description;
                    Notify(message);
                }).done();
        }
    };

    UserController.prototype.logout = function () {
        this.model.logout()
            .then(function () {
                sessionStorage.clear();

                var message = "You have been successfully logged out from the system";
                Notify(message);

                Sammy(function () {
                    this.trigger('redirectUrl', {url: '#/'});
                });
            }, function (error) {
                var response = jQuery.parseJSON(error.responseText);
                var message = response.description;
                Notify(message);
            }).done();
    };

    function Notify(message) {
        $('#notification_placeholder').html('<div class="alert"><a class="close" data-dismiss="alert">X</a><span>' + message + '</span></div>');
        setTimeout(function () {
            document.getElementById('notification_placeholder').innerHTML = '';
        }, 2000);
    };


    return {
        load: function (viewBag, model) {
            return new UserController(viewBag, model);
        }
    }
}());