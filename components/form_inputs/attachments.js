import React, { useContext, useEffect, useState } from 'react';
import { TextInput, View, Text, StyleSheet, LayoutAnimation, DeviceEventEmitter } from 'react-native';
import colors from '../../styles/colors';
import inputStyles from './inputStyles';
import { Button, ButtonTypes } from '../atoms/buttons';
import DocumentPicker from 'react-native-document-picker';
import AttachmentPill from '../attachmentpills';
import { Alert, AlertBoxContext } from '../alertbox';

function FormInputAttachments({
    label = "Input Label",
    optional = false,
    maxLength = null,
    value = [],
    error = null,
    maxFileSizeMB = 10,
    onChange = () => { },
    onFocused = () => { },
    onBlurred = () => { },
}) {
    const createAlert = useContext(AlertBoxContext);

    const checkDocumentExists = (document) => {
        return value.find((doc) => doc.uri === document.uri);
    }

    const attachDocument = async () => {
        if (value.length === maxLength) {
            createAlert(Alert.Info(`You can only attach upto ${maxLength} documents`));
            return;
        }

        onFocused();

        try {
            const newDocument = await DocumentPicker.pickSingle({ type: [DocumentPicker.types.allFiles] });

            if (newDocument.size > maxFileSizeMB * 1024 * 1024) {
                createAlert(Alert.Info(`File size cannot exceed ${maxFileSizeMB} MB`));
                return;
            }

            if (checkDocumentExists(newDocument)) {
                createAlert(Alert.Info('Document already attached'));
                return;
            }

            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            onChange([...value, newDocument]);
        }
        catch (error) {
            if (DocumentPicker.isCancel(error)) return;
            createAlert(Alert.Error(error.message));
        }
        finally {
            onBlurred();
        }
    }

    const removeDocument = (index) => {
        const newDocuments = [...value];
        newDocuments.splice(index, 1);

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        onChange(newDocuments);
        onBlurred();
    }

    return (
        <View style={inputStyles.inputContainer}>
            <Text style={inputStyles.inputLabel}>{label} {optional && <Text style={inputStyles.inputOptional}>(Optional)</Text>}</Text>
            <View style={styles.attachmentPillsContainer}>
                {value.map((document, index) => <AttachmentPill key={index} attachment={document} onRemove={() => removeDocument(index)} />)}
            </View>
            {
                (!maxLength || value.length < maxLength) &&
                <View style={styles.buttonContainer}>
                    <Button label="Add Attachments" type={ButtonTypes.secondary} onPress={() => attachDocument()} />
                </View>
            }
            {error && <Text style={inputStyles.error}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        marginTop: 16,
        marginBottom: 4,
        alignSelf: 'stretch'
    },

    attachmentPillsContainer: {
        marginTop: 8,
    }
});

export { FormInputAttachments }