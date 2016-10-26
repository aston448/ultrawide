// import ClientLoginServices from '../../../imports/apiClient/apiClientLogin.js';
import {RoleType} from '../../../imports/constants/constants.js';

// import Designs from '../../../imports/collections/design/designs.js';



(function () {

    'use strict';


    module.exports = function () {

        this.Given(/^a new instance of Ultrawide$/, function () {

            server.call('fixtures.startup');
        });

        this.When(/^I log in as a Designer$/, function () {

            server.call('test.createMeteorUser', RoleType.DESIGNER);

        });

        this.When(/^I add a new Design$/, function () {

            server.call('test.addNewDesign');

        });

        this.Then(/^A new Design is added to the Designs list$/, function () {

            let result = server.execute(() => {
                const {Designs} = require('/imports/collections/design/designs.js');
                return Designs.find({designName: 'New Design'}).count();
             });

            expect(result).toEqual(1);

        });

    }
})();
