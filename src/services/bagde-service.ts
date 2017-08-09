import {VotingType} from "../enums/VotingType";
import {getVotesOnCurrentCard, votingTypeFilter} from "./vote-service";
import thumbsUpImg from '../images/thumbs_up_white.svg';
import thumbsDownImg from '../images/thumbs_down_white.svg';
import {cleanupImgPath} from "./asset-service";
import {IBadge} from "../interfaces/IBadge";
import {IVote} from "../interfaces/IVote";

const badgeColor = (votingType: VotingType) => votingType === VotingType.UP ? 'green' : 'red';
const badgeTitle = (votingType: VotingType) => votingType === VotingType.UP ? 'Ups' : 'Downs';
const badgeIcon = (votingType: VotingType) => cleanupImgPath(votingType == VotingType.UP ? thumbsUpImg : thumbsDownImg);

function createBadge(votes: IVote[], votingType: VotingType): IBadge | undefined {
    const numberOfVotes = votes.filter(votingTypeFilter(votingType)).length;

    if (numberOfVotes) {
        return {
            title: badgeTitle(votingType),
            text: numberOfVotes,
            icon: badgeIcon(votingType),
            color: badgeColor(votingType)
        }
    }
}

export function getBadges(t: any): Promise<IBadge[]> {
    return getVotesOnCurrentCard(t)
        .then((votes) => {
            if (votes) {
                const upBadge = createBadge(votes, VotingType.UP);
                const downBadge = createBadge(votes, VotingType.DOWN);
                return [upBadge, downBadge].filter(badge => !!badge);
            } else {
                return [];
            }
        });
}