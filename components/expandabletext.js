import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, LayoutAnimation } from 'react-native';
import fontSizes from '../styles/fonts';
import colors from '../styles/colors';

function ExpandableText({ text, textStyles = {}, toggleStyles = {}, numberOfLines = 2, actionItem = 'Description' }) {
    const [detailsExpanded, setDetailsExpanded] = useState(false);
    const [showDetailsExpand, setShowDetailsExpand] = useState(false);

    const toggleDetailsExpanded = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setDetailsExpanded(!detailsExpanded);
    }

    return (
        <React.Fragment>
            {/* WORKAROUND: A scrollview with height 0 which renders a copy of the details text to check the number of lines it would span and show the "Expand" toggle accordingly. */}
            <ScrollView style={{ height: 0 }}><Text onTextLayout={(textLayoutEvent) => { textLayoutEvent.nativeEvent.lines.length > numberOfLines && setShowDetailsExpand(true) }} style={{ ...textStyles }}>{text}</Text></ScrollView>

            <Text numberOfLines={ detailsExpanded ? 0 : numberOfLines } style={{ ...textStyles }}>{text}</Text>
            { showDetailsExpand && <Text onPress={toggleDetailsExpanded} style={[styles.cardAction, {...toggleStyles}]}>{ detailsExpanded ? 'Collapse' : 'Expand' } {actionItem}</Text> }
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    cardAction: {
        ...fontSizes.heading_xsmall,
        color: colors.Primary,

        marginTop: 12,
    },
});

export default ExpandableText;