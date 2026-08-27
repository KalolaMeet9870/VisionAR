import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import { BottomTabParamList } from './stacks/types';
import ScanScreen from '../screens/Scan/ScanScreen';
import FeedScreen from '../screens/Feed/FeedScreen';
import { colors } from '../theme/colors';
import { strings } from '../constants/strings';
import { moderateScale, verticalScale } from '../theme/Metrics';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const SearchScreen = () => (
  <View style={styles.screenContainer}>
    <Text style={styles.screenText}>{strings.screens.searchTitle}</Text>
  </View>
);

const AddScreen = () => (
  <View style={styles.screenContainer}>
    <Text style={styles.screenText}>{strings.screens.addTitle}</Text>
  </View>
);

const YouScreen = () => (
  <View style={styles.screenContainer}>
    <Text style={styles.screenText}>{strings.screens.accountTitle}</Text>
  </View>
);

/**
 * Custom Floating Bottom Tab Bar Component with Elevated Curved Center Button
 */
const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const addRouteIndex = state.routes.findIndex(r => r.name === 'Add');
  const addRoute = addRouteIndex !== -1 ? state.routes[addRouteIndex] : state.routes[2];
  const addOptions = addRoute ? descriptors[addRoute.key]?.options : null;
  const isAddFocused = addRouteIndex !== -1 ? state.index === addRouteIndex : state.index === 2;

  const onAddPress = () => {
    if (!addRoute) return;
    const event = navigation.emit({
      type: 'tabPress',
      target: addRoute.key,
      canPreventDefault: true,
    });

    if (!isAddFocused && !event.defaultPrevented) {
      navigation.navigate(addRoute.name);
    }
  };

  return (
    <View style={styles.tabBarContainer}>
      {/* 1. Curved Notch Dome Background */}
      <View style={styles.notchDome} />

      {/* 2. Main Tab Bar Row */}
      <View style={styles.tabBarRow}>
        {state.routes.map((route, index) => {
          // Leave middle slot empty for center button overlay
          if (index === 2) {
            return <View key={route.key} style={styles.centerSpacer} />;
          }

          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const label =
            options.tabBarLabel !== undefined
              ? (options.tabBarLabel as string)
              : options.title !== undefined
                ? options.title
                : route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              activeOpacity={0.7}
              onPress={onPress}
              style={styles.tabItem}
            >
              {options.tabBarIcon &&
                options.tabBarIcon({
                  focused: isFocused,
                  color: isFocused ? colors.iconActive : colors.iconInactive,
                  size: moderateScale(22),
                })}
              <Text
                style={[
                  styles.tabLabel,
                  { color: isFocused ? colors.iconActive : colors.iconInactive },
                  isFocused && styles.activeTabLabel,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 3. Center Button & Label Overlay */}
      <View pointerEvents="box-none" style={styles.centerButtonOverlay}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onAddPress}
          style={[
            styles.centerAddButton,
            isAddFocused && styles.centerAddButtonActive,
          ]}
        >
          <Ionicons
            name="add"
            size={moderateScale(28)}
            color={isAddFocused ? colors.white : colors.iconInactive}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.tabLabel,
            { color: isAddFocused ? colors.iconActive : colors.iconInactive },
            isAddFocused && styles.activeTabLabel,
          ]}
        >
          {(addOptions?.tabBarLabel as string) || strings.tabs.add}
        </Text>
      </View>
    </View>
  );
};

export const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="Scan"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          tabBarLabel: strings.tabs.scan,
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
          tabBarLabel: strings.tabs.search,
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'search' : 'search-outline'}
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
          tabBarLabel: strings.tabs.add,
        }}
      />
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarLabel: strings.tabs.feed,
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
          tabBarLabel: strings.tabs.you,
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'person-circle' : 'person-circle-outline'}
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
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  notchDome: {
    position: 'absolute',
    top: -verticalScale(24),
    width: moderateScale(70),
    height: moderateScale(70),
    borderRadius: moderateScale(35),
    backgroundColor: colors.bottomBarBg,
    // borderWidth: 1,
    borderColor: colors.tabBarBorder,
    borderBottomWidth: 0,
    zIndex: 1,
  },
  tabBarRow: {
    flexDirection: 'row',
    width: '100%',
    height: Platform.OS === 'ios' ? verticalScale(74) : verticalScale(60),
    backgroundColor: colors.bottomBarBg,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: moderateScale(6),
    paddingBottom: Platform.OS === 'ios' ? verticalScale(16) : verticalScale(4),
    // borderTopWidth: 1,
    borderTopColor: colors.tabBarBorder,
    zIndex: 2,
  },
  centerSpacer: {
    flex: 1,
  },
  centerButtonOverlay: {
    position: 'absolute',
    top: -verticalScale(20),
    bottom: Platform.OS === 'ios' ? verticalScale(16) : verticalScale(4),
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 10,
  },
  centerAddButton: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    backgroundColor: colors.centerButtonBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.centerButtonBorder,
  },
  centerAddButtonActive: {
    backgroundColor: colors.centerButtonActiveBg,
    borderColor: colors.centerButtonActiveBorder,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: verticalScale(2),
  },
  tabLabel: {
    fontSize: moderateScale(10),
    fontWeight: '500',
    marginTop: verticalScale(3),
    color: colors.iconInactive,
  },
  activeTabLabel: {
    color: colors.iconActive,
    fontWeight: '600',
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






