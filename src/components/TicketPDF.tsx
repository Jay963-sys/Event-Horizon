import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { format } from "date-fns";

const styles = StyleSheet.create({
  page: { flexDirection: "row", backgroundColor: "#FFFFFF" },
  section: { margin: 10, padding: 10, flexGrow: 1 },
  ticketContainer: {
    margin: 20,
    flexDirection: "row",
    border: "1pt solid #e2e8f0",
    borderRadius: 10,
    height: 200,
  },
  leftSide: {
    width: "70%",
    padding: 20,
    borderRight: "2pt dashed #94a3b8",
    justifyContent: "space-between",
  },
  rightSide: {
    width: "30%",
    backgroundColor: "#0f172a",
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  title: { fontSize: 24, fontWeight: "heavy", textTransform: "uppercase" },
  subTitle: {
    fontSize: 10,
    color: "#64748b",
    marginTop: 4,
    textTransform: "uppercase",
  },
  rowLabel: { fontSize: 10, color: "#94a3b8", textTransform: "uppercase" },
  seatNumber: { fontSize: 35, fontWeight: "bold" },
  infoItem: { fontSize: 10, color: "#334155" },
  idText: { fontSize: 8, color: "#64748b", marginTop: 10 },
});

// Helper: Handle nulls gracefully
function getRowLabel(index: number | null) {
  if (index === null) return "GA";
  return String.fromCharCode(65 + index);
}

function getColLabel(index: number | null) {
  if (index === null) return "-";
  return index + 1;
}

// Update Interface to allow nulls
interface TicketData {
  id: string;
  eventName: string;
  date: Date;
  location: string;
  row: number | null; // 👈 Allow null
  col: number | null; // 👈 Allow null
  userName: string | null;
}

export const TicketDocument = ({ ticket }: { ticket: TicketData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.ticketContainer}>
        {/* Left Side */}
        <View style={styles.leftSide}>
          <View>
            <Text style={styles.title}>{ticket.eventName}</Text>
            <Text style={styles.subTitle}>
              {ticket.row === null ? "General Admission" : "Reserved Seating"} •
              Present at Entry
            </Text>
          </View>

          <View style={{ gap: 5 }}>
            <Text style={styles.infoItem}>
              📅 {format(ticket.date, "EEEE, MMMM do, yyyy")}
            </Text>
            <Text style={styles.infoItem}>📍 {ticket.location}</Text>
            <Text style={styles.infoItem}>👤 {ticket.userName || "Guest"}</Text>
          </View>

          <Text style={styles.idText}>ID: {ticket.id}</Text>
        </View>

        {/* Right Side */}
        <View style={styles.rightSide}>
          <View style={{ alignItems: "center", marginBottom: 10 }}>
            <Text style={styles.rowLabel}>Row</Text>
            <Text style={styles.seatNumber}>{getRowLabel(ticket.row)}</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.rowLabel}>Seat</Text>
            <Text style={styles.seatNumber}>{getColLabel(ticket.col)}</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);
