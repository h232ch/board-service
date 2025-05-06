import React, { useState } from 'react';
import { User } from '../../types/api';
import Profile from '../Profile/Profile';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Container,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useNavigate } from 'react-router-dom';
import { Person, Logout } from '@mui/icons-material';

// Define the type for our props
interface HeaderProps {
  isLoggedIn: boolean;
  username: string;
  onLogout: () => void;
  userInfo: User | null;
}

// Create a functional component with TypeScript
const Header: React.FC<HeaderProps> = ({ isLoggedIn, username, onLogout, userInfo }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleBoardClick = () => {
    navigate('/board');
    handleMenuClose();
  };

  const handleProfile = () => {
    setShowProfile(true);
    handleClose();
  };

  const handleLogout = () => {
    onLogout();
    handleClose();
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: 1,
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="md" sx={{ width: '100%' }}>
        <Toolbar sx={{ minHeight: '64px', px: { xs: 1, sm: 2 } }}>
          <IconButton 
            edge="start" 
            color="inherit" 
            aria-label="menu" 
            onClick={handleMenuOpen} 
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
          > 
            <MenuItem onClick={handleBoardClick}>
              <DashboardIcon fontSize="small" sx={{ mr: 1 }} />
              Board
            </MenuItem>
          </Menu>
          <Typography
            variant="h6" 
            component="div" 
            sx={{ flexGrow: 1 }}>Board Service
          </Typography>
          {isLoggedIn && userInfo && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                Welcome, {username}
              </Typography>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                onClick={handleMenu}
              >
                <Avatar sx={{ width: 32, height: 32 }}>
                  {username.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                    mt: 1.5,
                    width: '120px',
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                    '& .MuiMenuItem-root': {
                      py: 1,
                      px: 1.5,
                      minHeight: 'auto',
                      '& .MuiListItemIcon-root': {
                        minWidth: 'auto',
                        mr: 1
                      },
                      '& .MuiListItemText-root': {
                        margin: 0
                      }
                    }
                  },
                }}
              >
                <MenuItem onClick={handleProfile}>
                  <ListItemIcon>
                    <Person fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Profile</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
      {showProfile && userInfo && (
        <Profile 
          user={userInfo} 
          onClose={() => setShowProfile(false)} />
      )}
    </AppBar>
  );
};

export default Header; 