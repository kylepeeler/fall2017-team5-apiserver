var blueprint = require ('@onehilltech/blueprint')
, expect      = require ('chai').expect
;

describe ('Lease', function () {
  describe ('/leases/:account_id', function () {
    context ('GET', function () {
      it ('should get a lease', function (done) {
        const accessToken = blueprint.app.seeds.$default.user_tokens[0].serializeSync ();
        const account0 = blueprint.app.seeds.$default.accounts[0];
        blueprint.testing.request ()
          .get ('/leases/' + account0._id)
          .set('Authorization', 'Bearer ' + accessToken.access_token)
          .expect (200, done);
      });
    });
  });
});
