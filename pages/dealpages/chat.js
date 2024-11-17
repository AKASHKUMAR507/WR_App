import React, { useState, useEffect, createRef, useRef, useContext } from 'react';
import { View, Text, StyleSheet, Platform, Image, DeviceEventEmitter, ActivityIndicator, TouchableOpacity, ScrollView, LayoutAnimation } from 'react-native';
import fontSizes from '../../styles/fonts';
import colors from '../../styles/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GetMessages } from '../../network/models/chat';
import { useUserStore } from '../../stores/stores';
import Chronos from '../../utilities/chronos';
import ChatBottomBar from '../../components/chat_screen/chatbottombar';
import DealManagerHeader from '../../components/chat_screen/chatheader';
import ChatBubble, { DateBubble, ProvisionChatBubble, messageType, senderType } from '../../components/chat_screen/chatbubble';
import useCurrentDeal from '../../hooks/currentdeal';
import Animated from 'react-native-reanimated';
import { Alert, AlertBoxContext } from '../../components/alertbox';

function PopulateDateMessages(messages) {
    const chronos = new Chronos();
    const newMessagesArray = [];
    const dateMessagesIndices = [];

    for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        const previousMessage = messages[i - 1];

        if (i === 0) {
            dateMessagesIndices.push(i);

            newMessagesArray.push({ type: messageType.Date, date: message.timestamp });
            newMessagesArray.push(message);
            continue;
        }

        if (chronos.IsSameDay(message.timestamp, previousMessage.timestamp)) {
            newMessagesArray.push(message);
            continue;
        }

        dateMessagesIndices.push(i + dateMessagesIndices.length);

        newMessagesArray.push({ type: messageType.Date, date: message.timestamp });
        newMessagesArray.push(message);
    }

    return [newMessagesArray, dateMessagesIndices];
}

function ChatPage() {
    const insets = useSafeAreaInsets();
    const scrollViewRef = createRef();

    const user = useUserStore(state => state.user);

    const [currentDeal] = useCurrentDeal();

    const [chatId, setChatId] = useState('');

    const [messages, setMessages] = useState();
    const [dateMessagesIndices, setDateMessagesIndices] = useState([]);

    const [provisionalMessages, setProvisionalMessages] = useState([]);

    const createAlert = useContext(AlertBoxContext);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const messages = await GetMessages(currentDeal.id);
            setMessagesFromMessagesResponse(messages);
        }
        catch (error) {
            createAlert(Alert.Error(error.message));
        }
    }

    const setMessagesFromMessagesResponse = (messages) => {
        setChatId(messages[0]?.chatId || '');

        const normalisedMessages = [];

        messages.map((message) => {
            const normalisedMessage = {
                id: message.id,
                timestamp: message.createddate,
            }

            if (message.fileid) {
                normalisedMessage.fileid = message.fileid;
                normalisedMessage.fileName = message.messages;
                normalisedMessage.type = getFileTypeFromFilename(message.messages);
            }
            else {
                normalisedMessage.text = message.messages;
                normalisedMessage.type = messageType.Text;
            }

            normalisedMessage.sender = (message.senderid == user.associateid ? senderType.Self : senderType.Other);
            normalisedMessages.push(normalisedMessage);
        });

        const sortedMessages = Chronos.SortObjectsByDate(normalisedMessages, 'createddate', false);
        const [populatedMessages, dateMessagesIndices] = PopulateDateMessages(sortedMessages);

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setMessages(populatedMessages);
        setDateMessagesIndices(dateMessagesIndices);
    }

    const onSend = (messageContent, messagetype = messageType.Text) => {
        const provisionalMessage = {
            type: messagetype,
            provisional: true,
        }

        if (messagetype === messageType.Text) {
            provisionalMessage.text = messageContent;
        }

        if (messagetype === messageType.Image || messagetype === messageType.File) {
            provisionalMessage.fileName = messageContent.name;
            provisionalMessage.filePath = messageContent.uri;
            provisionalMessage.fileSize = messageContent.size;
            provisionalMessage.fileType = messageContent.type;
            provisionalMessage.fileCopyURI = messageContent.fileCopyUri;
        }

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setProvisionalMessages((provisionalMessages) => [...provisionalMessages, provisionalMessage]);
    }

    const onProvisionalMessageSuccess = (messageIndex) => {
        setProvisionalMessages((provisionalMessages) => provisionalMessages.filter((_, index) => index !== messageIndex));
        fetchMessages();
    }

    const getFileTypeFromFilename = (filename) => {
        const extension = filename.split('.').pop();
        const imageExtensions = ['png', 'jpg', 'jpeg'];

        return imageExtensions.includes(extension) ? messageType.Image : messageType.File;
    }

    if (!messages) {
        return (
            <View style={styles.centerContentContainer}>
                <ActivityIndicator color={colors.DarkGray}/>
            </View>
        )
    }

    return (
        <View style={[styles.page, { paddingBottom: insets.bottom }]}>
            <DealManagerHeader name={currentDeal.dealmanager.name}/>
            <Animated.ScrollView 
                ref={scrollViewRef} 
                onLayout={() => scrollViewRef.current?.scrollToEnd({ animated: false })} 
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })} 
                automaticallyAdjustKeyboardInsets 
                contentContainerStyle={styles.chat}
                showsVerticalScrollIndicator={false}
                scrollToOverflowEnabled
                stickyHeaderIndices={dateMessagesIndices}
            >
                { 
                    messages.map((message) => 
                        message.type === messageType.Date ?
                        <DateBubble key={message.date} date={message.date}/> :
                        <ChatBubble type={message.type} sender={message.sender} key={message.id} message={message}/>
                    ) 
                }
                { provisionalMessages.map((message, index) => <ProvisionChatBubble chatId={chatId} type={message.type} key={index} message={message} onSuccess={() => onProvisionalMessageSuccess(index)}/>) }
            </Animated.ScrollView>
            <ChatBottomBar onSend={onSend}/>
        </View>
    )
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: colors.LightGray,
    },

    centerContentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    chat: {
        paddingTop: 16,
        backgroundColor: colors.LightGray,
    },
});

export default ChatPage;