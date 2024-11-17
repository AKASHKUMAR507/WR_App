import { LayoutAnimation, StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import colors from "../styles/colors"
import shadows from "../styles/shadows"
import fontSizes from "../styles/fonts"
import { TextInputTypes } from "../components/form_inputs/searchinput"
import { createRef, useContext, useEffect, useState } from "react"
import { ScrollIntoViewContext } from "../components/keyboardawarescrollview"

function Search({
    onFocused = () => { },
    onBlurred = () => { },
    onChange = () => { },
    value = null,
    error = null,
    editable = true,
    multiline = false,
    placeholder = 'Search order...',
    maxLength = null,
    secureTextEntry = false,
    scrollIntoViewOnFocus = true,
    showCharacterCount = false,
    inputType = TextInputTypes.text
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

    const handleBlur = () => {
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
        <View style={styles.container} onLayout={measureLayout} ref={layoutRef}>
            <TextInput
                style={[styles.textInput, multiline && { height: 64, textAlignVertical: 'top' }]}
                placeholder={placeholder}
                editable={editable}
                value={value}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChangeText={onChange}
                cursorColor={colors.Primary40}
                placeholderTextColor={colors.DarkGray}
                secureTextEntry={secureTextEntry}
                selectionColor={colors.Primary40}
                multiline={multiline}
                numberOfLines={multiline ? 4 : 1}
                maxLength={maxLength}
                {...inputType}
            />
        </View>
    )
}

export default Search

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.Primary,

        paddingHorizontal: 16,
        paddingVertical: 24,

        borderBottomStartRadius: 16,
        borderBottomEndRadius: 16,

        marginBottom: 16
    },

    textInput: {
        height: 40,

        backgroundColor: colors.White,
        borderRadius: 16,

        letterSpacing: 1,
        color: colors.Black,

        paddingHorizontal: 16
    },
})