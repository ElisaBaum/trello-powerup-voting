import {ICardVotings} from "../interfaces/ICardVotings";
import {VotingType} from "../enums/VotingType";
import {IVotingResults} from "../interfaces/IVotingResults";
import {IMember} from "../interfaces/IMember";
import {IVote, IVoteAnonymous} from "../interfaces/IVote";
import {ICard} from "../interfaces/ICard";
import {settings} from "./settings-service";

const votings = (t: any) => t.get('card', 'shared', 'votings', []) as Promise<ICardVotings[]>;
const card = (t: any) => t.card('id') as Promise<ICard>;
const member = (t: any) => t.member('id', 'username', 'fullName', 'avatar') as Promise<IMember>;

const votingsOnCardFilter = (currentCardId: string) => (votings: ICardVotings) => votings.cardId === currentCardId;
const votesForMemberFilter = (currentMemberId: string) => (vote: IVote | IVoteAnonymous) =>
    (isAnonymous(vote) ? vote.memberId === currentMemberId : vote.member.id === currentMemberId);

function isAnonymous(vote: IVote | IVoteAnonymous): vote is IVoteAnonymous {
    return (<IVoteAnonymous>vote).memberId !== undefined;
}

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

function  getVotesOnCard(votings: ICardVotings[], currentCardId: string): IVote[] | undefined {
    const existingVotesOnCard = votings.find(votingsOnCardFilter(currentCardId));

    if (existingVotesOnCard) {
        return existingVotesOnCard.votes.map(voteConverter);
    }
}

function updateVote(votes: (IVote | IVoteAnonymous)[], currentMember: IMember, currentVotingType: VotingType) {
    const existingVoteForMember = votes.find(votesForMemberFilter(currentMember.id));

    if (existingVoteForMember) {
        if (isAnonymous(existingVoteForMember)) {
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

export const votingTypeFilter = (currentVotingType: VotingType) => (vote: IVote) => vote.votingType === currentVotingType;

export function getVotesOnCurrentCard(t: any): Promise<IVote[] | undefined> {
    return Promise.all([votings(t), card(t)])
        .then(([votings, currentCard]) => getVotesOnCard(votings, currentCard.id));
}

export function getVotesOnCurrentCardForCurrentMember(t: any): Promise<IVote | undefined> {
    return Promise.all([votings(t), card(t), member(t)])
        .then(([votings, currentCard, currentMember]) => {
                const votesOnCard = getVotesOnCard(votings, currentCard.id);

                if (votesOnCard) {
                    return votesOnCard.find(votesForMemberFilter(currentMember.id));
                }
        });
}

export function vote(t: any, currentVotingType: VotingType) {
    return Promise.all([votings(t), card(t), member(t), settings(t)])
        .then(([votings, currentCard, currentMember, settings]) => {
            const votingsOnCard = votings.find(votingsOnCardFilter(currentCard.id));

            if (settings.voteAnonymously) {
                // anonymize member
                currentMember = {id: currentMember.id};
            }

            if (votingsOnCard) {
                updateVote(votingsOnCard.votes, currentMember, currentVotingType);
            } else {
                votings.push({
                    cardId: currentCard.id,
                    votes: [{
                        member: currentMember,
                        votingType: currentVotingType
                    }]
                })
            }

            t.set('card', 'shared', 'votings', votings);
        });
}

export function deleteVote(t: any) {
    return Promise.all([votings(t), card(t), member(t)])
        .then(([votings, currentCard, currentMember]) => {
            const votingsOnCard = votings.find(votingsOnCardFilter(currentCard.id));

            if (votingsOnCard) {
                const votes = votingsOnCard.votes;
                const existingVoteForMember = votes.find(votesForMemberFilter(currentMember.id));

                if (existingVoteForMember) {
                    votes.splice(votes.indexOf(existingVoteForMember), 1);
                    t.set('card', 'shared', 'votings', votings);
                }
            }
        });
}

export function getVotingResults(t: any): Promise<IVotingResults | undefined> {
    return Promise.all([votings(t), card(t), settings(t)])
        .then(([votings, currentCard, settings]) => {
            const votes = getVotesOnCard(votings, currentCard.id);

            if (votes) {
                const upVoters = votes.filter(votingTypeFilter(VotingType.UP)).map(vote => vote.member);
                const downVoters = votes.filter(votingTypeFilter(VotingType.DOWN)).map(vote => vote.member);

                return {
                    voteAnonymously: settings.voteAnonymously,
                    upVoters: upVoters,
                    downVoters: downVoters
                }
            }
        });
}
