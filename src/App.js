import React, { useRef, useEffect, useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
// import Autocomplete from '@mui/material/Autocomplete'; // Removed duplicate import; now only imported from grouped @mui/material import.
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import PublicIcon from '@mui/icons-material/Public';
import {
  Autocomplete,
  Avatar,
  ListItem,
  ListItemAvatar,
  Box,
  Modal,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Select,
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
  Tabs,
  Tab,
  ButtonGroup,
  ListItemText as MuiListItemText,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import FilterListIcon from '@mui/icons-material/FilterList';
import GridViewIcon from '@mui/icons-material/GridView';
import ListIcon from '@mui/icons-material/List';
import AddIcon from '@mui/icons-material/Add';
import PrintIcon from '@mui/icons-material/Print';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MapIcon from '@mui/icons-material/Map';
import InfoIcon from '@mui/icons-material/Info';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import ChildCareIcon from '@mui/icons-material/ChildCare';
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
import SecurityIcon from '@mui/icons-material/Security';
import NoEncryptionIcon from '@mui/icons-material/NoEncryption';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';

// Country list for nationality selection with flags
const countryList = [
  { code: 'GB', label: 'United Kingdom' },
  { code: 'US', label: 'United States' },
  { code: 'FR', label: 'France' },
  { code: 'DE', label: 'Germany' },
  { code: 'IN', label: 'India' },
  { code: 'CN', label: 'China' },
  { code: 'JP', label: 'Japan' },
  { code: 'AU', label: 'Australia' },
  { code: 'BR', label: 'Brazil' },
  { code: 'ZA', label: 'South Africa' },
  // Add more as needed
];

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
  // Tab index for visitor modal
  const [tabIndex, setTabIndex] = useState(0);

  // State for current date in filter section
  const [currentDate, setCurrentDate] = useState(new Date());

  // Visitor filter menu state and label map
  const [anchorEl, setAnchorEl] = useState(null);
  const map = {
    today: "Today",
    tomorrow: "Tomorrow",
    next7: "Next 7 Days",
    future: "Next Month",
    past: "Past",
  };
  const handleFilterChange = (value) => {
    setVisitorFilter(value);
    setAnchorEl(null);
  };

  // Split‑button menu for Escorted status
  const [escMenuAnchor, setEscMenuAnchor] = useState(null);
  const [printToastOpen, setPrintToastOpen] = useState(false); // Toast for "Print Pass"
  const [printToastText, setPrintToastText] = useState(""); // Custom print toast message
  const [printToastUser, setPrintToastUser] = useState(null);
  const handleEscMenuOpen = (event) => setEscMenuAnchor(event.currentTarget);
  const handleEscMenuClose = () => setEscMenuAnchor(null);
  const handleEscMenuSelect = (status) => {
    // Accepts "Escorted Pass" or "Un-escorted Pass"
    const isEsc = status === 'Escorted Pass';
    const updatedUsers = users.map(u =>
      u.name === selectedUser.name ? { ...u, escorted: isEsc } : u
    );
    setUsers(updatedUsers);
    setSelectedUser({ ...selectedUser, escorted: isEsc });
    handleEscMenuClose();
    setPrintToastOpen(true); // Show toast when menu option selected
    // Close the modal after setting escorted status and showing toast
    handleClose();
  };

  // Helper to close the main modal and reset fields
  function handleClose() {
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
  }

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

  // Ensure Pass Information tab is default when modal opens
  useEffect(() => {
    if (selectedUser) {
      setTabIndex(0);
    }
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
        {/* 🔍 Search Section */}
        <Box
          sx={{
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
                            label={option.escorted ? 'Escorted' : 'Unescorted'}
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
        </Box>
        {/* Main table area in scrollable container */}
        {/* 🔄 Filter and View Toggle Section - Moves with table */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            my: 2,
            width: '100%',
            maxWidth: '2200px',
            mx: 'auto',
            px: 0,
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ButtonGroup variant="outlined">
                <Button
                  onClick={() => {
                    handleFilterChange('today');
                    setCurrentDate(new Date());
                  }}
                  sx={{ textTransform: 'none' }}
                >
                  Today's Visitors
                </Button>
                <Button
                  size="small"
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                >
                  <ArrowDropDownIcon />
                </Button>
              </ButtonGroup>
              <IconButton
                aria-label="Previous day"
                onClick={() =>
                  setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 1))
                }
              >
                <ChevronLeftIcon />
              </IconButton>
              <Typography variant="body2" sx={{ minWidth: 140, textAlign: 'center', px: 1 }}>
                {currentDate.toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </Typography>
              <IconButton
                aria-label="Next day"
                onClick={() =>
                  setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 1))
                }
              >
                <ChevronRightIcon />
              </IconButton>
            </Box>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={() => handleFilterChange('tomorrow')}>Tomorrow</MenuItem>
              <MenuItem onClick={() => handleFilterChange('next7')}>Next 7 Days</MenuItem>
              <MenuItem onClick={() => handleFilterChange('future')}>Next Month</MenuItem>
              <Divider />
              <MenuItem onClick={() => handleFilterChange('past')}>Past</MenuItem>
            </Menu>
          </Box>
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
        <Box
          sx={{
            width: '100%',
            maxWidth: '2200px',
            mt: 0,
            mx: 'auto',
            height: '70vh',
            overflowY: 'auto',
          }}
        >
          {/* 📋 Visitor List - Table View */}
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
                          <TableCell colSpan={7} sx={{ backgroundColor: '#f9f9f9', fontWeight: 'bold', color: '#999' }}>
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
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              cursor: 'pointer',
                              justifyContent: 'space-between',
                              width: '100%',
                            }}
                            onClick={() => setSelectedUser(user)}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar src={user.avatar} sx={{ width: 50, height: 50 }} />
                              <Typography
                                variant="h6"
                                sx={{ fontWeight: 'bold', color: 'primary.main', textDecoration: 'none' }}
                                component="span"
                              >
                                {user.name}
                              </Typography>
                            </Box>
                            <Chip
                              label={user.escorted ? 'Escorted' : 'Unescorted'}
                              size="small"
                              sx={{
                                bgcolor: user.escorted ? '#f8d7da' : '#d4edda',
                                color: user.escorted ? '#721c24' : '#155724',
                                ml: 1,
                              }}
                            />
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
          {/* 🧾 Visitor Grid - Card View */}
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
                          label={user.escorted ? 'Escorted' : 'Unescorted'}
                          size="small"
                          sx={{
                            mt: 1,
                            bgcolor: user.escorted ? '#f8d7da' : '#d4edda',
                            color: user.escorted ? '#721c24' : '#155724',
                          }}
                          clickable={true}
                          onClick={() => {}}
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
      {/* 🪪 New Pass Modal (Triggered by FAB or Cmd/Ctrl + Enter) */}
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
            width: 800,
            maxWidth: '98vw',
            minHeight: '520px',
            p: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Card sx={{ position: 'relative', boxShadow: 'none', borderRadius: 2 }}>
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
            <Grid container sx={{ minHeight: 420 }}>
              {/* Left column */}
              <Grid item xs={12} md="auto" sx={{ bgcolor: '#f5f5f5', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}>
                {/* Avatar with hover overlay for camera icon */}
                <Box
                  sx={{
                    position: 'relative',
                    mb: 2,
                    width: 240,
                    height: 240,
                    '&:hover .avatar-overlay': { opacity: 1, pointerEvents: 'auto' },
                  }}
                >
                  <Avatar
                    src={selectedUser?.avatar}
                    alt={selectedUser?.name}
                    sx={{ width: 240, height: 240, boxShadow: 1, fontSize: 96 }}
                  />
                  {/* Overlay for hover effect */}
                  <Box
                    className="avatar-overlay"
                    sx={{
                      transition: 'opacity 0.2s',
                      opacity: 0,
                      pointerEvents: 'none',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      bgcolor: 'rgba(0,0,0,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      zIndex: 2,
                    }}
                  >
                    <CameraAltIcon sx={{ color: '#fff', fontSize: 40 }} />
                  </Box>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0, textAlign: 'center' }}>
                  {selectedUser?.name}
                </Typography>
                {/* Escorted/Un-escorted Chip and 6-digit number stacked and centered */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <Chip
                    label={selectedUser?.escorted ? 'Escorted' : 'Unescorted'}
                    size="small"
                    sx={{
                      mt: 1,
                      mb: 0.2,
                      bgcolor: selectedUser?.escorted ? '#f8d7da' : '#d4edda',
                      color: selectedUser?.escorted ? '#721c24' : '#155724',
                      display: 'flex',
                      alignSelf: 'center',
                    }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    123 456
                  </Typography>
                </Box>
                <Tabs
                  orientation="vertical"
                  value={tabIndex}
                  onChange={(_, newValue) => setTabIndex(newValue)}
                  sx={{
                    mt: 0,
                    width: '100%',
                    alignItems: 'flex-start',
                    '.MuiTabs-flexContainer': {
                      flexDirection: 'column',
                      gap: 1,
                      width: '100%',
                    },
                  }}
                  TabIndicatorProps={{
                    sx: { left: -16, width: 3, borderRadius: 2, bgcolor: 'primary.main' }
                  }}
                >
                  <Tab
                    label="Pass Information"
                    icon={<BadgeOutlinedIcon sx={{ fontSize: 24 }} />}
                    iconPosition="start"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      fontWeight: tabIndex === 0 ? 'bold' : 'normal',
                      borderRadius: 2,
                      px: 2,
                      py: 1.5,
                      mb: 0.5,
                      backgroundColor: tabIndex === 0 ? 'primary.100' : 'inherit',
                      minHeight: 48,
                      textAlign: 'left',
                      '&:hover': { backgroundColor: '#e0e0e0' },
                    }}
                  />
                  <Tab
                    label="Visitor Profile"
                    icon={<PersonIcon sx={{ fontSize: 24 }} />}
                    iconPosition="start"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      fontWeight: tabIndex === 1 ? 'bold' : 'normal',
                      borderRadius: 2,
                      px: 2,
                      py: 1.5,
                      mb: 0.5,
                      backgroundColor: tabIndex === 1 ? 'primary.100' : 'inherit',
                      minHeight: 48,
                      textAlign: 'left',
                      '&:hover': { backgroundColor: '#e0e0e0' },
                    }}
                  />
                  <Tab
                    label="Host Profile"
                    icon={<SupervisorAccountIcon sx={{ fontSize: 24 }} />}
                    iconPosition="start"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      fontWeight: tabIndex === 2 ? 'bold' : 'normal',
                      borderRadius: 2,
                      px: 2,
                      py: 1.5,
                      mb: 0.5,
                      backgroundColor: tabIndex === 2 ? 'primary.100' : 'inherit',
                      minHeight: 48,
                      textAlign: 'left',
                      '&:hover': { backgroundColor: '#e0e0e0' },
                    }}
                  />
                  <Tab
                    label="Security"
                    icon={<SecurityIcon sx={{ fontSize: 24 }} />}
                    iconPosition="start"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      fontWeight: tabIndex === 3 ? 'bold' : 'normal',
                      borderRadius: 2,
                      px: 2,
                      py: 1.5,
                      mb: 0.5,
                      backgroundColor: tabIndex === 3 ? 'primary.100' : 'inherit',
                      minHeight: 48,
                      textAlign: 'left',
                      '&:hover': { backgroundColor: '#e0e0e0' },
                    }}
                  />
                  <Tab
                    label="Vehicles"
                    icon={<DirectionsCarIcon sx={{ fontSize: 24 }} />}
                    iconPosition="start"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      fontWeight: tabIndex === 4 ? 'bold' : 'normal',
                      borderRadius: 2,
                      px: 2,
                      py: 1.5,
                      mb: 0.5,
                      backgroundColor: tabIndex === 4 ? 'primary.100' : 'inherit',
                      minHeight: 48,
                      textAlign: 'left',
                      '&:hover': { backgroundColor: '#e0e0e0' },
                    }}
                  />
                  <Tab
                    label="Notes"
                    icon={<EditIcon sx={{ fontSize: 24 }} />}
                    iconPosition="start"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      fontWeight: tabIndex === 5 ? 'bold' : 'normal',
                      borderRadius: 2,
                      px: 2,
                      py: 1.5,
                      mb: 0.5,
                      backgroundColor: tabIndex === 5 ? 'primary.100' : 'inherit',
                      minHeight: 48,
                      textAlign: 'left',
                      '&:hover': { backgroundColor: '#e0e0e0' },
                    }}
                  />
                </Tabs>
              </Grid>
              {/* Right column */}
              <Grid item xs={12} md sx={{ p: 3, display: 'flex', flexDirection: 'column', minHeight: 420, position: 'relative' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {[
                      'Pass Information',
                      'Visitor Profile',
                      'Host Profile',
                      'Security',
                      'Vehicles',
                      'Notes'
                    ][tabIndex]}
                  </Typography>
                  {/* Section Content */}
                  {tabIndex === 0 && (
                    <Box>
                      {/* Pass Information Section (Order: Date, Area, Purpose, Details, Divider, Visitor, Number of children, Divider, Vehicle Registration) */}
                      {/* Date */}
                      <MenuItem
                        sx={{ py: 1.5 }}
                        onClick={() => {
                          setEditingField('validDate');
                          setEditingValue(selectedUser.validDate || '24 June – 30 June');
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 0, mr: 2 }}>
                          <CalendarTodayIcon />
                        </ListItemIcon>
                        {editingField === 'validDate' ? (
                          <>
                            <TextField
                              size="small"
                              value={editingValue}
                              onChange={e => setEditingValue(e.target.value)}
                              sx={{ mr: 1, minWidth: 180 }}
                              autoFocus
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  const updatedUsers = users.map(u =>
                                    u.name === selectedUser.name ? { ...u, validDate: editingValue } : u
                                  );
                                  setUsers(updatedUsers);
                                  setSelectedUser({ ...selectedUser, validDate: editingValue });
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
                                  u.name === selectedUser.name ? { ...u, validDate: editingValue } : u
                                );
                                setUsers(updatedUsers);
                                setSelectedUser({ ...selectedUser, validDate: editingValue });
                                setEditingField(null);
                                setEditingValue('');
                              }}
                              sx={{ verticalAlign: 'middle' }}
                            >
                              <CheckIcon fontSize="small" />
                            </IconButton>
                          </>
                        ) : (
                          <MuiListItemText
                            primary="Date"
                            secondary={selectedUser?.validDate || '24 June – 30 June'}
                          />
                        )}
                      </MenuItem>
                      {/* Area */}
                      <MenuItem
                        sx={{ py: 1.5 }}
                        onClick={() => {
                          setEditingField('accessArea');
                          setEditingValue(selectedUser.accessArea || 'Technical Side');
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 0, mr: 2 }}>
                          <MapIcon />
                        </ListItemIcon>
                        {editingField === 'accessArea' ? (
                          <>
                            <TextField
                              size="small"
                              value={editingValue}
                              onChange={e => setEditingValue(e.target.value)}
                              sx={{ mr: 1, minWidth: 180 }}
                              autoFocus
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  const updatedUsers = users.map(u =>
                                    u.name === selectedUser.name ? { ...u, accessArea: editingValue } : u
                                  );
                                  setUsers(updatedUsers);
                                  setSelectedUser({ ...selectedUser, accessArea: editingValue });
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
                                  u.name === selectedUser.name ? { ...u, accessArea: editingValue } : u
                                );
                                setUsers(updatedUsers);
                                setSelectedUser({ ...selectedUser, accessArea: editingValue });
                                setEditingField(null);
                                setEditingValue('');
                              }}
                            >
                              <CheckIcon fontSize="small" />
                            </IconButton>
                          </>
                        ) : (
                          <MuiListItemText
                            primary="Area"
                            secondary={selectedUser?.accessArea || 'Technical Side'}
                          />
                        )}
                      </MenuItem>
                      {/* Purpose */}
                      <MenuItem
                        sx={{ py: 1.5 }}
                        onClick={() => {
                          setEditingField('purpose');
                          setEditingValue(selectedUser.purpose || 'Social');
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 0, mr: 2 }}>
                          <InfoIcon />
                        </ListItemIcon>
                        {editingField === 'purpose' ? (
                          <>
                            <Select
                              size="small"
                              value={editingValue}
                              onChange={e => setEditingValue(e.target.value)}
                              sx={{ mr: 1, minWidth: 140 }}
                              autoFocus
                            >
                              {['Social', 'Work', 'Delivery', 'Contractor', 'Other'].map(option => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={e => {
                                e.stopPropagation();
                                const updatedUsers = users.map(u =>
                                  u.name === selectedUser.name ? { ...u, purpose: editingValue } : u
                                );
                                setUsers(updatedUsers);
                                setSelectedUser({ ...selectedUser, purpose: editingValue });
                                setEditingField(null);
                                setEditingValue('');
                              }}
                              sx={{ verticalAlign: 'middle' }}
                            >
                              <CheckIcon fontSize="small" />
                            </IconButton>
                          </>
                        ) : (
                          <MuiListItemText
                            primary="Purpose"
                            secondary={selectedUser?.purpose || 'Social'}
                          />
                        )}
                      </MenuItem>
                      {/* Details */}
                      <MenuItem
                        sx={{ py: 1.5 }}
                        onClick={() => {
                          setEditingField('details');
                          setEditingValue(selectedUser.details || 'Family visiting for birthday');
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 0, mr: 2 }}>
                          <TextSnippetIcon />
                        </ListItemIcon>
                        {editingField === 'details' ? (
                          <>
                            <TextField
                              size="small"
                              value={editingValue}
                              onChange={e => setEditingValue(e.target.value)}
                              sx={{ mr: 1, minWidth: 180 }}
                              autoFocus
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  const updatedUsers = users.map(u =>
                                    u.name === selectedUser.name ? { ...u, details: editingValue } : u
                                  );
                                  setUsers(updatedUsers);
                                  setSelectedUser({ ...selectedUser, details: editingValue });
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
                                  u.name === selectedUser.name ? { ...u, details: editingValue } : u
                                );
                                setUsers(updatedUsers);
                                setSelectedUser({ ...selectedUser, details: editingValue });
                                setEditingField(null);
                                setEditingValue('');
                              }}
                            >
                              <CheckIcon fontSize="small" />
                            </IconButton>
                          </>
                        ) : (
                          <MuiListItemText
                            primary="Details"
                            secondary={selectedUser?.details || 'Family visiting for birthday'}
                          />
                        )}
                      </MenuItem>
                      {/* Children - moved up to just after Details */}
                      <MenuItem
                        sx={{ py: 1.5 }}
                        onClick={() => {
                          setEditingField('numChildren');
                          setEditingValue(
                            selectedUser.numChildren !== undefined
                              ? String(selectedUser.numChildren)
                              : '0'
                          );
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 0, mr: 2 }}>
                          <ChildCareIcon />
                        </ListItemIcon>
                        {editingField === 'numChildren' ? (
                          <>
                            <TextField
                              size="small"
                              type="number"
                              inputProps={{ min: 0 }}
                              value={editingValue}
                              onChange={e => setEditingValue(e.target.value)}
                              sx={{ mr: 1, minWidth: 80 }}
                              autoFocus
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  const updatedUsers = users.map(u =>
                                    u.name === selectedUser.name
                                      ? { ...u, numChildren: Number(editingValue) }
                                      : u
                                  );
                                  setUsers(updatedUsers);
                                  setSelectedUser({ ...selectedUser, numChildren: Number(editingValue) });
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
                                  u.name === selectedUser.name
                                    ? { ...u, numChildren: Number(editingValue) }
                                    : u
                                );
                                setUsers(updatedUsers);
                                setSelectedUser({ ...selectedUser, numChildren: Number(editingValue) });
                                setEditingField(null);
                                setEditingValue('');
                              }}
                            >
                              <CheckIcon fontSize="small" />
                            </IconButton>
                          </>
                        ) : (
                          <MuiListItemText
                            primary="Children"
                            secondary={
                              selectedUser?.numChildren !== undefined
                                ? selectedUser.numChildren
                                : 0
                            }
                          />
                        )}
                      </MenuItem>
                      {/* Divider between Details/Children and Visitor */}
                      <Divider sx={{ my: 2 }} />
                      {/* Visitor (with avatar, clickable to Visitor Profile tab) */}
                      <Box
                        sx={{ py: 1.5, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                        onClick={() => setTabIndex(1)}
                        component="div"
                        tabIndex={0}
                        role="button"
                        aria-label="Go to Visitor Profile"
                      >
                        <Avatar
                          src={selectedUser?.avatar}
                          sx={{ width: 36, height: 36, mr: 2 }}
                        >
                          {getInitials(selectedUser?.name)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            Visitor
                          </Typography>
                          <Typography variant="body2">{selectedUser?.name}</Typography>
                        </Box>
                      </Box>
                      {/* Host (with avatar, label, clickable to Host Profile tab) */}
                      <Box
                        sx={{ py: 1.5, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                        onClick={() => setTabIndex(2)}
                        component="div"
                        tabIndex={0}
                        role="button"
                        aria-label="Go to Host Profile"
                      >
                        <Avatar
                          src={hostDetails?.avatar}
                          sx={{ width: 36, height: 36, mr: 2 }}
                        >
                          {getInitials(selectedUser?.host)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            Host
                          </Typography>
                          <Typography variant="body2">{selectedUser?.host}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  )}
                  {/* Visitor Profile Tab Content */}
                  {tabIndex === 1 && (
                    <Box>
                      {/* Name */}
                      <MenuItem
                        sx={{ py: 1.5 }}
                        onClick={() => {
                          setEditingField('name');
                          setEditingValue(selectedUser.name);
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 0, mr: 2 }}>
                          <PersonIcon fontSize="small" />
                        </ListItemIcon>
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
                          <MuiListItemText
                            primary="Name"
                            secondary={selectedUser?.name}
                          />
                        )}
                      </MenuItem>
                      {/* Company */}
                      <MenuItem
                        sx={{ py: 1.5 }}
                        onClick={() => {
                          setEditingField('company');
                          setEditingValue(selectedUser.company);
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 0, mr: 2 }}>
                          <BusinessIcon fontSize="small" />
                        </ListItemIcon>
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
                          <MuiListItemText
                            primary="Company"
                            secondary={selectedUser?.company}
                          />
                        )}
                      </MenuItem>
                      {/* Phone */}
                      <MenuItem
                        sx={{ py: 1.5 }}
                        onClick={() => {
                          setEditingField('phone');
                          setEditingValue(selectedUser.phone);
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 0, mr: 2 }}>
                          <PhoneIcon fontSize="small" />
                        </ListItemIcon>
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
                          <MuiListItemText
                            primary="Phone"
                            secondary={selectedUser?.phone}
                          />
                        )}
                      </MenuItem>
                      {/* Email */}
                      <MenuItem
                        sx={{ py: 1.5 }}
                        onClick={() => {
                          setEditingField('email');
                          setEditingValue(selectedUser.email);
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 0, mr: 2 }}>
                          <EmailIcon fontSize="small" />
                        </ListItemIcon>
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
                          <MuiListItemText
                            primary="Email"
                            secondary={selectedUser?.email}
                          />
                        )}
                      </MenuItem>
                      {/* Nationality (with flag) */}
                      <MenuItem
                        sx={{ py: 1.5 }}
                        onClick={() => {
                          setEditingField('nationality');
                          setEditingValue(selectedUser.nationality || 'United Kingdom');
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 0, mr: 2 }}>
                          <PublicIcon sx={{ fontSize: 40 }} />
                        </ListItemIcon>
                        {editingField === 'nationality' ? (
                          <>
                            <Autocomplete
                              options={countryList}
                              getOptionLabel={(option) => option.label}
                              value={countryList.find((c) => c.label === editingValue) || null}
                              onChange={(_, newValue) => {
                                if (newValue) {
                                  setEditingValue(newValue.label);
                                }
                              }}
                              renderOption={(props, option) => (
                                <li {...props}>
                                  <span className={`fi fi-${option.code.toLowerCase()}`} style={{ marginRight: 8 }} />
                                  {option.label}
                                </li>
                              )}
                              sx={{ minWidth: 200, mr: 1 }}
                              renderInput={(params) => <TextField {...params} size="small" autoFocus />}
                            />
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={e => {
                                e.stopPropagation();
                                const updatedUsers = users.map(u =>
                                  u.name === selectedUser.name ? { ...u, nationality: editingValue } : u
                                );
                                setUsers(updatedUsers);
                                setSelectedUser({ ...selectedUser, nationality: editingValue });
                                setEditingField(null);
                                setEditingValue('');
                              }}
                            >
                              <CheckIcon fontSize="small" />
                            </IconButton>
                          </>
                        ) : (
                          <ListItemText
                            primary="Nationality"
                            secondary={selectedUser?.nationality || 'United Kingdom'}
                          />
                        )}
                      </MenuItem>
                    </Box>
                  )}
                  {tabIndex === 2 && (
                    <Box>
                      {/* Host Profile Tab Content */}
                      {hostDetails && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
                          {/* Host avatar and name */}
                          <MenuItem sx={{ py: 1.5 }}>
                            <ListItemIcon sx={{ minWidth: 0, mr: 2 }}>
                              <Avatar src={hostDetails.avatar} alt={hostDetails.name} sx={{ width: 40, height: 40 }}>
                                {getInitials(hostDetails.name)}
                              </Avatar>
                            </ListItemIcon>
                            <MuiListItemText
                              primary={
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                  {hostDetails.name}
                                </Typography>
                              }
                              secondary={hostDetails.company}
                            />
                          </MenuItem>
                          {/* Host phone */}
                          <MenuItem sx={{ py: 1.5 }}>
                            <ListItemIcon sx={{ minWidth: 0, mr: 2 }}>
                              <PhoneIcon fontSize="small" />
                            </ListItemIcon>
                            <MuiListItemText
                              primary="Phone"
                              secondary={hostDetails.phone}
                            />
                          </MenuItem>
                          {/* Host email */}
                          <MenuItem sx={{ py: 1.5 }}>
                            <ListItemIcon sx={{ minWidth: 0, mr: 2 }}>
                              <EmailIcon fontSize="small" />
                            </ListItemIcon>
                            <MuiListItemText
                              primary="Email"
                              secondary={hostDetails.email}
                            />
                          </MenuItem>
                        </Box>
                      )}
                    </Box>
                  )}
                  {tabIndex === 3 && (
                    <Box>
                      <Divider sx={{ mb: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
                          Security
                        </Typography>
                      </Divider>
                      {/* Host field removed from here (now editable in Pass Details tab) */}
                    </Box>
                  )}
                  {tabIndex === 4 && (
                    <Box>
                      {/* Vehicles Tab Content */}
                      <Divider sx={{ mb: 1 }}>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          sx={{ fontWeight: 'bold', letterSpacing: 1 }}
                        >
                          Vehicles
                        </Typography>
                      </Divider>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Typography variant="body2">
                          <strong>Vehicle Registration:</strong> {selectedUser?.vehicleReg || 'None'}
                        </Typography>
                        {/* Add more vehicle-related info here if available */}
                      </Box>
                    </Box>
                  )}
                  {tabIndex === 5 && (
                    <Box
                      sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        pb: 0,
                      }}
                    >
                      <Box sx={{ px: 1, pb: 2 }}>
                        <TextField
                          label="Add a note"
                          placeholder="Type your message..."
                          multiline
                          minRows={3}
                          variant="outlined"
                          fullWidth
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                          <Button
                            variant="contained"
                            onClick={() => {
                              const newNote = {
                                text: editingValue,
                                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                user: getInitials('Kevin Torrington'),
                              };
                              const updatedUsers = users.map(u =>
                                u.name === selectedUser.name
                                  ? {
                                      ...u,
                                      notesTimeline: [...(u.notesTimeline || []), newNote],
                                    }
                                  : u
                              );
                              setUsers(updatedUsers);
                              setSelectedUser(prev => ({
                                ...prev,
                                notesTimeline: [...(prev.notesTimeline || []), newNote],
                              }));
                              setEditingValue('');
                            }}
                            disabled={!editingValue.trim()}
                          >
                            Save Note
                          </Button>
                        </Box>
                      </Box>
                      <Box sx={{ flex: 1, overflowY: 'auto', px: 1, mb: 2 }}>
                        {(selectedUser?.notesTimeline || [
                          { text: 'Arrived early and waited in reception.', time: '09:15', user: 'JS' },
                          { text: 'Requested extension on pass duration.', time: '11:45', user: 'AM' },
                          { text: 'Left premises at 14:30, returned pass.', time: '14:35', user: 'JS' },
                        ]).map((note, idx) => (
                          <Box key={idx} sx={{ mb: 2, display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32 }}>{note.user}</Avatar>
                            <Box>
                              <Typography variant="body2">{note.text}</Typography>
                              <Typography variant="caption" color="text.secondary">{note.time}</Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
                {/* Bottom-right actions: Escorted/Unescorted split-button and Cancel button */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5, gap: 0 }}>
                  <ButtonGroup variant="contained" size="small" sx={{ ml: 2 }}>
                    <Button
                      sx={{
                        textTransform: 'none',
                        flexGrow: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                      onClick={() => {
                        setPrintToastUser(selectedUser);
                        handleClose();
                        setPrintToastText(
                          `Printing ${selectedUser?.escorted ? 'escorted' : 'un-escorted'} pass for ${selectedUser?.name}`
                        );
                        setPrintToastOpen(true);
                      }}
                    >
                      <PrintIcon sx={{ mr: 1 }} />
                      {(selectedUser?.escorted ? 'Escorted Pass' : 'Un-escorted Pass').toUpperCase()}
                    </Button>
                    <Button
                      size="small"
                      aria-controls={Boolean(escMenuAnchor) ? 'esc-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={Boolean(escMenuAnchor) ? 'true' : undefined}
                      onClick={handleEscMenuOpen}
                      sx={{
                        minWidth: 40,
                      }}
                    >
                      <ArrowDropDownIcon />
                    </Button>
                  </ButtonGroup>
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => {
                      setSelectedUser(null);
                      setInputValue('');
                      setValue(null);
                      setLastFourDigits('');
                      setEditingField(null);
                      setEditingValue('');
                    }}
                    sx={{ ml: 2 }}
                  >
                    Cancel
                  </Button>
                  <Menu
                    id="esc-menu"
                    anchorEl={escMenuAnchor}
                    open={Boolean(escMenuAnchor)}
                    onClose={handleEscMenuClose}
                  >
                    <MenuItem onClick={() => handleEscMenuSelect('Escorted Pass')}>{'Escorted Pass'.toUpperCase()}</MenuItem>
                    <MenuItem onClick={() => handleEscMenuSelect('Un-escorted Pass')}>{'Un-escorted Pass'.toUpperCase()}</MenuItem>
                  </Menu>
                </Box>
              </Grid>
            </Grid>
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
      {/* Print Pass Toast Snackbar (bottom center, autoHide) */}
      {/* Print Pass Toast Snackbar (bottom center, autoHide) */}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={printToastOpen}
        autoHideDuration={3000}
        onClose={() => setPrintToastOpen(false)}
      >
        {/* Custom SnackbarContent with avatar and message */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            bgcolor: '#e6f4ea',
            px: 2,
            py: 1,
            borderRadius: 1,
            boxShadow: 1,
            minWidth: 300,
          }}
        >
          <Avatar
            src={printToastUser?.avatar}
            alt={printToastUser?.name}
            sx={{ width: 32, height: 32 }}
          />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              {printToastText ||
                (printToastUser
                  ? `Printing ${printToastUser.escorted ? 'escorted' : 'un-escorted'} pass for ${printToastUser.name}`
                  : 'Printing pass')}
            </Typography>
          </Box>
        </Box>
      </Snackbar>

      {/* ➕ Floating Action Button for New Pass */}
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