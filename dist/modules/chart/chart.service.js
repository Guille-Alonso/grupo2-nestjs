"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartService = void 0;
const common_1 = require("@nestjs/common");
const chartjs_node_canvas_1 = require("chartjs-node-canvas");
const chart_js_1 = require("chart.js");
let ChartService = class ChartService {
    constructor() {
        const width = 800;
        const height = 600;
        chart_js_1.Chart.register(chart_js_1.CategoryScale, chart_js_1.LinearScale, chart_js_1.BarElement, chart_js_1.Title, chart_js_1.Tooltip, chart_js_1.Legend);
        this.chartJSNodeCanvas = new chartjs_node_canvas_1.ChartJSNodeCanvas({
            width,
            height,
        });
    }
    async generateChart(type, data, options = {}) {
        try {
            const configuration = {
                type,
                data,
                options,
            };
            return await this.chartJSNodeCanvas.renderToBuffer(configuration);
        }
        catch (error) {
            throw new Error(`Error al generar el gráfico: ${error.message}`);
        }
    }
};
exports.ChartService = ChartService;
exports.ChartService = ChartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ChartService);
//# sourceMappingURL=chart.service.js.map