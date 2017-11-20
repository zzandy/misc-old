import { fullscreenCanvas, ICanvasRenderingContext2D } from '../../lib/canvas';
import { wheelHcy, wheel2rgb, hcy2rgb } from '../../lib/color';

export const main = function () {
    const ctx = fullscreenCanvas();

    const img = new Image();

    img.addEventListener('load', function () {
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(2, 2, img.width - 4, img.height - 4);

        ctx.putImageData(data, data.width + 10, 0);

        const rows = 8;
        const size = (data.height / rows) | 0;
        const cols = data.width / size | 0;
        const colors = grabColors(data, rows, cols, size);
        const hcycolors = getHcyData();

        let current = 0;
        const guessNext = function () {
            const color = colors[current];

            const q = current / colors.length;

            ctx.fillStyle = 'rgb(' + color.join(',') + ')';
            ctx.fillCircle(current * size + size / 2, data.height * 2 + 10 + size / 2, size / 2);

            let [h, c, y] = hcycolors[current];//guess(color);
            ctx.fillStyle = wheel2rgb(h*10, 1,.4);
            ctx.fillRect(current * size, data.height * 2 + 10 + size + 1, size - 1, size);

            [h, c, y] = [248.63*q + 231.5, q * 6 / (q * 6 + 1), Math.pow(q, 1.3) + .03 * (1 - q)];
            ctx.fillStyle = wheel2rgb(h*10, 1, .4);
            ctx.fillRect(current * size, data.height * 2 + 10 + 2 * (size + 1), size - 1, size);

            [h, c, y] = previousAttempt(q);
            ctx.fillStyle = hcy2rgb(h, c, y);
            ctx.fillRect(current * size, data.height * 2 + 10 + 3 * (size + 1), size - 1, size);

            if (++current < colors.length)
                requestAnimationFrame(guessNext);
        };

        requestAnimationFrame(guessNext);
    });

    img.src = 'ironbow.png';
}

function grabColors(data: ImageData, rows: number, cols: number, size: number): [number, number, number][] {
    const colors: [number, number, number][] = [];

    for (let i = 0; i < rows; ++i) {
        for (let j = 0; j < cols; ++j) {

            let x = (j + .5);
            let y = (i + .5);

            if (x < 9) x += 9;
            else x -= 9;

            const id = size * (x + y * data.width) * 4 | 0;

            const color: [number, number, number] = [data.data[id], data.data[id + 1], data.data[id + 2]];
            colors.push(color);
        }
    }

    return colors;
}

function previousAttempt(q: number) {
    const h = 240 + 180 * ease1(q);
    const y = q;
    return [h, 1, y];
}

function ease1(v: number): number {
    return join(v,

        [0, .09, x => Math.pow(4 * x, 3)],
        [.09, .31, x => (x / 1.15 - .033)],
        [.31, .49, x => (.24 + Math.pow(2.4 * (x - .3), 2))],
        [.49, 1, x => (Math.log(5 * x) / 4.5 + .25)]

    ) / .6;
}

function join(v: number, ...segments: [number, number, (x: number) => number][]): number {
    for (const segment of segments) {
        if (v >= segment[0] && v < segment[1])
            return segment[2](v);
    }
    return v;
}

function ease(t: number) {
    return t * t * t * (6 * t * t - 15 * t + 10);
}

function fmt(r: number, g: number, b: number) {
    return [r * 255 | 0, g * 255 | 0, b * 255 | 0];
}

function guess(color: [number, number, number], debug: boolean = false, res: number = 1): [number, number, number] {
    const [r0, g0, b0] = color;

    let dif = Infinity;
    let best: [number, number, number] | undefined;
    for (var h = 0; h < 360 * res; ++h) {
        for (let c = 0; c < 255 * res; ++c) {
            for (let y = 0; y < 255 * res; ++y) {
                let [r, g, b] = wheelHcy(h / res, c / 255 / res, y / 255 / res);
                let d = Math.abs((r * 255 | 0) - r0) + Math.abs((g * 255 | 0) - g0) + Math.abs((b * 255 | 0) - b0);
                if (d < dif) {
                    if (debug) console.log(d, dif, fmt(r, g, b), fmt(r0, g0, b0));
                    best = [h / res, c / 255 / res, y / 255 / res];
                    dif = d;
                }
            }
        }
    }

    best = <[number, number, number]>best;
    const [r, g, b] = wheelHcy(best[0], best[1], best[2]);
    const clr = fmt(r, g, b);
    const diff = [Math.abs(color[0] - clr[0]), Math.abs(color[1] - clr[1]), Math.abs(color[2] - clr[2])];
    let md = diff[0] + diff[1] + diff[2];
    if (md > 0 && md < 3 && res == 1) {
        return guess(color, debug, 2);
    }

    console.log(color, clr, diff, 'hcy(' + best.join(', ') + ')');

    return <[number, number, number]>best;
}

function getHcyData(): [number, number, number][] {
    return [
        [242,0.0666666666666666,0.0117647058823529],
        [248,0.105882352941176,0.0156862745098039],
        [243,0.141176470588235,0.0196078431372549],
        [243,0.176470588235294,0.0235294117647058],
        [242,0.207843137254901,0.0274509803921568],
        [245,0.250980392156862,0.0352941176470588],
        [242.5,0.249019607843137,0.0333333333333333],
        [244,0.286274509803921,0.0392156862745098],
        [243,0.309803921568627,0.0392156862745098],
        [240,0.32156862745098,0.0392156862745098],
        [240,0.36078431372549,0.0431372549019607],
        [240,0.376470588235294,0.0431372549019607],
        [243,0.396078431372549,0.0509803921568627],
        [243,0.405882352941176,0.0529411764705882],
        [245,0.413725490196078,0.0607843137254901],
        [249,0.411764705882352,0.0666666666666666],
        [250,0.415686274509803,0.0705882352941176],
        [254,0.419607843137254,0.0862745098039215],
        [257,0.435294117647058,0.0901960784313725],
        [262,0.44313725490196,0.0901960784313725],
        [263,0.447058823529411,0.101960784313725],
        [269,0.458823529411764,0.109803921568627],
        [272,0.464705882352941,0.115686274509803],
        [274,0.470588235294117,0.12156862745098],
        [277,0.458823529411764,0.12156862745098],
        [280,0.462745098039215,0.129411764705882],
        [280.5,0.478431372549019,0.135294117647058],
        [281,0.488235294117647,0.139215686274509],
        [285.5,0.480392156862745,0.147058823529411],
        [287,0.494117647058823,0.152941176470588],
        [286.5,0.484313725490196,0.158823529411764],
        [287,0.494117647058823,0.162745098039215],
        [291,0.501960784313725,0.168627450980392],
        [291.5,0.496078431372549,0.172549019607843],
        [296.5,0.507843137254901,0.186274509803921],
        [300.5,0.515686274509804,0.194117647058823],
        [301.5,0.531372549019607,0.198039215686274],
        [303,0.537254901960784,0.20392156862745],
        [304,0.533333333333333,0.211764705882352],
        [305,0.545098039215686,0.215686274509803],
        [306.5,0.549019607843137,0.225490196078431],
        [307,0.545098039215686,0.223529411764705],
        [308,0.56078431372549,0.231372549019607],
        [309,0.556862745098039,0.239215686274509],
        [309.5,0.574509803921568,0.245098039215686],
        [310.5,0.590196078431372,0.252941176470588],
        [312,0.598039215686274,0.258823529411764],
        [312,0.62156862745098,0.26078431372549],
        [314,0.637254901960784,0.26078431372549],
        [316.5,0.654901960784313,0.276470588235294],
        [317,0.654901960784313,0.28235294117647],
        [319,0.662745098039215,0.290196078431372],
        [323,0.678431372549019,0.3],
        [324.5,0.668627450980392,0.307843137254902],
        [326,0.670588235294117,0.317647058823529],
        [326.5,0.664705882352941,0.323529411764705],
        [329.5,0.672549019607843,0.329411764705882],
        [331,0.670588235294117,0.333333333333333],
        [333,0.662745098039215,0.34313725490196],
        [335,0.674509803921568,0.345098039215686],
        [337,0.668627450980392,0.358823529411764],
        [336.5,0.668627450980392,0.366666666666666],
        [338.5,0.664705882352941,0.374509803921568],
        [340.5,0.670588235294117,0.378431372549019],
        [342,0.678431372549019,0.388235294117647],
        [344.5,0.670588235294117,0.396078431372549],
        [348,0.678431372549019,0.4],
        [352,0.662745098039215,0.396078431372549],
        [358.5,0.649019607843137,0.4],
        [4,0.672549019607843,0.409803921568627],
        [10,0.725490196078431,0.423529411764705],
        [13,0.741176470588235,0.423529411764705],
        [15.5,0.752941176470588,0.437254901960784],
        [19,0.776470588235294,0.439215686274509],
        [21,0.792156862745098,0.44313725490196],
        [22.5,0.809803921568627,0.441176470588235],
        [25,0.815686274509803,0.452941176470588],
        [25,0.815686274509803,0.46078431372549],
        [28.5,0.837254901960784,0.472549019607843],
        [28,0.831372549019607,0.480392156862745],
        [29.5,0.833333333333333,0.480392156862745],
        [31.5,0.833333333333333,0.492156862745098],
        [33,0.835294117647058,0.501960784313725],
        [33,0.835294117647058,0.501960784313725],
        [36,0.84313725490196,0.509803921568627],
        [36.5,0.849019607843137,0.529411764705882],
        [38,0.858823529411764,0.541176470588235],
        [39.5,0.841176470588235,0.554901960784313],
        [41,0.84313725490196,0.564705882352941],
        [44,0.862745098039215,0.572549019607843],
        [44,0.874509803921568,0.580392156862745],
        [44.5,0.876470588235294,0.590196078431372],
        [48,0.862745098039215,0.596078431372549],
        [49,0.866666666666666,0.60392156862745],
        [50,0.854901960784313,0.611764705882353],
        [50.5,0.86078431372549,0.617647058823529],
        [51.5,0.864705882352941,0.62156862745098],
        [53,0.874509803921568,0.627450980392156],
        [54,0.872549019607843,0.641176470588235],
        [54,0.870588235294117,0.64313725490196],
        [55,0.870588235294117,0.650980392156862],
        [56.5,0.876470588235294,0.664705882352941],
        [58.5,0.905882352941176,0.676470588235294],
        [64,0.878431372549019,0.690196078431372],
        [68,0.886274509803921,0.698039215686274],
        [72,0.866666666666666,0.713725490196078],
        [73,0.870588235294117,0.717647058823529],
        [74,0.854901960784313,0.723529411764705],
        [77,0.858823529411764,0.729411764705882],
        [79,0.862745098039215,0.733333333333333],
        [84,0.890196078431372,0.745098039215686],
        [82,0.890196078431372,0.752941176470588],
        [86,0.890196078431372,0.76078431372549],
        [84.5,0.898039215686274,0.770588235294117],
        [85,0.909803921568627,0.780392156862745],
        [85,0.905882352941176,0.784313725490196],
        [90,0.917647058823529,0.792156862745098],
        [92,0.913725490196078,0.796078431372549],
        [93,0.886274509803921,0.811764705882352],
        [92,0.839215686274509,0.823529411764705],
        [95.5,0.770588235294117,0.839215686274509],
        [95.5,0.733333333333333,0.845098039215686],
        [97,0.694117647058823,0.866666666666666],
        [97,0.654901960784313,0.874509803921568],
        [99,0.592156862745098,0.88235294117647],
        [100,0.541176470588235,0.890196078431372],
        [103,0.498039215686274,0.903921568627451],
        [107,0.447058823529411,0.909803921568627],
        [99,0.407843137254901,0.92156862745098],
        [91.5,0.358823529411764,0.925490196078431],
        [94,0.309803921568627,0.933333333333333],
        [105,0.266666666666666,0.945098039215686],
        [95,0.219607843137254,0.956862745098039],
        [94,0.176470588235294,0.956862745098039],
        [93,0.133333333333333,0.964705882352941],
        [65,0.0588235294117647,0.978431372549019]];
}