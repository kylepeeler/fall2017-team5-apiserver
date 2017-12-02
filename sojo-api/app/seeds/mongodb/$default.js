const dab         = require ('@onehilltech/dab')
  ,   gatekeeper  = require ('@onehilltech/blueprint-gatekeeper')
  ,   ObjectId    = require ('@onehilltech/blueprint-mongodb').Types.ObjectId
  ;

const scopes = [
  ['*'],
  [],
  []
];

const LOGIN_CLIENTS = {
  'ember-sojo-frontend': 0,
};

const is_test = (process.env.NODE_ENV === 'test');

module.exports = (is_test) ? {} : { 
  clients: dab.times (1, (i, opts, callback) => {
    let name = 'ember-sojo-frontend';
    let client_id = process.env.CLIENT_OBJECT_ID;
    let client_secret = process.env.CLIENT_SECRET;
    let recaptcha_secret = process.env.RECAPTCHA_SECRET;

    return callback(null, {
      _id: client_id,
      name,
      client_secret,
      email: name + '@no-reply.com',
      type: 'native',
      scope: [gatekeeper.scope.account.create],
      recaptcha_secret
    });
  }),

  accounts: dab.times (1, (i, opts, callback) => {
    var username = 'ember-sojo-frontend';
   
    return callback(null, {
      created_by: dab.ref ('clients.0'),
      username,
      password: username,
      email: username + '@no-reply.com'
    });
  }),

  user_tokens: dab.map (dab.get ('accounts'), (account, opts, callback) => {
    const clientIndex = LOGIN_CLIENTS[account.username];
  
    return callback(null, {
      client: dab.get ('clients.0'),
      account: account._id,
      refresh_token: new ObjectId (),
      scope: scopes[clientIndex]
    });
  }),

  client_tokens: dab.map (dab.get ('clients'), (client, opts, callback) => {
    return callback (null, {client: client._id});
  }),

  profiles: dab.map (dab.get ('accounts'), (account, opts, callback) => {
    return callback (null, {
      full_name: 'Kyle Peeler',
      has_bill_pay_setup: false,
      has_signed_lease: false,
      phone: '(777) 555-3333',
      sojo_events: [new ObjectId ('888888888888888888888888')],
      account_id: account._id,
      account_picture_url: 'http://randomimage.png'
    });
  }),

  sojo_events: dab.map (dab.get ('accounts'), (account, opts, callback) => {
    return callback (null, {
      _id: new ObjectId ('888888888888888888888888'),
      name: 'Fish Sale',
      date: new Date(),
      start_time: new Date(2017, 2, 2, 12),
      end_time: new Date(2017, 2, 2, 4),
      description: 'Cookout Garden',
      attendees: [account._id],
      is_private: false
    });
  }),

  leases: dab.map (dab.get ('accounts'), (account, opts, callback) => {
    return callback (null, {
      _id: new ObjectId ('777777777777777777777777'),
      rent_amount: 500,
      start_date: new Date(2017, 1, 1),
      end_date: new Date(2018, 1, 1),
      lease_type: 'One year Lease',
      account_id: account._id
    });
  }),

  units: dab.map (dab.get ('accounts'), (account, opts, callback) => {
    return callback (null, {
      _id: new ObjectId ('444444444444444444444444'),
      unit_index: 'b',
      building_index: '221',
      address: '1234 foobar drive',
      city: 'Indianapolis',
      state: 'Indiana',
      zip: 42556,
      maintenance_email: 'main@no-reply.com',
      landlord_email: 'landlord@no-reply.com',
      account_id: account._id
    });
  }),

  utilities: dab.map (dab.get ('accounts'), (account, opts, callback) => {
    let company_name = 'att';
    return callback (null, {
      _id: new ObjectId ('222222222222222222222222'),
      company_name,
      url: company_name + '.com',
      due_date: new Date(),
      account_id: account._id
    });
  }),

  payments: dab.times (2, (i, opts, callback) => {
    var is_even = i % 2 === 0;

    if (is_even) {
      return callback (null, {
        account_id: dab.ref ('accounts.0'),
        amount_paid: 1000,
        date_paid: new Date(),
        payment_type: 'lease',
        payment_object: dab.ref ('leases.0')
      });
    }
    else {
      return callback (null, {
        account_id: dab.ref ('accounts.0'),
        amount_paid: 1000,
        date_paid: new Date(),
        payment_type: 'utility',
        payment_object: dab.ref ('utilities.0')
      });
    }
  })
};
