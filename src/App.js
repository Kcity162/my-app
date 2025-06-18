import React, { useRef, useEffect } from 'react';
import { Autocomplete, TextField, Avatar, ListItem, ListItemAvatar, ListItemText, Box } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Chip from '@mui/material/Chip';

const users = [
  { name: 'Alice Johnson', code: '123456', avatar: 'https://i.pravatar.cc/40?u=alice' },
  { name: 'Bob Smith', code: '654321', avatar: 'https://i.pravatar.cc/40?u=bob' },
  { name: 'Charlie Lee', code: '112233', avatar: 'https://i.pravatar.cc/40?u=charlie' },
];

export default function UserSearch() {
  const inputRef = useRef();

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
        renderOption={(props, option) => (
          <ListItem {...props}>
            <ListItemAvatar>
              <Avatar src={option.avatar} />
            </ListItemAvatar>
            <ListItemText primary={option.name} secondary={`Code: ${option.code}`} />
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
    </Box>
  );
}