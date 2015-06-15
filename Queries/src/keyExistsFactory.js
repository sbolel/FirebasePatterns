app.factory("KeyExistsFactory",function($q, fbUrl){
  return function(listName, shouldHaveSomeKey, keyString){
    var deferred = $q.defer();
    var ref = new Firebase(fbUrl+'/'+listName).orderByChild(keyString);
    var query;
    if (shouldHaveSomeKey) {
      query = ref.startAt(!null);
      // or: 
      // query = ref.startAt(true);
    } else {
      query = ref.equalTo(null);
      // or:
      // query = ref.endAt(!null);
      // query = ref.endAt(true);
    }
    query.once("value", function(dataSnapshot){
      deferred.resolve(dataSnapshot.val());
    }, function (error) {
      deferred.reject(error);
    });
    return deferred.promise;
  }
});