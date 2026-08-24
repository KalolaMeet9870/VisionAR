import { NavigatorScreenParams } from '@react-navigation/native';

export type BottomTabParamList = {
  Scan: undefined;
  Search: undefined;
  Add: undefined;
  Feed: undefined;
  You: undefined;
};

export type DrawerParamList = {
  MainTabs: NavigatorScreenParams<BottomTabParamList>;
  Account: undefined;
  Settings: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<DrawerParamList>;
  ScanScreen: undefined;
  Details: { id: string };
};
