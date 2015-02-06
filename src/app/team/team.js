angular
  .module('hermes.team',['components.stories'])
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

})

;