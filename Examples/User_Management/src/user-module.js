var userModule = angular.module('myApp.user',[
  'myApp.user.config', 
  'myApp.user.factories', 
  'myApp.user.services'
]);

userModule.constant('AUTO_ANON', true);

userModule.run(['$rootScope', 'UserService', function($rootScope, UserService) {
  UserService.init();
}]);

userModule.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('user', {
      url: '/u',
      abstract: true,
      controller: 'UserCtrl',
      templateUrl: "templates/menu.html"
    })
    .state('user.account', {
      url: '',
      views: {
        'menuContent': {
          templateUrl: 'src/user/templates/user.account.html'
        }
      },
      resolve: {
        currentAuth: function(UserService) {
          return UserService.requireAuth();
        }
      }
    })
    .state('user.signup', {
      url: '/signup',
      views: {
        'menuContent': {
          templateUrl: 'src/user/templates/user.signup.html'
        }
      }
    })
    .state('user.login', {
      url: '/login',
      views: {
        'menuContent': {
          templateUrl: 'src/user/templates/user.login.html'
        }
      }
    })
    .state('user.logout', {
      url: '/logout',
      template: '<ui-view/>',
      controller: function($log, $state, UserService) {
        $log.debug("Logging out.");
        UserService.logout();
        $state.go('user.login',{alert: 'You have been logged out.'})
      }
    });
}]);

userModule.controller('UserCtrl', ['$log', '$scope', '$state', '$ionicPopup', 'UserService', function($log, $scope, $state, $ionicPopup, UserService) {

  var alerts = {
    authFailed: {
      title: 'Sorry!',
      template: 'The email/password combination is incorrect.'
    },
    inputsMissing: {
      title: 'Oops!',
      template: 'Please enter both an email and password to continue.'
    }
  }

  var authSuccessCallback = function() {
    $state.go('user.account');
  };

  var authFailureCallback = function(error) {
    var alertPopup = $ionicPopup.alert(alerts.authFailed);
  };

  var userFormIsValid = function(){
    return $scope.incomingUser.email && $scope.incomingUser.password;
  };

  var processUserInput = function(callback) {
    if(userFormIsValid()) {
      callback($scope.incomingUser, authSuccessCallback, authFailureCallback);
    } else {
      var alertPopup = $ionicPopup.alert(alerts.inputsMissing);
    }
  }

  $scope.incomingUser = {};

  $scope.loginWithPassword = function() {
    processUserInput(UserService.loginWithPassword);
  };

  $scope.signupWithPassword = function() {
    processUserInput(UserService.createAndLoginUserWithPassword);
  };

  $scope.init = function() {
    
  };

}]);

