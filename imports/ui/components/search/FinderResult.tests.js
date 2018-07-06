import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import {FinderResult} from './FinderResult.jsx';

import {hashID} from "../../../common/utils";
import {UI} from "../../../constants/ui_context_ids";
import {DisplayContext} from '../../../constants/constants.js'

describe('JSX: Finder Result', () => {

    const DEFAULT_DV_CONTEXT = {
        userId:                         'USER1',
        designId:                       'DESIGN1',
        designVersionId:                'DESIGN_VERSION1',
        designUpdateId:                 'NONE',
        workPackageId:                  'NONE',
        designComponentId:              'NONE',
        designComponentType:            'NONE',
        featureReferenceId:             'NONE',
        featureAspectReferenceId:       'NONE',
        scenarioReferenceId:            'NONE',
        scenarioStepId:                 'NONE',
    };

    const DEFAULT_DU_CONTEXT = {
        userId:                         'USER1',
        designId:                       'DESIGN1',
        designVersionId:                'DESIGN_VERSION1',
        designUpdateId:                 'DESIGN_UPDATE1',
        workPackageId:                  'NONE',
        designComponentId:              'NONE',
        designComponentType:            'NONE',
        featureReferenceId:             'NONE',
        featureAspectReferenceId:       'NONE',
        scenarioReferenceId:            'NONE',
        scenarioStepId:                 'NONE',
    };

    function testFinderResult(result, displayContext, userContext){

        return shallow(
            <FinderResult
                result={result}
                displayContext={displayContext}
                userContext={userContext}
            />
        )
    }

    describe('Interface', () => {

        describe('The matching Scenario shows the Feature and Scenario name', () => {

            it('correct result for design', () => {

                const displayContext = DisplayContext.BASE_VIEW;
                const result = {
                    featureName:    'FEATURE1',
                    scenarioName:   'SCENARIO1'
                };

                const item = testFinderResult(result, displayContext, DEFAULT_DV_CONTEXT);

                chai.assert.equal(item.find('#find-result-feature').text(), result.featureName);
                chai.assert.equal(item.find('#find-result-scenario').text(), result.scenarioName);
            });

            it('correct result for update', () => {

                const displayContext = DisplayContext.UPDATE_SCOPE;
                const result = {
                    featureName:    'FEATURE1',
                    scenarioName:   'SCENARIO1'
                };

                const item = testFinderResult(result, displayContext, DEFAULT_DU_CONTEXT);

                chai.assert.equal(item.find('#find-result-feature').text(), result.featureName);
                chai.assert.equal(item.find('#find-result-scenario').text(), result.scenarioName);
            });
        });
    });
});
