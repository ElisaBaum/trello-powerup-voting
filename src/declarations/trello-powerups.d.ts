declare module 'trello-powerups' {

    interface ITrelloPowerUpsInitializeOptions {
        [type: string]: (t: any, options: any) => any;
    }

    export function initialize(options: ITrelloPowerUpsInitializeOptions);
    export function iframe();
}