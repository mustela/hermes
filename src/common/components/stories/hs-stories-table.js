(function() {
  'use strict';

  angular
  .module('components.stories.storiesTable',[])
  .directive('hsStoriesTable', [function(){
    return {
      replace:true,
      restrict:'E',
      templateUrl:'components/stories/hs-stories-table.tpl.html',
      scope:{
        query:'='
      },
      link:function(scope,element,attrs) {

        scope.selectedLabel = '';
        scope.selectedState = '';

        scope.filter ={
          state:'',
          type:'',
          label:'',
          strict:function(){
            return this.state && angular.isDefined(this.state.current_state) && this.state.current_state.length>0;
          }
        };

          scope.show = {
            description : false
          };

          scope.filterByState = function(state){
            scope.filter.state = {current_state:state};
          };

          scope.filterByLabel = function(label){
            scope.filter.label = label;
          };

          scope.showDescriptions = function(){
            scope.show.description = !scope.show.description;
          };

          scope.labels = function(labelFilter) {
            return function(story) {
             if ( !labelFilter ){
              return true;
            }
            var result = false;
            angular.forEach(story.labels,function(label){
              if (label.name == labelFilter){
                return result = true;
              }
            });

            return result;
          };
        };
      }
    };
  }]);
})();