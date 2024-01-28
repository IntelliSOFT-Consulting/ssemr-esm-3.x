import React from "react";
import { SWRConfig } from "swr";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeDashboard from "./home-dashboard/home-dashboard.component";

const swrConfiguration = {
  errorRetryCount: 3,
};

const RootComponent: React.FC = () => {
  console.log("Root Component");
  return (
    <main>
      <SWRConfig value={swrConfiguration}>
        <HomeDashboard />
      </SWRConfig>
    </main>
  );
};

export default RootComponent;
