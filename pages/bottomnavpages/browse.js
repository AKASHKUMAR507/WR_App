import React, { useState, useEffect, createRef, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, FlatList, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, ButtonSizes, ButtonTypes } from '../../components/atoms/buttons';
import fontSizes from '../../styles/fonts';
import colors from '../../styles/colors';
import { AddLiveDealToBuying, ListLiveDeals } from '../../network/models/browsedeals';
import Chronos from '../../utilities/chronos';
import SkeletonContainer from '../../components/skeletons';
import NoContentFound from '../../components/nocontentfound';
import CountryFlag from '../../components/atoms/countryflag';
import { useDrawerSheetStore, useUserStore } from '../../stores/stores';
import useRefreshScreens from '../../hooks/refreshscreens';
import { DealTypes } from '../dealpages/dealdetails';
import { Alert, AlertBoxContext } from '../../components/alertbox';
import MenuButton from '../../components/atoms/menubutton';
import shadows from '../../styles/shadows';
import { FormInputText, TextInputTypes } from '../../components/form_inputs/searchinput';
import { useListLiveDeals } from '../../stores/fetchstore';
import VectorImage from 'react-native-vector-image';

const RFQCardSkeletonData = { rfqid: '', name: '', description: '', createddate: 0, rfqclosingdate: 0, prefsourceoforigin: ['India', 'Australia'], dealtags: [{ name: 'Dummy Tag' }] };

const SearchRFQ = (searchList, query) => {
    const cleanedQuery = query.replace(/\s+/g, ' ').toLowerCase().toString();

    const filter = searchList?.filter((item) => {
        const searchableFields = ['name', 'description', 'deliveryplace', 'deliverycity', 'rfqtype', 'dealid', 'rfqid'];

        return searchableFields.some((field) => {
            const fieldValue = item[field];

            const fieldValueAsString = fieldValue !== undefined ? fieldValue?.toString()?.toLowerCase() : '';

            return fieldValueAsString?.includes(cleanedQuery);
        });
    });

    return filter || [];
};

function Tag({ label }) {
    return (
        <View style={styles.tag}>
            <Text style={styles.tagText}>{label}</Text>
        </View>
    )
}

function RFQCard({ rfq }) {
    const navigation = useNavigation();
    const chronos = new Chronos();

    const user = useUserStore(state => state.user);

    const [rfqAssigned, setRfqAssigned] = useState(rfq.rfqassigned);
    const [loading, setLoading] = useState(false);

    const createAlert = useContext(AlertBoxContext);

    const addDealToBuying = async () => {
        setLoading(true);

        try {
            await AddLiveDealToBuying({ rfqtosellerid: rfq.rfqid, userrefid: user.userrefid })
            setRfqAssigned(true);
            createAlert(Alert.Success(`${rfq.name} added to your Buying Deals`, 'Deal Added Successfully'));
        }
        catch (error) {
            createAlert(Alert.Error(error.message));
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <React.Fragment>
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardText}>{chronos.FormattedDateFromTimestamp(rfq.createddate)}</Text>
                    <View style={styles.row}>
                        <Text style={styles.cardText}>Closes</Text>
                        <View style={{ width: 8 }} />
                        <Text style={styles.cardTextBold}>{chronos.FormattedDateFromTimestamp(rfq.rfqclosingdate)}</Text>
                    </View>
                </View>
                <View style={styles.cardBody}>
                    <Text numberOfLines={1} style={styles.cardTitle}>{rfq.name}</Text>
                    <Text numberOfLines={2} style={styles.cardBodyText}>{rfq.description}</Text>
                </View>
                {
                    rfq.dealtags.length > 0 &&
                    <View style={[styles.cardRowWrap, { marginTop: 12 }]}>
                        {rfq.dealtags.map((tag, index) => <Tag key={index} label={tag.tagname} />)}
                    </View>
                }
                {
                    rfq.prefsourceoforigin.length > 0 &&
                    <View style={styles.cardBody}>
                        <Text style={styles.cardTextBold}>Preferred Source of Origin</Text>
                        <View style={styles.cardRowWrap}>
                            {rfq.prefsourceoforigin.map((country, index) => <CountryFlag key={index} country={country} />)}
                        </View>
                    </View>
                }
                {
                    !rfqAssigned &&
                    <View style={styles.cardFooter}>
                        <View style={styles.row}>
                            <View style={{ flex: 1 }}>
                                <Button size={ButtonSizes.small} type={ButtonTypes.secondary} label='View' onPress={() => navigation.navigate('LiveDealDetails', { rfqid: rfq.rfqid })} />
                            </View>
                            <View style={{ width: 12 }} />
                            <View style={{ flex: 2 }}>
                                <Button size={ButtonSizes.small} spinner={loading} label="Add to Buying Deals" onPress={() => addDealToBuying()} />
                            </View>
                        </View>
                    </View>
                }
            </View>
            {
                rfqAssigned &&
                <MenuButton label='View in Buying Deals' onPress={() => navigation.navigate('DealDetails', { dealid: rfq.dealid, rfqid: rfq.rfqid, role: DealTypes.Buying })} />
            }
            <View style={styles.vspace} />
        </React.Fragment>
    )
}

function RFQListContainer({ search }) {
    const rfqList = useListLiveDeals(state => state.listLiveDeals);

    const [filterRfqList, setfilterRfqList] = useState(rfqList);

    useEffect(() => {
        const filterRfqList = SearchRFQ(rfqList, search);
        setfilterRfqList(filterRfqList)
    }, [search])

    return (
        filterRfqList ?
            (
                filterRfqList.length > 0 ?
                    <FlatList data={filterRfqList} renderItem={({ item }) => <RFQCard rfq={item} />} keyExtractor={item => item.rfqid} showsVerticalScrollIndicator={false} /> :
                    <NoContentFound title={'No live deals found'} message={'Could not find any live deals matching your current preferences.'} />
            ) :
            <SkeletonContainer child={<RFQCard rfq={RFQCardSkeletonData} />} />
    )
}

function SearchAndFilterRFQ({ search, setSearch, editable = true, onSearch = () => { }, disabled = false, }) {
    return (
        <TouchableOpacity onPress={onSearch} activeOpacity={1} disabled={disabled} style={styles.searchAndFilter}>
            <View style={styles.searchInput}>
                <FormInputText
                    value={search}
                    onChange={(text) => setSearch(text)}
                    label=''
                    placeholder='Search'
                    editable={editable}
                />
            </View>
        </TouchableOpacity>
    )
}

function BrowsePage(props) {
    const refreshScreens = useRefreshScreens();
    const fetchLiveDeals = useListLiveDeals(state => state.fetchListLiveDeal);
    const loadLiveDeals = useListLiveDeals(state => state.loadListLiveDeals);

    const [search, setSearch] = useState('');

    useEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        fetchLiveDeals();
        loadLiveDeals();
    }, [refreshScreens.shouldRefresh]);

    return (
        <React.Fragment>
            <SearchAndFilterRFQ search={search} setSearch={setSearch} disabled={true} />
            <RFQListContainer search={search} />
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    page: {
    },

    card: {
        backgroundColor: colors.White,

        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 16,

        borderTopColor: colors.LightGray,
        borderBottomColor: colors.LightGray,
        borderBottomWidth: 1,
        borderTopWidth: 1,
    },

    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    cardBody: {
        marginTop: 16,
    },

    cardFooter: {
        marginTop: 16,
        marginBottom: 8,
    },

    cardTitle: {
        ...fontSizes.heading_small,
        color: colors.Black,
    },

    cardText: {
        ...fontSizes.heading_xsmall,
        color: colors.DarkGray,
    },

    cardTextBold: {
        ...fontSizes.heading_xsmall,
        color: colors.Black,
    },

    cardBodyText: {
        ...fontSizes.body_small,
        color: colors.DarkGray,

        marginTop: 12,
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    cardRowWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },

    tag: {
        backgroundColor: colors.Primary20,
        borderRadius: 16,

        paddingHorizontal: 16,
        paddingVertical: 4,

        marginRight: 8,
        marginBottom: 8,
    },

    tagText: {
        ...fontSizes.button_small,
        color: colors.Primary,
    },

    vspace: {
        height: 24,
        backgroundColor: colors.LightGray,
    },

    filterIcon: {
        width: 24,
        height: 24,

        resizeMode: 'contain',

        marginHorizontal: 8,
    },

    searchAndFilter: {
        width: '100%',

        backgroundColor: colors.White,
        ...shadows.shadowLight,

        flexDirection: 'row',
        columnGap: 8,

        justifyContent: 'center',
        alignItems: 'center',

        zIndex: 1,
    },

    searchInput: {
        flex: 1,

        marginHorizontal: 20,
        marginBottom: -8,
    },

    inputStyle: {

    }
});

export default BrowsePage;
export { SearchAndFilterRFQ }