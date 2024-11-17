import React, { useCallback, useContext, useRef, useState } from 'react'
import { View, StyleSheet, DeviceEventEmitter, Text, Dimensions } from 'react-native';
import { useCameraDevice, Camera, useCameraFormat } from 'react-native-vision-camera';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useAppState } from '@react-native-community/hooks'
import { useCameraPermission } from 'react-native-vision-camera';
import NoContentFound from '../../../components/nocontentfound'
import { BottomContent, TopContent } from '../../camerafeatures';
import usePhotoStore, { getFileSize } from '../../../stores/photostore';
import DocumentPicker from 'react-native-document-picker';
import { Alert, AlertBoxContext } from '../../../components/alertbox';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../../styles/colors';

const CameraPage = () => {
    const navigation = useNavigation();
    const createAlert = useContext(AlertBoxContext);
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

    const { hasPermission } = useCameraPermission()
    const device = useCameraDevice('back')
    const isFocused = useIsFocused()
    const appState = useAppState()
    const cameraRef = useRef(null);
    const setPhotos = usePhotoStore(state => state.setPhotos);
    const photos = usePhotoStore(state => state.photos);

    const [flash, setFlash] = useState('off');
    const [hdr, setHdr] = useState(false);
    const [cameraMenu, setCameraMenu] = useState(false)
    const [selectedAspectRatio, setSelectedAspectRatio] = useState({ height: Dimensions.get('window').height, width: Dimensions.get('window').width });

    const isActive = isFocused && appState === "active"

    const checkDocumentExists = (document) => {
        const localUri = document.map(u => u.uri);
        const exists = photos.flat(Infinity).some(item => localUri.includes(item.uri));
        return exists;
    }

    const bytesToMegabytes = (bytes) => { return bytes / (1024 * 1024).toFixed(2); }

    const { width: aspectWidth, height: aspectHeight } = selectedAspectRatio;

    const scaleFactor = Math.min(screenWidth / aspectWidth, screenHeight / aspectHeight);

    const resizableWidth = aspectWidth * scaleFactor;
    const resizableHeight = aspectHeight * scaleFactor;

    const format = useCameraFormat(device, [{ photoHdr: true, photoAspectRatio: selectedAspectRatio.height / selectedAspectRatio.width, pixelFormat: 'rgb', }]);

    const takePhoto = async () => {

        if (hasPermission) {
            try {
                DeviceEventEmitter.emit('disableInteraction');

                const photo = await cameraRef.current?.takePhoto({
                    qualityPrioritization: 'speed',
                    flash: flash,
                    enableShutterSound: false,
                })
                const { height, width, path } = photo;

                const localPath = await CameraRoll.saveAsset(`file://${path}`, { type: 'photo' })

                const normalizePhoto = {
                    uri: localPath.node.image.uri,
                    type: localPath.node.type,
                    name: localPath.node.image.filename,
                    size: bytesToMegabytes(localPath.node.image.fileSize)
                }

                setPhotos(normalizePhoto);
                navigation.goBack();
            } catch (err) {
                console.log(err)
                throw err;
            } finally {
                DeviceEventEmitter.emit('enableInteraction');
            }
        }
    }

    const pickFilesFromDevice = async () => {
        const maxFileSizeMB = 25;

        try {
            const newDocument = await DocumentPicker.pick({ type: [DocumentPicker.types.allFiles], allowMultiSelection: true });

            const fileSize = getFileSize(newDocument);

            if (fileSize * 1024 * 1024 > maxFileSizeMB * 1024 * 1024) {
                createAlert(Alert.Info(`File size cannot exceed ${maxFileSizeMB} MB`));
                return;
            }

            if (checkDocumentExists(newDocument)) {
                createAlert(Alert.Info('Document already attached'));
                return;
            }

            setPhotos(newDocument.flat(Infinity));

        } catch (error) {
            if (DocumentPicker.isCancel(error)) return;
            createAlert(Alert.Error(error.message));
        } finally {
            navigation.navigate('AddProduct');
        }
    }

    if (device == null) return <NoContentFound title='Camera not found' message='Your device does not have a camera.' />;

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TopContent onClose={() => navigation.goBack()}
                onFlash={() => setFlash(flash === 'off' ? 'on' : 'off')}
                flash={flash}
                onCameraMenuIcon={() => setCameraMenu((prev) => !prev)}
                menuIcon={cameraMenu}
                getAspectRatio={(ratio) => setSelectedAspectRatio(ratio)}
            />

            <View style={style.cameraContainer}>
                {!!device && (
                    <Camera
                        style={{ height: resizableHeight, width: resizableWidth }}
                        device={device}
                        isActive={isActive}
                        photo
                        photoHdr={hdr}
                        enableZoomGesture
                        ref={cameraRef}
                        video={false}
                        videoHdr={false}
                        torch={flash}
                        format={format}
                        onError={(err) => console.log(err)}
                    />
                )}
            </View>

            <BottomContent
                onCapture={() => takePhoto()}
                onFile={() => pickFilesFromDevice()}
            />
        </SafeAreaView>
    )
}

export default CameraPage

const style = StyleSheet.create({
    cameraContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.Black,
        zIndex: -1
    }
})