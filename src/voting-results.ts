import {getVotingResults} from "./services/vote-service";
import {iframe} from "trello-powerups";
import {IMember} from "./interfaces/IMember";
import thumbsUpImg from './images/thumbs_up_white.svg';
import thumbsDownImg from './images/thumbs_down_white.svg';
import {cleanupPath} from "./services/asset-service";
import {IVotingResultRenderingInformation} from "./interfaces/IVotingResultRenderingInformation";

import "spectre.css/dist/spectre.min.css";
import "./styles/voting-results.css";

const t = iframe();

const upVotingRendering: IVotingResultRenderingInformation = {
    voters: [],
    voteAnonymously: true,
    votingResultsSelector: $('#upVotingResults'),
    votingTypeIcon: thumbsUpImg
};

const downVotingRendering: IVotingResultRenderingInformation = {
    voters: [],
    voteAnonymously: true,
    votingResultsSelector: $('#downVotingResults'),
    votingTypeIcon: thumbsDownImg
};

const votingResultIcon = (image) => 'url("' + cleanupPath(image) + '")';

const resize = () => t.sizeTo('#votingResults');

const toggle = (element: JQuery) => element.slideToggle(0, resize);

const showVotersElement = (renderingInfo: IVotingResultRenderingInformation) =>
    renderingInfo.votingResultsSelector.find('.show-voters');

const hideVotersElement = (renderingInfo: IVotingResultRenderingInformation) =>
    renderingInfo.votingResultsSelector.find('.hide-voters');

const votersElement = (renderingInfo: IVotingResultRenderingInformation) =>
    renderingInfo.votingResultsSelector.find('.voters');

function voterInitials(voter: IMember) {
    const initials = (name: string) =>
        name.split(' ').map((element) => element.charAt(0).toUpperCase()).slice(0, 3).join('');

    if (voter.fullName) {
        return initials(voter.fullName)
    }
    if (voter.username) {
        return initials(voter.username)
    }
    return 'U';
}

function voterInformations(voter: IMember) {
    let voterIcon;

    if (voter.avatar) {
        voterIcon = $('<div />').attr('class', 'tile-icon').append(
            $('<img>', {src: voter.avatar, 'class': 'voter-icon'})
        );
    } else {
        voterIcon = $('<div />').attr('class', 'voter-without-icon tile-icon').text(voterInitials(voter))
    }

    const voterName = $('<div />').attr('class', 'tile-content').append(
        $('<div />').attr('class', 'tile-title').text(voter.fullName || voter.username || '')
    );

    return $('<div />').attr('class', 'voter tile tile-centered')
        .append(voterIcon)
        .append(voterName);
}

function renderVoters(result: IVotingResultRenderingInformation) {
    if (! result.voteAnonymously) {
        const votesWithNames = result.voters.filter(voter => (voter.fullName !== undefined || voter.username !== undefined));

        // todo: remove me later; just to create some more votes
        let duplicated = votesWithNames.map(function(item) {
            return [item, item, item];
        }).reduce(function(a, b) { return a.concat(b) });

        const voters = votersElement(result);

        duplicated.forEach(voter => voters.append(voterInformations(voter)));

        if (votesWithNames.length > 0 && hideVotersElement(result).hasClass('hidden')) {
            showVotersElement(result).removeClass('hidden');
        }
    }
}

function renderResult(result: IVotingResultRenderingInformation) {
    // clear old voters
    votersElement(result).empty();

    if (result.voters.length) {
        result.votingResultsSelector.find('.voters-count').text(result.voters.length);
        result.votingResultsSelector.find('.voting-result-icon').css('background-image', votingResultIcon(result.votingTypeIcon));
        result.votingResultsSelector.removeClass('hidden');

        renderVoters(result);
    } else {
        // hide empty up voters in result
        result.votingResultsSelector.addClass('hidden');
    }
}

function showVoters(renderingInfo: IVotingResultRenderingInformation) {
    showVotersElement(renderingInfo).addClass('hidden');
    hideVotersElement(renderingInfo).removeClass('hidden');
    toggle(votersElement(renderingInfo));
}

function hideVoters(renderingInfo: IVotingResultRenderingInformation) {
    hideVotersElement(renderingInfo).addClass('hidden');
    showVotersElement(renderingInfo).removeClass('hidden');
    toggle(votersElement(renderingInfo));
}

function registerClickListeners() {
    hideVotersElement(upVotingRendering).click(() => hideVoters(upVotingRendering));
    showVotersElement(upVotingRendering).click(() => showVoters(upVotingRendering));
    hideVotersElement(downVotingRendering).click(() => hideVoters(downVotingRendering));
    showVotersElement(downVotingRendering).click(() => showVoters(downVotingRendering));
}

function renderVotingResults(t) {
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
        .then(resize);
}

registerClickListeners();

t.render(() => {
    renderVotingResults(t);
    console.log('results');
});
