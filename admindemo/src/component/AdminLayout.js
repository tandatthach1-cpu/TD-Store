import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import StorefrontIcon from "@material-ui/icons/Storefront";
import { AppBar, Layout, MenuItemLink, TitlePortal, UserMenu } from "react-admin";

const useStyles = makeStyles((theme) => ({
  appBarRoot: {
    "& .RaAppBar-title": {
      overflow: "visible",
      flex: 1,
    },
  },
  titleWrap: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1.5),
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 14,
    objectFit: "cover",
    background: "rgba(255,255,255,0.12)",
    boxShadow: "0 10px 24px rgba(15,23,42,0.25)",
  },
  titleText: {
    display: "flex",
    flexDirection: "column",
    lineHeight: 1.1,
  },
  brand: {
    fontWeight: 900,
    letterSpacing: "0.06em",
  },
  subtitle: {
    opacity: 0.8,
    fontSize: 12,
  },
  spacer: {
    flex: 1,
  },
}));

const AdminMenu = (props) => (
  <UserMenu {...props}>
    <MenuItemLink to="/" primaryText="Mở trang bán hàng" leftIcon={<StorefrontIcon />} />
  </UserMenu>
);

const AdminTopBar = (props) => {
  const classes = useStyles();

  return (
    <AppBar {...props} className={classes.appBarRoot} userMenu={<AdminMenu />}>
      <Box className={classes.titleWrap}>
        <img src="/logo.jpg" alt="TD PHONE" className={classes.logo} />
        <Box className={classes.titleText}>
          <Typography variant="h6" className={classes.brand}>
            TD PHONE
          </Typography>
          <Typography variant="caption" className={classes.subtitle}>
            Bảng quản trị hiện đại
          </Typography>
        </Box>
      </Box>
      <Box className={classes.spacer} />
      <TitlePortal />
    </AppBar>
  );
};

const AdminLayout = (props) => (
  <Layout
    {...props}
    appBar={AdminTopBar}
    sx={{
      "& .RaLayout-content": {
        padding: "24px 24px 32px",
        position: "relative",
        zIndex: 1,
      },
      "& .RaLayout-contentWithSidebar": {
        alignItems: "stretch",
      },
      "& .RaSidebar-drawerPaper": {
        zIndex: 1400,
      },
    }}
  />
);

export default AdminLayout;
