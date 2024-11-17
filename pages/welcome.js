import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import colors from '../styles/colors'
import { useNavigation } from '@react-navigation/native'


const Welcome = () => {
    const navigation = useNavigation();

    useEffect(() => {
        setTimeout(() => {
            navigation.replace('Login')
        }, 3000)
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <LinearGradient
                style={{ flex: 1 }}
                colors={[colors.Primary, '#1a1a1a']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={require('../assets/images/mrohub.png')} resizeMode='contain' style={{ alignSelf: 'center', height: 250, width: 250 }} />
                </View>
            </LinearGradient>
        </View>
    )
}

export default Welcome

const styles = StyleSheet.create({})