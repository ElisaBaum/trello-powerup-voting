import {getVotingResults} from "./services/vote-service";
import {iframe} from "trello-powerups";
import {IMember} from "./interfaces/IMember";
import thumbsUpImg from './images/thumbs_up_white.svg';
import thumbsDownImg from './images/thumbs_down_white.svg';
import {cleanupPath} from "./services/asset-service";

const upVotesSelector = $('#upVoters');
const upVotesIconSelector = $('#upVotesIcon');

const downVotesSelector = $('#downVoters');
const downVotesIconSelector = $('#downVotesIcon');

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

t.render(function () {
    getVotingResults(t)
        .then((results) => {
            if (results) {
                upVotesSelector.text(votingResultText(results.voteAnonymously, results.upVoters));
                upVotesIconSelector.css('background-image', votingResultIcon(thumbsUpImg));

                downVotesSelector.text(votingResultText(results.voteAnonymously, results.downVoters));
                downVotesIconSelector.css('background-image', votingResultIcon(thumbsDownImg));
            }
        })
        .then(() => t.sizeTo('#votingResults'));
});
