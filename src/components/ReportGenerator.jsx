import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { generateReportPDF } from '../utils/pdfGenerator';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ReportGenerator = ({ ideas }) => {
  const [stats, setStats] = useState({
    totalIdeas: 0,
    categoryCount: 0,
    averageVotes: 0,
    categoryStats: {},
  });

  useEffect(() => {
    if (ideas.length > 0) {
      const categoryStats = ideas.reduce((acc, idea) => {
        acc[idea.category] = (acc[idea.category] || 0) + 1;
        return acc;
      }, {});

      const totalVotes = ideas.reduce((acc, idea) => {
        return acc + (idea.upvotes || 0) + (idea.downvotes || 0);
      }, 0);

      setStats({
        totalIdeas: ideas.length,
        categoryCount: Object.keys(categoryStats).length,
        averageVotes: totalVotes / ideas.length,
        categoryStats,
      });
    }
  }, [ideas]);

  const categoryChartData = {
    labels: Object.keys(stats.categoryStats),
    datasets: [
      {
        label: 'カテゴリー別アイデア数',
        data: Object.values(stats.categoryStats),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const handleDownloadPDF = () => {
    const doc = generateReportPDF(ideas, stats);
    doc.save('idea-report.pdf');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        アイデア分析レポート
      </Typography>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          基本統計
        </Typography>
        <Typography>総アイデア数: {stats.totalIdeas}</Typography>
        <Typography>カテゴリー数: {stats.categoryCount}</Typography>
        <Typography>平均投票数: {stats.averageVotes.toFixed(1)}</Typography>
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          カテゴリー別分布
        </Typography>
        <Box sx={{ height: 300 }}>
          <Pie data={categoryChartData} />
        </Box>
      </Paper>

      <Button
        variant="contained"
        color="primary"
        onClick={handleDownloadPDF}
        sx={{ mt: 2 }}
      >
        PDFレポートをダウンロード
      </Button>
    </Box>
  );
};

export default ReportGenerator; 