(function() {
  'use strict';

  angular
  .module('apiConfig',[])
  .constant('ApiConfig', {
    pivotal:{
      apiToken:'3e511ae6b1a062939bef4748fe725bd1',
      me:'1486154',
      defaultProject:1168276,
      projects:[{
          id:1168276,
          teams:[{
            name:'Argentina',
            members:[1486154,1560464,1486150,1486158]
          },
          {
            name:'Indo',
            members:[1487148,1512672,1512674,1512676, 1539124]
          }]
      }]
    },
    github:{
      accessToken:'5c395d3b298f77c9b1cca7cdc266fdf19ca97b1f'
    }
  } );
})();
