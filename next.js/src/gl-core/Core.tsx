// /Users/goldlabel/GitHub/abgeschottet-ki/next.js/src/gl-core/Core.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
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
import { KI } from './components/KI';
import { Icon, Feedback, useSlice, useDispatch, reset } from '../gl-core';
import { initDB, DB, Table } from './components/DB';

const drawerWidth = 240;
const defaultIcon = 'settings';
const baseUrl = 'http://localhost:1975';

export const nav = [
  { label: 'Upload', icon: 'upload', route: `${baseUrl}/upload` },
  { label: 'KI', icon: 'ki', route: `${baseUrl}/ki` },
  {
    label: 'Database',
    icon: 'database',
    route: `${baseUrl}/database`,
  },
  {
    label: 'Code',
    icon: 'github',
    url: `https://github.com/goldlabel-apps/abgeschottet-ki`,
  },
  { label: 'Reset', icon: 'reset', onClick: 'handleReset' },
];

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  borderRight: `1px solid ${theme.palette.divider}`,
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
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
  const [open, setOpen] = React.useState(true);
  const pathname = usePathname();
  const { db } = useSlice();
  const dispatch = useDispatch();
  const hasInitRun = useRef(false);

  useEffect(() => {
    if (!hasInitRun.current && (!db || Object.keys(db).length === 0)) {
      hasInitRun.current = true;
      dispatch(initDB());
    }
  }, [db, dispatch]);
  
  const handleReset = () => {
    dispatch(reset());
  };

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const renderNavItems = (items: typeof nav): React.ReactNode =>
    items.map((item, idx) => {
      const uniqueKey = item.route || (item as any).url || `${item.label}-${idx}`;

      if ((item as any).onClick === 'handleReset') {
        return (
          <ListItem key={uniqueKey} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={handleReset}
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
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
        );
      }

      const href = (item as any).route || (item as any).url || '#';
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
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
        </React.Fragment>
      );
    });

  const renderContent = () => {
    if (!pathname) return null;
    const path = pathname.toLowerCase();

    const matchTable = path.match(/^\/database\/table\/([^/]+)/);
    if (matchTable) {
      return <Table />;
    }
    if (path.startsWith('/database')) {
      return <DB />;
    }
    if (path.startsWith('/ki')) {
      return <KI />;
    }
    if (path.startsWith('/upload')) {
      return <Typography variant="body1">Upload component goes here.</Typography>;
    }
    return (
      <>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Welcome to Abgeschottet KI
        </Typography>
        <Typography variant="body2">
          Select a menu item from the drawer.
        </Typography>
      </>
    );
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Feedback />
      <AppBar position="fixed" open={open} elevation={1}>
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ marginRight: 3, ...(open && { display: 'none' }) }}
          >
            <Icon icon="right" />
          </IconButton>
          <Typography variant="h6" noWrap>
            Abgeschottet KI
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            <Icon icon="left" />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>{renderNavItems(nav)}</List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {renderContent()}
      </Box>
    </Box>
  );
}
