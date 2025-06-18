import {convertDuration, DurationUnit} from 'date-vir';
import {css, defineElement, html} from 'element-vir';

export type JoPulseInputs = {
    /** The duration of one complete cycle (including pause) in milliseconds */
    duration?: {seconds: number};
    scale?: number;
};

const joPulseDefaults: Required<JoPulseInputs> = {
    duration: {seconds: 3},
    scale: 1.05,
};

export const JoPulse = defineElement<JoPulseInputs>()({
    tagName: 'jo-pulse',
    styles: css`
        :host {
            display: inline-block;
        }

        .jo-pulse-wrapper {
            display: inline-block;
            animation: jo-pulse-scale var(--jo-pulse-duration) infinite;
        }

        @keyframes jo-pulse-scale {
            0% {
                transform: scale(1);
            }
            5% {
                transform: scale(var(--jo-pulse-scale));
            }
            10% {
                transform: scale(1);
            }
            15% {
                transform: scale(var(--jo-pulse-scale));
            }
            20% {
                transform: scale(1);
            }
            100% {
                transform: scale(1);
            }
        }
    `,
    render: ({inputs}) => {
        const duration = inputs.duration ?? joPulseDefaults.duration;
        const scale = inputs.scale ?? joPulseDefaults.scale;

        const style = `
            --jo-pulse-duration: ${convertDuration(duration, DurationUnit.Milliseconds).milliseconds}ms;
            --jo-pulse-scale: ${scale};
        `;

        return html`
            <div class="jo-pulse-wrapper" style=${style}>
                <slot></slot>
            </div>
        `;
    },
});
