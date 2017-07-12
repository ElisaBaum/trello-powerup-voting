import thumbsUpImg from '../images/thumbs_up.svg';
import {cleanupPath} from "./asset-service";
import {IAttachment} from "../interfaces/IAttachment";
import {IAttachments} from "../interfaces/IAttachments";
import {IAttachmentSection} from "../interfaces/IAttachmentSection";
import {getVotesOnCurrentCard} from "./vote-service";

const resultsAttachment: IAttachment = {
    name: "Voting Results",
    // todo bessere url?
    url: "/results.html"
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
                        url: t.signUrl("./results.html")
                    }
                }];
            } else {
                return [];
            }

    });
}

export function attachResults(t: any): void {
    (t.card('attachments') as Promise<IAttachments>)
        .then((attachments) => {

            // todo include ist nicht so gut
            const existentAttachment = attachments.attachments
                .find(currentAttachment => currentAttachment.url.includes(resultsAttachment.url));

            if (! existentAttachment) {
                t.attach(resultsAttachment);
            }
        });
}