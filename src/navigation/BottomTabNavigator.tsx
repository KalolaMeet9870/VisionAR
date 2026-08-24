import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import { BottomTabParamList } from './stacks/types';
import ScanScreen from '../screens/Scan/ScanScreen';
import FeedScreen from '../screens/Feed/FeedScreen';
import { colors } from '../theme/colors';
import { moderateScale, verticalScale } from '../theme/Metrics';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const SearchScreen = () => (
  <View style={styles.screenContainer}>
    <Text style={styles.screenText}>Search Screen</Text>
  </View>
);

const AddScreen = () => (
  <View style={styles.screenContainer}>
    <Text style={styles.screenText}>Add Content Screen</Text>
  </View>
);

const YouScreen = () => (
  <View style={styles.screenContainer}>
    <Text style={styles.screenText}>You / Account Screen</Text>
  </View>
);

export const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="Scan"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.iconActive,
        tabBarInactiveTintColor: colors.iconInactive,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          tabBarLabel: 'Scan',
          tabBarIcon: ({ focused, color }) => (
            <View style={[styles.iconWrapper, focused && styles.activeScanFrame]}>
              <MaterialCommunityIcons
                name="crop-free"
                size={moderateScale(22)}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="search-outline"
              size={moderateScale(22)}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: () => (
            <View style={styles.centerAddButton}>
              <Ionicons
                name="add"
                size={moderateScale(26)}
                color={colors.white}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarLabel: 'Feed',
          tabBarIcon: ({ color }) => (
            <Octicons
              name="device-camera-video"
              size={moderateScale(20)}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="You"
        component={YouScreen}
        options={{
          tabBarLabel: 'You',
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="person-circle-outline"
              size={moderateScale(24)}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.bottomBarBg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.gray.seven,
    height: Platform.OS === 'ios' ? verticalScale(84) : verticalScale(64),
    paddingBottom: Platform.OS === 'ios' ? verticalScale(24) : verticalScale(8),
    paddingTop: verticalScale(6),
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 0,
  },
  tabBarLabel: {
    fontSize: moderateScale(11),
    fontWeight: '500',
    marginTop: verticalScale(2),
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeScanFrame: {
    borderWidth: moderateScale(1.5),
    borderColor: colors.white,
    borderRadius: moderateScale(8),
    padding: moderateScale(2),
  },
  centerAddButton: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    borderWidth: moderateScale(1.5),
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(12),
  },
  screenContainer: {
    flex: 1,
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenText: {
    color: colors.white,
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
});

export default BottomTabNavigator;
