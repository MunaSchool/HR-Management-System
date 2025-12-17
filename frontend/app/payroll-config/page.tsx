"use client";
import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function PayrollConfigRedirect() {
  useEffect(() => {
    redirect("/payroll-configuration");
  }, []);
  return null;
}

