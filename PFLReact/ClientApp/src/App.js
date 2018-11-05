import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Products } from './components/Products';
import { Product } from './components/Product';
import { Thankyou } from './components/Thankyou';

export default class App extends Component {
  displayName = App.name

  render() {
    return (
      <Layout>
            <Route exact path='/' component={Home} />
            <Route exact path='/products' component={Products} />
            <Route exact path='/product/:id' component={Product} />
            <Route exact path='/thankyou/:orderid' component={Thankyou} />
      </Layout>
    );
  }
}
