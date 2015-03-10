(function() {
  'use strict';

  angular
  .module('apiConfig',[])
  .constant('ApiConfig', {
    pivotal:{
      apiToken:'xxxxx',
      me:'1486154',
      defaultProject:1168276,
      projects:[{
          id:1168276,
          teams:[{
            id:'xxxxx',
            name:'Argentina',
            members:[1486154,1560464,1486150,1486158]
          },
          {
            id:'xxxxxxx',
            name:'Indo',
            members:[1487148,1512672,1512674,1512676, 1539124]
          }]
      }]
    },
    github:{
      accessToken:'xxxx'
    }
  } );
})();
