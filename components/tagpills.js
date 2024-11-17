import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import colors from '../styles/colors'
import fontSizes from '../styles/fonts'

const TagPills = ({ tag = [] }) => {
    
    return (
        <View>
            {
                tag?.map((_tag, i) => (
                    <View key={i} style={styles.attachmentPill}>
                        <Text style={[styles.attachmentPillText]}>{_tag.tagName}</Text>
                    </View>
                ))
            }
        </View>
    )
}

export default TagPills

const styles = StyleSheet.create({
    attachmentPill: {
        backgroundColor: colors.LightGray,
        alignItems: 'center',

        paddingVertical: 4,
        paddingHorizontal: 16,

        marginVertical: 4,
        marginRight: 8,

        borderRadius: 32,
    },

    attachmentPillBody: {
        flex: 1,
    },

    attachmentPillText: {
        ...fontSizes.button_small,
        color: colors.Primary,
    },
});
