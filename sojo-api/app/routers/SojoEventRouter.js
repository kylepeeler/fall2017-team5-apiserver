module.exports = {
  '/events': {
    policy: 'gatekeeper.auth.bearer',
    resource: {
      controller: 'SojoEventController'
    },
    '/account': {
      '/:accountId': {
        get: { action: 'SojoEventController@getAccountEvents'}
      }
    }
  }
}