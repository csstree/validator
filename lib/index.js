module.exports = {
    validate: require('./validate.js'),
    reporters: {
        xml: require('./reporter/xml.js'),
        json: require('./reporter/json.js'),
        console: require('./reporter/console.js')
    }
};
