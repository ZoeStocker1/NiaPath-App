import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";

// Register a modern font (Optional but recommended)
Font.register({
  family: "Helvetica",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica.ttf",
    },
    {
      src: "https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica-Bold.ttf",
      fontWeight: "bold",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: "#334155", // Slate 700
  },
  header: {
    marginBottom: 20,
    borderBottom: "2pt solid #3b82f6", // Bright Blue
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e3a8a", // Deep Blue
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 8,
    color: "#1e3a8a",
    textTransform: "uppercase",
  },
  highlightBox: {
    backgroundColor: "#eff6ff", // Light Blue
    padding: 15,
    borderRadius: 5,
    borderLeft: "4pt solid #3b82f6",
    marginVertical: 10,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 5,
  },
  paragraph: {
    lineHeight: 1.6,
    marginBottom: 10,
    textAlign: "justify",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 9,
    textAlign: "center",
    color: "#94a3b8",
    borderTop: "1pt solid #e2e8f0",
    paddingTop: 10,
  },
});

const CareerReport = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Career Strategy Report</Text>
          <Text style={{ color: "#64748b" }}>
            {/* Prepared for {data.user.full_name} */}
          </Text>
        </View>
        {/* If you have a logo URL: <Image src="/logo.png" style={{ width: 60 }} /> */}
      </View>

      {/* STUDENT PROFILE SUMMARY */}
      <View>
        <Text style={styles.sectionTitle}>Student Profile</Text>
        <Text style={styles.paragraph}>
          {data.report_content.user_description}
        </Text>
      </View>

      {/* TOP RECOMMENDATION BOX */}
      <View style={styles.highlightBox}>
        <Text style={{ fontSize: 10, color: "#3b82f6", fontWeight: "bold" }}>
          TOP RECOMMENDATION
        </Text>
        <Text style={styles.recommendationTitle}>
          {data.recommendation.title}
        </Text>
        <Text style={styles.paragraph}>
          {data.report_content.top_recommendation.details}
        </Text>
      </View>

      {/* WHY IT FITS */}
      <View>
        <Text style={styles.sectionTitle}>Strategic Alignment</Text>
        <Text style={styles.paragraph}>
          <Text style={{ fontWeight: "bold" }}>Interest Fit: </Text>
          {data.report_content.top_recommendation.fits.interest_fit}
        </Text>
        <Text style={styles.paragraph}>
          <Text style={{ fontWeight: "bold" }}>Industry Fit: </Text>
          {data.report_content.top_recommendation.fits.industry_fit}
        </Text>
        <Text style={styles.paragraph}>
          <Text style={{ fontWeight: "bold" }}>Subject Fit: </Text>
          {data.report_content.top_recommendation.fits.subject_fit}
        </Text>
      </View>

      {/* DEGREES */}
      <View>
        <Text style={styles.sectionTitle}>Education Pathways</Text>
        <Text style={styles.paragraph}>
          {data.report_content.recommended_degrees}
        </Text>
      </View>

      {/* FOOTER */}
      <Text
        style={styles.footer}
        render={({ pageNumber, totalPages }) =>
          `Confidential Career Guidance • Page ${pageNumber} of ${totalPages}`
        }
        fixed
      />
    </Page>
  </Document>
);

export default CareerReport;
