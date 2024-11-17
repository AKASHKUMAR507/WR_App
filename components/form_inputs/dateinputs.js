import React, { useEffect, useState, createRef } from 'react';
import { TextInput, View, Text, StyleSheet, LayoutAnimation, TouchableOpacity, Platform } from 'react-native';
import colors from '../../styles/colors';
import inputStyles from './inputStyles';
import DatePicker from 'react-native-date-picker';

function FormattedDateFromTimestamp(timestamp) {
    const date = new Date(timestamp);
    
    const year = date.getFullYear();
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', "October", "November", "December"];
    const month = date.getMonth();
    const day = date.getDate();
    
    return `${months[month]} ${day}, ${year}`;
}

function DateOffsetByDays(offsetDays) {
    if (offsetDays === null) { return null }

    const date = new Date();
    date.setDate(date.getDate() + offsetDays);
    return date;
}

function GetDefaultDate(minDateOffsetDays, maxDateOffsetDays) {
    const date = new Date();

    date.setDate(date.getDate() + minDateOffsetDays ?? 0);
    date.setDate(date.getDate() + maxDateOffsetDays ?? 0);

    return date;
}

function FormInputDate({
    label = "Input Label",
    optional = false,
    disabled = false,
    onFocused = () => {},
    onBlurred = () => {},
    onChange = () => {},
    error = null,
    value = null,
    minDateOffsetDays = null,
    maxDateOffsetDays = null,
}) {
    const [focused, setFocused] = useState(false);
    const [borderColor, setBorderColor] = useState(colors.Gray);

    const handleFocus = () => {
        setFocused(true);
        onFocused();
    }

    const handleBlur = () => {
        setFocused(false);
        onBlurred();
    }

    const onChangeDate = (selectedDate) => {
        onChange(selectedDate);
        handleBlur();
    }

    useEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        error ? setBorderColor(colors.Error) : setBorderColor(colors.Gray);
    }, [error]);

  	return (
        <TouchableOpacity testID={`${label}:dateinput`} activeOpacity={0.8} style={inputStyles.inputContainer} onPress={() => handleFocus()} disabled={disabled}>
            <Text style={inputStyles.inputLabel}>{label} { optional && <Text style={inputStyles.inputOptional}>(Optional)</Text> }</Text>
            <View style={[inputStyles.inputWrapper, { borderColor: borderColor}]}>
                <Text style={inputStyles.textInput} selectable={false}>{value ? FormattedDateFromTimestamp(value) : 'Select a date'}</Text>
            </View>
            { error && <Text style={inputStyles.error}>{error}</Text> }
            <DatePicker 
                mode={'date'} 
                modal 
                open={focused} 
                date={value || new Date()}
                //date={value || GetDefaultDate(minDateOffsetDays, maxDateOffsetDays)} 
                //minimumDate={DateOffsetByDays(minDateOffsetDays)} 
                //maximumDate={DateOffsetByDays(maxDateOffsetDays)}
                onConfirm={onChangeDate} 
                onCancel={handleBlur}
            />
        </TouchableOpacity>
  	);
}

const styles = StyleSheet.create({
});

export { FormInputDate }