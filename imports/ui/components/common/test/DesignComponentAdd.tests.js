
import React from 'react';
import { connect } from 'react-redux';
import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

//import { Design } from './Design.jsx';  // Non Redux
import DesignComponentAdd from '../DesignComponentAdd.jsx';


import { DesignStatus } from '../../../../constants/constants.js'

import { Designs } from '../../../../collections/design/designs.js'

describe('DesignComponentAdd', () => {

    const addText = 'Add Item';
    let onClick = () => {return true};
    let toggleHighlight = () => {return true};

    // it('should render', () => {
    //
    //
    //     const item = shallow(
    //         <DesignComponentAdd
    //             addText={addText}
    //             onClick={onClick}
    //             toggleHighlight={toggleHighlight}
    //         />);
    //
    //
    //
    //     console.log(item.find('h1'));
    //
    //     //chai.expect(item.props().state.userRole).to.equal(userRole);
    //     //chai.expect(item.props().design).to.have.property('designName','Design1');
    //     //chai.expect(item.props().design).to.have.property('designStatus', DesignStatus.DESIGN_LIVE);
    //
    //     chai.expect(item.find('h1')).to.have.length(1);
    //     chai.expect(item.find('h1').text()).to.equal('Oats');
    //
    //     //chai.expect(mountItem.find({prop: 'designName'})).to.have.length(1);
    //     //chai.expect(mountItem.find('.design-item')).to.have.length(1);
    //
    //
    //     //chai.assert(item.hasClass('design-item'));
    //     // chai.assert(!item.hasClass('checked'));
    //     // chai.assert.equal(item.find('.editing').length, 0);
    //     //chai.assert.equal(item.find('input[type="text"]').prop('defaultValue'), 'testing');
    // });
});
