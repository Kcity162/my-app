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
  FormControl,
  InputLabel,
  Divider,
  Grid,
  TableSortLabel,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
  Table,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import FilterListIcon from '@mui/icons-material/FilterList';
import GridViewIcon from '@mui/icons-material/GridView';
import ListIcon from '@mui/icons-material/List';
import AddIcon from '@mui/icons-material/Add';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import Link from '@mui/material/Link';
import EditIcon from '@mui/icons-material/Edit';
import MoreVert from '@mui/icons-material/MoreVert';
import CheckIcon from '@mui/icons-material/Check';

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
  // isSearchOpen controls the visibility of the search modal/component (Autocomplete in this case)
  // For this context, we assume it's open when the Autocomplete input is focused or open.
  // We'll manage a state for isSearchOpen.
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [visitorFilter, setVisitorFilter] = useState('today');
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
  // View mode state: 'list' or 'grid'
  const [viewMode, setViewMode] = useState('list');

  // Keyboard shortcut dialog state
  const [showShortcutTable, setShowShortcutTable] = useState(false);
  // Keyboard shortcut for showing the shortcut table (Cmd/Ctrl + Enter)
  useEffect(() => {
    const handleShortcutOpen = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        setShowShortcutTable(true);
      }
    };
    window.addEventListener('keydown', handleShortcutOpen);
    return () => window.removeEventListener('keydown', handleShortcutOpen);
  }, []);

  // Sorting state
  const [orderBy, setOrderBy] = useState('name');
  const [orderDirection, setOrderDirection] = useState('asc');

  // More menu state for table rows
  const [moreMenuAnchor, setMoreMenuAnchor] = React.useState(null);
  const [moreMenuUser, setMoreMenuUser] = React.useState(null);

  const handleMoreMenuOpen = (event, user) => {
    setMoreMenuAnchor(event.currentTarget);
    setMoreMenuUser(user);
  };

  const handleMoreMenuClose = () => {
    setMoreMenuAnchor(null);
    setMoreMenuUser(null);
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  useEffect(() => {
    const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Evan', 'Fiona', 'George', 'Hannah', 'Ian', 'Jane', 'Kevin', 'Laura', 'Martin', 'Natalie', 'Oscar', 'Paula', 'Quincy', 'Rachel', 'Steve', 'Tina'];
    const lastNames = ['Johnson', 'Smith', 'Lee', 'Hart', 'Brown', 'White', 'Adams', 'Stone', 'Scott', 'Doe', 'Taylor', 'Clark', 'Walker', 'Young', 'King', 'Hill', 'Green', 'Baker', 'Wright', 'Turner'];
    const companies = ['DreamCorp', 'Innovatech', 'FutureWorks', 'CyberSoft', 'NanoTech'];
    const hosts = ['Samantha Ray', 'Michael Chen', 'Jessica Kim', 'Robert Miles', 'Laura Stone'];
    const notes = ['Likes to arrive early', 'Prefers email contact', 'Has dietary restrictions', 'Needs wheelchair access', 'Frequent visitor'];

    const generatedUsers = [];
    const usedNames = new Set();
    // Helper to generate a plausible UK vehicle reg (e.g., AB12 CDE)
    const randomVehicleReg = () => {
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const randLetter = () => letters[Math.floor(Math.random() * letters.length)];
      const randNum = () => Math.floor(Math.random() * 10);
      return (
        randLetter() +
        randLetter() +
        randNum() +
        randNum() +
        " " +
        randLetter() +
        randLetter() +
        randLetter()
      );
    };
    // For the first 3 users, assign specific UK-style vehicle reg numbers for realism
    const ukRegs = ['AB12 CDE', '', 'XY34 ZYZ'];
    while (generatedUsers.length < 208) {
      const first = firstNames[Math.floor(Math.random() * firstNames.length)];
      const last = lastNames[Math.floor(Math.random() * lastNames.length)];
      const name = `${first} ${last}`;
      if (usedNames.has(name)) continue;
      usedNames.add(name);
      let vehicleReg;
      if (generatedUsers.length < 3) {
        vehicleReg = ukRegs[generatedUsers.length];
      } else {
        // About 1 in 4 visitors have a vehicleReg, rest are blank
        vehicleReg = Math.random() < 0.25 ? randomVehicleReg() : '';
      }
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
        vehicleReg,
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

  // Keyboard shortcut: G for grid, L for list
  useEffect(() => {
    const handleViewToggleShortcut = (e) => {
      if ((e.key === 'g' || e.key === 'G') && viewMode === 'list') {
        setViewMode('grid');
      } else if ((e.key === 'l' || e.key === 'L') && viewMode === 'grid') {
        setViewMode('list');
      }
    };
    window.addEventListener('keydown', handleViewToggleShortcut);
    return () => window.removeEventListener('keydown', handleViewToggleShortcut);
  }, [viewMode]);

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

  // Keyboard shortcuts for visitor filter selection: T=Today, W=Week, M=Month, P=Past
  useEffect(() => {
    const handleFilterShortcut = (e) => {
      const key = e.key.toLowerCase();
      if (key === 't') setVisitorFilter('today');
      else if (key === 'w') setVisitorFilter('next7');
      else if (key === 'm') setVisitorFilter('future');
      else if (key === 'p') setVisitorFilter('past');
    };
    window.addEventListener('keydown', handleFilterShortcut);
    return () => window.removeEventListener('keydown', handleFilterShortcut);
  }, []);

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
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', position: 'relative' }}>
      {/* Backdrop overlay for search modal/component */}
      {isSearchOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.07)', // lighter opacity
            zIndex: 1190,
          }}
        />
      )}
      {/* Column Overlay */}
      <Grid container spacing={2} sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', px: 2 }}>
        {[...Array(12)].map((_, i) => (
          <Grid item xs={1} key={i}>
            <Box sx={{ height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.03)' }} />
          </Grid>
        ))}
      </Grid>
      {/* Main Content Area with overlay above */}
      <Box sx={{ width: '100%', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Sticky top container for search, filter, and toggle */}
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 1300,
            bgcolor: 'background.paper',
            pt: 1,
            pb: 0.5,
            px: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            width: '100vw',
            maxWidth: '100vw',
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
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
                setIsSearchOpen(false);
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
                    onFocus={() => setIsSearchOpen(true)}
                    onBlur={() => setTimeout(() => setIsSearchOpen(false), 150)}
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
              onOpen={() => setIsSearchOpen(true)}
              onClose={() => setIsSearchOpen(false)}
              open={isSearchOpen}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '2200px', mx: 'auto', px: 0, pb: 0 }}>
            <FormControl sx={{ minWidth: 200 }} size="small">
              <Select
                id="visitor-filter"
                value={visitorFilter}
                onChange={(e) => setVisitorFilter(e.target.value)}
                displayEmpty
                renderValue={(selected) => {
                  const map = {
                    today: 'Today',
                    next7: 'Week',
                    future: 'Month or more',
                    past: 'Past',
                  };
                  return (
                    <>
                      <FilterListIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                      {map[selected] || 'Filter'}
                    </>
                  );
                }}
              >
                <MenuItem value="today">Today (T)</MenuItem>
                <MenuItem value="next7">Week (W)</MenuItem>
                <MenuItem value="future">Month or more (M)</MenuItem>
                <Divider />
                <MenuItem value="past">Past (P)</MenuItem>
              </Select>
            </FormControl>
            {/* Toggle buttons with tooltips for view mode shortcuts */}
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, newView) => {
                if (newView !== null) setViewMode(newView);
              }}
              size="small"
              sx={{ bgcolor: '#f0f0f0', borderRadius: '20px' }}
            >
              <Tooltip title="Grid view (G)">
                <ToggleButton value="grid" sx={{ borderRadius: '20px' }}>
                  <GridViewIcon />
                </ToggleButton>
              </Tooltip>
              <Tooltip title="List view (L)">
                <ToggleButton value="list" sx={{ borderRadius: '20px' }}>
                  <ListIcon />
                </ToggleButton>
              </Tooltip>
            </ToggleButtonGroup>
          </Box>
        </Box>
        {/* Main table area in scrollable container */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '2200px',
            mt: 4,
            mx: 'auto',
            height: '70vh',
            overflowY: 'auto',
          }}
        >
          {/* Table view visible only if viewMode === 'list' */}
          {viewMode === 'list' && (
            <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
              <TableHead>
                <TableRow
                  sx={{
                    // position: 'sticky',
                    // top: 56, // reduced from 64
                    bgcolor: '#f5f5f5',
                    // zIndex: 1299,
                  }}
                >
                  <TableCell sortDirection={orderBy === 'name' ? orderDirection : false} sx={{ pl: 2 }}>
                    <TableSortLabel
                      active={orderBy === 'name'}
                      direction={orderBy === 'name' ? orderDirection : 'asc'}
                      onClick={() => handleSort('name')}
                    >
                      <PersonIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                      Visitor
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={orderBy === 'host' ? orderDirection : false} sx={{ pl: 2 }}>
                    <TableSortLabel
                      active={orderBy === 'host'}
                      direction={orderBy === 'host' ? orderDirection : 'asc'}
                      onClick={() => handleSort('host')}
                    >
                      <SupervisorAccountIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                      Host
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ pl: 2 }}>
                    <DirectionsCarIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Vehicle
                  </TableCell>
                  <TableCell sx={{ textAlign: 'left', padding: 1, pl: 2 }}>
                    <BusinessIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Company
                  </TableCell>
                  <TableCell sx={{ textAlign: 'left', padding: 1, pl: 2 }}>
                    <PhoneIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Phone
                  </TableCell>
                  <TableCell sx={{ textAlign: 'left', padding: 1, pl: 2 }}>
                    <EmailIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Email
                  </TableCell>
                  <TableCell sx={{ width: 40, textAlign: 'center' }}>
                    {/* More menu icon placeholder for header */}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(() => {
                  const sortedVisitors = [...users].sort((a, b) => {
                    const aVal = orderBy === 'host' ? a.host.toLowerCase() : a.name.toLowerCase();
                    const bVal = orderBy === 'host' ? b.host.toLowerCase() : b.name.toLowerCase();
                    return orderDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
                  });
                  const groupedRows = [];
                  let lastLetter = '';
                  sortedVisitors.forEach((user) => {
                    const currentLetter = user.name[0].toUpperCase();
                    if (currentLetter !== lastLetter) {
                      groupedRows.push(
                        <TableRow key={`divider-${currentLetter}`}>
                          <TableCell colSpan={7} sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
                            {currentLetter}
                          </TableCell>
                        </TableRow>
                      );
                      lastLetter = currentLetter;
                    }
                    groupedRows.push(
                      <TableRow
                        key={user.code}
                        hover
                        sx={{
                          borderBottom: '1px solid #ddd',
                          cursor: 'pointer',
                          '&:hover': { backgroundColor: '#f5f5f5' },
                        }}
                      >
                        <TableCell sx={{ padding: 1, pl: 2 }}>
                          <Box
                            sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
                            onClick={() => setSelectedUser(user)}
                          >
                            <Avatar src={user.avatar} sx={{ width: 50, height: 50 }} />
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: 'bold', color: 'primary.main', textDecoration: 'none' }}
                              component="span"
                            >
                              {user.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ pl: 2 }}>
                          <Link href={`mailto:${user.host.toLowerCase().replace(/\s+/g, '.')}@example.com`} underline="hover">
                            {user.host}
                          </Link>
                        </TableCell>
                        <TableCell sx={{ pl: 2 }}>
                          <Link href="#" underline="hover">
                            {user.vehicleReg}
                          </Link>
                        </TableCell>
                        <TableCell sx={{ padding: 1, pl: 2 }}>{user.company}</TableCell>
                        <TableCell sx={{ pl: 2 }}>
                          <Link href={`tel:${user.phone}`} underline="hover">
                            {user.phone}
                          </Link>
                        </TableCell>
                        <TableCell sx={{ pl: 2 }}>
                          <Link href={`mailto:${user.email}`} underline="hover">
                            {user.email}
                          </Link>
                        </TableCell>
                        <TableCell sx={{ width: 40, textAlign: 'center' }}>
                          <IconButton onClick={(e) => handleMoreMenuOpen(e, user)}>
                            <MoreVert />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  });
                  return groupedRows;
                })()}
                {/* More menu for table rows */}
                <Menu
                  id="more-menu"
                  anchorEl={moreMenuAnchor}
                  open={Boolean(moreMenuAnchor)}
                  onClose={handleMoreMenuClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <MenuItem onClick={handleMoreMenuClose}>Option 1</MenuItem>
                  <MenuItem onClick={handleMoreMenuClose}>Option 2</MenuItem>
                  <MenuItem
                    onClick={() => {
                      setUsers((prevUsers) => prevUsers.filter((u) => u.code !== moreMenuUser.code));
                      handleMoreMenuClose();
                    }}
                    sx={{ color: 'error.main' }}
                  >
                    Delete
                  </MenuItem>
                </Menu>
              </TableBody>
            </Table>
          )}
          {/* Grid view visible only if viewMode === 'grid' */}
          {viewMode === 'grid' && (
            <Grid container spacing={2} sx={{ px: 2 }}>
              {[...users].sort((a, b) => a.name.localeCompare(b.name)).map((user) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={user.code}>
                  <Box onClick={() => setSelectedUser(user)} sx={{ cursor: 'pointer' }}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="200"
                        image={user.avatar}
                        alt={user.name}
                      />
                      <CardContent>
                        <Link
                          component="button"
                          onClick={() => setSelectedUser(user)}
                          sx={{
                            fontWeight: 'bold',
                            fontSize: '1.25rem',
                            textAlign: 'left',
                            display: 'block',
                            mb: 0.5,
                          }}
                        >
                          {user.name}
                        </Link>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <SupervisorAccountIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {user.host}
                          </Typography>
                        </Box>
                        <Chip
                          label={user.escorted ? 'Escorted' : 'Un-escorted'}
                          size="small"
                          sx={{
                            mt: 1,
                            bgcolor: user.escorted ? '#f8d7da' : '#d4edda',
                            color: user.escorted ? '#721c24' : '#155724',
                          }}
                        />
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
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
          <Card sx={{ position: 'relative' }}>
            {/* Card-level menu button */}
            <IconButton
              onClick={(e) => setCardMenuAnchor(e.currentTarget)}
              sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}
            >
              <MoreVert />
            </IconButton>
            <Menu
              anchorEl={cardMenuAnchor}
              open={isCardMenuOpen}
              onClose={() => setCardMenuAnchor(null)}
            >
              <MenuItem
                onClick={() => {
                  setEditingField('card');
                  setCardMenuAnchor(null);
                }}
              >
                Edit
              </MenuItem>
              <MenuItem onClick={() => setCardMenuAnchor(null)}>Cancel</MenuItem>
            </Menu>
            {/* Visitor photo with re-take overlay */}
            <Box
              sx={{
                position: 'relative',
                '&:hover .retake-overlay': { opacity: 1 },
                width: '100%',
                height: 200,
                overflow: 'hidden',
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={selectedUser?.avatar}
                alt={selectedUser?.name}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <Box
                className="retake-overlay"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.3s',
                  flexDirection: 'column',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  // Re-take action logic here
                  alert('Re-take photo clicked!');
                }}
              >
                <CameraAltIcon sx={{ fontSize: 32, mb: 1 }} />
                <Typography variant="body2">Re-take</Typography>
              </Box>
            </Box>
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
              <Box mt={2} />
              <Box
                sx={{
                  cursor: 'pointer',
                  position: 'relative',
                  '&:hover .edit-button': { display: 'inline-flex' },
                  mt: 1,
                }}
                onClick={() => {
                  setEditingField('name');
                  setEditingValue(selectedUser.name);
                }}
              >
                {editingField === 'name' ? (
                  <>
                    <TextField
                      size="small"
                      value={editingValue}
                      onChange={e => setEditingValue(e.target.value)}
                      sx={{ mr: 1, minWidth: 120 }}
                      autoFocus
                      onBlur={() => {
                        // Save on blur
                        if (editingValue.trim() !== '') {
                          const updatedUsers = users.map(u =>
                            u.name === selectedUser.name ? { ...u, name: editingValue } : u
                          );
                          setUsers(updatedUsers);
                          setSelectedUser({ ...selectedUser, name: editingValue });
                        }
                        setEditingField(null);
                        setEditingValue('');
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          if (editingValue.trim() !== '') {
                            const updatedUsers = users.map(u =>
                              u.name === selectedUser.name ? { ...u, name: editingValue } : u
                            );
                            setUsers(updatedUsers);
                            setSelectedUser({ ...selectedUser, name: editingValue });
                          }
                          setEditingField(null);
                          setEditingValue('');
                        }
                      }}
                    />
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={e => {
                        e.stopPropagation();
                        if (editingValue.trim() !== '') {
                          const updatedUsers = users.map(u =>
                            u.name === selectedUser.name ? { ...u, name: editingValue } : u
                          );
                          setUsers(updatedUsers);
                          setSelectedUser({ ...selectedUser, name: editingValue });
                        }
                        setEditingField(null);
                        setEditingValue('');
                      }}
                      sx={{ verticalAlign: 'middle' }}
                    >
                      <CheckIcon fontSize="small" />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <Box
                      onClick={() => {
                        setEditingField('name');
                        setEditingValue(selectedUser.name);
                      }}
                      sx={{
                        cursor: 'pointer',
                        position: 'relative',
                        display: 'inline-block',
                        '&:hover .edit-button': { display: 'inline-flex' }
                      }}
                    >
                      <Typography
                        component="a"
                        href="#"
                        variant="h5"
                        sx={{
                          fontWeight: 'bold',
                          color: 'primary.main',
                          textDecoration: 'none',
                          '&:hover': { textDecoration: 'none' },
                        }}
                      >
                        {selectedUser?.name}
                      </Typography>
                    </Box>
                    <IconButton
                      className="edit-button"
                      size="small"
                      sx={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        display: 'none',
                      }}
                      onClick={e => {
                        e.stopPropagation();
                        setEditingField('name');
                        setEditingValue(selectedUser?.name || '');
                      }}
                      aria-label="Edit name"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </>
                )}
              </Box>
              {/* Editable fields: company, phone, email, host, notes */}
              {/* Company */}
              <Box
                mt={1}
                sx={{
                  cursor: 'pointer',
                  position: 'relative',
                  '&:hover .edit-button': { display: 'inline-flex' },
                }}
                onClick={() => {
                  setEditingField('company');
                  setEditingValue(selectedUser.company);
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  🏢{' '}
                  {editingField === 'company' ? (
                    <>
                      <TextField
                        size="small"
                        value={editingValue}
                        onChange={e => setEditingValue(e.target.value)}
                        sx={{ mr: 1, minWidth: 120 }}
                        autoFocus
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            const updatedUsers = users.map(u =>
                              u.name === selectedUser.name ? { ...u, company: editingValue } : u
                            );
                            setUsers(updatedUsers);
                            setSelectedUser({ ...selectedUser, company: editingValue });
                            setEditingField(null);
                            setEditingValue('');
                          }
                        }}
                      />
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={e => {
                          e.stopPropagation();
                          const updatedUsers = users.map(u =>
                            u.name === selectedUser.name ? { ...u, company: editingValue } : u
                          );
                          setUsers(updatedUsers);
                          setSelectedUser({ ...selectedUser, company: editingValue });
                          setEditingField(null);
                          setEditingValue('');
                        }}
                        sx={{ verticalAlign: 'middle' }}
                      >
                        <CheckIcon fontSize="small" />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      {selectedUser?.company}
                      <IconButton
                        className="edit-button"
                        size="small"
                        sx={{
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          display: 'none',
                        }}
                        onClick={e => {
                          e.stopPropagation();
                          setEditingField('company');
                          setEditingValue(selectedUser?.company || '');
                        }}
                        aria-label="Edit company"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </>
                  )}
                </Typography>
              </Box>
              {/* Phone */}
              <Box
                mt={1}
                sx={{
                  cursor: 'pointer',
                  position: 'relative',
                  '&:hover .edit-button': { display: 'inline-flex' },
                }}
                onClick={() => {
                  setEditingField('phone');
                  setEditingValue(selectedUser.phone);
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  📞{' '}
                  {editingField === 'phone' ? (
                    <>
                      <TextField
                        size="small"
                        value={editingValue}
                        onChange={e => setEditingValue(e.target.value)}
                        sx={{ mr: 1, minWidth: 120 }}
                        autoFocus
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            const updatedUsers = users.map(u =>
                              u.name === selectedUser.name ? { ...u, phone: editingValue } : u
                            );
                            setUsers(updatedUsers);
                            setSelectedUser({ ...selectedUser, phone: editingValue });
                            setEditingField(null);
                            setEditingValue('');
                          }
                        }}
                      />
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={e => {
                          e.stopPropagation();
                          const updatedUsers = users.map(u =>
                            u.name === selectedUser.name ? { ...u, phone: editingValue } : u
                          );
                          setUsers(updatedUsers);
                          setSelectedUser({ ...selectedUser, phone: editingValue });
                          setEditingField(null);
                          setEditingValue('');
                        }}
                        sx={{ verticalAlign: 'middle' }}
                      >
                        <CheckIcon fontSize="small" />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      {selectedUser?.phone}
                      <IconButton
                        className="edit-button"
                        size="small"
                        sx={{
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          display: 'none',
                        }}
                        onClick={e => {
                          e.stopPropagation();
                          setEditingField('phone');
                          setEditingValue(selectedUser?.phone || '');
                        }}
                        aria-label="Edit phone"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </>
                  )}
                </Typography>
              </Box>
              {/* Email */}
              <Box
                mt={1}
                sx={{
                  cursor: 'pointer',
                  position: 'relative',
                  '&:hover .edit-button': { display: 'inline-flex' },
                }}
                onClick={() => {
                  setEditingField('email');
                  setEditingValue(selectedUser.email);
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  ✉️{' '}
                  {editingField === 'email' ? (
                    <>
                      <TextField
                        size="small"
                        value={editingValue}
                        onChange={e => setEditingValue(e.target.value)}
                        sx={{ mr: 1, minWidth: 120 }}
                        autoFocus
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            const updatedUsers = users.map(u =>
                              u.name === selectedUser.name ? { ...u, email: editingValue } : u
                            );
                            setUsers(updatedUsers);
                            setSelectedUser({ ...selectedUser, email: editingValue });
                            setEditingField(null);
                            setEditingValue('');
                          }
                        }}
                      />
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={e => {
                          e.stopPropagation();
                          const updatedUsers = users.map(u =>
                            u.name === selectedUser.name ? { ...u, email: editingValue } : u
                          );
                          setUsers(updatedUsers);
                          setSelectedUser({ ...selectedUser, email: editingValue });
                          setEditingField(null);
                          setEditingValue('');
                        }}
                        sx={{ verticalAlign: 'middle' }}
                      >
                        <CheckIcon fontSize="small" />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      {selectedUser?.email}
                      <IconButton
                        className="edit-button"
                        size="small"
                        sx={{
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          display: 'none',
                        }}
                        onClick={e => {
                          e.stopPropagation();
                          setEditingField('email');
                          setEditingValue(selectedUser?.email || '');
                        }}
                        aria-label="Edit email"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </>
                  )}
                </Typography>
              </Box>
              {/* Host */}
              <Box
                mt={1}
                sx={{
                  cursor: 'pointer',
                  position: 'relative',
                  '&:hover .edit-button': { display: 'inline-flex' },
                }}
                onClick={() => {
                  setEditingField('host');
                  setEditingValue(selectedUser.host);
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <SupervisorAccountIcon sx={{ fontSize: 16, color: '#1976d2' }} />
                  {editingField === 'host' ? (
                    <>
                      <TextField
                        size="small"
                        value={editingValue}
                        onChange={e => setEditingValue(e.target.value)}
                        sx={{ mr: 1, minWidth: 120 }}
                        autoFocus
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            const updatedUsers = users.map(u =>
                              u.name === selectedUser.name ? { ...u, host: editingValue } : u
                            );
                            setUsers(updatedUsers);
                            setSelectedUser({ ...selectedUser, host: editingValue });
                            setEditingField(null);
                            setEditingValue('');
                          }
                        }}
                      />
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={e => {
                          e.stopPropagation();
                          const updatedUsers = users.map(u =>
                            u.name === selectedUser.name ? { ...u, host: editingValue } : u
                          );
                          setUsers(updatedUsers);
                          setSelectedUser({ ...selectedUser, host: editingValue });
                          setEditingField(null);
                          setEditingValue('');
                        }}
                        sx={{ verticalAlign: 'middle' }}
                      >
                        <CheckIcon fontSize="small" />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <a
                        href="#"
                        onClick={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          setHostDialogOpen(true);
                        }}
                        style={{ color: '#1976d2', textDecoration: 'none', cursor: 'pointer' }}
                      >
                        {selectedUser?.host}
                      </a>
                      <IconButton
                        className="edit-button"
                        size="small"
                        sx={{
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          display: 'none',
                        }}
                        onClick={e => {
                          e.stopPropagation();
                          setEditingField('host');
                          setEditingValue(selectedUser?.host || '');
                        }}
                        aria-label="Edit host"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </>
                  )}
                </Typography>
              </Box>
              {/* Notes */}
              <Box
                mt={1}
                sx={{
                  cursor: 'pointer',
                  position: 'relative',
                  '&:hover .edit-button': { display: 'inline-flex' },
                }}
                onClick={() => {
                  setEditingField('notes');
                  setEditingValue(selectedUser.notes);
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  📝{' '}
                  {editingField === 'notes' ? (
                    <>
                      <TextField
                        size="small"
                        value={editingValue}
                        onChange={e => setEditingValue(e.target.value)}
                        sx={{ mr: 1, minWidth: 120 }}
                        autoFocus
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            const updatedUsers = users.map(u =>
                              u.name === selectedUser.name ? { ...u, notes: editingValue } : u
                            );
                            setUsers(updatedUsers);
                            setSelectedUser({ ...selectedUser, notes: editingValue });
                            setEditingField(null);
                            setEditingValue('');
                          }
                        }}
                      />
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={e => {
                          e.stopPropagation();
                          const updatedUsers = users.map(u =>
                            u.name === selectedUser.name ? { ...u, notes: editingValue } : u
                          );
                          setUsers(updatedUsers);
                          setSelectedUser({ ...selectedUser, notes: editingValue });
                          setEditingField(null);
                          setEditingValue('');
                        }}
                        sx={{ verticalAlign: 'middle' }}
                      >
                        <CheckIcon fontSize="small" />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      {selectedUser?.notes}
                      <IconButton
                        className="edit-button"
                        size="small"
                        sx={{
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          display: 'none',
                        }}
                        onClick={e => {
                          e.stopPropagation();
                          setEditingField('notes');
                          setEditingValue(selectedUser?.notes || '');
                        }}
                        aria-label="Edit notes"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </>
                  )}
                </Typography>
              </Box>
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

      {/* Keyboard Shortcut Table Button and Dialog */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => setShowShortcutTable(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1500,
        }}
      >
        <AddIcon />
      </Fab>

      <Dialog open={showShortcutTable} onClose={() => setShowShortcutTable(false)}>
        <DialogTitle>Keyboard Shortcuts</DialogTitle>
        <DialogContent>
          <ul>
            <li><strong>G</strong>: Grid view</li>
            <li><strong>L</strong>: List view</li>
            <li><strong>T</strong>: Filter “Today”</li>
            <li><strong>W</strong>: Filter “Week”</li>
            <li><strong>M</strong>: Filter “Month or more”</li>
            <li><strong>P</strong>: Filter “Past”</li>
            <li><strong>Cmd/Ctrl + Enter</strong>: Show this table</li>
          </ul>
        </DialogContent>
      </Dialog>
    </Box>
  );
}