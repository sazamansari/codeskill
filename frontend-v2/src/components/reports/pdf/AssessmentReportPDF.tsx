import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { styles } from './PDFStyles';
import { AssessmentReportData } from './types';

// PDF Components
const PDFHeader = ({ data }: { data: AssessmentReportData }) => (
  <View style={styles.headerBox} wrap={false}>
    <View style={styles.headerTopRow}>
      <Text style={styles.headerBrand}>CodeSkill</Text>
      <Text style={styles.headerInst}>{data.student.institution || 'Institution'}</Text>
    </View>
    
    <Text style={styles.headerTitle}>ASSESSMENT PERFORMANCE REPORT</Text>
    
    <View style={styles.headerDetails}>
      <Text style={styles.headerDetailText}>
        <Text style={styles.headerDetailLabel}>Student: </Text>
        {data.student.name}
      </Text>
      <Text style={styles.headerDetailText}>
        <Text style={styles.headerDetailLabel}>Assessment: </Text>
        {data.assessmentName || 'Assessment Report'}
      </Text>
    </View>
  </View>
);

const PDFStudentSummary = ({ student }: { student: AssessmentReportData['student'] }) => (
  <View style={styles.section} wrap={false}>
    <Text style={styles.sectionTitle}>Student Information</Text>
    <View style={styles.twoCol}>
      <View style={styles.col}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Student:</Text>
          <Text style={styles.infoValue}>{student.name || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{student.email || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Institution:</Text>
          <Text style={styles.infoValue}>{student.institution || 'N/A'}</Text>
        </View>
      </View>
      <View style={styles.col}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Role:</Text>
          <Text style={styles.infoValue}>{student.role || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Joined:</Text>
          <Text style={styles.infoValue}>{student.joinedAt || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Last Active:</Text>
          <Text style={styles.infoValue}>{student.lastActiveAt || 'N/A'}</Text>
        </View>
      </View>
    </View>
  </View>
);

const PDFPerformanceCards = ({ perf }: { perf: AssessmentReportData['performance'] }) => (
  <View style={styles.section} wrap={false}>
    <Text style={styles.sectionTitle}>Performance Overview</Text>
    <View style={styles.cardsGrid}>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Total Solved</Text>
        <Text style={styles.cardValue}>{perf.totalSolved ?? 0}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Assessment Score</Text>
        <Text style={styles.cardValue}>{perf.score ?? 0}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Acceptance Rate</Text>
        <Text style={styles.cardValue}>{perf.acceptanceRate ?? 0}%</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Current Streak</Text>
        <Text style={styles.cardValue}>{perf.streak ?? 0} days</Text>
      </View>
    </View>
  </View>
);

const PDFSubmissionTable = ({ subs }: { subs: AssessmentReportData['submissions'] }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Code Submission History</Text>
    <View style={styles.table}>
      <View style={styles.tableHeader} wrap={false}>
        <Text style={[styles.tableHeaderCell, styles.colId]}>#</Text>
        <Text style={[styles.tableHeaderCell, styles.colTitle]}>Problem</Text>
        <Text style={[styles.tableHeaderCell, styles.colLang]}>Language</Text>
        <Text style={[styles.tableHeaderCell, styles.colStatus]}>Status</Text>
        <Text style={[styles.tableHeaderCell, styles.colTime]}>Submitted At</Text>
      </View>
      {subs.length === 0 ? (
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>No submissions found.</Text>
        </View>
      ) : (
        subs.map((sub, idx) => (
          <View key={sub._id} style={[styles.tableRow, idx === subs.length - 1 ? { borderBottomWidth: 0 } : {}]} wrap={false}>
            <Text style={[styles.tableCell, styles.colId]}>{idx + 1}</Text>
            <Text style={[styles.tableCell, styles.colTitle]}>{sub.problemTitle || 'Unknown Problem'}</Text>
            <Text style={[styles.tableCell, styles.colLang]}>{sub.language}</Text>
            <Text style={[
              styles.tableCell,
              styles.colStatus,
              sub.status === 'Accepted' ? styles.statusAccepted : (sub.status === 'Pending' ? styles.statusPending : styles.statusError)
            ]}>
              {sub.status}
            </Text>
            <Text style={[styles.tableCell, styles.colTime]}>{sub.submittedAt}</Text>
          </View>
        ))
      )}
    </View>
  </View>
);

const PDFFooter = () => (
  <View style={styles.footer} fixed>
    <Text style={styles.footerText}>CodeSkill — Assessment Performance Report</Text>
    <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
  </View>
);

export const AssessmentReportPDF = ({ data }: { data: AssessmentReportData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <PDFHeader data={data} />
      <PDFStudentSummary student={data.student} />
      <PDFPerformanceCards perf={data.performance} />
      <PDFSubmissionTable subs={data.submissions} />
      <PDFFooter />
    </Page>
  </Document>
);
