
export interface ICanvasRenderingContext2D extends CanvasRenderingContext2D {
    clear(): ICanvasRenderingContext2D;
    makePath(vertices: number[]): ICanvasRenderingContext2D;
    fillCircle(x: number, y: number, r: number): ICanvasRenderingContext2D;
    strokeCircle(x: number, y: number, r: number): ICanvasRenderingContext2D;
}

export const getCanvas = (isRelative: boolean = false): HTMLCanvasElement => {
    const can = document.createElement('canvas');

    can.width = window.innerWidth;
    can.height = window.innerHeight;

    if (!isRelative) {
        can.style.position = 'absolute';
        can.style.top = '0';
        can.style.left = '0';
    }

    return can;
}

export const fullscreenCanvas3d = (): WebGLRenderingContext => {
    const can = getCanvas();
    const gl = can.getContext('webgl');

    if (gl == null) throw new Error('failed to get \'webgl\' context');

    document.body.appendChild(can);
    return gl;
}

export function fullscreenCanvas(relative: boolean = false): ICanvasRenderingContext2D {

    const can = getCanvas(relative);
    const ctx = <ICanvasRenderingContext2D>can.getContext('2d');

    if (ctx == null)
        throw new Error('failed to get \'2d\' context');

    ctx.clear = function () {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        return ctx;
    };

    ctx.makePath = function (vertices: number[]) {
        ctx.beginPath();
        ctx.moveTo(vertices[0], vertices[1]);
        for (var i = 2; i < vertices.length; i += 2) {
            ctx.lineTo(vertices[i], vertices[i + 1]);
        }
        ctx.closePath();

        return ctx;
    }

    ctx.strokeCircle = function (x: number, y: number, r: number) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI, true);
        ctx.closePath();
        ctx.stroke();
        return ctx;
    }

    ctx.fillCircle = function (x: number, y: number, r: number) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI, true);
        ctx.closePath();
        ctx.fill();
        return ctx;
    }

    document.body.appendChild(can);
    return ctx;
}