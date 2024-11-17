import React, { useState, useEffect } from "react";
import { LayoutAnimation, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SearchList } from "./form_inputs/searchlists";
import colors from "../styles/colors";
import fontSizes from "../styles/fonts";
import VectorImage from "react-native-vector-image";
import { Button } from "./atoms/buttons";
import { useDrawerSheetStore } from "../stores/stores";
import inputStyles from "./form_inputs/inputStyles";
import Pandora from "../utilities/pandora";

function GenerateRandomSheetNameExtension() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function Tag({ tag, onRemove }) {
    const triggerRemove = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        if (onRemove) onRemove();
    }

    return (
        <View style={styles.tag}>
            <View style={styles.tagBody}>
                <Text style={styles.tagBodyText}>{tag.tagname}</Text>
            </View>
            <TouchableOpacity testID={`tag:${tag.tagname}:remove`} style={styles.tagIcon} activeOpacity={0.8} onPress={() => triggerRemove()}>
                <VectorImage source={require('./../assets/icons/x-circle.svg')} />
            </TouchableOpacity>
        </View>
    )
}

function TagsContainer({ tags, handleValueChange }) {
    return (
        <View style={styles.tagsContainer}>
            {tags.map((tag, index) => <Tag key={index} tag={tag} onRemove={() => handleValueChange(tag)} />)}
        </View>
    )
}

function TagListRenderer({ tag, selected }) {
    return (
        <View style={[inputStyles.inputWrapper, styles.option, selected && styles.selectedOption]}>
            <Text style={styles.dropdownInput}>{tag.tagname}</Text>
        </View>
    )
}

function TagSearchList({
    label = 'Tags',
    sheetlabel = label,
    tagname = 'Tag',
    searchbarlabel = 'Search or Add Tags',
    placeholder = 'Search or Add Tags',
    options = [],
    categoryname = null,
    subcategoryname = null,
    formState = { value: [], onChangeValue: () => { }, error: null, updateError: () => { }, clearError: () => { }, validate: () => { } },
    optional = false,
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sheetname,] = useState(GenerateRandomSheetNameExtension());

    const closeDrawerSheet = useDrawerSheetStore(state => state.closeDrawerSheet);

    const handleValueChange = (selectedValue) => {
        const selectedTag = selectedValue;

        selectedTag.categoryname = categoryname;
        selectedTag.subcategoryname = subcategoryname;

        if (formState.value.includes(selectedTag)) {
            formState.onChangeValue(formState.value.filter((value) => value !== selectedTag));
            return;
        }

        formState.onChangeValue([...formState.value, selectedTag]);
    }

    const handleAddTag = () => {
        const newTag = {
            tagname: searchQuery,
            addedby: 0,
            tagid: 0,
            categoryname: categoryname,
            subcategoryname: subcategoryname
        };

        if (newTag.tagname && !options.some((option) => option.tagname?.toLowerCase().trim() === newTag.tagname.toLowerCase().trim())) {
            closeDrawerSheet(`searchlist-${sheetname}`);
            setSearchQuery('');

            Pandora.TriggerFeedback(Pandora.FeedbackType.ImpactLight);

            if (formState.value.some((value) => value.tagname.toLowerCase().trim() === newTag.tagname.toLowerCase().trim())) return;
            formState.onChangeValue([...formState.value, newTag]);
        }
    }

    return (
        <React.Fragment>
            <SearchList
                label={label}
                sheetname={sheetname}
                searchlistsheetlabel={sheetlabel}
                searchbarlabel={searchbarlabel}
                options={options}
                dataKey='tag'
                value={formState.value}
                valueTextRenderer={(value) => value.length ? value.length + ' items selected. Tap to add more.' : null}
                listHeader={
                    <View style={{ marginHorizontal: 16 }}>
                        <Button label={`Add New ${tagname} ${searchQuery.length ? ' (' + searchQuery + ')' : ''}`} onPress={handleAddTag} />
                    </View>
                }
                listComponent={<TagListRenderer />}
                onChange={handleValueChange}
                placeholder={placeholder}
                error={formState.error}
                onSearch={(text) => setSearchQuery(text.trim())}
                optional={optional}
                autoCloseOnSelect={false}
            />
            <TagsContainer tags={formState.value} handleValueChange={handleValueChange} />
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',

        alignItems: 'flex-start',
        justifyContent: 'flex-start',

        marginVertical: 8,
    },

    tag: {
        flexDirection: 'row',

        backgroundColor: colors.LightGray,
        alignItems: 'center',

        paddingVertical: 4,

        paddingLeft: 16,
        paddingRight: 4,

        marginVertical: 4,
        marginRight: 8,

        borderRadius: 32,
    },

    tagBody: {
    },

    tagBodyText: {
        ...fontSizes.button_small,
        color: colors.Primary,
    },

    tagIcon: {
        paddingLeft: 8,
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

    dropdownInput: {
        ...fontSizes.body,

        width: '100%',
        color: colors.Black,
    },
});

export default TagSearchList;