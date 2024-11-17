import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import colors from '../styles/colors';
import fontSizes from '../styles/fonts';

const PlaceholderImage = require('../assets/images/placeholder.png');

const ImageViewCard = ({
    images = [],
    placeholder = false
}) => {
    const [focusImage, setFocusImage] = useState(null);

    return (
        <React.Fragment>
            {
                placeholder ?
                    <View>
                        <Image style={styles.mainImage} source={{ uri: focusImage === null ? images[0].imageUrl : focusImage }} />
                        <ScrollView horizontal style={styles.cardContainer} contentContainerStyle={{ gap: 24 }} showsHorizontalScrollIndicator={false}>
                            {
                                images.map((item, index) => (
                                    <TouchableOpacity key={index.toString()} onPress={() => setFocusImage(item.imageUrl)} style={styles.touchableImage} activeOpacity={0.8}>
                                        <Image source={{ uri: item.imageUrl }} style={styles.image} />
                                    </TouchableOpacity>
                                ))
                            }
                        </ScrollView>
                    </View> :
                    <View style={styles.placeholderWrapper}>
                        <Image style={styles.placeholderImage} source={PlaceholderImage} />
                        <Text style={{
                            color: colors.Black90,
                            ...fontSizes.heading_small,
                            paddingTop: 8
                        }}>Not Found</Text>
                    </View>
            }
        </React.Fragment>
    )
}

export default ImageViewCard


const styles = StyleSheet.create({
    mainImage: {
        height: 200,
        width: '100%',

        resizeMode: 'contain',
        borderRadius: 8,

        // borderWidth: 1,
        // borderColor: colors.DarkGray

        // ...shadows.shadowHeavy
    },

    placeholderWrapper: {
        height: 200,
        width: '100%',
        resizeMode: 'cover',

        borderRadius: 8,
        backgroundColor: colors.Gray40,

        justifyContent: 'center',
        alignItems: 'center',

        marginBottom: 16
    },

    placeholderImage: {
        height: 70,
        width: 80,
        resizeMode: 'contain',
    },

    touchableImage: {
        height: 80,
        width: 80,

        borderRadius: 8,

        borderWidth: 1,
        borderColor: colors.DarkGray
    },

    image: {
        height: '100%',
        width: '100%',
        borderRadius: 8,

        resizeMode: 'contain'
    },

    cardContainer: {
        paddingVertical: 22,

        flexDirection: 'row',
        columnGap: 8,
    },
})
