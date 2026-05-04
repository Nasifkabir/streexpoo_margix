"use client";

import { Download } from "lucide-react";

type ReportData = {
  totalRevenue: number;
  totalProducts: number;
  outOfStock: number;
  revenueByDate: { name: string; revenue: number }[];
  categorySales: { name: string; value: number }[];
  latestProducts: any[];
};

export default function PDFReportButton({ data }: { data: ReportData }) {
  const handleDownload = async () => {
    try {
      // Dynamically import to avoid SSR issues
      const jsPDF = (await import("jspdf")).default;
      const autoTable = (await import("jspdf-autotable")).default;

      const doc = new jsPDF();
      const dateStr = new Date().toLocaleDateString();

      // Header
      doc.setFontSize(20);
      doc.text("Margix Daily Report", 14, 22);
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`Generated on: ${dateStr}`, 14, 30);

      // Summary Stats
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text("Overview", 14, 45);
      
      autoTable(doc, {
        startY: 50,
        head: [["Metric", "Value"]],
        body: [
          ["Total Revenue", `BDT ${data.totalRevenue.toLocaleString()}`],
          ["Total Products", data.totalProducts.toString()],
          ["Out of Stock Items", data.outOfStock.toString()],
        ],
        theme: "grid",
        headStyles: { fillColor: [16, 185, 129] }, // emerald-500
      });

      // Category Breakdown
      let nextY = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(14);
      doc.text("Category Sales", 14, nextY);

      autoTable(doc, {
        startY: nextY + 5,
        head: [["Category", "Total Sales"]],
        body: data.categorySales.map(cat => [cat.name, `BDT ${cat.value.toLocaleString()}`]),
        theme: "grid",
        headStyles: { fillColor: [16, 185, 129] },
      });

      // Recent Products
      nextY = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(14);
      doc.text("Latest Inventory additions", 14, nextY);

      autoTable(doc, {
        startY: nextY + 5,
        head: [["Product Name", "Category", "Price", "Stock"]],
        body: data.latestProducts.map(p => [
          p.name, 
          p.category, 
          `BDT ${p.sellingPrice}`, 
          p.stockQuantity.toString()
        ]),
        theme: "grid",
        headStyles: { fillColor: [16, 185, 129] },
      });

      doc.save(`Margix_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Make sure jspdf and jspdf-autotable are installed.");
    }
  };

  return (
    <button 
      onClick={handleDownload}
      className="inline-flex items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-100 px-4 py-2 text-sm font-semibold text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm"
    >
      <Download className="mr-2 h-4 w-4" />
      Download Report
    </button>
  );
}
