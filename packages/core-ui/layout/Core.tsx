import React, { useEffect } from 'react';
import Head from 'next/head';
import { inject, observer } from 'mobx-react';
// import Services from '../containers/Services';

function Layout(props) {
  console.log('Store', props);
  // props.store.addTodo('Hello');
  return (
    <>
      <Head>
        <title>'Hello World'</title>
      </Head>
      {/* <Services /> */}
      <main>{props.children}</main>
    </>
  );
}

export default inject('store')(observer(Layout));
