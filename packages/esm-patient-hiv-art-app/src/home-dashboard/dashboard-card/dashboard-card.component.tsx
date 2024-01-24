import React from "react";
import styles from "./dashboard-card.scss";

type DashboardCardProps = {
  label: string;
  count: number;
  dashboardIcon: React.ReactNode;
};

const DashboardCard: React.FC<DashboardCardProps> = ({
  label,
  count,
  dashboardIcon,
}) => {
  return (
    <div className={styles.dashboardCardContainer}>
      <p className={styles.label}>{label}</p>
      <p className={styles.count}>
        {count} {dashboardIcon}
      </p>
    </div>
  );
};

export default DashboardCard;
