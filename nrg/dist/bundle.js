System.register("main", ["vue"], function (exports_1, context_1) {
    "use strict";
    var vue_1, start;
    var __moduleName = context_1 && context_1.id;
    function gen(isOn, name, yld, maxFuel, topUp) {
        if (topUp === void 0) { topUp = maxFuel / 20; }
        return {
            isOn: isOn == 1,
            name: name, yield: yld, fuel: maxFuel, maxFuel: maxFuel, fuelTopUp: topUp
        };
    }
    function wait(n) {
        return new Promise(function (resolve, reject) {
            setTimeout(resolve, n);
        });
    }
    return {
        setters: [
            function (vue_1_1) {
                vue_1 = vue_1_1;
            }
        ],
        execute: function () {
            exports_1("start", start = function () {
                var uranium = [1000, { name: 'Uranium' }];
                var data = {
                    store: [uranium, [10000, { name: 'Iron Ore' }], [3000, { name: 'Coal' }]],
                    generators: [
                        gen(1, 'main', 1000, 1000),
                        gen(0, 'aux #1', 200, 1000),
                        gen(0, 'aux #2', 200, 1000),
                        gen(0, 'aux #3', 200, 1000),
                        gen(0, 'aux #4', 200, 1000),
                        gen(0, 'aux #5', 200, 1000)
                    ]
                };
                var app = new vue_1.default({
                    el: '#doc',
                    data: data,
                    methods: {
                        boost: function () {
                            data.generators[0].yield *= 1.2;
                            wait(2000).then(function () { return data.generators[0].yield /= 1.2; });
                        },
                        fill: function (g) {
                            g.fuel += g.fuelTopUp;
                            uranium[0] -= g.fuelTopUp;
                        },
                        canFill: function (g) {
                            return g.maxFuel - g.fuel > g.fuelTopUp && uranium[0] > g.fuelTopUp;
                        }
                    }
                });
            });
        }
    };
});
//# sourceMappingURL=bundle.js.map