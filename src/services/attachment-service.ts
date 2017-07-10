import thumbsUpImg from '../images/thumbs_up.svg';
import {cleanupPath} from "./asset-service";
import {IAttachment} from "../interfaces/IAttachment";
import {IAttachments} from "../interfaces/IAttachments";

const resultsAttachment: IAttachment = {
    name: "Voting Results",
    url: "/results.html"
};

export function getAttachmentSections(t, options) {
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
}

export function attachResults(t: any): void {
    (t.card('attachments') as Promise<IAttachments>)
        .then((attachments) => {
            const existentAttachment = attachments.attachments
                .find(currentAttachment => currentAttachment.url.includes(resultsAttachment.url));

            if (!existentAttachment) {
                t.attach(resultsAttachment);
            }
        });
}