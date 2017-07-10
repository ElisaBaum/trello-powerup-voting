import {getBadges} from "./services/bagde-service";
import {getCardButtons} from "./services/button-service";
import {initialize} from "trello-powerups";
import {getAttachmentSections} from "./services/attachment-service";

initialize({
    'card-buttons': function (t, options) {
        return getCardButtons(t);
    },
    'card-badges': function (t, options) {
        return getBadges(t);
    },
    'attachment-sections': function(t, options) {
        return getAttachmentSections(t, options);
    }
});