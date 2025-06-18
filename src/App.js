import React, { useRef, useEffect, useState } from 'react';
import { Autocomplete, TextField, Avatar, ListItem, ListItemAvatar, ListItemText, Box, Modal, Typography, Card, CardContent, CardMedia, CardActions, Button } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';

const users = Array.from({ length: 50 }, (_, i) => {
  const names = ['Alice Johnson', 'Bob Smith', 'Charlie Lee', 'Diana Hart', 'Evan Brown', 'Fiona White', 'George Adams', 'Hannah Lee', 'Ian Scott', 'Jane Doe'];
  const companies = ['DreamCorp', 'Innovatech', 'FutureWorks', 'CyberSoft', 'NanoTech'];
  const hosts = ['Samantha Ray', 'Michael Chen', 'Jessica Kim', 'Robert Miles', 'Laura Stone'];
  const notes = ['Likes to arrive early', 'Prefers email contact', 'Has dietary restrictions', 'Needs wheelchair access', 'Frequent visitor'];
  const name = `${names[i % names.length]} ${i}`;
  return {
    name,
    code: `${Math.floor(100000 + Math.random() * 900000)}`,
    avatar: `https://i.pravatar.cc/40?u=${encodeURIComponent(name)}`,
    company: companies[i % companies.length],
    phone: `555-${1000 + i}`,
    email: `user${i}@example.com`,
    notes: notes[i % notes.length],
    host: hosts[i % hosts.length],
    escorted: i % 2 === 0
  };
});

export default function UserSearch() {
  const inputRef = useRef();
  const [selectedUser, setSelectedUser] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [value, setValue] = useState(null);

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
              <Avatar src={option.avatar} />
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
            width: 300,
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
            <CardActions>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => setSelectedUser(null)}
              >
                Print
              </Button>
            </CardActions>
          </Card>
        </Box>
      </Modal>
    </Box>
  );
}