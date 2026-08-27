import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import { colors } from '../../theme/colors';
import { strings } from '../../constants/strings';
import { moderateScale } from '../../theme/Metrics';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const PlaceholderLogin = () => (
  <View style={styles.centerContainer}>
    <Text style={styles.text}>{strings.screens.loginTitle}</Text>
  </View>
);

const PlaceholderForgotPassword = () => (
  <View style={styles.centerContainer}>
    <Text style={styles.text}>{strings.screens.forgotPasswordTitle}</Text>
  </View>
);

export const AuthStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.black },
      }}
    >
      <Stack.Screen name="Login" component={PlaceholderLogin} />
      <Stack.Screen name="ForgotPassword" component={PlaceholderForgotPassword} />
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

export default AuthStack;

