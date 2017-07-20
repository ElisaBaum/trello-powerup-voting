import {getBadges} from "./services/bagde-service";
import {getCardButtons} from "./services/button-service";
import {initialize} from "trello-powerups";
import {getAttachmentSections} from "./services/attachment-service";
import {cleanupPath} from "./services/asset-service";

import settingsView from "./views/settings.html";

initialize({
    'card-buttons': function (t, options) {
        return getCardButtons(t);
    },
    'card-badges': function (t, options) {
        return getBadges(t);
    },
    'attachment-sections': function (t, options) {
        return getAttachmentSections(t, options);
    },
    'show-settings': function (t, options) {
        return t.popup({
            title: 'Settings',
            url: cleanupPath(settingsView)
        })
    }
});