import React, { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext.jsx';
import { Button, Box, Typography } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

const VoteButtons = ({ ideaId }) => {
  const socket = useSocket();
  const [votes, setVotes] = useState({ upvotes: 0, downvotes: 0 });
  const [userVote, setUserVote] = useState(null);

  useEffect(() => {
    if (socket) {
      socket.on('voteUpdate', (data) => {
        if (data.ideaId === ideaId) {
          setVotes(data.votes);
        }
      });
    }
  }, [socket, ideaId]);

  const handleVote = (voteType) => {
    if (socket && userVote !== voteType) {
      socket.emit('vote', { ideaId, vote: voteType });
      setUserVote(voteType);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Button
        variant={userVote === 'upvotes' ? 'contained' : 'outlined'}
        color="primary"
        startIcon={<ThumbUpIcon />}
        onClick={() => handleVote('upvotes')}
      >
        <Typography>{votes.upvotes}</Typography>
      </Button>
      <Button
        variant={userVote === 'downvotes' ? 'contained' : 'outlined'}
        color="error"
        startIcon={<ThumbDownIcon />}
        onClick={() => handleVote('downvotes')}
      >
        <Typography>{votes.downvotes}</Typography>
      </Button>
    </Box>
  );
};

export default VoteButtons; 