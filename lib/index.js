const {
    validatePathList,
    validatePath,
    validateFile,
    validateString
} = require('./validate.js');

module.exports = {
    validatePathList,
    validatePath,
    validateFile,
    validateString,
    reporters: require('./reporter')
};
