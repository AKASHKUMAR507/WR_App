import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { LineItems, lineItems } from './viewbuyerquotelineitem';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import NoContentFound from '../../../components/nocontentfound';
import SkeletonContainer from '../../../components/skeletons';

const RfqContainer = ({ rfq }) => {
    const insets = useSafeAreaInsets();

    return (
        rfq ?
            (
                rfq.length > 0 ?
                    <FlashList data={rfq} renderItem={({ item, index }) => <LineItems lineItems={item} index={index} key={index} />} estimatedItemSize={500} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom }} /> :
                    <NoContentFound title={'No Rfq Line Item Found'} message={'Could not find any Rfq Line Item matching your current preferences.'} />
            ) :
            <SkeletonContainer child={<LineItems deal={rfq} />} />
    )
}

const RfqPage = () => {
  return (
    <React.Fragment>
        <RfqContainer rfq={lineItems} />
    </React.Fragment>
  )
}

export default RfqPage

const styles = StyleSheet.create({})