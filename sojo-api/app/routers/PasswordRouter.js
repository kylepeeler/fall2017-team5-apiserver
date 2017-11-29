let cors = require ('cors')
;

const corsOptions = {
  methods: ['GET', 'POST', 'PUT', 'DELETE']
};

module.exports = {
  use: [cors (corsOptions)],
  '/forgot': {
    post: { action: 'PasswordController@forgotPassword' }
  }
}