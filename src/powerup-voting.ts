import {getBadges} from "./services/bagde-service";
import {getCardButtons} from "./services/button-service";
import {initialize} from "trello-powerups";

initialize({
    'card-buttons': function (t, options) {
        return getCardButtons(t);
    },
    'card-badges': function (t, options) {
        return getBadges(t);
    },
    'card-detail-badges': function (t, options) {
        return getBadges(t);
    }
});