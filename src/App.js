import React from 'react';
import { Link, Redirect, BrowserRouter, Match, Miss } from 'react-router';

const ITEMS = ['a', 'b', 'c'];

function NotFound() {
  return (
    <div>
      <p>Page not found.</p>
      <Link to="/">back to home</Link>
    </div>
  );
}

function OldIndex() {
  return <Redirect to="/"/>;
}

function Item(props) {
  const id = props.params.id;
  if (!ITEMS.includes(id)) {
    return <NotFound/>;
  }
  return (
    <div>
      <p>Item {`${id}`}</p>
      <p><Link to="/">back to home</Link></p>
      <p><Link to="/home">old home</Link></p>
    </div>
  );
}

function Index(props) {

  function itemLink(i) {
    return (
      <li key={i}>
        <Link to={`/items/${i}`}>{`Item ${i}`}</Link>
      </li>
    );
  }

  return (
    <div>
      <p>Home page</p>
      <ul>
        {ITEMS.map(itemLink)}
        {itemLink('notfound')}
      </ul>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div>
        <Match exactly pattern="/" component={Index} />
        <Match exactly pattern="/home" component={OldIndex} />
        <Match pattern="/items/:id" component={Item} />
        <Miss component={NotFound}/>
      </div>
    </BrowserRouter>
  );
}

export default App;
