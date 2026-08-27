import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerParamList } from './stacks/types';
import BottomTabNavigator from './BottomTabNavigator';
import { colors } from '../theme/colors';
import { strings } from '../constants/strings';
import { moderateScale } from '../theme/Metrics';

const Drawer = createDrawerNavigator<DrawerParamList>();

const SettingsScreen = () => (
  <View style={styles.centerContainer}>
    <Text style={styles.text}>{strings.screens.settingsTitle}</Text>
  </View>
);

const AccountScreen = () => (
  <View style={styles.centerContainer}>
    <Text style={styles.text}>{strings.screens.accountTitle}</Text>
  </View>
);

export const DrawerNavigator: React.FC = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: colors.black,
        },
        drawerActiveTintColor: colors.white,
        drawerInactiveTintColor: colors.iconInactive,
      }}
    >
      <Drawer.Screen
        name="MainTabs"
        component={BottomTabNavigator}
        options={{ drawerLabel: strings.drawer.home }}
      />
      <Drawer.Screen
        name="Account"
        component={AccountScreen}
        options={{ drawerLabel: strings.drawer.account }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ drawerLabel: strings.drawer.settings }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: colors.white,
    fontSize: moderateScale(16),
  },
});

export default DrawerNavigator;

