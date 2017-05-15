import {FuseBox, CopyPlugin} from 'fuse-box';

const fuse = FuseBox.init({
    homeDir: 'src',
    sourceMaps: true,
    output: './build/$name.js',
    plugins: [
        CopyPlugin(
            {
                files: ['images/*.svg']
            }
        )
    ],
    shim: {
        'trello-powerups': {
            exports: 'TrelloPowerUp'
        }
    }
});

fuse
    .bundle('powerup-voting')
    .instructions(">powerup-voting.ts");

fuse.run();
