import React, { createRef, useContext, useEffect, useState } from 'react';
import { TextInput, View, Text, StyleSheet, LayoutAnimation } from 'react-native';
import colors from '../../styles/colors';
import inputStyles from './inputStyles';
import { ScrollIntoViewContext } from '../keyboardawarescrollview';
import fontSizes from '../../styles/fonts';


const TextInputTypes = {
    text: { keyboardType: 'default', autoCapitalize: 'sentences', autoCorrect: true, autoComplete: 'off' },
    name: { keyboardType: 'default', autoCapitalize: 'words', autoCorrect: true, autoComplete: 'name' },
    email: { keyboardType: 'email-address', autoCapitalize: 'none', autoCorrect: true, autoComplete: 'email' },
    password: { keyboardType: 'default', autoCapitalize: 'none', autoCorrect: false, autoComplete: 'new-password', textContentType: 'newPassword' },
    confirm_password: { keyboardType: 'default', autoCapitalize: 'none', autoCorrect: false, autoComplete: 'current-password' },
    number: { keyboardType: 'number-pad', autoCapitalize: 'none', autoCorrect: false, autoComplete: 'off' },
    numeric: { keyboardType: 'numeric', autoCapitalize: 'none', autoCorrect: false, autoComplete: 'off' },
    phone: { keyboardType: 'phone-pad', autoCapitalize: 'none', autoCorrect: true, autoComplete: 'tel' },
    url: { keyboardType: 'url', autoCapitalize: 'none', autoCorrect: true, autoComplete: 'off' },
    multiline: { keyboardType: 'default', autoCapitalize: 'sentences', autoCorrect: true, autoComplete: 'off' },
    oneTimeCode: { keyboardType: 'number-pad', autoCapitalize: 'none', autoCorrect: false, autoComplete: 'one-time-code' },
}

function FormInputText({
    label = "Input Label",
    inputType = TextInputTypes.text,
    optional = false,
    onFocused = () => { },
    onBlurred = () => { },
    onChange = () => { },
    error = null,
    value = null,
    placeholder = "",
    secureTextEntry = false,
    editable = true,
    multiline = false,
    maxLength = null,
    showCharacterCount = false,
    scrollIntoViewOnFocus = true,
    children
}) {
    const [focused, setFocused] = useState(false);
    const [borderColor, setBorderColor] = useState(colors.Gray);

    const [scrollOffset, setScrollOffset] = useState(0);
    const layoutRef = createRef();

    const { scrollIntoView, resetScroll } = useContext(ScrollIntoViewContext);

    const handleFocus = () => {
        scrollIntoViewOnFocus && scrollIntoView(scrollOffset);

        setFocused(true);
        onFocused();
    }

    const handdleBlur = () => {
        scrollIntoViewOnFocus && resetScroll();

        setFocused(false);
        onBlurred();
    }

    useEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        error ? setBorderColor(colors.Error) : (focused ? setBorderColor(colors.Primary) : setBorderColor(colors.Gray));
    }, [error, focused]);

    const measureLayout = () => {
        layoutRef.current.measure((x, y, width, height, pageX, pageY) => setScrollOffset(pageY - height - 16));
    }

    return (
        <View style={inputStyles.inputContainer} onLayout={measureLayout} ref={layoutRef}>
            <View style={[styles.inputWrapper, { borderColor: borderColor }]}>
                <TextInput
                    testID={`${label}:textinput`}
                    style={[inputStyles.textInput, multiline && { height: 64, textAlignVertical: 'top' }]}
                    onFocus={handleFocus}
                    onBlur={handdleBlur}
                    onChangeText={onChange}
                    value={value}
                    cursorColor={colors.Primary40}
                    placeholder={placeholder}
                    placeholderTextColor={colors.DarkGray}
                    secureTextEntry={secureTextEntry}
                    editable={editable}
                    selectionColor={colors.Primary40}
                    multiline={multiline}
                    numberOfLines={multiline ? 4 : 1}
                    maxLength={maxLength}
                    {...inputType}
                />
            </View>
            {showCharacterCount && maxLength && <Text style={inputStyles.inputInfo}>({value?.length || 0} / {maxLength} Characters)</Text>}
            {children}
            {error && <Text style={inputStyles.error}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',

        width: '100%',

        backgroundColor: colors.LightGray,

        paddingVertical: Platform.OS === 'ios' ? 8 : 2,
        paddingHorizontal : 8,

        marginTop: 4,
    },

});

export { FormInputText, TextInputTypes }