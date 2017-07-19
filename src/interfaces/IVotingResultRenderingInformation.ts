import {IMember} from "./IMember";

export interface IVotingResultRenderingInformation {
  voters: IMember[];
  voteAnonymously: boolean;

  votesSelector: JQuery;

  votingResultHeaderSelector: JQuery;
  votingResultSelector: JQuery;
  votingIconSelector: JQuery;
  votingTypeIcon: string;

  votersCountSelector: JQuery;
  votersSelector: JQuery;
}