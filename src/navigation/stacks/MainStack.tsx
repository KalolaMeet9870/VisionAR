import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import DrawerNavigator from '../DrawerNavigator';
import ScanScreen from '../../screens/Scan/ScanScreen';
import DetailsScreen from '../../screens/Details/DetailsScreen';
import ArtistProfileScreen from '../../screens/ArtistProfile/ArtistProfileScreen';
import { colors } from '../../theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();


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
      <Stack.Screen name="ArtistProfile" component={ArtistProfileScreen} />
    </Stack.Navigator>
  );
};




export default MainStack;


