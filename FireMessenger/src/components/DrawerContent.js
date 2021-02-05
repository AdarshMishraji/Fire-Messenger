import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DrawerItem, DrawerContentScrollView } from '@react-navigation/drawer';
import { Drawer } from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialIcons';

const DrawerContent = (props) => {
    console.log(props)
    React.useLayoutEffect(
        () => {

        }
    )
    return <DrawerContentScrollView style={styles.MainStyle}>
        <View style={styles.drawerContent}>
            <View>
                <Icon name='perm-identity' size={100} color='white' />
            </View>
        </View>
        <Drawer.Section style={styles.drawerSection}>
            <DrawerItem label='Search' style={{ backgroundColor: 'white' }} onPress={() => { }} />
            <DrawerItem label='Account' style={{ backgroundColor: 'white' }} onPress={() => { }} />
        </Drawer.Section>
    </DrawerContentScrollView>
}

const styles = StyleSheet.create(
    {
        drawerContent: {
            flex: 1
        },
        drawerSection: {
            marginTop: 15
        }
    }
)

export default DrawerContent;