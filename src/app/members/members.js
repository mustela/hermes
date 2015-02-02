angular
  .module('hermes.members',[])
  .config(function config( $stateProvider) {

    $stateProvider

    .state( 'members', {
      url: 'projects/{projectId}/members',
      views: {
        "main": {
          controller: 'MembersCtrl',
          templateUrl: 'members/members.tpl.html',
          controllerAs:'ctrl',
          resolve:{
            members:function($stateParams, Pivotal){
              return Pivotal.member.all($stateParams.projectId);
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


.controller( 'MembersCtrl', function MembersController( members, project, Pivotal) {

  this.members = members;
  this.project = project;
  this.teams = [];
  var self = this;

  Pivotal.project.teams(this.project.id).then(function(teams){
    self.teams = teams;
  });

})

;