import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  IconButton, 
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { format, isValid } from 'date-fns';
import { User } from '../../types/api';

interface ProfileProps {
  user: User;
  onClose: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onClose }) => {
  const formatDate = (dateString: string | Date) => {
    try {
      const date = new Date(dateString);
      if (isValid(date)) {
        return format(date, 'MMMM d, yyyy h:mm a');
      }
      return 'N/A';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  return (
    <Dialog 
      open={true} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6">My Profile</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 3
        }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: 'primary.main',
              fontSize: '2.5rem',
              mb: 2
            }}
          >
            {user.username.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h5">{user.username}</Typography>
          <Typography variant="body1" color="text.secondary">
            {user.email}
          </Typography>
        </Box>
        <List>
          <ListItem>
            <ListItemText 
              primary="User ID"
              secondary={user._id}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText 
              primary="Member Since"
              secondary={formatDate(user.createdAt)}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText 
              primary="Last Login"
              secondary={formatDate(user.lastLoginAt)}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText 
              primary="Last Updated"
              secondary={formatDate(user.updatedAt)}
            />
          </ListItem>
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default Profile; 