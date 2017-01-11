# Simple parallax effect for DOM elements in plain js

## Use
Download `parallax.js` and include it in your project. If you use ES6 module you can use `parallaxModule.js` instead.

To enable the parallax effect for an element just call
````
createParallax(options);
````
this function returns an array of the objects created

## Options
| name | type | default value | meaning |
|------|------|---------------|---------|
| el | string/nodeList/HTMLElement/jQuery object | none | the element(s) on which the parallax effect will be enabled |
| initialOffset | int | 50 | the initial vertical offset (in px) that the element has when it enters the viewport |
| randomizeInitialOffset | bool | true | if true a random amount from 0 to value of initialOffset is added to initialOffset itself |
| topMargin | int | 0 | the distance form the viewport top where the element must reach its original position |
| speed | int | 1 | the speed of the element, 1 means that the element goes from initialOffset to the original position in the space between the viewport bottom and topMargin. |
| randomizeSpeed | bool | true | if true a random amount from 0 to 1 is added to speed |
| transitionDuration | string (css value) | '0.4s' | the duration of the transition on the transform: translateY applyed to the element |
| trottleInterval | int | 100 | the trottle interval applied to the scroll listener |
| yoyo | bool | true | if true the element moves down when scrolling up, if false the element move only upwards |
| resetAtScrollDown | bool | true | if true reset the offset to initial value when the element exits the viewport from the bottom (e.g. when scrolling up), even if yoyo is disabled |
