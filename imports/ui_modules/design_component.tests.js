import {ComponentType, DisplayContext, ViewMode, ViewType} from "../constants/constants";
import {DesignComponentValidationErrors} from "../constants/validation_errors";
import { DesignComponentValidationServices } from "../service_modules/validation/design_component_validation_services";
import { DesignComponentModules } from '../service_modules/design/design_component_service_modules.js';
import { ComponentUiModules } from '../ui_modules/design_component.js';
import {EditorState, convertFromRaw} from "draft-js";

import { chai } from 'meteor/practicalmeteor:chai';

describe('UI Mods: Design Component', () => {

    describe('A Design Component name can be edited but then the changes discarded', () => {

        it('the component name is reset to the stored value', () => {

            // This is what is in the editor after user has edited the name
            const compositeDecorator = null;
            const newRawText = DesignComponentModules.getRawTextFor('New Name');
            const newContent = convertFromRaw(newRawText, compositeDecorator);

            const oldState = {
                inScope: false,
                parentScope: false,
                scopeChange: false,
                editing: true,
                highlighted: false,
                name: '',
                editorState: EditorState.createWithContent(newContent, compositeDecorator),
                progressData: {
                    featureCount:       0,
                    scenarioCount:      0,
                    passingTestsCount:  0,
                    failingTestsCount:  0
                }
            };

            let newState = oldState;

            const props = {
                // Current item holds the old name previous to editing
                currentItem: {
                    componentNameOld:   'Old Name',
                    componentNameRawOld: DesignComponentModules.getRawTextFor('Old Name'),
                    componentNameNew:   'Old Name',
                    componentNameRawNew: DesignComponentModules.getRawTextFor('Old Name'),
                },
                updateItem: {},
                wpItem: {},
                uiContextName: '',
                isDragDropHovering: false,
                onToggleOpen: null,
                onSelectItem: null,
                mode: ViewMode.MODE_EDIT,
                view: ViewType.DESIGN_PUBLISHED,
                displayContext: DisplayContext.BASE_EDIT,
                userContext: {},
                testSummary: false,
                testSummaryData: {},
                isOpen: true,
                testDataFlag: false,
                updateScopeItems: {},
                updateScopeFlag: false,
                workPackageScopeItems: {},
                workPackageScopeFlag: false,
                domainTermsVisible: false
            };

            // User has clicked the cancel button on the editor.  The old state contains what was typed
            newState = ComponentUiModules.setComponentNameEditorText(oldState, props);

            // Verify that the new state now has the original text
            const result = newState.editorState.getCurrentContent().getPlainText();
            const expectation = 'Old Name';

            chai.assert.equal(result, expectation);
        });
    });
});