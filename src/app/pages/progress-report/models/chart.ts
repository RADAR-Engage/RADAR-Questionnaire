import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill, ApexMarkers,
  ApexStroke, ApexTooltip,
  ApexXAxis,
  ApexYAxis
} from "ng-apexcharts";

export interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  fill: ApexFill;
  stroke: ApexStroke;
  markers: ApexMarkers;
  colors: string[];
  tooltip: ApexTooltip;
}
