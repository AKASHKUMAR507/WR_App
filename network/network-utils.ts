interface AttachmentsInterface { name: string, type: string, uri: string, size: string, fileCopyUri: string }

function AppendFilesToFormData(formData: FormData, attachments: AttachmentsInterface[], key: string = 'file') {
    attachments.forEach((attachment) => {
        formData.append(key, {
            name: attachment.name,
            type: attachment.type,
            uri: attachment.uri
        });
    });
}

function FormatDate(date: Date) {
    return date.toISOString().split('T')[0];
}

export type { AttachmentsInterface };
export { AppendFilesToFormData, FormatDate };