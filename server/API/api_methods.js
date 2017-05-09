
SimpleRest.setMethodOptions('upload-file', {

    url: "api/v1/upload-file",

    getArgsFromRequest: (request) => {

        const header = request.headers;
        const file = request.body;

        return [file, header.name];
    }
});

import TestOutputLocationServices          from '../../imports/servicers/configure/test_output_location_services.js';

Meteor.methods({

    'upload-file': (locationFile, name) => {

        TestOutputLocationServices.uploadTestResultsFile(locationFile, name, '', 'binary');

    }
});

