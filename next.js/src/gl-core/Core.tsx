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
import { usePathname } from 'next/navigation';
import { Icon } from './cartridges/Theme';
import { DB, KI, Table } from './';
import { useDispatch } from '../gl-core';
import { reset } from '../gl-core/actions/reset';

const drawerWidth = 240;
const defaultIcon = 'settings';

export const baseUrl = 'http://localhost:1975';

export const nav = [
  { label: 'Upload', icon: 'upload', route: `${baseUrl}/upload` },
  { label: 'KI', icon: 'ki', route: `${baseUrl}/ki` },
  {
    label: 'Database',
    icon: 'database',
    route: `${baseUrl}/database`,
    // children: [
    //   {
    //     label: 'PDFs',
    //     icon: 'table',
    //     route: `${baseUrl}/database/tables/pdf`,
    //   },
    //   {
    //     label: 'KI',
    //     icon: 'table',
    //     route: `${baseUrl}/database/tables/ki`,
    //   },
    // ],
  },
  {
    label: 'Code',
    icon: 'github',
    url: `https://github.com/goldlabel-apps/abgeschottet-ki`,
  },
  // special Reset item
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
  const dispatch = useDispatch();

  const handleReset = () => {
    dispatch(reset() as any);
  };

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  // Render nav items recursively
  const renderNavItems = (items: typeof nav): React.ReactNode =>
    items.map((item, idx) => {
      const uniqueKey = item.route || (item as any).url || `${item.label}-${idx}`;

      // handle special onClick nav items (like Reset)
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
          {item.children && renderNavItems(item.children)}
        </React.Fragment>
      );
    });

  const renderContent = () => {
    if (!pathname) return null;
    const path = pathname.toLowerCase();

    const matchTable = path.match(/^\/database\/tables\/([^/]+)/);
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
        <Typography variant="h5" sx={{ mb: 2 }}>
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
