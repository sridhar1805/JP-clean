import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  Alert,
  Share,
  Linking,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import TransactionItem from '../components/TransactionItem';

const LedgerDetailsScreen = ({ route, navigation }) => {
  const { ledger } = route.params;
  const { state, deleteTransaction } = useContext(AuthContext);
  const [currentLedger, setCurrentLedger] = useState(ledger);

  useEffect(() => {
    const updatedLedger = state.ledgers.find((l) => l.id === ledger.id);
    if (updatedLedger) {
      setCurrentLedger(updatedLedger);
    }
  }, [state.ledgers]);

  const transactions = currentLedger?.transactions || [];
  const totalCredit = transactions
    .filter((t) => t.type === 'CREDIT')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalDebit = transactions
    .filter((t) => t.type === 'DEBIT')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleDeleteTransaction = (transactionId) => {
    Alert.alert('Delete Transaction', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteTransaction(ledger.id, transactionId),
      },
    ]);
  };

  const handleShare = async () => {
    try {
      const message = `
Ledger: ${currentLedger.name}
Mobile: ${currentLedger.mobile}
Balance: ₹${currentLedger.currentBalance}
Credit: ₹${totalCredit}
Debit: ₹${totalDebit}

Managed by Just Perfect Solutionz
      `.trim();

      await Share.share({
        message,
        title: `${currentLedger.name} - Ledger`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share');
    }
  };

  const handleDownloadPDF = () => {
    Alert.alert(
      'Download PDF',
      'PDF download feature would be integrated with a backend service',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Ledger Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.ledgerHeader}>
            <View>
              <Text style={styles.ledgerName}>{currentLedger.name}</Text>
              <Text style={styles.ledgerMobile}>{currentLedger.mobile}</Text>
            </View>
            <Text style={styles.balance}>₹{currentLedger.currentBalance}</Text>
          </View>

          {currentLedger.notes && (
            <Text style={styles.notes}>Note: {currentLedger.notes}</Text>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.debitButton]}
            onPress={() =>
              navigation.navigate('AddTransaction', {
                ledgerId: ledger.id,
                type: 'DEBIT',
              })
            }
          >
            <Text style={styles.actionButtonText}>- Debit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.creditButton]}
            onPress={() =>
              navigation.navigate('AddTransaction', {
                ledgerId: ledger.id,
                type: 'CREDIT',
              })
            }
          >
            <Text style={styles.actionButtonText}>+ Credit</Text>
          </TouchableOpacity>
        </View>

        {/* Share & Download */}
        <View style={styles.shareSection}>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShare}
          >
            <Text style={styles.shareButtonText}>📤 Share</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.downloadButton}
            onPress={handleDownloadPDF}
          >
            <Text style={styles.downloadButtonText}>📥 Download PDF</Text>
          </TouchableOpacity>
        </View>

        {/* Transactions */}
        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>Transactions</Text>

          {transactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No transactions yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Add a debit or credit to get started
              </Text>
            </View>
          ) : (
            <FlatList
              data={[...transactions].reverse()}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TransactionItem
                  transaction={item}
                  onDelete={() => handleDeleteTransaction(item.id)}
                />
              )}
            />
          )}
        </View>

        {/* Summary */}
        {transactions.length > 0 && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Credit:</Text>
              <Text style={styles.creditText}>₹{totalCredit}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Debit:</Text>
              <Text style={styles.debitText}>₹{totalDebit}</Text>
            </View>
            <View style={[styles.summaryRow, styles.summaryRowBold]}>
              <Text style={styles.summaryLabelBold}>Balance:</Text>
              <Text
                style={[
                  styles.balanceText,
                  currentLedger.currentBalance < 0
                    ? styles.negativeBal
                    : styles.positiveBal,
                ]}
              >
                ₹{currentLedger.currentBalance}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  infoCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ledgerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ledgerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  ledgerMobile: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  balance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  notes: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  debitButton: {
    backgroundColor: '#FF6B6B',
  },
  creditButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  shareSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 10,
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  downloadButton: {
    flex: 1,
    backgroundColor: '#FF9800',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  transactionsSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
  },
  emptyStateSubtext: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 6,
  },
  summaryCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderTopWidth: 2,
    borderTopColor: '#e0e0e0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryRowBold: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginTop: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryLabelBold: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  creditText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  debitText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  balanceText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  positiveBal: {
    color: '#4CAF50',
  },
  negativeBal: {
    color: '#FF6B6B',
  },
});

export default LedgerDetailsScreen;