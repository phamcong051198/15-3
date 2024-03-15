import { Injectable } from '@nestjs/common';

@Injectable()
export class Store_TodayMatch {
  private data: any;
  private currentPage: number;
  private totalPage: number;

  setTotalPage(data: any) {
    this.totalPage = data;
  }
  getTotalPage(): number {
    return this.totalPage;
  }

  setCurrentPage(currentPage: any) {
    this.currentPage = currentPage;
  }
  getCurrentPage(): number {
    return this.currentPage;
  }

  setData(data: any) {
    this.data = data;
  }
  getData(): void {
    return this.data;
  }
}
