import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'
// import SplashFormInput from '../components/splashform'
import Swiper from 'react-native-swiper'
import { Button } from '../components/atoms/buttons'

const { width, height } = Dimensions.get('window');


const SplashScreen = () => {


    return (
        <Swiper style={styles.wrapper} showsButtons={false} loop={false} dotStyle={{ marginBottom: '5%'}} activeDotStyle ={{ marginBottom: '5%'}} >
{/* 
            <View>
                <SplashFormInput
                    showSkipButton={true}
                    onPress={() => null}
                    image={require('../assets/images/business-3d.png')}
                    title={'Monetise Your Network'}
                    subTitle={"Refer Deals, Buyers or Sellers in your network. Earn assured success fee upon conversion of business."}
                />
            </View>

            <View>
                <SplashFormInput
                    showSkipButton={true}
                    onPress={() => null}
                    image={require('../assets/images/business-3d-business-advisers.png')}
                    title={'Earn Upto 80% Success Fee'}
                    subTitle={"Get upto 80% of success fee made in any transaction made from deal, buyer or seller referred by you."}
                />
            </View>

            <View>
                <SplashFormInput
                    showSkipButton={true}
                    onPress={() => null}
                    image={require('../assets/images/business-3d-298.png')}
                    title={'Sell Whatever Buyer Needs'}
                    subTitle={"Get best quotations from verified sellers for anything that your network wants to buy. 100% assured by WorldRef."}
                />
            </View>

            <View>
                <SplashFormInput
                    showSkipButton={true}
                    onPress={() => null}
                    image={require('../assets/images/business-3d-315.png')}
                    title={'Help Us Deal With Sellers'}
                    subTitle={"Help buyers source products and services from sellers in your network. You refer the sellers, or play a larger role, your choice!"}
                />
            </View>

            <View>
                <SplashFormInput
                    showSkipButton={true}
                    onPress={() => null}
                    image={require('../assets/images/business-3d-304.png')}
                    title={'Retain Your Referrals'}
                    subTitle={"Deals, Buyers and Sellers first referred by you shall be exclusive. Continue earning referral fee from all the transactions. "}
                />
            </View>

            <View>
                <SplashFormInput
                    showSkipButton={false}
                    onPress={() => null}
                    image={require('../assets/images/business-3d-beneficial-relationship.png')}
                    title={'Safe, Secure, & Confidential'}
                    subTitle=''
                />
                <View style={{ position: 'absolute', zIndex: 1, width: width, paddingHorizontal: 16, bottom: -32 }}>
                    <Button label='Join Now' />
                </View>

            </View> */}

        </Swiper>

    )
}

export default SplashScreen

const styles = StyleSheet.create({})