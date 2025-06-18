import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import {css, defineElement, html, onDomCreated} from 'element-vir';

export type DonutChartItem = {
    label: string;
    value: number;
    color?: string;
    count?: number;
};

export type JoDonutChartInputs = {
    items: ReadonlyArray<DonutChartItem>;
    chartTitle?: string;
    chartSubtitle?: string;
};

const ChartColors = {
    background: '#fff',
    ring: '#e0e0e0', // light gray for faint foreground
    text: '#333333', // dark gray for normal text
    segments: {
        primary: '#FF6B00', // orange
        secondary: '#00B4B4', // teal
        tertiary: '#FF9E40', // lighter orange
        quaternary: '#6B4EFF', // indigo
    },
} as const;

export const JoDonutChart = defineElement<JoDonutChartInputs>()({
    init: () => {
        Chart.register(annotationPlugin);
    },
    tagName: 'jo-donut-chart',
    /**
     * The width and height of the chart wrapper have to be very specific to get them to render at
     * the same size. Otherwise, the length of the labels will change the size of the chart, and
     * they won't look uniform.
     */
    styles: css`
        :host {
            display: block;
        }

        .chart-container {
            display: flex;
            gap: 2rem;
            align-items: center;
        }

        .chart-wrapper {
            position: relative;
            width: 360px;
            height: 200px;
        }

        @media (max-width: 768px) {
            .chart-container {
                flex-direction: column;
                text-align: center;
            }
        }
    `,
    render: ({inputs}) => {
        const total = inputs.items.reduce((sum, item) => sum + item.value, 0) || 1;

        return html`
            <div class="chart-container">
                <div class="chart-wrapper">
                    <canvas
                        id="chart-canvas"
                        ${onDomCreated((element) => {
                            const canvas = element;
                            const segmentColors = Object.values(ChartColors.segments);

                            const chartData = {
                                labels: inputs.items.map((item) => item.label),
                                datasets: [
                                    {
                                        data: inputs.items.map((item) => item.value),
                                        backgroundColor: inputs.items.map(
                                            (item, index) =>
                                                item.color ||
                                                String(segmentColors[index % segmentColors.length]),
                                        ),
                                        hoverOffset: 4,
                                        borderWidth: 1,
                                    },
                                ],
                            };

                            const chartConfig = {
                                type: 'doughnut' as const,
                                data: chartData,
                                options: {
                                    cutout: '65%',
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            display: true,
                                            position: 'right' as const,
                                        },
                                        tooltip: {
                                            enabled: true,
                                        },
                                        title: {
                                            display: false,
                                        },
                                        annotation: {
                                            annotations: {
                                                dLabel: {
                                                    /**
                                                     * The types for annotation are incorrect and do
                                                     * not support doughnutLabel even though the js
                                                     * does support it
                                                     */
                                                    type: 'doughnutLabel' as any,
                                                    content: [
                                                        String(inputs.chartTitle ?? total),
                                                        inputs.chartSubtitle ?? 'Total',
                                                    ],
                                                    font: [
                                                        {size: 60},
                                                        {size: 45},
                                                    ],
                                                    color: [
                                                        'black',
                                                        'grey',
                                                    ],
                                                },
                                            },
                                        },
                                    },
                                },
                            };

                            void new Chart(canvas as HTMLCanvasElement, chartConfig);
                        })}
                    ></canvas>
                </div>
            </div>
        `;
    },
});
