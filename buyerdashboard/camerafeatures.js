import { Dimensions, Image, StyleSheet, TouchableOpacity, View, Text } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import colors from '../styles/colors';
import VectorImage from 'react-native-vector-image'
import Pandora from '../utilities/pandora';
import usePhotoStore from '../stores/photostore';
import FileViewer from 'react-native-file-viewer';
import { Alert, AlertBoxContext } from '../components/alertbox';


const gallery = require('../assets/icons/image.svg');
const close = require('../assets/icons/x.svg');
const flashOn = require('../assets/icons/zap.svg');
const flashOff = require('../assets/icons/zap-off.svg');
const hdrOff = require('../assets/icons/hdr-off.svg');
const hdrOn = require('../assets/icons/hdr-on.svg');
const cameraMenu = require('../assets/icons/camera_manu.svg');

const aspectRatio = {
    Square: "[1:1]",
    Portrait: "[3:4]",
    Classic: "[2:3]",
    Widescreen: "[9:16]",
    Tall: "[1:2]"
};

const aspectRatioDimensions = {
    "[1:1]": { width: 1092, height: 1092 },
    "[3:4]": { width: 951, height: 1268 },
    "[2:3]": { width: 896, height: 1344 },
    "[9:16]": { width: 819, height: 1456 },
    "[1:2]": { width: 784, height: 1568 }
};


const AspectRatioPill = ({
    onPress = () => { },
    label = "Aspect Ratio",
    selectedRatio = null
}) => {
    const isSelected = label === selectedRatio;

    const handlePress = () => { onPress(label); };

    return (
        <TouchableOpacity onPress={handlePress} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 2, backgroundColor: isSelected ? colors.White : colors.LightGray40, }} activeOpacity={0.8}>
            <Text style={{ color: isSelected ? colors.Black : colors.White }} >{label}</Text>
        </TouchableOpacity>
    )
}

function BottomContent({
    feedback = true,
    onCapture = () => { },
    onFile = () => { }
}) {
    const photos = usePhotoStore(state => state.photos);
    const createAlert = useContext(AlertBoxContext);

    const onPress = () => {
        feedback && Pandora.TriggerFeedback(Pandora.FeedbackType.ImpactMedium);
        onCapture();
    }

    const onOpenFile = () => {
        feedback && Pandora.TriggerFeedback(Pandora.FeedbackType.ImpactMedium);
        onFile();
    }

    const viewAttachment = (uri) => {
        try { FileViewer.open(uri); }
        catch (error) { createAlert(Alert.Error(error.message)); }
    }

    return (
        <View style={styles.bottomContainerWrapper}>
            <TouchableOpacity activeOpacity={0.8} onPress={onOpenFile} style={[styles.galleryIcon, { backgroundColor: colors.Gray40 }]}>
                <VectorImage tintColor={'#FFFFFF'} source={gallery} />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} style={styles.cameraButton} onPress={onPress}>
                <View style={[styles.cameraInnerIcon, { backgroundColor: colors.White98 }]} />
            </TouchableOpacity>
            <View style={[styles.takenImage, {}]}>
                {
                    photos && (photos?.slice(-1)?.map((file, index) =>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => viewAttachment(`file://${file.uri}`)} key={index} style={{ height: '100%', width: '100%' }} >
                            <Image style={{ height: '100%', width: '100%', borderRadius: 8 }} resizeMode='contain' source={{ uri: `file://${file.uri}` }} />
                        </TouchableOpacity>
                    ))
                }
            </View>
        </View>
    )
}

function TopContent({
    feedback = true,
    onClose = () => { },
    onFlash = () => { },
    onCameraMenuIcon = () => { },
    flash = 'off',
    menuIcon = false,
    getAspectRatio = () => { },
}) {
    const [selectedAspectRatio, setSelectedAspectRatio] = useState(null);

    const onPress = () => {
        feedback && Pandora.TriggerFeedback(Pandora.FeedbackType.ImpactMedium);
        onClose();
    }
    const onFlashPress = () => {
        feedback && Pandora.TriggerFeedback(Pandora.FeedbackType.ImpactMedium);
        onFlash();
    }

    const onCameraMenuPress = () => {
        feedback && Pandora.TriggerFeedback(Pandora.FeedbackType.ImpactMedium);
        onCameraMenuIcon();
    }

    const handleAspectRatio = (ratio) => {
        getAspectRatio(aspectRatioDimensions[ratio]);
        setSelectedAspectRatio(ratio);
    };

    return (
        <View>
            <View style={[styles.topContentWrapper]}>
                <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={{}}>
                    <VectorImage tintColor={colors.White} source={close} />
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', columnGap: 20, alignItems: 'center', justifyContent: 'center' }}>

                    <TouchableOpacity activeOpacity={0.8} onPress={onFlashPress} style={{ height: 25, width: 25 }}>
                        <VectorImage tintColor={colors.White} source={flash === 'off' ? flashOff : flashOn} style={{ height: "100%", width: "100%" }} />
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.8} onPress={onCameraMenuPress} style={{ height: 25, width: 25 }}>
                        <VectorImage tintColor={colors.White} source={menuIcon ? close : cameraMenu} style={{ height: "100%", width: "100%" }} />
                    </TouchableOpacity>
                </View>

            </View>
            {
                menuIcon &&
                <View style={styles.aspectRatioContainer}>
                    {
                        Object.values(aspectRatio).map((ratio, index) => (
                            <AspectRatioPill
                                key={index}
                                label={ratio}
                                onPress={handleAspectRatio}
                                selectedRatio={selectedAspectRatio}
                            />
                        ))
                    }
                </View>
            }
        </View>
    )
}

export { TopContent, BottomContent }

const styles = StyleSheet.create({
    bottomContainerWrapper: {
        paddingVertical: 12,
        paddingHorizontal: 24,

        backgroundColor: colors.Black,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    topContentWrapper: {
        paddingVertical: 12,
        paddingHorizontal: 24,

        backgroundColor: colors.Black,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    
    },

    aspectRatioContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',

        paddingVertical: 12,
        paddingHorizontal: 24,

        backgroundColor: colors.Black,

        // borderBottomLeftRadius: 12,
        // borderBottomRightRadius: 12
    },

    aspectRatio: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    cameraItemWrapper: {
        paddingVertical: 12,
        paddingHorizontal: 24,

        flexDirection: 'row',
        alignItems: 'center',
    },

    cameraWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16
    },

    cameraButton: {
        height: 70,
        width: 70,

        borderRadius: 35,
        borderWidth: 3,
        borderColor: colors.White,

        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },

    galleryIcon: {
        height: 45,
        width: 45,
        borderRadius: 30,

        justifyContent: 'center',
        alignItems: 'center'
    },

    takenImage: {
        height: 40,
        width: 40,

        justifyContent: 'center',
        alignItems: 'center',

        transform: [{ rotate: '45deg' }],
    },

    cameraInnerIcon: {
        height: 55,
        width: 55,
        borderRadius: 30,

        justifyContent: 'center',
        alignItems: 'center'
    },

    wrapper: {
        width: '100%',

        top: Dimensions.get('window').height / 1.7,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    galleryImageWrapper: {
        height: 45,
        width: 45,
        borderWidth: 1,
        marginHorizontal: 4,
    }
})
