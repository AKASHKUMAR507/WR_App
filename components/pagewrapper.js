import React from 'react';
import { StatusBar, View } from 'react-native';
import colors from '../styles/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function PageWrapper(props) {
    const insets = useSafeAreaInsets();

    return (
        <View style={{ 
            flex: 1,

            justifyContent: 'space-between',
            alignItems: 'center',

            paddingTop: insets.top,
            // padding bottom is omitted because it is already being handled by the keyboardaware scrollview
            paddingLeft: insets.left,
            paddingRight: insets.right,
            backgroundColor: colors.White,
        }}>
            <View {...props}>
                { props.children }
            </View>
    	</View>
    )
}

export default PageWrapper;