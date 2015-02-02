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

    Member.prototype.stories = function(projectId, memberId){
        return this.rest.get('projects/{projectId}/search?query=owner:{memberId}'.supplant({projectId:projectId,memberId:memberId}));
    };

    Member.prototype.get = function(projectId, memberId){
        var self = this;
        var memberFound = false;
        var deferred = $q.defer();


        this.all(projectId).then(function(members){
          angular.forEach(members,function(member){

            if ( member.person.id == memberId){

              if ( !angular.isDefined(member.imageUrl)){
                member.person.imageUrl = Utils.prototype.getGravatarImageUrl(member.person.email);
              }
              deferred.resolve(member);
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

    Project.prototype.get = function(projectId){
        return this.rest.get('projects/{projectId}'.supplant({projectId:projectId}));
    };

    Project.prototype.all = function(){
        return this.rest.get('projects');
    };

    var Api = function(){
    };

    Api.prototype.project = new Project(Object.create(Member.prototype));
    Api.prototype.member = new Member(Object.create(Project.prototype));

    return new Api();

  }] );
})();