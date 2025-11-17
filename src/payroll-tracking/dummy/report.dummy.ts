// Dummy Payroll Reports

export const DummyReports = [
  {
    type: "Monthly",
    generatedBy: "Payroll System",
    data: {
      month: 10,
      year: 2025,
      totalEmployees: 4,
      totalPaid: 45000,
      totalDeductions: 3200,
    },
    generatedAt: new Date("2025-10-31"),
  },

  {
    type: "Tax",
    generatedBy: "Finance Department",
    data: {
      totalTaxCollected: 4500,
      employeeBreakdown: [
        { employeeId: "EMP001", tax: 900 },
        { employeeId: "EMP002", tax: 1200 },
        { employeeId: "EMP003", tax: 800 },
      ],
    },
    generatedAt: new Date("2025-10-30"),
  },
];