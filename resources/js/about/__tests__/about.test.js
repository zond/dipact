import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import About from '../about';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme from 'enzyme';

Enzyme.configure({ adapter: new Adapter() });

describe('About', () => {
  it('Create component', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <About />,
      div
    );
  });

  it('Mount component', async () => {
    mount(
      <About />
    );
  });
});
