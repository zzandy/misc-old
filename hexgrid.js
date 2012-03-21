<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Untitled Page</title>
    <style type="text/css">
        *
        {
            background-color: #131510;
            color: #aaa6a0;
            font: 10pt/14pt monospace;
        }
        #out div
        {
            float: left;
            width: 1em;
            text-align: center;
        }
        #out div.odd
        {
            margin-top: .6em;
        }
    </style>
</head>
<body>
    <div id="out">
    </div>
    <script type="text/javascript">

        /*
        * TODO:
        * 3. Distance
        * 4. Chunks
        * 5. Line
        * 6. Circles
        */

        /*
        *  Screen coordinates (y,x):
        *  
        *  0,0     0,2
        *      0,1     0,3
        *  1,0     1,2
        *      1,1     1,3
        *  
        *  
        *  World coordinates (y,x):
        *  
        *  2-2     1,0     0,2
        *      1-1     0,1
        *  1-2     0,0    -1,2
        *      0-1    -1,1
        *  0-2    -1,0    -2,2
        *
        *
        *  Storage coordinate (s):
        *
        *  11      2      7
        *      3       1
        *  12      0      18
        *      4       6   
        *  13      5      17
        */

        var D_URIGHT = 0;
        var D_UP = 1;
        var D_ULEFT = 2;
        var D_DLEFT = 3;
        var D_DOWN = 4;        
        var D_DRIGHT = 5;      

        /* Possible directions in world space
        *          UP
        *           1
        *  ULEFT 2     0 URIGHT
        *  DLEFT 3     5 DRIGHT
        *           4
        *          DOWN
        */
        var dirw = [[0, 1], [1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1]];

        // World to screen
        function w2sc(y0, x0, yw, xw) {
            return [y0 - Math.floor((xw + (x0 + 1) % 2) / 2) - yw, xw + x0];
        }

        // Screen to world
        function sc2w(y0, x0, ys, xs) {
            var x = xs - x0;
            return [y0 - Math.floor((x + (x0 + 1) % 2) / 2) - ys, x];
        }

        function ring2st(r) {
            return 3 * r * (r + 1);
        }

        function st2ring(st) {
            return Math.ceil((Math.sqrt(12 * st + 9) - 3) / 6);
        }

        // Storage to world
        function st2w(s) {
            if(s == 0) return [0,0];
    
            var r = st2ring(s)
            var d = s - ring2st(r-1) - 1
            var sx = d / r
            var sn = d % r

            var an = [
                    [[0,1],[1,-1]],
                    [[1,0],[0,-1]],
                    [[1,-1],[-1,0]],
                    [[0,-1],[-1,1]],
                    [[-1,0],[0,1]],
                    [[-1,1],[1,0]]
                  ];
    
            var q = [r, sn]
            var o = an[sx]

            return [q[0]*o[0][0] + q[1]*o[0][1], q[0]*o[1][0] + q[1]*o[1][1]];
        }

        // World to storage
        function w2st(x, y) {
            if (y==0 && x==0) return 0;
                
            var ax = Math.abs(x);
            var ay = Math.abs(y);
            var axy = Math.abs(x+y);
            
            
            // ring
            var r = (ay + ax + axy) / 2;
            // hextant
            var s = (y >= 0 && x > 0) ? 0
                  : (x <= 0 && y > 0) ? (ax < y ? 1 : 2)
                  : (y <= 0 && x < 0) ? 3
                  : (ay > x ? 4 : 5);

            var n = s%3;
            n = n == 0 ? ay : n == 1 ? ax : axy;

            var a0 = ring2st(r);
            var a1 = ring2st(r - 1);

            return n + a1 + 1 + s * (a0 - a1) / 6;
        }

        var out = document.getElementById('out');
        var w = 73;
        var h = 21;

        var y0 = Math.floor(h/2);
        var x0 = Math.floor(w/4);
        // screen coordinates of world origin (0,0) -> (y,x)
        var originscreen = [y0, x0];
               

        var map = [];
        var len = ring2st(Math.ceil(h)) + 1;

        for (var n = 0; n < len; ++n) {
            map.push(Math.random() < .1 ? '#' : '&middot;');
        }

        var ovr = []
        for (var i = 0; i < h; ++i) {
            ovr.push([]);
            for (var j = 0; j < w; ++j)
                ovr[i].push('');
        }

        ovr[1][1] = '7';
        ovr[1][2] = '8';
        ovr[1][3] = '9';
        ovr[2][2] = '*'
        ovr[2][1] = '4';
        ovr[3][2] = '5';
        ovr[2][3] = '6';

        ovr[1][5] = 'h';
        ovr[1][6] = 'k';
        ovr[1][7] = 'u';
        ovr[2][5] = 'b';
        ovr[2][6] = '*';
        ovr[3][6] = 'j';
        ovr[2][7] = 'l';

        // player
        var p = [0, 0]

        function text(i, j, s) {
            var n = s.length;
            var k = -1;
            while (++k < n) {
                ovr[i - Math.floor((k + 1) / 2)][k] = s[k];
            }
        }

        text(h - 2, 0, 'Health (20/35):');
        text(h - 1, 0, '[=======----]');

        function valid(world) {
            var x = world[1];
            var y = world[0];

            return y >= 0 && x >= 0 && y < map.length && x < map[y].length;
        }

        function print() {
            var text = [];
            for (var j = 0; j < w; ++j) {
                text.push((j % 2 == 0) ? '<div>' : '<div class="odd">');
                for (var i = 0; i < h; ++i) {
                    

                    var char = ' ';
                    if (ovr[i][j] != '') {
                        char = ovr[i][j];
                    }
                    else {
                        var world = sc2w(y0, x0, i, j);
                        if (world[0] == p[0] && world[1] == p[1]) {
                            char = '@';
                        }
                        else {
                            var st = w2st(world[0], world[1]);
                            char = st < len ? map[st] : ' ';
                        }
                    }

                    text.push(char + '</br>');
                }
                text.push('</div>');
            }

            out.innerHTML = text.join('');
        }

        print();
        document.onkeydown = function (e) {
            var char = window.event.keyCode;
            switch (char) {
                case 72: case 103: app(p, dirw[D_ULEFT]); break;
                case 75: case 104: app(p, dirw[D_UP]); break;
                case 85: case 105: app(p, dirw[D_URIGHT]); break;
                case 60: case 100: app(p, dirw[D_DLEFT]); break;
                case 74: case 101: app(p, dirw[D_DOWN]); break;
                case 76: case 102: app(p, dirw[D_DRIGHT]); break;

                case 97: /*screen left*/s = w2sc(y0, x0, p[0], p[1]); set(p, sc2w(y0, x0, s[0], s[1] - 1)); break;
                case 99: /*screen right*/s = w2sc(y0, x0, p[0], p[1]); set(p, sc2w(y0, x0, s[0], s[1] + 1)); break;
            }

            text(h - 3, 0, p[0] + ', ' + p[1]);

            y0 += p[0];
            x0 += p[1];

            p = [0, 0]
            print();
        }

        function set(a, b) {
            a[0] = b[0];
            a[1] = b[1];
            return a;
        }

        function app(a, b) {
            a[0] += b[0];
            a[1] += b[1];
            return a;
        }

        function add(a, b) {
            return [a[0] + b[0], a[1] + b[1]];
        }
    
    </script>
</body>
</html>
