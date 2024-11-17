import { StyleSheet, Text, View, Alert as AlertPopup, DeviceEventEmitter } from 'react-native'
import React, { useContext, useState } from 'react'
import MenuButton, { MenuButtonTypes } from '../../../components/atoms/menubutton'
import colors from '../../../styles/colors'
import fontSizes from '../../../styles/fonts'
import { DeleteAccount } from '../../../network/models/auth'
import { Alert, AlertBoxContext } from '../../../components/alertbox'

const PrivacySetting = () => {
  const [logoutLoading, setLogoutLoading] = useState(false);
  const createAlert = useContext(AlertBoxContext);
  
  const showDeleteAccountAlert = () => {
    AlertPopup.alert(
      'Are you sure you want to delete your account?',
      `\nYour information will be deleted permanently and you will not be able to recover your account.`,
      [
        {
          text: 'Cancel',
          onPress: () => { },
          style: 'cancel'
        },
        {
          text: 'Delete Account',
          onPress: () => deleteAccount(),
          style: 'destructive'
        }
      ]
    );
  }

  const deleteAccount = async () => {
    try {
      setLogoutLoading(true);
      await DeleteAccount();
      DeviceEventEmitter.emit('logout');
    }
    catch (error) {
      createAlert(Alert.Error(error));
    }
    finally {
      setLogoutLoading(false);
    }
  }
  return (
    <View>
      <View style={styles.card}>
        <Text style={styles.cardText}>Request deletion of your data with WorldRef</Text>
        <Text style={styles.cardTextBold}>This will delete all your company products details with WorldRef </Text>
      </View>
      <MenuButton onPress={() => showDeleteAccountAlert()} type={MenuButtonTypes.Danger} label='Request Data Deletion' spinner={logoutLoading} />
    </View>
  )
}

export default PrivacySetting

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.White,

    paddingHorizontal: 16,
    paddingVertical: 24,

    borderTopColor: colors.LightGray,
    borderBottomColor: colors.LightGray,
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  cardText: {
    ...fontSizes.heading,
    color: colors.Black,
    paddingBottom: 4
  },
  cardTextBold: {
    ...fontSizes.heading_xsmall,
    color: colors.Black80,
    paddingBottom: 4
  },

})