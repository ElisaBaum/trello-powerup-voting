import {getVotingResults} from "./services/vote-service";
import {iframe} from "trello-powerups";
import {IMember} from "./interfaces/IMember";
import thumbsUpImg from './images/thumbs_up_white.svg';
import thumbsDownImg from './images/thumbs_down_white.svg';
import {cleanupPath} from "./services/asset-service";

const upVotesSelector = $('#upVoters');
const upVotesIconSelector = $('#upVotesIcon');
const upVotesResult = $('#upVotesResult');

const downVotesSelector = $('#downVoters');
const downVotesIconSelector = $('#downVotesIcon');
const downVotesResult = $('#downVotesResult');

const t = iframe();

const membersWithFullNameFilter = (member: IMember) => member.fullName !== undefined;

function votingResultText(voteAnonymously: boolean, voters: IMember[]): string {
    if (voteAnonymously) {
        return voters.length.toString();
    } else {
        return voters.filter(membersWithFullNameFilter).map(member => member.fullName).join(', ');
    }
}

const votingResultIcon = (image) => 'url("' + cleanupPath(image) + '")';

t.render(() => {
    getVotingResults(t)
        .then((results) => {
            if (results) {

                if (results.upVoters.length) {
                    upVotesSelector.text(votingResultText(results.voteAnonymously, results.upVoters));
                    upVotesIconSelector.css('background-image', votingResultIcon(thumbsUpImg));
                    upVotesResult.css('display', 'block');
                } else {
                    upVotesResult.css('display', 'none');
                }

                if (results.downVoters.length) {
                    downVotesSelector.text(votingResultText(results.voteAnonymously, results.downVoters));
                    downVotesIconSelector.css('background-image', votingResultIcon(thumbsDownImg));
                    downVotesResult.css('display', 'block');
                } else {
                    downVotesResult.css('display', 'none');
                }
            }
        })
        .then(() => t.sizeTo('#votingResults'));
});
