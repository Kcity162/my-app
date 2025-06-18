import React, { useRef, useEffect, useState } from 'react';
import { Autocomplete, TextField, Avatar, ListItem, ListItemAvatar, ListItemText, Box, Modal, Typography, Card, CardContent, CardMedia, CardActions, Button } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Chip from '@mui/material/Chip';

const users = [
  { name: 'Alice Johnson', code: '123456', avatar: 'https://i.pravatar.cc/40?u=alice', company: 'DreamCorp', phone: '555-1234', email: 'alice@example.com', notes: 'Likes to arrive early', host: 'Samantha Ray' },
  { name: 'Bob Smith', code: '654321', avatar: 'https://i.pravatar.cc/40?u=bob', company: 'Innovatech', phone: '555-5678', email: 'bob@example.com', notes: 'Prefers email contact', host: 'Michael Chen' },
  { name: 'Charlie Lee', code: '112233', avatar: 'https://i.pravatar.cc/40?u=charlie', company: 'FutureWorks', phone: '555-8765', email: 'charlie@example.com', notes: 'Has dietary restrictions', host: 'Jessica Kim' },
];

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
        options={users}
        getOptionLabel={(option) => `${option.name} (${option.code})`}
        noOptionsText="No visitor found"
        popupIcon={null}
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          setSelectedUser(newValue);
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
        renderOption={(props, option) => (
          <ListItem {...props}>
            <ListItemAvatar>
              <Avatar src={option.avatar} />
            </ListItemAvatar>
            <ListItemText
              primary={option.name}
              secondary={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{`Pin: ${option.code.slice(0, 3)} ${option.code.slice(3)}`}</span>
                  <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                    {option.host.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                </Box>
              }
            />
          </ListItem>
        )}
        renderInput={(params) => (
          <Box sx={{ position: 'relative', width: '100%' }}>
            <TextField
              {...params}
              inputRef={(node) => {
                if (node) inputRef.current = node.querySelector('input');
              }}
              variant="outlined"
              fullWidth
              size="large"
              placeholder="Visitor search..."
              sx={{ height: 70 }}
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
        sx={{ width: 400 }}
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