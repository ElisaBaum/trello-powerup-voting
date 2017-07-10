import {IMember} from "./IMember";

export interface IVotingResults {
    voteAnonymously: boolean;
    upVoters: IMember[];
    downVoters: IMember[];
}