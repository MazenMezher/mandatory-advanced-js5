import React from 'react'
import { expect } from 'chai';
import { shallow, configure} from 'enzyme';
import sinon from 'sinon';
import Adapter from 'enzyme-adapter-react-16';
import RightNav from './RightNav';
import LogOut from './LogOut';

// Här har vi vår Testing komponent!

configure ({adapter: new Adapter()})

// Testing för rendering för <li> i <RightNav />
describe('<RightNav />', () => {
    it('renders four <li> Elements', () => {
      const wrapper = shallow(<RightNav />);
      expect(wrapper.find('li')).to.have.lengthOf(4);
    });
});

// Testar om de går att klicka på log out knappen! i <LogOut /> komponenten!
describe('<LogOut />', () => {
  it('simulates click events', () => {
    const onClick = sinon.spy();
    const wrapper = shallow(<button onClick={onClick} />);
    wrapper.find('button').simulate('click');
    expect(onClick).to.have.property('callCount', 1);
  });
})
