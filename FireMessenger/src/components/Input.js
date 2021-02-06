import React, { useContext, useState } from 'react';
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Context as ThemeContext } from '../contexts/ThemeContext';

const Input = ({ label, value, onChangeTextCallback, type, style }) => {

    const [isFocused, setIsFocused] = useState(false);
    const { state } = useContext(ThemeContext);

    return <View style={{
        ...styles.rootStyle, ...style,
        borderColor: isFocused ? 'green' : 'blue'
    }}>
        {label ? <Text style={{
            marginStart: 5, color: state.theme == 'dark' ? 'white' : 'black',
        }}>{label}</Text> : null}
        <TextInput
            value={value}
            onChangeText={
                (newValue) => {
                    onChangeTextCallback(newValue);
                }
            }
            onFocus={
                () => {
                    setIsFocused(true);
                }
            }
            onBlur={
                () => {
                    setIsFocused(false);
                }
            }
            style={{
                ...styles.inputStyle,
                color: state.theme == 'dark' ? 'white' : 'black',
                borderBottomColor: isFocused ? 'green' : null
            }}
            secureTextEntry={type && type === 'password' ? true : false}
            keyboardType={type && type === 'phoneNumber' ? 'phone-pad' : 'default'}
            autoCapitalize='none'
            autoCorrect={false}
        />
    </View>
}

const styles = StyleSheet.create(
    {
        inputStyle: {
            // borderWidth: 1.5,
            height: 45,
            width: '93%',
            fontSize: 20,
            marginStart: 10,
        },
        rootStyle: {
            height: 80,
            padding: 5,
            marginTop: 10,
            borderWidth: 1.5,
            borderRadius: 10,
        }
    }
)

export default Input;