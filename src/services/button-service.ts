import {getVoteForCurrentCardAndMember, vote} from "./vote-service";
import {VotingType} from "../enums/VotingType";
import thumbsUpImg from '../images/thumbs_up.svg';
import thumbsDownImg from "../images/thumbs_down.svg";
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
    text: 'Vote down',
    callback(t) {
        return vote(t, VotingType.down).then(t.closePopup());
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
                        break;
                    }
                    case VotingType.down: {
                        buttons.push(voteUpButton);
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