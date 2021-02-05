import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const AuthNavigationForNot = ({ type, navigation }) => {
    return <View style={{ flex: 1 }}>
        <View style={styles.containerStyle}>
            <TouchableOpacity
                onPress={
                    () => {
                        navigation();
                    }
                }
            >
                <Text style={styles.linkStyle}>{type === 'signup' ? <Text>Already Signed In? Log In</Text> : <Text>Not Signed In? Sign Up</Text>}</Text>
            </TouchableOpacity>
        </View>
    </View>
}

const styles = StyleSheet.create(
    {
        containerStyle: {
            borderTopWidth: 0.5,
            marginTop: 10,
            borderTopColor: 'grey',
        },
        linkStyle: {
            color: 'blue',
            fontWeight: 'bold',
            textAlign: 'center',
            marginVertical: 10,
            fontSize: 18
        }
    }
)
export default AuthNavigationForNot;