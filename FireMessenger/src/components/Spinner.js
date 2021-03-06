import React from 'react';
import { Modal, ActivityIndicator, View, StyleSheet } from 'react-native';

const Spinner = ({ isVisible }) => {
    return <Modal
        visible={isVisible}
        transparent={true}
        presentationStyle='overFullScreen'
    >
        <View style={styles.rootStyle}>
            <View style={styles.modalStyle}>
                    <ActivityIndicator size='large' color='blue' style={{ height: 100, width: 100 }} />
            </View>
        </View>
    </Modal>
}

const styles = StyleSheet.create(
    {
        modalStyle: {
            backgroundColor: 'white',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            width: 100,
            borderWidth: 1,
            borderRadius: 20,
            height: 100,
        },
        rootStyle: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.7)',
            alignItems: 'center',
            justifyContent: 'center'
        }
    }
)

// export default Spinner;
export { Spinner };