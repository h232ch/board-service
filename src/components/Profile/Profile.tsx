import React from 'react';
import { User } from '../../types/User';
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
import { format } from 'date-fns';

interface ProfileProps {
  user: User;
  onClose: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onClose }) => {
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
              fontSize: '2.5rem',
              mb: 2
            }}
          >
            {user.id.charAt(0).toUpperCase()}
          </Avatar>
        </Box>
        <List>
          <ListItem>
            <ListItemText 
              primary="Username"
              secondary={user.id}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText 
              primary="Member Since"
              secondary={format(new Date(user.signupDate), 'MMMM d, yyyy h:mm a')}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText 
              primary="Last Login"
              secondary={format(new Date(user.loginDate), 'MMMM d, yyyy h:mm a')}
            />
          </ListItem>
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default Profile; 