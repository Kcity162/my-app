import React, { useRef, useEffect, useState } from 'react';
import { Autocomplete, TextField, Avatar, ListItem, ListItemAvatar, ListItemText, Box, Modal, Typography, Card, CardContent, CardMedia, CardActions, Button } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import PersonIcon from '@mui/icons-material/Person';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

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
        phone: `555-${1000 + generatedUsers.length}`,
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
    if (selectedUser && noteInputRef.current) {
      setTimeout(() => {
        noteInputRef.current.focus();
        if (noteInputRef.current.setSelectionRange) {
          noteInputRef.current.setSelectionRange(0, 0);
        }
      }, 100);
    }
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
                    <Tooltip title={`Visiting: ${option.host}`}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                        {option.host.split(' ').map(n => n[0]).join('')}
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
              <Typography variant="h5">{selectedUser?.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedUser?.company}
              </Typography>
              <Typography variant="body2">📞 {selectedUser?.phone}</Typography>
              <Typography variant="body2">✉️ {selectedUser?.email}</Typography>
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
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
      >
        <MuiAlert onClose={() => setSnackOpen(false)} severity="info" sx={{ width: '100%' }}>
          Printing Pass
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}