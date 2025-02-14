import React from 'react';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const GradientText = styled(Typography)({
  background: 'linear-gradient(90deg, #9C27B0, #673AB7)', // Purple gradient
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 'bold',
});

const Header = () => {
  return (
    <Box sx={{ width: '100%', textAlign: 'center', py: 6 }}>
      <GradientText variant="h2">
        CollectBot
      </GradientText>
    </Box>
  );
};

export default Header;
