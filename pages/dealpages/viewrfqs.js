import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, ScrollView } from 'react-native';
import fontSizes from './../../styles/fonts';
import colors from './../../styles/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DealTypes, RFQCard } from './dealdetails';
import useCurrentDeal from '../../hooks/currentdeal';

function ViewRFQsPage(props) {
    const insets = useSafeAreaInsets();

    const [currentDeal] = useCurrentDeal();

    return (
        <ScrollView contentContainerStyle={[styles.page, { paddingBottom: insets.bottom }]} showsVerticalScrollIndicator={false}>
            { currentDeal.rfqList.map((rfq, index) => 
                <RFQCard
                    role={currentDeal.role} 
                    status={currentDeal.status}
                    rfq={rfq} 
                    type={currentDeal.dealType} 
                    isInactiveDeal={currentDeal.isInactiveDeal} 
                    dealid={currentDeal.id} 
                    dealcreateddate={currentDeal.createddate}
                    history={currentDeal.rfqList}
                    key={index}
                />
            ) }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    page: {
    },

    vspace: {
        height: 24,
        backgroundColor: colors.LightGray,
    },
});

export default ViewRFQsPage;