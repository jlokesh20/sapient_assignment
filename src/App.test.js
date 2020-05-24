import React from 'react';
import App from './App';
import Footer from './components/Footer';
import { configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({adapter: new Adapter()});

describe('<App />', () => {
  const wrapper = shallow(<App />);

  it('should render one Footer element', () => {
    expect(wrapper.find(Footer)).toHaveLength(1);
  });

  it('should contain one table container', () => {
    expect(wrapper.find("div.table-container").exists()).toBeTruthy();
  })

  it('should contain one chart container', () => {
    expect(wrapper.find("div.chart-container").exists()).toBeTruthy();
  })

})
