import { PAGE_SIZE } from 'src/app.constants';

export function paginate(array: any, pageNumber: any) {
  return array.slice((pageNumber - 1) * PAGE_SIZE, pageNumber * PAGE_SIZE);
}
