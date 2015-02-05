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
          member:'=',
          query:'=',
          selectedState:'=',
          selectedLabel:'='
        },
        link:function(scope,element,attrs){

          scope.filterByState = function(state){
            this.selectedState = {current_state:state};
          };

          scope.filterByLabel = function(label){
            this.selectedLabel = label;
          };

        }
    };
}]);
})();