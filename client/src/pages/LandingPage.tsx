import { useNavigate } from 'react-router-dom';
import { Chat as ChatIcon } from '@mui/icons-material';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Grid, 
  Paper,
  useMediaQuery,
  ThemeProvider,
  createTheme,
} from '@mui/material';

// Create the LandingPage component
const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = createTheme({
    palette: {
      primary: {
        main: '#7c3aed', // Purple to match your app's theme
      },
      secondary: {
        main: '#f43f5e', // Pink for contrast
      },
      background: {
        default: '#0f172a', // Dark background to match your app's theme
      },
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 600,
      },
    },
  });
  
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Navigation handlers
  const handleLoginClick = () => {
    console.log('Navigating to /login');
    navigate('/login');
  };
  
  const handleSignupClick = () => {
    console.log('Navigating to /signup');
    navigate('/signup');
  };
  
  return (
    <ThemeProvider theme={theme}>
      <Box 
        sx={{ 
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          position: 'relative',
          overflow: 'hidden',
          color: 'white'
        }}
      >
        {/* Decorative elements */}
        <Box 
          sx={{ 
            position: 'absolute',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, rgba(124, 58, 237, 0.15), rgba(124, 58, 237, 0.05))',
            top: '-100px',
            right: '-100px',
            zIndex: 0
          }} 
        />
        <Box 
          sx={{ 
            position: 'absolute',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, rgba(244, 63, 94, 0.15), rgba(244, 63, 94, 0.05))',
            bottom: '-50px',
            left: '-50px',
            zIndex: 0
          }} 
        />
        
        {/* Header */}
        <Box sx={{ py: 2, px: 3, position: 'relative', zIndex: 1 }}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ChatIcon sx={{ fontSize: 32, color: '#7c3aed', mr: 1 }} />
                <Typography variant="h5" component="div" sx={{ fontWeight: 700, color: 'white' }}>
                  TalkEase
                </Typography>
              </Box>
            </Grid>
            <Grid item>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={handleLoginClick}
                  sx={{ fontWeight: 600, borderRadius: '8px', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
                >
                  Login
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleSignupClick}
                  sx={{ fontWeight: 600, borderRadius: '8px' }}
                >
                  Sign Up
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
        
        {/* Hero Section */}
        <Container maxWidth="lg" sx={{ mt: isMobile ? 4 : 8, position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: isMobile ? 'center' : 'left', pr: isMobile ? 0 : 4 }}>
                <Typography 
                  variant="h2" 
                  component="h1" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 800, 
                    fontSize: isMobile ? '2.5rem' : '3.5rem',
                    background: 'linear-gradient(45deg, #7c3aed, #f43f5e)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent'
                  }}
                >
                  The Smarter Way to Communicate
                </Typography>
                <Typography 
                  variant="h5" 
                  paragraph 
                  sx={{ mb: 4, maxWidth: '600px', mx: isMobile ? 'auto' : 0, color: 'rgba(255,255,255,0.8)' }}
                >
                  TalkEase is your AI-powered conversation companion. Simplify communication, get answers, and solve problems effortlessly.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: isMobile ? 'center' : 'flex-start' }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="large" 
                    onClick={handleSignupClick}
                    sx={{ 
                      fontWeight: 600, 
                      borderRadius: '8px', 
                      px: 4, 
                      py: 1.5,
                      boxShadow: '0 8px 16px rgba(124, 58, 237, 0.3)'
                    }}
                  >
                    Get Started
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    size="large" 
                    onClick={handleLoginClick}
                    sx={{ 
                      fontWeight: 600, 
                      borderRadius: '8px', 
                      px: 4, 
                      py: 1.5, 
                      color: 'white', 
                      borderColor: 'rgba(255,255,255,0.3)'
                    }}
                  >
                    Login
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box 
                sx={{ 
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                <Paper 
                  elevation={8}
                  sx={{
                    borderRadius: '16px',
                    overflow: 'hidden',
                    maxWidth: '500px',
                    width: '100%',
                    height: isMobile ? '460px' : '460px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    p: 3,
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                    position: 'relative',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {/* Chat UI Mockup */}
=<Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
  <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>TalkEase</Typography>
</Box>

<Box sx={{ 
  height: 'calc(100% - 80px)', 
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '0.4em',
    display: 'none' // Hide scrollbar for Chrome/Safari/Edge
  },
  scrollbarWidth: 'none', // Hide scrollbar for Firefox
  msOverflowStyle: 'none', // Hide scrollbar for IE/Edge legacy
}}>
  {/* Bot message */}
  <Box sx={{ display: 'flex', mb: 2 }}>
    <Box 
      sx={{ 
        background: 'rgba(124, 58, 237, 0.2)', 
        borderRadius: '18px', 
        p: 2,
        maxWidth: '80%',
        border: '1px solid rgba(124, 58, 237, 0.3)'
      }}
    >
      <Typography variant="body1" sx={{ color: 'white' }}>
        Hello! I'm TalkEase, your AI assistant. How can I help you today?
      </Typography>
    </Box>
  </Box>
  
  {/* User message */}
  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
    <Box 
      sx={{ 
        background: '#7c3aed', 
        color: 'white',
        borderRadius: '18px', 
        p: 2,
        maxWidth: '80%'
      }}
    >
      <Typography variant="body1">
        Can you tell me about your features?
      </Typography>
    </Box>
  </Box>
  
  {/* Bot message */}
  <Box sx={{ display: 'flex', mb: 2 }}>
    <Box 
      sx={{ 
        background: 'rgba(124, 58, 237, 0.2)', 
        borderRadius: '18px', 
        p: 2,
        maxWidth: '80%',
        border: '1px solid rgba(124, 58, 237, 0.3)'
      }}
    >
      <Typography variant="body1" sx={{ color: 'white' }}>
        Of course! TalkEase can answer your questions, assist with tasks, provide recommendations, and much more.
      </Typography>
    </Box>
  </Box>
</Box>
                  {/* Input area */}
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      bottom: 16,
                      left: 16,
                      right: 16,
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '24px',
                      p: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', pl: 2 }}>Type a message...</Typography>
                    <Button 
                      size="small" 
                      color="primary" 
                      sx={{ minWidth: 'auto', borderRadius: '50%', p: 1 }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 2L11 13" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Button>
                  </Box>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
        
              {/* Features Section */}
        <Container maxWidth="lg" sx={{ mt: 12, mb: 8, position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h3"
            component="h2"
            align="center"
            gutterBottom
            sx={{ fontWeight: 700, mb: 6 }}
          >
            Why Choose TalkEase?
          </Typography>

          <Grid container spacing={4}>
            {[
              {
                title: "Instant, Accurate Assistance",
                description: "Receive precise answers and support within seconds, ensuring a seamless user experience for any query.",
                icon: "⚡"
              },
              {
                title: "Adaptive Personalization",
                description: "TalkEase continuously refines its understanding from your interactions to deliver increasingly tailored and relevant assistance.",
                icon: "🎯"
              },
              {
                title: "Context-Aware Conversations",
                description: "Engage in fluid, human-like dialogues powered by advanced natural language understanding and contextual awareness.",
                icon: "💬"
              },
              {
                title: "Multilingual Interaction",
                description: "Communicate effortlessly across multiple languages, expanding accessibility for a global audience.",
                icon: "🌎"
              },
              {
                title: "Multimodal Responses",
                description: "Experience responses in both text and audio formats, providing a richer and more dynamic user interaction.",
                icon: "🎙️"
              },
              {
                title: "Real-time Sentiment Analysis",
                description: "Analyze and understand emotional tones instantly to drive more empathetic and intelligent conversations.",
                icon: "📈"
              }
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  elevation={2}
                  sx={{
                    borderRadius: '16px',
                    p: 4,
                    height: '100%',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    background: 'rgba(15, 23, 42, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 20px rgba(0, 0, 0, 0.2)'
                    }
                  }}
                >
                  <Typography
                    component="div"
                    sx={{
                      fontSize: '2.5rem', // reduced icon size
                      mb: 2
                    }}
                  >
                    {feature.icon}
                  </Typography>

                  {/* Title */}
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    sx={{ fontWeight: 600, color: 'white' }}
                  >
                    {feature.title}
                  </Typography>

                  {/* Description */}
                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Footer */}
        <Box
          sx={{
            bgcolor: 'rgba(15, 23, 42, 0.95)',
            color: 'white',
            position: 'relative',
            py:2,
            zIndex: 1,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Container>
            {/* Bottom Copyright */}
            <Box mt={1} textAlign="center">
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                Made by Neha, Apeksha & Nensee
              </Typography>
            </Box>
          </Container>
        </Box>

      </Box>
    </ThemeProvider>
  );
};

export default LandingPage;