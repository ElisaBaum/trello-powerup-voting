import {FuseBox, CopyPlugin, HTMLPlugin, CSSResourcePlugin, CSSPlugin, WebIndexPlugin} from 'fuse-box';

const fuse = FuseBox.init({
    homeDir: 'src',
    sourceMaps: true,
    output: './build/$name.js',
    plugins: [
        CopyPlugin(
            {
                files: [
                    'images/*.svg',
                    'views/*.html'
                ]
            }
        ),
        [CSSResourcePlugin(), CSSPlugin()],
        WebIndexPlugin({
            title: 'Welcome to FuseBox',
            bundles: ['settings'],
            template: './src/views/settings.html'
        })
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
