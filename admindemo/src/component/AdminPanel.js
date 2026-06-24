import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Chip, Divider, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import StorefrontIcon from "@material-ui/icons/Storefront";
import ReceiptIcon from "@material-ui/icons/Receipt";
import PeopleIcon from "@material-ui/icons/People";
import StarsIcon from "@material-ui/icons/Stars";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import ImageIcon from "@material-ui/icons/Image";

const apiUrl = "http://localhost:8080/api/adminStats";

const statLabels = [
  { key: "products", label: "Sản phẩm", icon: StorefrontIcon, tone: "#e11d48" },
  { key: "categories", label: "Danh mục", icon: ImageIcon, tone: "#0ea5e9" },
  { key: "brands", label: "Thương hiệu", icon: StarsIcon, tone: "#f59e0b" },
  { key: "orders", label: "Đơn hàng", icon: ReceiptIcon, tone: "#8b5cf6" },
  { key: "customers", label: "Khách hàng", icon: PeopleIcon, tone: "#10b981" },
  { key: "reviews", label: "Đánh giá", icon: StarsIcon, tone: "#ef4444" },
  { key: "slideShows", label: "Trình chiếu", icon: ImageIcon, tone: "#14b8a6" },
  { key: "contacts", label: "Liên hệ", icon: PeopleIcon, tone: "#6366f1" },
  { key: "coupons", label: "Mã giảm giá", icon: LocalOfferIcon, tone: "#f97316" },
  { key: "adminAccounts", label: "Quản trị", icon: PeopleIcon, tone: "#0f172a" },
];

const formatNumber = (value) =>
  new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const useStyles = makeStyles((theme) => ({
  hero: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 24,
    marginBottom: theme.spacing(3),
    background:
      "linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.95) 55%, rgba(225,29,72,0.82) 100%)",
    color: "#fff",
    boxShadow: "0 20px 40px rgba(15,23,42,0.18)",
  },
  heroGlow: {
    position: "absolute",
    right: -80,
    top: -70,
    width: 280,
    height: 280,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.08)",
    filter: "blur(10px)",
  },
  heroInner: {
    position: "relative",
    zIndex: 1,
    padding: theme.spacing(4),
    display: "grid",
    gap: theme.spacing(2),
    gridTemplateColumns: "1.4fr 0.8fr",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      gridTemplateColumns: "1fr",
    },
  },
  miniChip: {
    color: "#fff",
    background: "rgba(255,255,255,0.12)",
    fontWeight: 700,
  },
  heroTitle: {
    fontWeight: 900,
    letterSpacing: "-0.03em",
  },
  heroText: {
    color: "rgba(255,255,255,0.82)",
    marginTop: theme.spacing(1),
    maxWidth: 720,
  },
  statCard: {
    height: "100%",
    borderRadius: 22,
    border: "1px solid rgba(15,23,42,0.06)",
    transition: "transform 180ms ease, box-shadow 180ms ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 18px 38px rgba(15,23,42,0.12)",
    },
  },
  statIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    display: "grid",
    placeItems: "center",
    color: "#fff",
  },
}));

const AdminPanel = () => {
  const classes = useStyles();
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetch(apiUrl)
      .then((response) => response.json())
      .then(setStats)
      .catch(() => setStats({}));
  }, []);

  return (
    <div>
      <Box className={classes.hero}>
        <div className={classes.heroGlow} />
        <Box className={classes.heroInner}>
          <div>
            <Chip className={classes.miniChip} label="Tổng quan hệ thống" />
            <Typography variant="h4" className={classes.heroTitle} style={{ marginTop: 16 }}>
              Điều hành cửa hàng TD PHONE trong một màn hình
            </Typography>
            <Typography variant="body1" className={classes.heroText}>
              Theo dõi doanh thu, sản phẩm, đơn hàng và nội dung theo thời gian thực với bố cục hiện đại, dễ đọc và
              tối ưu cho thao tác quản trị nhanh.
            </Typography>
          </div>

          <Card style={{ background: "rgba(255,255,255,0.12)", color: "#fff", backdropFilter: "blur(10px)" }}>
            <CardContent>
              <Typography variant="overline" style={{ opacity: 0.8 }}>
                Doanh thu
              </Typography>
              <Typography variant="h3" style={{ fontWeight: 900 }}>
                {formatNumber(stats.revenue)} đ
              </Typography>
              <Typography variant="body2" style={{ opacity: 0.82 }}>
                Tổng doanh thu đang được tổng hợp từ toàn bộ đơn hàng.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Box mb={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" style={{ fontWeight: 900, marginBottom: 8 }}>
              Truy cập nhanh
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Tất cả module chính đã được Việt hóa và sắp xếp để thao tác nhanh hơn.
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Grid container spacing={3}>
        {statLabels.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.key}>
            <Card className={classes.statCard}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography color="textSecondary" style={{ fontWeight: 700 }}>
                    {item.label}
                  </Typography>
                  <Box className={classes.statIconWrap} style={{ background: item.tone }}>
                    <item.icon fontSize="small" />
                  </Box>
                </Box>
                <Typography variant="h4" style={{ fontWeight: 900, lineHeight: 1 }}>
                  {formatNumber(stats[item.key])}
                </Typography>
                <Divider style={{ margin: "16px 0" }} />
                <Typography variant="body2" color="textSecondary">
                  Số liệu cập nhật tự động từ backend quản trị.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default AdminPanel;
