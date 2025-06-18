import React from 'react';
import { Autocomplete, TextField, Avatar, ListItem, ListItemAvatar, ListItemText } from '@mui/material';

const users = [
  { name: 'Alice Johnson', code: '123456', avatar: 'https://i.pravatar.cc/40?u=alice' },
  { name: 'Bob Smith', code: '654321', avatar: 'https://i.pravatar.cc/40?u=bob' },
  { name: 'Charlie Lee', code: '112233', avatar: 'https://i.pravatar.cc/40?u=charlie' },
];

export default function UserSearch() {
  return (
    <Autocomplete
      options={users}
      getOptionLabel={(option) => `${option.name} (${option.code})`}
      renderOption={(props, option) => (
        <ListItem {...props}>
          <ListItemAvatar>
            <Avatar src={option.avatar} />
          </ListItemAvatar>
          <ListItemText primary={option.name} secondary={`Code: ${option.code}`} />
        </ListItem>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search for a user"
          variant="outlined"
          fullWidth
          size="large"
        />
      )}
      sx={{ width: 400 }}
    />
  );
}