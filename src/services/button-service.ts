import {deleteVote, getVoteForCurrentCardAndMember, vote} from "./vote-service";
import {VotingType} from "../enums/VotingType";
import thumbsUpImg from '../images/thumbs_up.svg';
import thumbsDownImg from "../images/thumbs_down.svg";
import trashImg from "../images/trash.svg";
import {cleanupPath} from "./asset-service";
import {IButton} from "../interfaces/IButton";

const voteUpButton: IButton = {
    icon: cleanupPath(thumbsUpImg),
    text: 'Vote up',
    callback(t) {
        return vote(t, VotingType.up).then(t.closePopup());
    }
};

const voteDownButton: IButton = {
    icon: cleanupPath(thumbsDownImg),
    text: '\u200B' + 'Vote down',
    callback(t) {
        return vote(t, VotingType.down).then(t.closePopup());
    }
};

const deleteVoteButton: IButton = {
    icon: cleanupPath(trashImg),
    text: '\u2063' + 'Delete vote',
    callback(t) {
        return deleteVote(t).then(t.closePopup());
    }
};

export function getCardButtons(t) {
    return getVoteForCurrentCardAndMember(t)
        .then(function (vote) {
            const buttons: IButton[] = [];

            if (vote) {
                switch (vote.votingType) {
                    case VotingType.up: {
                        buttons.push(voteDownButton);
                        buttons.push(deleteVoteButton);
                        break;
                    }
                    case VotingType.down: {
                        buttons.push(voteUpButton);
                        buttons.push(deleteVoteButton);
                        break;
                    }
                }
            } else {
                buttons.push(voteUpButton);
                buttons.push(voteDownButton);
            }

            return buttons;
        });
}