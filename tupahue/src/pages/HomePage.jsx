import { Box } from '@mui/material';
import { HeroHome } from '../components/HeroHome';
import { InstagramFeed } from '../components/InstagramFeed';

export const HomePage = () => {
  return (
    <Box sx={{ overflowX: 'hidden' }}>
      <HeroHome />
      <InstagramFeed />
    </Box>
  );
};