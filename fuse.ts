import {FuseBox, CopyPlugin, CSSPlugin, CSSResourcePlugin, WebIndexPlugin} from 'fuse-box';

const fuse = FuseBox.init({
    homeDir: 'src',
    sourceMaps: true,
    output: './build/$name.js',
    plugins: [
        CopyPlugin(
            {
                files: [
                    'images/*.svg',
                ]
            }
        ),
        CopyPlugin(
            {
                files: [
                    'views/*.html'
                ],
                dest: '.',
                resolve: '.'
            }
        ),
        [CSSResourcePlugin(), CSSPlugin()],
        WebIndexPlugin({
            template: 'src/index.html',
            path: '.',
            bundles: ['powerup-voting']
        }),
    ],
    shim: {
        'trello-powerups': {
            exports: 'TrelloPowerUp'
        },
        'jquery': {
            source: 'node_modules/jquery/dist/jquery.js',
            exports:'$'
        }
    }
});

fuse
    .bundle('powerup-voting')
    .instructions(">powerup-voting.ts");

fuse
    .bundle('voting-results')
    .instructions('>voting-results.ts');

fuse
    .bundle('settings')
    .instructions('>settings.ts');

fuse.run();
