import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import Narrative from './Narrative.jsx';  // Non Redux wrapped

import { DesignVersionStatus, RoleType, ViewType, ViewMode, DisplayContext, ComponentType} from '../../../constants/constants.js'

describe('JSX: Narrative', () => {

    describe('Interface', () => {

        describe('A Narrative has an option to edit it', () => {

            it('has an edit option', () => {

                const designComponent = {};
                const wpItem = {};
                const mode = ViewMode.MODE_EDIT;
                const view = ViewType.DESIGN_NEW;
                const displayContext = DisplayContext.BASE_EDIT;
                const testSummary = false;
                const domainTermsVisible = true;

                const item = shallow(
                    <Narrative
                        designComponent={designComponent}
                        wpComponent={wpItem}
                        mode={mode}
                        view={view}
                        displayContext={displayContext}
                        testSummary={testSummary}
                        domainTermsVisible={domainTermsVisible}
                    />
                );

                chai.assert(item.find('#actionEditNarrative').length === 1, 'Edit option not found!');
            });
        });

        describe('A Narrative being edited has an option to save changes', () => {

            it('has a save option', () => {

                const designComponent = {};
                const wpItem = {};
                const mode = ViewMode.MODE_EDIT;
                const view = ViewType.DESIGN_NEW;
                const displayContext = DisplayContext.BASE_EDIT;
                const testSummary = false;
                const domainTermsVisible = true;

                const item = shallow(
                    <Narrative
                        designComponent={designComponent}
                        wpComponent={wpItem}
                        mode={mode}
                        view={view}
                        displayContext={displayContext}
                        testSummary={testSummary}
                        domainTermsVisible={domainTermsVisible}
                    />
                );

                item.setState({editing: true});

                chai.assert(item.find('#actionSaveNarrative').length === 1, 'Save option not found!');
            });
        });

        describe('A Narrative being edited has an option to discard any changes', () => {

            it('has an undo option', () => {

                const designComponent = {};
                const wpItem = {};
                const mode = ViewMode.MODE_EDIT;
                const view = ViewType.DESIGN_NEW;
                const displayContext = DisplayContext.BASE_EDIT;
                const testSummary = false;
                const domainTermsVisible = true;

                const item = shallow(
                    <Narrative
                        designComponent={designComponent}
                        wpComponent={wpItem}
                        mode={mode}
                        view={view}
                        displayContext={displayContext}
                        testSummary={testSummary}
                        domainTermsVisible={domainTermsVisible}
                    />
                );

                item.setState({editing: true});

                chai.assert(item.find('#actionUndoEditNarrative').length === 1, 'Undo option not found!');
            });
        });

        describe('There is no option to edit a Feature Narrative in View Only mode', () => {

            it('has no edit option in view only', () => {

                const designComponent = {};
                const wpItem = {};
                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_NEW;
                const displayContext = DisplayContext.BASE_EDIT;
                const testSummary = false;
                const domainTermsVisible = true;

                const item = shallow(
                    <Narrative
                        designComponent={designComponent}
                        wpComponent={wpItem}
                        mode={mode}
                        view={view}
                        displayContext={displayContext}
                        testSummary={testSummary}
                        domainTermsVisible={domainTermsVisible}
                    />
                );

                chai.assert(item.find('#actionEditNarrative').length === 0, 'Edit option found!');
            });
        });
    });

    describe('Conditions', () => {

        describe('A Feature Narrative can only be edited when in edit mode', () => {

            it('has no edit option in view only', () => {

                const designComponent = {};
                const wpItem = {};
                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_NEW;
                const displayContext = DisplayContext.BASE_EDIT;
                const testSummary = false;
                const domainTermsVisible = true;

                const item = shallow(
                    <Narrative
                        designComponent={designComponent}
                        wpComponent={wpItem}
                        mode={mode}
                        view={view}
                        displayContext={displayContext}
                        testSummary={testSummary}
                        domainTermsVisible={domainTermsVisible}
                    />
                );

                chai.assert(item.find('#actionEditNarrative').length === 0, 'Edit option found!');
            });
        });
    });


});
