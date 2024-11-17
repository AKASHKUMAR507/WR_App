import React, { useRef, useState, Children, useEffect, forwardRef, useImperativeHandle, createRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, BackHandler, LayoutAnimation } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../styles/colors';
import shadows from '../styles/shadows';
import Animated, { runOnJS, useAnimatedKeyboard, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector, ScrollView } from 'react-native-gesture-handler';
import { useBackHandler } from '@react-native-community/hooks';
import { useDrawerSheetStore } from '../stores/stores';
import Pandora from '../utilities/pandora';

const maxHeight = Dimensions.get('window').height * 0.9;

class DrawerSheetObject {
    constructor(name, children = null, onOpen = () => {}, onClose = () => {}, fixedHeight = false, show = false) {
        this.name = name;
        this.open = show;
        this.onOpen = onOpen;
        this.onClose = onClose;
        this.fixedHeight = fixedHeight;
        this.children = children;
    }
}

function DrawerSheet({ name, show = false, onOpen = () => {}, onClose = () => {}, fixedHeight = false, children }) {
    const insets = useSafeAreaInsets();
    const updateDrawerSheetOpen = useDrawerSheetStore(state => state.updateDrawerSheetOpen);

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (show) showDrawer();
        else hideDrawer();
    }, [show]);

    useEffect(() => {
        updateDrawerSheetOpen(name, open);
    }, [open]);
    
    useBackHandler(() => {
        if (open) {
            hideDrawer();
            return true;
        }

        return false;
    });

    const slide = useSharedValue(maxHeight);

    const showDrawer = (feedback = true) => {
        feedback && Pandora.TriggerFeedback(Pandora.FeedbackType.Soft);
        
        slide.value = withTiming(0);
        setOpen(true);
        onOpen();
    }

    const hideDrawer = () => {
        slide.value = withTiming(maxHeight, {}, () => runOnJS(setDrawerClosed)());
    }

    const setDrawerClosed = () => {
        setOpen(false);
        onClose();
    }

    const panGesture = Gesture.Pan()
    .onUpdate(({ _, translationY }) => { if (translationY > 0) slide.value = translationY; })
    .onEnd(() => { (slide.value < maxHeight / 6) ? runOnJS(showDrawer)(false) : runOnJS(hideDrawer)() })

    return (
        open &&
        <React.Fragment>
            <TouchableOpacity testID={`drawersheet:close`} activeOpacity={0.4} onPress={() => hideDrawer()} style={styles.drawerBackground}/>
            <GestureDetector gesture={panGesture}>
                <Animated.View style={[styles.drawerSheet, fixedHeight && { height: maxHeight }, { paddingBottom: insets.bottom }, { transform: [{ translateY: slide }] }]}>
                    <View style={styles.drawerHeader}>
                        <View style={styles.drawerKnob}/>
                    </View>
                    <ScrollView testID={`drawersheet:scrollview`} showsVerticalScrollIndicator={false}>
                        { children }
                    </ScrollView>
		        </Animated.View>
            </GestureDetector>
        </React.Fragment>
	);
}

function DrawerSheetManager() {
    const drawerSheets = useDrawerSheetStore(state => state.drawerSheets);

    const openDrawerSheet = useDrawerSheetStore(state => state.openDrawerSheet);
    const closeDrawerSheet = useDrawerSheetStore(state => state.closeDrawerSheet);
    
    const currentRoute = useDrawerSheetStore(state => state.currentRoute);
    const previousRoute = useDrawerSheetStore(state => state.previousRoute);

    const [drawersOnCurrentRoute, setDrawersOnCurrentRoute] = useState({});

    useEffect(() => {
        Object.keys(drawerSheets).forEach((sheetname) => {
            const sheet = drawerSheets[sheetname];
            if (sheet.open) {
                setDrawersOnCurrentRoute({ ...drawersOnCurrentRoute, [previousRoute]: sheetname });
                closeDrawerSheet(sheetname);
            }

            if (sheetname === drawersOnCurrentRoute[currentRoute]) {
                openDrawerSheet(sheetname);
                setDrawersOnCurrentRoute({ ...drawersOnCurrentRoute, [currentRoute]: null });
            }
        });
    }, [currentRoute]);

    return (
        <React.Fragment>
            {
                Object.keys(drawerSheets).map((sheetname) => {
                    const sheet = drawerSheets[sheetname];
                    return (
                        <DrawerSheet key={sheetname} name={sheet.name} show={sheet.open} onOpen={sheet.onOpen} onClose={sheet.onClose} fixedHeight={sheet.fixedHeight}>
                            { sheet.children }
                        </DrawerSheet>
                    )
                })   
            }
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    drawerBackground: {
        position: 'absolute',

        top: 0,
        left: 0,

        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,

        backgroundColor: colors.Black,
        opacity: 0.4,
    },

    drawerSheet: {
        position: 'absolute',

        bottom: 0,
        left: 0,

        width: '100%',
        maxHeight: maxHeight,

        backgroundColor: colors.White,

        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,

        ...shadows.shadowHeavy,
    },

    drawerHeader: {
        width: '100%',

        justifyContent: 'center',
        alignItems: 'center',

        paddingVertical: 8,
        backgroundColor: colors.White,

        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },

    drawerKnob: {
        width: 32,
        height: 4,

        borderRadius: 2,

        backgroundColor: colors.Gray,
    },
});

export default DrawerSheet;
export { DrawerSheetManager, DrawerSheetObject };