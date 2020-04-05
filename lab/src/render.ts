import { ICanvasRenderingContext2D, fullscreenCanvas } from "../../lib/canvas";
import { Cell } from "./replace";
import { rnd } from "../../lib/util";

export class Render {
    private ctx: ICanvasRenderingContext2D;
    constructor() {
        const ctx = this.ctx = fullscreenCanvas();
        ctx.strokeStyle = ctx.fillStyle = '#aaa';
    }

    public draw(lab: Cell[][]) {
        const ctx = this.ctx
        const { width, height } = this.ctx.canvas;

        ctx.clearRect(0, 0, width, height);

        const pad = 100;
        const d = 6 * 8; // divisible by 4
        const w = (d / 3) | 0;

        for (let i = 0; i < lab.length; ++i) {
            const line = lab[i];
            const y = (pad + d * i) | 0 + .5;
            const r = Math.sqrt(d * d + w * w) / 2;
            const a = Math.asin(w / d);

            for (let j = 0; j < line.length; ++j) {
                const char = line[j];
                const x = (pad + d * j) | 0 + .5;

                switch (char) {
                    case 'A':
                        ctx.beginPath();
                        ctx.arc(x, y, r, a, -a);
                        ctx.stroke();
                        break;
                    case 'E':
                        ctx.beginPath();
                        ctx.arc(x, y, r, a + Math.PI, -a + Math.PI);
                        ctx.stroke();
                        break;
                    case '-':
                        ctx.fillRect(x - d / 2, y - w / 2, d, w);
                        ctx.clearRect(x - d / 2, y - w / 2 + 1, d, w - 2);
                        break;
                    case '|':
                        ctx.fillRect(x - w / 2, y - d / 2, w, d);
                        ctx.clearRect(x - w / 2 + 1, y - d / 2, w - 2, d);
                        break;
                    case '+':
                        if (rnd() < .5) {
                            ctx.fillRect(x - d / 2, y - w / 2, d, w);
                            ctx.clearRect(x - d / 2, y - w / 2 + 1, d, w - 2);

                            ctx.fillRect(x - w / 2, y - d / 2, w, d);
                            ctx.clearRect(x - w / 2 + 1, y - d / 2, w - 2, d);
                        }
                        else {
                            ctx.fillRect(x - d / 2, y - w / 2, d, w);
                            ctx.clearRect(x - d / 2, y - w / 2 + 1, d, w - 2);

                            ctx.fillRect(x - w / 2, y - d / 2, w, d);
                            ctx.clearRect(x - w / 2 + 1, y - d / 2, w - 2, d);
                        }

                        break;

                    case 'f':
                        ctx.fillRect(x, y - w / 2, d / 2, w);
                        ctx.fillRect(x - w / 2, y - w / 2, w, d / 2 + w / 2);
                        ctx.clearRect(x + 1, y - w / 2 + 1, d / 2 - 1, w - 2);
                        ctx.clearRect(x - w / 2 + 1, y - w / 2 + 1, w - 2, d / 2 + w / 2 - 1);
                        break;

                    case 'L':
                        ctx.fillRect(x, y - w / 2, d / 2, w);
                        ctx.fillRect(x - w / 2, y + w / 2, w, -d / 2 - w / 2);
                        ctx.clearRect(x + 1, y - w / 2 + 1, d / 2 - 1, w - 2);
                        ctx.clearRect(x - w / 2 + 1, y + w / 2 - 1, w - 2, -d / 2 - w / 2 + 1);
                        break;

                    case "7":
                        ctx.fillRect(x, y - w / 2, -d / 2, w);
                        ctx.fillRect(x - w / 2, y - w / 2, w, d / 2 + w / 2);
                        ctx.clearRect(x, y - w / 2 + 1, -d / 2, w - 2);
                        ctx.clearRect(x - w / 2 + 1, y - w / 2 + 1, w - 2, d / 2 + w / 2 - 1);
                        break;

                    case 'j':
                        ctx.fillRect(x, y - w / 2, -d / 2, w);
                        ctx.fillRect(x - w / 2, y + w / 2, w, -d / 2 - w / 2);

                        ctx.clearRect(x, y - w / 2 + 1, -d / 2, w - 2);
                        ctx.clearRect(x - w / 2 + 1, y + w / 2 - 1, w - 2, -d / 2 - w / 2 + 1);


                        break;

                    case ' ':
                        ctx.fillCircle(x, y, 1)
                        break;
                    default:
                        ctx.strokeCircle(x, y, 5)
                        break;
                }
            }
        }
    }
}