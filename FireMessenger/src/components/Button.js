import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, ActivityIndicator } from 'react-native';

const Button = ({ label, onPressCallback, loading, additionStyling, visible }) => {
    if (loading) {
        return <View style={styles.buttonStyle}>
            <ActivityIndicator size='large' collapsable={true} color='white' />
        </View>
    }
    else {
        return <TouchableOpacity
            onPress={
                () => {
                    onPressCallback();
                }
            }
            disabled={!visible}
            style={{ ...styles.buttonStyle, ...additionStyling, backgroundColor: visible ? 'rgba(64, 93, 230, 1)' : 'rgba(64, 93, 230, 0.5)' }}
        >
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>{label}</Text>
        </TouchableOpacity>
    }
}

const styles = StyleSheet.create(
    {
        buttonStyle: {
            width: '100%',
            backgroundColor: '#405DE6',
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
            marginVertical: 10,
        },
    }
)

export default Button;