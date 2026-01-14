import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { validateMobile } from '../utils/validators';

const AddLedgerScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { addLedger } = useContext(AuthContext);

  const handleAddLedger = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter ledger name');
      return;
    }

    if (mobile && !validateMobile(mobile)) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      await addLedger({
        name,
        mobile,
        notes,
      });
      Alert.alert('Success', 'Ledger created successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create ledger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formSection}>
            <Text style={styles.label}>Ledger Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Raju Stores, John's Account"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
              editable={!loading}
            />

            <Text style={styles.label}>Mobile Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter 10-digit number (optional)"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              maxLength={10}
              value={mobile}
              onChangeText={setMobile}
              editable={!loading}
            />

            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Add any notes about this ledger (optional)"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              value={notes}
              onChangeText={setNotes}
              editable={!loading}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[styles.createButton, loading && styles.disabledButton]}
              onPress={handleAddLedger}
              disabled={loading}
            >
              <Text style={styles.createButtonText}>
                {loading ? 'Creating...' : 'Create Ledger'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  formSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fafafa',
    color: '#333',
  },
  textarea: {
    height: 100,
    paddingTop: 12,
  },
  createButton: {
    backgroundColor: '#0066cc',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default AddLedgerScreen;