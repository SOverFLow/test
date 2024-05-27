// MUI Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import InventoryIcon from "@mui/icons-material/Inventory";
import EngineeringIcon from "@mui/icons-material/Engineering";
import SchoolIcon from "@mui/icons-material/School";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PeopleIcon from "@mui/icons-material/People";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ContactsIcon from "@mui/icons-material/Contacts";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import AttributionOutlinedIcon from "@mui/icons-material/AttributionOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import GavelSharpIcon from "@mui/icons-material/GavelSharp";

// Other Components
import ClientSideBar from "./ClientSideBar";
import { useTranslations } from "next-intl";

export default function SideBar() {
  const t = useTranslations("Sidebar");

  const sidebarGroups = [
    {
      title: t("General"),
      items: [
        {
          title: t("Dashboard"),
          icon: <DashboardIcon />,
          href: "/dashboard",
          tableName: null,
        },
        {
          title: t("Calendar"),
          icon: <CalendarMonthIcon />,
          href: "/calendar",
          tableName: "Task",
        },
        {
          title: t("Tasks"),
          icon: <AssignmentIcon />,
          href: "/tasks",
          tableName: "Task",
        },
        {
          title: t('catalog-of-services'),
          icon: <LoyaltyIcon />,
          href: "/service",
          tableName: "Service",
        },
        {
          title: t("contract_discount"),
          icon: <GavelSharpIcon />,
          href: "/contract",
          tableName: "Contract",
        },
      ],
    },
    {
      title: t("People"),
      items: [
        {
          title: t("Contacts"),
          icon: <ContactsIcon />,
          href: "/contacts",
          tableName: "Contact",
        },
        {
          title: t("Clients"),
          icon: <PeopleIcon />,
          href: "/clients",
          tableName: "Client",
        },
        {
          title: t("Workers"),
          icon: <EngineeringIcon />,
          href: "/workers",
          tableName: "UserWorker",
        },
        {
          title: "Students",
          icon: <SchoolIcon />,
          href: "/students",
          tableName: "Student",
        },
        {
          title: t("suppliers"),
          icon: <AttributionOutlinedIcon />,
          href: "/suppliers",
          tableName: "Supplier",
        },
      ],
    },
    {
      title: t("Inventory"),
      items: [
        {
          title: t("Stock"),
          icon: <WarehouseIcon />,
          href: "/stock",
          tableName: "Stock",
        },
        {
          title: t("Products"),
          icon: <InventoryIcon />,
          href: "/products",
          tableName: "Product",
        },
        {
          title: t("Biens"),
          icon: <HomeWorkIcon />,
          href: "/biens",
          tableName: "Bien",
        },
      ],
    },
    {
      title: t("Financial"),
      items: [
        {
          title: t("Invoices"),
          icon: <ReceiptIcon />,
          href: "/invoices",
          tableName: "Invoice",
        },
        {
          title: t("Devis"),
          icon: <ReceiptLongIcon />,
          href: "/devis",
          tableName: "Invoice",
        },
        {
          title: t("Amortization"),
          icon: <CurrencyExchangeIcon />,
          href: "/amortization",
          tableName: "Amortization",
        },
        {
          title: t("Tva"),
          icon: <MoneyOffIcon />,
          href: "/tva",
          tableName: "TVA",
        },
      ],
    },
    {
      title: "Other",
      items: [
        {
          title: "Settings",
          icon: <SettingsIcon />,
          href: "/settings",
          tableName: null,
        },
        {
          title: "Profile",
          icon: <AccountCircleIcon />,
          href: "/profile",
          tableName: null,
        },
      ],
    },
  ];

  return <ClientSideBar data={sidebarGroups} />;
}
