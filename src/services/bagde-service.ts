import {ICardVotings} from "../interfaces/ICardVotings";
import {IVote} from "../interfaces/IVote";
import {VotingType} from "../enums/VotingType";
import {votingsOnCardFilter, votingTypeFilter} from "./vote-service";
import thumbsUpImg from '../images/thumbs_up_white.svg';
import thumbsDownImg from '../images/thumbs_down_white.svg';
import {cleanupPath} from "./asset-service";
import {IBadge} from "../interfaces/IBadge";

function createBadge(votes: IVote[], votingType: VotingType): IBadge | undefined {
    const numberOfVotes = votes.filter(votingTypeFilter(votingType)).length;

    if (numberOfVotes) {
        const badgeIcon = votingType == VotingType.up ? cleanupPath(thumbsUpImg) : cleanupPath(thumbsDownImg);
        const badgeColor = votingType == VotingType.up ? 'green' : 'red';
        const badgeTitle = votingType == VotingType.up ? 'Ups' : 'Downs';

        return {
            title: badgeTitle,
            text: numberOfVotes,
            icon: badgeIcon,
            color: badgeColor
        }
    }
}

export function getBadges(t: any) {
    return Promise
        .all([
            t.get('card', 'shared', 'votings', []) as Promise<ICardVotings[]>,
            t.card('id').get('id') as Promise<string>,
        ])
        .then(([votings, currentCardId]) => {
            const existingVotingsOnCard = votings.find(votingsOnCardFilter(currentCardId));

            if (existingVotingsOnCard) {
                const upBadge = createBadge(existingVotingsOnCard.votes, VotingType.up);
                const downBadge = createBadge(existingVotingsOnCard.votes, VotingType.down);

                return [upBadge, downBadge].filter(badge => !!badge);
            } else {
                return [];
            }
        });
}