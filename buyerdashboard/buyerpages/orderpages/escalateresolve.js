import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import colors from '../../../styles/colors'
import { Button } from '../../../components/atoms/buttons'
import { useNavigation } from '@react-navigation/native'
import fontSizes from '../../../styles/fonts'

const EscalateResolvePage = () => {
    const navigation = useNavigation();
    
    return (
        <View style={styles.page}>
            <Image style={styles.image} source={require('../../../assets/images/esclate-issue-resolved.png')} />
            <Text style={{...fontSizes.heading_large, color: colors.Black}}>We will get in touch with you shortly.</Text>

            <View style={styles.button}>
                <Button label='Share Another Issue' onPress={() => navigation.goBack()} />
            </View>
        </View>
    )
}

export default EscalateResolvePage

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: colors.White,

        paddingHorizontal: 16,
        paddingVertical: 24
    },

    image: {
        resizeMode: 'contain',
        width: '90%',
        height: 300,

        alignSelf: 'center',

        marginTop: 32
    },

    button: {
        marginTop: Dimensions.get('window').height * 0.37
    }
})