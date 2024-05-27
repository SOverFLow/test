import React from 'react';
import { Box, Typography, Button, Link, ThemeProvider } from '@mui/material';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import theme from '@/styles/theme';

export const dynamic = 'force-dynamic';

const NotFoundPage = () => {
    const t = useTranslations("notFound");
  return (
    <ThemeProvider theme={theme}>
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      height="100vh"
    >
      <Box 
        mb={2}
        display="flex" 
        justifyContent="center"
      >
        <Image 
          src="/images/not_found.svg" 
          alt="404-Scarecrow" 
          width={404} // Adjust the size as needed
          height={404} 
        />
      </Box>
      <Box 
        textAlign="center"
      >
        <Typography variant="h2" mb={2}>
          {t('i-have-bad-news-for-you')}
        </Typography>
        <Typography variant="body1" mb={3}>
          {t('the-page-you-are-looking-for-might-be-removed-or-is-temporarily-unavailable')}
        </Typography>
      </Box>
      <Link href={`/department`}>
        <Button variant='contained'>
            {t('back-to-homepage')}
        </Button>
    </Link>
    </Box>
    </ThemeProvider>
  );
};

export default NotFoundPage;