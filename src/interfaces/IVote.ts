import {IMember} from "./IMember";
import {VotingType} from "../enums/VotingType";

export interface IVote {
    member: IMember;
    votingType: VotingType;
}

// deprecated
export interface IVoteAnonymous {
    memberId: string;
    votingType: VotingType;
}