import * as React from 'react';
import './App.css';
import Pagination from './Pagination';
import data from './art.json';

const DOMAIN = 'http://www.nbk.org';

let artData: Array<Artist> = data

class App extends React.Component {
  state: Props
  constructor(props: Props) {
    super(props);

    this.state = {
      items: [],
      page: []
    };

    this.onChangePage = this.onChangePage.bind(this);
  }

  onChangePage(newPageItems: Array<any>) {
    // update state with new page of items
    this.setState({ items: newPageItems });
    window.scrollTo(0, 0)
  }

  render() {
    return (
      <div className="App">
        <header className="header">
          <h1 className="title"><a href="www.nbk.org/artothek/artothek.html">n.b.k Artothek</a></h1>
        </header>
        <div className="art-list">
          {this.state.items.map((object, i) =>  <Artist key={i} name={object.name} imgs={object.imgs}/>)}
        </div>
        <Pagination items={artData} onChangePage={this.onChangePage}/>
      </div>
    );
  }
}

function Artist({ name, imgs }: Artist) {
  return (
    <div className="artist">
      <h1 className="title"> {name} </h1>
      {imgs && imgs.map((o, j) => <img key={j} src={DOMAIN + o}/> )}
    </div>
  );
}

export default App;
