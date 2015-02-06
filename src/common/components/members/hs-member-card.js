(function() {
  'use strict';

  angular
  .module('components.members.memberCard',[])
  .directive('hsMemberCard', ['Pivotal', function(Pivotal){
    return {
        replace:true,
        restrict:'E',
        templateUrl:'components/members/hs-member-card.tpl.html',
        scope:{
          project:'=', 
          member:'='
        },
        link:function(scope,element,attrs){

          

        }
    };
}]);
})();