module.exports = {
    validate: require('./validate.js'),
    reporters: {
        console: require('./reporter/console.js'),
        checkstyle: require('./reporter/checkstyle.js')
    }
};
