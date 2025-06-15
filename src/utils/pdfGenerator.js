import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generateIdeaPDF = (ideas) => {
  const doc = new jsPDF();
  
  // タイトル
  doc.setFontSize(20);
  doc.text('アイデア一覧', 14, 20);
  
  // テーブルデータの準備
  const tableData = ideas.map(idea => [
    idea.title,
    idea.description,
    idea.category,
    idea.status,
    `${idea.upvotes} / ${idea.downvotes}`
  ]);
  
  // テーブルの生成
  doc.autoTable({
    head: [['タイトル', '説明', 'カテゴリー', 'ステータス', '投票']],
    body: tableData,
    startY: 30,
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
    },
  });
  
  return doc;
};

export const generateReportPDF = (ideas, stats) => {
  const doc = new jsPDF();
  
  // タイトル
  doc.setFontSize(20);
  doc.text('アイデア分析レポート', 14, 20);
  
  // 基本統計
  doc.setFontSize(14);
  doc.text('基本統計', 14, 40);
  doc.setFontSize(12);
  doc.text(`総アイデア数: ${stats.totalIdeas}`, 14, 50);
  doc.text(`カテゴリー数: ${stats.categoryCount}`, 14, 60);
  doc.text(`平均投票数: ${stats.averageVotes}`, 14, 70);
  
  // カテゴリー別集計
  doc.setFontSize(14);
  doc.text('カテゴリー別集計', 14, 90);
  
  const categoryData = Object.entries(stats.categoryStats).map(([category, count]) => [
    category,
    count.toString()
  ]);
  
  doc.autoTable({
    head: [['カテゴリー', 'アイデア数']],
    body: categoryData,
    startY: 100,
    theme: 'grid',
  });
  
  return doc;
}; 