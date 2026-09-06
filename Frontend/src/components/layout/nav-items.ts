import FamilyRestroomRoundedIcon from "@mui/icons-material/FamilyRestroomRounded";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";

import type { SvgIconComponent } from "@mui/icons-material";

export interface NavItem {
  href: string;
  icon: SvgIconComponent;
  label: string;
}

export const navItems: NavItem[] = [
  { href: "/children", icon: FamilyRestroomRoundedIcon, label: "Barnen" },
  { href: "/templates", icon: ListAltRoundedIcon, label: "Mallar" }
];

export function isNavItemActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
