(function() {
  'use strict';

  angular
  .module('components.stories.stateLabel',[])
  .directive('hsStateLabel', [function(){
    return {
        replace:true,
        restrict:'E',
        templateUrl:'components/stories/hs-state-label.tpl.html',
        scope:{
          state:'@'
        },
        link:function(scope,element,attrs){

          var stateObj = {
            label:'',
            icon:''
          };


          switch(scope.state){
            case 'finished':
              stateObj.icon = 'fa-check-circle-o text-success';
              break;
            case 'delivered':
              stateObj.icon = 'fa-rocket text-warning';
              break;
            case 'planned':
              stateObj.icon = 'fa-calendar';
              break;
            case 'unscheduled':
              stateObj.icon = 'fa-calendar-o';
              break;
            case 'unstarted':
              stateObj.icon = 'fa-square-o';
              break;
            case 'started':
              stateObj.icon = 'fa-play text-success';
              break;
            case 'accepted':
              stateObj.icon = 'fa-smile-o';
              break;

          }

          stateObj.label = scope.state.capitalize();

          scope.stateObj = stateObj;
        }
    };
}]);
})();