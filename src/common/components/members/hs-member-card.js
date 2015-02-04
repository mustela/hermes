(function() {
  'use strict';

  angular
  .module('components.members.memberCard',[])
  .directive('hsMemberCard', [function(){
    return {
        replace:true,
        restrict:'E',
        link:function(scope,element,attrs){

        }
    };
}]);
})();