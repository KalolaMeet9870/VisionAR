import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import { styles } from '../ScanStyles';
import { colors } from '../../../theme/colors';
import { moderateScale } from '../../../theme/Metrics';

type TabType = 'scan' | 'search' | 'add' | 'feed' | 'you';

interface ScanBottomBarProps {
  activeTab: TabType;
  onTabSelect: (tab: TabType) => void;
}

export const ScanBottomBar: React.FC<ScanBottomBarProps> = ({
  activeTab,
  onTabSelect,
}) => {
  return (
    <View style={styles.bottomBarContainer}>
      {/* 1. Scan Tab */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabSelect('scan')}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.tabIconContainer,
            activeTab === 'scan' && styles.scanActiveFrame,
          ]}
        >
          <MaterialCommunityIcons
            name="crop-free"
            size={moderateScale(22)}
            color={
              activeTab === 'scan' ? colors.iconActive : colors.iconInactive
            }
          />
        </View>
        <Text
          style={[
            styles.tabLabel,
            activeTab === 'scan' && styles.activeTabLabel,
          ]}
        >
          Scan
        </Text>
      </TouchableOpacity>

      {/* 2. Search Tab */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabSelect('search')}
        activeOpacity={0.7}
      >
        <View style={styles.tabIconContainer}>
          <Ionicons
            name="search-outline"
            size={moderateScale(22)}
            color={
              activeTab === 'search' ? colors.iconActive : colors.iconInactive
            }
          />
        </View>
        <Text
          style={[
            styles.tabLabel,
            activeTab === 'search' && styles.activeTabLabel,
          ]}
        >
          Search
        </Text>
      </TouchableOpacity>

      {/* 3. Center Add (+) Tab */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabSelect('add')}
        activeOpacity={0.8}
      >
        <View style={styles.centerPlusButton}>
          <Ionicons
            name="add"
            size={moderateScale(26)}
            color={colors.white}
          />
        </View>
      </TouchableOpacity>

      {/* 4. Feed Tab */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabSelect('feed')}
        activeOpacity={0.7}
      >
        <View style={styles.tabIconContainer}>
          <Octicons
            name="device-camera-video"
            size={moderateScale(20)}
            color={
              activeTab === 'feed' ? colors.iconActive : colors.iconInactive
            }
          />
        </View>
        <Text
          style={[
            styles.tabLabel,
            activeTab === 'feed' && styles.activeTabLabel,
          ]}
        >
          Feed
        </Text>
      </TouchableOpacity>

      {/* 5. You (Profile) Tab */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabSelect('you')}
        activeOpacity={0.7}
      >
        <View style={styles.tabIconContainer}>
          <Ionicons
            name="person-circle-outline"
            size={moderateScale(24)}
            color={
              activeTab === 'you' ? colors.iconActive : colors.iconInactive
            }
          />
        </View>
        <Text
          style={[
            styles.tabLabel,
            activeTab === 'you' && styles.activeTabLabel,
          ]}
        >
          You
        </Text>
      </TouchableOpacity>
    </View>
  );
};
