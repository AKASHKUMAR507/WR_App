import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, DeviceEventEmitter, ActivityIndicator, TouchableOpacity, StyleSheet, LogBox, Platform } from 'react-native';
import FileViewer from "react-native-file-viewer";
import { DownloadFile } from '../../network/models/files';
import Chronos from '../../utilities/chronos';
import colors from '../../styles/colors';
import fontSizes from '../../styles/fonts';
import Aphrodite from '../../utilities/aphrodite';
import { SendMessage } from '../../network/models/chat';
import useCurrentDeal from '../../hooks/currentdeal';
import shadows from '../../styles/shadows';
import { Alert, AlertBoxContext } from '../alertbox';

const messageType = {
    Text: 'Text',
    Image: 'Image',
    File: 'File',
    Date: 'Date',
}

const senderType = {
    Self: 'Self',
    Other: 'Other',
}

const ChatBubbleDownloadStatus = {
    Downloading: 'Downloading',
    Downloaded: 'Downloaded',
    Failed: 'Failed',
}

const ProvisionalChatStatuses = {
    Sending: 'Sending',
    Failed: 'Failed',
}

function ChatBubbleText({ sender, message }) {
    const bubbleTextStyle = [styles.bubbleText, sender === senderType.Other && styles.bubbleTextOther]

    return (
        <Text style={bubbleTextStyle}>{message.text}</Text>
    )
}

function ViewFile(path) {
    FileViewer
    .open(path, { showOpenWithDialog: true })
    .catch((error) => { throw error });
}

function ChatBubbleImage({ sender, message }) {
    LogBox.ignoreLogs(['Image source']);

    const bubbleImageStyle = [styles.bubbleImage, sender === senderType.Other && styles.bubbleImageOther]
    
    const [downloadStatus, setDownloadStatus] = useState(ChatBubbleDownloadStatus.Downloading);
    const [imageData, setImageData] = useState();

    const createAlert = useContext(AlertBoxContext);

    useEffect(() => {
        fetchImage();
    }, []);

    const fetchImage = async () => {
        if (message.provisional) {
            setDownloadStatus(ChatBubbleDownloadStatus.Downloaded);
            setImageData({ path: message.filePath });
            return;
        }

        setDownloadStatus(ChatBubbleDownloadStatus.Downloading);

        try {
            const imageResponse = await DownloadFile(message.fileid, message.fileName);
            setImageData(imageResponse);
            setDownloadStatus(ChatBubbleDownloadStatus.Downloaded);
        }
        catch (error) {
            createAlert(Alert.Error(error.message));
            setDownloadStatus(ChatBubbleDownloadStatus.Failed);
        }
    }

    const viewImage = () => {
        try {
            ViewFile(imageData.path);
        }
        catch (error) {
            createAlert(Alert.Error(error.message));
        }
    }

    const handleImagePress = () => {
        if (downloadStatus === ChatBubbleDownloadStatus.Downloaded) viewImage();
        else if (downloadStatus === ChatBubbleDownloadStatus.Failed) fetchImage();
    }

    return (
        <TouchableOpacity activeOpacity={0.8} onPress={handleImagePress}>
            {
                downloadStatus === ChatBubbleDownloadStatus.Downloaded ? 
                <Image style={bubbleImageStyle} source={{ uri: imageData.path }}/> :
                downloadStatus === ChatBubbleDownloadStatus.Downloading ?
                <View style={bubbleImageStyle}>
                    <ActivityIndicator color={colors.DarkGray}/>
                </View> :
                <View style={bubbleImageStyle}>
                    <Text style={{ ...fontSizes.heading_xxlarge }}>🚫</Text>
                    <View style={{ height: 4 }}/>
                    <Text style={{ ...fontSizes.heading_xsmall, color: colors.Error }}>Download failed</Text>
                    <Text style={{ ...fontSizes.heading_xsmall, color: colors.Error }}>Tap to retry</Text>
                </View>
            }
        </TouchableOpacity>
    )
}

function ChatBubbleFile({ sender, message }) {
    const bubbleFileStyle = [styles.bubbleFile, sender === senderType.Other && styles.bubbleFileOther]
    const bubbleFileTextStyle = [styles.bubbleFileText, sender === senderType.Other && styles.bubbleFileTextOther]
    const bubbleFileSubtextStyle = [styles.bubbleFileText, styles.bubbleFileSubtext, sender === senderType.Other && styles.bubbleFileTextOther]

    const [downloadStatus, setDownloadStatus] = useState(ChatBubbleDownloadStatus.Downloading);
    const [documentData, setDocumentData] = useState();

    const createAlert = useContext(AlertBoxContext);

    useEffect(() => {
        fetchDocument();
    }, []);

    const fetchDocument = async () => {
        if (message.provisional) {
            setDownloadStatus(ChatBubbleDownloadStatus.Downloaded);
            setDocumentData({ path: message.filePath, size: message.fileSize });
            return;
        }

        setDownloadStatus(ChatBubbleDownloadStatus.Downloading);

        try {
            const documentResponse = await DownloadFile(message.fileid, message.fileName);
            setDocumentData(documentResponse);
            setDownloadStatus(ChatBubbleDownloadStatus.Downloaded);
        }
        catch (error) {
            createAlert(Alert.Error(error.message));
            setDownloadStatus(ChatBubbleDownloadStatus.Failed);
        }
    }

    const viewDocument = () => {
        try {
            ViewFile(documentData.path);
        }
        catch (error) {
            createAlert(Alert.Error(error.message));
        }
    }

    const handleDocumentPress = () => {
        if (downloadStatus === ChatBubbleDownloadStatus.Downloaded) viewDocument();
        else if (downloadStatus === ChatBubbleDownloadStatus.Failed) fetchDocument();
    }

    return (
        <TouchableOpacity style={bubbleFileStyle} activeOpacity={0.8} onPress={handleDocumentPress}>
            <Text style={bubbleFileTextStyle}>{message.fileName}</Text>
            {
                message.provisional ?
                <Text style={bubbleFileSubtextStyle}>{Aphrodite.FormatSize(message.fileSize)} • Uploading document</Text> :
                downloadStatus === ChatBubbleDownloadStatus.Downloaded ?
                <Text style={bubbleFileSubtextStyle}>{Aphrodite.FormatSize(documentData.size)} • Tap to view document</Text> :
                downloadStatus === ChatBubbleDownloadStatus.Downloading ?
                <Text style={bubbleFileSubtextStyle}>Downloading Document</Text> :
                <Text style={[bubbleFileSubtextStyle, { color: colors.Error }]}>Download failed • Tap to retry</Text>
            }
        </TouchableOpacity>
    )
}

function ChatBubbleContent({ type, sender, message }) {
    switch(type) {
        case messageType.Text:
            return <ChatBubbleText sender={sender} message={message}/>
        case messageType.Image:
            return <ChatBubbleImage sender={sender} message={message}/>
        case messageType.File:
            return <ChatBubbleFile sender={sender} message={message}/>
    }
}

function ChatBubble({ type = messageType.Text, sender = senderType.Self, message }) {
    const bubbleStyle = [styles.bubble, sender === senderType.Other && styles.bubbleOther]
    const bubbleTimingStyle = [styles.bubbleTiming, sender === senderType.Other && styles.bubbleTimingOther]

    const chronos = new Chronos();

    return (
        <View style={bubbleStyle}>
            <ChatBubbleContent type={type} sender={sender} message={message}/>
            <Text style={bubbleTimingStyle}>{chronos.FormattedTimeFromTimestamp(message.timestamp)}</Text>
        </View>
    )
}

function ProvisionChatBubble({ type = messageType.Text, message, onSuccess, chatId }) {
    const [status, setStatus] = useState(ProvisionalChatStatuses.Sending);

    const [currentDeal] = useCurrentDeal();

    const createAlert = useContext(AlertBoxContext);

    useEffect(() => {
        sendProvisionalMessage();
    }, []);

    const sendProvisionalMessage = async () => {
        setStatus(ProvisionalChatStatuses.Sending);

        try {
            const sendMessageObject = {
                dealid: currentDeal.id,
                receiverid: currentDeal.dealmanager.id,
                roletype: currentDeal.dealType,
                chatid: chatId,
                message: '',
                attachments: [],
            }

            if (type === messageType.Text) sendMessageObject.message = message.text;
            else {
                const attachment = { 
                    name: message.fileName, 
                    type: message.fileType, 
                    uri: message.filePath, 
                    size: message.fileSize, 
                    fileCopyUri: message.fileCopyURI 
                };

                sendMessageObject.attachments.push(attachment);
            }
            
            await SendMessage(sendMessageObject);
            onSuccess();
        }
        catch (error) {
            setStatus(ProvisionalChatStatuses.Failed);
            createAlert(Alert.Error(error.message));
        }
    }

    const handleRetry = () => {
        if (status === ProvisionalChatStatuses.Failed) sendProvisionalMessage();
    }

    return (
        <TouchableOpacity activeOpacity={0.8} onPress={handleRetry}>
            <View style={styles.bubble}>
                <ChatBubbleContent type={type} sender={senderType.Self} message={message}/>
            </View>
            {
                status === ProvisionalChatStatuses.Sending ?
                <Text style={styles.bubbleInfo}>Sending</Text> :
                <Text style={[styles.bubbleInfo, { color: colors.Error }]}>Failed • Tap to Retry</Text>
            }
        </TouchableOpacity>
    )
}

function DateBubble({ date }) {
    const chronos = new Chronos();

    return (
        <View style={styles.dateBubble}>
            <Text style={styles.dateBubbleText}>{chronos.NamedDayOrDateFromTimestamp(date)}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    bubble: {
        backgroundColor: colors.Primary,

        paddingHorizontal: 12,
        paddingVertical: 8,

        marginHorizontal: 16,
        marginBottom: 16,

        borderRadius: 12,
        borderBottomRightRadius: 0,

        maxWidth: '80%',
        alignSelf: 'flex-end',
    },

    bubbleOther: {
        backgroundColor: colors.White,
        borderBottomRightRadius: 12,
        borderBottomLeftRadius: 0,

        alignSelf: 'flex-start',
    },

    bubbleText: {
        ...fontSizes.body,
        color: colors.White,
        alignSelf: 'flex-end',
    },

    bubbleTextOther: {
        color: colors.Black,
        alignSelf: 'flex-start',
    },

    bubbleImage: {
        width: 240,
        height: 160,

        borderColor: colors.LightGray20,
        borderWidth: 4,
        borderRadius: 8,

        marginVertical: 4,

        justifyContent: 'center',
        alignItems: 'center',
    },

    bubbleImageOther: {
        borderColor: colors.LightGray80,
    },

    bubbleFile: {
        backgroundColor: colors.LightGray20,

        paddingVertical: 8,
        paddingHorizontal: 12,

        borderRadius: 8,

        marginVertical: 4,
    },

    bubbleFileOther: {
        backgroundColor: colors.LightGray80,
    },

    bubbleFileText: {
        ...fontSizes.button_small,
        color: colors.White,
    },

    bubbleFileTextOther: {
        color: colors.Black,
    },

    bubbleFileSubtext: {
        ...fontSizes.body_xsmall,
        marginTop: 4,
    },

    bubbleTiming: {
        ...fontSizes.body_xsmall,
        color: colors.PrimaryLight,

        alignSelf: 'flex-end',

        marginTop: 4,
    },

    bubbleTimingOther: {
        color: colors.DarkGray,

        alignSelf: 'flex-start',
    },

    bubbleInfo: {
        ...fontSizes.heading_xsmall,
        color: colors.Primary,

        marginHorizontal: 16,
        marginTop: -8,
        marginBottom: 16,

        alignSelf: 'flex-end',
    },

    dateBubble: {
        alignSelf: 'center',

        backgroundColor: colors.LightGray,
        borderRadius: 24,

        paddingHorizontal: 24,
        paddingVertical: 4,

        marginVertical: 12,

        ...shadows.shadowExtraLight,
    },

    dateBubbleText: {
        ...fontSizes.body_xsmall,
        color: colors.Black80,
    },
});

export default ChatBubble;
export { messageType, senderType, ProvisionChatBubble, DateBubble };