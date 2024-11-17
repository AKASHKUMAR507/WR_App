import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import KeyboardAwareScrollView from '../../components/keyboardawarescrollview'
import formStyles from '../../styles/formStyles'
import fontSizes from '../../styles/fonts'
import colors from '../../styles/colors'
import PrivacyInput from '../../components/form_inputs/privacyinput'
import { PrivacySetting } from '../../network/models/setting'
import { Alert, AlertBoxContext } from '../../components/alertbox'
import { usePrivacy } from '../../stores/fetchstore'

const PrivacySettings = () => {
    const createAlert = useContext(AlertBoxContext);
    const privacy = usePrivacy(state => state.privacy);

    const [hideEmail, setHideEmail] = useState(privacy?.hemail === 'y' ? true : false)
    const [hideAddress, setHideAddress] = useState(privacy?.haddress === 'y' ? true : false)
    const [hideMobileNumber, setHideMobileNumber] = useState(privacy?.hmobile === 'y' ? true : false)
    const [hideWebsite, setHideWebsite] = useState(privacy?.hwebsite === 'y' ? true : false)
    const [hideCompany, setHideCompany] = useState(privacy?.hcompany === 'y' ? true : false)
    const [hideIndustries, setHideIndustries] = useState(privacy?.hindustries === 'y' ? true : false)
    const [hideProducts, setHideProducts] = useState(privacy?.hproducts === 'y' ? true : false)
    const [hideServices, setHideServices] = useState(privacy?.hservices === 'y' ? true : false)
    const [hideTerritories, setHideTerritories] = useState(privacy?.hterritories === 'y' ? true : false)
    const [hideSocialProfileLinks, setHideSocialProfileLinks] = useState(privacy?.hsocialprofilelinks === 'y' ? true : false)
    const [hideProfileSummary, setHideProfileSummary] = useState(privacy?.hprofilesummary === 'y' ? true : false)
    const [hideBusinessExperience, setHideBusinessExperience] = useState(privacy?.hbusinessexperience === 'y' ? true : false)
    const [hideAffiliationsCertifications, setHideAffiliationsCertifications] = useState(privacy?.hcertifications === 'y' ? true : false)
    const [hideNumberofDealssubmitted, setHideNumberofDealssubmitted] = useState(privacy?.hsubmitteddeals === 'y' ? true : false)
    const [hideValueofDeals, setHideValueofDeals] = useState(privacy?.hdealvalue === 'y' ? true : false)
    const [hideNumberofOfferssubmitted, setHideNumberofOfferssubmitted] = useState(privacy?.hsubmittedoffers === 'y' ? true : false)
    const [hideValueofOffers, setHideValueofOffers] = useState(privacy?.hoffervalue === 'y' ? true : false)


    const data = { hemail: hideEmail ? 'y' : 'n', haddress: hideAddress ? 'y' : 'n', hmobile: hideMobileNumber ? 'y' : 'n', hwebsite: hideWebsite ? 'y' : 'n', hcompany: hideCompany ? 'y' : 'n', hindustries: hideIndustries ? 'y' : 'n', hproducts: hideProducts ? 'y' : 'n', hservices: hideServices ? 'y' : 'n', hterritories: hideTerritories ? 'y' : 'n', hsocialprofilelinks: hideSocialProfileLinks ? 'y' : 'n', hprofilesummary: hideProfileSummary ? 'y' : 'n', hbusinessexperience: hideBusinessExperience ? 'y' : 'n', hcertifications: hideAffiliationsCertifications ? 'y' : 'n', hsubmitteddeals: hideNumberofDealssubmitted ? 'y' : 'n', hdealvalue: hideValueofDeals ? 'y' : 'n', hsubmittedoffers: hideNumberofOfferssubmitted ? 'y' : 'n', hoffervalue: hideValueofOffers ? 'y' : 'n' }

    const privacySettings = async () => {
        try {
            await PrivacySetting({ hideprofilesummary: data.hprofilesummary, hideoffervalue: data.hoffervalue, hideaddress: data.haddress, hidebusinessexperience: data.hbusinessexperience, hideemail: data.hemail, hidewebsite: data.hwebsite, hidecertifications: data.hcertifications, hidedealvalue: data.hdealvalue, hideproducts: data.hproducts, hidesocialprofilelinks: data.hsocialprofilelinks, hidesubmittedoffers: data.hsubmittedoffers, hidemobile: data.hmobile, hidecompany: data.hcompany, hidesubmitteddeals: data.hsubmitteddeals, hideterritories: data.hterritories, hideservices: data.hservices, hideindustries: data.hindustries });
        } catch (error) {
            createAlert(Alert.Error(error.message));
        }
    }

    useEffect(() => {
        privacySettings();
    }, [data.hemail, data.haddress, data.hmobile, data.hwebsite, data.hcompany, data.hindustries, data.hproducts, data.hservices, data.hterritories, data.hsocialprofilelinks, data.hprofilesummary, data.hbusinessexperience, data.hcertifications, data.hsubmitteddeals, data.hdealvalue, data.hsubmittedoffers, data.hoffervalue])

    return (

        <KeyboardAwareScrollView contentContainerStyle={styles.container}>

            <Text style={styles.labelStyle}>Choose what you want to show on yur social profile</Text>

            <View style={formStyles.formSection}>
                <PrivacyInput label='Hide Email' onToggle={() => setHideEmail(!hideEmail)} active={hideEmail} />
                <PrivacyInput label='Hide Address' onToggle={() => setHideAddress(!hideAddress)} active={hideAddress} />
                <PrivacyInput label='Hide Mobile Number' onToggle={() => setHideMobileNumber(!hideMobileNumber)} active={hideMobileNumber} />
                <PrivacyInput label='Hide Website' onToggle={() => setHideWebsite(!hideWebsite)} active={hideWebsite} />
                <PrivacyInput label='Hide Company' onToggle={() => setHideCompany(!hideCompany)} active={hideCompany} />
                <PrivacyInput label='Hide Industries' onToggle={() => setHideIndustries(!hideIndustries)} active={hideIndustries} />
                <PrivacyInput label='Hide Products' onToggle={() => setHideProducts(!hideProducts)} active={hideProducts} />
                <PrivacyInput label='Hide Services' onToggle={() => setHideServices(!hideServices)} active={hideServices} />
                <PrivacyInput label='Hide Territories' onToggle={() => setHideTerritories(!hideTerritories)} active={hideTerritories} />
                <PrivacyInput label='Hide Social Profile Links' onToggle={() => setHideSocialProfileLinks(!hideSocialProfileLinks)} active={hideSocialProfileLinks} />
                <PrivacyInput label='Hide Profile Summary' onToggle={() => setHideProfileSummary(!hideProfileSummary)} active={hideProfileSummary} />
                <PrivacyInput label='Hide Business Experience' onToggle={() => setHideBusinessExperience(!hideBusinessExperience)} active={hideBusinessExperience} />
                <PrivacyInput label='Hide Affiliations/Certifications' onToggle={() => setHideAffiliationsCertifications(!hideAffiliationsCertifications)} active={hideAffiliationsCertifications} />
                <PrivacyInput label='Hide Value of Deals' onToggle={() => setHideValueofDeals(!hideValueofDeals)} active={hideValueofDeals} />
                <PrivacyInput label='Hide Number of Deals submitted' onToggle={() => setHideNumberofDealssubmitted(!hideNumberofDealssubmitted)} active={hideNumberofDealssubmitted} />
                <PrivacyInput label='Hide Number of Offers submitted' onToggle={() => setHideNumberofOfferssubmitted(!hideNumberofOfferssubmitted)} active={hideNumberofOfferssubmitted} />
                <PrivacyInput label='Hide Value of Offers' onToggle={() => setHideValueofOffers(!hideValueofOffers)} active={hideValueofOffers} />
            </View>

        </KeyboardAwareScrollView>
    )
}

export default PrivacySettings

const styles = StyleSheet.create({
    container: {
        paddingVertical: 24,
    },
    labelStyle: {
        paddingHorizontal: 16,
        marginBottom: 12,

        ...fontSizes.heading,
        color: colors.Black80
    },
    btnContainer: {
        paddingHorizontal: 16,
    }
})