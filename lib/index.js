var validators = require('./validate.js');

module.exports = {
    validatePathList: validators.validatePathList,
    validatePath: validators.validatePath,
    validateFile: validators.validateFile,
    validateString: validators.validateString,
    reporters: require('./reporter')
};
