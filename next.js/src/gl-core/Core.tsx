// /Users/goldlabel/GitHub/abgeschottet-ki/next.js/src/gl-core/Core.tsx
'use client';

import * as React from 'react';
import {
  Box,
  CssBaseline,
  Typography,
  Toolbar,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { Icon } from './cartridges/Theme';

const drawerWidth = 240;
const defaultIcon = 'settings';

export const baseUrl = 'http://localhost:1975';

export const nav = [
  {
    label: 'KI',
    icon: 'ki',
    route: `${baseUrl}/ki`,
  },
  {
    label: 'Upload',
    icon: 'upload',
    route: `${baseUrl}/upload`,
  },
  {
    label: 'Database',
    icon: 'database',
    route: `${baseUrl}/database`,
    children: [
          {
            label: 'PDFs',
            icon: 'table',
            route: `${baseUrl}/database/tables/pdf`,
          },
          {
            label: 'KI',
            icon: 'table',
            route: `${baseUrl}/database/tables/ki`,
          },
        ],
  },
  {
    label: 'Code',
    icon: 'github',
    url: `https://github.com/goldlabel-apps/abgeschottet-ki`,
  },
  {
    label: 'Reset',
    icon: 'reset',
    route: `${baseUrl}/`,
  },
];

// Drawer open/close styles
const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: '#f8f8f8',
  borderRight: `1px solid ${theme.palette.divider}`,
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  backgroundColor: '#f8f8f8',
  borderRight: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: '#5E7978',
  color: '#fff',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

export default function Core() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  // Render nav items recursively with unique keys
  const renderNavItems = (items: typeof nav, depth = 0): React.ReactNode => {
    return items.map((item, idx) => {
      const uniqueKey = item.route || (item as any).url || `${item.label}-${idx}`;
      const href = item.route || (item as any).url || '#';
      const isExternal = Boolean((item as any).url);

      return (
        <React.Fragment key={uniqueKey}>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              component="a"
              href={href}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <Icon icon={(item.icon || defaultIcon) as any} />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                secondary={open ? item.description : null}
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
          {item.children && item.children.length > 0 && renderNavItems(item.children, depth + 1)}
        </React.Fragment>
      );
    });
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} elevation={1}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ marginRight: 3, ...(open && { display: 'none' }) }}
          >
            <Icon icon={"right"} />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Abgeschottet KI
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            <Icon icon={"left"} />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>{renderNavItems(nav)}</List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Typography variant="body1" sx={{ mb: 2 }}>
          This is a refactored layout with our style and MUI working as a client component.
        </Typography>
        <Typography variant="body2">
          Add your page content here.
        </Typography>
      </Box>
    </Box>
  );
}
