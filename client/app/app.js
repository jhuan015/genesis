angular.module('genesis', [
  'genesis.auction',
  'genesis.profile',
  'genesis.auth',
  'genesis.chat',
  'genesis.services',
  'genesis.video',
  'genesis.home',
  'genesis.header',
  'ui.router',
  'pubnub.angular.service'
])
.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
 $urlRouterProvider.when('', '/auctions');
 $urlRouterProvider.otherwise('');

  $stateProvider
  .state('home', {
    authenticate: true,
    url: '/auctions',
    views: {
      '': {
        templateUrl: 'app/auction/home.html',
        controller: 'HomeController'
        },
      'header@home': {
        templateUrl: 'app/auction/header/header.html',
        controller: 'HeaderController'
      }
    }
  })
  .state('auction', {
      authenticate: true,
      url: '/auctions/:id',
      views: {
        '' : {
          templateUrl: 'app/auction/auctions/auction.html',
          controller: 'AuctionController'
        },
        'vidcontrols@auction': {
          templateUrl: 'app/auction/video/vidcontrols.html',
          controller: 'VideoController'
        },
        'chat@auction': {
          templateUrl: 'app/auction/chat/chat.html',
          controller: 'ChatController'
        },
        'video@auction': {
          templateUrl: 'app/auction/video/video.html',
          controller: 'VideoController'
        },
        'header@auction': {
          templateUrl: 'app/auction/header/header.html',
          controller: 'HeaderController'
        }
      }
    })
  .state('signin', {
        url: '/signin',
        views: {
          '' : {
            templateUrl: 'app/auth/signin.html',
            controller: 'AuthController'
          },
          'header@signin': {
            templateUrl: 'app/auction/header/header.html',
            controller: 'HeaderController'
          }
        }
    })
  .state('signup', {
          url: '/signup',
          views: {
            '' : {
              templateUrl: 'app/auth/signup.html',
              controller: 'AuthController'
            },
            'header@signup': {
              templateUrl: 'app/auction/header/header.html',
              controller: 'HeaderController'
            }
          }
    })
  .state('profile', {
          authenticate: true,
          url: '/profile',
          views: {
            '' : {
              templateUrl: 'app/profile/profile.html',
              controller: 'ProfileController'
            },
            'header@profile': {
              templateUrl: 'app/auction/header/header.html',
              controller: 'HeaderController'
            }
          }
    })


  $httpProvider.interceptors.push('AttachTokens');
})
.factory('AttachTokens', function ($window) {
  // this is an $httpInterceptor
  // its job is to stop all out going request
  // then look in local storage and find the user's token
  // then add it to the header so the server can validate the request
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.genesis');
      if (jwt) {
        jwt = JSON.parse(jwt);
        object.headers['x-access-token'] = jwt.token;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})
.run(function ($rootScope, $state, Auth) {
  $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams){
   if (toState.authenticate && !Auth.isAuth()) {
     $state.transitionTo("signin");
     event.preventDefault();
   }
 });
});
