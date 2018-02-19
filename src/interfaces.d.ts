
interface Artist {
  name: string;
  imgs: Array<string>;
}

interface Props {
  items: Array<Artist>;
  page: Array<Artist>
}

interface OnChangePageFn {
  (newPageItems: Array<any>): any;
}

interface PageProps {
  items: Array<Artist>;
  onChangePage: OnChangePageFn;
  initialPage?: number
}

interface PageState {
  pager: Pager
}

interface Pager {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  startPage: number;
  endPage: number;
  startIndex: number;
  endIndex: number;
  pages: number;
}
