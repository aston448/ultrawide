import {ComponentType, DisplayContext, UpdateScopeType, WorkPackageScopeType, ViewMode, ViewType} from "../constants/constants";
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

    describe('Domain Dictionary terms are highlighted in Scenario and Narrative texts', () => {

        it('gets a decorator for scenarios', () => {

            const item = {
                componentType:      ComponentType.SCENARIO,
                designVersionId:    'DESIGN_VERSION1',
                scopeType:          UpdateScopeType.SCOPE_IN_SCOPE
            };

            const updateItem = null;
            const displayContext = DisplayContext.BASE_EDIT;
            const domainTermsVisible = true;

            const decorator = ComponentUiModules.getDomainTermDecorator(item, displayContext, domainTermsVisible, updateItem);

            chai.assert.isNotNull(decorator, 'Decorator was null');
        });

        it('gets a decorator for narratives', () => {

            const designComponent = {
                componentType:      ComponentType.FEATURE,
                designVersionId:    'DESIGN_VERSION1',
                scopeType:          UpdateScopeType.SCOPE_IN_SCOPE
            };

            const wpComponent = null;
            const updateComponent = null;
            const displayContext = DisplayContext.BASE_EDIT;
            const domainTermsVisible = true;

            const decorator = ComponentUiModules.getDecoratorForNarrative(displayContext, domainTermsVisible, designComponent, wpComponent, updateComponent);

            chai.assert.isNotNull(decorator, 'Decorator was null');
        })
    });

    describe('Ultrawide will highlight any Domain Dictionary term found in a Feature Narrative', () => {

        it('highlights a base design narrative', () => {

            const designComponent = {
                componentType:      ComponentType.FEATURE,
                designVersionId:    'DESIGN_VERSION1',
                scopeType:          UpdateScopeType.SCOPE_IN_SCOPE
            };

            const wpComponent = null;
            const updateComponent = null;
            const displayContext = DisplayContext.BASE_EDIT;
            const domainTermsVisible = true;

            const decorator = ComponentUiModules.getDecoratorForNarrative(displayContext, domainTermsVisible, designComponent, wpComponent, updateComponent);

            chai.assert.isNotNull(decorator, 'Decorator was null');
        });

        it('highlights a scoped update narrative in edit pane', () => {

            const designComponent = {
                componentType:      ComponentType.FEATURE,
                designVersionId:    'DESIGN_VERSION1',
                scopeType:          UpdateScopeType.SCOPE_IN_SCOPE
            };

            const wpComponent = null;
            const updateComponent = {
                componentType:      ComponentType.FEATURE,
                designVersionId:    'DESIGN_VERSION1',
                scopeType:          UpdateScopeType.SCOPE_IN_SCOPE
            };
            const displayContext = DisplayContext.UPDATE_EDIT;
            const domainTermsVisible = true;

            const decorator = ComponentUiModules.getDecoratorForNarrative(displayContext, domainTermsVisible, designComponent, wpComponent, updateComponent);

            chai.assert.isNotNull(decorator, 'Decorator was null');
        });

        it('highlights a scoped update narrative in scope pane', () => {

            const designComponent = {
                componentType:      ComponentType.FEATURE,
                designVersionId:    'DESIGN_VERSION1',
                scopeType:          UpdateScopeType.SCOPE_IN_SCOPE
            };

            const wpComponent = null;
            const updateComponent = {
                componentType:      ComponentType.FEATURE,
                designVersionId:    'DESIGN_VERSION1',
                scopeType:          UpdateScopeType.SCOPE_IN_SCOPE
            };
            const displayContext = DisplayContext.UPDATE_SCOPE;
            const domainTermsVisible = true;

            const decorator = ComponentUiModules.getDecoratorForNarrative(displayContext, domainTermsVisible, designComponent, wpComponent, updateComponent);

            chai.assert.isNotNull(decorator, 'Decorator was null');
        });

        it('highlights a scoped wp narrative in view pane', () => {

            const designComponent = {
                componentType:      ComponentType.FEATURE,
                designVersionId:    'DESIGN_VERSION1',
                scopeType:          UpdateScopeType.SCOPE_IN_SCOPE
            };

            const wpComponent = {
                componentType:      ComponentType.FEATURE,
                designVersionId:    'DESIGN_VERSION1',
                scopeType:          WorkPackageScopeType.SCOPE_IN_SCOPE
            };

            const updateComponent = {
                componentType:      ComponentType.FEATURE,
                designVersionId:    'DESIGN_VERSION1',
                scopeType:          UpdateScopeType.SCOPE_IN_SCOPE
            };
            const displayContext = DisplayContext.WP_VIEW;
            const domainTermsVisible = true;

            const decorator = ComponentUiModules.getDecoratorForNarrative(displayContext, domainTermsVisible, designComponent, wpComponent, updateComponent);

            chai.assert.isNotNull(decorator, 'Decorator was null');
        });

        it('highlights a scoped wp narrative in scope pane', () => {

            const designComponent = {
                componentType:      ComponentType.FEATURE,
                designVersionId:    'DESIGN_VERSION1',
                scopeType:          UpdateScopeType.SCOPE_IN_SCOPE
            };

            const wpComponent = {
                componentType:      ComponentType.FEATURE,
                designVersionId:    'DESIGN_VERSION1',
                scopeType:          WorkPackageScopeType.SCOPE_IN_SCOPE
            };

            const updateComponent = {
                componentType: ComponentType.FEATURE,
                designVersionId: 'DESIGN_VERSION1',
                scopeType: UpdateScopeType.SCOPE_IN_SCOPE
            };

            const displayContext = DisplayContext.WP_SCOPE;
            const domainTermsVisible = true;

            const decorator = ComponentUiModules.getDecoratorForNarrative(displayContext, domainTermsVisible, designComponent, wpComponent, updateComponent);

            chai.assert.isNotNull(decorator, 'Decorator was null');
        });

    });


    describe('Ultrawide will highlight any Domain Dictionary term found in a Scenario', () => {

        it('highlights a design scenario', () => {

            const item = {
                componentType:      ComponentType.SCENARIO,
                designVersionId:    'DESIGN_VERSION1',
                scopeType:          UpdateScopeType.SCOPE_IN_SCOPE
            };

            const updateItem = null;
            const displayContext = DisplayContext.BASE_EDIT;
            const domainTermsVisible = true;

            const decorator = ComponentUiModules.getDomainTermDecorator(item, displayContext, domainTermsVisible, updateItem);

            chai.assert.isNotNull(decorator, 'Decorator was null');
        });

        it('highlights a scoped update scenario in edit pane', () => {

            const item = {
                componentType:      ComponentType.SCENARIO,
                designVersionId:    'DESIGN_VERSION1',
                scopeType:          UpdateScopeType.SCOPE_IN_SCOPE
            };

            const updateItem = {
                componentType:      ComponentType.SCENARIO,
                designVersionId:    'DESIGN_VERSION1',
                scopeType:          UpdateScopeType.SCOPE_IN_SCOPE

            };
            const displayContext = DisplayContext.UPDATE_EDIT;
            const domainTermsVisible = true;

            const decorator = ComponentUiModules.getDomainTermDecorator(item, displayContext, domainTermsVisible, updateItem);

            chai.assert.isNotNull(decorator, 'Decorator was null');
        });

        it('highlights a scoped update scenario in scope pane', () => {

            const item = {
                componentType:      ComponentType.SCENARIO,
                designVersionId:    'DESIGN_VERSION1',
                scopeType:          UpdateScopeType.SCOPE_IN_SCOPE
            };

            const updateItem = {
                componentType:      ComponentType.SCENARIO,
                designVersionId:    'DESIGN_VERSION1',
                scopeType:          UpdateScopeType.SCOPE_IN_SCOPE

            };
            const displayContext = DisplayContext.UPDATE_SCOPE;
            const domainTermsVisible = true;

            const decorator = ComponentUiModules.getDomainTermDecorator(item, displayContext, domainTermsVisible, updateItem);

            chai.assert.isNotNull(decorator, 'Decorator was null');
        });
    });


    describe('Ultrawide will not highlight Domain Dictionary terms found in an Application name', () => {

        it('no decorator returned in design edit', () => {

            const item = {
                componentType:      ComponentType.APPLICATION,
                designVersionId:    'DESIGN_VERSION1',
                scopeType:          UpdateScopeType.SCOPE_IN_SCOPE
            };

            const updateItem = null;
            const displayContext = DisplayContext.BASE_EDIT;
            const domainTermsVisible = true;

            const decorator = ComponentUiModules.getDomainTermDecorator(item, displayContext, domainTermsVisible, updateItem);

            chai.assert.isNull(decorator, 'Decorator not null');
        });

        it('no decorator returned in update edit', () => {

            const item = {
                componentType:      ComponentType.APPLICATION,
                designVersionId:    'DESIGN_VERSION1',
                scopeType:          UpdateScopeType.SCOPE_IN_SCOPE
            };

            const updateItem = {
                componentType:      ComponentType.APPLICATION,
                designVersionId:    'DESIGN_VERSION1',
                scopeType:          UpdateScopeType.SCOPE_IN_SCOPE

            };
            const displayContext = DisplayContext.UPDATE_EDIT;
            const domainTermsVisible = true;

            const decorator = ComponentUiModules.getDomainTermDecorator(item, displayContext, domainTermsVisible, updateItem);

            chai.assert.isNull(decorator, 'Decorator not null');
        });
    });

    describe('Ultrawide will not highlight Domain Dictionary terms found in a Design Section name', () => {

        it('no decorator returned in design edit', () => {

            const item = {
                componentType:      ComponentType.DESIGN_SECTION,
                designVersionId:    'DESIGN_VERSION1',
                scopeType:          UpdateScopeType.SCOPE_IN_SCOPE
            };

            const updateItem = null;
            const displayContext = DisplayContext.BASE_EDIT;
            const domainTermsVisible = true;

            const decorator = ComponentUiModules.getDomainTermDecorator(item, displayContext, domainTermsVisible, updateItem);

            chai.assert.isNull(decorator, 'Decorator not null');
        });

        it('no decorator returned in update edit', () => {

            const item = {
                componentType:      ComponentType.DESIGN_SECTION,
                designVersionId:    'DESIGN_VERSION1',
                scopeType:          UpdateScopeType.SCOPE_IN_SCOPE
            };

            const updateItem = {
                componentType:      ComponentType.DESIGN_SECTION,
                designVersionId:    'DESIGN_VERSION1',
                scopeType:          UpdateScopeType.SCOPE_IN_SCOPE

            };
            const displayContext = DisplayContext.UPDATE_EDIT;
            const domainTermsVisible = true;

            const decorator = ComponentUiModules.getDomainTermDecorator(item, displayContext, domainTermsVisible, updateItem);

            chai.assert.isNull(decorator, 'Decorator not null');
        });
    });

    describe('Ultrawide will not highlight Domain Dictionary terms found in a Feature name', () => {

        it('no decorator returned in design edit', () => {

            const item = {
                componentType:      ComponentType.FEATURE,
                designVersionId:    'DESIGN_VERSION1',
                scopeType:          UpdateScopeType.SCOPE_IN_SCOPE
            };

            const updateItem = null;
            const displayContext = DisplayContext.BASE_EDIT;
            const domainTermsVisible = true;

            const decorator = ComponentUiModules.getDomainTermDecorator(item, displayContext, domainTermsVisible, updateItem);

            chai.assert.isNull(decorator, 'Decorator not null');
        });

        it('no decorator returned in update edit', () => {

            const item = {
                componentType:      ComponentType.FEATURE,
                designVersionId:    'DESIGN_VERSION1',
                scopeType:          UpdateScopeType.SCOPE_IN_SCOPE
            };

            const updateItem = {
                componentType:      ComponentType.FEATURE,
                designVersionId:    'DESIGN_VERSION1',
                scopeType:          UpdateScopeType.SCOPE_IN_SCOPE

            };
            const displayContext = DisplayContext.UPDATE_EDIT;
            const domainTermsVisible = true;

            const decorator = ComponentUiModules.getDomainTermDecorator(item, displayContext, domainTermsVisible, updateItem);

            chai.assert.isNull(decorator, 'Decorator not null');
        });
    });

    describe('Ultrawide will not highlight Domain Dictionary terms found in a Feature Aspect name', () => {

        it('no decorator returned in design edit', () => {

            const item = {
                componentType:      ComponentType.FEATURE_ASPECT,
                designVersionId:    'DESIGN_VERSION1',
                scopeType:          UpdateScopeType.SCOPE_IN_SCOPE
            };

            const updateItem = null;
            const displayContext = DisplayContext.BASE_EDIT;
            const domainTermsVisible = true;

            const decorator = ComponentUiModules.getDomainTermDecorator(item, displayContext, domainTermsVisible, updateItem);

            chai.assert.isNull(decorator, 'Decorator not null');
        });

        it('no decorator returned in update edit', () => {

            const item = {
                componentType:      ComponentType.FEATURE_ASPECT,
                designVersionId:    'DESIGN_VERSION1',
                scopeType:          UpdateScopeType.SCOPE_IN_SCOPE
            };

            const updateItem = {
                componentType:      ComponentType.FEATURE_ASPECT,
                designVersionId:    'DESIGN_VERSION1',
                scopeType:          UpdateScopeType.SCOPE_IN_SCOPE

            };
            const displayContext = DisplayContext.UPDATE_EDIT;
            const domainTermsVisible = true;

            const decorator = ComponentUiModules.getDomainTermDecorator(item, displayContext, domainTermsVisible, updateItem);

            chai.assert.isNull(decorator, 'Decorator not null');
        });
    });

});