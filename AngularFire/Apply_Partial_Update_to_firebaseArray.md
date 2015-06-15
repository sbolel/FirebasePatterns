# How To Apply Partial Update To An Item In `$firebasearray`

## Resources

* AngularFire Documentation
  - [`$firebaseArray $add()`](https://www.firebase.com/docs/web/libraries/angular/api.html#angularfire-firebasearray-addnewdata)
  - [`$firebaseArray $save()`](https://www.firebase.com/docs/web/libraries/angular/api.html#angularfire-firebasearray-saverecordorindex)
  - [`$firebaseArray $getRecord()`](https://www.firebase.com/docs/web/libraries/angular/api.html#angularfire-firebasearray-getrecordkey)

## Code

[Example PLNKR](http://plnkr.co/edit/blkh4M4WOJPmcwv6HtJi?p=preview)

### Basic Usage

```js
var ref = new Firebase(fbUrl+'/items');
itemsList = $firebaseArray(ref);
$scope.items = itemsList;

$scope.addItemObject = function() {
  var someItem = {};
  someItem.newField = 'test';
  itemsList.$add(someItem);
  console.log('$scope.items is',$scope.items);
}

$scope.updateItem = function() {
  console.log('$scope.items was',$scope.items);
  var id = prompt("Enter $id to update");
  var someItem = itemsList.$getRecord(id);
  var newField = prompt('Enter new value for newField');
  someItem.newField = newField;
  itemsList.$save(someItem).then(function(ref) {
    console.log('$scope.items is now',$scope.items);
  });;
}
```

### Advanced Usage

#### Factory

```js
.factory('ItemsFactory', function($firebaseArray, fbUrl){
  return function(){
    var ref = new Firebase(fbUrl+'/items');
    return new $firebaseArray(ref);
  }
})

.controller('HomeController',function($scope, ItemsFactory, fbUrl) {

    itemsList = new ItemsFactory();
    $scope.items = itemsList;
    
    $scope.addItemObject = function() {
      var someItem = {};
      someItem.newField = 'test';
      itemsList.$add(someItem);
      console.log('$scope.items is',$scope.items);
    }
    
    $scope.updateItem = function() {
      console.log('$scope.items was',$scope.items);
      var id = prompt("Enter $id to update");
      var someItem = itemsList.$getRecord(id);
      var newField = prompt('Enter new value for newField');
      someItem.newField = newField;
      itemsList.$save(someItem).then(function(ref) {
        console.log('$scope.items is now',$scope.items);
      });
    }

 })
```

#### HTML

```html
  <body ng-app="myApp">
    <div ng-controller="HomeController">
      <h2>Home Template</h2>
      <button ng-click="addItemObject()">Add Item Object</button>
      <button ng-click="updateItem()">Update Item</button>
      <div>Items:</div>
      <div ng-repeat="item in items">
        <span>{{item}}</span>
      </div>
    </div>
  </body>
```
