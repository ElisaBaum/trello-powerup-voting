import {getVotingResults} from "./services/vote-service";
import {iframe} from "trello-powerups";
import {IMember} from "./interfaces/IMember";
import thumbsUpImg from './images/thumbs_up_white.svg';
import thumbsDownImg from './images/thumbs_down_white.svg';
import {cleanupPath} from "./services/asset-service";
import {IVotingResultRenderingInformation} from "./interfaces/IVotingResultRenderingInformation";

const t = iframe();

const upVotingRendering: IVotingResultRenderingInformation = {
    voters: [],
    voteAnonymously: true,
    votersCountSelector: $('#upVotersCount'),
    votersSelector: $('#upVoters'),
    votesSelector: $('#upVotes'),
    votingIconSelector: $('#upVotingIcon'),
    votingResultSelector: $('#upVotingResult'),
    votingResultHeaderSelector: $('#upVotingResultHeader'),
    votingTypeIcon: thumbsUpImg
};

const downVotingRendering: IVotingResultRenderingInformation = {
    voters: [],
    voteAnonymously: true,
    votersCountSelector: $('#downVotersCount'),
    votersSelector: $('#downVoters'),
    votesSelector: $('#downVotes'),
    votingIconSelector: $('#downVotingIcon'),
    votingResultSelector: $('#downVotingResult'),
    votingResultHeaderSelector: $('#downVotingResultHeader'),
    votingTypeIcon: thumbsDownImg
};

const votingResultIcon = (image) => 'url("' + cleanupPath(image) + '")';

const toggle = (element: JQuery) => element.slideToggle(0, () => t.sizeTo('#votingResults'));

function voterInformations(voter: IMember) {
    const voterIcon = $('<div />').attr('class', 'tile-icon').append(
        $('<img>', {src: voter.avatar, 'class': 'voter-icon'})
    );

    const voterName = $('<div />').attr('class', 'tile-content').append(
        $('<div />').attr('class', 'tile-title').text(voter.fullName || voter.username || '')
    );

    return $('<div />').attr('class', 'tile tile-centered')
        .append(voterIcon)
        .append(voterName);
}

function renderVoters(result: IVotingResultRenderingInformation) {
    if (! result.voteAnonymously) {
        const votesWithNames = result.voters.filter(voter => (voter.fullName !== undefined || voter.username !== undefined));

        if (votesWithNames.length) {
            result.votesSelector.attr('class', 'expandable');
        }

        votesWithNames.forEach(voter => result.votersSelector.append(voterInformations(voter)));
    }
}

function renderResult(result: IVotingResultRenderingInformation) {
    // clear old voters
    result.votersSelector.empty();

    if (result.voters.length) {
        result.votersCountSelector.text(result.voters.length);
        result.votingIconSelector.css('background-image', votingResultIcon(result.votingTypeIcon));
        result.votingResultSelector.addClass('visible');
        result.votingResultSelector.removeClass('hidden');
        result.votingResultHeaderSelector.addClass('visible');
        result.votingResultHeaderSelector.removeClass('hidden');

        renderVoters(result);
    } else {
        // hide empty up voters in result
        result.votingResultSelector.addClass('hidden');
        result.votingResultSelector.removeClass('visible');
        result.votingResultHeaderSelector.addClass('hidden');
        result.votingResultHeaderSelector.removeClass('visible');
    }
}

upVotingRendering.votesSelector.click(function () {
    toggle(upVotingRendering.votersSelector);
});

downVotingRendering.votesSelector.click(function () {
    toggle(downVotingRendering.votersSelector);
});

t.render(() => {
    getVotingResults(t)
        .then((results) => {
            if (results) {
                upVotingRendering.voters = results.upVoters;
                upVotingRendering.voteAnonymously = results.voteAnonymously;
                renderResult(upVotingRendering);

                downVotingRendering.voters = results.downVoters;
                downVotingRendering.voteAnonymously = results.voteAnonymously;
                renderResult(downVotingRendering);
            }
        })
        .then(() => t.sizeTo('#votingResults'));
});
