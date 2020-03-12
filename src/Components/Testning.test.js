import React, { Component } from 'react'
import { expect } from 'chai';
import { shallow, configure} from 'enzyme';
import sinon from 'sinon';
import Adapter from 'enzyme-adapter-react-16';
import RightNav from './RightNav';
import Header from './Header';

configure ({adapter: new Adapter()})

describe('<RightNav />', () => {
    it('renders four <li> Elements', () => {
        const wrapper = shallow(<RightNav />);
        expect(wrapper.find('li')).to.have.lengthOf(4);

    });
});

describe('<Header />', () => {
  it('simulates onChange events on <input> Element', () => {
    const onChange = sinon.spy();
    const wrapper = shallow(<Header onChange={onChange} />);
    expect(wrapper.find('input').simulate('change', { target: {
      value: 'Change function' }
    }));
});});
