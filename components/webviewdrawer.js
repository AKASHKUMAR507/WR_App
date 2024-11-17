import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { WebView } from 'react-native-webview';
import { useDrawerSheetStore } from '../stores/stores';
import { DrawerSheetObject } from './drawersheet';
import { Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function GenerateRandomSheetNameExtension() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

const WebviewDrawer = forwardRef(WebviewDrawerComponent);

function WebviewDrawerComponent({ url }, ref) {
    const [sheetname, ] = useState(GenerateRandomSheetNameExtension());

    const addDrawerSheet = useDrawerSheetStore(state => state.addDrawerSheet);

    const openDrawerSheet = useDrawerSheetStore(state => state.openDrawerSheet);
    const closeDrawerSheet = useDrawerSheetStore(state => state.closeDrawerSheet);

    const removeDrawerSheet = useDrawerSheetStore(state => state.removeDrawerSheet);

    useImperativeHandle(ref, () => {
        return {
            open: () => openDrawerSheet(`webview-sheet-${sheetname}`),
            close: () => closeDrawerSheet(`webview-sheet-${sheetname}`)
        };
    }, []);

    useEffect(() => {
        addDrawerSheet(new DrawerSheetObject(`webview-sheet-${sheetname}`, <WebviewSheetContent url={url}/>));
        return () => removeDrawerSheet(`webview-sheet-${sheetname}`);
    }, []);
}

function WebviewSheetContent({ url }) {
    const insets = useSafeAreaInsets();
    return <WebView 
        automaticallyAdjustsScrollIndicatorInsets 
        nestedScrollEnabled 
        source={{ uri: url }} 
        containerStyle={{ height: Dimensions.get('window').height * 0.9, paddingBottom: insets.bottom + 16 }}
    />
}

export default WebviewDrawer;