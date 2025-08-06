import {colorTokens} from '@jills-office/common-frontend/src/ui/styles/colors/color-tokens';
import {jillsOfficeColors} from '@jills-office/common-frontend/src/ui/styles/colors/jills-office-colors';
import Chart, {ChartConfiguration} from 'chart.js/auto';
import {css, defineElement, html, onDomCreated, renderIf} from 'element-vir';

export type LineChartDataPoint = {
    label: string;
    value: number;
};

export type JoLineChartInputs = {
    data: ReadonlyArray<LineChartDataPoint>;
    chartTitle?: string;
    chartSubtitle?: string;
    chartHeight?: number;
    chartWidth?: number;
    yAxisMin?: number;
    yAxisMax?: number;
};

export const JoLineChart = defineElement<JoLineChartInputs>()({
    tagName: 'jo-line-chart',
    styles: css`
        :host {
            display: block;
        }

        .chart-container {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .chart-wrapper {
            position: relative;
        }

        .chart-title {
            font-size: 1.2rem;
            font-weight: 600;
            color: ${jillsOfficeColors['page-foreground-normal'].value};
            text-align: center;
        }

        .chart-subtitle {
            font-size: 1rem;
            color: ${jillsOfficeColors['page-foreground-faint'].value};
            text-align: center;
        }
    `,
    stateInitStatic: {
        chart: null as Chart | null,
    },
    renderCallback: ({inputs, updateState}) => {
        return html`
            <div class="chart-container">
                ${renderIf(
                    !!inputs.chartTitle,
                    html`
                        <div class="chart-title">${inputs.chartTitle}</div>
                    `,
                )}
                ${renderIf(
                    !!inputs.chartSubtitle,
                    html`
                        <div class="chart-subtitle">${inputs.chartSubtitle}</div>
                    `,
                )}
                <div
                    class="chart-wrapper"
                    style="height: ${inputs.chartHeight || 300}px; width: ${inputs.chartWidth ||
                    '100%'}"
                >
                    <canvas
                        ${onDomCreated((element) => {
                            const canvas = element as HTMLCanvasElement;

                            const chartConfig: ChartConfiguration = {
                                type: 'line',
                                data: {
                                    labels: inputs.data.map((point) => point.label),
                                    datasets: [
                                        {
                                            label: inputs.chartTitle || 'Value',
                                            data: inputs.data.map((point) => point.value),
                                            borderColor:
                                                colorTokens[
                                                    'md-sys-color-tertiary'
                                                ].default.toString(),
                                            tension: 0.1,
                                        },
                                    ],
                                },
                                options: {
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    scales: {
                                        y: {
                                            min: inputs.yAxisMin,
                                            max: inputs.yAxisMax,
                                            ticks: {
                                                precision: 0,
                                            },
                                        },
                                    },
                                },
                            };

                            updateState({chart: new Chart(canvas, chartConfig)});
                        })}
                    ></canvas>
                </div>
            </div>
        `;
    },
});
