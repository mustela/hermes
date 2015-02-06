angular
  .module('hermes.icebox',[])
  .config(function config( $stateProvider) {

    $stateProvider

    .state( 'icebox', {
      url: 'projects/{projectId}/icebox',
      views: {
        "main": {
          controller: 'IceboxCtrl',
          templateUrl: 'icebox/icebox.tpl.html',
          controllerAs:'ctrl',
          resolve:{
            members:function($stateParams, Pivotal){
              return Pivotal.member.all($stateParams.projectId);
            },
            project:function($stateParams, Pivotal){
              return Pivotal.project.get($stateParams.projectId);
            },
            query:function($stateParams, Pivotal){
              return Pivotal.project.icebox($stateParams.projectId);
            }
          }
        }
      },
      data:{ pageTitle: 'Members' }
    });
})


.controller( 'IceboxCtrl', function MembersController( members, project, query) {

  this.members = members;
  this.project = project;
  this.query   = query;
})

;