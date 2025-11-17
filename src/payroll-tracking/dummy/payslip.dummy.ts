// Dummy Payslip Data

export const DummyPayslips = [
  {
    employeeId: "EMP001",
    period: { month: 10, year: 2025 },
    baseSalary: 12000,
    allowances: [
      { label: "Transportation Allowance", amount: 500 },
      { label: "Overtime", amount: 350 },
    ],
    deductions: [
      { label: "Tax", amount: 900 },
      { label: "Insurance", amount: 250 },
    ],
    netSalary: 12000 + 500 + 350 - (900 + 250),
    status: "Generated",
    generatedAt: new Date("2025-10-01"),
  },

  {
    employeeId: "EMP002",
    period: { month: 10, year: 2025 },
    baseSalary: 15000,
    allowances: [{ label: "Housing Allowance", amount: 2000 }],
    deductions: [{ label: "Tax", amount: 1200 }],
    netSalary: 15000 + 2000 - 1200,
    status: "Approved",
    generatedAt: new Date("2025-10-01"),
  },
];