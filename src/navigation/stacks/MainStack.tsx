import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import DrawerNavigator from '../DrawerNavigator';
import ScanScreen from '../../screens/Scan/ScanScreen';
import { colors } from '../../theme/colors';
import { moderateScale } from '../../theme/Metrics';

const Stack = createNativeStackNavigator<RootStackParamList>();

const DetailsScreen = () => (
  <View style={styles.centerContainer}>
    <Text style={styles.text}>Details Screen</Text>
  </View>
);

export const MainStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.black },
      }}
    >
      <Stack.Screen name="Main" component={DrawerNavigator} />
      <Stack.Screen name="ScanScreen" component={ScanScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
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

export default MainStack;
