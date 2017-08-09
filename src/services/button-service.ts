import {getVotesOnCurrentCardForCurrentMember, vote, deleteVote} from "./vote-service";
import {VotingType} from "../enums/VotingType";
import thumbsUpImg from '../images/thumbs_up.svg';
import thumbsDownImg from "../images/thumbs_down.svg";
import trashImg from "../images/trash.svg";
import {cleanupImgPath} from "./asset-service";
import {IButton} from "../interfaces/IButton";
import {attachResults} from "./attachment-service";

const voteUpButton: IButton = {
    icon: cleanupImgPath(thumbsUpImg),
    text: 'Vote up',
    callback(t) {
        vote(t, VotingType.UP).then(t.closePopup());
    }
};

const voteDownButton: IButton = {
    icon: cleanupImgPath(thumbsDownImg),
    // hacky workaround to sort in correct order
    text: '\u200B' + 'Vote down',
    callback(t) {
        vote(t, VotingType.DOWN).then(t.closePopup());
    }
};

const deleteVoteButton: IButton = {
    icon: cleanupImgPath(trashImg),
    // hacky workaround to sort in correct order
    text: '\u2063' + 'Delete vote',
    callback(t) {
        deleteVote(t).then(t.closePopup());
    }
};

export function getCardButtons(t) {
    return getVotesOnCurrentCardForCurrentMember(t)
        .then(function (vote) {
            const buttons: IButton[] = [];

            if (vote && vote.votingType === VotingType.UP) {
                buttons.push(voteDownButton);
                buttons.push(deleteVoteButton);
            } else if (vote && vote.votingType === VotingType.DOWN) {
                buttons.push(voteUpButton);
                buttons.push(deleteVoteButton);
            } else {
                buttons.push(voteUpButton);
                buttons.push(voteDownButton);
            }

            // workaround: attach results every time buttons are rendered
            attachResults(t);

            return buttons;
        });
}