import {IVote, IVoteAnonymous} from "./IVote";

export interface ICardVotings {
    cardId: string;
    votes: Array<IVote|IVoteAnonymous>;
}