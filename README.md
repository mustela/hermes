#
Hermes - An AngularJS dashboard for [Pivotal Tracker](https://www.pivotaltracker.com/)

***

## Configuration

Configuring Pivotal and Github in Hermes, is quiet easy, you just need to create a constant `ApiConfig` 
```js

(function() {
  'use strict';

  angular
  .module('apiConfig',[])
  .constant('ApiConfig', {
    'pivotal':{
      apiToken:'xxxxxx'
    }, 
    'github':{
      accessToken:'xxxxxxx'
    }
  } );
})();


```

And place it in `/src/common/api-config/api-config.js` 

## Run

`grunt build`
