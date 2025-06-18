import {convertDuration, DurationUnit} from 'date-vir';
import {css, defineElement, html} from 'element-vir';

export type JoVibrateInputs = {
    /** The duration of one complete cycle (including pause) in milliseconds */
    duration?: {seconds: number};
    angle?: number;
};

const joVibrateDefaults: Required<JoVibrateInputs> = {
    duration: {seconds: 3},
    angle: 15,
};

export const JoVibrate = defineElement<JoVibrateInputs>()({
    tagName: 'jo-vibrate',
    styles: css`
        :host {
            display: inline-block;
        }

        .jo-vibrate-wrapper {
            display: inline-block;
            animation: jo-vibrate-rotate var(--jo-vibrate-duration) infinite;
        }

        @keyframes jo-vibrate-rotate {
            0% {
                transform: rotate(0deg);
            }
            5% {
                transform: rotate(var(--jo-vibrate-angle));
            }
            10% {
                transform: rotate(0deg);
            }
            15% {
                transform: rotate(calc(var(--jo-vibrate-angle) * -1));
            }
            20% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(0deg);
            }
        }
    `,
    render: ({inputs}) => {
        const duration = inputs.duration ?? joVibrateDefaults.duration;
        const angle = inputs.angle ?? joVibrateDefaults.angle;

        const style = `
            --jo-vibrate-duration: ${convertDuration(duration, DurationUnit.Milliseconds).milliseconds}ms;
            --jo-vibrate-angle: ${angle}deg;
        `;

        return html`
            <div class="jo-vibrate-wrapper" style=${style}>
                <slot></slot>
            </div>
        `;
    },
});
