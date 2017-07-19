import {ISettings} from "../interfaces/ISettings";

export const defaultSettings: ISettings = {voteAnonymously: true};

export const settings = (t: any) => t.get('board', 'shared', 'settings', defaultSettings) as Promise<ISettings>;

export const updateSettings = (t: any, settings: ISettings) => t.set('board', 'shared', 'settings', settings);