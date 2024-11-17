import React, { useEffect, useMemo, useState } from 'react';
import { TextInput, View, Text, StyleSheet, LayoutAnimation, TouchableOpacity, ScrollView, Dimensions, DeviceEventEmitter, KeyboardAvoidingView, Platform, FlatList, LogBox } from 'react-native';
import colors from '../../styles/colors';
import inputStyles from './inputStyles';
import fontSizes from '../../styles/fonts';
import { FormInputText } from './inputs';
import KeyboardAwareScrollView from '../keyboardawarescrollview';
import { FlashList } from '@shopify/flash-list';
import { useDrawerSheetStore } from '../../stores/stores';
import { DrawerSheetObject } from '../drawersheet';
import Pandora from '../../utilities/pandora';

const RendererType = {
    FlatList: 'FlatList',
    FlashList: 'FlashList',
}

function GenerateRandomSheetNameExtension() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function defaultValueTextRenderer(value) {
    if (!value) return;

    if (Array.isArray(value)) {
        if (value.length === 0) return;

        if (typeof value[0] !== typeof '') {
            throw new Error('SearchList: Only strings are supported as values in default text renderer. Consider using a customRenderComponent or valueTextRenderer instead.');
        }

        return value.join(', ');
    }

    if (typeof value !== typeof '') {
        throw new Error('SearchList: Only strings are supported as values in default renderer. Consider using a customRenderComponent or valueTextRenderer instead.');
    }

    return value;
}

function notEmpty(value) {
    if (Array.isArray(value)) {
        return value.length > 0;
    }

    return !!value;
}

function SearchList({
    label = "Input Label",
    searchlistsheetlabel = label,
    searchable = true,
    searchbarlabel = 'Search',
    optional = false,
    options = [],
    renderComponent = null,
    listComponent = null,
    listHeader = null,
    listFooter = null,
    dataKey = null,
    placeholder = "Select an option",
    value = null,
    valueComparator = null,
    onChange = () => {},
    onSearch = () => {},
    searchStrategy = null,
    error = null,
    onFocused = () => {},
    onBlurred = () => {},
    valueTextRenderer = defaultValueTextRenderer,
    autoCloseOnSelect = true,
    sheetname = null,
    persistent = false,
    rendererType = RendererType.FlashList,
}) {
    const [borderColor, setBorderColor] = useState(colors.Gray);
    const [sheetNameExtension, ] = useState(sheetname || GenerateRandomSheetNameExtension());

    const addDrawerSheet = useDrawerSheetStore(state => state.addDrawerSheet);
    const openDrawerSheet = useDrawerSheetStore(state => state.openDrawerSheet);
    const closeDrawerSheet = useDrawerSheetStore(state => state.closeDrawerSheet);
    const removeDrawerSheet = useDrawerSheetStore(state => state.removeDrawerSheet);

    useEffect(() => {
        addDrawerSheet(new DrawerSheetObject(
            `searchlist-${sheetNameExtension}`, 
            <SearchListSheetChild
                label={searchlistsheetlabel}   
                options={options}
                value={value}
                valueComparator={valueComparator}
                onValueChange={handleValueChange}
                searchable={searchable}
                searchStrategy={searchStrategy}
                listComponent={listComponent}
                listFooter={listFooter}
                listHeader={listHeader}
                dataKey={dataKey}
                searchbarlabel={searchbarlabel}
                onSearch={onSearch}
                rendererType={rendererType}
            />,
            onFocused,
            onBlurred,
            searchable,
            false
        ));
    }, [searchlistsheetlabel, options, value, sheetname, searchable, searchbarlabel, onSearch, searchStrategy, listComponent, listFooter, listHeader, dataKey, rendererType]);

    useEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        error ? setBorderColor(colors.Error) : setBorderColor(colors.Gray);
    }, [error]);

    useEffect(() => {
        return () => !persistent && removeDrawerSheet(`searchlist-${sheetNameExtension}`);
    }, []);

    const renderComponentWithProps = () => {
        return React.cloneElement(renderComponent, { [dataKey]: value });
    }

    const handleFocus = () => {
        openDrawerSheet(`searchlist-${sheetNameExtension}`);
    }

    const handleValueChange = (value) => {
        onChange(value);
        if (autoCloseOnSelect) closeDrawerSheet(`searchlist-${sheetNameExtension}`);
    }

  	return (
        <View style={inputStyles.inputContainer}>
            <Text style={inputStyles.inputLabel}>{label} { optional && <Text style={inputStyles.inputOptional}>(Optional)</Text> }</Text>
            {
                renderComponent && notEmpty(value) ? 
                <TouchableOpacity testID={`${label}:selected`} activeOpacity={0.9} onPress={handleFocus}>
                    { renderComponentWithProps() }
                    <Text style={styles.textInfo}>Tap to change</Text>
                </TouchableOpacity> :
                <TouchableOpacity testID={`${label}:selected`} activeOpacity={0.9} onPress={handleFocus} style={[inputStyles.inputWrapper, { borderColor: borderColor, paddingVertical: 8 }]}>
                    <Text style={inputStyles.textInput}>{valueTextRenderer(value) || placeholder}</Text>
                </TouchableOpacity>
            }
            { error && <Text style={inputStyles.error}>{error}</Text> }
        </View>
  	);
}

function SearchListSheetChildTextComponent({ option, selected }) {
    return ( 
        <View style={[inputStyles.inputWrapper, styles.option, selected && styles.selectedOption]}>
            <Text style={styles.dropdownInput}>{option}</Text>
        </View>
    )
}

function isItemSelected(item, value) {
    if (Array.isArray(value)) {
        return value.includes(item);
    }

    return item === value;
}

function SearchListSheetChildWrapper({ item, dataKey, listComponent, handleChange, value, valueComparator }) {
    return (
        <TouchableOpacity activeOpacity={0.8} onPress={() => handleChange(item)}>
            { React.cloneElement(listComponent || <SearchListSheetChildTextComponent/>, { [dataKey && listComponent ? dataKey : 'option']: item, selected: valueComparator ? valueComparator(item, value) : isItemSelected(item, value) }) }
        </TouchableOpacity>
    )
}

function ListRenderer({ optionsList, dataKey, listComponent, handleChange, value, valueComparator, rendererType }) {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested inside plain ScrollViews']);

    if (rendererType === RendererType.FlashList) {
        return (
            <FlashList 
                data={optionsList} 
                renderItem={({ item }) => 
                <SearchListSheetChildWrapper 
                    item={item} 
                    dataKey={dataKey} 
                    listComponent={listComponent} 
                    handleChange={handleChange} 
                    value={value}
                    valueComparator={valueComparator}
                />}
                estimatedItemSize={48}
                showsVerticalScrollIndicator={false}
                extraData={value}
            />
        )
    }

    return (
        <FlatList
            data={optionsList}
            renderItem={({ item }) => 
            <SearchListSheetChildWrapper 
                item={item} 
                dataKey={dataKey} 
                listComponent={listComponent} 
                handleChange={handleChange} 
                value={value}
                valueComparator={valueComparator}
            />}
            keyExtractor={item => item}
            showsVerticalScrollIndicator={false}
            extraData={value}
        />
    )
}

function SearchListSheetChild({
    label,
    searchable,
    searchbarlabel,
    options,
    value,
    valueComparator,
    onValueChange,
    searchStrategy,
    listComponent,
    listHeader,
    listFooter,
    dataKey,
    onSearch,
    rendererType = RendererType.FlashList,
}) {
    if (options.length > 15 && !searchable) {
        console.warn('SearchList: You have more than 15 options, please consider enabling search.');
    }

    const [optionsList, setOptionsList] = useState(options);

    useEffect(() => {
        onSearch('');
        setOptionsList(options);
    }, [options]);

    const handleChange = (option) => {
        Pandora.TriggerFeedback(Pandora.FeedbackType.ImpactLight);
        onValueChange(option);
    }

    const handleSearch = (text) => {
        onSearch(text);

        if (!text) {
            setOptionsList(options);
            return;
        }

        const filteredOptions = options.filter((option) => {
            return searchStrategy ? searchStrategy(option, text.toLowerCase()) : JSON.stringify(option).toLowerCase().includes(text.toLowerCase());
        });

        setOptionsList(filteredOptions);
    }

    return (
        <KeyboardAwareScrollView>
            <View style={styles.searchListContainer}>
                <Text style={styles.searchListHeader}>{label}</Text>
                <View style={{ height: 12 }}/>
                { searchable && <FormInputText scrollIntoViewOnFocus={false} label={searchbarlabel} placeholder='Search Options' onChange={handleSearch} testID={searchbarlabel}/> }
            </View>
            { listHeader }
            <View style={[styles.dropdown, { width: '100%', minHeight: searchable ? Dimensions.get('window').height * 0.75 : Dimensions.get('window').height * 0.2 }]}>
                <ListRenderer
                    optionsList={optionsList}
                    dataKey={dataKey}
                    listComponent={listComponent}
                    handleChange={handleChange}
                    value={value}
                    valueComparator={valueComparator}
                    rendererType={rendererType}
                />
            </View>
            { listFooter }
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    searchListContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },

    searchListHeader: {
        ...fontSizes.heading,
        color: colors.Black,
    },

    dropdown: {
    },

    dropdownInput: {
        ...fontSizes.body,

        width: '100%',
        color: colors.Black,
    },

    option: {
        marginTop: 0,
        backgroundColor: colors.White,
        paddingVertical: 12,
        paddingHorizontal: 16,
    },

    selectedOption: {
        backgroundColor: colors.LightGray,
    },

    textInfo: {
        ...fontSizes.heading_xsmall,
        color: colors.Primary,

        marginTop: 4
    },
});

export { SearchList, SearchListSheetChild, RendererType }