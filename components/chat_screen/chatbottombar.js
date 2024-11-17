import React, { useState, useEffect, createRef, useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, LayoutAnimation, InputAccessoryView, Image, DeviceEventEmitter, ActivityIndicator, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import VectorImage from 'react-native-vector-image';
import DocumentPicker from 'react-native-document-picker';
import Animated, { runOnUI, useAnimatedKeyboard, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import AttachmentPill from '../attachmentpills';
import colors from '../../styles/colors';
import fontSizes from '../../styles/fonts';
import { messageType } from './chatbubble';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Alert, AlertBoxContext } from '../alertbox';

function BottomBarInputWrapper({ children }) {
    const insets = useSafeAreaInsets();
    const keyboard = useAnimatedKeyboard();

    const translateStyle = useAnimatedStyle(() => {
        return {
            bottom: keyboard.height.value,
        };
    });

    return (
        <Animated.View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }, translateStyle]}>{ children }</Animated.View>
    )
}

function ChatBottomBar({ onSend }) {
    const [documents, setDocuments] = useState([]);   
    const [text, setText] = useState('');
    const [textInputFocused, setTextInputFocused] = useState(false);

    const createAlert = useContext(AlertBoxContext);

    const textInputRef = createRef();

    const checkDocumentExists = (document) => {
        return documents.find((doc) => doc.uri === document.uri);
    }

    const attachDocument = async () => {
        try {
            const newDocument = await DocumentPicker.pickSingle({ type: [DocumentPicker.types.allFiles] });

            if (checkDocumentExists(newDocument)) {
                createAlert(Alert.Info('Document already attached'));
                return;
            }

            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setDocuments([...documents, newDocument]);
        }
        catch (error) {
            if (DocumentPicker.isCancel(error)) return;
            createAlert(Alert.Error(error.message));
        }
    }

    const removeDocument = (index) => {
        const newDocuments = [...documents];
        newDocuments.splice(index, 1);

        setDocuments(newDocuments);
    }

    const onTextInputFocusChange = (focus) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setTextInputFocused(focus);
    }

    const getAttachmentType = (document) => {
        const extension = document.name.split('.').pop();
        const imageExtensions = ['png', 'jpg', 'jpeg'];

        return imageExtensions.includes(extension) ? messageType.Image : messageType.File;
    }

    const sendDocuments = () => {
        documents.forEach((document) => onSend(document, getAttachmentType(document)));
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setDocuments([]);
    }

    const sendText = () => {
        onSend(text);
        setText('');
    }

    const onPressSend = () => {
        if (text.length === 0 && documents.length === 0) return;

        textInputRef.current?.blur();
        documents.length > 0 ? sendDocuments() : sendText();
    }

    return (
        <BottomBarInputWrapper>
            {
                (textInputFocused || text.length) > 0 ? <View style={{ marginRight: 16 }}/> :
                <TouchableOpacity activeOpacity={0.8} onPress={() => attachDocument()}>
                    <VectorImage source={require('../../assets/icons/document-add.svg')} style={styles.bottombarIcon}/>
                </TouchableOpacity>
            }
            {
                documents.length > 0 ?
                <View style={styles.attachmentPillContainer}>
                    { documents.map((document, index) => <AttachmentPill key={index} attachment={document} onRemove={() => removeDocument(index)}/>) }
                </View> :
                <TextInput ref={textInputRef} value={text} onChangeText={(text) => setText(text)} onFocus={() => onTextInputFocusChange(true)} onBlur={() => onTextInputFocusChange(false)} placeholder="Type a message" style={styles.input}/>
            }
            <Text style={styles.sendText} onPress={onPressSend}>Send</Text>
        </BottomBarInputWrapper>
    )
}

const styles = StyleSheet.create({
    bottomBar: {
        backgroundColor: colors.White,

        paddingVertical: 16,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },

    input: {
        ...fontSizes.body,
    
        color: colors.Black,
        padding: 0,

        flex: 1,
    },

    sendText: {
        ...fontSizes.heading_xsmall,
        color: colors.Primary,

        marginHorizontal: 16,
    },

    bottombarIcon: {
        marginHorizontal: 16,
    },

    attachmentPillContainer: {   
        flex: 1,
    },
});

export default ChatBottomBar;