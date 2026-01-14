import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const LedgerCard = ({ ledger, onDelete }) => {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.name}>{ledger.name}</Text>
        <Text style={styles.mobile}>{ledger.mobile || 'No phone'}</Text>
        <Text style={styles.transactionCount}>
          {ledger.transactions?.length || 0} transactions
        </Text>
      </View>
      <View style={styles.actions}>
        <Text
          style={[
            styles.balance,
            ledger.currentBalance < 0
              ? styles.negativeBalance
              : styles.positiveBalance,
          ]}
        >
          ₹{Math.abs(ledger.currentBalance)}
        </Text>
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.deleteButtonText}>×</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  mobile: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  transactionCount: {
    fontSize: 11,
    color: '#ccc',
  },
  actions: {
    alignItems: 'flex-end',
  },
  balance: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  positiveBalance: {
    color: '#4CAF50',
  },
  negativeBalance: {
    color: '#FF6B6B',
  },
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ff6b6b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LedgerCard;