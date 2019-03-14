const handlers = require('../lib/handlers');


// Define a request router
let router = {};

router.hello= handlers.hello;

module.exports = router;