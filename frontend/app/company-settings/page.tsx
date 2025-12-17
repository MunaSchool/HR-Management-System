"use client";
import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function CompanySettingsRedirect() {
  useEffect(() => {
    redirect("/payroll-configuration/company-settings");
  }, []);
  return null;
}

