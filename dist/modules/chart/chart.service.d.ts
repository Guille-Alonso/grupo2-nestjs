import { ChartConfiguration, ChartType } from 'chart.js';
export declare class ChartService {
    private chartJSNodeCanvas;
    constructor();
    generateChart(type: ChartType, data: {
        labels: string[];
        datasets: any[];
    }, options?: ChartConfiguration['options']): Promise<Buffer>;
}
