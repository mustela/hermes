angular.module( 'hermes', [
  'templates-app',
  'templates-common',
  'angular-loading-bar',
  'hermes.home',
  'hermes.about',
  'hermes.members',
  'hermes.member',
  'ui.router',
  'ui.bootstrap',
  'nvd3ChartDirectives',
  'angularMoment',
  'angular.filter'
  ])

.config( function hermesConfig ( $stateProvider, $urlRouterProvider, cfpLoadingBarProvider ) {

 cfpLoadingBarProvider.includeSpinner = false;

 $urlRouterProvider.otherwise( '/home' );
 
})

.run( function run () {
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | hermes' ;
    }
  });
})

;

