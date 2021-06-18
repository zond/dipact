// Copyright (C) Microsoft Corporation. All rights reserved.

import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import About from '../about'

describe('About', () => {
  it('Create component', () => {
    ReactDOM.render(
      <About />
    );
  });

  it('Mount component', async () => {
    mount(
      <About />
    );
  });
});
