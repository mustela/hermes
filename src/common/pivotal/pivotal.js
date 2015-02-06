(function() {
  'use strict';

  angular
  .module('pivotal',['rest','apiConfig'])
  .factory('Pivotal', ['$q', 'Rest','ApiConfig', function($q, Rest, ApiConfig){

    var base;
    var localMembers = [];

    /*
    
    BASE DEFINITION 

    */
    var Base = function(){
      this.apiToken = ApiConfig.pivotal.apiToken;
      this.rest = new Rest('https://www.pivotaltracker.com/services/v5/', {headers:{'X-TrackerToken':this.apiToken}});
      this.defaultProject = ApiConfig.pivotal.defaultProject;

    };
 

    /*

    MEMBER DEFINITION

    */
    var Member = function(projectApi){
      this.projectApi = projectApi;

      Base.call(this);

    };

    Member.prototype = Object.create(Base.prototype);

    /*

    BUILD STATS

    */
    function buildStats(query){
      
          var stats = {
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

          angular.forEach(query.stories.stories,function(story){
            stats.types[story.story_type]+=1;
            stats.states[story.current_state]+=1;

            angular.forEach(story.labels,function(label){
              if (!angular.isDefined(stats.labels[label.name])){
                stats.labels[label.name] = 0;
              }

              stats.labels[label.name]+=1;
            });

          });
          
          stats.states.unstartedTotal = stats.states.unstarted + stats.states.planned + stats.states.unscheduled;

          query.done   = query.stories.total_hits_with_done - query.stories.total_hits;
          query.total  = query.stories.total_hits_with_done + query.stories.total_hits;
          query.stats  = stats;

          return query;

    }


    Member.prototype.stories = function(projectId, memberId){
        var storiesDeferred = $q.defer();

        
        this.rest.get('projects/{projectId}/search?query=owner:{memberId} and -state:unscheduled&fields=stories(stories(:default,comments,owned_by))'.supplant({projectId:projectId,memberId:memberId})).then(function(query){

          query = buildStats(query);
          
          storiesDeferred.resolve(query);

        });

        return storiesDeferred.promise;
    };

    Member.prototype.get = function(projectId, memberId, include){
        var self = this;
        var memberFound = false;
        var deferred = $q.defer();
        include = include || {};

        this.all(projectId).then(function(members){
          angular.forEach(members,function(member){

            if ( member.person.id == memberId){

              if ( !angular.isDefined(member.imageUrl)){
                member.person.imageUrl = Utils.prototype.getGravatarImageUrl(member.person.email);
              }

              if ( angular.isDefined(include.stories )){
                self.stories(projectId, memberId).then(function(query){
                  member.query = query;
                  deferred.resolve(member);
                });
              }
              else{
                deferred.resolve(member);
              }
              
              return;
            }
          });
        });

        return deferred.promise;
    };

    Member.prototype.all = function(projectId){
      var deferred = $q.defer();

        //TODO: We need to implement a better way of dealing with members cache
        if (localMembers.length>0){
          deferred.resolve(localMembers);
          return deferred.promise;
        }

        this.rest.get('projects/{projectId}/memberships'.supplant({projectId:projectId})).then(function(members){

          // We have to save the members, because there is no way to get information about one single person :(
          localMembers = members;


          var MD5 = new Hashes.MD5();
          angular.forEach(members, function(member){
            member.person.imageUrl = "http://www.gravatar.com/avatar/{md5}".supplant({md5:MD5.hex(member.person.email)});
          });

          deferred.resolve(members);
        });

        return deferred.promise;
    };

    /*
    
    PROJECT DEFINITION 

    */
    var Project = function(memberApi){
      this.memberApi = memberApi;

      Base.call(this);
    };

    Project.prototype = Object.create(Base.prototype);

    Project.prototype.teams = function(projectId){

        var teamDeferred = $q.defer();
        var teams = [];
        var self = this;

        if ( angular.isDefined(ApiConfig.pivotal.projects)){
          angular.forEach(ApiConfig.pivotal.projects, function(project){
            if ( project.id == projectId){
              
              angular.forEach(project.teams,function( configTeam ){
                var team = {
                    name:configTeam.name,
                    id:configTeam.id,
                    members:[]
                  };

                angular.forEach(configTeam.members,function(memberTeam){
                  self.memberApi.get(projectId, memberTeam).then(function(membership){
                    team.members.push(membership);
                  });

                });

                teams.push(team);
              });

              return;
            }
          });
        }

        teamDeferred.resolve(teams);

        return teamDeferred.promise;
      };

    Project.prototype.team = function(projectId, teamId){

        var teamDeferred = $q.defer();
        var self = this;

        if ( angular.isDefined(ApiConfig.pivotal.projects)){
          angular.forEach(ApiConfig.pivotal.projects, function(project){
            if ( project.id == projectId){
              
              angular.forEach(project.teams,function( configTeam ){

                if ( configTeam.id == teamId ){
                  var team = {
                    name:configTeam.name,
                    id:configTeam.id,
                    members:[] 
                  };
                  
                  var query = false;

                  angular.forEach(configTeam.members,function(memberTeam){
                    if ( !query ){
                      query = 'owner:{memberId}'.supplant({memberId:memberTeam});
                    }
                    else{
                      query += ' or owner:{memberId}'.supplant({memberId:memberTeam});
                    }

                    self.memberApi.get(projectId, memberTeam ).then(function(membership){
                      team.members.push(membership);
                    });
                  });
        
                  self.rest.get('projects/{projectId}/search?query=({query}) and -state:unscheduled&fields=stories(stories(:default,comments,owned_by))'.supplant({projectId:projectId,query:query})).then(function(query){

                    query = buildStats(query);

                    team.query = query;
                    teamDeferred.resolve(team);
                  });

                  return;
                }
                
              });
            }
          });
        }

        return teamDeferred.promise;
    };

    Project.prototype.icebox = function(projectId){
      var iceboxDefer = $q.defer();

       this.rest.get('projects/{projectId}/search?query=state:unscheduled&fields=stories(stories(:default,comments,owned_by))'.supplant({projectId:projectId})).then(function(query){
          query = buildStats(query);

          iceboxDefer.resolve(query);
       });

       return iceboxDefer.promise;
    };

    Project.prototype.get = function(projectId){
        return this.rest.get('projects/{projectId}'.supplant({projectId:projectId}));
    };

    Project.prototype.all = function(){
        return this.rest.get('projects');
    };

    var Api = function(){
    };

    Api.prototype.project = new Project(new Member());
    Api.prototype.member = new Member(new Project());

    return new Api();

  }] );
})();