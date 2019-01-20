
import React from 'react';
import { connect } from 'react-redux';
import { shallowWithStore } from 'enzyme-redux';
import { createMockStore } from 'redux-test-utils';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import Design from '../Design.jsx';  // Redux wrapped

// import { Provider } from 'react-redux';

import { DesignStatus } from '../../../../constants/constants.js'

import { Designs } from '../../../../collections/design/designs.js'

describe('Design', () => {

    Factory.define('design', Designs, { designName: 'Design1', isRemovable: true, designStatus: DesignStatus.DESIGN_LIVE});
    const design = Factory.create('design');
    const DesignComponent = () => (<Design design={design} />);

    it('should have correct redux properties', () => {

        const userContext = {designId: 'AAA'};
        const userRole = 'DESIGNER';

        const expectedState = {
            userContext: userContext,
            userRole: userRole
        };

        let store = createMockStore(expectedState);

        const mapStateToProps = (state) => ({
            state,
        });

        const DesignR = connect(mapStateToProps)(DesignComponent);

        const item = shallowWithStore(<DesignR design={design}/>, createMockStore(expectedState));


        //console.log(item);

        chai.expect(item.props().state.userRole).to.equal(userRole);
        chai.expect(item.props().design).to.have.property('designName','Design1');
        chai.expect(item.props().design).to.have.property('designStatus', DesignStatus.DESIGN_LIVE);

    });
});