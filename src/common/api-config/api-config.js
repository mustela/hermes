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
            id:'a5133f60-d08d-4cff-a413-20e4645b2636',
            name:'Argentina',
            members:[1486154,1560464,1486150,1486158]
          },
          {
            id:'64858f95-9be5-4159-9d0b-26c4e40d5a5b',
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
