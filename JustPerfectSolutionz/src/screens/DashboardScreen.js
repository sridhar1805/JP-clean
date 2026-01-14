import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import LedgerCard from '../components/LedgerCard';

const DashboardScreen = ({ navigation }) => {
  const { state, signOut, loadData } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalPeople: 0,
    totalCredit: 0,
    totalDebit: 0,
  });

  useFocusEffect(
    React.useCallback(() => {
      loadData();
      calculateStats();
    }, [])
  );

  const calculateStats = () => {
    const totalPeople = state.ledgers.length;
    let totalCredit = 0;
    let totalDebit = 0;

    state.ledgers.forEach((ledger) => {
      if (ledger.transactions) {
        ledger.transactions.forEach((txn) => {
          if (txn.type === 'CREDIT') {
            totalCredit += txn.amount;
          } else {
            totalDebit += txn.amount;
          }
        });
      }
    });

    setStats({ totalPeople, totalCredit, totalDebit });
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  };

  const handleDeleteLedger = (ledgerId) => {
    Alert.alert('Delete Ledger', 'Are you sure you want to delete this ledger?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          // Handle delete
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello! 👋</Text>
          <Text style={styles.userName}>Welcome back</Text>
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Stats Section */}
        <View style={styles.statsSection}>
          <StatCard
            title="Total People"
            value={stats.totalPeople.toString()}
            icon="👥"
            color="#4CAF50"
          />
          <StatCard
            title="Total Credit"
            value={`₹${stats.totalCredit}`}
            icon="📈"
            color="#2196F3"
          />
          <StatCard
            title="Total Debit"
            value={`₹${stats.totalDebit}`}
            icon="📉"
            color="#FF6B6B"
          />
        </View>

        {/* Add Ledger Button */}
        <TouchableOpacity
          style={styles.addLedgerButton}
          onPress={() => navigation.navigate('AddLedger')}
        >
          <Text style={styles.addLedgerButtonText}>+ Add Ledger</Text>
        </TouchableOpacity>

        {/* Ledgers List */}
        <View style={styles.ledgersSection}>
          <Text style={styles.sectionTitle}>Your Ledgers</Text>
          {state.ledgers.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No ledgers yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Create your first ledger to get started
              </Text>
            </View>
          ) : (
            <FlatList
              data={state.ledgers}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('LedgerDetails', { ledger: item })
                  }
                >
                  <LedgerCard
                    ledger={item}
                    onDelete={() => handleDeleteLedger(item.id)}
                  />
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0066cc',
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  addLedgerButton: {
    backgroundColor: '#0066cc',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  addLedgerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  ledgersSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '600',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
  },
});

export default DashboardScreen;