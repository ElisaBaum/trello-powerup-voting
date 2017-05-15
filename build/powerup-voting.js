(function(FuseBox){FuseBox.$fuse$=FuseBox;
FuseBox.pkg("default", {}, function(___scope___){
___scope___.file("powerup-voting.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bagde_service_1 = require("./services/bagde-service");
var button_service_1 = require("./services/button-service");
var trello_powerups_1 = require("trello-powerups");
trello_powerups_1.initialize({
    'card-buttons': function (t, options) {
        return button_service_1.getCardButtons(t);
    },
    'card-badges': function (t, options) {
        return bagde_service_1.getBadges(t);
    },
    'card-detail-badges': function (t, options) {
        return bagde_service_1.getBadges(t);
    }
});
//# sourceMappingURL=powerup-voting.js.map
});
___scope___.file("services/bagde-service.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var VotingType_1 = require("../enums/VotingType");
var vote_service_1 = require("./vote-service");
var thumbs_up_white_svg_1 = require("../images/thumbs_up_white.svg");
var thumbs_down_white_svg_1 = require("../images/thumbs_down_white.svg");
var asset_service_1 = require("./asset-service");
function createBadge(votes, votingType) {
    var numberOfVotes = votes.filter(vote_service_1.votingTypeFilter(votingType)).length;
    if (numberOfVotes) {
        var badgeIcon = votingType == VotingType_1.VotingType.up ? asset_service_1.cleanupPath(thumbs_up_white_svg_1.default) : asset_service_1.cleanupPath(thumbs_down_white_svg_1.default);
        var badgeColor = votingType == VotingType_1.VotingType.up ? 'green' : 'red';
        var badgeTitle = votingType == VotingType_1.VotingType.up ? 'Ups' : 'Downs';
        return {
            title: badgeTitle,
            text: numberOfVotes,
            icon: badgeIcon,
            color: badgeColor
        };
    }
}
function getBadges(t) {
    return Promise
        .all([
        t.get('card', 'shared', 'votings', []),
        t.card('id').get('id'),
    ])
        .then(function (_a) {
        var votings = _a[0], currentCardId = _a[1];
        var existingVotingsOnCard = votings.find(vote_service_1.votingsOnCardFilter(currentCardId));
        if (existingVotingsOnCard) {
            var upBadge = createBadge(existingVotingsOnCard.votes, VotingType_1.VotingType.up);
            var downBadge = createBadge(existingVotingsOnCard.votes, VotingType_1.VotingType.down);
            return [upBadge, downBadge].filter(function (badge) { return !!badge; });
        }
        else {
            return [];
        }
    });
}
exports.getBadges = getBadges;
//# sourceMappingURL=bagde-service.js.map
});
___scope___.file("enums/VotingType.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var VotingType;
(function (VotingType) {
    VotingType[VotingType["up"] = 0] = "up";
    VotingType[VotingType["down"] = 1] = "down";
})(VotingType = exports.VotingType || (exports.VotingType = {}));
//# sourceMappingURL=VotingType.js.map
});
___scope___.file("services/vote-service.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.votesForMemberFilter = function (currentMemberId) { return function (vote) { return vote.memberId === currentMemberId; }; };
exports.votingsOnCardFilter = function (currentCardId) { return function (votings) { return votings.cardId === currentCardId; }; };
exports.votingTypeFilter = function (currentVotingType) { return function (vote) { return vote.votingType === currentVotingType; }; };
function getVoteForCurrentCardAndMember(t) {
    return Promise
        .all([
        t.get('card', 'shared', 'votings', []),
        t.card('id').get('id'),
        t.member('id').get('id')
    ])
        .then(function (_a) {
        var votings = _a[0], currentCardId = _a[1], currentMemberId = _a[2];
        var existingVotingsOnCard = votings.find(exports.votingsOnCardFilter(currentCardId));
        if (existingVotingsOnCard) {
            return existingVotingsOnCard.votes.find(exports.votesForMemberFilter(currentMemberId));
        }
    });
}
exports.getVoteForCurrentCardAndMember = getVoteForCurrentCardAndMember;
function vote(t, currentVotingType) {
    return Promise
        .all([
        t.get('card', 'shared', 'votings', []),
        t.card('id').get('id'),
        t.member('id').get('id')
    ])
        .then(function (_a) {
        var votings = _a[0], currentCardId = _a[1], currentMemberId = _a[2];
        var existingVotingsOnCard = votings.find(exports.votingsOnCardFilter(currentCardId));
        if (existingVotingsOnCard) {
            var existingVoteForMember = existingVotingsOnCard.votes.find(exports.votesForMemberFilter(currentMemberId));
            if (existingVoteForMember) {
                existingVoteForMember.votingType = currentVotingType;
            }
            else {
                existingVotingsOnCard.votes.push({
                    memberId: currentMemberId,
                    votingType: currentVotingType
                });
            }
        }
        else {
            votings.push({
                cardId: currentCardId,
                votes: [{
                        memberId: currentMemberId,
                        votingType: currentVotingType
                    }]
            });
        }
        t.set('card', 'shared', 'votings', votings);
    });
}
exports.vote = vote;
//# sourceMappingURL=vote-service.js.map
});
___scope___.file("images/thumbs_up_white.svg", function(exports, require, module, __filename, __dirname){

module.exports.default = "/assets/d489edc5-thumbs_up_white.svg";
});
___scope___.file("images/thumbs_down_white.svg", function(exports, require, module, __filename, __dirname){

module.exports.default = "/assets/3f3e1272-thumbs_down_white.svg";
});
___scope___.file("services/asset-service.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function cleanupPath(path) {
    return '.' + path;
}
exports.cleanupPath = cleanupPath;
//# sourceMappingURL=asset-service.js.map
});
___scope___.file("services/button-service.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vote_service_1 = require("./vote-service");
var VotingType_1 = require("../enums/VotingType");
var thumbs_up_svg_1 = require("../images/thumbs_up.svg");
var thumbs_down_svg_1 = require("../images/thumbs_down.svg");
var asset_service_1 = require("./asset-service");
var voteUpButton = {
    icon: asset_service_1.cleanupPath(thumbs_up_svg_1.default),
    text: 'Vote up',
    callback: function (t) {
        return vote_service_1.vote(t, VotingType_1.VotingType.up).then(t.closePopup());
    }
};
var voteDownButton = {
    icon: asset_service_1.cleanupPath(thumbs_down_svg_1.default),
    text: 'Vote down',
    callback: function (t) {
        return vote_service_1.vote(t, VotingType_1.VotingType.down).then(t.closePopup());
    }
};
function getCardButtons(t) {
    return vote_service_1.getVoteForCurrentCardAndMember(t)
        .then(function (vote) {
        var buttons = [];
        if (vote) {
            switch (vote.votingType) {
                case VotingType_1.VotingType.up: {
                    buttons.push(voteDownButton);
                    break;
                }
                case VotingType_1.VotingType.down: {
                    buttons.push(voteUpButton);
                    break;
                }
            }
        }
        else {
            buttons.push(voteUpButton);
            buttons.push(voteDownButton);
        }
        return buttons;
    });
}
exports.getCardButtons = getCardButtons;
//# sourceMappingURL=button-service.js.map
});
___scope___.file("images/thumbs_up.svg", function(exports, require, module, __filename, __dirname){

module.exports.default = "/assets/1ff84e9d-thumbs_up.svg";
});
___scope___.file("images/thumbs_down.svg", function(exports, require, module, __filename, __dirname){

module.exports.default = "/assets/927da82a-thumbs_down.svg";
});
});
FuseBox.pkg("trello-powerups", {}, function(___scope___){
___scope___.file("index.js", function(exports, require, module, __filename, __dirname){

module.exports = TrelloPowerUp
});
return ___scope___.entry = "index.js";
});

FuseBox.import("default/powerup-voting.js");
FuseBox.main("default/powerup-voting.js");
})
(function(e){function r(e){var r=e.charCodeAt(0),n=e.charCodeAt(1);if((d||58!==n)&&(r>=97&&r<=122||64===r)){if(64===r){var t=e.split("/"),i=t.splice(2,t.length).join("/");return[t[0]+"/"+t[1],i||void 0]}var o=e.indexOf("/");if(o===-1)return[e];var a=e.substring(0,o),u=e.substring(o+1);return[a,u]}}function n(e){return e.substring(0,e.lastIndexOf("/"))||"./"}function t(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];for(var n=[],t=0,i=arguments.length;t<i;t++)n=n.concat(arguments[t].split("/"));for(var o=[],t=0,i=n.length;t<i;t++){var a=n[t];a&&"."!==a&&(".."===a?o.pop():o.push(a))}return""===n[0]&&o.unshift(""),o.join("/")||(o.length?"/":".")}function i(e){var r=e.match(/\.(\w{1,})$/);return r&&r[1]?e:e+".js"}function o(e){if(d){var r,n=document,t=n.getElementsByTagName("head")[0];/\.css$/.test(e)?(r=n.createElement("link"),r.rel="stylesheet",r.type="text/css",r.href=e):(r=n.createElement("script"),r.type="text/javascript",r.src=e,r.async=!0),t.insertBefore(r,t.firstChild)}}function a(e,r){for(var n in e)e.hasOwnProperty(n)&&r(n,e[n])}function u(e){return{server:require(e)}}function f(e,n){var o=n.path||"./",a=n.pkg||"default",f=r(e);if(f&&(o="./",a=f[0],n.v&&n.v[a]&&(a=a+"@"+n.v[a]),e=f[1]),e)if(126===e.charCodeAt(0))e=e.slice(2,e.length),o="./";else if(!d&&(47===e.charCodeAt(0)||58===e.charCodeAt(1)))return u(e);var s=h[a];if(!s){if(d&&"electron"!==m.target)throw"Package not found "+a;return u(a+(e?"/"+e:""))}e=e?e:"./"+s.s.entry;var l,c=t(o,e),p=i(c),v=s.f[p];return!v&&p.indexOf("*")>-1&&(l=p),v||l||(p=t(c,"/","index.js"),v=s.f[p],v||(p=c+".js",v=s.f[p]),v||(v=s.f[c+".jsx"]),v||(p=c+"/index.jsx",v=s.f[p])),{file:v,wildcard:l,pkgName:a,versions:s.v,filePath:c,validPath:p}}function s(e,r){if(!d)return r(/\.(js|json)$/.test(e)?p.require(e):"");var n=new XMLHttpRequest;n.onreadystatechange=function(){if(4==n.readyState)if(200==n.status){var i=n.getResponseHeader("Content-Type"),o=n.responseText;/json/.test(i)?o="module.exports = "+o:/javascript/.test(i)||(o="module.exports = "+JSON.stringify(o));var a=t("./",e);m.dynamic(a,o),r(m.import(e,{}))}else console.error(e,"not found on request"),r(void 0)},n.open("GET",e,!0),n.send()}function l(e,r){var n=g[e];if(n)for(var t in n){var i=n[t].apply(null,r);if(i===!1)return!1}}function c(e,r){if(void 0===r&&(r={}),58===e.charCodeAt(4)||58===e.charCodeAt(5))return o(e);var t=f(e,r);if(t.server)return t.server;var i=t.file;if(t.wildcard){var a=new RegExp(t.wildcard.replace(/\*/g,"@").replace(/[.?*+^$[\]\\(){}|-]/g,"\\$&").replace(/@@/g,".*").replace(/@/g,"[a-z0-9$_-]+"),"i"),u=h[t.pkgName];if(u){var v={};for(var g in u.f)a.test(g)&&(v[g]=c(t.pkgName+"/"+g));return v}}if(!i){var m="function"==typeof r,x=l("async",[e,r]);if(x===!1)return;return s(e,function(e){return m?r(e):null})}var _=t.pkgName;if(i.locals&&i.locals.module)return i.locals.module.exports;var w=i.locals={},y=n(t.validPath);w.exports={},w.module={exports:w.exports},w.require=function(e,r){return c(e,{pkg:_,path:y,v:t.versions})},w.require.main={filename:d?"./":p.require.main.filename,paths:d?[]:p.require.main.paths};var b=[w.module.exports,w.require,w.module,t.validPath,y,_];return l("before-import",b),i.fn.apply(0,b),l("after-import",b),w.module.exports}if(e.FuseBox)return e.FuseBox;var d="undefined"!=typeof window&&window.navigator,p=d?window:global;d&&(p.global=window),e=d&&"undefined"==typeof __fbx__dnm__?e:module.exports;var v=d?window.__fsbx__=window.__fsbx__||{}:p.$fsbx=p.$fsbx||{};d||(p.require=require);var h=v.p=v.p||{},g=v.e=v.e||{},m=function(){function r(){}return r.global=function(e,r){return void 0===r?p[e]:void(p[e]=r)},r.import=function(e,r){return c(e,r)},r.on=function(e,r){g[e]=g[e]||[],g[e].push(r)},r.exists=function(e){try{var r=f(e,{});return void 0!==r.file}catch(e){return!1}},r.remove=function(e){var r=f(e,{}),n=h[r.pkgName];n&&n.f[r.validPath]&&delete n.f[r.validPath]},r.main=function(e){return this.mainFile=e,r.import(e,{})},r.expose=function(r){var n=function(n){var t=r[n].alias,i=c(r[n].pkg);"*"===t?a(i,function(r,n){return e[r]=n}):"object"==typeof t?a(t,function(r,n){return e[n]=i[r]}):e[t]=i};for(var t in r)n(t)},r.dynamic=function(r,n,t){this.pkg(t&&t.pkg||"default",{},function(t){t.file(r,function(r,t,i,o,a){var u=new Function("__fbx__dnm__","exports","require","module","__filename","__dirname","__root__",n);u(!0,r,t,i,o,a,e)})})},r.flush=function(e){var r=h.default;for(var n in r.f)e&&!e(n)||delete r.f[n].locals},r.pkg=function(e,r,n){if(h[e])return n(h[e].s);var t=h[e]={};return t.f={},t.v=r,t.s={file:function(e,r){return t.f[e]={fn:r}}},n(t.s)},r.addPlugin=function(e){this.plugins.push(e)},r}();return m.packages=h,m.isBrowser=d,m.isServer=!d,m.plugins=[],d||(p.FuseBox=m),e.FuseBox=m}(this))
//# sourceMappingURL=powerup-voting.js.map