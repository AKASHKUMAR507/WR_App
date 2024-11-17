import { StyleSheet, View, Text, TouchableOpacity, DeviceEventEmitter, Dimensions, LayoutAnimation } from 'react-native';
import VectorImage from 'react-native-vector-image';
import FileViewer from 'react-native-file-viewer';
import fontSizes from '../styles/fonts';
import colors from '../styles/colors';
import Aphrodite from '../utilities/aphrodite';
import { useContext } from 'react';
import { Alert, AlertBoxContext } from './alertbox';

function AttachmentPill({ attachment, onRemove }) {
    const createAlert = useContext(AlertBoxContext);

    const triggerRemove = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        if (onRemove) onRemove();
    }

    const viewAttachment = () => {
        try {
            FileViewer.open(attachment.uri);
        }
        catch (error) {
            createAlert(Alert.Error(error.message));
        }
    }

    return (
        <View style={styles.attachmentPill}>
            <TouchableOpacity testID={`${attachment.name}:attachmentpill`} style={styles.attachmentPillBody} activeOpacity={0.8} onPress={() => viewAttachment()}>
                <Text numberOfLines={1} style={styles.attachmentPillText}>{attachment.name} • {Aphrodite.FormatSize(attachment.size)}</Text>
            </TouchableOpacity> 
            <TouchableOpacity testID={`${attachment.name}:attachmentpill:close`} style={styles.attachmentPillIcon} activeOpacity={0.8} onPress={() => triggerRemove()}>
                <VectorImage source={require('./../assets/icons/x-circle.svg')}/>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    attachmentPill: {
        flexDirection: 'row',

        backgroundColor: colors.LightGray,
        alignItems: 'center',
        justifyContent: 'space-between',

        paddingVertical: 8,
        
        paddingLeft: 16,
        paddingRight: 8,

        marginVertical: 4,

        borderRadius: 32,

        alignSelf: 'flex-start',
    },

    attachmentPillBody: {
        flex: 1,
    },

    attachmentPillText: {
        ...fontSizes.button_small,
        color: colors.Primary,
    },

    attachmentPillIcon: {
        paddingLeft: 12,
    }
});

export default AttachmentPill;