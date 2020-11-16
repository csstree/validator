const {
    validatePathList,
    validatePath,
    validateFile,
    validateDictionary,
    validateString
} = require('./validators.js');

module.exports = {
    validatePathList,
    validatePath,
    validateFile,
    validateDictionary,
    validateString,
    reporters: require('./reporter')
};
