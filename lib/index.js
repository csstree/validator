module.exports = {
    validate: require('./validate.js'),
    reporters: {
        json: require('./reporter/json.js'),
        console: require('./reporter/console.js'),
        checkstyle: require('./reporter/checkstyle.js'),
    }
};
