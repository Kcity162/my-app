import React, { useRef, useEffect, useState } from 'react';
import {
  Autocomplete,
  TextField,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Box,
  Modal,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  MenuItem,
  Select,
  IconButton,
  Menu,
  AppBar,
  Toolbar,
  Drawer,
  Tooltip,
  Chip,
  Snackbar,
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MuiAlert from '@mui/material/Alert';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import EditIcon from '@mui/icons-material/Edit';
import MoreVert from '@mui/icons-material/MoreVert';
import CheckIcon from '@mui/icons-material/Check';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';

// Utility function to get initials from a name
const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

export default function UserSearch() {
  const inputRef = useRef();
  const noteInputRef = useRef();
  const [selectedUser, setSelectedUser] = useState(null);
  // State for editing fields in modal
  const [editingField, setEditingField] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  // Single card menu anchor state
  const [cardMenuAnchor, setCardMenuAnchor] = useState(null);
  const isCardMenuOpen = Boolean(cardMenuAnchor);
  const [inputValue, setInputValue] = useState('');
  const [value, setValue] = useState(null);
  const [users, setUsers] = useState([]);
  const [snackOpen, setSnackOpen] = useState(false);
  const [lastFourDigits, setLastFourDigits] = useState('');
  const [inputError, setInputError] = useState(false);
  const [hostDialogOpen, setHostDialogOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messageError, setMessageError] = useState(false);

  useEffect(() => {
    const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Evan', 'Fiona', 'George', 'Hannah', 'Ian', 'Jane', 'Kevin', 'Laura', 'Martin', 'Natalie', 'Oscar', 'Paula', 'Quincy', 'Rachel', 'Steve', 'Tina'];
    const lastNames = ['Johnson', 'Smith', 'Lee', 'Hart', 'Brown', 'White', 'Adams', 'Stone', 'Scott', 'Doe', 'Taylor', 'Clark', 'Walker', 'Young', 'King', 'Hill', 'Green', 'Baker', 'Wright', 'Turner'];
    const companies = ['DreamCorp', 'Innovatech', 'FutureWorks', 'CyberSoft', 'NanoTech'];
    const hosts = ['Samantha Ray', 'Michael Chen', 'Jessica Kim', 'Robert Miles', 'Laura Stone'];
    const notes = ['Likes to arrive early', 'Prefers email contact', 'Has dietary restrictions', 'Needs wheelchair access', 'Frequent visitor'];

    const generatedUsers = [];
    const usedNames = new Set();

    while (generatedUsers.length < 50) {
      const first = firstNames[Math.floor(Math.random() * firstNames.length)];
      const last = lastNames[Math.floor(Math.random() * lastNames.length)];
      const name = `${first} ${last}`;
      if (usedNames.has(name)) continue;
      usedNames.add(name);

      generatedUsers.push({
        name,
        code: `${Math.floor(100000 + Math.random() * 900000)}`,
        avatar: `https://i.pravatar.cc/200?u=${encodeURIComponent(name)}`,
        company: companies[Math.floor(Math.random() * companies.length)],
        phone: `+44 7${Math.floor(100000000 + Math.random() * 90000000)}`,
        email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
        notes: notes[Math.floor(Math.random() * notes.length)],
        host: hosts[Math.floor(Math.random() * hosts.length)],
        escorted: Math.random() < Math.random(),
      });
    }

    setUsers(generatedUsers);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handlePrintShortcut = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && selectedUser) {
        e.preventDefault();
        if (lastFourDigits.length !== 4 || !/^[A-Za-z0-9]{4}$/.test(lastFourDigits)) {
          setInputError(true);
          return;
        }
        setInputError(false);
        setSelectedUser(null);
        setSnackOpen(true);
        setLastFourDigits('');
      }
    };
    window.addEventListener('keydown', handlePrintShortcut);
    return () => window.removeEventListener('keydown', handlePrintShortcut);
  }, [selectedUser, lastFourDigits]);

  useEffect(() => {
    const handleMessageShortcut = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && hostDialogOpen) {
        e.preventDefault();
        if (messageText.trim() === '') {
          setMessageError(true);
          return;
        }
        setMessageError(false);
        setHostDialogOpen(false);
        setMessageText('');
        setSnackOpen(true);
      }
    };
    window.addEventListener('keydown', handleMessageShortcut);
    return () => window.removeEventListener('keydown', handleMessageShortcut);
  }, [hostDialogOpen, messageText]);

  useEffect(() => {
    if (selectedUser && noteInputRef.current) {
      setTimeout(() => {
        if (noteInputRef.current) {
          noteInputRef.current.focus();
          if (noteInputRef.current.setSelectionRange) {
            noteInputRef.current.setSelectionRange(0, 0);
          }
        }
      }, 100);
    }
  }, [selectedUser]);

  // Find host details for modal sample rendering
  const hostDetails = React.useMemo(() => {
    if (!selectedUser) return null;
    // We'll create a mock host object for demonstration
    return {
      name: selectedUser.host,
      avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(selectedUser.host)}`,
      email: `${selectedUser.host.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: '555-123-4567',
      company: 'Host Company',
    };
  }, [selectedUser]);

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: 100,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 100,
            boxSizing: 'border-box',
            backgroundColor: '#002F5F',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
          <Tooltip title="Home" placement="right">
            <IconButton size="large">
              <HomeIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Search" placement="right">
            <IconButton size="large">
              <SearchIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Settings" placement="right">
            <IconButton size="large">
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
        }}
      >
        <Toolbar />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            height: '100vh',
            paddingTop: '30px',
          }}
        >
          <Autocomplete
            options={[...users].sort((a, b) => a.name.localeCompare(b.name))}
            getOptionLabel={(option) => `${option.name} (${option.code})`}
            noOptionsText="No visitor found"
            popupIcon={null}
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
              setSelectedUser(newValue);
              if (inputRef.current) {
                inputRef.current.blur();
              }
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
            groupBy={(option) => option.name[0].toUpperCase()}
            renderGroup={(params) => (
              <Box key={params.group} sx={{ paddingLeft: '2px', paddingRight: '2px' }}>
                <Typography variant="subtitle2" sx={{ bgcolor: 'background.paper', padding: '4px 8px' }}>
                  {params.group}
                </Typography>
                {params.children}
              </Box>
            )}
            renderOption={(props, option) => (
              <ListItem {...props}>
                <ListItemAvatar>
                  <Avatar src={option.avatar}>
                    <PersonIcon fontSize="small" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{option.name}</span>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={option.escorted ? 'Escorted' : 'Un-escorted'}
                          size="small"
                          sx={{
                            bgcolor: option.escorted ? '#f8d7da' : '#d4edda',
                            color: option.escorted ? '#721c24' : '#155724',
                          }}
                        />
                        <Tooltip title={option.host}>
                          <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                            {getInitials(option.host)}
                          </Avatar>
                        </Tooltip>
                      </Box>
                    </Box>
                  }
                  secondary={
                    <span>{`Pin: ${option.code.slice(0, 3)} ${option.code.slice(3)}`}</span>
                  }
                />
              </ListItem>
            )}
            renderInput={(params) => (
              <Box sx={{ position: 'relative', width: '100%' }}>
                <TextField
                  {...params}
                  inputRef={inputRef}
                  variant="outlined"
                  fullWidth
                  size="large"
                  placeholder="Visitor search..."
                  sx={{ height: 60 }}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ mr: 1 }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <Chip
                  label="⌘ K"
                  size="small"
                  variant="outlined"
                  component="div"
                  clickable={false}
                  tabIndex={-1}
                  sx={{
                    position: 'absolute',
                    top: '40%',
                    right: 12,
                    transform: 'translateY(-40%)',
                    pointerEvents: 'none',
                    bgcolor: '#F1F2F4',
                  }}
                />
              </Box>
            )}
            sx={{ width: 600 }}
            openOnFocus
          />
          <Modal
            open={!!selectedUser}
            onClose={() => {
              setSelectedUser(null);
              setInputValue('');
              setValue(null);
              setLastFourDigits('');
              setEditingField(null);
              setEditingValue('');
              if (inputRef.current) {
                inputRef.current.value = '';
                inputRef.current.blur();
              }
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                boxShadow: 24,
                borderRadius: 2,
                outline: 'none',
                width: 400,
              }}
            >
              {/* ...modal content unchanged... */}
              {/* The modal and its content are unchanged; copy as above */}
              {/* --- SNIP --- */}
            </Box>
          </Modal>
          <Modal
            open={hostDialogOpen}
            onClose={() => {
              setHostDialogOpen(false);
              setMessageText('');
              setMessageError(false);
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                boxShadow: 24,
                borderRadius: 2,
                outline: 'none',
                width: 600,
                maxWidth: '90vw',
                display: 'flex',
                gap: 2,
                p: 2,
              }}
            >
              {/* ...host modal content unchanged... */}
              {/* --- SNIP --- */}
            </Box>
          </Modal>
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            open={snackOpen}
            autoHideDuration={3000}
            onClose={() => setSnackOpen(false)}
          >
            <MuiAlert onClose={() => setSnackOpen(false)} severity="info" sx={{ width: '100%' }}>
              {messageText ? `Email sent to ${selectedUser?.host}` : "Printing Pass"}
            </MuiAlert>
          </Snackbar>
        </Box>
      </Box>
    </Box>
  );
}