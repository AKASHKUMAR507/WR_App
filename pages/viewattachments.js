import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, DeviceEventEmitter, FileReader, TouchableOpacity, Image, Dimensions, LayoutAnimation, Animated } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { DownloadFile } from '../network/models/files';
import FileViewer from "react-native-file-viewer";
import Aphrodite from '../utilities/aphrodite';
import fontSizes from '../styles/fonts';
import colors from '../styles/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Alert, AlertBoxContext } from '../components/alertbox';

const GenericDocumentImage = require('../assets/images/GenericDocument.png');

function AttachmentDownloadingIcon() {
    const rotationAnimation = new Animated.Value(0);

    const springConfig = {
        stiffness: 200,
        damping: 10,
        mass: 0.5,
        useNativeDriver: true,
    }

    const flip = Animated.spring(rotationAnimation, { toValue: 1, ...springConfig });
    const flipAround = Animated.spring(rotationAnimation, { toValue: 0, ...springConfig });

    Animated.loop(Animated.sequence([flip, flipAround])).start();
    const spin = rotationAnimation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

    return (
        <Animated.Text style={[styles.attachmentIconText, { transform: [{ rotateZ: spin }] }]}>⏳</Animated.Text>
    )
}

/* TODO: Request Uniform Naming Schemes Across Attachments */
function GetNameFromAttachmentObject(attachment) {
    if (attachment.fileName) return attachment.fileName;
    if (attachment.attachmentfilename) return attachment.attachmentfilename;
    if (attachment.attachmentFileName) return attachment.attachmentFileName;
}

function NormaliseAttachments(attachments) {
    if (!attachments) return [];

    const normalisedAttachments = [];

    for (const attachment of attachments) {
        const normalisedAttachment = {
            fileName: GetNameFromAttachmentObject(attachment),
            fileId: attachment.attachmentfileid,
            module: attachment.module
        }

        normalisedAttachments.push(normalisedAttachment);
    }

    return normalisedAttachments;
}

const AttachmentDownloadStates = {
    Downloading: 'Downloading',
    Downloaded: 'Downloaded',
    Error: 'Error',
}

function Attachment({ attachment }) {
    const [attachmentState, setAttachmentState] = useState(AttachmentDownloadStates.Downloading);

    const [filePath, setFilePath] = useState();
    const [fileSize, setFileSize] = useState();

    const createAlert = useContext(AlertBoxContext);

    useEffect(() => {
        downloadAttachment();
    }, []);

    const downloadAttachment = async () => {
        try {
            const { path, size } = await DownloadFile(attachment.fileId, attachment.fileName, attachment.module);
            
            setFilePath(path);
            setFileSize(size);

            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setAttachmentState(AttachmentDownloadStates.Downloaded);
        }
        catch(error) {
            createAlert(Alert.Error(error.message));

            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setAttachmentState(AttachmentDownloadStates.Error);
        }
    }

    const handlePress = () => {
        if (attachmentState === AttachmentDownloadStates.Downloading) return;
        if (attachmentState === AttachmentDownloadStates.Error) { downloadAttachment(); return }

        FileViewer.open(filePath, { showOpenWithDialog: true })
        .catch((error) => createAlert(Alert.Error(error.message)));
    }

    const iconText = () => {
        if (attachmentState === AttachmentDownloadStates.Error) return '🚫';

        const split = attachment.fileName.split('.');
        const extension = split[split.length - 1];

        return extension;
    }

    const renderAttachmentIcon = () => {
        if (attachmentState === AttachmentDownloadStates.Downloading) return <AttachmentDownloadingIcon/>;

        const icon = iconText();
        return <Text style={styles.attachmentIconText}>{icon}</Text>
    }

    return (
        <TouchableOpacity testID={`attachment:${attachment.fileName}`} activeOpacity={0.8} onPress={handlePress} style={styles.attachment}>
            <View style={styles.attachmentIcon}>
                <Image source={GenericDocumentImage} style={styles.attachmentIconImage}/>
                {renderAttachmentIcon()}
            </View>
            <View style={styles.attachmentInfo}>
                <Text numberOfLines={2} style={styles.attachmentName}>{attachment.fileName}</Text>
                { 
                    attachmentState === AttachmentDownloadStates.Downloaded && 
                    <Text style={styles.attachmentSize}>{Aphrodite.FormatSize(fileSize)}</Text> 
                }
                {
                    attachmentState === AttachmentDownloadStates.Error && 
                    <Text style={styles.attachmentError}>Download Failed • Tap To Retry</Text>
                }
                {
                    attachmentState === AttachmentDownloadStates.Downloading && 
                    <Text style={styles.attachmentDownloading}>Downloading</Text> 
                }
            </View>
        </TouchableOpacity>
    )
}

function ViewAttachmentsPage(props) {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const normalisedAttachments = NormaliseAttachments(props?.route?.params?.attachments);
    
    useLayoutEffect(() => {
        const pageTitle = props?.route?.params?.pageTitle || 'View Attachments';
        navigation.setOptions({ title: pageTitle })
    });

    return (
        <ScrollView contentContainerStyle={[styles.page, { paddingBottom: insets.bottom }]} showsVerticalScrollIndicator={false}>
            { normalisedAttachments.map((attachment) => <Attachment key={attachment.fileId} attachment={attachment}/>) }
        </ScrollView>   
    )
}

const styles = StyleSheet.create({
    page: {
        paddingVertical: 24,

        flexDirection: 'row',
        flexWrap: 'wrap',
    },

    attachment: {
        marginVertical: 16,
        width: Dimensions.get('window').width / 3,

        alignItems: 'center',

        paddingHorizontal: 16,
    },

    attachmentIcon: {
    },

    attachmentIconImage: {
        width: 96,
        height: 96
    },

    attachmentIconText: {
        ...fontSizes.heading_large,
        position: 'absolute',

        right: 0,
        left: 0,
        top: 36,

        textAlign: 'center',
        color: colors.Primary,
    },

    attachmentInfo: {
        marginTop: 12,
    },

    attachmentName: {
        ...fontSizes.button_small,
        textAlign: 'center',

        color: colors.Black,
    },

    attachmentSize: {
        ...fontSizes.button_xsmall,
        textAlign: 'center',

        color: colors.DarkGray,
    },

    attachmentError: {
        ...fontSizes.button_xsmall,
        textAlign: 'center',

        color: colors.Error,
    },

    attachmentDownloading: {
        ...fontSizes.button_xsmall,
        textAlign: 'center',

        color: colors.Primary,
    },

    attachmentIconLoading: {
        position: 'absolute',
        top: 48,

        right: 0,
        left: 0,
    }
});

export default ViewAttachmentsPage;