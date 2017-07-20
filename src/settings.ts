import {iframe} from "trello-powerups";
import {ISettings} from "./interfaces/ISettings";
import {defaultSettings, settings, updateSettings} from "./services/settings-service";

import "spectre.css/dist/spectre.css";

const t = iframe();
const voteAnonymouslySelector = $('#voteAnonymously');

let currentSettings: ISettings = defaultSettings;

voteAnonymouslySelector.change(function() {
  currentSettings.voteAnonymously = $(this).prop('checked');
  return updateSettings(t, currentSettings);
});

t.render(function(){
  return settings(t)
    .then((settings) => {
      voteAnonymouslySelector.prop('checked', settings.voteAnonymously);
      currentSettings = settings;
    })
});