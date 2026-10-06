import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#FAFAFA',
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 2,
    borderBottomColor: '#000000', // Changed to black to match the monochrome SaaS aesthetic
    paddingBottom: 20,
    marginBottom: 30,
  },
  brandName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  reportTitle: {
    fontSize: 12,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 4,
  },
  headerRight: {
    textAlign: 'right',
  },
  dateText: {
    fontSize: 10,
    color: '#94A3B8',
    marginBottom: 4,
  },
  scoreBadge: {
    backgroundColor: '#000000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 6,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    width: 120,
    fontSize: 10,
    color: '#64748B',
    fontWeight: 'bold',
  },
  value: {
    flex: 1,
    fontSize: 10,
    color: '#0F172A',
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tableHeaderCell: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#475569',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  tableCell: {
    fontSize: 10,
    color: '#334155',
  },
  col1: { width: '40%' },
  col2: { width: '25%' },
  col3: { width: '20%' },
  col4: { width: '15%', textAlign: 'right' },
  
  passText: { color: '#16A34A', fontWeight: 'bold' },
  failText: { color: '#DC2626', fontWeight: 'bold' },
  
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 8,
    color: '#94A3B8',
  },
});

export interface StudentResult {
  studentName: string;
  studentEmail: string;
  examName: string;
  dateTaken: string;
  score: number;
  maxScore: number;
  duration: string;
  questions: {
    id: string;
    title: string;
    difficulty: string;
    status: 'Passed' | 'Failed' | 'Partial';
    points: number;
  }[];
}

export const StudentResultReport = ({ result }: { result: StudentResult }) => {
  const percentage = Math.round((result.score / result.maxScore) * 100);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandName}>CodeSkill</Text>
            <Text style={styles.reportTitle}>Official Examination Report</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.dateText}>{result.dateTaken}</Text>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreText}>Score: {percentage}%</Text>
            </View>
          </View>
        </View>

        {/* Candidate Info */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Candidate Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{result.studentName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{result.studentEmail}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Assessment:</Text>
            <Text style={styles.value}>{result.examName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Duration:</Text>
            <Text style={styles.value}>{result.duration}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total Points:</Text>
            <Text style={styles.value}>{result.score} / {result.maxScore}</Text>
          </View>
        </View>

        {/* Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Breakdown</Text>
          
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader} wrap={false}>
              <Text style={[styles.tableHeaderCell, styles.col1]}>Question</Text>
              <Text style={[styles.tableHeaderCell, styles.col2]}>Difficulty</Text>
              <Text style={[styles.tableHeaderCell, styles.col3]}>Status</Text>
              <Text style={[styles.tableHeaderCell, styles.col4]}>Points</Text>
            </View>

            {/* Table Rows */}
            {result.questions.map((q, idx) => (
              <View key={q.id} style={[styles.tableRow, idx === result.questions.length - 1 ? { borderBottomWidth: 0 } : {}]} wrap={false}>
                <Text style={[styles.tableCell, styles.col1]}>{q.title}</Text>
                <Text style={[styles.tableCell, styles.col2]}>{q.difficulty}</Text>
                <Text style={[
                  styles.tableCell, 
                  styles.col3, 
                  q.status === 'Passed' ? styles.passText : (q.status === 'Failed' ? styles.failText : {})
                ]}>
                  {q.status}
                </Text>
                <Text style={[styles.tableCell, styles.col4]}>{q.points}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Generated by CodeSkill Automated Assessment System</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => (`Page ${pageNumber} of ${totalPages}`)} />
        </View>
      </Page>
    </Document>
  );
};
