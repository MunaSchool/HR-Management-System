"use client";

import Link from "next/link";

export default function OrgStructurePage() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Organization Structure</h1>
      <p>Manage departments and positions</p>

      <div style={{ marginTop: 20 }}>
        <Link href="/organization-structure/departments">
          <button style={{ marginRight: 20 }}>View Departments</button>
        </Link>

        <Link href="/organization-structure/positions">
          <button>View Positions</button>
        </Link>
      </div>
    </div>
  );
}
