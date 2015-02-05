angular
  .module('hermes.team',[])
  .config(function config( $stateProvider) {

    $stateProvider

    .state( 'team', {
      url: 'projects/{projectId}/team/{teamId}',
      views: {
        "main": {
          controller: 'TeamCtrl',
          templateUrl: 'team/team.tpl.html',
          controllerAs:'ctrl',
          resolve:{
            team:function($stateParams, Pivotal){
              return Pivotal.project.team($stateParams.projectId, $stateParams.teamId);
            },
            project:function($stateParams, Pivotal){
              return Pivotal.project.get($stateParams.projectId);
            }
          }
        }
      },
      data:{ pageTitle: 'Members' }
    });
})


.controller( 'TeamCtrl', function MembersController( team, project) {

  this.project = project;
  this.team  = team;
  this.query = team.query;


  this.filter   ={
    state:'',
    type:'',
    label:'',
    strict:function(){
      return this.state && angular.isDefined(this.state.current_state) && this.state.current_state.length>0;
    }
  };

  //This need to be moved to a directive
  var self= this;
  this.show = {
    description : false
  };

  this.showDescriptions = function(){
    this.show.description = !this.show.description;
  };


  this.labels = function(labelFilter) {
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

})

;