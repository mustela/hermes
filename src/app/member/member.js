
angular
.module('hermes.member',['components.stories.stateLabel'])
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

  this.filter   ={
    state:'',
    type:'',
    label:''
  };

  this.stats    = {
    types:{
      bug:0,
      chore:0,
      feature:0
    },
    states:{
      delivered:0,
      finished:0,
      planned:0,
      unscheduled:0,
      unstarted:0,
      accepted:0,
      started:0
    },
    labels:{}
  };

  var self      = this;
  this.show = {
    description : false
  };

  this.showDescriptions = function(){
    this.show.description = !this.show.description;
  };

  angular.forEach(this.query.stories.stories,function(story){
    self.stats.types[story.story_type]+=1;
    self.stats.states[story.current_state]+=1;

    angular.forEach(story.labels,function(label){
      if (!angular.isDefined(self.stats.labels[label.name])){
        self.stats.labels[label.name] = 0;
      }

      self.stats.labels[label.name]+=1;
    });

  });
  console.log(self.stats.states);    
  self.stats.states.unstartedTotal = self.stats.states.unstarted + self.stats.states.planned + self.stats.states.unscheduled;

  this.query.done   = query.stories.total_hits_with_done - query.stories.total_hits;
  this.query.total  = query.stories.total_hits_with_done + query.stories.total_hits;

  this.filterByState = function(state){
    this.filter.state = {current_state:state};
  };

  this.filterByLabel = function(label){
    this.filter.label = label;
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
