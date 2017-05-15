import {VotingType} from "../enums/VotingType";

export interface IVote {
    memberId: string;
    votingType: VotingType;
}