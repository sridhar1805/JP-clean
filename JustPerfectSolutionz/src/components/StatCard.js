import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatCard = ({ title, value, icon, color }) => {
  return (
    <View style={[styles.card, { borderTopColor: color }]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderTopWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    alignItems: 'center',
  },
  icon: {
    fontSize: 28,
    marginBottom: 8,
  },
  title: {
    fontSize: 11,
    color: '#999',
    marginBottom: 4,
    textAlign: 'center',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default StatCard;