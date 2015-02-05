
angular
.module('hermes.member',['components.stories.stateLabel', 'components.members.memberCard'])
.config(function config( $stateProvider) {

  $stateProvider.state( 'member', {
    url: 'projects/{projectId}/member/{memberId}',
    views: {
      "main": {
        controller: 'MemberCtrl',
        templateUrl: 'member/member.tpl.html',
        controllerAs:'ctrl',
        resolve:{
          project:function($stateParams, Pivotal){
            return Pivotal.project.get($stateParams.projectId);
          }, 
          query:function($stateParams, Pivotal){
            return Pivotal.member.stories($stateParams.projectId, $stateParams.memberId);
          },
          member:function($stateParams, Pivotal){
            return Pivotal.member.get($stateParams.projectId, $stateParams.memberId);
          },
          members:function($stateParams, Pivotal){
            return Pivotal.member.all($stateParams.projectId);
          },
          teams:function($stateParams, Pivotal){
            return Pivotal.project.teams($stateParams.projectId);
          }
        }
      }
    },
    data:{ pageTitle: 'Member' }
  });
})


.controller( 'MemberCtrl', function MemberController( $stateParams, project, query, Pivotal, member, members, teams) {
  this.project  = project;
  this.query    = query;
  this.member   = member;
  this.members  = members;
  this.teams    = teams;
  this.stats    = query.stats;

  this.filter   ={
    state:'',
    type:'',
    label:'',
    strict:function(){
      return this.state && angular.isDefined(this.state.current_state) && this.state.current_state.length>0;
    }
  };


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
