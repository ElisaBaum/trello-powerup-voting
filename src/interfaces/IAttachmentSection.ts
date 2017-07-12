import {IAttachment} from "./IAttachment";

export interface IAttachmentSection {
  icon: string;
  title: string;
  claimed: IAttachment[];
  content: IAttachmentSectionContent;
}

export interface IAttachmentSectionContent {
  type: string;
  url: string;
}