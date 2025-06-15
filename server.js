import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

// アイデアの投票を管理するオブジェクト
const ideaVotes = {};

// WebSocket接続の処理
io.on('connection', (socket) => {
  console.log('New client connected');

  // 投票の更新を送信
  socket.on('vote', (data) => {
    const { ideaId, vote } = data;
    if (!ideaVotes[ideaId]) {
      ideaVotes[ideaId] = { upvotes: 0, downvotes: 0 };
    }
    ideaVotes[ideaId][vote]++;
    io.emit('voteUpdate', { ideaId, votes: ideaVotes[ideaId] });
  });

  // アイデアの更新を送信
  socket.on('ideaUpdate', (data) => {
    io.emit('ideaUpdated', data);
  });

  // 切断時の処理
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// 静的ファイルの提供
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 