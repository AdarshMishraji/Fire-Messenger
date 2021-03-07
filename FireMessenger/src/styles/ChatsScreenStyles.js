export const chatsScreenStyle = StyleSheet.create(
    {
        rootStyle: {
            flex: 1,
            justifyContent: 'space-between'

        },
        subRootStyle: {
            flex: 1,
            padding: 10
        },
        modalRootStyle: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.3)',
        },
        modalViewStyle: {
            padding: 15,
            borderWidth: 1,
            width: 350,
            backgroundColor: 'white',
            borderRadius: 20,
            height: 250
        },
        senderMessageStyle: {
            borderRadius: 10,
            backgroundColor: 'lightblue',
            color: 'black',
            alignSelf: 'flex-end',
            textAlign: 'right',
            padding: 5,
            margin: 10
        },
        recieverMessageStyle: {
            borderRadius: 10,
            backgroundColor: 'lightgreen',
            color: 'black',
            fontSize: 20,
            alignSelf: 'flex-start',
            padding: 5,
            margin: 10
        },
        inputWidget: {
            flexDirection: 'row',
            marginVertical: 10,
            marginStart: 10,
            justifyContent: 'space-between'
        },
        inputStyle: {
            height: 50,
            borderWidth: 1,
            borderRadius: 10,
            paddingStart: 10,
            fontSize: 20,
            marginRight: 10,
            flex: 1,
            borderColor: 'white',
            color: 'white'
        },
        sendButtonStyle: {
            borderRadius: 10,
            borderWidth: 1,
            padding: 10,
            marginHorizontal: 10,
            height: 50,
            width: 75,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: 'white',
        },
        seenAtStyle: {
            marginRight: 10,
            textAlign: 'right'
        },
        userImageStyle: {
            height: 40,
            width: 40,
            borderRadius: 30,
            backgroundColor: 'white'
        },
        senderMessageComponentStyle: {
            paddingLeft: 100,
            flexDirection: 'row',
            justifyContent: 'flex-end'
        },
        senderMessageTextStyle: {
            fontSize: 20,
            textAlign: 'right'
        },
        recieverMessageComponentStyle: {
            paddingRight: 100,
            flexDirection: 'row',
            justifyContent: 'flex-start'
        },
        tempHeaderStyle: {
            flexDirection: 'row',
            justifyContent: 'space-around'
        },
        additionButtonStylingForTempHeader: {
            marginHorizontal: 10,
            width: '40%'
        }
    }
);