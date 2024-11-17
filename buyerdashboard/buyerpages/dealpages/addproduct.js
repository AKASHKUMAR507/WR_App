import { DeviceEventEmitter, LayoutAnimation, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Button } from '../../../components/atoms/buttons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCameraPermission } from 'react-native-vision-camera';
import colors from '../../../styles/colors';
import fontSizes from '../../../styles/fonts';
import KeyboardAwareScrollView from '../../../components/keyboardawarescrollview';
import formStyles from '../../../styles/formStyles';
import usePhotoStore, { getFileSize } from '../../../stores/photostore';
import useFormState from '../../../hooks/formstate'
import { FormInputText } from '../../../components/form_inputs/inputs';
import FormInputWrapper from '../../../components/forminputwrapper'
import TagSearchList from '../../../components/tagsearchlist';
import AttachmentPill from '../../attachmentpillstakephotos';
import { AddProduct } from '../../../network/models/profile';
import Themis from '../../../utilities/themis';
import { Alert, AlertBoxContext } from '../../../components/alertbox';
import { useBuyerProfileInformation } from '../../../stores/fetchstore';
import { SubSystemList, SystemList } from '../../../network/models/product';
import { SearchList } from '../../../components/form_inputs/systemsearch';

const SystemCustomValueTextRenderer = (value) => {
  if (!value) return '';
  if (Array.isArray(value)) {
    return value.map(item => item.system).join(', ');
  }
  return value.system;
};

const SubSystemCustomValueTextRenderer = (value) => {
  if (!value) return '';
  if (Array.isArray(value)) {
    return value.map(item => item.system).join(', ');
  }
  return value.subSystem;
};


const AddProductFormValidators = {
  system: Themis.validator
    .addRule(Themis.anyRules.exists('Please select a system')),

  subSystem: Themis.validator
    .addRule(Themis.anyRules.exists('Please select a sub-system')),

  productName: Themis.validator
    .addRule(Themis.inputRules.text('Please enter a valid Product Name')),

  manufacturer: Themis.validator
    .makeOptional()
    .addRule(Themis.anyRules.exists('Please enter a valid Manufacturer')),
}

const AddProductPage = () => {
  const navigation = useNavigation()
  const createAlert = useContext(AlertBoxContext);

  const { hasPermission, requestPermission } = useCameraPermission()
  const photos = usePhotoStore(state => state.photos);
  const removePhotoByIndex = usePhotoStore(state => state.removePhotoByIndex);
  const resetPhotos = usePhotoStore(state => state.resetPhotos);
  const fetchBuyerProfileInfo = useBuyerProfileInformation(state => state.fetchBuyerProfileInfo)
  const _buyerID = useBuyerProfileInformation(state => state.buyerProfileInfo)

  const [loading, setLoading] = useState(false);
  const [buyerID, setBuyerID] = useState();
  const [systemList, setSystemList] = useState();
  const [subSystemList, setSubSystemList] = useState();
  const [selected, setSelected] = useState();

  const system = useFormState();
  const subSystem = useFormState();
  const productName = useFormState();
  const manufacturer = useFormState();
  const productTags = useFormState([]);

  useEffect(() => {
    fetchBuyerProfileInfo();
    attachValidators();
    resetPhotos();
  }, []);

  const attachValidators = () => {
    system.attachValidator(AddProductFormValidators.system);
    subSystem.attachValidator(AddProductFormValidators.subSystem);
    productName.attachValidator(AddProductFormValidators.productName);
    manufacturer.attachValidator(AddProductFormValidators.manufacturer);
  }

  const validateProductForm = () => {
    return system.validate()
      && subSystem.validate()
      && productName.validate()
      && manufacturer.validate();
  }

  const removeDocument = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    removePhotoByIndex(index);
  }

  const requestCameraPermission = async () => {
    if (!hasPermission) {
      try {
        await requestPermission();
      } catch (error) {
        createAlert(Alert.Error(error.message));
        return;
      }
    }
    hasPermission && navigation.navigate("CameraPage")
  }

  const takePhoto = () => {
    requestCameraPermission();
  }

  const submit = async () => {
    if (!validateProductForm()) return;
    const maxFileSizeMB = 25;

    try {
      if (photos.length === 0) { createAlert(Alert.Error("Please select at least one attachment")); return; }
      if (getFileSize(photos.flat(Infinity)) * 1024 * 1024 > maxFileSizeMB * 1024 * 1024) { createAlert(Alert.Error(`File size cannot exceed ${maxFileSizeMB} MB`)); return; }

      setLoading(true);
      DeviceEventEmitter.emit('disableInteraction');

      await AddProduct({
        prodsystem: system.value.system,
        prodsubsystem: subSystem.value.subSystem,
        productname: productName.value,
        manufacturer: manufacturer.value,
        producttag: [productTags.value],
        attachments: photos.flat(Infinity)
      });

      createAlert(Alert.Success(`Product added successfully`, 'Product Added successfully'));
      navigation.goBack();
      resetPhotos();
    } catch (error) {
      createAlert(Alert.Error(error.message));
    } finally {
      setLoading(false);
      DeviceEventEmitter.emit('enableInteraction');
    }
  }

  const _SystemLists = async () => {
    try {
      const response = await SystemList(_buyerID?.object?.BuyerProfile.buyerid);
      setSystemList(response);
    } catch (error) {
      createAlert(Alert.Error(error.message));
    }
  }

  const _SubSystemList = async () => {
    try {
      const response = await SubSystemList(system.value.systemId)
      setSubSystemList(response)
    } catch (error) {
      createAlert(Alert.Error(error.message));
    }
  }

  return (
    <React.Fragment>
      <KeyboardAwareScrollView contentContainerStyle={formStyles.formContainer}>
        <View style={formStyles.formSection}>
          <Text style={formStyles.formSectionTitle}>Product Details</Text>
          <FormInputWrapper formState={system} component={
            <SearchList
              label='System'
              options={systemList}
              onTouchStart={() => _SystemLists()}
              dataKey={"system"}
              valueTextRenderer={SystemCustomValueTextRenderer}
              searchable={true} />
          } />
          <FormInputWrapper formState={subSystem} component={
            <SearchList
              label='Sub System'
              options={subSystemList}
              onTouchStart={() => _SubSystemList()}
              dataKey={"subSystem"}
              valueTextRenderer={SubSystemCustomValueTextRenderer}
              searchable={true} />
          } />

          <FormInputWrapper formState={productName} component={<FormInputText label='Product Name' />} />
          <FormInputWrapper formState={manufacturer} component={<FormInputText label='Manufacturer' optional />} />
          <FormInputWrapper formState={productTags} component={<FormInputText label='Tag' optional />} />

          {
            photos.flat(Infinity).map((attachment, index) => <AttachmentPill key={index} attachment={attachment} onRemove={() => removeDocument(index)} />)
          }
        </View>
        <View style={{gap: 16}}>
          <Button type='secondary' label={`Take Photo`} onPress={() => takePhoto()} />
          <Button label={`Add Product`} spinner={loading} onPress={() => submit()} />
        </View>
      </KeyboardAwareScrollView>
    </React.Fragment>
  )
}

export default AddProductPage

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.White,

    flexDirection: 'row',
    alignItems: 'center',

    paddingVertical: 8,
  },

  icon: {
    width: 48,
    height: 48,

    borderRadius: 24,

    backgroundColor: colors.LightGray,
  },

  cardBody: {
    marginLeft: 16,
  },

  cardTitle: {
    ...fontSizes.heading_small,
    color: colors.Black,
  },

  cardText: {
    ...fontSizes.body,
    color: colors.DarkGray,

    maxWidth: 320,
  },
});