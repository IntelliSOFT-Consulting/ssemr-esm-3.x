import React from "react";
import styles from "./dashboard-card.scss";

type DashboardCardProps = {
  label: string;
  count: number;
  dashboardIcon: React.ReactNode;
  customIconColor?: string;
  customBorderColor?: string;
};

const DashboardCard: React.FC<DashboardCardProps> = ({
  label,
  count,
  dashboardIcon,
  customIconColor,
  customBorderColor,
}) => {
  const iconStyle = customIconColor ? { backgroundColor: customIconColor } : {};
  const cardContainerStyle = customBorderColor
    ? { borderColor: customBorderColor }
    : {};

  return (
    <div
      className={`${styles.dashboardCardContainer} ${styles.customBorder}`}
      style={cardContainerStyle}
    >
      <p className={styles.label}>{label}</p>
      <p className={styles.count}>
        {count}{" "}
        <span className={styles.icon} style={iconStyle}>
          {dashboardIcon}
        </span>
      </p>
    </div>
  );
};

export default DashboardCard;
