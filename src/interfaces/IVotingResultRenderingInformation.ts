import {IMember} from "./IMember";

export interface IVotingResultRenderingInformation {
  voters: IMember[];
  voteAnonymously: boolean;

  votingResultsSelector: JQuery;

  votingTypeIcon: string;

}