(function() {
  'use strict';

  angular
  .module('components.stories.comments',[])
  .directive('hsComments', [function(){
    return {
      restrict: 'EA',
      // replace: true,
      templateUrl: 'components/stories/tooltip.tpl.html',
      scope: { content: '=',comments:'=', placement: '@', animation: '&', isOpen: '&' },
      link: function(scope, element, attrs){
        $(element).popover({
                trigger: 'click',
                html: true,
                content: "hello there!"
                //placement: attrs.popoverPlacement
            });
      }
    };
  }]);

})();

