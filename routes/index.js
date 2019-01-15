const auth = require('./api/auth');
const savedata = require('./api/savedata');
const updatedata = require('./api/updatedata');
const removedata = require('./api/removedata');
const finddata = require('./api/finddata');

const page_routes = require('./page_routes/index')

module.exports = {
    auth,
    savedata,
    updatedata,
    removedata,
    finddata,
    page_routes
};