import {ICardVotings} from "../interfaces/ICardVotings";
import {IVote} from "../interfaces/IVote";
import {VotingType} from "../enums/VotingType";

export const votesForMemberFilter = (currentMemberId: string) => (vote: IVote) => vote.memberId === currentMemberId;

export const votingsOnCardFilter =
    (currentCardId: string) => (votings: ICardVotings) => votings.cardId === currentCardId;

export const votingTypeFilter =
    (currentVotingType: VotingType) => (vote: IVote) => vote.votingType === currentVotingType;

export function getVoteForCurrentCardAndMember(t: any): Promise<IVote | undefined> {
    return Promise
        .all([
            t.get('card', 'shared', 'votings', []) as Promise<ICardVotings[]>,
            t.card('id').get('id') as Promise<string>,
            t.member('id').get('id') as Promise<string>
        ])
        .then(([votings, currentCardId, currentMemberId]) => {
            const existingVotingsOnCard = votings.find(votingsOnCardFilter(currentCardId));

            if (existingVotingsOnCard) {
                return existingVotingsOnCard.votes.find(votesForMemberFilter(currentMemberId));
            }
        });
}

export function vote(t: any, currentVotingType: VotingType) {
    return Promise
        .all([
            t.get('card', 'shared', 'votings', []) as Promise<ICardVotings[]>,
            t.card('id').get('id') as Promise<string>,
            t.member('id').get('id') as Promise<string>
        ])
        .then(([votings, currentCardId, currentMemberId]) => {
            const existingVotingsOnCard = votings.find(votingsOnCardFilter(currentCardId));

            if (existingVotingsOnCard) {
                const existingVoteForMember = existingVotingsOnCard.votes.find(votesForMemberFilter(currentMemberId));

                if (existingVoteForMember) {
                    existingVoteForMember.votingType = currentVotingType;
                } else {
                    existingVotingsOnCard.votes.push({
                        memberId: currentMemberId,
                        votingType: currentVotingType
                    })
                }
            } else {
                votings.push({
                    cardId: currentCardId,
                    votes: [{
                        memberId: currentMemberId,
                        votingType: currentVotingType
                    }]
                })
            }

            t.set('card', 'shared', 'votings', votings);
        });
}