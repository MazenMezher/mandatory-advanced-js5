import React from 'react'
import { expect } from 'chai';
import { shallow, configure} from 'enzyme';
import sinon from 'sinon';
import Adapter from 'enzyme-adapter-react-16';
import RightNav from './RightNav';
import LogOut from './LogOut';

configure ({adapter: new Adapter()})

describe('<RightNav />', () => {
    it('renders four <li> Elements', () => {
      const wrapper = shallow(<RightNav />);
      expect(wrapper.find('li')).to.have.lengthOf(4);
    });
});

describe('<LogOut />', () => {
  it('simulates click events', () => {
    const onClick = sinon.spy();
    const wrapper = shallow(<button onClick={onClick} />);
    wrapper.find('button').simulate('click');
    expect(onClick).to.have.property('callCount', 1);
  });
})
