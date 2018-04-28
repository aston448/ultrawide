
import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

import { TestFixtures } from './test_fixtures.js';

class ViewOptionsVerificationsClass {

    developerViewOption_IsVisible(viewOption) {

        server.call('verifyUserViewOptions.optionIsVisible', viewOption, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );

    };

    developerViewOption_IsHidden(viewOption) {

        server.call('verifyUserViewOptions.optionIsHidden', viewOption, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );

    };

    designerViewOption_IsVisible(viewOption) {

        server.call('verifyUserViewOptions.optionIsVisible', viewOption, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );

    };

    designerViewOption_IsHidden(viewOption) {

        server.call('verifyUserViewOptions.optionIsHidden', viewOption, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );

    };
}

export const ViewOptionsVerifications = new ViewOptionsVerificationsClass();