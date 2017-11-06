import { Meteor } from 'meteor/meteor';

import DocumentExportServices   from '../../server/doc/document_export_services.js';


// Meteor methods
Meteor.methods({

    'document.exportWordDocument'(designId, designVersionId) {

        //console.log('Adding new Feature Background Step');
        DocumentExportServices.exportWordDocument(designId, designVersionId);

    }

});