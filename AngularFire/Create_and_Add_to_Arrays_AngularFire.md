# Creating and Adding to Arrays with AngularFire

## Resources

* Firebase's blog post, [Best Practices: Arrays in Firebase](https://www.firebase.com/blog/2014-04-28-best-practices-arrays-in-firebase.html) - _"Arrays are evil"_.
* The [AngularFire Development Guide](https://www.firebase.com/docs/web/libraries/angular/guide/).
* The documentation for [AngularJS providers](https://docs.angularjs.org/guide/providers).

## Overview

As the [AngularFire API Documentation](https://www.firebase.com/docs/web/libraries/angular/api.html) says:

> "There are several powerful techniques for transforming the data downloaded and saved by `$firebaseArray` and `$firebaseObject`. These techniques should only be attempted by advanced Angular users who know their way around the code."

To create and add to data,

* We can extend the AngularFire services, [`$firebaseArray`](https://www.firebase.com/docs/web/libraries/angular/api.html#angularfire-firebasearray) and [`$firebaseObject`](https://www.firebase.com/docs/web/libraries/angular/api.html#angularfire-firebaseobject).
* Follow the documentation for **[extending services](https://www.firebase.com/docs/web/libraries/angular/api.html#angularfire-extending-the-services)**.

## Example

Here is a working **[example PLNKR](http://plnkr.co/edit/lV0pOZxkpPRflV2ydzz7?p=preview)**:

### Extended Error `$firebaseObject`

    .factory('Error', function(fbUrl, ErrorFactory) {
      return function(errorKey){
        var errorRef;
        if(errorKey){
          // Get/set Error by key
          errorRef = new Firebase(fbUrl + '/errors/'+errorKey);
        } else {
          // Create a new Error
          var errorsListRef = new Firebase(fbUrl + '/errors');
          errorRef = errorsListRef.push();
        }
        return new ErrorFactory(errorRef);
      }
    })

    .factory('ErrorFactory', function($firebaseObject){
      return $firebaseObject.$extend({
        sendReply: function(replyObject) {
          if(replyObject.message.isNotEmpty()) {
            this.$ref().child('replies').push(replyObject);
          } else {
            alert("You need to enter a message.");
          }
        }
      });
    })

### Error Controller

    .controller('ErrorController',function($scope, Error) {
      // Set empty reply message
      $scope.replyMessage = '';
    
      // Create a new Error $firebaseObject
      var error = new Error();
      $scope.error = error;
    
      // Send reply to error
      $scope.reply = function(){
          error.sendReply({message:$scope.replyMessage});
      }
    })

### Misc. Code

#### `String.prototype.isNotEmpty()`

    String.prototype.isNotEmpty = function() {
        return (this.length !== 0 && this.trim());
    };
