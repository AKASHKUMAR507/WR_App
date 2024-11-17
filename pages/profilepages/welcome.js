import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../styles/colors';
import React from 'react';


function Welcome(props) {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    return (
        <React.Fragment>
            <View>
                <Text>hdjsa</Text>
            </View>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',

        paddingVertical: 24,
    },

    image: {
        flex: 1,
        resizeMode: 'contain',
    },

    textContainer: {
        paddingVertical: 24,
        paddingHorizontal: 24,

        alignItems: 'center',
    },

    buttonContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,

        backgroundColor: colors.White,
    }
});

export default Welcome;


/*
    import * as React from "react";
import {StyleSheet, View} from "react-native";
import LinearGradient from "react-native-linear-gradient";

const Group = () => {
  	
        return (
            <View style={styles.rectangleParent}>
                    <LinearGradient style={styles.groupChild} locations={[0,1]} colors={['#0076e4','#1a1a1a']} useAngle={true} angle={180} />
            </View>);
};

const styles = StyleSheet.create({
        groupChild: {
            position: "absolute",
            top: 0,
            left: 0,
            width: 347,
            backgroundColor: "transparent",
            height: 710
        },
        rectangleParent: {
            flex: 1,
            width: "100%",
            height: 710
        }
});

export default Group;

*/