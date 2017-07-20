import thumbsUpImg from '../images/thumbs_up.svg';
import {cleanupPath} from "./asset-service";
import {IAttachment} from "../interfaces/IAttachment";
import {IAttachments} from "../interfaces/IAttachments";
import {IAttachmentSection} from "../interfaces/IAttachmentSection";
import {getVotesOnCurrentCard} from "./vote-service";

import resultsView from "../views/results.html";

const resultsAttachment: IAttachment = {
    name: "Voting Results",
    url: "http://lmgtfy.com/?q=Voting+results"
};

export function getAttachmentSections(t, options): Promise<IAttachmentSection[]> {
    return getVotesOnCurrentCard(t)
        .then((votes) => {
            if (votes) {
                const claimed = options.entries.filter(attachment => attachment.url.includes(resultsAttachment.url));

                return [{
                    icon: cleanupPath(thumbsUpImg),
                    title: resultsAttachment.name,
                    claimed: claimed,
                    content: {
                        type: 'iframe',
                        url: t.signUrl(cleanupPath(resultsView))
                    }
                }];
            } else {
                return [];
            }
    });
}

export function attachResults(t: any): void {
    Promise.all([
        getVotesOnCurrentCard(t),
        (t.card('attachments') as Promise<IAttachments>)
    ]).then(([votings, attachments]) => {
        if (votings) {
            const existentAttachment = attachments.attachments
                .find(currentAttachment => currentAttachment.url === resultsAttachment.url);

            if (! existentAttachment) {
                t.attach(resultsAttachment);
            }
        }
    });
}