import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';

const ErrorMsg = ({ text, clearError }) => {

    return <Modal
        transparent={true}
        visible={text != undefined}
        onRequestClose={() => clearError(undefined)}
    >
        <View
            style={styles.rootStyle}
        >
            <View
                style={styles.subrootStyle}
            >
                <Text style={styles.textStyle}>{text}</Text>
            </View>

        </View>
    </Modal>
}

const styles = StyleSheet.create(
    {
        rootStyle: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.7)',
            alignItems: 'center',
            justifyContent: 'flex-end'
        },
        subrootStyle: {
            backgroundColor: 'rgba(99,99,102, 0.8)',
            height: 60,
            width: 300,
            borderRadius: 20,
            marginBottom: 50,
            alignItems: 'center',
            justifyContent: 'center'
        },
        textStyle: {
            fontSize: 20,
            color: 'white'
        }
    }
)

// export default ErrorMsg;
export { ErrorMsg };