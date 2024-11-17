import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, DeviceEventEmitter, FileReader, TouchableOpacity, Image, Dimensions, LayoutAnimation, Animated } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { DownloadFile } from '../network/models/files';
import FileViewer from "react-native-file-viewer";
import fontSizes from '../styles/fonts';
import colors from '../styles/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Alert, AlertBoxContext } from '../components/alertbox';
import Aphrodite from '../utilities/aphrodite';
import shadows from '../styles/shadows';
import Pandora from '../utilities/pandora';
import { useAttachmentModeStore } from '../stores/stores';
import NoContentFound from '../components/nocontentfound';


const data = {
    sellerDocuments: {
        "Shipment Document": [
            {
                id: 16308,
                dealId: 17,
                role: "ROLE_BUYER",
                uploadedAt: "2024-06-24T12:00:00Z",
                category: "invoice",
                attachmentFileName: "invoice_1.pdf",
                attachmentFileId: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6"
            },
            {
                id: 16308,
                dealId: 17,
                role: "ROLE_BUYER",
                uploadedAt: "2024-06-24T12:00:00Z",
                category: "invoice",
                attachmentFileName: "invoice_1.pdf",
                attachmentFileId: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6"
            },
            {
                id: 16308,
                dealId: 17,
                role: "ROLE_BUYER",
                uploadedAt: "2024-06-24T12:00:00Z",
                category: "invoice",
                attachmentFileName: "invoice_1.pdf",
                attachmentFileId: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6"
            },
            {
                id: 16308,
                dealId: 17,
                role: "ROLE_BUYER",
                uploadedAt: "2024-06-24T12:00:00Z",
                category: "invoice",
                attachmentFileName: "invoice_1.pdf",
                attachmentFileId: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6"
            }
        ],
        invoice: [
            {
                id: 16308,
                dealId: 17,
                role: "ROLE_BUYER",
                uploadedAt: "2024-06-24T12:00:00Z",
                category: "invoice",
                attachmentFileName: "invoice_1.pdf",
                attachmentFileId: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6"
            },
            {
                id: 16308,
                dealId: 17,
                role: "ROLE_BUYER",
                uploadedAt: "2024-06-24T12:00:00Z",
                category: "invoice",
                attachmentFileName: "invoice_1.pdf",
                attachmentFileId: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6"
            }
        ],
    },
    buyerDocuments: {
        "quotation": [
            {
                id: 15305,
                dealId: 12,
                role: "ROLE_BUYER",
                uploadedAt: "2024-06-21T07:30:01Z",
                category: "quotation",
                attachmentFileName: "1.txt",
                attachmentFileId: "671c28b3-ddcb-4121-9261-3b47ebdfcdc2"
            },
            {
                id: 15306,
                dealId: 15,
                role: "ROLE_BUYER",
                uploadedAt: "2024-06-22T08:00:00Z",
                category: "quotation",
                attachmentFileName: "quote_2.xlsx",
                attachmentFileId: "q8r9s0t1u2v3w4x5y6z7"
            },
            {
                id: 15307,
                dealId: 16,
                role: "ROLE_BUYER",
                uploadedAt: "2024-06-23T05:45:00Z",
                category: "quotation",
                attachmentFileName: "quote_3.jpg",
                attachmentFileId: "z7y6x5w4v3u2t1s0r9q8p7o6n5m4l3k2j1"
            }
        ],
        invoice: [
            {
                id: 16308,
                dealId: 17,
                role: "ROLE_BUYER",
                uploadedAt: "2024-06-24T12:00:00Z",
                category: "invoice",
                attachmentFileName: "invoice_1.pdf",
                attachmentFileId: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6"
            },
            {
                id: 16308,
                dealId: 17,
                role: "ROLE_BUYER",
                uploadedAt: "2024-06-24T12:00:00Z",
                category: "invoice",
                attachmentFileName: "invoice_1.pdf",
                attachmentFileId: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6"
            }
        ],
        orderDocument: [
            {
                id: 16308,
                dealId: 17,
                role: "ROLE_BUYER",
                uploadedAt: "2024-06-24T12:00:00Z",
                category: "invoice",
                attachmentFileName: "invoice_1.pdf",
                attachmentFileId: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6"
            },
            {
                id: 16308,
                dealId: 17,
                role: "ROLE_BUYER",
                uploadedAt: "2024-06-24T12:00:00Z",
                category: "invoice",
                attachmentFileName: "invoice_1.pdf",
                attachmentFileId: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6"
            }
        ],
        "Shipment Document": [
            {
                id: 16308,
                dealId: 17,
                role: "ROLE_BUYER",
                uploadedAt: "2024-06-24T12:00:00Z",
                category: "invoice",
                attachmentFileName: "invoice_1.pdf",
                attachmentFileId: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6"
            },
            {
                id: 16308,
                dealId: 17,
                role: "ROLE_BUYER",
                uploadedAt: "2024-06-24T12:00:00Z",
                category: "invoice",
                attachmentFileName: "invoice_1.pdf",
                attachmentFileId: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6"
            },
            {
                id: 16308,
                dealId: 17,
                role: "ROLE_BUYER",
                uploadedAt: "2024-06-24T12:00:00Z",
                category: "invoice",
                attachmentFileName: "invoice_1.pdf",
                attachmentFileId: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6"
            },
            {
                id: 16308,
                dealId: 17,
                role: "ROLE_BUYER",
                uploadedAt: "2024-06-24T12:00:00Z",
                category: "invoice",
                attachmentFileName: "invoice_1.pdf",
                attachmentFileId: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6"
            }
        ]
    }
}


const GenericDocumentImage = require('../assets/images/GenericDocument.png');

const AttachmentModes = {
    Seller: 'Seller',
    Buyer: 'Buyer'
}

function feedbackWrapper(callback) {
    return (args) => {
        Pandora.TriggerFeedback(Pandora.FeedbackType.Soft);
        callback(args);
    }
}

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

function AttachmentModeSelector({ mode = AttachmentModes.Seller, onChangeMode = () => { } }) {
    return (
        <View style={modeSelectorStyles.modeSelectorContainer}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => feedbackWrapper(onChangeMode)(AttachmentModes.Seller)} style={[modeSelectorStyles.modeSelector, mode === AttachmentModes.Seller && modeSelectorStyles.modeSelectorActive]}>
                <Text style={[modeSelectorStyles.modeSelectorText, mode === AttachmentModes.Seller && modeSelectorStyles.modeSelectorActiveText]}>Seller</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={() => feedbackWrapper(onChangeMode)(AttachmentModes.Buyer)} style={[modeSelectorStyles.modeSelector, mode === AttachmentModes.Buyer && modeSelectorStyles.modeSelectorActive]}>
                <Text style={[modeSelectorStyles.modeSelectorText, mode === AttachmentModes.Buyer && modeSelectorStyles.modeSelectorActiveText]}>Buyer</Text>
            </TouchableOpacity>
        </View>
    )
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
        catch (error) {
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
        if (attachmentState === AttachmentDownloadStates.Downloading) return <AttachmentDownloadingIcon />;

        const icon = iconText();
        return <Text style={styles.attachmentIconText}>{icon}</Text>
    }

    return (
        <TouchableOpacity testID={`attachment:${attachment.fileName}`} activeOpacity={0.8} onPress={handlePress} style={styles.attachment}>
            <View style={styles.attachmentIcon}>
                <Image source={GenericDocumentImage} style={styles.attachmentIconImage} />
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

function AttachmentContainer({ attachment }) {
    const insets = useSafeAreaInsets();

    const attachmentMode = useAttachmentModeStore(state => state.attachmentMode);
    const attachmentKey = attachmentMode === AttachmentModes.Seller ? Object.keys(attachment.sellerDocuments) : Object.keys(attachment.buyerDocuments);

    return (
        <ScrollView contentContainerStyle={[styles.page, { paddingBottom: insets.bottom + 64 }]} showsVerticalScrollIndicator={false}>
            <View style={{ paddingVertical: 8 }}>
                {attachmentKey.length ?
                    attachmentKey?.map((key, i) =>
                        <View key={i.toString()}>
                            <Text style={{ paddingHorizontal: 16, ...fontSizes.heading_small, color: colors.Black, textTransform: 'capitalize' }}>{key}</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {
                                    attachment.buyerDocuments[key]?.map((attac, i) => <Attachment attachment={attac} key={i.toString()} />)
                                }
                            </ScrollView>
                        </View>) :
                    <NoContentFound title='Not Found' message='Attachment not found' />
                }
            </View>
        </ScrollView>
    )
}

function ViewBuyerAttachmentsPage(props) {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const attachmentMode = useAttachmentModeStore(state => state.attachmentMode);
    const setAttachmentMode = useAttachmentModeStore(state => state.setAttachmentMode);

    const normalisedAttachments = NormaliseAttachments(props?.route?.params?.attachments);

    useLayoutEffect(() => {
        const pageTitle = props?.route?.params?.pageTitle || 'View Attachments';
        navigation.setOptions({ title: pageTitle })
    });

    return (
        <View>
            <AttachmentModeSelector mode={attachmentMode} onChangeMode={(mode) => setAttachmentMode(mode)} />
            <AttachmentContainer attachment={data} />
        </View>
    )
}

const styles = StyleSheet.create({
    page: {
        paddingBottom: 24,

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
        marginTop: 8,
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

const modeSelectorStyles = StyleSheet.create({
    modeSelectorContainer: {
        backgroundColor: colors.White,
        ...shadows.shadowLight,

        flexDirection: 'row',
        justifyContent: 'space-between',

        zIndex: 10,
    },

    modeSelector: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

        paddingTop: 12,
        paddingBottom: 8,
    },

    modeSelectorText: {
        ...fontSizes.heading_small,
        color: colors.DarkGray,
    },

    modeSelectorActive: {
        borderBottomWidth: 2,
        borderBottomColor: colors.Primary,
    },

    modeSelectorActiveText: {
        color: colors.Primary,
    },
});

export default ViewBuyerAttachmentsPage;
export { AttachmentModes }