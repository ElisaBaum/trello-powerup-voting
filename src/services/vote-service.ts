import {ICardVotings} from "../interfaces/ICardVotings";
import {VotingType} from "../enums/VotingType";
import {IVotingResults} from "../interfaces/IVotingResults";
import {IMember} from "../interfaces/IMember";
import {IVote, IVoteAnonymous} from "../interfaces/IVote";

function isAnonymous(vote: IVote | IVoteAnonymous): vote is IVoteAnonymous {
    return (<IVoteAnonymous>vote).memberId !== undefined;
}

const votesForMemberFilter = (currentMemberId: string) => (vote: IVote | IVoteAnonymous) =>
    isAnonymous(vote) ? vote.memberId === currentMemberId : vote.member.id === currentMemberId;

const voteConverter = (vote: IVote | IVoteAnonymous): IVote => {
    if (isAnonymous(vote)) {
        return {
            member: { id: vote.memberId },
            votingType: vote.votingType
        }
    } else {
        return vote;
    }
};

const votingsOnCardFilter = (currentCardId: string) => (votings: ICardVotings) => votings.cardId === currentCardId;

function getVotesOnCard(votings: ICardVotings[], currentCardId: string): IVote[] | undefined {
    const existingVotesOnCard = votings.find(votingsOnCardFilter(currentCardId));

    if (existingVotesOnCard) {
        return existingVotesOnCard.votes.map(voteConverter);
    }
}

function getVotesOnCardForMember(votings: ICardVotings[], currentCardId: string, currentMemberId: string): IVote | undefined {
    const votesOnCard = getVotesOnCard(votings, currentCardId);

    if (votesOnCard) {
        return votesOnCard.find(votesForMemberFilter(currentMemberId));
    }
}

function updateVote(votes: IVote[], currentMember: IMember, currentVotingType: VotingType) {
    const existingVoteForMember = votes.find(votesForMemberFilter(currentMember.id));

    if (existingVoteForMember) {
        if (isAnonymous(existingVoteForMember)) {
            // todo
            console.log(votes);
            console.log('index: ' + votes.indexOf(existingVoteForMember));

            // remove old vote
            votes.splice(votes.indexOf(existingVoteForMember), 1);

            // create and add new vote
            votes.push({
                member: currentMember,
                votingType: currentVotingType
            })
        } else {
            existingVoteForMember.votingType = currentVotingType;
            existingVoteForMember.member = currentMember;
        }
    } else {
        votes.push({
            member: currentMember,
            votingType: currentVotingType
        })
    }
}

export const votingTypeFilter =
    (currentVotingType: VotingType) => (vote: IVote) => vote.votingType === currentVotingType;

export function getVotesOnCurrentCard(t: any): Promise<IVote[] | undefined> {
    return Promise
        .all([
            t.get('card', 'shared', 'votings', []) as Promise<ICardVotings[]>,
            t.card('id').get('id') as Promise<string>,
        ])
        .then(([votings, currentCardId]) => getVotesOnCard(votings, currentCardId));
}

export function getVotesOnCurrentCardForCurrentMember(t: any): Promise<IVote | undefined> {
    return Promise
        .all([
            t.get('card', 'shared', 'votings', []) as Promise<ICardVotings[]>,
            t.card('id').get('id') as Promise<string>,
            t.member('id').get('id') as Promise<string>
        ])
        .then(([votings, currentCardId, currentMemberId]) =>
            getVotesOnCardForMember(votings, currentCardId, currentMemberId));
}

export function vote(t: any, currentVotingType: VotingType) {
    return Promise
        .all([
            t.get('card', 'shared', 'votings', []) as Promise<ICardVotings[]>,
            t.card('id').get('id') as Promise<string>,
            t.member('id', 'username', 'fullName', 'avatar') as Promise<IMember>,
            t.get('board', 'shared', 'voteAnonymously', true) as Promise<boolean>
        ])
        .then(([votings, currentCardId, currentMember, voteAnonymously]) => {
            const votesOnCard = getVotesOnCard(votings, currentCardId);

            if (voteAnonymously) {
                currentMember.fullName = undefined;
            }

            if (votesOnCard) {
                updateVote(votesOnCard, currentMember, currentVotingType);
            } else {
                votings.push({
                    cardId: currentCardId,
                    votes: [{
                        member: currentMember,
                        votingType: currentVotingType
                    }]
                })
            }

            t.set('card', 'shared', 'votings', votings);
        });
}

export function getVotingResults(t: any): Promise<IVotingResults | undefined> {
    return Promise
        .all([
            t.get('card', 'shared', 'votings', []) as Promise<ICardVotings[]>,
            t.get('board', 'shared', 'voteAnonymously', true) as Promise<boolean>,
            t.card('id').get('id') as Promise<string>,
        ])
        .then(([votings, voteAnonymously, currentCardId]) => {
            const votes = getVotesOnCard(votings, currentCardId);

            if (votes) {
                const upVotes = votes.filter(votingTypeFilter(VotingType.UP)).map(vote => vote.member);
                const downVotes = votes.filter(votingTypeFilter(VotingType.DOWN)).map(vote => vote.member);

                return {
                    voteAnonymously: voteAnonymously,
                    upVoters: upVotes,
                    downVoters: downVotes
                }
            }
        });
}
