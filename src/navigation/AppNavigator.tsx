import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { navigationRef } from './RootNavigationRef';
import MainStack from './stacks/MainStack';
import { colors } from '../theme/colors';

const CustomTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: colors.black,
    card: colors.bottomBarBg,
    text: colors.white,
    border: colors.gray.seven,
    notification: colors.red,
  },
};

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer ref={navigationRef} theme={CustomTheme}>
      <MainStack />
    </NavigationContainer>
  );
};

export default AppNavigator;
