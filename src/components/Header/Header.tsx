import React, { useState } from 'react';
import { User } from '../../types/User';
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
  Button
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useNavigate } from 'react-router-dom';
import App from '../../App';

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

  return (
    <AppBar position="static" sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
      <Box sx={{ maxWidth: 800, width: '100%', mx: 'auto' }}>
        {/* 툴바는 컨텐츠를 가로로 배치하는 컴포넌트 */}
        <Toolbar>
          <IconButton 
            edge="start" 
            color="inherit" 
            aria-label="menu" 
            onClick={handleMenuOpen} 
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          {/* 메뉴 설정 */}
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
          > 
            {/* 메뉴 아이템 설정 */}
            <MenuItem onClick={handleBoardClick}>
              <DashboardIcon fontSize="small" sx={{ mr: 1 }} />
              Board
            </MenuItem>
          </Menu>
          {/* 타이포그래피는 텍스트를 표시하는 컴포넌트 */}
          <Typography
            variant="h6" 
            component="div" 
            // 타이포그래피는 텍스트를 표시하는 컴포넌트
            sx={{ flexGrow: 1 }}>Board Service
          </Typography>
          {/* 로그인 상태 확인 */}
          {isLoggedIn && userInfo && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                Welcome, {username}
              </Typography>
              {/* 아이콘 버튼은 아이콘을 클릭할 수 있는 버튼 */}
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                onClick={handleMenu}
              >
                {/* 아바타는 사용자 아이콘을 표시하는 컴포넌트 */}
                <Avatar sx={{ width: 32, height: 32 }}>
                  {username.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              {/* 메뉴 설정 */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => {
                  setShowProfile(true);
                  handleClose();
                }}>
                  Profile
                </MenuItem>
                <MenuItem onClick={() => {
                  onLogout();
                  handleClose();
                }}>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Box>
      {showProfile && userInfo && (
        <Profile 
          user={userInfo} 
          onClose={() => setShowProfile(false)} />
      )}
    </AppBar>
  );
};

export default Header; 