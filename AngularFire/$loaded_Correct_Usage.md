# Correct Usage of `$loaded()`

_One of the topics I see often in the Firebase tag of StackOverflow is the misuse/overuse of the `$loaded()` method in AngularFire. Here are some examples:_

* http://stackoverflow.com/q/29834986/1526037
* http://stackoverflow.com/q/30880350/1526037

## Information

As the [Intro to AngularFire](https://www.firebase.com/docs/web/libraries/angular/guide/intro-to-angularfire.html#section-async-intro) guide states,

> The [`$loaded()`](https://www.firebase.com/docs/web/libraries/angular/api.html#angularfire-firebaseobject-loaded) method should be used with care as it's only called once after initial load. Using it for anything but debugging is usually a poor practice.

As Frank van Puffelen states in a comment,

> "If you're using `$loaded()` straight after `$firebaseObject` (or `$firebaseArray`), you're probably doing something wrong." <sup>[(source)][1]</sup>

### Hints

* If you're not binding the data to the screen, you should not need AngularFire.

## Example

_Coming soon._


<!-- Sources -->

[1]: http://stackoverflow.com/questions/29834986/saving-new-property-overwrites-firebase-object/29835485#comment47798344_29835485
