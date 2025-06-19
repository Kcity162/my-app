import React, { useRef, useEffect, useState } from 'react';
import { Autocomplete, TextField, Avatar, ListItem, ListItemAvatar, ListItemText, Box, Modal, Typography, Card, CardContent, CardMedia, CardActions, Button, MenuItem, Select } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import PersonIcon from '@mui/icons-material/Person';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

export default function UserSearch() {
  const inputRef = useRef();
  const noteInputRef = useRef();
  const [selectedUser, setSelectedUser] = useState(null);
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
        noteInputRef.current.focus();
        if (noteInputRef.current.setSelectionRange) {
          noteInputRef.current.setSelectionRange(0, 0);
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
                      <Avatar sx={{ width: 24, height: 24 }}>
                        <SupervisorAccountIcon sx={{ fontSize: 16 }} />
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
          <Card>
            <CardMedia
              component="img"
              height="200"
              image={selectedUser?.avatar}
              alt={selectedUser?.name}
            />
            <CardContent>
              <Box sx={{ mt: 1 }}>
                <Select
                  size="small"
                  fullWidth
                  value={selectedUser?.escorted ? 'Escorted' : 'Un-escorted'}
                  onChange={(e) => {
                    const updatedUsers = users.map(u =>
                      u.name === selectedUser.name ? { ...u, escorted: e.target.value === 'Escorted' } : u
                    );
                    setUsers(updatedUsers);
                    setSelectedUser({ ...selectedUser, escorted: e.target.value === 'Escorted' });
                  }}
                  sx={{ bgcolor: selectedUser?.escorted ? '#f8d7da' : '#d4edda' }}
                >
                  <MenuItem value="Escorted">Escorted</MenuItem>
                  <MenuItem value="Un-escorted">Un-escorted</MenuItem>
                </Select>
              </Box>
              <Typography variant="h5">{selectedUser?.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedUser?.company}
              </Typography>
              <Typography variant="body2">📞 {selectedUser?.phone}</Typography>
              <Typography variant="body2">✉️ {selectedUser?.email}</Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SupervisorAccountIcon sx={{ fontSize: 16, color: '#1976d2' }} />
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setHostDialogOpen(true);
                  }}
                  style={{ color: '#1976d2', textDecoration: 'none', cursor: 'pointer' }}
                >
                  {selectedUser?.host}
                </a>
              </Typography>
              <Typography variant="body2" mt={1}>{selectedUser?.notes}</Typography>
            </CardContent>
            <CardActions sx={{ display: 'flex', gap: 1 }}>
              <Tooltip
                title={
                  inputError && (
                    <>
                      Enter the last 4 characters of your legal ID (letters or numbers only).
                      This is regularly checked—ask your supervisor if you need to skip this step.
                    </>
                  )
                }
                open={inputError}
                disableFocusListener
                disableHoverListener
                disableTouchListener
              >
                <TextField
                  inputRef={noteInputRef}
                  variant="outlined"
                  size="small"
                  placeholder={inputError ? "Last 4 of ID required" : "Last 4 characters of ID"}
                  value={lastFourDigits}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    if (/^[A-Z0-9]*$/.test(value) && value.length <= 4) {
                      setLastFourDigits(value);
                      setInputError(false);
                    }
                  }}
                  error={inputError}
                  helperText=""
                  sx={{ flex: 1 }}
                />
              </Tooltip>
              {(lastFourDigits.length !== 4 || !/^[A-Za-z0-9]{4}$/.test(lastFourDigits)) ? (
                <Tooltip
                  title="Enter the last 4 characters of your legal ID (letters or numbers only). This is regularly checked—ask your supervisor if you need to skip this step."
                  enterTouchDelay={0}
                >
                  <span>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled
                      sx={{ pointerEvents: 'none' }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        Print
                        <Chip
                          label="⌘ + ⏎"
                          size="small"
                          color="default"
                          component="div"
                          clickable={false}
                          tabIndex={-1}
                          sx={{
                            height: 20,
                            fontSize: '0.75rem',
                            pointerEvents: 'none',
                            bgcolor: '#F1F2F4',
                          }}
                        />
                      </Box>
                    </Button>
                  </span>
                </Tooltip>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    if (lastFourDigits.length !== 4 || !/^[A-Za-z0-9]{4}$/.test(lastFourDigits)) {
                      setInputError(true);
                      return;
                    }
                    setInputError(false);
                    setSelectedUser(null);
                    setSnackOpen(true);
                    setLastFourDigits('');
                  }}
                  onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
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
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Print
                    <Chip
                      label="⌘ + ⏎"
                      size="small"
                      color="default"
                      component="div"
                      clickable={false}
                      tabIndex={-1}
                      sx={{
                        height: 20,
                        fontSize: '0.75rem',
                        pointerEvents: 'none',
                        bgcolor: '#F1F2F4',
                      }}
                    />
                  </Box>
                </Button>
              )}
            </CardActions>
          </Card>
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
          {hostDetails && (
            <Card sx={{ width: '40%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
              <Avatar
                src={hostDetails.avatar}
                alt={hostDetails.name}
                sx={{ width: 100, height: 100, mb: 2 }}
              />
              <Typography variant="h6" align="center">{hostDetails.name}</Typography>
              <Typography variant="body2" color="text.secondary" align="center">{hostDetails.company}</Typography>
              <Typography variant="body2" align="center">📞 {hostDetails.phone}</Typography>
              <Typography variant="body2" align="center">✉️ {hostDetails.email}</Typography>
            </Card>
          )}
          <Box sx={{ width: '60%', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Message host"
              multiline
              minRows={5}
              variant="outlined"
              value={messageText}
              onChange={(e) => {
                setMessageText(e.target.value);
                if (e.target.value.trim() !== '') {
                  setMessageError(false);
                }
              }}
              error={messageError}
              helperText={messageError ? "Message cannot be empty." : ""}
              fullWidth
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Tooltip
                title={
                  messageError && (
                    <>
                      Please enter a message before sending.
                    </>
                  )
                }
                open={messageError}
                disableFocusListener
                disableHoverListener
                disableTouchListener
              >
                <span>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={messageText.trim() === ''}
                    onClick={() => {
                      if (messageText.trim() === '') {
                        setMessageError(true);
                        return;
                      }
                      setMessageError(false);
                      setHostDialogOpen(false);
                      setMessageText('');
                      setSnackOpen(true);
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      Send Message
                      <Chip
                        label="⌘ + ⏎"
                        size="small"
                        color="default"
                        component="div"
                        clickable={false}
                        tabIndex={-1}
                        sx={{
                          height: 20,
                          fontSize: '0.75rem',
                          pointerEvents: 'none',
                          bgcolor: '#F1F2F4',
                        }}
                      />
                    </Box>
                  </Button>
                </span>
              </Tooltip>
            </Box>
          </Box>
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
  );
}