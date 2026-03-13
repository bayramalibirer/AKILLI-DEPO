import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2 as Grid,
  IconButton,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography
} from "@mui/material";
import Alert from "@mui/material/Alert";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import {
  Location,
  Product,
  StockMovement,
  createProduct,
  createStockMovement,
  deleteProduct,
  fetchLocationsPaged,
  fetchProductsPaged,
  fetchStockMovementsPaged,
  updateProduct
} from "./api";

const DEFAULT_COMPANY_ID = "demo-company";

interface ProductFormState {
  id?: number;
  productCode: string;
  productName: string;
  description?: string;
  unit?: string;
}

interface LocationFormState {
  locationCode: string;
  locationName: string;
  zone?: string;
  priority?: number;
}

interface MovementFormState {
  productId?: number;
  warehouseLocationId?: number;
  movementType: 1 | 2;
  quantity: number;
  referenceNo?: string;
  note?: string;
}

function App() {
  const [tab, setTab] = useState<"products" | "movements">("products");

  const [products, setProducts] = useState<Product[]>([]);
  const [productPage, setProductPage] = useState(0);
  const [productPageSize, setProductPageSize] = useState(25);
  const [productRowCount, setProductRowCount] = useState(0);
  const [productSearch, setProductSearch] = useState("");
  const [productLoading, setProductLoading] = useState(false);

  const [locations, setLocations] = useState<Location[]>([]);

  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [movementPage, setMovementPage] = useState(0);
  const [movementPageSize, setMovementPageSize] = useState(25);
  const [movementRowCount, setMovementRowCount] = useState(0);
  const [movementLoading, setMovementLoading] = useState(false);
  const [movementFilterProductId, setMovementFilterProductId] = useState<number | "">("");
  const [movementFilterLocationId, setMovementFilterLocationId] = useState<number | "">("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormState>({
    productCode: "",
    productName: "",
    description: "",
    unit: ""
  });

  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [locationForm, setLocationForm] = useState<LocationFormState>({
    locationCode: "",
    locationName: "",
    zone: "",
    priority: undefined
  });

  const [movementDialogOpen, setMovementDialogOpen] = useState(false);
  const [movementForm, setMovementForm] = useState<MovementFormState>({
    movementType: 1,
    quantity: 1,
    referenceNo: "",
    note: ""
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"error" | "success" | "info">("info");

  const summaryCards = useMemo(
    () => [
      { label: "Toplam Ürün", value: productRowCount.toString() },
      { label: "Toplam Hareket", value: movementRowCount.toString() },
      { label: "Aktif Şirket", value: DEFAULT_COMPANY_ID }
    ],
    [productRowCount, movementRowCount]
  );

  const loadProducts = async () => {
    setProductLoading(true);
    try {
      const res = await fetchProductsPaged({
        companyId: DEFAULT_COMPANY_ID,
        page: productPage + 1,
        pageSize: productPageSize,
        search: productSearch.trim() || undefined
      });
      setProducts(res.data);
      setProductRowCount(res.totalCount);
    } catch (e) {
      console.error(e);
    } finally {
      setProductLoading(false);
    }
  };

  const loadLocations = async () => {
    try {
      const res = await fetchLocationsPaged({
        companyId: DEFAULT_COMPANY_ID,
        page: 1,
        pageSize: 200,
        search: undefined
      });
      setLocations(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadMovements = async () => {
    setMovementLoading(true);
    try {
      const res = await fetchStockMovementsPaged({
        companyId: DEFAULT_COMPANY_ID,
        page: movementPage + 1,
        pageSize: movementPageSize,
        productId: movementFilterProductId === "" ? undefined : movementFilterProductId,
        warehouseLocationId: movementFilterLocationId === "" ? undefined : movementFilterLocationId
      });
      setMovements(res.data);
      setMovementRowCount(res.totalCount);
    } catch (e) {
      console.error(e);
    } finally {
      setMovementLoading(false);
    }
  };

  useEffect(() => {
    void loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productPage, productPageSize]);

  useEffect(() => {
    void loadMovements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movementPage, movementPageSize, movementFilterProductId, movementFilterLocationId]);

  useEffect(() => {
    void loadLocations();
  }, []);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setProductPage(0);
      void loadProducts();
    }
  };

  const openCreateDialog = () => {
    setSelectedProduct(null);
    setForm({ productCode: "", productName: "", description: "", unit: "" });
    setDialogOpen(true);
  };

  const openEditDialog = (p: Product) => {
    setSelectedProduct(p);
    setForm({
      id: p.id,
      productCode: p.productCode,
      productName: p.productName,
      description: p.description,
      unit: p.unit
    });
    setDialogOpen(true);
  };

  const openDeleteDialog = (p: Product) => {
    setSelectedProduct(p);
    setDeleteOpen(true);
  };

  const handleDialogSave = async () => {
    if (!form.productName.trim() || (!selectedProduct && !form.productCode.trim())) return;

    try {
      if (selectedProduct) {
        await updateProduct({
          companyId: DEFAULT_COMPANY_ID,
          id: selectedProduct.id,
          productName: form.productName.trim(),
          description: form.description?.trim(),
          unit: form.unit?.trim()
        });
      } else {
        await createProduct({
          companyId: DEFAULT_COMPANY_ID,
          productCode: form.productCode.trim(),
          productName: form.productName.trim(),
          description: form.description?.trim(),
          unit: form.unit?.trim()
        });
      }
      setDialogOpen(false);
      setProductPage(0);
      await loadProducts();
    } catch (e) {
      console.error(e);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct) return;
    try {
      await deleteProduct({ companyId: DEFAULT_COMPANY_ID, id: selectedProduct.id });
      setDeleteOpen(false);
      setProductPage(0);
      await loadProducts();
    } catch (e) {
      console.error(e);
    }
  };

  const columns: GridColDef<Product>[] = [
    { field: "productCode", headerName: "Kod", flex: 1, minWidth: 120 },
    { field: "productName", headerName: "Ad", flex: 2, minWidth: 160 },
    { field: "unit", headerName: "Birim", width: 100 },
    { field: "description", headerName: "Açıklama", flex: 2, minWidth: 200 },
    {
      field: "actions",
      headerName: "",
      sortable: false,
      filterable: false,
      width: 120,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton size="small" onClick={() => openEditDialog(params.row)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => openDeleteDialog(params.row)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      )
    }
  ];

  const handleProductPaginationChange = (model: GridPaginationModel) => {
    setProductPage(model.page);
    setProductPageSize(model.pageSize);
  };

  const movementColumns: GridColDef<StockMovement>[] = [
    { field: "movementAtUtc", headerName: "Tarih (UTC)", flex: 1.2, minWidth: 180 },
    { field: "productId", headerName: "ÜrünId", width: 110 },
    { field: "warehouseLocationId", headerName: "LokasyonId", width: 120 },
    {
      field: "movementType",
      headerName: "Tip",
      width: 120,
      valueGetter: (v) => (v === 1 ? "Giriş" : v === 2 ? "Çıkış" : v)
    },
    { field: "quantity", headerName: "Miktar", width: 120 },
    { field: "referenceNo", headerName: "Ref", width: 140 },
    { field: "note", headerName: "Not", flex: 1.2, minWidth: 160 }
  ];

  const handleMovementPaginationChange = (model: GridPaginationModel) => {
    setMovementPage(model.page);
    setMovementPageSize(model.pageSize);
  };

  const openLocationCreateDialog = () => {
    setLocationForm({ locationCode: "", locationName: "", zone: "", priority: undefined });
    setLocationDialogOpen(true);
  };

  const openMovementDialog = () => {
    setMovementForm({
      movementType: 1,
      quantity: 1,
      referenceNo: "",
      note: "",
      productId: products[0]?.id,
      warehouseLocationId: locations[0]?.id
    });
    setMovementDialogOpen(true);
  };

  const handleCreateMovement = async () => {
    if (!movementForm.productId || !movementForm.warehouseLocationId) return;
    if (movementForm.quantity <= 0) return;
    try {
      await createStockMovement({
        companyId: DEFAULT_COMPANY_ID,
        productId: movementForm.productId,
        warehouseLocationId: movementForm.warehouseLocationId,
        movementType: movementForm.movementType,
        quantity: movementForm.quantity,
        referenceNo: movementForm.referenceNo?.trim(),
        note: movementForm.note?.trim()
      });
      setMovementDialogOpen(false);
      setMovementPage(0);
      await loadMovements();
      setSnackbarMessage("Stok hareketi kaydedildi.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 400) {
        const msg = (e.response.data as { message?: string })?.message;
        if (msg) {
          setSnackbarMessage(msg);
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          return;
        }
      }
      setSnackbarMessage("Bir hata oluştu. Lütfen tekrar deneyin.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error(e);
    }
  };

  const cardIcons = [
  <Inventory2OutlinedIcon key="0" sx={{ fontSize: 28, color: "primary.main" }} />,
  <LocalShippingOutlinedIcon key="1" sx={{ fontSize: 28, color: "secondary.main" }} />,
  <BusinessCenterOutlinedIcon key="2" sx={{ fontSize: 28, color: "primary.dark" }} />
];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: "#0f766e",
          borderBottom: "3px solid",
          borderColor: "secondary.main"
        }}
      >
        <Toolbar sx={{ py: 1.5, color: "#fff" }}>
          <Inventory2OutlinedIcon sx={{ mr: 1.5, fontSize: 32, color: "#fff" }} />
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: "-0.02em", color: "#fff" }}>
            Akıllı Depo Yönetimi
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {summaryCards.map((card, idx) => (
            <Grid key={card.label} size={{ xs: 12, sm: 4 }}>
              <Card
                sx={{
                  overflow: "visible",
                  borderLeft: "4px solid",
                  borderColor: idx === 0 ? "primary.main" : idx === 1 ? "secondary.main" : "primary.dark",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 24px rgba(15, 118, 110, 0.12)"
                  }
                }}
              >
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, py: 2.5 }}>
                  <Box sx={{ p: 1.25, bgcolor: "rgba(13, 148, 136, 0.08)", borderRadius: 2, flexShrink: 0 }}>
                    {cardIcons[idx]}
                  </Box>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>
                      {card.label}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: "primary.dark", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {card.value}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Card sx={{ overflow: "hidden" }}>
          <CardContent sx={{ p: 3 }}>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              sx={{
                mb: 3,
                "& .Mui-selected": { color: "primary.main" }
              }}
            >
              <Tab value="products" label="Ürünler" />
              <Tab value="movements" label="Stok Hareketleri" />
            </Tabs>

          {tab === "products" && (
            <>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
            sx={{ mb: 2 }}
          >
            <TextField
              label="Ara (kod / ad)"
              size="small"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              sx={{ maxWidth: 360 }}
            />
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" onClick={openLocationCreateDialog}>
                Lokasyon Ekle
              </Button>
              <Button variant="contained" color="secondary" onClick={openCreateDialog}>
                Yeni Ürün
              </Button>
            </Stack>
          </Stack>

          <Box sx={{ height: 520, width: "100%" }}>
            <DataGrid
              rows={products}
              columns={columns}
              loading={productLoading}
              disableColumnMenu
              disableRowSelectionOnClick
              paginationMode="server"
              paginationModel={{ page: productPage, pageSize: productPageSize }}
              onPaginationModelChange={handleProductPaginationChange}
              rowCount={productRowCount}
              pageSizeOptions={[10, 25, 50]}
              getRowId={(row) => row.id}
            />
          </Box>
            </>
          )}

          {tab === "movements" && (
            <>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                sx={{ mb: 2 }}
              >
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Select
                    size="small"
                    displayEmpty
                    value={movementFilterProductId}
                    onChange={(e) =>
                      setMovementFilterProductId(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    sx={{ minWidth: 220 }}
                  >
                    <MenuItem value="">Ürün (Tümü)</MenuItem>
                    {products.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.productCode} — {p.productName}
                      </MenuItem>
                    ))}
                  </Select>
                  <Select
                    size="small"
                    displayEmpty
                    value={movementFilterLocationId}
                    onChange={(e) =>
                      setMovementFilterLocationId(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    sx={{ minWidth: 220 }}
                  >
                    <MenuItem value="">Lokasyon (Tümü)</MenuItem>
                    {locations.map((l) => (
                      <MenuItem key={l.id} value={l.id}>
                        {l.locationCode} — {l.locationName}
                      </MenuItem>
                    ))}
                  </Select>
                </Stack>
                <Button variant="contained" color="secondary" onClick={openMovementDialog}>
                  Giriş/Çıkış Yap
                </Button>
              </Stack>

              <Box sx={{ height: 520, width: "100%" }}>
                <DataGrid
                  rows={movements}
                  columns={movementColumns}
                  loading={movementLoading}
                  disableColumnMenu
                  disableRowSelectionOnClick
                  paginationMode="server"
                  paginationModel={{ page: movementPage, pageSize: movementPageSize }}
                  onPaginationModelChange={handleMovementPaginationChange}
                  rowCount={movementRowCount}
                  pageSizeOptions={[10, 25, 50]}
                  getRowId={(row) => row.id}
                />
              </Box>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{selectedProduct ? "Ürünü Düzenle" : "Yeni Ürün"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {!selectedProduct && (
              <TextField
                label="Ürün Kodu"
                value={form.productCode}
                onChange={(e) => setForm((f) => ({ ...f, productCode: e.target.value }))}
                required
              />
            )}
            <TextField
              label="Ürün Adı"
              value={form.productName}
              onChange={(e) => setForm((f) => ({ ...f, productName: e.target.value }))}
              required
            />
            <TextField
              label="Birim"
              value={form.unit ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
            />
            <TextField
              label="Açıklama"
              value={form.description ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              multiline
              minRows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Vazgeç</Button>
          <Button variant="contained" onClick={handleDialogSave}>
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Silme Onayı</DialogTitle>
        <DialogContent>
          <Typography>
            {selectedProduct
              ? `“${selectedProduct.productName}” ürününü silmek istediğinize emin misiniz?`
              : "Bu kaydı silmek istediğinize emin misiniz?"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Vazgeç</Button>
          <Button color="error" variant="contained" onClick={handleConfirmDelete}>
            Sil
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={locationDialogOpen}
        onClose={() => setLocationDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Yeni Lokasyon</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Lokasyon Kodu"
              value={locationForm.locationCode}
              onChange={(e) => setLocationForm((f) => ({ ...f, locationCode: e.target.value }))}
              required
            />
            <TextField
              label="Lokasyon Adı"
              value={locationForm.locationName}
              onChange={(e) => setLocationForm((f) => ({ ...f, locationName: e.target.value }))}
              required
            />
            <TextField
              label="Bölge (Zone)"
              value={locationForm.zone ?? ""}
              onChange={(e) => setLocationForm((f) => ({ ...f, zone: e.target.value }))}
            />
            <TextField
              label="Öncelik"
              type="number"
              value={locationForm.priority ?? ""}
              onChange={(e) =>
                setLocationForm((f) => ({
                  ...f,
                  priority: e.target.value === "" ? undefined : Number(e.target.value)
                }))
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLocationDialogOpen(false)}>Vazgeç</Button>
          <Button
            variant="contained"
            onClick={async () => {
              if (!locationForm.locationCode.trim() || !locationForm.locationName.trim()) return;
              try {
                const { createLocation } = await import("./api");
                await createLocation({
                  companyId: DEFAULT_COMPANY_ID,
                  locationCode: locationForm.locationCode.trim(),
                  locationName: locationForm.locationName.trim(),
                  zone: locationForm.zone?.trim(),
                  priority: locationForm.priority
                });
                setLocationDialogOpen(false);
                await loadLocations();
              } catch (e) {
                console.error(e);
              }
            }}
          >
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={movementDialogOpen}
        onClose={() => setMovementDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Stok Giriş / Çıkış</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Select
              value={movementForm.movementType}
              onChange={(e) =>
                setMovementForm((f) => ({ ...f, movementType: Number(e.target.value) as 1 | 2 }))
              }
            >
              <MenuItem value={1}>Giriş</MenuItem>
              <MenuItem value={2}>Çıkış</MenuItem>
            </Select>
            <Select
              displayEmpty
              value={movementForm.productId ?? ""}
              onChange={(e) =>
                setMovementForm((f) => ({
                  ...f,
                  productId: e.target.value === "" ? undefined : Number(e.target.value)
                }))
              }
            >
              <MenuItem value="">Ürün seç</MenuItem>
              {products.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.productCode} — {p.productName}
                </MenuItem>
              ))}
            </Select>
            <Select
              displayEmpty
              value={movementForm.warehouseLocationId ?? ""}
              onChange={(e) =>
                setMovementForm((f) => ({
                  ...f,
                  warehouseLocationId: e.target.value === "" ? undefined : Number(e.target.value)
                }))
              }
            >
              <MenuItem value="">Lokasyon seç</MenuItem>
              {locations.map((l) => (
                <MenuItem key={l.id} value={l.id}>
                  {l.locationCode} — {l.locationName}
                </MenuItem>
              ))}
            </Select>
            <TextField
              label="Miktar"
              type="number"
              value={movementForm.quantity}
              onChange={(e) => setMovementForm((f) => ({ ...f, quantity: Number(e.target.value) }))}
            />
            <TextField
              label="Reference No"
              value={movementForm.referenceNo ?? ""}
              onChange={(e) => setMovementForm((f) => ({ ...f, referenceNo: e.target.value }))}
            />
            <TextField
              label="Not"
              value={movementForm.note ?? ""}
              onChange={(e) => setMovementForm((f) => ({ ...f, note: e.target.value }))}
              multiline
              minRows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMovementDialogOpen(false)}>Vazgeç</Button>
          <Button variant="contained" onClick={handleCreateMovement}>
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      </Container>
    </Box>
  );
}

export default App;

