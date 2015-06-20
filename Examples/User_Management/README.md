# Managing Users

### 0.1. Description

AngularJS module for creating, logging in, logging out users of a Firebase instance.

Accomplishes:

* Create anonymous user.
* Create email & password user.
* Automatically log user in following successful account creation.

### 0.2. Resources

* AngularFire
  - [AngularFire Quickstart Guide](https://www.firebase.com/docs/web/libraries/angular/quickstart.html)
  - [AngularFire Documentation](https://www.firebase.com/docs/web/libraries/angular/api.html)

## 1. [Code](./src)

### 1.1. Module & Controller [`user-module.js`](./src/user-module.js)

```js

var userModule = angular.module('user',[]);

userModule.run(function ($rootScope, UserService) {
  UserService.init();
});

userModule.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('user', {
      url: '',
      abstract: true,
      controller: 'UserCtrl',
      template: '<ui-view/>'
    })
    .state('user.profile', {
      url: '/profile',
      views: {
        '': {
          templateUrl: 'templates/user.profile.html'
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
        '': {
          templateUrl: 'templates/user.signup.html'
        }
      }
    })
    .state('user.login', {
      url: '/login',
      views: {
        '': {
          templateUrl: 'templates/user.login.html'
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
    })
});

userModule.controller('UserCtrl', function($log, $scope, $state, UserService) {

  var showAccountErrorAlert = function() {
    alert("Oops, we couldn't log you in.");
  }
  var showMissingInputAlert = function(){
    alert("Please enter your email and password to log in.");
  }

  $scope.incomingUser = {};
  
  $scope.loginWithPassword = function() {
    if($scope.incomingUser.email && $scope.incomingUser.password) {
      UserService.loginWithPassword($scope.incomingUser, function() {
        // Success, do something here...
      }, function(error){
        $log.error("Login error:",error);
        showAccountErrorAlert();
      });
    } else {
      showMissingInputAlert();
    }
  };
  
  $scope.signupWithPassword = function() {
    if($scope.incomingUser.email && $scope.incomingUser.password) {
      UserService.createUser($scope.incomingUser, function() {
        // Success, do something here...
      }, function(error){
        $log.error("Signup error:",error);
        showAccountErrorAlert();
      });
    } else {
      showMissingInputAlert();
    }
  };

});

```

### 1.2. Factory [`user-factory.js`](./src/user-factory.js)

```js
userModule.factory('UserFactory', function($log, $q, $rootScope, $firebaseAuth, $exceptionHandler, User, FBURL){
  var userData;
  return function(userAuth){
    var deferred = $q.defer();
    if(userAuth.uid){
      var userRef = new Firebase(FBURL+'/users/'+userAuth.provider+'/'+userAuth.uid);
      userData = new User(userRef);
      $log.debug("Current user:", userData.$id);
      userData.$updateUser();
      userData.$bindTo($rootScope, "userData").then(function() {
        $rootScope.auth = userData.$auth.$getAuth();
        deferred.resolve(userData);
      });
    } else {
      $log.error("User factory did not receive user authentication data.");
      deferred.reject("User(userAuth) - userAuth not inputted.");
    }
    return deferred.promise;
  }
});

userModule.factory('User', function($rootScope, $firebaseAuth, $firebaseObject, $q, FBURL){
  var ref = new Firebase(FBURL);
  return $firebaseObject.$extend({
    $$defaults: {
      $auth: $firebaseAuth(ref),
    },
    $updateUser: function() {
      var deferred = $q.defer();
      var authDetails = {};
      angular.copy(this.$auth.$getAuth(), authDetails);
      delete authDetails.auth;
      this.auth = authDetails;
      if (authDetails.password) {
        this.auth.email = authDetails.password.email;
      }
      this.$ref().update(this.auth, function(error){
        if(error){
          deferred.reject(error);
        } else {
          deferred.resolve();
        }
      });
      return deferred.promise;
    },
    $connectPreviousSession: function(previousSession) {
      this.$ref().child('previousSession').push(previousSession);
    },
    $logout: function() {
      this.$destroy();
      this.$auth.$unauth();
    }
  });
});
```

### 1.3. Service [`user-service.js`](./src/user-service.js)

```js
userModule.service('UserService', function($log, $rootScope, $firebaseAuth, $firebaseObject, $q, FBURL, UserFactory) {  
  var self, auth, _authObj, currentUser, previousUser;
  _authObj = $firebaseAuth(new Firebase(FBURL));
  self = {
    init: function(successCb, errorCb) {
      if (_authObj.$getAuth()) {
        UserFactory(_authObj.$getAuth()).then(function(userData){
          currentUser = userData;
          $log.debug("User loaded", currentUser);
        });
      } else {
        self.loginAnonymously().then(function(authData){
          UserFactory(authData).then(function(userData){
            currentUser = userData;
            $log.debug("User loaded", currentUser);
          });
        });
      }
    },
    requireAuth: function () {
      return _authObj.$requireAuth();
    },
    getRef: function() {
      return currentUser.$ref();
    },
    createUser: function(user, successCb, errorCb){
      self.logout();
      _authObj.$createUser({
        email: user.email,
        password: user.password
      }).then(function(userData) {
        $log.debug("Created user:" + userData.uid);
        // [TODO] Use loginWithPassword here.
        return _authObj.$authWithPassword({
          email: user.email,
          password: user.password
        });
      }).then(function(authData) {
        self.init();
        if(successCb) successCb();
      }).catch(function(error) {
        $log.error("Error: ", error);
      });
    },
    loginWithPassword: function(user, successCb, errorCb) {
      self.logout();
      _authObj.$authWithPassword({
        email: user.email,
        password: user.password
      }).then(function(authData) {
        $log.debug("User", authData.uid, "logged in.");
        // [TODO] Use onAuth listener to avoid having to call init();
        self.init();
        if(successCb) successCb();
      }).catch(function(error) {
        $log.error("User login failed:", error);
        if(errorCb) errorCb(error);
      });
    },
    loginAnonymously: function() {
      var deferred = $q.defer();
      _authObj.$authAnonymously().then(function(authData) {
        console.debug("User ", authData.uid, " logged in.");
        deferred.resolve(authData);
      }).catch(function(error) {
        console.error("Authenticating anonymous user failed:", error);
        deferred.reject(error);
      });
      return deferred.promise;
    },
    logout: function(successCb, errorCb) {
      if (_authObj.$getAuth()) {
        currentUser.$logout();
        $log.debug("User successfully logged out.");
        if(successCb) successCb();
      } else {
        $log.debug("User tried to logout but is not logged in.");
        if(errorCb) errorCb();
      }
    }
  };
  return self;
});
```

