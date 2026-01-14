import React, { useContext, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/stack';

import { AuthContext, AuthProvider } from '../context/AuthContext';
import AuthStack from '../screens/AuthStack';
import DashboardScreen from '../screens/DashboardScreen';
import LedgerDetailsScreen from '../screens/LedgerDetailsScreen';
import AddLedgerScreen from '../screens/AddLedgerScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';

const Stack = createNativeStackNavigator();

const AppStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#0066cc',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen
      name="Dashboard"
      component={DashboardScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="LedgerDetails"
      component={LedgerDetailsScreen}
      options={({ route }) => ({
        title: route.params?.ledger?.name || 'Ledger',
      })}
    />
    <Stack.Screen
      name="AddLedger"
      component={AddLedgerScreen}
      options={{ title: 'Add Ledger' }}
    />
    <Stack.Screen
      name="AddTransaction"
      component={AddTransactionScreen}
      options={({ route }) => ({
        title: `Add ${route.params?.type === 'DEBIT' ? 'Debit' : 'Credit'}`,
      })}
    />
  </Stack.Navigator>
);

const RootNavigator = () => {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            isLoading: false,
            isSignedIn: !!action.payload,
            userToken: action.payload,
          };
        default:
          return prevState;
      }
    },
    {
      isLoading: true,
      isSignedIn: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        dispatch({ type: 'RESTORE_TOKEN', payload: userToken });
      } catch (error) {
        console.error('Failed to restore token: - RootNavigator.js:80', error);
      }
    };

    bootstrapAsync();
  }, []);

  if (state.isLoading) {
    return null;
  }

  return (
    <AuthProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {state.isSignedIn ? (
          <Stack.Screen name="App" component={AppStack} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </AuthProvider>
  );
};

export default RootNavigator;