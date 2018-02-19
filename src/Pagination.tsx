import * as React from 'react';
import './Pagination.css';

const range = (start: number, end: number) => (
  Array.from(Array(end - start + 1).keys()).map(i => i + start)
)

const getQuery = (param: string): string => {
    var qd = {};
    if (location.search) {
      location.search.substr(1).split('&').forEach(function(item: string) {
        var s = item.split('='),
        k = s[0],
        v = s[1] && decodeURIComponent(s[1]);
        (qd[k] = qd[k] || []).push(v)
      })
    }

    return qd[param] || ''
  }

class Pagination extends React.Component<PageProps, {}> {
  state: any
  props: PageProps
  constructor(props: PageProps) {
    super(props);
    this.props = props;
    this.state = { pager: {} };
    window.onpopstate = (event: any) => {
      this.setPage((event.state && event.state.page) || getQuery('page'))
    }
  }

  componentWillMount() {
    if (this.props.items && this.props.items.length) {
      let params = parseInt(getQuery('page'), 10)
      params = params || this.props.initialPage || 1;
      this.setPage(params)
    }
  }

  componentDidUpdate(prevProps: PageProps, prevState: PageState) {
    if (this.props.items[0].name !== prevProps.items[0].name) {
      this.setPage(1);
    }
  }

  setPage(page: any): any {
    let items = this.props.items;
    let pager = this.state.pager;

    if (page < 1 || page > pager.totalPages) {
      return;
    }

    pager = this.getPager(items.length, page, 50);
    let pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

    window.history.replaceState({page: page}, '', '?page=' + page)
    this.setState({ pager: pager });
    this.props.onChangePage(pageOfItems);
  }

  getPager(totalItems: number, currentPage: number, pageSize: number) {
    currentPage = currentPage || 1;
    pageSize = pageSize || 10;

    let totalPages = Math.ceil(totalItems / pageSize);
    let startPage, endPage;

    if (totalPages <= 10) {
      // if less than 10 total pages we show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // if more than 10 total pages we calculate start and end pages
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }

    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
    let pages = range(startPage, endPage);

    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }

  render() {
    let pager = this.state.pager;
    if (!pager.pages || pager.pages.length <= 1) {
      return null;
    }

    return (
        <ul className="pagination">
          <li className={pager.currentPage === 1 ? 'disabled' : ''}>
            <a onClick={() => this.setPage(1)}> | &lt; </a>
          </li>
          <li className={pager.currentPage === 1 ? 'disabled' : ''}>
            <a onClick={() => this.setPage(pager.currentPage - 1)}>&lt;</a>
          </li>
          {pager.pages.map((page: any, index: number) =>
                           <li key={index} className={pager.currentPage === page ? 'active' : ''}>
                             <a onClick={() => this.setPage(page)}>{page}</a>
                           </li>
                          )}
          <li className={pager.currentPage === pager.totalPages ? 'disabled' : ''}>
            <a onClick={() => this.setPage(pager.currentPage + 1)}>&gt;</a>
          </li>
          <li className={pager.currentPage === pager.totalPages ? 'disabled' : ''}>
            <a onClick={() => this.setPage(pager.totalPages)}>&gt; |</a>
          </li>
        </ul>
    );
  }
}

export default Pagination;
