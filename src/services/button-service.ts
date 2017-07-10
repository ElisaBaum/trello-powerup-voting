import {getVotesOnCurrentCardForCurrentMember, vote} from "./vote-service";
import {VotingType} from "../enums/VotingType";
import thumbsUpImg from '../images/thumbs_up.svg';
import thumbsDownImg from "../images/thumbs_down.svg";
import {cleanupPath} from "./asset-service";
import {IButton} from "../interfaces/IButton";
import {attachResults} from "./attachment-service";

const voteUpButton: IButton = {
    icon: cleanupPath(thumbsUpImg),
    text: 'Vote UP',
    callback(t) {
        return vote(t, VotingType.UP).then(t.closePopup());
    }
};

const voteDownButton: IButton = {
    icon: cleanupPath(thumbsDownImg),
    text: 'Vote DOWN',
    callback(t) {
        return vote(t, VotingType.DOWN).then(t.closePopup());
    }
};

export function getCardButtons(t) {
    return getVotesOnCurrentCardForCurrentMember(t)
        .then(function (vote) {
            const buttons: IButton[] = [];

            if (vote && vote.votingType === VotingType.UP) {
                buttons.push(voteDownButton);
            } else if (vote && vote.votingType === VotingType.DOWN) {
                buttons.push(voteUpButton);
            } else {
                buttons.push(voteUpButton);
                buttons.push(voteDownButton);
            }

            // todo bessere stelle?
            attachResults(t);

            return buttons;
        });
}