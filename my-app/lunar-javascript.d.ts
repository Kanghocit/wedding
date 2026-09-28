declare module "lunar-javascript" {
  export class Solar {
    static fromYmd(y: number, m: number, d: number): Solar;
    getLunar(): Lunar;
  }
  export class Lunar {
    getDay(): number;
    getMonth(): number;
    getYearInGanZhi(): string;
  }
}
