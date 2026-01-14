import React, { createContext, useReducer, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

const initialState = {
  isSignedIn: false,
  user: null,
  ledgers: [],
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isSignedIn: true,
        user: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isSignedIn: false,
        user: null,
        ledgers: [],
      };
    case 'ADD_LEDGER':
      return {
        ...state,
        ledgers: [...state.ledgers, action.payload],
      };
    case 'UPDATE_LEDGER':
      return {
        ...state,
        ledgers: state.ledgers.map((ledger) =>
          ledger.id === action.payload.id ? action.payload : ledger
        ),
      };
    case 'DELETE_LEDGER':
      return {
        ...state,
        ledgers: state.ledgers.filter((ledger) => ledger.id !== action.payload),
      };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        ledgers: state.ledgers.map((ledger) =>
          ledger.id === action.payload.ledgerId
            ? {
                ...ledger,
                transactions: [...(ledger.transactions || []), action.payload.transaction],
                currentBalance: action.payload.newBalance,
              }
            : ledger
        ),
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        ledgers: state.ledgers.map((ledger) =>
          ledger.id === action.payload.ledgerId
            ? {
                ...ledger,
                transactions: ledger.transactions.filter(
                  (txn) => txn.id !== action.payload.transactionId
                ),
                currentBalance: action.payload.newBalance,
              }
            : ledger
        ),
      };
    case 'LOAD_DATA':
      return action.payload;
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const authContext = {
    signIn: useCallback(async (credentials) => {
      try {
        // Simple validation - in real app, this would call backend
        if (credentials.mobile && credentials.password) {
          const userData = {
            id: Date.now().toString(),
            name: 'User',
            mobile: credentials.mobile,
          };
          
          await AsyncStorage.setItem('userToken', JSON.stringify(userData));
          await AsyncStorage.setItem('appData', JSON.stringify(initialState));
          
          dispatch({
            type: 'LOGIN',
            payload: userData,
          });
          return true;
        }
        return false;
      } catch (error) {
        console.error('Login error:', error);
        return false;
      }
    }, []),

    signUp: useCallback(async (credentials) => {
      try {
        if (credentials.mobile && credentials.password && credentials.name) {
          const userData = {
            id: Date.now().toString(),
            name: credentials.name,
            mobile: credentials.mobile,
          };
          
          await AsyncStorage.setItem('userToken', JSON.stringify(userData));
          await AsyncStorage.setItem('appData', JSON.stringify(initialState));
          
          dispatch({
            type: 'LOGIN',
            payload: userData,
          });
          return true;
        }
        return false;
      } catch (error) {
        console.error('Signup error:', error);
        return false;
      }
    }, []),

    signOut: useCallback(async () => {
      try {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('appData');
        dispatch({ type: 'LOGOUT' });
        return true;
      } catch (error) {
        console.error('Logout error:', error);
        return false;
      }
    }, []),

    addLedger: useCallback(async (ledger) => {
      const newLedger = {
        ...ledger,
        id: Date.now().toString(),
        currentBalance: 0,
        transactions: [],
        createdAt: new Date().toISOString(),
      };
      
      dispatch({ type: 'ADD_LEDGER', payload: newLedger });
      await saveAppData(state);
      return newLedger;
    }, [state]),

    updateLedger: useCallback(async (ledger) => {
      dispatch({ type: 'UPDATE_LEDGER', payload: ledger });
      await saveAppData(state);
    }, [state]),

    deleteLedger: useCallback(async (ledgerId) => {
      dispatch({ type: 'DELETE_LEDGER', payload: ledgerId });
      await saveAppData(state);
    }, [state]),

    addTransaction: useCallback(async (ledgerId, transaction) => {
      const ledger = state.ledgers.find((l) => l.id === ledgerId);
      if (!ledger) return;

      const newTransaction = {
        ...transaction,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      const previousBalance = ledger.currentBalance || 0;
      const newBalance = transaction.type === 'CREDIT'
        ? previousBalance + transaction.amount
        : previousBalance - transaction.amount;

      dispatch({
        type: 'ADD_TRANSACTION',
        payload: {
          ledgerId,
          transaction: newTransaction,
          newBalance,
        },
      });

      await saveAppData(state);
    }, [state]),

    deleteTransaction: useCallback(async (ledgerId, transactionId) => {
      const ledger = state.ledgers.find((l) => l.id === ledgerId);
      if (!ledger) return;

      const transaction = ledger.transactions.find((t) => t.id === transactionId);
      if (!transaction) return;

      const previousBalance = ledger.currentBalance || 0;
      const newBalance = transaction.type === 'CREDIT'
        ? previousBalance - transaction.amount
        : previousBalance + transaction.amount;

      dispatch({
        type: 'DELETE_TRANSACTION',
        payload: {
          ledgerId,
          transactionId,
          newBalance,
        },
      });

      await saveAppData(state);
    }, [state]),

    loadData: useCallback(async () => {
      try {
        const data = await AsyncStorage.getItem('appData');
        if (data) {
          dispatch({ type: 'LOAD_DATA', payload: JSON.parse(data) });
        }
      } catch (error) {
        console.error('Load data error:', error);
      }
    }, []),
  };

  const saveAppData = async (currentState) => {
    try {
      await AsyncStorage.setItem('appData', JSON.stringify(currentState));
    } catch (error) {
      console.error('Save data error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ state, ...authContext }}>
      {children}
    </AuthContext.Provider>
  );
};